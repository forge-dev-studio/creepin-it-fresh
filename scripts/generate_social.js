#!/usr/bin/env node
// Build the full social-share asset set for CREEPIN IT FRESH:
//   - OG cards: 1200x630 (Facebook/Twitter), 1200x1200 (IG/Pinterest), 1080x1920 (Stories)
//   - Favicons: 16, 32, 180 (apple), 192, 512 (PWA)
//   - manifest.webmanifest
//   - favicon.svg (vector ghost mark)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const SOCIAL = path.join(ASSETS, 'social');
const ICONS = path.join(ASSETS, 'icons');

fs.mkdirSync(SOCIAL, { recursive: true });
fs.mkdirSync(ICONS, { recursive: true });

const HERO = path.join(ASSETS, 'hero', 'hero-cabin.jpg');

/* ---------- favicon.svg (vector ghost) ---------- */
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38e8ff"/>
      <stop offset="50%" stop-color="#c8a8ff"/>
      <stop offset="100%" stop-color="#ff5fb8"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0a0517"/>
  <path d="M32 10c-9 0-16 7-16 16v22c0 3 3 5 6 3l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3c3 2 5 0 5-3V26c0-9-7-16-19-16z" fill="url(#g)"/>
  <circle cx="26" cy="28" r="2.6" fill="#0a0517"/>
  <circle cx="38" cy="28" r="2.6" fill="#0a0517"/>
  <path d="M28 36 Q32 39 36 36" stroke="#0a0517" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;
fs.writeFileSync(path.join(ROOT, 'favicon.svg'), FAVICON_SVG);
fs.writeFileSync(path.join(ICONS, 'favicon.svg'), FAVICON_SVG);

/* ---------- raster favicons ---------- */
const SIZES = [
  { w: 16,  out: 'favicon-16.png' },
  { w: 32,  out: 'favicon-32.png' },
  { w: 180, out: 'apple-touch-icon.png' },
  { w: 192, out: 'icon-192.png' },
  { w: 512, out: 'icon-512.png' },
  { w: 192, out: 'icon-192-maskable.png', pad: 0.18 },
  { w: 512, out: 'icon-512-maskable.png', pad: 0.18 },
];

async function rasterFavicons() {
  for (const s of SIZES) {
    const innerW = Math.round(s.w * (1 - (s.pad || 0) * 2));
    const innerSvg = await sharp(Buffer.from(FAVICON_SVG)).resize(innerW, innerW).png().toBuffer();
    const canvas = sharp({
      create: { width: s.w, height: s.w, channels: 4, background: { r: 10, g: 5, b: 23, alpha: 1 } }
    });
    const out = await canvas.composite([{ input: innerSvg, gravity: 'center' }]).png().toBuffer();
    fs.writeFileSync(path.join(ICONS, s.out), out);
    console.log(`icon: ${s.out} ${s.w}x${s.w}`);
  }
  // copy 32px also as favicon.ico-equivalent (browsers accept .ico-named PNG fallback, but we'll just use favicon.svg)
}

