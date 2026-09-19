# Bridge

A guided conflict-repair experience for couples, built from `Docs/BRIDGE_MASTER_SPEC.md`
and `Docs/BRIDGE_asset_prompts.md`. Native iOS, SwiftUI, iOS 17+.

## Opening the project (on a Mac, with Xcode)

This repo ships Swift source and an [XcodeGen](https://github.com/yonaskolb/XcodeGen)
`project.yml` instead of a checked-in `.xcodeproj`, so the project file always matches the
file tree on disk.

```bash
brew install xcodegen
cd bridge.app
xcodegen generate
open Bridge.xcodeproj
```

Then build and run on an iOS 17+ simulator or device (⌘R). No third-party Swift packages
are required.

## What's implemented

- Full flow from a language picker through onboarding (including the wellness disclaimer
  and the House Map overview), dice, calm-down, oath, ritual, all six universal rooms,
  Basement's Q&A protocol, the Bridge finale, voice snapshot, and the closing screen
  ("Today's Mark") — see `Bridge/App/SessionFlowView.swift`. The route is 7 rooms (Hall,
  Living Room, Study, Kids' Room, Kitchen, Basement, Bridge) — there is no separate Needs
  Room or Garden; those cards are chosen at the Bridge finale itself, shown as three
  simultaneous decks with an explicit "choose one from each" prompt.
- All 9 card decks transcribed verbatim from the spec (`Bridge/Data/DeckData.swift`),
  ~215 cards, every deck's grid ending in a "Write your own" free-text tile.
- **Fully bilingual (English/Russian)**, natively translated — not machine-translated
  filler. The app ships its own language chooser at first launch, independent of the
  device's system language, changeable anytime from Settings. `L()`/`LF()`
  (`Bridge/ViewModels/LocalizationManager.swift`) replace the standard
  `LocalizedStringKey`/`NSLocalizedString` app-wide so the in-app choice — not the device
  locale — decides which `.lproj` bundle strings load from.
- Turn-based, physically-flipping UI: the room's interior and controls rotate 180° to
  face whoever is currently answering, since the two partners sit facing each other with
  the phone between them. Critically, the room only ever flips when it becomes someone's
  turn to *answer* — never while they're only reading. When a partner finishes, a reveal
  card appears on top of the (still unrotated) room, rotated to face the reader, showing
  exactly what was shared; only once they tap "I've read it" does the room actually flip
  (`Bridge/Views/Common/ActivePartnerContainer.swift`,
  `Bridge/Views/Session/RevealCardOverlay.swift`, `SessionViewModel.confirmReveal()`).
- A small premium type system — serif headings, bold upright tracked-caps buttons, never
  italic — applied consistently app-wide (`Bridge/Views/Common/Font+Bridge.swift`).
- Green/red token economy, folded into the profile at session end
  (`Bridge/ViewModels/TokenManager.swift`).
- Multiple relationship profiles, each with its own tokens/currency/history, persisted as
  JSON in the Documents directory (`Bridge/Persistence/PersistenceManager.swift`). Every save
  (and every voice note) is also mirrored best-effort into the app's iCloud ubiquity
  container in the background, and a fresh install/new phone with no local data yet is
  offered a restore from that mirror at launch — so losing or replacing the phone doesn't
  lose session progress. Local storage stays authoritative and synchronous exactly as
  before; iCloud is purely additive and no-ops cleanly when unavailable (see "iCloud sync"
  below).
- Paywall gate after the first free session; profile switcher.
- Voice snapshot record/playback (AVFoundation) and "save to gallery" for the closing card
  (rendered to an image and written to Photos).
- App Store compliance (see `Docs/APP_STORE_CHECKLIST.md` for the full picture): wellness
  disclaimer + crisis resources, in-app Privacy Policy/Terms of Use (also natively
  bilingual), in-app data deletion, Restore Purchases button, and system-sound/haptic
  feedback only — all reachable from a Settings hub
  (`Bridge/Views/Settings/SettingsView.swift`, opened from the gear icon on Welcome).

## Visual assets

All ten backgrounds are in `Bridge/Assets.xcassets/` — `house-exterior.png`,
`house-map.png`, `hall.png`, `living-room.png`, `study.png`, `kids-room.png`,
`kitchen.png`, `basement.png`, `bridge.png`, `ending.png` — generated from the
photorealistic reference photos provided. The app icon (`app-icon.png`) is instead a
programmatically rendered vector mark (warm sunset gradient, an arch bridge silhouette
with its water reflection) — edge-to-edge, no AI image generation was available in this
session to produce a photorealistic one, so this is a deliberately bold, simple "logo"
style icon instead. `RoomBackgroundImage` still falls back to a plain warm beige
background (and the House Map to a plain numbered list) if any asset is ever removed, so
the app never blocks on art.

## Judgment calls worth knowing about

The two source spec documents disagree in a couple of small, unavoidable places. Each is
called out with a code comment at the point of the decision:

- **Intensity & State timing.** Section 4's flow diagram places "Intensity & State" after
  the ritual, but section 5's calm-down step needs an intensity reading *before* the oath.
  This build asks for intensity + state right after the dice roll, before calm-down/oath/
  ritual, so the calm-down gate actually has data to gate on
  (`Bridge/ViewModels/AppFlowStep.swift`).
- **Token triggers.** The spec defines what green/red tokens mean but not what UI event
  fires them. A silent phone can't detect yelling or interrupting, so tokens are awarded
  automatically for procedural milestones (oath, ritual, each room, Basement, Bridge) and
  red tokens are self-reported via a small flag control during a room
  (`Bridge/ViewModels/TokenManager.swift`).
- **Kitchen's deck.** The spec's room list doesn't assign Kitchen ("What would help us
  avoid this?") a deck. It uses the "Step Toward" deck, since those cards are literally
  about what would help avoid future conflict (`Bridge/Models/RoomConfig.swift`).
- **Fears deck duplicates.** The source text lists two fear cards twice, verbatim. They're
  collapsed to one each (44 unique cards, matching the spec's own "~45 cards" estimate)
  rather than showing two identical tiles.

## Purchases (StoreKit 2)

`Bridge/ViewModels/StoreManager.swift` is a real purchase flow — `Product`/`Transaction`,
verified transactions, a transaction-update listener, Restore Purchases, and an
entitlement check at every launch (so a reinstall restores automatically). It points at a
placeholder product identifier, `StoreProductID.fullVersion` = `"com.bridge.app.fullversion"`,
since no App Store Connect account/ID was available in this session. To go live: create a
Non-Consumable In-App Purchase in App Store Connect with that same identifier (or update
the constant to match), at the $14.99 tier — nothing else needs to change. Until then,
`Bridge/Bridge.storekit` (a local StoreKit Testing configuration) makes the entire
purchase/restore flow work in Xcode's simulator today — select it once via Product ▸
Scheme ▸ Edit Scheme ▸ Run ▸ Options ▸ StoreKit Configuration.

## iCloud sync

`Bridge/Persistence/PersistenceManager.swift` mirrors the profiles JSON and every voice note
into the app's iCloud ubiquity container on a background queue after each local save, and
restores from that mirror on a fresh install/new phone that has no local data yet
(`fetchFromiCloud`, wired up in `AppState.init()` and gated on `hasLocalProfilesFile` checked
before that launch's first save). It never touches a device that already has local data, and
it degrades to exactly today's local-only behavior if
iCloud isn't available (no iCloud account, iCloud Drive off, or the capability not
provisioned) — nothing about the app depends on it working.

The container identifier is declared in `project.yml` (`iCloud.com.bridge.app.ios`) and
XcodeGen generates `Bridge/Bridge.entitlements` from it. Two manual steps remain, both only
possible from an Apple Developer account, so they couldn't be done in this session:

1. In Xcode, select the Bridge target → Signing & Capabilities → **+ Capability** → **iCloud**
   → check **iCloud Documents**. Xcode will provision the container automatically the first
   time you do this with a real Apple Developer team selected.
2. If/when you change `PRODUCT_BUNDLE_IDENTIFIER` away from the placeholder
   `com.bridge.app.ios` (see "Not built yet" below), update the `iCloud.com.bridge.app.ios`
   identifiers in `project.yml`'s `entitlements` block to match, then re-run
   `xcodegen generate`.

Until both are done, the app still builds and runs exactly as before — the mirror/restore
calls simply no-op every time, same as running on a device signed out of iCloud.

## Not built yet

- Themed card packs (After infidelity, Long distance, etc.) — intentionally out of scope
  for v1 per the spec.
- Automated tests and a TestFlight build (needs a real device / Apple Developer account,
  per the spec's own build order).
- Hosting the privacy policy and terms of use at a real URL, and the rest of the App Store
  Connect metadata (age rating, App Privacy answers, support/marketing URLs) — see
  `Docs/APP_STORE_CHECKLIST.md` for the exact, ready-to-use answers.
