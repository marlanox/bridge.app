# BRIDGE — Asset generation prompts

> **Amendment:** visual style changed from flat illustration to **photorealistic
> architectural rendering** (see `BRIDGE_MASTER_SPEC.md` section 2). Seven assets are now
> provided as photographs/renders in this style — use them as the direct visual reference
> for every remaining asset, in place of the flat-illustration prompts originally drafted
> below.
>
> **Route change:** there is no separate Needs Room or Garden screen anymore — see
> `BRIDGE_MASTER_SPEC.md`'s route note. `needs-room.png` and `garden.png` are no longer
> needed at all.

Format: vertical 9:16 (app-icon.png is square, 1024×1024).

Final filenames (lowercase, hyphenated, `.png`) — same names used in
`BRIDGE_MASTER_SPEC.md` sections 3 and 6:

- `house-exterior.png` — welcome screen ✅ provided
- `hall.png` ✅ provided
- `living-room.png` ✅ provided
- `study.png` ✅ provided
- `basement.png` ✅ provided
- `bridge.png` — Bridge finale ✅ provided
- `house-map.png` — house map overview screen (new) ✅ provided
- `app-icon.png` ✅ provided
- `kids-room.png`, `kitchen.png`, `ending.png` — still needed

## Shared style (match the provided reference photos)

Photorealistic architectural rendering, modern luxury California/coastal villa, panoramic
windows, ocean view, warm golden-hour or soft daylight, muted warm palette (beige, white
stone, wood, soft blue), marble and wood textures, no text, no people.

## Remaining prompts

**kids-room.png** — A soft, warm children's room with muted pastel tones, a small bed, toys
neatly arranged, gentle light, photorealistic, matching the villa's interior style.

**kitchen.png** — A modern minimal kitchen with an island, warm wood cabinets, large
window, morning light, photorealistic, matching the villa's interior style.

**ending.png** — background for the closing "Today's Mark" screen and the voice-snapshot
screen. Something warm and conclusive — golden-hour light over the villa's ocean view, or
the bridge from a distance at dusk, photorealistic, matching the established style. Until
this exists, both screens fall back to a plain warm beige background.

## Until the remaining assets exist

The app falls back to a plain warm beige background for any room whose image is missing —
see `RoomBackgroundImage.swift`. The house map screen additionally falls back to a plain
numbered list of the seven stops if `house-map.png` is ever removed. Drop new `.png` files
into `Bridge/Assets.xcassets/<name>.imageset/` (matching filenames above) and they'll be
picked up automatically; no code changes needed.
