import { L } from "./content.js";

export function primaryButton({ key, text, action, arg, enabled = true, compact = false, onDark = false, testId }) {
  const label = text ?? L(key);
  return `<button class="btn-primary pressable${compact ? " compact" : ""}${onDark ? " on-dark" : ""}"
      ${enabled ? "" : "disabled"} data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""}
      ${testId ? `data-testid="${testId}"` : ""}>
      <span class="f-button">${label}</span><span class="btn-arrow" aria-hidden="true">→</span>
    </button>`;
}

export function secondaryButton({ key, text, action, arg, onPhoto = false }) {
  const label = text ?? L(key);
  return `<button class="btn-secondary pressable${onPhoto ? " on-photo" : ""}" data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""}>
      <span class="f-button" style="letter-spacing:1.1px;font-size:13px;">${label}</span>
    </button>`;
}

export function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function escHtml(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ================================================================
// bridge.css v3 (dark) component builders — see DESIGN.md. Every one of these
// renders ONLY bridge.css classes; no ad hoc color/font/shadow ever belongs
// here. Kept alongside the old title-star/photoScreen helpers below while the
// redesign is rolled out screen by screen.
const B_BACK_ARROW_SVG = `<svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 7H2M8 1L2 7l6 6"></path></svg>`;
const B_FORWARD_ARROW_SVG = `<svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 7h19M14 1l6 6-6 6"></path></svg>`;
const B_CLOSE_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#EFE6DA" stroke-width="1.5" stroke-linecap="round"><path d="M1 1l12 12M13 1L1 13"></path></svg>`;
const B_GEAR_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EFE6DA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`;
const B_CHEVRON_DOWN_SVG = `<svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 1.5l5 5 5-5"></path></svg>`;
const B_CHEVRON_LEFT_SVG = `<svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 1.5L2 8l6.5 6.5"></path></svg>`;
const B_CHEVRON_RIGHT_SVG = `<svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 1.5L8 8l-6.5 6.5"></path></svg>`;
const B_CHECK_SVG = `<svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 5l3.5 3.5L11 1"></path></svg>`;
const B_X_SVG = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M1 1l8 8M9 1L1 9"></path></svg>`;
const B_SPEAK_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0M12 18v3"></path></svg>`;

function bStarGlyph(size, fill) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.6 7.2 16.8 11.4 24 12 16.8 12.6 12.6 16.8 12 24 11.4 16.8 7.2 12.6 0 12 7.2 11.4 11.4 7.2 12 0Z" fill="${fill}"></path></svg>`;
}

/** The screen shell: an optional full-bleed fixed `.b-photo` (+ `.b-photo--muted`
 * for an over-orange sunset) under a `.b-shade` gradient (`shade` picks the
 * variant: "" default, "text", "soft", or "top" for a title sitting on a bright
 * sky), then `.b-content` on top. `light` renders the light (`.b-screen--light`)
 * variant used for a couple of daytime onboarding screens (e.g. Names). No outer
 * `.screen` wrapper needed — `.b-screen` sizes itself to its parent (#app). */
export function bScreen({ photo, photoPos = "center", muted = false, shade = "", light = false, inner, contentStyle = "", extra = "" }) {
  // `.b-photo`/`.b-shade` are `position:fixed` (the backdrop never moves); `.b-content`
  // sits on top and must scroll on its own when real copy runs longer than the static
  // mockup's placeholder text did — #app is a fixed, non-scrolling box (see app.js), so
  // without this an overlong screen's CTA silently renders past the bottom edge with no
  // way to reach it, rather than the page just growing taller.
  return `<div class="b-screen${light ? " b-screen--light" : ""}">
      ${photo ? `<div class="b-photo${muted ? " b-photo--muted" : ""}" style="background-image:url('assets/rooms/${photo}.jpg');background-position:${photoPos};"></div>` : ""}
      <div class="b-shade${shade ? ` b-shade--${shade}` : ""}"></div>
      ${extra}
      <div class="b-content" style="overflow-y:auto;-webkit-overflow-scrolling:touch;${contentStyle}">${inner}</div>
    </div>`;
}

/** The same top-bar shell on every screen. `right` is "gear" (the settings
 * shortcut — FIXES-v4 §2: a gear, never a star, never a circle), `{who}` for
 * the "who holds the phone" pill ("Отвечает …"/"Читает …"/"Бросает …" — there
 * is no more "Вместе" pill, FIXES-v4 §0: every screen is answered/read/acted
 * on by exactly one named person), `{close: action}` for an X button, or null
 * for nothing on the right. */
