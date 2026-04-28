# PEACHFUZZ Freshies

A vibrant, hand-mold artisan freshie studio website. Built as a Forge Dev.studio showcase / lead-gen template for handmade car-air-freshener brands.

- **Live:** see GitHub Pages settings for the URL after first publish.
- **Stack:** static HTML / CSS / JS. No build step.
- **Imagery:** generated with OpenAI `gpt-image-1` and compressed with `sharp`.

## Local preview

```
npx --yes http-server -p 4173 -c-1 .
```

## Regenerate imagery

```
node scripts/generate_images.js --force
node scripts/optimize_images.js
```

Reads `OPENAI_API_KEY` from `../../.env.shared` (Forge monorepo).
