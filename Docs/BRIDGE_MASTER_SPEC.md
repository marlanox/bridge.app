# BRIDGE — Master Specification for Development

This is the complete handoff document. It contains everything needed to build the app:
concept, rules, all card text, screen-by-screen UX, and data structure. It supersedes all
earlier partial drafts and is the single source of truth, alongside `BRIDGE_asset_prompts.md`
for the art.

> **Amendment (visual style, see section 2 and section 6):** the app's visual style changed
> from flat illustration to photorealistic architectural rendering, since real photographic
> reference images were provided directly. This file reflects that amendment.

## 1. Concept

**Name:** Bridge **Tagline:** "We are not enemies. We are two people trying to get back to
each other."

Bridge is a guided conflict-repair experience for couples, used on one shared phone, passed
or turned between partners. It is not a game to win — it's a structured path from conflict
back to connection, walked room by room through a house, ending on a bridge.

Core principle: we are not against each other. We are together against what happened between us.

## 2. Platform & general decisions

- **Platform:** iOS first (App Store)
- **Device:** single phone, shared. No partner names use gender — real first names, entered
  at onboarding, used everywhere in the UI (never "Partner A/B" — that's internal dev
  shorthand only)
- **Interaction model — turn-based full screen, not mirrored halves:** only one partner's
  turn is large and active at a time, filling the whole screen. The waiting partner sees
  only a small rotated (180°) status indicator in their corner (e.g. "listening"). When
  turn passes, the whole screen flips 180° so the new active partner doesn't need to move
  the phone.
- **Color coding:** Partner colors — purple and green (assigned per partner, shown
  consistently on their turn screens, card slots, intensity sliders)
- **Cards — always visible, no swipe-through:** a partner's full deck for the current room
  displays at once as a categorized grid (section headers for subcategories where
  relevant), never a one-at-a-time swipeable stack. Tapping a card places it.
- **Card placement — integrates into the room scene:** when a card is chosen, it visually
  appears placed within the illustrated room background (e.g. on a table), not just added
  to an abstract list.
- **Visual style (amended):** photorealistic architectural rendering — a modern luxury
  villa, panoramic windows, ocean view, warm golden-hour light, marble and wood textures.
  Not flat illustration, not cartoonish. Reference images provided directly (see assets
  folder).
- **Card overlay style (added):** since backgrounds are photorealistic photos, cards and UI
  elements sitting on top of them must use semi-transparent/glass panels (frosted glass
  effect, soft blur, subtle white/beige tint) — not solid flat color blocks — so the UI
  doesn't clash with the photographic background.
- **Language:** English for launch; all UI and card text stored as string resources
  (i18n-ready) for future translation — not hardcoded.
- **Monetization:** first full session free (starter deck). One-time unlock "Full version"
  — $14.99. Additional themed card packs (e.g. "After infidelity", "Long distance") sold
  separately later — not built in v1, just leave room for it structurally.
- **Currency & profiles:** green/red tokens persist for the lifetime of one relationship
  profile. The app supports multiple relationship profiles under one account (e.g., a new
  profile if someone starts a new relationship later) — each with its own separate currency
  and session history.
- **First-session bonus:** even with zero green tokens earned, the couple gets one free gift
  credit on their very first Bridge, so the closing ritual works immediately.

## 3. Onboarding (mandatory, first launch only)

1. Welcome screen — background image: `assets/house-exterior.png`, tagline overlaid, "begin" button
2. What is Bridge — explains: this is for the moment of conflict, not "someday" — even when
   it's hard, even when you don't want to talk, even if you're furious with your partner
   right now, this can help you learn things about each other you never knew, even after
   years together
3. Why the apology ritual matters — explains that "I'm sorry you were hurt" is not
   admission of guilt, it's acknowledgment of the other's pain — and why this small act works
4. How the modes work — explains the icons (one speaks, only listens, discussion allowed,
   silence) and why not interrupting matters
5. Names entry — both partners enter their names
6. Comprehension + agreement — a short summary is shown; each partner in turn taps "I
   understand and agree." The game cannot start until both have confirmed.
7. Couple's Agreement setup — fill in forbidden actions (can be skipped and filled later)

## 4. Game flow

```
WELCOME → HOW IT WORKS (mandatory read+agree) →
NAMES → AGREEMENT → DICE (who speaks first) → OATH →
RITUAL (apology, hands together) → INTENSITY & STATE →
HALL → LIVING ROOM → STUDY → KIDS' ROOM → KITCHEN →
BASEMENT (fears) → NEEDS ROOM → GARDEN → BRIDGE (finale) → SUMMARY
```

