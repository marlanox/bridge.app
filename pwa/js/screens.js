import { L, LF, deck, room, getLanguage } from "./content.js";
import { isMusicEnabled, isSoundEnabled } from "./sounds.js";
import {
  primaryButton, secondaryButton, escHtml, escAttr,
  bScreen, bTopbar, bStar, bCta, bCard, bCheck, bProgress, bScale, bScaleHeader, zoneOf,
  bLink, bMore, bRuleBar, bChipGrid, bChoice, bFooter, bSteps,
  bRec, bPaper, bCardGrid,
} from "./components.js";

// Full walk order, including the two non-"room" stops (basement, bridge) — used by
// the house-map screens (DESIGN.md §1/§7) to compute pin status and pick the next
// destination's name/photo.
const MAP_PINS = [
  { kind: "hall", nameKey: "room.hall.name", enterKey: "map.enter_room.hall", x: 18.6, y: 8.4 },
  { kind: "livingRoom", nameKey: "room.living_room.name", enterKey: "map.enter_room.living_room", x: 62.7, y: 15.3 },
  { kind: "study", nameKey: "room.study.name", enterKey: "map.enter_room.study", x: 28.7, y: 29.3 },
  { kind: "kidsRoom", nameKey: "room.kids_room.name", enterKey: "map.enter_room.kids_room", x: 70.7, y: 30.7 },
  { kind: "kitchen", nameKey: "room.kitchen.name", enterKey: "map.enter_room.kitchen", x: 43, y: 43.4 },
  { kind: "basement", nameKey: "room.basement.name", enterKey: "map.enter_room.basement", x: 47.1, y: 59.1 },
  { kind: "bridge", nameKey: "bridge.title", enterKey: "map.enter_bridge", x: 47.1, y: 83.9 },
];

const STATE_KEYS = ["hurt", "angry", "scared", "guilty", "ashamed", "sad", "confused"];

// =========================================================== Splash
// The very first thing shown on a cold launch — a couple of seconds on a solid-color
// mark before the language picker, matching a native app's launch screen. Deliberately
// NOT a photoScreen: the background is a single flat fill (no photo, no seam), and the
// mark itself is vector line-art so it stays crisp at any resolution.
const SPLASH_MARK_SVG = `<svg viewBox="0 0 240 130" width="150" height="81" aria-hidden="true">
    <path d="M14 104 H88 C88 104 96 46 120 46 C144 46 152 104 152 104 H226"
      fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M97 104 C97 104 101 74 120 74 C139 74 143 104 143 104"
      fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M97 104 V84 M143 104 V84" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M120 8 L123.4 17.6 L133 21 L123.4 24.4 L120 34 L116.6 24.4 L107 21 L116.6 17.6 Z" fill="var(--gold)"/>
  </svg>`;
export function splashScreen() {
  return `<div class="screen splash-screen">
      <div class="splash-mark">${SPLASH_MARK_SVG}</div>
      <div class="splash-word">BRIDGE</div>
    </div>`;
}

// =========================================================== Language picker
export function languageScreen() {
  return bScreen({
    photo: "house-exterior", muted: true, shade: "top",
    contentStyle: "align-items:center;justify-content:center;text-align:center;padding:24px;",
    inner: `
      <div class="b-spacer"></div>
      ${bStar()}
      <h1 class="b-display">Bridge</h1>
      <p class="b-lead" style="margin-top:10px;">Choose your language / Выберите язык</p>
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:320px;margin-top:28px;">
        ${bCta({ text: "English", action: "setLanguage", arg: "en" })}
        ${bCta({ text: "Русский", action: "setLanguage", arg: "ru", ghost: true })}
      </div>
      <div class="b-spacer"></div>
    `,
  });
}

// =========================================================== Welcome
export function welcomeScreen() {
  return bScreen({
    photo: "bridge", muted: true, shade: "top",
    contentStyle: "padding:54px 24px 34px;",
    inner: `
      ${bTopbar({ back: false })}
      <div class="b-spacer"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;">
        ${bStar()}
        <h1 class="b-display">${escHtml(L("app.name"))}</h1>
        <p class="b-lead" style="max-width:310px;">${escHtml(L("app.tagline"))}</p>
      </div>
      <div class="b-spacer"></div>
      ${bCta({ key: "welcome.begin", action: "beginFromWelcome" })}
    `,
  });
}

// =========================================================== Onboarding text pages
export function onboardingTextPage({ titleKey, bodyKey, buttonKey, pageIndex, pageCount, action }) {
  return bScreen({
    photo: "house-exterior", muted: true, shade: "top",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: null })}
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:6px;text-align:center;">
        ${bStar()}
        <h1 class="b-h1">${escHtml(L(titleKey))}</h1>
      </div>
      <div class="b-spacer"></div>
      ${bCard(`<p class="b-body">${escHtml(L(bodyKey))}</p>`)}
      <div style="margin-top:16px;">${bCta({ key: buttonKey, action })}</div>
    `,
  });
}

// =========================================================== Disclaimer
export function disclaimerScreen() {
  return bScreen({
    photo: "house-exterior", muted: true, shade: "top",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: null })}
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:6px;text-align:center;">
        ${bStar()}
        <h1 class="b-h1">${escHtml(L("disclaimer.title"))}</h1>
      </div>
      <div class="b-spacer"></div>
      ${bCard(`<p class="b-body">${escHtml(L("disclaimer.body"))}</p>`)}
      <div style="text-align:center;margin-top:14px;">${bLink({ text: L("disclaimer.need_help_now"), action: "openCrisis" })}</div>
      <div style="margin-top:16px;">${bCta({ key: "disclaimer.continue", action: "advance" })}</div>
    `,
  });
}

