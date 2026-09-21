import { L, LF, deck, room, allRoomKinds } from "./content.js";
import {
  primaryButton, secondaryButton, dots, timerBanner, placedCards,
  deckDropdownList, deckSheet, revealOverlay, roomHeader, waitingBadge, escHtml, escAttr,
} from "./components.js";

const STATE_KEYS = ["hurt", "angry", "scared", "guilty", "ashamed", "sad", "confused"];

/** Every photo-backed screen (a room, house map, welcome, etc.): the background photo
 * sits at z-index 0, `inner` renders into a full-size flex column at z-index 1 above
 * it — a real stacking order, not just DOM order, so nothing about the background
 * layer can ever intercept a tap meant for the content above it. */
function photoScreen(imageName, inner, { dim = true, gradient = false, contentStyle = "" } = {}) {
  return `<div class="screen flush no-scroll">
      <div class="photo-screen" style="background-image:url('assets/rooms/${imageName}.jpg')">
        ${dim ? '<div class="photo-dim"></div>' : ""}
        ${gradient ? '<div class="photo-gradient-bottom"></div>' : ""}
      </div>
      <div class="photo-content" style="${contentStyle}">${inner}</div>
    </div>`;
}

// =========================================================== Language picker
export function languageScreen() {
  return photoScreen("house-exterior", `
      <div class="spacer"></div>
      <div class="f-serif-title on-photo" style="font-size:40px;">Bridge</div>
      <div class="stack gap-16" style="margin-top:32px;width:100%;max-width:340px;">
        <div class="on-photo" style="font-weight:500;">Choose your language</div>
        <div class="on-photo" style="font-weight:500;">Выберите язык</div>
      </div>
      <div class="stack gap-16" style="margin-top:24px;width:100%;max-width:340px;">
        <button class="lang-btn pressable f-button" data-action="setLanguage" data-arg="en">English</button>
        <button class="lang-btn pressable f-button" data-action="setLanguage" data-arg="ru">Русский</button>
      </div>
      <div class="spacer"></div>`,
    { contentStyle: "align-items:center;justify-content:center;text-align:center;padding:24px;" });
}

// =========================================================== Welcome
export function welcomeScreen() {
  return photoScreen("house-exterior", `
      <div class="spacer"></div>
      <div class="f-serif-title on-photo" style="font-size:42px;">${escHtml(L("app.name"))}</div>
      <p class="on-photo secondary" style="max-width:320px;margin:8px auto 0;">${escHtml(L("app.tagline"))}</p>
      <div class="spacer"></div>
      ${primaryButton({ key: "welcome.begin", action: "beginFromWelcome", onDark: true })}`,
    { gradient: true, contentStyle: "text-align:center;padding:24px;" });
}

// =========================================================== Onboarding text pages
export function onboardingTextPage({ titleKey, bodyKey, buttonKey, pageIndex, pageCount, action }) {
  return `<div class="screen">
      ${dots(pageCount, pageIndex)}
      <div class="spacer"></div>
      <h1 class="f-serif-title" style="font-size:26px;">${escHtml(L(titleKey))}</h1>
      <p class="f-body secondary">${escHtml(L(bodyKey))}</p>
      <div class="spacer"></div>
      ${primaryButton({ key: buttonKey, action })}
    </div>`;
}

// =========================================================== Disclaimer
export function disclaimerScreen() {
  return `<div class="screen">
      <div class="spacer"></div>
      <h1 class="f-serif-title" style="font-size:26px;">${escHtml(L("disclaimer.title"))}</h1>
      <p class="f-body secondary">${escHtml(L("disclaimer.body"))}</p>
      <button data-action="openCrisis" style="background:none;border:none;text-align:left;font-weight:600;font-size:14px;padding:0;margin-top:16px;">${escHtml(L("disclaimer.need_help_now"))}</button>
      <div class="spacer"></div>
      ${primaryButton({ key: "disclaimer.continue", action: "advance" })}
    </div>`;
}

