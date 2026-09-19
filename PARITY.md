# Bridge — Product Parity: Native iOS ↔ PWA

Bridge is **one product with two implementations**:

| | Native iOS (`Bridge/`) | PWA (`pwa/`) |
|---|---|---|
| Purpose | Future App Store / TestFlight release | Real-device testing right now, no Apple Developer account needed |
| Stack | SwiftUI, StoreKit 2, local file + iCloud persistence | Vanilla HTML/CSS/JS, `localStorage`, installable via Safari "Add to Home Screen" |
| Status | Source of truth for architecture decisions | Mirrors iOS at the product level |

Neither is a stub. Both must stay fully functional. **Never delete or degrade one to make the other easier.**

## Where the shared content actually lives

`shared-spec/` is the **canonical, single source of truth for game content** — the
data both implementations are supposed to agree on:

- `shared-spec/strings.en.json`, `shared-spec/strings.ru.json` — every user-facing
  string, generated from `Bridge/Resources/{en,ru}.lproj/Localizable.strings` (435
  keys, 1:1 with the iOS `.strings` files as of this writing).
- `shared-spec/decks.json` — all 9 card decks (214 cards), card IDs and text keys,
  mirroring `Bridge/Data/DeckData.swift`.
- `shared-spec/rooms.json` — the 6 rooms (Hall → Kitchen + Basement): name, question,
  instruction, "why it helps," forbidden actions, deck IDs, timer minutes. Mirrors
  `Bridge/Models/RoomConfig.swift`.
- `shared-spec/flow.json` — the ordered list of screens/steps for one walk through the
  house. Mirrors `Bridge/ViewModels/AppFlowStep.swift` + `SessionViewModel.advance()`.

**The PWA reads these JSON files directly** (copied into `pwa/content/` — see
"Keeping the copy in sync" below). **The native iOS app keeps its own Swift structs
and `.strings` files** — it is *not* refactored to read JSON at runtime, per the rule
against forcing iOS to change shape just to make the PWA easier to build. Instead,
`shared-spec/` is treated as the reference: whenever content changes, it changes in
the Swift/`.strings` files *and* in `shared-spec/`, by hand, and this doc is how you
know both were touched.

### Keeping the copy in sync

`pwa/content/*.json` is a **deployed copy** of `shared-spec/*.json` (the PWA is a
static site with no build step, so it needs the files physically inside `pwa/`).
After editing anything in `shared-spec/`, run:

```
bash scripts/sync-shared-spec.sh
```

This just copies `shared-spec/*.json` → `pwa/content/*.json`. It's mechanical and
safe to run anytime; treat a diff between the two directories as a bug.

### Regenerating `shared-spec/strings.*.json` from the iOS `.strings` files

If you edit `Bridge/Resources/{en,ru}.lproj/Localizable.strings` directly (as normal
iOS work), re-run the extraction so the PWA picks up the change:

```
python3 scripts/strings_to_json.py
bash scripts/sync-shared-spec.sh
```

## What is genuinely platform-specific (by design, not oversight)

| Behavior | iOS | PWA |
|---|---|---|
| In-app purchase | Real StoreKit 2, $14.99 one-time unlock | **Mocked.** A "Unlock (test mode)" button in the PWA's paywall sets the local unlock flag directly — there is no real payment processor for a web app outside the App Store. Clearly labeled as test-only in the UI. |
| Persistence | Local JSON file + iCloud mirror (survives reinstall) | `localStorage` only (survives reload/backgrounding, but is lost if Safari's site data is cleared, and never syncs across devices) |
| Voice snapshot | Recorded to a file, mirrored to iCloud | Recorded in-memory via `MediaRecorder` for the current tab session only — not persisted across a reload. This is a real gap or a real gap, not a bug: browsers give a PWA no durable, syncable file storage comparable to iCloud. |
| Haptics / system sound | `FeedbackSounds` (haptic + system sound) | Web Vibration API where available (Safari on iOS does not support it from a home-screen PWA as of this writing) + a couple of short generated tones via Web Audio. Silently degrades to visual-only feedback if unsupported — never a crash. |
| Save-to-Photos (Closing screen) | `UIImageWriteToSavedPhotosAlbum` | Renders the same card to a `<canvas>` and offers it as a downloadable image (iOS Safari's share sheet lets the user save it to Photos from there) |

None of these are silent — each is called out in the PWA UI itself (e.g. "(test
mode)" on the paywall) so a tester never mistakes a platform limitation for a bug.

## Workflow going forward

1. A change request defaults to a **shared product change** unless explicitly scoped
   "PWA only" or "iOS only."
2. Shared changes touch: the relevant Swift view(s) **and** the relevant `shared-spec/`
   JSON **and** `pwa/js/*.js` where the interaction itself (not just content) changed,
   **and** re-run `scripts/sync-shared-spec.sh`.
3. After a shared change, both implementations get tested for the affected behavior
   before it's reported done.
4. If a request can't be mirrored exactly for a platform reason, that's called out
   explicitly (see the table above for the pattern), never silently diverged.

## Screen inventory (both implementations must cover all of these)

Language picker → Welcome → What is Bridge → Apology → Disclaimer → House Map →
Names → Comprehension Agreement → Dice → Intensity & State → Calm Down (conditional,
intensity ≥ 7) → Oath → Ritual (Hold Hands) → Hall → Living Room → Study → Kids' Room
→ Kitchen → Basement → Bridge Finale → Couple's Agreement → Voice Snapshot → Closing
("Today's Mark"). Settings (gear icon, Welcome screen only) → Relationships/profile
switcher, View the Path (House Map), Disclaimer, Crisis Resources, Language, Privacy
Policy, Terms of Use, Restore Purchases, Delete Data. Paywall (after the first free
session).