// =========================================================== House rules ("Сегодня
// этот дом принадлежит вам" — P08 in the v3 handoff). Villa photo, muted (too orange
// otherwise), strongly shaded at the top so the title reads on bright sky.
export function houseMapScreen(ctx) {
  const btnKey = ctx === "onboarding" ? "housemap.button_first" : "housemap.button_reopen";
  const paragraphs = L("housemap.body")
    .split("\n\n")
    .map((p) => `<p class="b-body">${escHtml(p)}</p>`)
    .join(`<div class="b-divider" style="margin:12px 0;"></div>`);
  return bScreen({
    photo: "house-exterior", muted: true, shade: "top",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: null })}
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:6px;text-align:center;">
        ${bStar()}
        <h1 class="b-h1">${escHtml(L("housemap.title"))}</h1>
      </div>
      <div class="b-spacer"></div>
      ${bCard(paragraphs)}
      <div style="margin-top:16px;">
        ${bCta({ key: btnKey, action: "houseMapContinue", testId: "uitest.housemap.continue" })}
      </div>
    `,
  });
}

// =========================================================== House map —
// P09/P09b in the v3 handoff. `variant` is "gate" (before the very first room) or
// "afterRoom" (between rooms, `completedKind` names the room just finished).
// FIXES-v5 §1: the map fills the whole screen with no scroll — .b-mapframe/.b-mapbox
// crop the 941:1672 photo to the viewport instead of the old scrollable full-image
// layout, and the CTA is a plain, full-width .b-cta (never part of the image).
// Nothing TEXTUAL is overlaid on the house photo ("не надо ничего накладывать" was
// about the translated word-pills) — the image's own baked numbered circles still mark
// each stop, and the CTA names the next room. The one exception is a plain glow marker
// (no text, no language-specific content) around whichever circle is the CURRENT stop,
// so it's obvious at a glance which of the seven it is, same as a map pin without a label.
function houseMapNavScreen({ headline, ctaText, current }) {
  // The shades moved inside .b-mapframe (same stacking context as .b-mapbox, right
  // before it in DOM order) so the glow marker — a child of .b-mapbox, after the shades
  // in DOM order — paints on top of them instead of being hidden underneath. They were
  // previously direct children of .b-screen, a sibling stacking context with a HIGHER
  // z-index than .b-mapframe's own — the marker's z-index inside .b-mapframe could
  // never win against that regardless of its own value. Purely a stacking fix; still
  // position:fixed, still the same full-viewport coverage either way.
  return `<div class="b-screen b-mapscreen">
      <div class="b-mapframe">
        <div class="b-mapshade-top"></div><div class="b-mapshade-bottom"></div>
        <div class="b-mapbox">
          <img src="assets/rooms/house-map.jpg" alt="">
          <span class="b-map-current" style="left:${current.x}%;top:${current.y}%;"></span>
        </div>
      </div>
      <div class="b-content" style="padding:54px 24px 30px;position:relative;z-index:2;">
        ${bTopbar({ right: { title: headline } })}
        <div class="b-spacer"></div>
        ${bCta({ text: ctaText, action: "advance" })}
      </div>
    </div>`;
}

export function houseMapGateScreen() {
  return houseMapNavScreen({ headline: L("map.title"), ctaText: L(MAP_PINS[0].enterKey), current: MAP_PINS[0] });
}

export function houseMapAfterRoomScreen(completedKind) {
  const idx = MAP_PINS.findIndex((p) => p.kind === completedKind);
  const next = MAP_PINS[idx + 1];
  return houseMapNavScreen({
    headline: L("map.title"),
    ctaText: L(next.enterKey),
    current: next,
  });
}

// =========================================================== Names
export function namesScreen(store) {
  return bScreen({
    photo: "living-room", light: true,
    contentStyle: "padding:54px 24px 34px;",
    inner: `
      ${bTopbar()}
      <div style="display:flex;flex-direction:column;gap:20px;margin-top:22px;">
        ${bStar({ horizontal: true })}
        <h1 class="b-h1" style="font-size:42px;">${escHtml(L("names.title"))}</h1>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:6px;">
          <input id="nameA" class="b-input" type="text" placeholder="${escAttr(L("names.partner_a_placeholder"))}" value="${escAttr(store.session.partnerA.name)}">
          <input id="nameB" class="b-input" type="text" placeholder="${escAttr(L("names.partner_b_placeholder"))}" value="${escAttr(store.session.partnerB.name)}">
        </div>
        <div style="margin-top:6px;">
          ${bCta({ key: "names.continue", action: "submitNames" })}
        </div>
      </div>
    `,
  });
}

// =========================================================== Couple's Agreement
// FIXES-v4 §9: dark `.b-choice` list with checkmarks, a "Своё…" free-text field, and
// a single-line `.b-cta` ("Сохранить договор" — not the old two-button skip/save row).
export function couplesAgreementScreen(store, ui) {
  const exampleKeys = Array.from({ length: 7 }, (_, i) => `couples_agreement.example.${String(i + 1).padStart(2, "0")}`);
  const active = store.couplesAgreement;
  const rows = exampleKeys
    .map((k) => {
      const text = L(k);
      const on = active.includes(text);
      return bChoice({ text, on, action: "toggleAgreementRule", arg: k });
    })
    .join("");
  const customRules = active.filter((r) => !exampleKeys.some((k) => L(k) === r));
  const customRows = customRules
    .map((r, i) => bChoice({ text: r, on: true, action: "removeCustomRule", arg: i }))
    .join("");
  return bScreen({
    photo: "living-room", shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar()}
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:6px;text-align:center;">
        ${bStar()}
        <h1 class="b-h1">${escHtml(L("couples_agreement.title"))}</h1>
        <p class="b-body">${escHtml(L("couples_agreement.subtitle"))}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">${customRows}${rows}</div>
      <div style="display:flex;gap:8px;margin-top:10px;">
        <input id="newRuleInput" class="b-input" placeholder="${escAttr(L("couples_agreement.placeholder"))}" value="${escAttr(ui.newRuleDraft)}" style="flex-grow:1;">
        <button class="pressable" data-action="addCustomRule" style="padding:0 18px;border-radius:14px;border:1px solid rgba(239,230,218,0.22);background:rgba(11,9,7,0.5);color:var(--text);font-weight:600;">${escHtml(L("couples_agreement.add_rule"))}</button>
      </div>
      <div class="b-spacer"></div>
      ${bCta({ key: "couples_agreement.save", action: "advance" })}
      <div style="text-align:center;margin-top:10px;">${bLink({ text: L("couples_agreement.skip_for_now"), action: "advance" })}</div>
    `,
  });
}

// =========================================================== Dice
// FIXES-v4 §4: a real cream die with pips (not a unicode glyph), a two-column
// scorecard, and the result spelled out in a quote — all on the dark v3 shell.
const DIE_PIP_LAYOUT = {
  1: ["2/2"],
  2: ["1/1", "3/3"],
  3: ["1/1", "2/2", "3/3"],
  4: ["1/1", "1/3", "3/1", "3/3"],
  5: ["1/1", "1/3", "2/2", "3/1", "3/3"],
  6: ["1/1", "1/3", "2/1", "2/3", "3/1", "3/3"],
};

function dieFace(value, size = 120, rolling = false) {
  const pips = (DIE_PIP_LAYOUT[value] || DIE_PIP_LAYOUT[1])
    .map((area) => `<span class="b-pip" style="grid-area:${area};width:${Math.round(size * 0.15)}px;height:${Math.round(size * 0.15)}px;"></span>`)
    .join("");
  return `<div class="b-die-stage"><div class="b-die${rolling ? " is-rolling" : ""}" style="width:${size}px;height:${size}px;border-radius:28px;padding:18px;">${pips}</div></div>`;
}

export function diceScreen(ui, store) {
  const stage = store.diceStage;
  const rollerRole = stage === "done" ? null : stage;
  return bScreen({
    photo: "living-room", shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: rollerRole ? { who: LF("dice.who_rolls", store.name(rollerRole)) } : null })}
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:10px;text-align:center;">
        ${bStar()}
        <h1 class="b-h1">${escHtml(L("dice.title"))}</h1>
        <p class="b-body">${escHtml(store.diceJustTied ? L("dice.tie") : L("dice.subtitle"))}</p>
      </div>
      <div class="b-spacer"></div>
      <div style="display:flex;justify-content:center;">${dieFace(ui.diceFace || 1, 120, ui.diceRolling)}</div>
      ${(store.diceValueA != null || store.diceValueB != null) ? `
        <div class="b-card" style="margin-top:22px;display:grid;grid-template-columns:1fr 1fr;padding:0;overflow:hidden;">
          <div style="padding:14px 16px;border-right:1px solid rgba(239,230,218,0.14);"><div class="b-small">${escHtml(store.name("partnerA"))}</div><div style="font:400 30px/1 var(--serif);color:#F4EDE4;margin-top:6px;">${store.diceValueA ?? "—"}</div></div>
          <div style="padding:14px 16px;"><div class="b-small">${escHtml(store.name("partnerB"))}</div><div style="font:400 30px/1 var(--serif);color:#C9A45C;margin-top:6px;">${store.diceValueB ?? "—"}</div></div>
        </div>` : ""}
      ${stage === "done" && store.session.firstToSpeak ? `<p class="b-quote" style="text-align:center;margin-top:14px;color:#F4EDE4;">${escHtml(LF("dice.result", store.name(store.session.firstToSpeak)))}</p>` : ""}
      <div class="b-spacer"></div>
      ${stage === "done" ? bCta({ key: "oath.ready", action: "advance" }) : bCta({ key: "dice.roll", action: "rollDice" })}
    `,
  });
}

// =========================================================== Intensity & State
// No more two-card, one-flipped layout (DESIGN.md §2 bans upside-down screens) — each
// partner gets their own turn: an explicit handoff (`ui.intensityHandoffAcked`), then
// the scale/chips/free-text for `ui.intensityTurn`, one role at a time.
export function intensityScreen(store, ui) {
  const role = ui.intensityTurn;
  const other = role === "partnerA" ? "partnerB" : "partnerA";
  if (!ui.intensityHandoffAcked) {
    return bScreen({
      photo: "house-exterior", muted: true, shade: "text",
      contentStyle: "padding:54px 24px 30px;",
      inner: `
        ${bTopbar({ right: { who: LF("room.who_answers", store.name(role)) } })}
        <div class="b-spacer"></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;">
          ${bStar()}
          <h1 class="b-h1">${escHtml(LF("handoff.pass_title", store.name(role)))}</h1>
          <p class="b-body">${escHtml(LF("handoff.listen_note", store.name(other)))}</p>
        </div>
        <div class="b-spacer"></div>
        ${bCta({ text: L("handoff.pass_ready"), action: "intensityHandoffReady" })}
      `,
    });
  }
  const value = ui.intensity[role];
  const chips = STATE_KEYS.map((s) => ({ text: L(`state.${s}`), on: ui.stateSelected[role].includes(s), action: "toggleStateOption", arg: role, arg2: s }));
  const ready = value !== null && (ui.stateSelected[role].length > 0 || ui.stateCustom[role].trim().length > 0);
  return bScreen({
    photo: "house-exterior", muted: true, shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("room.who_answers", store.name(role)) } })}
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:4px;text-align:center;">
        ${bStar()}
        <h1 class="b-h1">${escHtml(L("intensity.screen_title"))}</h1>
      </div>
      ${bCard(`
        ${bScaleHeader(value)}
        ${bScale({ value, action: "setEmotionValue", arg: role })}
      `, "margin-top:14px;padding:16px 18px;")}
      <p class="b-small" style="margin-top:14px;">${escHtml(L("intensity.state_label"))}</p>
      <div style="margin-top:8px;">${bChipGrid(chips)}</div>
      <input class="b-input" type="text" placeholder="${escAttr(L("intensity.custom_placeholder"))}" id="custom-${role}" value="${escAttr(ui.stateCustom[role])}" style="margin-top:10px;height:46px;">
      <div class="b-spacer"></div>
      ${bCta({ text: L("intensity.continue_button"), action: "submitIntensityTurn", enabled: ready })}
    `,
  });
}