// =========================================================== House Map
export function houseMapScreen(ctx, textExpanded) {
  const card = `<div style="padding:18px;background:rgba(255,255,255,0.55);backdrop-filter:blur(16px);border-radius:18px;margin:0 24px;">
      <div class="f-serif-title on-photo" style="font-size:24px;color:#111;">${escHtml(L("housemap.title"))}</div>
      <p class="f-body" style="color:rgba(0,0,0,0.85);margin-top:10px;">${escHtml(L("housemap.body"))}</p>
      <button class="pressable" data-action="collapseHouseMapText" style="width:100%;text-align:center;background:rgba(183,148,76,0.2);border:none;border-radius:12px;padding:10px;margin-top:10px;color:var(--gold);font-weight:700;font-size:15px;">✓ ${escHtml(L("room.read_it"))}</button>
    </div>`;
  const pill = `<button class="pressable" data-action="expandHouseMapText" style="align-self:center;display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.55);backdrop-filter:blur(14px);border:none;border-radius:20px;padding:10px 16px;font-weight:700;"><span class="chevron">▾</span>${escHtml(L("room.expand"))}</button>`;
  const btnKey = ctx === "onboarding" ? "housemap.button_first" : "housemap.button_reopen";
  return photoScreen("house-map", `
      <div class="spacer"></div>
      ${textExpanded ? card : pill}
      <div class="spacer"></div>
      <div style="padding:0 24px;">${primaryButton({ key: btnKey, action: "houseMapContinue", onDark: true, testId: "uitest.housemap.continue" })}</div>`,
    { dim: false, contentStyle: "justify-content:flex-end;padding-bottom:calc(var(--safe-b) + 28px);" });
}

// =========================================================== Names
export function namesScreen(store) {
  return `<div class="screen form-screen">
      <div class="spacer" style="flex:0 0 20px;"></div>
      <h1 class="f-serif-title" style="font-size:26px;">${escHtml(L("names.title"))}</h1>
      <div class="stack gap-16" style="margin-top:20px;">
        <div class="field-row"><span class="dot a"></span>
          <input id="nameA" class="text-field" placeholder="${escAttr(L("names.partner_a_placeholder"))}" value="${escAttr(store.session.partnerA.name)}">
        </div>
        <div class="field-row"><span class="dot b"></span>
          <input id="nameB" class="text-field" placeholder="${escAttr(L("names.partner_b_placeholder"))}" value="${escAttr(store.session.partnerB.name)}">
        </div>
      </div>
      <div class="spacer" style="flex:0 0 24px;"></div>
      ${primaryButton({ key: "names.continue", action: "submitNames" })}
    </div>`;
}

// =========================================================== Couple's Agreement
export function couplesAgreementScreen(store, ui) {
  const exampleKeys = Array.from({ length: 7 }, (_, i) => `couples_agreement.example.${String(i + 1).padStart(2, "0")}`);
  const active = store.couplesAgreement;
  const remaining = exampleKeys.filter((k) => !active.includes(L(k)));
  let rows = "";
  if (active.length) {
    rows += `<div class="sheet-section-title">${escHtml(L("couples_agreement.your_rules_header"))}</div>`;
    rows += active
      .map((rule, i) => `<button class="rule-row active pressable" data-action="removeRule" data-arg="${i}">
          <span style="color:var(--gold)">✓</span><span>${escHtml(rule)}</span>
          <span class="tail">${escHtml(L("couples_agreement.tap_to_remove"))}</span>
        </button>`)
      .join("");
  }
  if (remaining.length) {
    rows += `<div class="sheet-section-title">${escHtml(L("couples_agreement.suggestions_header"))}</div>`;
    rows += remaining
      .map((k) => `<button class="rule-row suggestion pressable" data-action="addRuleFromKey" data-arg="${escAttr(k)}">
          <span>○</span><span>${escHtml(L(k))}</span>
        </button>`)
      .join("");
  }
  return `<div class="screen form-screen">
      <h1 class="f-serif-title" style="font-size:26px;">${escHtml(L("couples_agreement.title"))}</h1>
      <p class="f-body secondary">${escHtml(L("couples_agreement.subtitle"))}</p>
      <div class="stack gap-8" style="margin-top:14px;max-height:38vh;overflow-y:auto;">${rows}</div>
      <div class="field-row" style="margin-top:14px;">
        <input id="newRuleInput" class="text-field" placeholder="${escAttr(L("couples_agreement.placeholder"))}" value="${escAttr(ui.newRuleDraft)}">
        <button class="pressable" data-action="addCustomRule" style="padding:0 16px;border-radius:10px;border:none;background:var(--ink);color:#fff;font-weight:600;height:44px;">${escHtml(L("couples_agreement.add_rule"))}</button>
      </div>
      <div class="spacer" style="flex:0 0 16px;"></div>
      <div style="display:flex;gap:12px;">
        <div style="flex:1">${secondaryButton({ key: "couples_agreement.skip_for_now", action: "advance" })}</div>
        <div style="flex:1">${primaryButton({ key: "couples_agreement.save", action: "advance", compact: false })}</div>
      </div>
    </div>`;
}

