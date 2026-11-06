// KEPT — generate campaign images with fal.ai (Flux 1.1 Pro Ultra).
// The API key is NOT stored here. In a Claude cloud session it is injected by the network proxy
// (Network secret for host fal.run, header Authorization, prefix "Key"). Locally: FAL_KEY=... node scripts/generate-images.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
const OUT = new URL('../src/assets/img/gen/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const KEY = process.env.FAL_KEY || 'proxy-injected';
const STYLE = 'editorial luxury jewelry photograph, oxidized sterling silver with burnished highlights, not shiny chrome, black background, single soft light, film grain, no text, no logo, no crosses, no skulls, no wings';
const CHAIN = 'a sterling silver necklace that is a very fine delicate 2mm cable chain which abruptly becomes three massive hand-forged hammered oval links 11mm on the left side, exactly at the transition one matte black oval link with a polished silver rim and a tiny 18k gold dot in its centre';
const SHOTS = {
  'hero': `${CHAIN}, worn by a man in a black tailored blazer over a plain white T-shirt, face cropped at the jaw, ${STYLE}`,
  'diamonds': `${CHAIN}, layered with a thin diamond tennis necklace on a woman's bare collarbone, black silk, chiaroscuro, ${STYLE}`,
  'mark': `extreme macro of a single matte black oval chain link with polished silver rim and one tiny 18k gold dot at its centre, between fine silver cable chain and a heavy hammered silver oval link, black velvet, ${STYLE}`,
  'flatlay': `overhead flat lay on black felt, ${CHAIN}, arranged in a teardrop shape, toggle clasp at top, museum lighting, ${STYLE}`,
  'tear': `macro of a small silver oval frame with clear resin holding a piece of white paper with a faint violet tear stain, set into a fine silver chain, black background, ${STYLE}`,
  'voice': `macro of a polished silver oval link engraved with a sound waveform and a tiny gold dot, on a fine silver chain, black background, ${STYLE}`,
  'tee': `${CHAIN}, worn over a heavy white T-shirt by a woman with short hair, cropped at the lips, daylight, ${STYLE}`
};
const only = process.argv.slice(2);
for (const [name, prompt] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  process.stdout.write(`${name}… `);
  const r = await fetch('https://fal.run/fal-ai/flux-pro/v1.1-ultra', {
    method: 'POST', headers: { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspect_ratio: name === 'flatlay' || name === 'mark' ? '1:1' : '4:5', output_format: 'jpeg', sync_mode: true, raw: true, safety_tolerance: '2' })
  });
  if (!r.ok) { console.log('failed', r.status, (await r.text()).slice(0, 200)); continue; }
  const j = await r.json();
  const img = j.images?.[0]?.url;
  const buf = img.startsWith('data:') ? Buffer.from(img.split(',')[1], 'base64') : Buffer.from(await (await fetch(img)).arrayBuffer());
  writeFileSync(new URL(`${name}.jpg`, OUT), buf);
  console.log('saved');
}
