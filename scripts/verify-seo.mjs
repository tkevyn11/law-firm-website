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

/** Extracts every absolute URL from the page's JSON-LD graph. */
function jsonLdUrls(html) {
  const match = html.match(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/
  );
  if (!match) return null;
  const decoded = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'");
  let graph;
  try {
    graph = JSON.parse(decoded);
  } catch {
    return "invalid";
  }
  const urls = JSON.stringify(graph).match(/https?:\/\/[^"]+/g) || [];
  // schema.org is the vocabulary namespace, not a site URL.
  return [...new Set(urls)].filter((u) => !u.startsWith("https://schema.org"));
}

if (!fs.existsSync(APP_DIR)) {
  console.error(`${APP_DIR} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const files = walk(APP_DIR).sort();
const problems = [];

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

  console.log(rel + (skipCanonical ? "  (canonical not expected)" : ""));
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

    const ld = jsonLdUrls(html);
    if (ld === null) {
      problems.push(`${rel}: no JSON-LD block`);
      console.log("  json-ld        : (none)");
    } else if (ld === "invalid") {
      problems.push(`${rel}: JSON-LD is not valid JSON`);
      console.log("  json-ld        : INVALID JSON");
    } else {
      const offenders = ld.filter((u) => !u.startsWith(EXPECTED_ORIGIN));
      console.log(
        `  json-ld        : ${ld.length} URLs, ${offenders.length} off-domain`
      );
      for (const u of offenders)
        problems.push(`${rel}: JSON-LD URL not on ${EXPECTED_ORIGIN}: ${u}`);
    }
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
