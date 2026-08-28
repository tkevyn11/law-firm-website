// Generates square favicons and the social-sharing image from the existing
// firm logo. Re-run after replacing public/logo.png.
//
// Usage: node scripts/generate-brand-assets.mjs
//
// Everything is derived from public/logo.png — no new brand mark is invented.
// The shield monogram (left of the wordmark gutter) becomes the square icon;
// the full logo is placed on an ivory card for the Open Graph image.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/logo.png";
const OUT_DIR = "public";

// Brand tokens (see DESIGN.md)
const IVORY = "#f8f6f1";
const NAVY = "#1a2238";
const GOLD = "#b8925a";

// Shield monogram bounds inside the 926x314 logo.png. The artwork has a clean
// 21px empty gutter (x 277-297) between the shield and the wordmark, so these
// are the ink bounds left of that gutter. Re-measure if the logo is replaced.
const MONOGRAM = { left: 8, top: 8, width: 269, height: 298 };

const ICON_SIZES = [
  { file: "favicon.png", size: 48 },
  { file: "icon-32.png", size: 32 },
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

function ivoryBackground() {
  return { r: 248, g: 246, b: 241, alpha: 1 };
}

async function buildIcons() {
  // Crop the monogram, then centre it on a square ivory canvas with breathing
  // room so it stays legible at 32px.
  const pad = Math.round(MONOGRAM.height * 0.1);
  const canvas = MONOGRAM.height + pad * 2;

  const monogram = await sharp(SRC).extract(MONOGRAM).png().toBuffer();

  const square = await sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: ivoryBackground(),
    },
  })
    .composite([{ input: monogram, gravity: "center" }])
    .png()
    .toBuffer();

  for (const { file, size } of ICON_SIZES) {
    const out = path.join(OUT_DIR, file);
    await sharp(square)
      .resize(size, size, { fit: "contain", background: ivoryBackground() })
      .png({ compressionLevel: 9 })
      .toFile(out);
    const { size: bytes } = fs.statSync(out);
    console.log(`icon  ${file.padEnd(22)} ${size}x${size}  ${(bytes / 1024).toFixed(1)}KB`);
  }
}

async function buildOgImage() {
  const W = 1200;
  const H = 630;
  const logoWidth = 760;

  const logo = await sharp(SRC)
    .resize({ width: logoWidth, withoutEnlargement: false })
    .png()
    .toBuffer();
  const logoMeta = await sharp(logo).metadata();

  // Frame + gold rule + factual location line. Text is Latin-only so it does
  // not depend on a CJK font being installed; the Chinese firm name is already
  // part of the logo artwork itself.
  const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${IVORY}"/>
  <rect x="26" y="26" width="${W - 52}" height="${H - 52}" fill="none"
        stroke="${NAVY}" stroke-opacity="0.16" stroke-width="2"/>
  <rect x="0" y="0" width="${W}" height="10" fill="${NAVY}"/>
  <rect x="0" y="${H - 10}" width="${W}" height="10" fill="${GOLD}"/>
  <g transform="translate(${W / 2}, 468)">
    <rect x="-130" y="0" width="260" height="1.5" fill="${GOLD}"/>
    <polygon points="0,-6 6,0 0,6 -6,0" fill="${GOLD}"/>
  </g>
  <text x="${W / 2}" y="524" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="30" letter-spacing="3.4" fill="${NAVY}">
    Publika, Mont Kiara &#183; Kuala Lumpur
  </text>
</svg>`);

  const out = path.join(OUT_DIR, "og-image.png");
  await sharp(overlay)
    .composite([
      {
        input: logo,
        left: Math.round((W - logoWidth) / 2),
        top: Math.round(300 - (logoMeta.height ?? 0) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(out);

  const { size: bytes } = fs.statSync(out);
  console.log(`og    og-image.png           ${W}x${H}  ${(bytes / 1024).toFixed(1)}KB`);
}

await buildIcons();
await buildOgImage();
console.log("\nDone.");
