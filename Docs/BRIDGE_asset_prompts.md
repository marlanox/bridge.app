# BRIDGE — Asset generation prompts

> **Amendment:** visual style changed from flat illustration to **photorealistic
> architectural rendering** (see `BRIDGE_MASTER_SPEC.md` section 2). `hall.png`,
> `living-room.png` and `house-exterior.png` are already provided as photographs/renders in
> this style — use them as the direct visual reference for every remaining asset, in place
> of the flat-illustration prompts originally drafted below.

Format: vertical 9:16.

Final filenames (lowercase, hyphenated, `.png`) — same names used in
`BRIDGE_MASTER_SPEC.md` sections 3 and 6:

- `house-exterior.png` — welcome screen ✅ provided
- `hall.png` ✅ provided
- `living-room.png` ✅ provided
- `study.png`, `kids-room.png`, `kitchen.png`, `basement.png`, `needs-room.png`,
  `bridge.png`, `app-icon.png` — still needed

## Shared style (match the three provided reference photos)

Photorealistic architectural rendering, modern luxury California/coastal villa, panoramic
windows, ocean view, warm golden-hour or soft daylight, muted warm palette (beige, white
stone, wood, soft blue), marble and wood textures, no text, no people.

## Remaining prompts

**study.png** — A modern minimal home office/study with a wooden desk, bookshelf, large
window, calm warm light, photorealistic, matching the villa's interior style.

**kids-room.png** — A soft, warm children's room with muted pastel tones, a small bed, toys
neatly arranged, gentle light, photorealistic, matching the villa's interior style.

**kitchen.png** — A modern minimal kitchen with an island, warm wood cabinets, large
window, morning light, photorealistic, matching the villa's interior style.

**basement.png** — A calm, dim basement lounge room, warm low lighting, soft textures,
cozy but slightly enclosed feeling, photorealistic, matching the villa's interior style.

**needs-room.png** — A cozy reading nook with soft cushions, warm blanket, a cup of tea on
a side table, soft light, photorealistic, matching the villa's interior style.

**bridge.png** — finale. A wooden bridge over calm water leading toward the ocean horizon,
soft golden light, serene and hopeful mood, photorealistic.

**app-icon.png** — A minimal app icon: a simple elegant bridge silhouette over water, warm
beige and soft blue palette, square format, can stay closer to flat/vector for icon
legibility at small sizes.

## Until the remaining assets exist

The app falls back to a plain warm beige background for any room whose image is missing —
see `RoomBackgroundImage.swift`. Drop new `.png` files into
`Bridge/Assets.xcassets/<name>.imageset/` (matching filenames above) and they'll be picked
up automatically; no code changes needed.