// =========================================================== Calm Down
export function calmDownScreen(ui) {
  return bScreen({
    photo: "house-exterior", muted: true, shade: "top",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: "gear" })}
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:10px;text-align:center;">
        ${bStar()}
        <h1 class="b-h1">${escHtml(L("calm_down.title"))}</h1>
        <p class="b-body" style="max-width:290px;">${escHtml(L("calm_down.body"))}</p>
      </div>
      <div class="b-spacer"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
        <div class="breathing-circle${ui.breathing ? " breathing" : ""}" style="${ui.breathing ? "" : "transform:scale(0.7);"} width:220px;height:220px;border-radius:50%;border:1px solid rgba(201,164,92,0.6);display:grid;place-items:center;background:radial-gradient(circle,rgba(239,230,218,0.22),rgba(11,9,7,0.35));">
          <div style="width:150px;height:150px;border-radius:50%;background:rgba(239,230,218,0.16);border:1px solid rgba(239,230,218,0.5);display:grid;place-items:center;">
            <span style="font:italic 400 22px/1 var(--serif);color:#F4EDE4;">${escHtml(L(ui.breathing ? "calm_down.inhale" : "calm_down.ready"))}</span>
          </div>
        </div>
      </div>
      <div class="b-spacer"></div>
      ${ui.breathing
        ? bCta({ key: "onboarding.got_it", action: "advance" })
        : bCta({ key: "calm_down.start_breathing", action: "startBreathing" }) + `<div style="margin-top:10px;text-align:center;">${bLink({ text: L("calm_down.skip"), action: "advance" })}</div>`}
    `,
  });
}

// =========================================================== Oath
// A checklist, one line per promise, rather than a single wall of text — each tap
// is a small commitment, and the CTA only unlocks once every line has been
// acknowledged (DESIGN.md §10 / the P07 handoff mockup's pseudo-code).
export function oathScreen(ui) {
  const lines = L("oath.text").split(/(?<=[.!?])\s+/).filter(Boolean);
  const doneCount = ui.oathChecked.filter(Boolean).length;
  const allDone = lines.length > 0 && doneCount === lines.length;
  const rows = lines.map((line, i) => bCheck({ text: line, done: !!ui.oathChecked[i], action: "toggleOathLine", arg: i })).join("");
  return bScreen({
    photo: "oath", shade: "text",
    contentStyle: "padding:54px 24px 34px;",
    inner: `
      ${bTopbar()}
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:6px;text-align:center;">
        ${bStar()}
        <h1 class="b-display">${escHtml(L("oath.title"))}</h1>
        <p class="b-body">${escHtml(L("oath.instruction"))}</p>
      </div>
      ${bProgress(lines.length ? doneCount / lines.length : 0)}
      <div class="b-spacer"></div>
      <div style="display:flex;flex-direction:column;gap:10px;">${rows}</div>
      <div style="margin-top:16px;">
        ${bCta({ key: "oath.ready", action: "completeOathAndAdvance", enabled: allDone })}
      </div>
    `,
  });
}

// =========================================================== Ritual (Hold Hands)
// A plain list to read aloud, not a UI choice — nothing here is tappable; both
// partners choose out loud, together, which phrase fits (or say both). The one and
// only control on this screen is the continue button below.
export function ritualScreen(ui) {
  const lines = ["ritual.line_1", "ritual.line_2"];
  const vows = lines.map((key) => `<p class="b-quote">${escHtml(L(key))}</p>`).join(`<div class="b-divider" style="margin:14px 0;"></div>`);
  return bScreen({
    photo: "house-exterior", muted: true, shade: "top",
    contentStyle: "padding:54px 24px 34px;",
    inner: `
      ${bTopbar({ right: null })}
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;margin-top:6px;text-align:center;">
        ${bStar()}
        <h1 class="b-h1">${escHtml(L("ritual.title"))}</h1>
        <p class="b-body" style="max-width:300px;">${escHtml(L("ritual.instruction"))}</p>
      </div>
      <div class="b-spacer"></div>
      ${bCard(vows)}
      <div style="margin-top:18px;">
        ${bCta({ key: "ritual.continue", action: "completeRitualAndAdvance" })}
      </div>
    `,
  });
}

// =========================================================== Generic room
// Every sequential ("speaks") room is in V3_ROOM_KINDS and gets the FIXES-v4 §6
// linear pass-the-phone cycle (roomScreenV3, below); Kitchen is a genuine two-person
// discussion (kitchenDiscussionScreen); legacyRoomScreen is now dead code kept only
// as a reference until it's deleted outright.
export const V3_ROOM_KINDS = new Set(["hall", "livingRoom", "study", "kidsRoom"]);

export function roomScreen(store, ui, kind) {
  if (V3_ROOM_KINDS.has(kind)) return roomScreenV3(store, ui, kind);
  if (kind === "kitchen") return kitchenDiscussionScreen(store, ui);
  return legacyRoomScreen(store, ui, kind);
}

const ROOM_FEELING_KEYS = ["hurt", "angry", "scared", "guilty", "ashamed", "sad", "confused"];

/** FIXES-v4 §6's cycle, strictly one screen = one person, no exceptions: enter →
 * [ready to ANSWER (V05) → tell it out loud (V02) → rate it (V03, emotions) →
 * partner reads it right away (V04, no screen before it — the phone was just handed
 * over) → ready to answer again (V05)] × 2 → next question or map.
 * Her explicit correction after watching the old order on her phone: the "X, ваша
 * очередь" screen belongs ONLY right before answering, never before reading. The old
 * order showed it right after the phone was passed, ahead of the partner's answer —
 * backwards from what "ваша очередь" (the asker's turn) actually describes at that
 * moment, which is reading, not answering. Now: phone passed -> straight to what the
 * partner said -> "ваша очередь" (now accurately about answering) -> the question.
 * The room's own mechanics (activePartner/roomDoneFlags/pendingReveal/confirmReveal)
 * are untouched — this only decides which screen to show for the current state. */
function roomScreenV3(store, ui, kind) {
  const cfg = room(kind);
  if (!ui.roomV3.entered) return roomEnterScreenV3(cfg);
  const reveal = store.pendingReveal;
  if (reveal) return roomPartnerReadsScreenV3(store, reveal);
  if (!ui.roomV3.handoffAcked) {
    return roomReadyScreenV3(store, store.activePartner, store.other(store.activePartner));
  }
  if (!ui.roomV3.told) return roomTellScreenV3(store, ui, cfg);
  return roomEmotionScreenV3(store, ui, cfg);
}

function roomEnterScreenV3(cfg) {
  return bScreen({
    photo: cfg.backgroundImage, shade: "top",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar()}
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:6px;text-align:center;">
        ${bStar()}
        <span class="b-eyebrow">${escHtml(LF("room.number_label", cfg.order))}</span>
        <h1 class="b-h1">${escHtml(L(cfg.nameKey))}</h1>
      </div>
      <div class="b-spacer"></div>
      ${bCard(`<p class="b-body">${escHtml(L(cfg.instructionKey))}</p><div class="b-divider" style="margin:14px 0;"></div><p class="b-small" style="color:var(--gold);font-weight:600;margin-bottom:6px;">${escHtml(L("room.why_it_helps_label"))}</p><p class="b-body">${escHtml(L(cfg.whyItHelpsKey))}</p>`)}
      <div style="margin-top:16px;">${bCta({ text: L("room.enter_continue"), action: "enterRoomV3" })}</div>
    `,
  });
}

/** The "X, ваша очередь" / "Я готов(а)" screen (V05) — shown before EVERY turn,
 * answering or reading alike (FIXES-v4 §6: no more skipping it just because the
 * phone happened to already be in the right hands). */