export function bTopbar({ back = true, backLabel, right = "gear" } = {}) {
  const backHtml = back
    ? `<button class="b-back pressable" type="button" data-action="goBack"><span class="b-back__circle">${B_BACK_ARROW_SVG}</span>${escHtml(backLabel ?? L("nav.back"))}</button>`
    : `<span></span>`;
  let rightHtml = "";
  if (right === "gear") {
    rightHtml = `<button class="b-iconbtn pressable" type="button" data-action="openSettings" aria-label="${escAttr(L("settings.title"))}">${B_GEAR_SVG}</button>`;
  } else if (right && right.close) {
    rightHtml = `<button class="b-iconbtn pressable" type="button" data-action="${right.close}" aria-label="Close">${B_CLOSE_SVG}</button>`;
  } else if (right && right.who) {
    rightHtml = `<span class="b-who"><span class="b-who__dot"></span>${escHtml(right.who)}</span>`;
  }
  return `<div class="b-topbar">${backHtml}${rightHtml}</div>`;
}

/** The signature gold star + hairline. Vertical (above a centered title) by
 * default, or horizontal (line—star—line) for a left-aligned eyebrow. */
export function bStar({ horizontal = false } = {}) {
  if (horizontal) {
    return `<div class="b-star b-star--h"><div class="b-star__line"></div>${bStarGlyph(22, "#C9A45C")}<div class="b-star__line"></div></div>`;
  }
  return `<div class="b-star">${bStarGlyph(28, "#C9A45C")}<div class="b-star__line"></div></div>`;
}

/** The one button style, `.b-cta` (or `.b-cta--ghost` for a transparent
 * outline variant) — a single line, uppercase, arrow on the right. Disabled
 * state matches bridge.css's `.is-disabled`/`[aria-disabled]` selector. */
export function bCta({ key, text, action, arg, enabled = true, ghost = false, testId, style = "" }) {
  const label = text ?? L(key);
  return `<button class="b-cta${ghost ? " b-cta--ghost" : ""}${enabled ? "" : " is-disabled"} pressable" style="${style}" ${enabled ? "" : 'aria-disabled="true" disabled'} data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""} ${testId ? `data-testid="${testId}"` : ""}>${escHtml(label)}<span class="b-cta__arrow" aria-hidden="true">${B_FORWARD_ARROW_SVG}</span></button>`;
}

/** A ghost/link-styled button — `.b-link` — for a secondary, non-CTA action. */
export function bLink({ text, action, arg }) {
  return `<button class="b-link pressable" type="button" data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""}>${escHtml(text)}</button>`;
}

/** The dark-glass card — `.b-card` — used for any block of body text. */
export function bCard(inner, style = "") {
  return `<div class="b-card" style="${style}">${inner}</div>`;
}

/** An oath/vow checklist row — `.b-check` — tappable, `is-done` once checked. */
export function bCheck({ text, done, action, arg }) {
  return `<button class="b-check${done ? " is-done" : ""} pressable" type="button" data-action="${action}" data-arg="${escAttr(arg)}"><span class="b-check__box">${done ? "✓" : ""}</span><span>${escHtml(text)}</span></button>`;
}

/** The path-through-the-house progress bar — `.b-progress` — plus an optional
 * "N / M" `.b-step` readout underneath. */
export function bProgress(fraction, stepText) {
  return `<div class="b-progress"><div class="b-progress__fill" style="width:${Math.max(0, Math.min(100, Math.round(fraction * 100)))}%;"></div></div>${stepText ? `<div class="b-step" style="margin-top:6px;">${escHtml(stepText)}</div>` : ""}`;
}

/** DESIGN.md §3's emotion scale: 11 discrete 0–10 segments, strictly zoned
 * 0–3/4–6/7–10 (`z-calm`/`z-mid`/`z-hot`), plus the zone-label strip and the
 * big italic current-value readout. `action`/`arg` (role) drive the segment
 * taps; segments up to and including `value` light up in their own zone's
 * color, matching a fill-up meter rather than a single marker. */
export function zoneOf(v) {
  return v <= 3 ? "calm" : v <= 6 ? "mid" : "hot";
}

/** The "Сила эмоций" heading row above the scale — plain label on the left, the
 * live "8 · Перегруз" readout on the right (or "Выберите силу" until a value's
 * been picked, `value === null`). */
export function bScaleHeader(value) {
  const has = value !== null && value !== undefined;
  const z = has ? zoneOf(value) : "";
  const label = has ? `${value} · ${L(`intensity.zone.${z}`)}` : L("intensity.pick_value");
  return `<div style="display:flex;align-items:baseline;justify-content:space-between"><span class="b-small">${escHtml(L("intensity.strength_label"))}</span><span class="b-level${z ? ` z-${z}` : ""}">${escHtml(label)}</span></div>`;
}

/** DESIGN.md §3 / FIXES-v4 §6's emotion scale: 11 discrete 0–10 segments,
 * strictly zoned 0–3/4–6/7–10 (`z-calm`/`z-mid`/`z-hot`). `action`/`arg` (role)
 * drive the segment taps; segments up to and including `value` light up in
 * their own zone's color, matching a fill-up meter. `value === null` (nothing
 * picked yet) lights no segment. */