// =========================================================== Dice
const DIE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export function diceScreen(ui, store) {
  const rotation = ui.diceRolling ? 720 : 0;
  const stage = store.diceStage;
  const subtitle = store.diceJustTied
    ? L("dice.tie")
    : stage === "done"
    ? L("dice.subtitle")
    : LF("dice.subtitle_for", store.name(stage));
  return `<div class="screen" style="align-items:center;text-align:center;">
      <div class="spacer"></div>
      <h1 class="f-serif-title" style="font-size:26px;">${escHtml(L("dice.title"))}</h1>
      <p class="secondary" style="${store.diceJustTied ? "color:#c0392b;font-weight:600;" : ""}">${escHtml(subtitle)}</p>
      <div class="die-face" style="transform:rotate(${rotation}deg);margin:20px 0;font-size:64px;">${DIE_FACES[(ui.diceFace || 1) - 1]}</div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${stage !== "partnerA" && store.diceValueA != null ? `<p style="font-weight:600;">${escHtml(LF("dice.value", store.name("partnerA"), store.diceValueA))}</p>` : ""}
        ${stage === "done" && store.diceValueB != null ? `<p style="font-weight:600;">${escHtml(LF("dice.value", store.name("partnerB"), store.diceValueB))}</p>` : ""}
      </div>
      ${stage === "done" && store.session.firstToSpeak ? `<p style="font-weight:700;color:${store.session.firstToSpeak === "partnerA" ? "var(--purple)" : "var(--green)"}">${escHtml(LF("dice.result", store.name(store.session.firstToSpeak)))}</p>` : ""}
      <div class="spacer"></div>
      ${stage === "done" ? primaryButton({ key: "oath.ready", action: "advance" }) : primaryButton({ key: "dice.roll", action: "rollDice" })}
    </div>`;
}

// =========================================================== Intensity & State
function intensityColor(v) {
  const t = v / 10;
  const r = Math.round((0.55 + 0.4 * t) * 255);
  const g = Math.round((0.45 - 0.35 * t) * 255);
  const b = Math.round((0.2 - 0.15 * t) * 255);
  return `rgb(${r},${g},${b})`;
}

export function intensityScreen(store, ui) {
  const section = (role, colorVar, tint) => {
    const intensity = ui.intensity[role];
    const selected = ui.stateSelected[role];
    const vivid = intensityColor(intensity);
    const summary = selected.length
      ? selected.map((s) => L(`state.${s}`)).sort().join(", ")
      : `<span class="secondary">${escHtml(L("intensity.state_placeholder"))}</span>`;
    return `<div class="partner-section" style="background:${tint}">
        <div class="field-row"><span class="dot ${role === "partnerA" ? "a" : "b"}"></span><span class="f-serif-headline">${escHtml(store.name(role))}</span></div>
        <div class="f-caption secondary" style="margin-top:10px;">${escHtml(L("intensity.slider_label"))}</div>
        <div class="field-row">
          <input type="range" min="0" max="10" step="1" value="${intensity}" style="--slider-color:${vivid}" data-action="intensitySlider" data-arg="${role}">
          <span style="font-weight:700;width:28px;color:${vivid}">${intensity}</span>
        </div>
        <span class="overwhelmed-flag" style="background:${vivid};${intensity >= 7 ? "" : "display:none;"}">${escHtml(L("intensity.overwhelmed_flag"))}</span>
        <div class="f-caption secondary" style="margin-top:10px;">${escHtml(L("intensity.state_label"))}</div>
        <button class="pressable" data-action="openStatePicker" data-arg="${role}" style="width:100%;text-align:left;background:var(--gold);color:var(--ink);border:1px solid rgba(23,23,26,0.25);border-radius:12px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:600;">
          <span>${summary}</span><span>▾</span>
        </button>
        <input class="text-field" style="margin-top:10px;" placeholder="${escAttr(L("intensity.custom_placeholder"))}" id="custom-${role}" value="${escAttr(ui.stateCustom[role])}">
      </div>`;
  };
  const filled = (role) => ui.stateSelected[role].length > 0 || ui.stateCustom[role].trim().length > 0;
  const ready = filled("partnerA") && filled("partnerB");
  const picker = ui.openStatePickerRole
    ? statePickerSheet(store, ui, ui.openStatePickerRole)
    : "";
  return `<div class="screen">
      <h1 class="f-serif-title">${escHtml(L("intensity.title"))}</h1>
      <div class="stack gap-20" style="margin-top:20px;">
        <div style="transform:rotate(180deg)">${section("partnerB", "green", "rgba(183,148,76,0.06)")}</div>
        ${section("partnerA", "purple", "rgba(23,23,26,0.06)")}
      </div>
      <div style="margin-top:20px;">${primaryButton({ key: "intensity.continue", action: "submitIntensityState", enabled: ready })}</div>
    </div>${picker}`;
}