function roomReadyScreenV3(store, toRole, otherRole) {
  const cfg = room(store.session.currentRoom);
  return bScreen({
    photo: cfg.backgroundImage, shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("room.who_answers", store.name(toRole)) } })}
      <div class="b-spacer"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;">
        <div style="width:92px;height:92px;border-radius:50%;border:1px solid rgba(201,164,92,0.7);display:grid;place-items:center;font:400 42px/1 var(--serif);color:#F4EDE4;background:rgba(11,9,7,0.5);">${escHtml((store.name(toRole).trim()[0] || "?").toUpperCase())}</div>
        <h1 class="b-h1">${escHtml(LF("handoff.pass_title", store.name(toRole)))}</h1>
        <p class="b-body" style="max-width:290px;">${escHtml(LF("handoff.listen_note", store.name(otherRole)))}</p>
      </div>
      <div class="b-spacer"></div>
      ${bCta({ text: L("handoff.pass_ready"), action: "handoffReadyV3" })}
    `,
  });
}

function roomPartnerReadsScreenV3(store, reveal) {
  const cfg = room(store.session.currentRoom);
  const z = zoneOf(reveal.emotion.value);
  const chipsHtml = reveal.emotion.chips.map((s) => `<span class="b-chip is-on">${escHtml(L(`state.${s}`))}</span>`).join("");
  return bScreen({
    photo: cfg.backgroundImage, shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("room.who_reads", store.name(reveal.to)) } })}
      <span class="b-eyebrow" style="margin-top:22px;">${escHtml(LF("handoff.shared_eyebrow", store.name(reveal.from)))}</span>
      <h1 class="b-h1" style="margin-top:8px;">${escHtml(LF("handoff.shared_title", store.name(reveal.to), store.name(reveal.from)))}</h1>
      ${bCard(`
        <div style="display:flex;align-items:center;justify-content:space-between;"><span class="b-small">${escHtml(L("intensity.strength_label"))}</span><span class="b-level z-${z}">${reveal.emotion.value} · ${escHtml(L(`intensity.zone.${z}`))}</span></div>
        <div class="b-scale" style="margin-top:10px;">${Array.from({ length: 11 }, (_, i) => `<span class="b-seg z-${zoneOf(i)}${i <= reveal.emotion.value ? " is-on" : ""}"></span>`).join("")}</div>
        <div class="b-divider" style="margin:14px 0;"></div>
        <div class="b-chipgrid">${chipsHtml || `<span class="b-small">${escHtml(L("intensity.state_placeholder"))}</span>`}</div>
        ${reveal.emotion.custom ? `<p class="b-quote" style="color:#F4EDE4;margin-top:12px;">«${escHtml(reveal.emotion.custom)}»</p>` : ""}
      `, "margin-top:18px;")}
      <p class="b-small" style="margin-top:12px;">${escHtml(L("handoff.read_note"))}</p>
      <div class="b-spacer"></div>
      ${bCta({ text: L("handoff.read_it"), action: "confirmRevealV3" })}
    `,
  });
}

/** V02: the purely-verbal step — question, compact rule bar, an example drawn from
 * the room's own real deck content (kept, just no longer a pick-list), a "Подробнее"
 * disclosure for why it helps, and a confirm button. No text is captured here; what
 * gets shown to the partner is the emotion rating that follows (roomEmotionScreenV3). */
function roomTellScreenV3(store, ui, cfg) {
  const active = store.activePartner;
  const other = store.other(active);
  const forbidden = cfg.forbiddenKey
    ? L(cfg.forbiddenKey).split("\n").map((line) => ({ kind: "no", text: line.replace(/^•\s*/, "") }))
    : [];
  const tags = [
    { kind: "speak", text: LF("room.rule_speaks", store.name(active)) },
    { kind: "plain", text: LF("room.rule_listens", store.name(other)) },
    ...forbidden,
  ];
  const exampleCard = cfg.deckIds.length ? deck(cfg.deckIds[0]).cards[0] : null;
  return bScreen({
    photo: cfg.backgroundImage, shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("room.who_answers", store.name(active)) } })}
      <div style="display:flex;align-items:center;gap:12px;margin-top:14px;">
        <span class="b-eyebrow">${escHtml(L(cfg.nameKey))}</span>
      </div>
      <h1 class="b-h1" style="margin-top:18px;">${escHtml(L(cfg.questionKey))}</h1>
      <div style="margin-top:14px;">${bRuleBar(tags)}</div>
      ${bCard(`
        <span class="b-eyebrow" style="color:#C9A45C;">${escHtml(L("room.tell_aloud_label"))}</span>
        <p class="b-body" style="margin-top:8px;">${escHtml(L(cfg.instructionKey))}</p>
        ${exampleCard ? `<p class="b-quote" style="margin-top:8px;">«${escHtml(L(exampleCard.textKey))}»</p>` : ""}
        ${ui.roomV3.moreOpen
          ? `<div class="b-divider" style="margin:10px 0;"></div><p class="b-small" style="color:var(--gold);font-weight:600;">${escHtml(L("room.why_it_helps_label"))}</p><p class="b-body" style="margin-top:4px;">${escHtml(L(cfg.whyItHelpsKey))}</p>`
          : bMore({ action: "toggleRoomMoreV3", open: ui.roomV3.moreOpen })}
      `, "margin-top:16px;")}
      <div class="b-spacer"></div>
      ${bCta({ text: L("room.i_told"), action: "roomTellDoneV3" })}
    `,
  });
}

/** V03: the structured answer — the same emotion-scale component used at the global
 * check-in (DESIGN.md §3), scoped to this one question/turn. Done stays disabled
 * until a level is picked AND at least one feeling (or free text) is given. */
function roomEmotionScreenV3(store, ui, cfg) {
  const active = store.activePartner;
  const other = store.other(active);
  const e = ui.roomV3.emotion;
  const chips = ROOM_FEELING_KEYS.map((s) => ({ text: L(`state.${s}`), on: e.chips.includes(s), action: "toggleRoomEmotionChipV3", arg: s }));
  const ready = e.value !== null && (e.chips.length > 0 || e.custom.trim().length > 0);
  return bScreen({
    photo: cfg.backgroundImage, shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("room.who_answers", store.name(active)) } })}
      <div style="display:flex;align-items:center;gap:12px;margin-top:14px;">
        <span class="b-eyebrow">${escHtml(L(cfg.nameKey))}</span>
      </div>
      <h1 class="b-h2" style="margin-top:16px;">${escHtml(L("room.emotion_question"))}</h1>
      ${bCard(`${bScaleHeader(e.value)}${bScale({ value: e.value, action: "setRoomEmotionValueV3" })}`, "margin-top:14px;padding:16px 18px;")}
      <p class="b-small" style="margin-top:14px;">${escHtml(L("intensity.state_label"))}</p>
      <div style="margin-top:8px;">${bChipGrid(chips)}</div>
      <input class="b-input" type="text" id="roomEmotionCustom" placeholder="${escAttr(L("intensity.custom_placeholder"))}" value="${escAttr(e.custom)}" style="margin-top:10px;height:46px;">
      <div class="b-spacer"></div>
      ${bCta({ text: LF("room.emotion_handoff", store.name(other)), action: "submitRoomEmotionV3", enabled: ready })}
    `,
  });
}

/** Kitchen is genuinely a two-person discussion, not a sequential turn — the one
 * deliberate exception to "one screen = one person". No `.b-who--together` pill
 * (FIXES-v4 §0 retires it); each partner just taps their own Done when the two of
 * them are finished talking, same as before, restyled onto v3. */