## 5. Calm-down step + the oath (before every session)

**Calm-down step (new, before the oath):** if either partner's intensity slider is high, the
app suggests a short breathing pause before continuing — e.g. "Take 5 slow breaths together
before we begin." This is optional to skip, but shown by default whenever intensity is high,
since one partner may be considerably angrier than the other and needs a moment before the
oath can be said honestly.

Then, the oath, spoken aloud by both:

> I promise to be honest. I promise to listen until the end. I won't use what I hear against
> you. Today we're not looking for who's guilty. Today we choose to understand each other.

Then, holding hands, both say together:

> "I'm sorry you were hurt in this." or "I'm sorry that hurt you."

## 6. Room-by-room screens

Each room screen shows: room name + question, timer, mode icon (with a one-line explanation
visible on screen, not hidden in a tooltip), the forbidden-actions line, the active
partner's full card grid (categorized if the deck is large), and the room illustration with
cards visually placed on it as chosen.

**Asset file mapping** (exact filenames — must match `assets/` folder contents, all
lowercase, hyphenated, `.png`):

- Welcome → `house-exterior.png`
- Hall → `hall.png`
- Living room → `living-room.png`
- Study → `study.png`
- Kids' room → `kids-room.png`
- Kitchen → `kitchen.png`
- Basement → `basement.png`
- Needs room → `needs-room.png`
- Bridge (finale) → `bridge.png`
- App icon → `app-icon.png`

**`hall.png`, `living-room.png`, `house-exterior.png` — already provided, photorealistic
style, treat as the visual reference for all remaining assets.**

If an image is missing at build time, fall back to a plain warm beige background for that
screen rather than blocking — images can be dropped in later without breaking the build.

### Timer behavior (soft, never a hard cutoff)

- 1 minute before time's up: a quiet chime/vibration, nothing blocks
- When time's up: a banner appears — "time's up — finish your thought" — with two options:
  "a bit more time" (+2 min, unlimited uses) or "done"
- The room only advances when both partners have tapped "done" — no one is cut off mid-sentence

### 1. Hall — "What happened?"

Time: 7 min · Mode: one speaks, one listens only · Background: `hall.png`
Forbidden: arguing, making excuses, correcting the other's account
Deck: Events

### 2. Living room — "What did I feel?"

Time: 7 min · Mode: 🎤👂 · Decks: Emotions, Body sensations

### 3. Study — "What did it mean to me?"

Time: 7 min · Mode: 🎤👂 · Deck: What I thought (interpretations)

### 4. Kids' room — "What did this touch from my past?"

Time: 7 min · Mode: 🎤👂 · Forbidden: arguing with the other's feelings · Deck: Childhood experiences

### 5. Kitchen — "What would help us avoid this?"

Time: 7 min · Mode: discussion allowed

### 6. Basement — Fears

Time: 10 min · Mode: strict protocol. Each partner may ask up to **15 questions**, each
based on one fear card. The other answers with only one of four responses, then may briefly explain:

- Yes
- No
- Partially
- I understand why it felt that way

Forbidden: arguing with the other's fear, long defensive explanations before answering

### 7. Needs room

Time: 5 min · Deck: Needs & Connection (merged — see below)

### 8. Garden → Bridge (finale)

No time pressure on the final ritual (soft cap ~10 min). Each partner must choose at least:
one "Step toward" card, one "Needs & Connection" card, one gift card. Both walk to the
center, hold hands, say together: "I choose to be on your side of this, not against you."
Each then completes the mandatory final card from the "Step toward" deck aloud.

### Voice snapshot (optional, offered at the Bridge)

Before the final screen, the app offers: "Want to leave a short voice message for each
other? 10 seconds, saved just for the two of you." Each partner can record a brief voice
note (optional, skippable). Explained to the user as: a small keepsake of this moment — not
a recording of the conflict itself, just something warm from the end of it, that you can
listen back to later.

### Closing screen — "Today's Mark" (neutral, not a "we made up" certificate)

Renamed from "repair certificate" to avoid assuming reconciliation happened — the app cannot
know if the couple actually reconciled, only that they showed up and went through the
process. Kept deliberately neutral and encouraging, not gift/token info, not a session stats
recap (no card-by-card summary, no green/red token count shown here — that stays internal to
the profile, not surfaced as a "score").