function statePickerSheet(store, ui, role) {
  const rows = STATE_KEYS.map((s) => {
    const checked = ui.stateSelected[role].includes(s);
    return `<button class="sheet-row pressable" data-action="toggleStateOption" data-arg="${role}" data-arg2="${s}">
        <span>${escHtml(L(`state.${s}`))}</span>${checked ? '<span class="check">✓</span>' : ""}
      </button>`;
  }).join("");
  // partnerB's whole section on the intensity screen is rotated 180deg (they're sitting
  // across the table, reading upside down otherwise) — a sheet opened from that section
  // has to rotate the same way, or it pops up right-side-up for the WRONG partner. The
  // rotation goes on an inner wrapper, not `.sheet` itself, since `.sheet` already
  // animates its own `transform` for the slide-up and a second transform there would
  // just replace it instead of combining.
  const rotation = role === "partnerB" ? 180 : 0;
  return `<div class="sheet-backdrop" data-action="backdropClose" data-close="closeStatePicker">
      <div class="sheet">
        <div style="transform:rotate(${rotation}deg)">
          <div class="sheet-handle"></div>
          <div class="sheet-header"><span>${escHtml(L("intensity.state_label"))}</span><button data-action="closeStatePicker">${L("room.done")}</button></div>
          <div class="sheet-body">${rows}</div>
        </div>
      </div>
    </div>`;
}

// =========================================================== Calm Down
export function calmDownScreen(ui) {
  return `<div class="screen" style="align-items:center;text-align:center;">
      <div class="spacer"></div>
      <h1 class="f-serif-title" style="font-size:26px;">${escHtml(L("calm_down.title"))}</h1>
      <p class="f-body secondary">${escHtml(L("calm_down.body"))}</p>
      <div class="breathing-circle${ui.breathing ? " breathing" : ""}" style="${ui.breathing ? "" : "transform:scale(0.6);"}"></div>
      <div class="spacer"></div>
      ${ui.breathing
        ? primaryButton({ key: "onboarding.got_it", action: "advance" })
        : primaryButton({ key: "calm_down.start_breathing", action: "startBreathing" }) + secondaryButton({ key: "calm_down.skip", action: "advance" })}
    </div>`;
}

// =========================================================== Oath
export function oathScreen() {
  return `<div class="screen" style="align-items:center;text-align:center;">
      <div class="spacer"></div>
      <h1 class="f-serif-title" style="font-size:26px;">${escHtml(L("oath.title"))}</h1>
      <p class="secondary">${escHtml(L("oath.instruction"))}</p>
      <p class="f-body" style="font-style:italic;font-size:19px;">${escHtml(L("oath.text"))}</p>
      <div class="spacer"></div>
      ${primaryButton({ key: "oath.ready", action: "completeOathAndAdvance" })}
    </div>`;
}

// =========================================================== Ritual (Hold Hands)
// A plain list to read aloud, not a UI choice — nothing here is tappable; both
// partners choose out loud, together, which phrase fits (or say both). The one and
// only control on this screen is the continue button below.
export function ritualScreen(ui) {
  const lines = ["ritual.line_1", "ritual.line_2"];
  const options = lines
    .map((key) => `<div
        style="width:100%;text-align:left;padding:16px;border-radius:14px;border:1.3px solid rgba(23,23,26,0.15);background:var(--ivory);color:var(--ink);">
        <span class="f-serif-headline" style="font-size:18px;font-weight:700;">${escHtml(L(key))}</span>
      </div>`)
    .join("");
  return `<div class="screen" style="align-items:center;text-align:center;">
      <div class="spacer"></div>
      <h1 class="f-serif-title" style="font-size:26px;">${escHtml(L("ritual.title"))}</h1>
      <p class="secondary">${escHtml(L("ritual.instruction"))}</p>
      <div class="stack gap-12" style="width:100%;margin-top:20px;">${options}</div>
      <div class="spacer"></div>
      ${primaryButton({ key: "ritual.continue", action: "completeRitualAndAdvance", enabled: true })}
    </div>`;
}