function kitchenDiscussionScreen(store, ui) {
  const cfg = room("kitchen");
  const doneRow = (role) => {
    const done = store.roomDoneFlags[role];
    return `<button class="b-choice pressable${done ? " is-on" : ""}" type="button" data-action="markRoomDone" data-arg="${role}" ${done ? "disabled" : ""}><span class="b-choice__radio"></span>${escHtml(store.name(role))}${done ? ` — ${escHtml(L("room.done"))}` : ""}</button>`;
  };
  return bScreen({
    photo: cfg.backgroundImage, shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar()}
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:6px;text-align:center;">
        ${bStar()}
        <span class="b-eyebrow">${escHtml(L(cfg.nameKey))}</span>
        <h1 class="b-h1">${escHtml(L(cfg.questionKey))}</h1>
      </div>
      ${bCard(`<p class="b-body">${escHtml(L(cfg.instructionKey))}</p><div class="b-divider" style="margin:12px 0;"></div><p class="b-small" style="color:var(--gold);font-weight:600;">${escHtml(L("room.why_it_helps_label"))}</p><p class="b-body" style="margin-top:4px;">${escHtml(L(cfg.whyItHelpsKey))}</p>`, "margin-top:16px;")}
      <p class="b-small" style="margin-top:16px;">${escHtml(L("room.mark_done_both"))}</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">${doneRow("partnerA")}${doneRow("partnerB")}</div>
      <div class="b-spacer"></div>
    `,
  });
}


// =========================================================== Basement
// FIXES-v4 §7: two stages, neither loops into the other, both strictly one-person-
// at-a-time. Stage 1 — each partner picks ONE fear from the real 44-card fears deck
// (or their own words), the other reads it, roles swap. Stage 2 — one partner asks
// up to 15 questions aloud, the other answers only Да/Нет (tapped by the asker, who
// holds the phone throughout — handing it over every single question would make a
// 15-question round unworkable), then roles swap.
export function basementScreen(store, ui) {
  return store.basementStage === "fears" ? basementFearsScreen(store, ui) : basementQuestionsScreen(store, ui);
}

// Same fix and same reasoning as roomScreenV3 above: the phone-passed reveal shows
// immediately, with no "X, ваша очередь" screen ahead of it — that screen belongs only
// right before NAMING the next fear (confirmBasementFearReadV3 already resets
// handoffAcked to false for exactly that, unchanged here).
function basementFearsScreen(store, ui) {
  const reveal = store.basementFearReveal;
  if (reveal) return basementFearReadScreen(store, reveal);
  if (!ui.basementV3.handoffAcked) {
    return basementReadyScreen(store, store.activePartner, store.other(store.activePartner));
  }
  return basementFearChoiceScreen(store, ui);
}

function basementReadyScreen(store, toRole, otherRole) {
  return bScreen({
    photo: "basement", shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("room.who_answers", store.name(toRole)) } })}
      <div class="b-spacer"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;">
        <div style="width:92px;height:92px;border-radius:50%;border:1px solid rgba(201,164,92,0.7);display:grid;place-items:center;font:400 42px/1 var(--serif);color:#F4EDE4;background:rgba(11,9,7,0.5);">${escHtml((store.name(toRole).trim()[0] || "?").toUpperCase())}</div>
        <h1 class="b-h1">${escHtml(LF("handoff.pass_title", store.name(toRole)))}</h1>
        <p class="b-body" style="max-width:290px;">${escHtml(LF("handoff.listen_note", store.name(otherRole)))}</p>
      </div>
      <div class="b-spacer"></div>
      ${bCta({ text: L("handoff.pass_ready"), action: "basementHandoffReady" })}
    `,
  });
}

function basementFearChoiceScreen(store, ui) {
  const cards = deck("fears").cards;
  const rows = cards.map((c) => bChoice({ text: L(c.textKey), on: ui.basementV3.fearChoice === c.id, action: "chooseBasementFearOption", arg: c.id })).join("");
  const customOn = ui.basementV3.fearChoice === "custom";
  const ready = (ui.basementV3.fearChoice && ui.basementV3.fearChoice !== "custom") || (customOn && ui.basementV3.fearCustom.trim().length > 0);
  return bScreen({
    photo: "basement", shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("room.who_answers", store.name(store.activePartner)) } })}
      <div style="display:flex;align-items:center;gap:12px;margin-top:14px;">
        <span class="b-eyebrow">${escHtml(L("basement.stage1_eyebrow"))}</span>
        <div style="flex-grow:1;" class="b-progress"><div class="b-progress__fill" style="width:50%;"></div></div>
        <span class="b-step">1 / 2</span>
      </div>
      <h1 class="b-h1" style="margin-top:16px;">${escHtml(L("basement.fear_question"))}</h1>
      <p class="b-body" style="margin-top:8px;">${escHtml(L("basement.fear_instruction"))}</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">
        ${rows}
        ${bChoice({ text: L("basement.fear_custom_option"), on: customOn, action: "chooseBasementFearOption", arg: "custom" })}
        ${customOn ? `<input class="b-input" type="text" id="basementFearCustom" placeholder="${escAttr(L("basement.fear_custom_placeholder"))}" value="${escAttr(ui.basementV3.fearCustom)}">` : ""}
      </div>
      ${bFooter(bCta({ text: L("basement.fear_chosen"), action: "submitBasementFear", enabled: ready }))}
    `,
  });
}

function basementFearReadScreen(store, reveal) {
  return bScreen({
    photo: "basement", shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("room.who_reads", store.name(reveal.to)) } })}
      <span class="b-eyebrow" style="margin-top:22px;">${escHtml(LF("handoff.shared_eyebrow", store.name(reveal.from)))}</span>
      <h1 class="b-h1" style="margin-top:8px;">${escHtml(LF("basement.fear_reveal_title", store.name(reveal.to)))}</h1>
      ${bCard(`<p class="b-quote" style="color:#F4EDE4;">«${escHtml(reveal.text)}»</p>`, "margin-top:18px;")}
      ${bCard(`<p class="b-body">${escHtml(L("basement.fear_reflection"))}</p>`, "margin-top:12px;")}
      <div class="b-spacer"></div>
      ${bCta({ text: L("handoff.read_continue"), action: "confirmBasementFearReadV3" })}
    `,
  });
}

