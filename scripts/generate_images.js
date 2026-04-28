#!/usr/bin/env node
// PEACHFUZZ FRESHIES — vibrant, hand-mold, artisan editorial imagery.
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

const PALETTE = `colorful palette: hot peach pink, butter yellow, lime green, bubblegum pink, electric sky blue, raw cream, terracotta accents`;
const VIBE = `vibrant, joyful, hand-crafted, artisan small-batch, slightly rustic, abundant natural light, glossy resin beads, visible mold texture, no text, no logos, no watermarks, photographed by a human in a sunlit garage workshop, real, not 3D rendered`;

const JOBS = [
  {
    out: 'hero/hero-cabin.jpg',
    size: '1536x1024',
    prompt: `Top-down overhead flat-lay editorial photograph of a sunlit oak workbench scattered with a dozen handmade hand-poured aroma-bead car freshies in fun shapes — a peach, a daisy flower, a red cherry, a mushroom with white dots, a soft heart, a five-point star, a butterfly, a rainbow arch, a crescent moon — each made from glossy resin aroma beads in different bright pours: peach pink, butter yellow, lime green, bubblegum pink, electric sky blue, terracotta. Around them: a few silicone molds, a brass scoop, small amber glass bottles of fragrance oil with simple kraft labels, a roll of cotton string, scattered loose beads, kraft hang tags, a checked cotton tea towel in cream and peach. Bright morning sun rakes across the wood from the upper-left. ${PALETTE}. ${VIBE}.`
  },
  {
    out: 'products/p1-amber-pine.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a chunky daisy flower with five rounded petals and a bright center, made of butter-yellow petals and a peach-pink center, glossy resin beads with visible texture and air bubbles, sitting on a soft cream linen surface with a tiny kraft hang tag tied with cotton string, dappled morning light, joyful artisan studio photography, slightly imperfect handmade feel, ${VIBE}.`
  },
  {
    out: 'products/p2-vanilla-leather.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a cute mushroom with a domed cap and short stem, the cap is bubblegum pink with white dots, the stem is cream colored, glossy resin beads with visible bumpy texture, sitting on a powder-blue painted wood surface with a tiny kraft hang tag and cotton string loop, soft sunlight, joyful artisan studio photography, ${VIBE}.`
  },
  {
    out: 'products/p3-georgia-peach.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a plump peach with a small green leaf at the top, peach-pink and warm orange beads marbled together, tiny green beads forming the leaf, glossy resin texture with visible beads and a slight crease down the middle of the peach, sitting on a sun-drenched checked cotton tea towel in cream and peach, kraft hang tag, cotton string, ${VIBE}.`
  },
  {
    out: 'products/p4-midnight-tobacco.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a chubby cartoon cherry pair, two round red cherries connected by a green stem with a tiny leaf, made of glossy hot-red resin beads with a slight gradient to deep cherry, sitting on a butter-yellow painted plywood surface, kraft hang tag, cotton string, dappled sunlight, joyful artisan studio photography, ${VIBE}.`
  },
  {
    out: 'products/p5-citrus-cedar.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a chunky butterfly with two rounded wings and a small body, the upper wings are lime green, the lower wings are electric sky blue, the body is butter yellow, glossy resin beads with visible texture, sitting on a soft pink linen surface, kraft hang tag, cotton string loop, dappled sun, joyful artisan studio photography, ${VIBE}.`
  },
  {
    out: 'products/p6-fresh-linen.jpg',
    size: '1024x1024',
    prompt: `Studio product photograph of a single handmade hand-poured aroma-bead car freshie shaped like a chubby heart with rounded edges, made from marbled bubblegum pink and cream resin beads with visible bead texture and small air bubbles, sitting on a peachy-cream tile surface, kraft hang tag tied with cotton string, soft sunlight, joyful artisan studio photography, ${VIBE}.`
  },
  {
    out: 'hero/lifestyle-hands.jpg',
    size: '1536x1024',
    prompt: `Documentary editorial photograph of a maker's hands wearing a buttery-yellow canvas apron, gently pressing handfuls of glossy peach-pink and butter-yellow aroma beads into a silicone flower-shaped mold on a sunlit oak workbench, scattered colorful beads around the mold, small amber glass bottles of fragrance oil with kraft labels in soft focus, a brass scoop, a checked cream-and-peach cotton tea towel, bright window light, joyful slow-craft artisan documentary photography, ${VIBE}.`
  },
  {
    out: 'hero/lifestyle-car.jpg',
    size: '1024x1536',
    prompt: `Vertical editorial photograph of a chubby peach-shaped handmade aroma-bead car freshie hanging from the rearview mirror of a powder-blue 1967 Volkswagen Beetle interior, cream vinyl seats, sunny summer afternoon light flooding through the windshield, a small bunch of wildflowers in the door pocket, joyful colorful nostalgic Americana aesthetic, ${VIBE}.`
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