// =========================================================== Generic room
export function roomScreen(store, ui, kind) {
  const cfg = room(kind);
  const isSequential = cfg.modes.includes("speaks");
  const active = store.activePartner;
  const rotation = isSequential ? store.seatRotation(active) : 0;
  const activeColorClass = active === "partnerA" ? "a" : "b";

  const header = roomHeader(cfg, { activeRoleName: isSequential ? store.name(active) : null, activeRoleDotClass: activeColorClass, expanded: ui.headerExpanded });

  let body;
  if (isSequential) {
    body = `<div class="seat-rotator${rotation ? " flipped" : ""}">
        <div class="photo-screen" style="background-image:url('assets/rooms/${cfg.backgroundImage}.jpg')"></div>
        <div class="seat-content">
          ${header}
          <div class="spacer" style="flex:0 0 8px;"></div>
          ${placedCards(store)}
          <div style="padding:0 16px;margin-top:8px;">${timerBanner(store)}</div>
          ${deckDropdownList(cfg.deckIds)}
          <div class="spacer"></div>
          ${flagRow()}
          <div style="padding:0 16px 16px;text-align:right;">
            <button class="pressable" data-action="markRoomDoneActive" ${store.placedCardsThisTurn.length === 0 ? "disabled" : ""} style="background:${store.placedCardsThisTurn.length === 0 ? "rgba(120,120,120,0.55)" : (active === "partnerA" ? "var(--purple)" : "var(--green)")};color:#fff;border:none;border-radius:24px;padding:12px 24px;font-weight:700;">${escHtml(L("room.done"))}</button>
          </div>
        </div>
      </div>
      ${waitingBadge(store, store.other(active), active)}`;
  } else {
    const doneRow = (role, colorClass) => {
      const done = store.roomDoneFlags[role];
      return `<button class="pressable" data-action="setActivePartner" data-arg="${role}" style="display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.55);backdrop-filter:blur(10px);border:none;border-radius:20px;padding:8px 10px;font-weight:600;font-size:13px;">
          <span class="dot ${colorClass}"></span>${escHtml(store.name(role))}${active === role ? " 👆" : ""}
        </button>
        <button class="pressable" data-action="markRoomDone" data-arg="${role}" ${done ? "disabled" : ""}
          style="padding:8px 14px;border-radius:20px;border:none;font-weight:600;font-size:13px;color:${done ? "rgba(0,0,0,0.4)" : "#fff"};background:${done ? "rgba(255,255,255,0.4)" : (colorClass === "a" ? "var(--purple)" : "var(--green)")};">${escHtml(L("room.done"))}</button>`;
    };
    body = `${header}
      <div class="spacer" style="flex:0 0 8px;"></div>
      ${placedCards(store)}
      <div style="padding:0 16px;margin-top:8px;">${timerBanner(store)}</div>
      ${cfg.deckIds.length ? deckDropdownList(cfg.deckIds) : '<div class="spacer" style="flex:0 0 24px;"></div>'}
      <div class="spacer"></div>
      <div style="display:flex;gap:12px;padding:16px;">${doneRow("partnerA", "a")}${doneRow("partnerB", "b")}</div>`;
  }

  const sheet = ui.openDeckId ? deckSheet(ui.openDeckId, null, ui.customCardDraft, rotation) : "";
  // `.screen` already establishes a positioning context via its own `position: absolute;
  // inset: 0` (filling #app) — overriding that to `position: relative` here (as this used
  // to do) drops the "inset: 0" sizing entirely, so with every child of this div itself
  // absolutely positioned (.seat-rotator/.seat-content, both inset:0) nothing is left to
  // give `.screen` an intrinsic height. It collapses to 0 and its absolutely-positioned
  // children collapse right along with it — down to just their own safe-area padding —
  // which reads as "the room is broken": almost everything renders scrolled out of the
  // sliver that's left, and taps miss whatever accidentally still overlaps it.
  const screen = isSequential
    ? `<div class="screen flush no-scroll">${body}</div>`
    : photoScreen(cfg.backgroundImage, body, { dim: false });
  return screen + revealOverlay(store) + sheet;
}

function flagRow() {
  return `<div style="padding:0 16px;">
      <button class="pressable" data-action="flagAgreementBroken" style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.55);backdrop-filter:blur(10px);border-radius:20px;padding:6px 12px;font-size:13px;font-weight:600;">
        🚩 <span>${escHtml(L("room.flag_broken"))}</span>
      </button>
    </div>`;
}

