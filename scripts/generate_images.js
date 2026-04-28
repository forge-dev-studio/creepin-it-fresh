#!/usr/bin/env node
// CREEPIN IT FRESH — pastel-goth, holographic, spooky-cute imagery.
// Generated with OpenAI gpt-image-1 (latest image model).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');
const ASSETS = path.resolve(__dirname, '..', 'assets');

function loadEnv() {
  const envPath = path.join(ROOT, '.env.shared');
  if (!fs.existsSync(envPath)) throw new Error(`.env.shared not found at ${envPath}`);
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error('OPENAI_API_KEY missing');

const PALETTE = `pastel-goth color palette: deep eggplant purple, electric violet, cyan-teal, mint green, hot magenta pink, holographic chrome iridescence, off-black, lavender highlights`;
const VIBE = `pastel-goth, kawaii spooky-cute, hand-poured artisan freshies, glossy resin aroma beads with visible bead texture, slight imperfect handmade feel, bright moody lighting, holographic shimmer, no text, no logos, no watermarks, photographed by a human, real, not 3D rendered`;

const JOBS = [
  {
    out: 'hero/hero-cabin.jpg',
    size: '1536x1024',
    prompt: `Top-down overhead flat-lay editorial photograph on a glossy purple-and-black checkerboard background, scattered with a dozen handmade hand-poured aroma-bead car freshies in spooky-cute shapes — a chubby ghost, a coffin, a bat with rounded wings, a cute skull, a witch's hat, a pumpkin, a cute cartoon eyeball, a crescent moon, a heart with a lightning bolt, a tombstone — each made from glossy resin aroma beads in different pours: lavender, hot magenta, cyan, mint green, deep purple, off-black with iridescent shimmer. Around them: silicone molds in spooky shapes, a brass scoop, small amber glass bottles of fragrance oil with simple kraft labels, a roll of black satin ribbon, scattered loose holographic-coated beads, kraft hang tags. Cool moody purple-cyan lighting from upper-left, holographic shimmer reflections, tiny silver star sparkles. ${PALETTE}. ${VIBE}.`
  },
  {
    out: 'products/p1-amber-pine.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a chubby cartoon ghost with two rounded eye sockets and a wavy bottom, made of pearly white and pale lavender beads with iridescent holographic shimmer, glossy resin texture with visible beads, sitting on a glossy purple-and-black checkerboard tile surface with a black satin ribbon hang loop and a kraft tag, moody cyan side-lighting, tiny silver star sparkles, ${VIBE}.`
  },
  {
    out: 'products/p2-vanilla-leather.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a cartoon coffin with a cross or heart cutout, made of glossy black and hot magenta marbled beads with visible texture and air bubbles, sitting on a deep eggplant velvet surface, black satin ribbon hang loop, kraft tag, electric violet rim lighting, tiny holographic shimmer, ${VIBE}.`
  },
  {
    out: 'products/p3-georgia-peach.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a cute chubby bat with two rounded wings and small fangs, made of deep purple and cyan-teal beads with iridescent holographic accents, glossy resin texture, sitting on a lavender velvet surface, black satin ribbon, kraft hang tag, soft moody side light, tiny silver star sparkles, ${VIBE}.`
  },
  {
    out: 'products/p4-midnight-tobacco.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a cute kawaii sugar skull with rounded eye sockets and a small heart on the forehead, made of pearly white beads with mint green and hot magenta accents, holographic chrome shimmer details, glossy resin texture, sitting on a glossy purple-and-black checkerboard tile surface, black satin ribbon, kraft hang tag, ${VIBE}.`
  },
  {
    out: 'products/p5-citrus-cedar.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a chubby pointy witch's hat with a wide brim and a buckle, made of glossy black beads with mint green and lime accent beads on the brim, iridescent shimmer, sitting on a hot-magenta velvet surface, black satin ribbon, kraft hang tag, soft moody backlight, ${VIBE}.`
  },
  {
    out: 'products/p6-fresh-linen.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a chubby cartoon pumpkin with a cute jack-o-lantern face (triangle eyes and a smile), made from marbled deep purple and hot magenta resin beads with a tiny mint-green stem, glossy texture with visible beads, sitting on a cyan velvet surface, black satin ribbon, kraft hang tag, soft purple rim light, ${VIBE}.`
  },
  {
    out: 'hero/lifestyle-hands.jpg',
    size: '1536x1024',
    prompt: `Documentary editorial photograph of a maker's hands wearing a black canvas apron, with chunky silver rings and black painted nails, gently pressing handfuls of glossy lavender and hot-magenta aroma beads with iridescent holographic shimmer into a silicone bat-shaped mold on a sunlit oak workbench, scattered colorful holographic beads around the mold, small amber glass bottles of fragrance oil with kraft labels in soft focus, a brass scoop, a checked black-and-purple cotton tea towel, dramatic moody window light from the left, ${VIBE}.`
  },
  {
    out: 'hero/lifestyle-car.jpg',
    size: '1024x1536',
    prompt: `Vertical editorial photograph of a chubby ghost-shaped handmade aroma-bead car freshie in pearly white and lavender holographic beads, hanging from the rearview mirror of a clean modern matte-black car interior with subtle purple LED ambient lighting, dusk light through the windshield, slight cyan reflection on the dashboard, moody pastel-goth Y2K aesthetic, ${VIBE}.`
  }
];

async function generate(job, force = false) {
  const dest = path.join(ASSETS, job.out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 50_000) {
    console.log(`skip (exists): ${job.out}`);
    return;
  }
  console.log(`gen: ${job.out} (${job.size})`);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: job.prompt,
      size: job.size,
      quality: 'high',
      n: 1
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI ${res.status}: ${body}`);
  }
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error(`no image returned: ${JSON.stringify(json).slice(0,200)}`);
  fs.writeFileSync(dest, Buffer.from(b64, 'base64'));
  console.log(`  wrote ${dest} (${(fs.statSync(dest).size/1024).toFixed(0)} KB)`);
}

(async () => {
  const force = process.argv.includes('--force');
  for (const job of JOBS) {
    try {
      await generate(job, force);
    } catch (e) {
      console.error(`FAIL ${job.out}: ${e.message}`);
    }
  }
  console.log('done.');
})();
