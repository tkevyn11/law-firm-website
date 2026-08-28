// Post-build SEO verification.
//
// Inspects the prerendered HTML plus the generated robots.txt / sitemap.xml for
// canonical, hreflang and Open Graph correctness, and fails if any
// non-production domain leaks into an SEO-facing tag.
//
// Usage: npm run build && node scripts/verify-seo.mjs
import fs from "node:fs";
import path from "node:path";

const EXPECTED_ORIGIN = "https://www.tkalegal.my";
const BAD_DOMAIN =
  /law-firm-website-one-pied\.vercel\.app|tankong\.my|localhost|127\.0\.0\.1/;

const APP_DIR = path.join(".next", "server", "app");

// Routes with no canonical by design: the 404 page and the "/" redirect stub.
const NO_CANONICAL = new Set(["_not-found.html", "index.html"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}

function meta(html, property) {
  const re = new RegExp(`property="${property}" content="([^"]*)"`);
  return (html.match(re) || [])[1];
}

function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'");
}

/** Parses every JSON-LD block on the page. Returns "invalid" if any fails. */
function jsonLdBlocks(html) {
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    ),
  ];
  if (blocks.length === 0) return null;
  const parsed = [];
  for (const b of blocks) {
    try {
      parsed.push(JSON.parse(decodeEntities(b[1])));
    } catch {
      return "invalid";
    }
  }
  return parsed;
}

/** Flattens @graph containers into a single list of schema.org nodes. */
function ldNodes(blocks) {
  const nodes = [];
  for (const block of blocks) {
    if (Array.isArray(block["@graph"])) nodes.push(...block["@graph"]);
    else nodes.push(block);
  }
  return nodes;
}