// =========================================================== Basement
// Two stages, neither of which loops back into the other: (1) both partners voice
// whichever fears they choose from the list, each tapping their own Done when
// finished; (2) a free, untimed-per-question window for up to 15 verbal yes/no
// questions, ended the same way. Never rotates — both partners read and use it
// together, side by side. Mirrors BasementView.swift's redesign.
export function basementScreen(store, ui) {
  const cfg = room("basement");
  const stage = store.basementStage;
  const header = roomHeader(cfg, {
    expanded: ui.headerExpanded,
    instructionKeyOverride: stage === "fears" ? null : "basement.questions_instruction",
    hideExtras: stage !== "fears",
  });

  const doneButton = (role) => {
    const done = store.roomDoneFlags[role];
    return `<button class="pressable" data-action="${stage === "fears" ? "markBasementFearsDone" : "markBasementQuestionsDone"}" data-arg="${role}" ${done ? "disabled" : ""}
        style="flex:1;display:flex;align-items:center;gap:6px;justify-content:space-between;padding:12px 16px;border-radius:16px;border:1px solid rgba(23,23,26,${done ? "0.15" : "0.35"});font-weight:700;color:${done ? "rgba(23,23,26,0.45)" : "var(--ink)"};background:${done ? "rgba(255,255,255,0.5)" : "var(--gold)"};">
        <span style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:13px;"><span class="dot ${role === "partnerA" ? "a" : "b"}"></span>${escHtml(store.name(role))}</span>
        <span>${escHtml(L("room.done"))}</span>
      </button>`;
  };
  const doneRow = `<div style="display:flex;gap:12px;padding:16px;">${doneButton("partnerA")}${doneButton("partnerB")}</div>`;

  let content;
  if (stage === "fears") {
    const switcher = ["partnerA", "partnerB"]
      .map((role) => `<button class="pressable" data-action="setActivePartner" data-arg="${role}" style="display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:20px;border:1px solid rgba(23,23,26,0.2);font-weight:600;font-size:13px;background:${store.activePartner === role ? "var(--gold)" : "var(--ivory)"};color:var(--ink);">
          <span class="dot ${role === "partnerA" ? "a" : "b"}"></span>${escHtml(store.name(role))}${store.activePartner === role ? " 👆" : ""}
        </button>`)
      .join("");
    content = `<div class="read-together-row" style="padding-top:6px;"><span class="read-together-badge">${escHtml(L("nav.read_together"))}</span></div>
      ${header}
      <div class="spacer" style="flex:0 0 8px;"></div>
      ${placedCards(store)}
      <div style="display:flex;gap:8px;padding:6px 16px 0;">${switcher}</div>
      ${deckDropdownList(["fears"])}
      ${doneRow}`;
  } else {
    content = `<div class="read-together-row" style="padding-top:6px;"><span class="read-together-badge">${escHtml(L("nav.read_together"))}</span></div>
      ${header}
      <div class="spacer" style="flex:0 0 12px;"></div>
      <div style="padding:0 16px;">${timerBanner(store)}</div>
      <div class="spacer"></div>
      ${doneRow}`;
  }

  const sheet = ui.openDeckId ? deckSheet("fears", null, ui.customCardDraft, 0) : "";
  return photoScreen("basement", content, { dim: true }) + sheet;
}

/** Done only ever finishes the room once BOTH partners have tapped it during their
 * own asking turn — turns only change hands after a full ask+answer round, so
 * without this note, a partner can tap Done, watch nothing happen, and not
 * understand why. Mirrors the same hint in BasementView.swift on iOS. */
// =========================================================== Bridge Finale
const BRIDGE_KIND_ORDER = ["stepToward", "need", "gift"];
const BRIDGE_DECK_ID = { stepToward: "step_toward", need: "needs_connection", gift: "gifts" };
const BRIDGE_PROMPT_KEY = { stepToward: "bridge.choose_step_toward", need: "bridge.choose_need", gift: "bridge.choose_gift" };