// FIXES-v5 §4: verbal Да/Нет, not tapped — there's nothing to capture per-answer
// (no more .b-yn buttons), just a running tally up to 15, kept as a big numeral + a
// row of ticks, with one button that advances the count and a separate "done" button.
function basementQuestionsScreen(store, ui) {
  const asker = store.activePartner;
  const answerer = store.other(asker);
  const count = store.basementAskedCount[asker];
  const atCap = count >= 15;
  const ticks = Array.from({ length: 15 }, (_, i) => `<span class="b-tick${i < count ? " is-on" : ""}"></span>`).join("");
  return bScreen({
    photo: "basement", shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("basement.who_asks", store.name(asker)) } })}
      <span class="b-eyebrow" style="margin-top:14px;">${escHtml(L("basement.stage2_eyebrow"))}</span>
      <h1 class="b-h1" style="margin-top:8px;">${escHtml(L("basement.ask_aloud_title"))}</h1>
      ${bCard(`<p class="b-body" style="font-size:16.5px;line-height:1.5;">${escHtml(LF("basement.stage2_body", store.name(answerer), store.name(answerer)))}</p>`, "margin-top:14px;")}
      <div class="b-spacer"></div>
      <div class="b-count"><span class="b-count__num">${count}</span><span class="b-count__of">/ 15</span></div>
      <div class="b-ticks">${ticks}</div>
      <div class="b-spacer"></div>
      ${bCta({ text: LF("basement.answered_next", store.name(answerer)), action: "basementAnswerGiven", enabled: !atCap, style: "padding:0 48px 0 16px;letter-spacing:.02em;font-size:11px;" })}
      <div style="margin-top:12px;">${bCta({ text: L("basement.no_more_questions"), action: "finishBasementAskingV3", ghost: true })}</div>
    `,
  });
}

/** Done only ever finishes the room once BOTH partners have tapped it during their
 * own asking turn — turns only change hands after a full ask+answer round, so
 * without this note, a partner can tap Done, watch nothing happen, and not
 * understand why. Mirrors the same hint in BasementView.swift on iOS. */
// =========================================================== Bridge Finale
// FIXES-v4 §8: sequential, one partner at a time (never G/J tabs on one screen) — 3
// steps with a carousel per step, then a 2-line promise checklist, then "Передайте
// телефон" and the same for the other partner; "Мы на одной стороне" only appears
// right at the very end, once both are done.
const BRIDGE_KIND_ORDER = ["stepToward", "need", "gift"];
const BRIDGE_DECK_ID = { stepToward: "step_toward", need: "needs_connection", gift: "gifts" };
const BRIDGE_STEP_LABEL_KEY = { stepToward: "bridge.step_label.step_toward", need: "bridge.step_label.need", gift: "bridge.step_label.gift" };
const BRIDGE_INSTRUCTION_KEY = { stepToward: "bridge.instruction.step_toward", need: "bridge.instruction.need", gift: "bridge.instruction.gift" };

// A rough keyword -> icon match against the (Russian) card text, just enough to give
// each tile in the Bridge finale's grid a glyph that roughly matches its meaning —
// not meant to be exhaustive, "star" is a perfectly fine fallback for anything that
// doesn't match (FIXES-v5: the gift deck's bare nouns like "машина"/"цветы" read as
// literal without ANY visual framing; a matching icon is part of the fix).
const CARD_ICON_RULES = [
  [/объят|обним|рядом побыть|близост/i, "heart"],
  [/руку|за руку|прикосн/i, "closeness"],
  [/глаза|смотри/i, "eye"],
  [/скажи|слов|говор|честн|слуша/i, "speech"],
  [/чай|кофе|завтрак|ужин|массаж/i, "cup"],
  [/молч|одному|одной|тишин|без телефон|вечер/i, "moon"],
  [/цвет/i, "flower"],
  [/песн|танец|музык/i, "music"],
  [/книг|письмо/i, "book"],
  [/машин|поездк|путешеств/i, "car"],
  [/кольц|часы|украшен|сумка/i, "gift"],
];
function cardIcon(text) {
  for (const [re, name] of CARD_ICON_RULES) if (re.test(text)) return name;
  return "star";
}

export function bridgeFinaleScreen(store, ui) {
  const turn = ui.bridgeTurn;
  const other = store.other(turn);

  if (ui.bridgeStage === "handoff") {
    return bScreen({
      photo: "bridge", muted: true, shade: "top",
      contentStyle: "padding:54px 24px 30px;",
      inner: `
        ${bTopbar({ right: { who: LF("room.who_answers", store.name(turn)) } })}
        <div class="b-spacer"></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;">
          ${bStar()}
          <h1 class="b-h1">${escHtml(LF("handoff.pass_title", store.name(turn)))}</h1>
          <p class="b-body">${escHtml(LF("handoff.listen_note", store.name(other)))}</p>
        </div>
        <div class="b-spacer"></div>
        ${bCta({ text: L("handoff.pass_ready"), action: "bridgeHandoffReady" })}
      `,
    });
  }

  if (ui.bridgeStage === "promise") {
    const sel = store.session.bridgeFinal[turn] || {};
    const cardText = (kind) => {
      const id = sel[`${kind}CardID`];
      const d = deck(BRIDGE_DECK_ID[kind]);
      const c = d.cards.find((cc) => cc.id === id);
      return c ? L(c.textKey) : "";
    };
    const bothDone = turn === "partnerB" && store.bridgeCardsChosen("partnerA") && store.bridgePromisesChecked("partnerA");
    const isLast = turn === "partnerB";
    const ready = store.bridgePromisesChecked(turn);
    return bScreen({
      photo: "bridge", muted: true, shade: "top",
      contentStyle: "padding:54px 24px 30px;",
      inner: `
        ${bTopbar({ right: { who: store.name(turn) } })}
        <div style="display:flex;align-items:center;gap:12px;margin-top:14px;">
          <span class="b-eyebrow">${escHtml(L("bridge.eyebrow_promise"))}</span>
          <div style="flex-grow:1;" class="b-progress"><div class="b-progress__fill" style="width:100%;"></div></div>
          <span class="b-step">3 / 3</span>
        </div>
        <h1 class="b-h1" style="margin-top:16px;">${escHtml(L("bridge.promise_title"))}</h1>
        <p class="b-body" style="margin-top:8px;">${escHtml(LF("bridge.promise_instruction", store.name(other)))}</p>
        ${bCard(`<div class="b-small">${escHtml(L("bridge.you_chose"))}</div>
          <div style="display:flex;flex-direction:column;gap:6px;font:400 14.5px/1.4 var(--sans);color:#D8CFC5;margin-top:6px;">
            <span>· ${escHtml(cardText("stepToward"))}</span>
            <span>· ${escHtml(cardText("need"))}</span>
            <span>· ${escHtml(cardText("gift"))}</span>
          </div>`, "margin-top:16px;")}
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px;">
          ${bCheck({ text: L("bridge.promise_1"), done: !!sel.promise1, action: "toggleBridgePromise", arg: 1 })}
          ${bCheck({ text: L("bridge.promise_2"), done: !!sel.promise2, action: "toggleBridgePromise", arg: 2 })}
        </div>
        <div class="b-spacer"></div>
        ${isLast
          ? bCta({ text: L("bridge.same_side_button"), action: "advance", enabled: store.bridgeFinaleComplete() })
          : bCta({ text: LF("bridge.next_turn", store.name(other)), action: "bridgeFinishTurn", enabled: ready })}
      `,
    });
  }

  // ui.bridgeStage === "cards" — FIXES-v5: every option is a tappable icon+label tile
  // in one grid, not a one-at-a-time swipe carousel (the redundant .b-progress bar
  // stacked right above .b-steps — two progress indicators for the same 3 steps — is
  // also gone here, that pairing is what read as "stripes layering" at the top).
  const kind = BRIDGE_KIND_ORDER[ui.bridgeStepIndex];
  const d = deck(BRIDGE_DECK_ID[kind]);
  const cards = d.cards;
  const idx = Math.min(ui.bridgeCarouselIndex, cards.length - 1);
  const tiles = cards.map((c) => ({ text: L(c.textKey), icon: cardIcon(L(c.textKey)) }));
  return bScreen({
    photo: "bridge", muted: true, shade: "top",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("room.who_answers", store.name(turn)) } })}
      <div style="display:flex;align-items:center;gap:12px;margin-top:14px;">
        <span class="b-eyebrow">${escHtml(L("bridge.eyebrow_step"))}</span>
        <span class="b-step">${ui.bridgeStepIndex + 1} / 3</span>
      </div>
      ${bSteps(3, ui.bridgeStepIndex)}
      <h1 class="b-h2" style="margin-top:14px;">${escHtml(L(BRIDGE_STEP_LABEL_KEY[kind]))}</h1>
      <p class="b-body" style="margin-top:6px;">${escHtml(L(BRIDGE_INSTRUCTION_KEY[kind]))}</p>
      <div style="margin-top:14px;">${bCardGrid(tiles, idx, "selectBridgeGridCard")}</div>
      <div class="b-spacer"></div>
      ${bCta({ text: L("bridge.pick_this"), action: "bridgeSelectCard" })}
    `,
  });
}

// =========================================================== Voice Snapshot
// FIXES-v4 §10: sequential (not both partners on one screen), a plain circular
// `.b-rec` button (no mic emoji), a running timer, then Прослушать/Заново/Сохранить.
export function voiceSnapshotScreen(store, ui) {
  const turn = ui.voiceTurn;
  const other = store.other(turn);
  if (ui.voiceStage === "handoff") {
    return bScreen({
      photo: "bridge", shade: "text",
      contentStyle: "padding:54px 24px 30px;",
      inner: `
        ${bTopbar({ right: { who: LF("voice.who_records", store.name(turn)) } })}
        <div class="b-spacer"></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;">
          ${bStar()}
          <h1 class="b-h1">${escHtml(LF("handoff.pass_title", store.name(turn)))}</h1>
          <p class="b-body">${escHtml(LF("handoff.listen_note", store.name(other)))}</p>
        </div>
        <div class="b-spacer"></div>
        ${bCta({ text: L("handoff.pass_ready"), action: "voiceHandoffReady" })}
      `,
    });
  }
  const recording = ui.recordingRole === turn;
  const hasBlob = !!ui.voiceBlobUrl[turn];
  const mm = String((ui.voiceRecordSeconds / 60 | 0)).padStart(1, "0");
  const ss = String(ui.voiceRecordSeconds % 60).padStart(2, "0");
  return bScreen({
    photo: "bridge", shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: { who: LF("voice.who_records", store.name(turn)) } })}
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:16px;text-align:center;">
        ${bStar()}
        <h1 class="b-h1">${escHtml(LF("voice.title_for", store.name(other)))}</h1>
      </div>
      ${bCard(`<p class="b-body">${escHtml(L("voice.body"))}</p>`, "margin-top:14px;")}
      <div class="b-spacer"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;">
        ${bRec({ action: "toggleVoiceRecording", arg: turn, recording })}
        <span style="font:400 28px/1 var(--serif);color:#F4EDE4;">${mm}:${ss}</span>
        <span class="b-small">${escHtml(L(recording ? "voice.tap_to_stop" : hasBlob ? "voice.recorded_note" : "voice.tap_to_record"))}</span>
      </div>
      <div class="b-spacer"></div>
      ${hasBlob ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
        ${bCta({ text: L("voice.play"), action: "playVoiceRecording", arg: turn, ghost: true, style: "padding:0;letter-spacing:0.14em;" })}
        ${bCta({ text: L("voice.retry"), action: "retryVoiceRecording", arg: turn, ghost: true, style: "padding:0;letter-spacing:0.14em;" })}
      </div>` : ""}
      ${bCta({ text: L("voice.save"), action: "saveVoiceAndAdvance", enabled: hasBlob })}
      <div style="text-align:center;margin-top:10px;">${bLink({ text: L("voice.not_this_time"), action: "saveVoiceSkip" })}</div>
    `,
  });
}

// =========================================================== Closing
const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
function toRoman(n) {
  return ROMAN_NUMERALS[n - 1] || String(n);
}
function clauseSection(titleKey, texts) {
  if (!texts.length) return "";
  const rows = texts.map((t, i) => `<p class="b-clause"><span class="b-clause__num">${toRoman(i + 1)}.</span><span>${escHtml(t)}</span></p>`).join("");
  return `<div class="b-clause-section"><span class="b-clause-section__title">${escHtml(L(titleKey))}</span>${rows}</div>`;
}