/* ---------- OG card overlay SVG (text + holographic effect) ---------- */
function overlaySvg({ width, height, layout = 'wide' }) {
  // Layouts: 'wide' (1200x630), 'square' (1200x1200), 'tall' (1080x1920)
  const isTall   = layout === 'tall';
  const isSquare = layout === 'square';
  const isWide   = layout === 'wide';

  // Title font sizes by layout
  const t1 = isTall ? 168 : isSquare ? 168 : 130;
  const t2 = isTall ? 56  : isSquare ? 48  : 38;
  const t3 = isTall ? 36  : isSquare ? 30  : 24;
  const padX = isTall ? 96 : isSquare ? 96 : 80;
  const padY = isTall ? 200 : isSquare ? 140 : 80;

  // Title block left-aligned for wide, centered for square/tall
  const align = isWide ? 'start' : 'middle';
  const cx = isWide ? padX : width / 2;
  const titleY = isWide ? height / 2 - 60 : isTall ? height * 0.42 : height * 0.42;

  // Pieces
  const titleLine1 = 'CREEPIN';
  const titleLine2 = 'IT FRESH';
  const tagline = isWide
    ? 'Custom freshies &amp; tumblers • Halloween every day'
    : 'Custom freshies &amp; tumblers';
  const url = 'creepinitfresh.com';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="holo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="#38e8ff"/>
        <stop offset="35%"  stop-color="#66e5b8"/>
        <stop offset="55%"  stop-color="#c8a8ff"/>
        <stop offset="78%"  stop-color="#ff5fb8"/>
        <stop offset="100%" stop-color="#38e8ff"/>
      </linearGradient>
      <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"  stop-color="#0a0517" stop-opacity="${isWide ? 0.85 : 0.55}"/>
        <stop offset="${isWide ? 60 : 100}%" stop-color="#0a0517" stop-opacity="${isWide ? 0.25 : 0.4}"/>
      </linearGradient>
      <linearGradient id="shadeY" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#0a0517" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#0a0517" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#0a0517" stop-opacity="0.85"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#shade)"/>
    <rect width="${width}" height="${height}" fill="url(#shadeY)"/>

    <!-- holographic title -->
    <g font-family="'Bungee', Impact, sans-serif" font-weight="400" letter-spacing="2" filter="url(#glow)">
      <text x="${cx}" y="${titleY}"            text-anchor="${align}" font-size="${t1}" fill="url(#holo)">${titleLine1}</text>
      <text x="${cx}" y="${titleY + t1 * 0.96}" text-anchor="${align}" font-size="${t1}" fill="url(#holo)">${titleLine2}</text>
    </g>

    <!-- tagline -->
    <text x="${cx}" y="${titleY + t1 * 2.12}" text-anchor="${align}"
          font-family="'DM Sans', system-ui, sans-serif" font-weight="500" font-size="${t2}"
          fill="#f4e8ff" letter-spacing="1">${tagline}</text>

    <!-- URL pill -->
    <g transform="translate(${isWide ? padX : width / 2 - 220}, ${height - padY})">
      <rect x="0" y="0" rx="${t3 * 1.4}" ry="${t3 * 1.4}" width="440" height="${t3 * 2.6}"
            fill="none" stroke="#38e8ff" stroke-width="3"/>
      <text x="220" y="${t3 * 1.7}" text-anchor="middle"
            font-family="'Bungee', Impact, sans-serif" font-size="${t3}" letter-spacing="3"
            fill="#38e8ff">${url.toUpperCase()}</text>
    </g>

    <!-- corner sparkles -->
    <g fill="#c8a8ff" opacity="0.85">
      <text x="${width - 80}"  y="100" font-family="'DM Sans', sans-serif" font-size="48">&#10022;</text>
      <text x="${width - 140}" y="160" font-family="'DM Sans', sans-serif" font-size="32" fill="#38e8ff">&#10022;</text>
      <text x="80"  y="${height - 220}" font-family="'DM Sans', sans-serif" font-size="36" fill="#ff5fb8">&#10022;</text>
    </g>
  </svg>`;
}

async function buildCard({ width, height, layout, out, fit = 'cover', position = 'right' }) {
  const heroBuf = await sharp(HERO)
    .resize({ width, height, fit, position })
    .modulate({ saturation: 1.05 })
    .toBuffer();
  const overlay = Buffer.from(overlaySvg({ width, height, layout }));
  const composed = await sharp(heroBuf)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(path.join(SOCIAL, out), composed);
  console.log(`og: ${out} ${width}x${height} (${(composed.length/1024).toFixed(0)} KB)`);
}

/* ---------- manifest ---------- */
const MANIFEST = {
  name: 'Creepin It Fresh',
  short_name: 'Creepin It Fresh',
  description: 'Pastel-goth, spooky-cute custom freshies and tumblers, hand-poured year-round.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#0a0517',
  theme_color: '#0a0517',
  icons: [
    { src: 'assets/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'assets/icons/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: 'assets/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ],
  categories: ['shopping', 'lifestyle']
};
fs.writeFileSync(path.join(ROOT, 'manifest.webmanifest'), JSON.stringify(MANIFEST, null, 2));
console.log('manifest.webmanifest written');

/* ---------- run ---------- */
(async () => {
  await rasterFavicons();
  await buildCard({ width: 1200, height: 630,  layout: 'wide',   out: 'og-1200x630.jpg' });
  await buildCard({ width: 1200, height: 1200, layout: 'square', out: 'og-1200x1200.jpg', position: 'center' });
  await buildCard({ width: 1080, height: 1920, layout: 'tall',   out: 'og-1080x1920.jpg', position: 'top' });
  // small WhatsApp/iMessage prefers <300KB; 1200x630 already meets this. Also produce a 800x418 backup:
  await buildCard({ width: 800,  height: 418,  layout: 'wide',   out: 'og-800x418.jpg' });
  console.log('done.');
})();