export function bridgeFinaleScreen(store, ui) {
  const activeTab = ui.bridgeActiveTab;
  const currentKind = BRIDGE_KIND_ORDER.find((k) => !store.selectedBridgeCardID(k, activeTab));
  const mandatoryCard = deck("step_toward").cards.find((c) => c.id === "step_toward_x_12");

  let deckBlock;
  if (currentKind) {
    const index = BRIDGE_KIND_ORDER.indexOf(currentKind) + 1;
    const d = deck(BRIDGE_DECK_ID[currentKind]);
    const cards = d.cards.filter((c) => !(currentKind === "stepToward" && c.id === "step_toward_x_12"));
    const grid = cards
      .map((c) => {
        const selected = store.selectedBridgeCardID(currentKind, activeTab) === c.id;
        return `<button class="pressable${selected ? " selected" : ""}" data-action="selectBridgeCard" data-arg="${currentKind}" data-arg2="${c.id}">
            ${selected ? "✓ " : ""}${escHtml(L(c.textKey))}
          </button>`;
      })
      .join("");
    deckBlock = `<div class="stack gap-12" style="padding:16px;max-height:380px;overflow-y:auto;">
        <div class="step-progress">
          ${dots(3, index - 1, true)}
          <span class="f-label secondary">${escHtml(LF("bridge.step_progress", index, 3))}</span>
        </div>
        <div class="deck-prompt">${escHtml(L(BRIDGE_PROMPT_KEY[currentKind]))}</div>
        <div class="deck-grid">${grid}</div>
      </div>`;
  } else {
    deckBlock = `<div style="padding:20px;text-align:center;margin:0 16px;background:var(--ivory);border:1px solid rgba(204,171,102,0.5);border-radius:16px;color:var(--ink);">
        <div style="font-size:30px;">✓</div>
        <p style="font-weight:600;">${escHtml(LF("bridge.partner_cards_done", store.name(activeTab)))}</p>
      </div>`;
  }

  const mandatoryDoneA = store.session.bridgeFinal.partnerA?.completedMandatoryCard;
  const mandatoryDoneB = store.session.bridgeFinal.partnerB?.completedMandatoryCard;

  return photoScreen("bridge", `
      <div class="bridge-header">
        <div class="f-serif-title" style="font-size:30px;">${escHtml(L("bridge.title"))}</div>
        <p style="font-weight:500;">${escHtml(L("bridge.question"))}</p>
        <p style="font-size:13px;font-weight:600;">${escHtml(L("bridge.choose_all_prompt"))}</p>
      </div>
      <div class="bridge-tabs">
        <button class="${activeTab === "partnerA" ? "active" : ""}" data-action="setBridgeTab" data-arg="partnerA">${escHtml(store.session.partnerA.name)}</button>
        <button class="${activeTab === "partnerB" ? "active" : ""}" data-action="setBridgeTab" data-arg="partnerB">${escHtml(store.session.partnerB.name)}</button>
      </div>
      ${deckBlock}
      <div class="mandatory-section">
        <div class="secondary" style="font-size:13px;">${escHtml(L("bridge.mandatory_card_prompt"))}</div>
        <div style="font-weight:600;">${escHtml(L(mandatoryCard.textKey))}</div>
        <div class="mandatory-check-row">
          <button class="pressable" style="background:${mandatoryDoneA ? "rgba(23,23,26,0.35)" : "rgba(23,23,26,0.15)"}" data-action="completeMandatoryCard" data-arg="partnerA" ${mandatoryDoneA ? "disabled" : ""}>${mandatoryDoneA ? "✓" : "○"} ${escHtml(store.session.partnerA.name)}</button>
          <button class="pressable" style="background:${mandatoryDoneB ? "rgba(183,148,76,0.4)" : "rgba(183,148,76,0.15)"}" data-action="completeMandatoryCard" data-arg="partnerB" ${mandatoryDoneB ? "disabled" : ""}>${mandatoryDoneB ? "✓" : "○"} ${escHtml(store.session.partnerB.name)}</button>
        </div>
      </div>
      <div class="together-section">
        ${primaryButton({ key: "bridge.same_side_button", action: "advance", enabled: store.bridgeFinaleComplete() })}
      </div>`,
    { dim: false });
}

// =========================================================== Voice Snapshot
export function voiceSnapshotScreen(store, ui) {
  const row = (role, colorClass) => {
    const recording = ui.recordingRole === role;
    const recorded = store.session.voiceNoteRecorded[role];
    return `<div style="display:flex;align-items:center;gap:10px;padding:14px;border-radius:14px;background:rgba(255,255,255,0.18);backdrop-filter:blur(10px);">
        <span class="dot ${colorClass}"></span>
        <span class="on-photo" style="font-weight:500;">${escHtml(store.name(role))}</span>
        <span class="spacer"></span>
        ${recorded ? '<span class="on-photo secondary" style="font-size:13px;">✓</span>' : ""}
        <button class="pressable" data-action="toggleVoiceRecording" data-arg="${role}" style="background:none;border:none;font-size:26px;color:${colorClass === "a" ? "var(--purple)" : "var(--gold)"};">${recording ? "⏹" : "🎙"}</button>
      </div>`;
  };
  return photoScreen("end", `
      <div class="spacer"></div>
      <h1 class="f-serif-title on-photo" style="font-size:24px;">${escHtml(L("voice.title"))}</h1>
      <p class="on-photo secondary">${escHtml(L("voice.body"))}</p>
      <div class="stack gap-12" style="margin-top:16px;">${row("partnerA", "a")}${row("partnerB", "b")}</div>
      <div class="spacer"></div>
      ${primaryButton({ key: "voice.save", action: "advance", onDark: true })}
      ${secondaryButton({ key: "voice.not_this_time", action: "advance", onPhoto: true })}`,
    { contentStyle: "padding:28px;text-align:center;" });
}

