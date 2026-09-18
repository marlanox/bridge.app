# BRIDGE — Asset generation prompts

> **Amendment:** visual style changed from flat illustration to **photorealistic
> architectural rendering** (see `BRIDGE_MASTER_SPEC.md` section 2). All required assets
> are now provided as photographs/renders in this style.
>
> **Route change:** there is no separate Needs Room or Garden screen anymore — see
> `BRIDGE_MASTER_SPEC.md`'s route note. `needs-room.png` and `garden.png` are not used.

Format: vertical 9:16 (app-icon.png is square, 1024×1024).

Final filenames (lowercase, hyphenated, `.png`) — same names used in
`BRIDGE_MASTER_SPEC.md` sections 3 and 6. **All ten are now provided:**

- `house-exterior.png` — welcome screen ✅
- `house-map.png` — house map overview screen ✅
- `hall.png` ✅
- `living-room.png` ✅
- `study.png` ✅
- `kids-room.png` ✅
- `kitchen.png` ✅
- `basement.png` ✅
- `bridge.png` — Bridge finale ✅
- `ending.png` — closing screen / voice snapshot ✅
- `app-icon.png` ✅

## Shared style (for any future/replacement asset)

Photorealistic architectural rendering, modern luxury California/coastal villa, panoramic
windows, ocean view, warm golden-hour or soft daylight, muted warm palette (beige, white
stone, wood, soft blue), marble and wood textures, no text, no people.

## A note on `app-icon.png`

The provided icon is a circular medallion (gold ring, "BRIDGE" wordmark, bridge-at-sunset
photo) centered on a plain white square. iOS applies its own rounded-square mask on top of
whatever fills the 1024×1024 canvas — it does not know about the circle drawn inside. The
practical effect: the white margin around the circle will show as a visible frame in the
Home Screen icon, rather than the artwork running edge-to-edge like most app icons. This
renders and displays fine as-is; if a more conventional edge-to-edge icon look is wanted
later, generate a version where the artwork fills the full square with no inset circle/ring,
same bridge-at-sunset subject and palette.

## If any asset ever needs replacing

The app falls back gracefully rather than blocking the build:

- Any room background missing → plain warm beige background (`RoomBackgroundImage.swift`).
- `house-map.png` missing → plain numbered list of the seven stops.

Drop a new `.png` into `Bridge/Assets.xcassets/<name>.imageset/` (matching a filename
above) and it's picked up automatically — no code changes needed.
