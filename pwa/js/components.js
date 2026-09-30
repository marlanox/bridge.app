import { L, LF, deck, deckSections } from "./content.js";

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
      <div class="b-content" style="max-height:100dvh;overflow-y:auto;-webkit-overflow-scrolling:touch;${contentStyle}">${inner}</div>
    </div>`;
}

/** The same top-bar shell on every screen. `right` is "star" (the settings
 * shortcut), `{who, together}` for the "who holds the phone" pill (DESIGN.md
 * §2: "Отвечает …", "Читает …" or "Вместе"), `{close: action}` for an X button,
 * or null for nothing on the right. */
export function bTopbar({ back = true, backLabel, right = "star" } = {}) {
  const backHtml = back
    ? `<button class="b-back pressable" type="button" data-action="goBack"><span class="b-back__circle">${B_BACK_ARROW_SVG}</span>${escHtml(backLabel ?? L("nav.back"))}</button>`
    : `<span></span>`;
  let rightHtml = "";
  if (right === "star") {
    rightHtml = `<button class="b-iconbtn pressable" type="button" data-action="openSettings" aria-label="${escAttr(L("settings.title"))}">${bStarGlyph(18, "#EFE6DA")}</button>`;
  } else if (right && right.close) {
    rightHtml = `<button class="b-iconbtn pressable" type="button" data-action="${right.close}" aria-label="Close">${B_CLOSE_SVG}</button>`;
  } else if (right && right.who) {
    rightHtml = `<span class="b-who${right.together ? " b-who--together" : ""}">${right.together ? "" : '<span class="b-who__dot"></span>'}${escHtml(right.who)}</span>`;
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
export function bCta({ key, text, action, arg, enabled = true, ghost = false, testId }) {
  const label = text ?? L(key);
  return `<button class="b-cta${ghost ? " b-cta--ghost" : ""}${enabled ? "" : " is-disabled"} pressable" ${enabled ? "" : 'aria-disabled="true" disabled'} data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""} ${testId ? `data-testid="${testId}"` : ""}>${escHtml(label)}<span class="b-cta__arrow" aria-hidden="true">${B_FORWARD_ARROW_SVG}</span></button>`;
}

/** A ghost/link-styled button — `.b-link` — for a secondary, non-CTA action. */
export function bLink({ text, action, arg }) {
  return `<button class="b-link pressable" type="button" data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""}>${escHtml(text)}</button>`;
}

/** The dark-glass card — `.b-card` — used for any block of body text. */
export function bCard(inner, style = "") {
  return `<div class="b-card" style="${style}">${inner}</div>`;
}

/** DESIGN.md §2's "room rule" card — `.b-rule`: an optional eyebrow head, then
 * one row per rule line, each with a yes (filled check) or no (hollow cross)
 * icon. Used for "who speaks / who listens" plus a room's own forbidden list. */
export function bRule({ head, rows }) {
  const rowsHtml = rows
    .map((r) => `<div class="b-rule__row"><span class="b-rule__icon b-rule__icon--${r.icon}">${r.icon === "yes" ? "✓" : "✕"}</span><span>${escHtml(r.text)}</span></div>`)
    .join("");
  return `<div class="b-rule">${head ? `<div class="b-rule__head">${escHtml(head)}</div>` : ""}${rowsHtml}</div>`;
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
export function bScale({ value, action, arg }) {
  const zoneOf = (v) => (v <= 3 ? "calm" : v <= 6 ? "mid" : "hot");
  const segs = Array.from({ length: 11 }, (_, i) => {
    const on = i <= value;
    return `<button class="b-seg z-${zoneOf(i)}${on ? " is-on" : ""}" type="button" data-action="${action}" data-arg="${escAttr(arg)}" data-arg2="${i}" aria-label="${i}"></button>`;
  }).join("");
  const z = zoneOf(value);
  return `<div class="b-scale">${segs}</div>
    <div class="b-scale-zones"><span>${escHtml(L("intensity.zone.calm"))}</span><span>${escHtml(L("intensity.zone.mid"))}</span><span>${escHtml(L("intensity.zone.hot"))}</span></div>
    <div class="b-level z-${z}">${value} — ${escHtml(L(`intensity.zone.${z}`))}</div>`;
}

/** A single gold star with a thin tail beneath it, sitting directly above a title —
 * the recurring mark at the top of every full-bleed editorial screen (Welcome, Oath,
 * Ritual, Names, House Map, the plain onboarding-text pages). Distinct from
 * ornamentDivider(), which is a line-star-line rule used mid-screen to separate an
 * instruction from a quote below it, not a mark over a title. */
export function titleStar() {
  return `<div class="title-star"><span class="glyph">✦</span><span class="tail"></span></div>`;
}

export function dots(count, activeIndex, gold = false) {
  let html = `<div class="dots${gold ? " gold" : ""}">`;
  for (let i = 0; i < count; i++) {
    html += `<div class="dot-seg${i === activeIndex ? " active" : ""}"></div>`;
  }
  return html + "</div>";
}

/** Mirrors TimerBanner.swift. */
export function timerBanner(store) {
  const s = store.roomTimeRemainingSeconds;
  const m = Math.max(s, 0) / 60 | 0;
  const sec = Math.max(s, 0) % 60;
  const time = `${m}:${String(sec).padStart(2, "0")}`;
  if (store.timeUpBannerShown) {
    return `<div class="timer-banner">
      <div class="f-body" style="font-weight:600;">${L("room.time_up_banner")}</div>
      <div class="timer-up-row">
        ${secondaryButton({ key: "room.a_bit_more_time", action: "addMoreTime" })}
        <button class="btn-done pressable" data-action="markRoomDoneForTimer">${L("room.done")}</button>
      </div>
    </div>`;
  }
  return `<div class="timer-banner"><span class="timer-clock">${time}</span></div>`;
}

/** Mirrors PlacedCardsOverlay.swift. */
export function placedCards(store) {
  if (store.placedCardsThisTurn.length === 0) return "";
  const items = store.placedCardsThisTurn
    .map((play) => `<div class="placed-card">${escHtml(cardDisplayText(play))}</div>`)
    .join("");
  return `<div class="placed-cards">${items}</div>`;
}

export function cardDisplayText(play) {
  if (play.customText) return play.customText;
  const d = deck(play.deckId);
  const card = d.cards.find((c) => c.id === play.cardId);
  return card ? L(card.textKey) : "";
}

/** Mirrors CardGridView.swift — one dropdown pill per deck; tapping opens a bottom sheet. */
export function deckDropdownList(deckIds) {
  if (deckIds.length === 0) return "";
  const buttons = deckIds
    .map((id) => `<button class="deck-button pressable" data-action="openDeckSheet" data-arg="${id}">
        <span>${L(deck(id).nameKey)}</span><span>▾</span>
      </button>`)
    .join("");
  return `<div class="deck-list">${buttons}</div>`;
}

/** `rotation` mirrors the room's current seat rotation — this sheet is presented as a
 * plain absolutely-positioned overlay (not a native modal), so unlike a browser-native
 * sheet it DOES need to be told the rotation explicitly, or it always faces the same
 * fixed physical orientation instead of whoever is actually answering right now (the
 * same fix as RevealCardOverlay/`reveal-card-rotator` for the reveal card). */
export function deckSheet(deckId, selectableFilter = null, customDraft = "", rotation = 0) {
  const d = deck(deckId);
  const sections = deckSections(d);
  let body = "";
  for (const section of sections) {
    if (section.category) {
      body += `<div class="sheet-section-title">${escHtml(section.category)}</div>`;
    }
    for (const card of section.cards) {
      if (selectableFilter && !selectableFilter(card)) continue;
      body += `<button class="sheet-row pressable" data-action="pickCard" data-arg="${deckId}" data-arg2="${card.id}">
          <span>${escHtml(L(card.textKey))}</span>
        </button>`;
    }
  }
  body += `<div class="write-own-row">
      <input id="writeOwnInput" class="text-field" placeholder="${escAttr(L("card.write_your_own"))}" value="${escAttr(customDraft)}">
      <button data-action="submitCustomCard" data-arg="${deckId}">${L("couples_agreement.add_rule")}</button>
    </div>`;
  return `<div class="sheet-backdrop" data-action="backdropClose" data-close="closeSheet" style="transform:rotate(${rotation}deg)">
      <div class="sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header"><span>${escHtml(L(d.nameKey))}</span><button data-action="closeSheet">${L("room.done")}</button></div>
        <div class="sheet-body">${body}</div>
      </div>
    </div>`;
}

/** Mirrors ActivePartnerContainer.swift's WaitingIndicator — names the *waiting*
 * partner but is oriented to be readable by whoever is actually holding/facing the
 * phone right now (the active partner), since it's a reassurance for the one currently
 * sharing, not a note to the one currently listening. */
export function waitingBadge(store, waitingRole, activeRole) {
  const rotation = store.seatRotation(activeRole);
  return `<div class="fixed-badge" style="transform:rotate(${rotation}deg)">
      <div class="waiting-pill">
        <span class="dot ${waitingRole === "partnerA" ? "a" : "b"}"></span>
        <span>${escHtml(store.name(waitingRole))}</span>
        <span class="secondary">${L("nav.listening")}</span>
      </div>
    </div>`;
}

/** Mirrors RevealCardOverlay.swift — rotated to face the reader only; the room behind
 * it stays exactly as it was. */
export function revealOverlay(store) {
  const reveal = store.pendingReveal;
  if (!reveal) return "";
  const rotation = store.seatRotation(reveal.to);
  const cardsHtml = reveal.cards
    .map((play) => `<div>${escHtml(cardDisplayText(play))}</div>`)
    .join("");
  return `<div class="reveal-overlay">
      <div class="reveal-card-rotator" style="transform:rotate(${rotation}deg)">
        <div class="reveal-card">
          <div class="reveal-from"><span class="dot ${reveal.from === "partnerA" ? "a" : "b"}"></span>${LF("handoff.shared_title", escHtml(store.name(reveal.from)))}</div>
          <div class="reveal-cards">${cardsHtml}</div>
          ${primaryButton({ key: "handoff.read_it", action: "confirmReveal", compact: true })}
        </div>
      </div>
    </div>`;
}

/** The room header shared by every generic room — mirrors RoomView.header. When
 * collapsed, this renders ONLY the slim "Expand" bar (not a chevron buried in a
 * corner) — tapping it is the one and only way back to the full text, and it stays
 * in the same place every time. When expanded, an explicit "I've read it" button at
 * the bottom (not an icon) is what collapses it. */
export function roomHeader(cfg, { activeRoleName = null, activeRoleDotClass = null, expanded = true, instructionKeyOverride = null, hideExtras = false } = {}) {
  if (!expanded) {
    return `<button class="b-link pressable" type="button" data-action="toggleHeader">${escHtml(L("room.expand"))}</button>`;
  }
  const modeCaptionKey = cfg.modes.includes("discussion") ? "room.mode_caption.discussion" : "room.mode_caption.sequential";
  return `<div class="b-card" style="margin-top:10px;display:flex;flex-direction:column;gap:14px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div class="b-eyebrow">${escHtml(L(cfg.nameKey))}</div>
        ${activeRoleName ? `<span class="b-who">${escHtml(activeRoleName)}</span>` : ""}
      </div>
      <h1 class="b-h2">${escHtml(L(cfg.questionKey))}</h1>
      <p class="b-body">${escHtml(L(instructionKeyOverride ?? cfg.instructionKey))}</p>
      ${hideExtras ? "" : `<div class="b-divider"></div><p class="b-small" style="color:var(--gold);font-weight:600;">${escHtml(L("room.why_it_helps_label"))}</p><p class="b-body">${escHtml(L(cfg.whyItHelpsKey))}</p>`}
      <p class="b-small">${escHtml(L(modeCaptionKey))}</p>
      ${!hideExtras && cfg.forbiddenKey ? `<div class="b-divider"></div><p class="b-small" style="color:var(--gold);font-weight:600;">${escHtml(L("room.forbidden_prefix"))}</p><p class="b-body">${escHtml(L(cfg.forbiddenKey))}</p>` : ""}
      ${bCta({ key: "room.read_it", action: "toggleHeader" })}
    </div>`;
}