// =========================================================== Closing
export function closingScreen(ui) {
  const dateStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return photoScreen("ending", `
      <div class="spacer"></div>
      <div class="closing-card">
        <div class="rosette">🏅</div>
        <div class="f-serif-title" style="font-size:30px;">${escHtml(L("closing.title"))}</div>
        <div class="secondary">${dateStr}</div>
        <div class="stack gap-8">
          <div style="font-size:19px;">${escHtml(L("closing.line_1"))}</div>
          <div style="font-size:19px;font-weight:600;">${escHtml(L(ui.closingLineIsCourage ? "closing.line_2b" : "closing.line_2a"))}</div>
        </div>
      </div>
      <p class="on-photo secondary" style="margin-top:20px;">${escHtml(L("closing.save_prompt"))}</p>
      <div class="spacer"></div>
      ${primaryButton({ key: "closing.save_to_gallery", action: "saveClosingCard", enabled: !ui.closingSaved, onDark: true })}
      ${secondaryButton({ key: "closing.close", action: "closeSession", onPhoto: true })}`,
    { contentStyle: "padding:28px;text-align:center;" });
}

// =========================================================== Settings
export function settingsScreen(store, ui) {
  const appVersion = "1.0 (PWA)";
  return `<div class="screen flush" style="background:#f2f2f4;">
      <div class="top-bar"><span style="width:60px;"></span><span>${escHtml(L("settings.title"))}</span>
        <button data-action="closeSettings">${escHtml(L("settings.done"))}</button></div>
      <div style="padding:0 16px;overflow-y:auto;">
        <div class="settings-section-title">${escHtml(L("settings.section_progress") || "Progress")}</div>
        <div class="settings-group">
          <button class="settings-row" data-action="confirmRedoPage">${escHtml(L("nav.redo_page"))}</button>
          <button class="settings-row destructive" data-action="confirmStartOver">${escHtml(L("nav.start_over"))}</button>
        </div>
        <div class="settings-section-title">${escHtml(L("settings.section_relationship"))}</div>
        <div class="settings-group">
          <button class="settings-row" data-action="openProfiles">${escHtml(L("settings.relationships_row"))}</button>
          <button class="settings-row" data-action="openHouseMapFromSettings">${escHtml(L("settings.view_path_row"))}</button>
        </div>
        <div class="settings-section-title">${escHtml(L("settings.section_support"))}</div>
        <div class="settings-group">
          <button class="settings-row" data-action="openDisclaimerSheet">${escHtml(L("settings.disclaimer_row"))}</button>
          <button class="settings-row" data-action="openCrisis">${escHtml(L("settings.crisis_row"))}</button>
          <button class="settings-row" data-action="openLanguagePicker">${escHtml(L("settings.language_row"))}</button>
        </div>
        <div class="settings-section-title">${escHtml(L("settings.section_legal"))}</div>
        <div class="settings-group">
          <button class="settings-row" data-action="openPrivacy">${escHtml(L("settings.privacy_row"))}</button>
          <button class="settings-row" data-action="openTerms">${escHtml(L("settings.terms_row"))}</button>
          <button class="settings-row" data-action="restorePurchasesTestMode">${escHtml(L("settings.restore_purchases_row"))}</button>
        </div>
        <div class="settings-section-title">${escHtml(L("settings.section_data"))}</div>
        <div class="settings-group">
          <button class="settings-row destructive" data-action="confirmDeleteData">${escHtml(L("settings.delete_data_row"))}</button>
        </div>
        <div class="settings-group" style="margin-top:20px;">
          <div class="settings-row" style="cursor:default;color:var(--ink)"><span>${escHtml(L("settings.version_row"))}</span><span class="val">${appVersion}</span></div>
        </div>
      </div>
    </div>`;
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
  if (ui.globalSheet === "language") {
    html += `<div class="sheet-backdrop" data-action="backdropClose" data-close="closeGlobalSheet">
        <div class="sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header"><span>${escHtml(L("settings.language_row"))}</span><button data-action="closeGlobalSheet">${escHtml(L("settings.cancel"))}</button></div>
          <div class="sheet-body">
            <button class="sheet-row pressable" data-action="setLanguageInSettings" data-arg="en">English</button>
            <button class="sheet-row pressable" data-action="setLanguageInSettings" data-arg="ru">Русский</button>
          </div>
        </div>
      </div>`;
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
      <h1 class="f-serif-title" style="font-size:26px;">${escHtml(L("paywall.title"))}</h1>
      <p class="f-body secondary">${escHtml(L("paywall.body"))}</p>
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
