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
- Turn-based full-screen UI: only the active partner's screen is large. Nothing ever
  renders upside down — when a turn passes in a sequential room, the incoming partner sees
  a brief upright "handoff" screen (what the previous partner shared, then a Continue
  button) instead of the phone flipping 180°
  (`Bridge/Views/Common/ActivePartnerContainer.swift`, `Bridge/Views/Session/HandoffView.swift`).
- A small premium type system — serif headings, bold upright tracked-caps buttons, never
  italic — applied consistently app-wide (`Bridge/Views/Common/Font+Bridge.swift`).
- Green/red token economy, folded into the profile at session end
  (`Bridge/ViewModels/TokenManager.swift`).
- Multiple relationship profiles, each with its own tokens/currency/history, persisted as
  JSON in the Documents directory (`Bridge/Persistence/PersistenceManager.swift`).
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
`kitchen.png`, `basement.png`, `bridge.png`, `ending.png` — plus `app-icon.png`, all
generated from the photorealistic reference photos provided. See
`Docs/BRIDGE_asset_prompts.md` for one open item: the provided app icon is a circular
medallion on a white square, so the Home Screen icon will show a visible white margin
around it rather than running edge-to-edge — cosmetic only, easy to swap later if wanted.
`RoomBackgroundImage` still falls back to a plain warm beige background (and the House Map
to a plain numbered list) if any asset is ever removed, so the app never blocks on art.

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

## Not built yet

- Real StoreKit purchase flow for the $14.99 unlock (`PaywallView.unlock()` currently just
  flips a local flag — the call site is isolated so wiring in StoreKit later doesn't touch
  the rest of the app). Restore Purchases is wired but, honestly, has nothing real to
  restore from yet.
- Themed card packs (After infidelity, Long distance, etc.) — intentionally out of scope
  for v1 per the spec.
- Automated tests and a TestFlight build (needs the remaining art assets and a real device
  first, per the spec's own build order).
- Hosting the privacy policy and terms of use at a real URL, and the rest of the App Store
  Connect metadata (age rating, App Privacy answers, support/marketing URLs) — see
  `Docs/APP_STORE_CHECKLIST.md` for the exact, ready-to-use answers.