export function bScale({ value, action, arg }) {
  const has = value !== null && value !== undefined;
  const segs = Array.from({ length: 11 }, (_, i) => {
    const on = has && i <= value;
    return `<button class="b-seg z-${zoneOf(i)}${on ? " is-on" : ""}" type="button" data-action="${action}" data-arg="${escAttr(arg)}" data-arg2="${i}" aria-label="${i}"></button>`;
  }).join("");
  return `<div class="b-scale">${segs}</div>
    <div class="b-scale-zones"><span>${escHtml(L("intensity.zone.calm"))}</span><span>${escHtml(L("intensity.zone.mid"))}</span><span>${escHtml(L("intensity.zone.hot"))}</span></div>`;
}

/** FIXES-v4 §6's compact one-line room rule — `.b-rulebar`: a filled "speak"
 * tag for who's talking, a plain tag for who's listening, and a hollow-X tag
 * per forbidden item. Replaces the old full-height `.b-rule` card. */
export function bRuleBar(tags) {
  const html = tags
    .map((t) => {
      if (t.kind === "speak") return `<span class="b-tag b-tag--speak">${B_SPEAK_SVG}${escHtml(t.text)}</span>`;
      if (t.kind === "no") return `<span class="b-tag b-tag--no">${B_X_SVG}${escHtml(t.text)}</span>`;
      return `<span class="b-tag">${escHtml(t.text)}</span>`;
    })
    .join("");
  return `<div class="b-rulebar">${html}</div>`;
}

/** The "Подробнее — зачем это" disclosure button used identically in every
 * room (FIXES-v4 §0/§6) — replaces the old always-visible "why it helps" text
 * and the old per-room "Развернуть" header toggle. */
export function bMore({ action, arg, open }) {
  return `<button type="button" class="b-more pressable" data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""}>${escHtml(open ? L("room.less") : L("room.more"))} ${B_CHEVRON_DOWN_SVG}</button>`;
}

/** An even 3-column grid of feeling chips — `.b-chipgrid` — multi-select,
 * uniform size, never gold (FIXES-v4 §6). */
export function bChipGrid(items) {
  const html = items
    .map((it) => `<button type="button" class="b-chip${it.on ? " is-on" : ""}" data-action="${it.action}" data-arg="${escAttr(it.arg)}" ${it.arg2 !== undefined ? `data-arg2="${escAttr(it.arg2)}"` : ""}>${escHtml(it.text)}</button>`)
    .join("");
  return `<div class="b-chipgrid">${html}</div>`;
}

/** A single-select list — `.b-choice` — for picking one fear/need/etc. out of
 * a short list (radio dot fills in when `on`). */
export function bChoice({ text, on, action, arg }) {
  return `<button type="button" class="b-choice${on ? " is-on" : ""} pressable" data-action="${action}" data-arg="${escAttr(arg)}"><span class="b-choice__radio"></span>${escHtml(text)}</button>`;
}

/** A sticky, always-visible footer for a CTA on a screen whose body can
 * scroll — `.b-footer` (FIXES-v4 v4 additions) — so the button is never
 * pushed below the fold by long content. */
export function bFooter(inner) {
  return `<div class="b-footer">${inner}</div>`;
}

/** The 1–2–3 step dashes above the Bridge finale's three cards — `.b-steps`. */
export function bSteps(count, activeIndex) {
  const spans = Array.from({ length: count }, (_, i) => `<span${i === activeIndex ? ' class="is-on"' : ""}></span>`).join("");
  return `<div class="b-steps">${spans}</div>`;
}

/** The Bridge finale's card carousel — prev/next arrow buttons around a
 * `.b-card`, plus a dot row underneath. `inner` is the card's own content. */
export function bCarousel({ inner, prevAction, nextAction, dotsCount, dotsIndex }) {
  const dots = Array.from({ length: dotsCount }, (_, i) => `<i${i === dotsIndex ? ' class="is-on"' : ""}></i>`).join("");
  return `<div class="b-carousel">
      <button class="b-carousel__nav pressable" type="button" aria-label="Предыдущая" data-action="${prevAction}">${B_CHEVRON_LEFT_SVG}</button>
      <div class="b-card" style="flex-grow:1;min-height:210px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:14px;text-align:center;">${inner}</div>
      <button class="b-carousel__nav pressable" type="button" aria-label="Следующая" data-action="${nextAction}">${B_CHEVRON_RIGHT_SVG}</button>
    </div>
    <div class="b-dots" style="margin-top:14px;">${dots}</div>`;
}

/** The voice-message record button — `.b-rec` (a plain circle, never a mic
 * emoji per FIXES-v4 §0/§10). `recording` shows the pulsing red core. */
export function bRec({ action, arg, recording }) {
  return `<button class="b-rec pressable" type="button" data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""} aria-label="${recording ? "Стоп" : "Записать"}"><span class="b-rec__core"${recording ? ' style="animation:none;"' : ""}></span></button>`;
}

/** The light "paper" card used for the couple's contract and the closing
 * certificate — `.b-paper` — a bright rectangle sitting on the dark screen. */
export function bPaper(inner, style = "") {
  return `<div class="b-paper" style="${style}">${inner}</div>`;
}