Content of the screen, screenshot-ready:

- Today's date
- A short line: "You showed up for this today."
- One encouraging line, e.g.: "That's not nothing." or "That took courage."
- A small prompt: "Save this to your gallery — a moment you'll recognize later."

No mention of gifts, no mention of whether the conflict is "resolved," no couple-score.
Just: we did the work today.

## 7. Token economy

🟢 Green tokens — honesty, following the rules, owning your part, sincere apology,
respectful communication, completing a room properly
🔴 Red tokens — breaking the couple's agreement, yelling, insults, manipulation,
interrupting, refusing to listen, using what was heard against the partner

- 1 green cancels 1 red
- Remaining greens convert into currency, spendable on gift cards at the Bridge
- First session: 1 free gift credit regardless of token balance

## 8. Card decks (full text)

**Custom card rule** (applies to every deck below): each deck's grid always includes one
extra tile at the end — "Write your own" — which opens a free-text field. Whatever is typed
becomes a one-off card for that turn (not saved to the shared deck).

See `DeckData.swift` and `Localizable.strings` in the app source for the full transcribed
card text (Events, Emotions, What I Thought, Body Sensations, Childhood Experiences, Fears,
Needs & Connection, Step Toward, Gifts).

## 8b. UI button copy (native-level English, for direct use in build)

Start screen: Begin · Onboarding: Next · Got it · I understand and agree · Names entry:
Continue · Agreement setup: Add a rule · Skip for now · Save agreement · Dice screen: Roll ·
Oath screen: We're ready · Calm-down step: Start breathing · Skip this · Ritual: Hold and
continue · Intensity/state: Continue · Room screen: Write your own · Done · A bit more time
· Next room · Basement (fears): Ask · Yes · No · Partially · I understand why it felt that
way · Explain briefly (optional) · Bridge finale: Choose a step toward · Choose a need ·
Choose a gift · We're on the same side · Voice snapshot: Record a message · Not this time ·
Save · Closing screen: Save to gallery · Close · Paywall: Unlock the full version — $14.99 ·
Maybe later · Profile switcher: Switch relationship · Start a new one

## 9. Couple's Agreement (filled by the pair before first use)

Example forbidden actions:

- We never say "I don't love you"
- We don't threaten to break up
- We don't block each other
- We don't disappear without explanation
- We don't sleep somewhere else out of spite
- We don't flirt with others out of spite
- We don't insult or mock each other's feelings

## 10. Data structure

```
Game session {
  partnerA_name, partnerB_name
  intensity_A (0–10), intensity_B (0–10)
  state_A, state_B (hurt / guilty / both / confused / don't know)
  current_room (1–9)
  green_tokens, red_tokens (shared per relationship profile, persistent)
  currency
  cards_played: [{ room, deck, card_id, played_by, timestamp }]
  bridge_final: { step_toward_card, need_card, gift_card }
}

Relationship profile {
  id, created_at
  green_tokens, red_tokens, currency (persist across all sessions in this profile)
  session_history: [session summaries]
  couples_agreement: [forbidden actions]
}

Deck {
  id, name, cards: [{ id, text_key, category }]
}
```

## 11. Screens list (for build order)

1. Welcome / splash
2. How Bridge works (onboarding, mandatory read+agree)
3. Names entry
4. Couple's Agreement setup
5. Dice / who starts
6. Oath + ritual
7. Intensity & state
8. Universal room screen (reused for Hall, Living room, Study, Kids' room, Kitchen, Needs
   room — same component, different deck/timer/mode/illustration)
9. Basement (fears) — special question/answer protocol
10. Bridge (finale)
11. Voice snapshot (optional) + Closing screen ("Today's Mark" — no stats, no score, no gift recap)
12. Relationship profile switcher (settings)
13. Paywall (after first free session)

**Note for future (not v1):** a separate mode for parent–child conflict repair is planned
later — same room-by-room structure and flow, but the Gifts deck (and some Needs cards)
will differ for that relationship type. Not part of this build; just don't hardcode
"romantic partner" assumptions where avoidable, so this can extend later.

## 12. Build order recommendation

1. Data models + local storage
2. Onboarding flow (2–6)
3. Universal room component (8) — build once, reuse
4. Basement special screen (9)
5. Bridge finale (10) + summary (11)
6. Token/currency logic
7. Relationship profiles (12)
8. Paywall (13)
9. Drop in final art assets from `BRIDGE_asset_prompts.md`
10. Polish, test on real device via TestFlight
