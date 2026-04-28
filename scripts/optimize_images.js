#!/usr/bin/env node
// Compress generated jpegs with sharp to keep page-weight reasonable.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(__dirname, '..', 'assets');

const TARGETS = [
  { in: 'hero/hero-cabin.jpg',          width: 1920, quality: 78 },
  { in: 'hero/lifestyle-hands.jpg',     width: 1600, quality: 78 },
  { in: 'hero/lifestyle-car.jpg',       width: 1200, quality: 78 },
  { in: 'products/p1-amber-pine.jpg',   width: 1100, quality: 80 },
  { in: 'products/p2-vanilla-leather.jpg', width: 1100, quality: 80 },
  { in: 'products/p3-georgia-peach.jpg',width: 1100, quality: 80 },
  { in: 'products/p4-midnight-tobacco.jpg', width: 1100, quality: 80 },
  { in: 'products/p5-citrus-cedar.jpg', width: 1100, quality: 80 },
  { in: 'products/p6-fresh-linen.jpg',  width: 1100, quality: 80 }
];

(async () => {
  for (const t of TARGETS) {
    const src = path.join(ASSETS, t.in);
    if (!fs.existsSync(src)) { console.log(`miss: ${t.in}`); continue; }
    const before = fs.statSync(src).size;
    const buf = await sharp(src)
      .resize({ width: t.width, withoutEnlargement: true })
      .jpeg({ quality: t.quality, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(src, buf);
    const after = fs.statSync(src).size;
    console.log(`${t.in}  ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`);
  }
})();