function ldUrls(blocks) {
  const urls = JSON.stringify(blocks).match(/https?:\/\/[^"]+/g) || [];
  // schema.org is the vocabulary namespace, not a site URL.
  return [...new Set(urls)].filter((u) => !u.startsWith("https://schema.org"));
}

function nodeTypes(node) {
  const t = node["@type"];
  return Array.isArray(t) ? t : [t];
}

if (!fs.existsSync(APP_DIR)) {
  console.error(`${APP_DIR} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const files = walk(APP_DIR).sort();
const problems = [];
// Title / description uniqueness is tracked per locale: EN and ZH pages are
// separate documents, so the same slug in two languages is not a duplicate.
const seenTitles = new Map();
const seenDescriptions = new Map();

console.log("=== Canonical / hreflang / Open Graph per prerendered page ===\n");

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(APP_DIR, file).split(path.sep).join("/");
  const skipCanonical = NO_CANONICAL.has(rel);

  const canonical =
    (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || "";
  const alternates = [
    ...html.matchAll(
      /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/gi
    ),
  ].map((m) => ({ lang: m[1], href: m[2] }));

  const ogUrl = meta(html, "og:url");
  const ogTitle = meta(html, "og:title");
  const ogDescription = meta(html, "og:description");
  const ogLocale = meta(html, "og:locale");
  const docTitle = decodeEntities(
    (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ""
  );
  const metaDescription = decodeEntities(
    (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ""
  );
  const htmlLang = (html.match(/<html[^>]*lang="([^"]+)"/) || [])[1];

  console.log(rel + (skipCanonical ? "  (canonical not expected)" : ""));
  console.log(`  title          : ${docTitle || "(none)"} [${docTitle.length}]`);
  console.log(
    `  description    : ${metaDescription || "(none)"} [${metaDescription.length}]`
  );
  console.log(`  html lang      : ${htmlLang || "(none)"}`);
  console.log(`  canonical      : ${canonical || "(none)"}`);
  for (const a of alternates) console.log(`  hreflang ${a.lang.padEnd(9)}: ${a.href}`);
  console.log(`  og:url         : ${ogUrl || "(none)"}`);
  console.log(`  og:locale      : ${ogLocale || "(none)"}`);
  console.log(`  og:title       : ${ogTitle ? "present" : "(none)"}`);
  console.log(`  og:description : ${ogDescription ? "present" : "(none)"}`);

  const urls = [canonical, ogUrl, ...alternates.map((a) => a.href)].filter(
    Boolean
  );
  for (const u of urls) {
    if (BAD_DOMAIN.test(u)) problems.push(`${rel}: non-production domain in ${u}`);
    else if (!u.startsWith(EXPECTED_ORIGIN))
      problems.push(`${rel}: ${u} is not on ${EXPECTED_ORIGIN}`);
  }

  if (!skipCanonical) {
    if (!canonical) problems.push(`${rel}: missing canonical`);

    // Unique, present, and sensibly sized title + meta description.
    const localeKey = rel.startsWith("zh") ? "zh" : "en";
    if (!docTitle) problems.push(`${rel}: missing <title>`);
    else {
      const key = `${localeKey}::${docTitle}`;
      if (seenTitles.has(key))
        problems.push(`${rel}: duplicate title, also on ${seenTitles.get(key)}`);
      else seenTitles.set(key, rel);
      if (docTitle.length > 70)
        problems.push(`${rel}: title is ${docTitle.length} chars (>70)`);
    }
    if (!metaDescription) problems.push(`${rel}: missing meta description`);
    else {
      const key = `${localeKey}::${metaDescription}`;
      if (seenDescriptions.has(key))
        problems.push(
          `${rel}: duplicate description, also on ${seenDescriptions.get(key)}`
        );
      else seenDescriptions.set(key, rel);
      // CJK conveys more per character, so the floor is lower for zh.
      const min = localeKey === "zh" ? 40 : 70;
      if (metaDescription.length < min)
        problems.push(
          `${rel}: description only ${metaDescription.length} chars (<${min})`
        );
      if (metaDescription.length > 200)
        problems.push(`${rel}: description ${metaDescription.length} chars (>200)`);
    }
    const expectedLang = localeKey === "zh" ? "zh-MY" : "en-MY";
    if (htmlLang !== expectedLang)
      problems.push(`${rel}: html lang is "${htmlLang}", expected "${expectedLang}"`);
    if (/<meta name="robots" content="[^"]*noindex/.test(html))
      problems.push(`${rel}: page is noindex`);
    if (alternates.length !== 3)
      problems.push(`${rel}: expected 3 hreflang links, found ${alternates.length}`);
    for (const want of ["en-MY", "zh-MY", "x-default"]) {
      if (!alternates.some((a) => a.lang.toLowerCase() === want.toLowerCase()))
        problems.push(`${rel}: missing hreflang ${want}`);
    }
    // Each language must canonicalise to itself, never across languages.
    const selfLang = rel.startsWith("zh") ? "zh-MY" : "en-MY";
    const selfAlt = alternates.find(
      (a) => a.lang.toLowerCase() === selfLang.toLowerCase()
    );
    if (selfAlt && selfAlt.href !== canonical)
      problems.push(
        `${rel}: canonical ${canonical} does not match its own ${selfLang} alternate ${selfAlt.href}`
      );
    if (ogUrl && ogUrl !== canonical)
      problems.push(`${rel}: og:url ${ogUrl} does not match canonical ${canonical}`);
    if (!ogTitle) problems.push(`${rel}: missing og:title`);
    if (!ogDescription) problems.push(`${rel}: missing og:description`);

    const blocks = jsonLdBlocks(html);
    if (blocks === null) {
      problems.push(`${rel}: no JSON-LD block`);
      console.log("  json-ld        : (none)");
    } else if (blocks === "invalid") {
      problems.push(`${rel}: JSON-LD is not valid JSON`);
      console.log("  json-ld        : INVALID JSON");
    } else {
      const urls = ldUrls(blocks);
      const offenders = urls.filter((u) => !u.startsWith(EXPECTED_ORIGIN));
      const nodes = ldNodes(blocks);
      const types = nodes.flatMap(nodeTypes);
      console.log(
        `  json-ld        : ${urls.length} URLs, ${offenders.length} off-domain, types: ${[
          ...new Set(types),
        ].join("/")}`
      );
      for (const u of offenders)
        problems.push(`${rel}: JSON-LD URL not on ${EXPECTED_ORIGIN}: ${u}`);

      const isHome = rel === "en.html" || rel === "zh.html";

      // Inner pages need a real hierarchy (Home → page). Home itself is not
      // required to carry BreadcrumbList — a single Home crumb is not useful.
      const crumb = nodes.find((n) => nodeTypes(n).includes("BreadcrumbList"));
      if (!isHome && !crumb) {
        problems.push(`${rel}: missing BreadcrumbList`);
      } else if (crumb) {
        const items = crumb.itemListElement ?? [];
        if (!isHome && items.length < 2)
          problems.push(`${rel}: BreadcrumbList has ${items.length} item(s)`);
        items.forEach((it, i) => {
          if (it.position !== i + 1)
            problems.push(`${rel}: breadcrumb position ${it.position} out of order`);
          if (!it.name) problems.push(`${rel}: breadcrumb item ${i + 1} has no name`);
          if (!it.item || !String(it.item).startsWith(EXPECTED_ORIGIN))
            problems.push(`${rel}: breadcrumb item ${i + 1} URL invalid: ${it.item}`);
        });
        // Last crumb must be the page itself.
        const last = items[items.length - 1];
        if (last && last.item !== canonical)
          problems.push(
            `${rel}: last breadcrumb ${last.item} != canonical ${canonical}`
          );
        console.log(
          `  breadcrumb     : ${items.map((i) => i.name).join(" > ")}`
        );
      }
      if (!types.includes("WebPage")) problems.push(`${rel}: missing WebPage node`);

      // FAQPage belongs on the home page only, not duplicated site-wide.
      const hasFaq = types.includes("FAQPage");
      if (hasFaq && !isHome)
        problems.push(`${rel}: FAQPage should only appear on the home page`);
      if (!hasFaq && isHome) problems.push(`${rel}: home page missing FAQPage`);
    }

    // Social + icon assets must be the dedicated square/1200x630 files.
    const ogImage = meta(html, "og:image");
    if (ogImage && !ogImage.includes("/og-image.png"))
      problems.push(`${rel}: og:image is not the dedicated card: ${ogImage}`);
    if (!ogImage) problems.push(`${rel}: missing og:image`);
    if (/rel="icon"[^>]*href="\/favicon\.png"[^>]*sizes="926x314"/.test(html))
      problems.push(`${rel}: favicon still non-square`);
  }

  console.log("");
}

console.log("=== Generated robots.txt / sitemap.xml ===\n");

for (const name of ["robots.txt.body", "sitemap.xml.body"]) {
  const file = path.join(APP_DIR, name);
  if (!fs.existsSync(file)) {
    problems.push(`${name} was not generated`);
    continue;
  }
  const body = fs.readFileSync(file, "utf8");
  if (BAD_DOMAIN.test(body)) problems.push(`${name}: contains a non-production domain`);

  if (name.startsWith("sitemap")) {
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);
    console.log(`sitemap.xml: ${locs.length} URLs, ${dupes.length} duplicates`);
    if (dupes.length) problems.push(`sitemap.xml: duplicate <loc> ${dupes.join(", ")}`);
    for (const l of locs) {
      if (!l.startsWith(EXPECTED_ORIGIN))
        problems.push(`sitemap.xml: ${l} is not on ${EXPECTED_ORIGIN}`);
    }
  } else {
    console.log("robots.txt:");
    console.log(
      body
        .trim()
        .split("\n")
        .map((l) => "  " + l)
        .join("\n")
    );
    if (!body.includes(`${EXPECTED_ORIGIN}/sitemap.xml`))
      problems.push("robots.txt: sitemap URL missing or wrong");
    if (/Disallow:\s*\/(en|zh)/.test(body))
      problems.push("robots.txt: blocks /en or /zh");
  }
  console.log("");
}

console.log(`Pages checked : ${files.length}`);
console.log(`Problems      : ${problems.length}`);
for (const p of problems) console.log(`  - ${p}`);

process.exit(problems.length === 0 ? 0 : 1);