// =========================================================== Contract (V11) — a
// double-gold-bordered "paper" with two roman-numeral sections (what the couple
// stops doing / what they promise), a contract number + date, and a finger-signature
// pad per partner (FIXES-v5 §8). "PDF" prints just this card via the browser's own
// print sheet; "В Фото" keeps the existing share-image flow.
export function contractViewScreen(store) {
  const dateStr = new Date().toLocaleDateString(getLanguage() === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  const contractNo = store.activeProfileId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  const rules = store.couplesAgreement;
  return bScreen({
    photo: "bridge", shade: "text",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar()}
      <h1 class="b-h2" style="margin-top:16px;">${escHtml(L("contract.title"))}</h1>
      ${bPaper(`
        <div class="b-monogram">B</div>
        <span class="b-eyebrow">${escHtml(LF("contract.number", contractNo, dateStr))}</span>
        <h3>${escHtml(LF("closing.names", store.name("partnerA"), store.name("partnerB")))}</h3>
        ${rules.length ? clauseSection("contract.section_stop", rules) : `<p style="margin:8px 0 0;">${escHtml(L("contract.no_rules"))}</p>`}
        ${clauseSection("contract.section_promise", [L("bridge.promise_1"), L("bridge.promise_2")])}
        <div style="height:1px;background:rgba(27,26,24,0.15);margin:10px 0 2px;width:100%;"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;">
          <div style="text-align:left;">
            <canvas class="b-sigpad" width="260" height="110"></canvas>
            <span class="b-clause-section__title" style="margin-top:4px;">${escHtml(LF("contract.signature_of", store.name("partnerA")))}</span>
          </div>
          <div style="text-align:left;">
            <canvas class="b-sigpad" width="260" height="110"></canvas>
            <span class="b-clause-section__title" style="margin-top:4px;">${escHtml(LF("contract.signature_of", store.name("partnerB")))}</span>
          </div>
        </div>
      `, "margin-top:16px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;border:1px solid #C9A45C;box-shadow:0 20px 50px rgba(0,0,0,.45),inset 0 0 0 5px #F4EDE2,inset 0 0 0 6px #C9A45C;")}
      <div class="b-spacer"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        ${bCta({ text: L("contract.save_pdf"), action: "printContract", ghost: true, style: "padding:0;letter-spacing:0.14em;" })}
        ${bCta({ text: L("contract.share"), action: "saveContract", ghost: true, style: "padding:0;letter-spacing:0.14em;" })}
      </div>
      <div style="margin-top:10px;">${bCta({ text: L("contract.sign"), action: "advance" })}</div>
    `,
  });
}

// FIXES-v4 §11: a certificate, not a rosette emoji — a light "paper" card on the
// dark bridge-at-night photo, "Сохранить в Фото" (opens the generated image so it
// can be saved from the share sheet — the honest web equivalent of PHPhotoLibrary,
// there's no native photo library API to call from a PWA), "Завершить игру" makes
// plain that the session is over.
export function closingScreen(store, ui) {
  const dateStr = new Date().toLocaleDateString(getLanguage() === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  const certNo = store.activeProfileId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  return bScreen({
    photo: "ending", shade: "soft",
    contentStyle: "padding:54px 24px 30px;",
    inner: `
      ${bTopbar({ right: null })}
      <div style="text-align:center;margin-top:10px;"><span class="b-eyebrow" style="color:#C9A45C;">${escHtml(L("closing.game_finished"))}</span></div>
      ${bPaper(`
        <div class="b-monogram">B</div>
        <span class="b-eyebrow" style="margin-top:6px;">${escHtml(L("closing.certified_intro"))}</span>
        <h3 style="font-size:30px;margin-top:2px;">${escHtml(LF("closing.names", store.name("partnerA"), store.name("partnerB")))}</h3>
        <p style="margin:6px 0 0;max-width:260px;">${escHtml(L("closing.certificate_body"))}</p>
        ${bStarGlyphInline()}
        <div style="width:60px;height:1px;background:#C9A45C;margin:6px auto;"></div>
        <p style="margin:0;font-size:12px;color:#8A7654;">${escHtml(LF("closing.number", certNo, dateStr))}</p>
      `, "margin-top:18px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;padding:30px 22px;border:1px solid #C9A45C;box-shadow:0 20px 50px rgba(0,0,0,.45),inset 0 0 0 5px #F4EDE2,inset 0 0 0 6px #C9A45C;")}
      <p class="b-body" style="margin-top:18px;text-align:center;">${escHtml(L("closing.encouragement"))}</p>
      <div class="b-spacer"></div>
      ${bCta({ key: "closing.save_to_gallery", action: "saveClosingCard", ghost: true, enabled: !ui.closingSaved })}
      <div style="margin-top:10px;">${bCta({ key: "closing.close", action: "closeSession" })}</div>
    `,
  });
}

function bStarGlyphInline() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.6 7.2 16.8 11.4 24 12 16.8 12.6 12.6 16.8 12 24 11.4 16.8 7.2 12.6 0 12 7.2 11.4 11.4 7.2 12 0Z" fill="#C9A45C"></path></svg>`;
}

// =========================================================== Settings — FIXES-v4
// §12: a dark screen in the app's own style, not a bare system sheet.
export function settingsScreen(store, ui) {
  const idx = MAP_PINS.findIndex((p) => p.kind === store.session.currentRoom);
  const roomNum = idx >= 0 ? idx + 1 : 1;
  const ownerInitial = (store.name("partnerA").trim()[0] || "?").toUpperCase();
  const section = (titleKey, items) => `<span class="b-eyebrow" style="margin-top:20px;color:#C9A45C;">${escHtml(L(titleKey))}</span><div class="b-menu">${items.join("")}</div>`;
  const item = (labelKey, action, { small, danger } = {}) =>
    `<button class="b-menu__item${danger ? " b-menu__item--danger" : ""} pressable" type="button" data-action="${action}"><span>${escHtml(L(labelKey))}${small ? `<small>${escHtml(L(small))}</small>` : ""}</span>${danger ? "" : `<svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 7h19M14 1l6 6-6 6"></path></svg>`}</button>`;
  const toggleRow = (labelKey, on, action) =>
    `<div class="b-menu__item"><span>${escHtml(L(labelKey))}</span><button type="button" class="b-switch${on ? " is-on" : ""}" role="switch" aria-checked="${on}" data-action="${action}"><span class="b-switch__knob"></span></button></div>`;
  return bScreen({
    photo: "living-room", shade: "text",
    contentStyle: "padding:54px 24px 20px;",
    inner: `
      <div class="b-topbar"><h1 class="b-h2" style="margin:0;">${escHtml(L("settings.title"))}</h1><button class="b-iconbtn pressable" type="button" data-action="closeSettings" aria-label="Close"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#EFE6DA" stroke-width="1.5" stroke-linecap="round"><path d="M1 1l12 12M13 1L1 13"></path></svg></button></div>
      <div class="b-owner" style="margin-top:18px;">
        <span class="b-avatar">${escHtml(ownerInitial)}</span>
        <div><div style="font:400 20px/1.1 var(--serif);color:#F4EDE4;">${escHtml(LF("closing.names", store.name("partnerA"), store.name("partnerB")))}</div>
        <div class="b-small" style="margin-top:4px;">${escHtml(LF("settings.owner_room_line", store.name("partnerA"), roomNum))}</div></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button type="button" class="b-chip${getLanguage() === "en" ? " is-on" : ""}" style="flex:1;justify-content:center;" data-action="setLanguageInSettings" data-arg="en">English</button>
        <button type="button" class="b-chip${getLanguage() === "ru" ? " is-on" : ""}" style="flex:1;justify-content:center;" data-action="setLanguageInSettings" data-arg="ru">Русский</button>
      </div>
      ${section("settings.section_progress", [
        item("settings.view_path_row", "openHouseMapFromSettings"),
        item("nav.redo_page", "confirmRedoPage"),
        item("nav.start_over", "confirmStartOver", { small: "settings.start_over_note" }),
      ])}
      ${section("settings.section_relationship", [
        item("settings.relationships_row", "openProfiles"),
        item("settings.voice_notes_row", "openVoiceNotes"),
      ])}
      ${section("settings.section_sound", [
        toggleRow("settings.music_row", isMusicEnabled(), "toggleMusicPref"),
        toggleRow("settings.sound_row", isSoundEnabled(), "toggleSoundPref"),
      ])}
      ${section("settings.section_support", [
        item("settings.crisis_row", "openCrisis"),
        item("settings.disclaimer_row", "openDisclaimerSheet"),
      ])}
      ${section("settings.section_legal", [
        item("settings.privacy_row", "openPrivacy"),
        item("settings.terms_row", "openTerms"),
        item("settings.restore_purchases_row", "restorePurchasesTestMode"),
      ])}
      <div style="margin-top:20px;">${item("settings.delete_data_row", "confirmDeleteData", { danger: true })}</div>
    `,
  });
}

/** Rendered once, on top of whatever screen is current — covers Settings' own
 * sub-sheets (profiles, house map, disclaimer, crisis, legal, language, delete
 * confirm) as well as the Crisis/Terms/Privacy links reachable from the Disclaimer
 * and Paywall screens outside of Settings. All driven by the single `ui.globalSheet`
 * field so there's exactly one place that owns "what modal is on top right now." */
export function globalOverlays(store, ui) {
  let html = "";
  if (ui.globalSheet === "profiles") {
    const rows = store.profiles
      .map((p) => {
        const title = p.partnerAName && p.partnerBName ? `${p.partnerAName} & ${p.partnerBName}` : (p.displayName || L("profiles.new_relationship_fallback"));
        const summary = LF("profiles.summary", p.currency, p.sessionHistory.length);
        return `<button class="settings-row" style="color:var(--ink);flex-direction:column;align-items:flex-start;" data-action="selectProfile" data-arg="${p.id}">
            <span style="font-weight:600;">${escHtml(title)}${p.id === store.activeProfileId ? " ✓" : ""}</span>
            <span class="secondary" style="font-size:13px;">${escHtml(summary)}</span>
          </button>`;
      })
      .join("");
    html += modalSheet(L("profiles.title"), `<div class="settings-group">${rows}</div>
        <p class="secondary" style="padding:14px 4px;font-size:13px;">${escHtml(L("profiles.new_profile_prompt"))}</p>
        <button class="settings-row" data-action="createProfile">${escHtml(L("profiles.start_new"))}</button>`, "closeGlobalSheet");
  }
  if (ui.globalSheet === "voiceNotes") {
    const notes = ui.voiceNotesList;
    // Playing a row (data-action on the row itself) and exporting it (a separate
    // data-action on the small button inside) can share one row because click
    // delegation walks up from the actual click target via closest("[data-action]")
    // — a tap on the export button matches that button first, never the row.
    const rows = (notes || [])
      .map((n, i) => `<div class="settings-row" style="color:var(--ink);align-items:center;" data-action="playVoiceNote" data-arg="${i}">
          <span style="display:flex;flex-direction:column;align-items:flex-start;">
            <span style="font-weight:600;">${escHtml(store.name(n.role))}</span>
            <span class="secondary" style="font-size:13px;">${escHtml(new Date(n.createdAt).toLocaleString())} · ${escHtml(L("voice_notes.play"))}</span>
          </span>
          <button class="btn-secondary" style="width:auto;border-bottom:none;padding:6px 10px;font-size:13px;color:var(--gold);flex:none;" data-action="exportVoiceNote" data-arg="${i}">${escHtml(L("voice_notes.save"))}</button>
        </div>`)
      .join("");
    const body = notes === null
      ? ""
      : notes.length === 0
        ? `<p class="secondary" style="padding:14px 4px;font-size:13px;">${escHtml(L("voice_notes.empty"))}</p>`
        : `<div class="settings-group">${rows}</div>
           <p class="secondary" style="padding:14px 4px;font-size:13px;">${escHtml(L("voice_notes.storage_note"))}</p>`;
    html += modalSheet(L("voice_notes.title"), body, "closeGlobalSheet");
  }
  if (ui.globalSheet === "houseMapSettings") {
    html += fullSheet(houseMapScreen("settings", ui.houseMapTextExpanded));
  }
  if (ui.globalSheet === "disclaimer") {
    html += modalSheet(L("disclaimer.title"), `<p class="f-body">${escHtml(L("disclaimer.body"))}</p>`, "closeGlobalSheet");
  }
  if (ui.globalSheet === "crisis") {
    html += modalSheet(L("crisis.title"), `<div class="stack gap-16">
        <p class="f-body">${escHtml(L("crisis.body"))}</p>
        <p style="font-weight:600;">${escHtml(L("crisis.us_line"))}</p>
        <p style="font-weight:600;">${escHtml(L("crisis.international_line"))}</p>
      </div>`, "closeGlobalSheet", L("crisis.close"));
  }
  if (ui.globalSheet === "privacy") {
    html += modalSheet(L("privacy.title"), `<p class="f-body" style="white-space:pre-wrap;">${escHtml(L("privacy.full_text"))}</p>`, "closeGlobalSheet");
  }
  if (ui.globalSheet === "terms") {
    html += modalSheet(L("terms.title"), `<p class="f-body" style="white-space:pre-wrap;">${escHtml(L("terms.full_text"))}</p>`, "closeGlobalSheet");
  }
  if (ui.globalSheet === "deleteConfirm") {
    html += confirmDialog(L("settings.delete_confirm_title"), L("settings.delete_confirm_message"), L("settings.delete_confirm_button"), "deleteData", L("settings.cancel"), "closeGlobalSheet");
  }
  if (ui.globalSheet === "startOverConfirm") {
    html += confirmDialog(L("nav.start_over"), L("nav.start_over_walk_message"), L("nav.start_over"), "startOver", L("settings.cancel"), "closeGlobalSheet");
  }
  if (ui.globalSheet === "redoPageConfirm") {
    html += confirmDialog(L("nav.start_over_confirm_title"), L("nav.start_over_confirm_message"), L("nav.redo_page"), "redoPage", L("settings.cancel"), "closeGlobalSheet");
  }
  return html;
}

function fullSheet(inner) {
  return `<div class="sheet-backdrop" data-action="backdropClose" data-close="closeGlobalSheet" style="align-items:stretch;">
      <div class="sheet" style="height:100%;border-radius:0;">${inner}</div>
    </div>`;
}

function modalSheet(title, body, closeAction, closeLabel) {
  return `<div class="sheet-backdrop" data-action="backdropClose" data-close="${closeAction}">
      <div class="sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header"><span>${escHtml(title)}</span><button data-action="${closeAction}">${escHtml(closeLabel || L("settings.done"))}</button></div>
        <div class="sheet-body">${body}</div>
      </div>
    </div>`;
}

function confirmDialog(title, message, confirmLabel, confirmAction, cancelLabel, cancelAction) {
  return `<div class="sheet-backdrop" data-action="backdropClose" data-close="${cancelAction}">
      <div style="background:#fff;border-radius:16px;margin:0 24px;padding:20px;max-width:340px;">
        <div style="font-weight:700;margin-bottom:8px;">${escHtml(title)}</div>
        <div class="secondary" style="margin-bottom:16px;">${escHtml(message)}</div>
        <button class="pressable" data-action="${confirmAction}" style="width:100%;padding:12px;border:none;border-radius:10px;background:#cc3333;color:#fff;font-weight:600;margin-bottom:8px;">${escHtml(confirmLabel)}</button>
        <button class="pressable" data-action="${cancelAction}" style="width:100%;padding:12px;border:none;border-radius:10px;background:rgba(0,0,0,0.06);font-weight:600;">${escHtml(cancelLabel)}</button>
      </div>
    </div>`;
}

// =========================================================== Paywall
export function paywallScreen(ui) {
  return `<div class="screen" style="align-items:center;text-align:center;">
      <div class="spacer"></div>
      <div style="font-size:48px;">🔓</div>
      <h1 class="f-serif-title" style="font-size:var(--text-section-title);">${escHtml(L("paywall.title"))}</h1>
      <p class="editorial-body" style="color:rgba(23,23,26,0.7);">${escHtml(L("paywall.body"))}</p>
      <p class="secondary" style="font-size:13px;">${escHtml(L("paywall.packs_coming_soon"))}</p>
      <p style="font-size:12px;color:#a15b00;font-weight:700;margin-top:8px;">TEST MODE — no real payment on the PWA; see PARITY.md</p>
      <div class="spacer"></div>
      ${primaryButton({ text: "Unlock (test mode)", action: "unlockTestMode" })}
      ${secondaryButton({ key: "paywall.maybe_later", action: "closePaywall" })}
      <div style="display:flex;gap:16px;margin-top:16px;font-size:13px;" class="secondary">
        <button data-action="openTerms" style="background:none;border:none;color:inherit;">${escHtml(L("terms.title"))}</button>
        <span>·</span>
        <button data-action="openPrivacy" style="background:none;border:none;color:inherit;">${escHtml(L("privacy.title"))}</button>
      </div>
    </div>`;
}
