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
// bridge.css component builders — see DESIGN.md. Every one of these renders
// ONLY bridge.css classes; no ad hoc color/font/shadow ever belongs here
// (rule I). Kept alongside the old title-star/photoScreen helpers below
// while the redesign is rolled out screen by screen.
const B_BACK_ARROW_SVG = `<svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 7H2M8 1L2 7l6 6"></path></svg>`;
const B_FORWARD_ARROW_SVG = `<svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 7h19M14 1l6 6-6 6"></path></svg>`;

function bStarGlyph(size, fill) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.6 7.2 16.8 11.4 24 12 16.8 12.6 12.6 16.8 12 24 11.4 16.8 7.2 12.6 0 12 7.2 11.4 11.4 7.2 12 0Z" fill="${fill}"></path></svg>`;
}

/** The screen shell: .b-bg (blurred full-screen atmosphere) + an optional
 * .b-photo (sharp photo, bottom only, masked to fade upward per rule II) +
 * .b-content. Renders as the WHOLE top-level element for a redesigned
 * screen — no outer .screen wrapper needed, .b-screen sizes itself to its
 * parent (#app), which is already correctly sized (see syncViewportHeight
 * in app.js). */
export function bScreen({ bg, photo, photoHeight, inner, contentStyle = "", extra = "" }) {
  return `<div class="b-screen">
      <div class="b-bg ${bg}"></div>
      ${photo ? `<div class="b-photo ${photo}" style="height:${photoHeight}px;"></div>` : ""}
      ${extra}
      <div class="b-content" style="${contentStyle}">${inner}</div>
    </div>`;
}

/** The Emotions screen's vertical side caption — two small gold stars flanking a
 * hairline, with the rotated label running the full height between them
 * (rule VIII / the Emotions board in the design mockup). */
export function bSideCaption(text) {
  return `<div class="b-side-caption">
      ${bStarGlyph(16, "#B8914F")}
      <div class="b-side-caption__line"></div>
      <div class="b-side-caption__text">${escHtml(text)}</div>
      <div class="b-side-caption__line"></div>
      ${bStarGlyph(16, "#B8914F")}
    </div>`;
}

/** Rule IV: the same top-bar shell on every screen. `right` is "star" (the
 * .b-iconbtn — wired to the real Settings sheet, just drawn as the gold
 * star instead of a gear), an object {pill, step} for a room's "Ты
 * слушаешь" + "2 / 10" readout, or null for no right-side control. */
export function bTopbar({ back = true, right = "star" } = {}) {
  const backHtml = back
    ? `<button class="b-back pressable" type="button" data-action="goBack"><span class="b-back__circle">${B_BACK_ARROW_SVG}</span>${escHtml(L("nav.back"))}</button>`
    : `<span></span>`;
  let rightHtml = "";
  if (right === "star") {
    rightHtml = `<button class="b-iconbtn pressable" type="button" data-action="openSettings" aria-label="${escAttr(L("settings.title"))}">${bStarGlyph(18, "#1B1A18")}</button>`;
  } else if (right && typeof right === "object") {
    rightHtml = `<div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
        <span class="b-pill">${escHtml(right.pill)}</span>
        ${right.step ? `<span class="b-step">${escHtml(right.step)}</span>` : ""}
      </div>`;
  }
  return `<div class="b-topbar">${backHtml}${rightHtml}</div>`;
}

/** The signature gold star + hairline — rule V/VII. Vertical (above a
 * centered title) by default, or horizontal (line—star—line) for a
 * left-aligned eyebrow. */
export function bStar({ horizontal = false } = {}) {
  if (horizontal) {
    return `<div class="b-star b-star--h"><div class="b-star__line"></div>${bStarGlyph(22, "#B8914F")}<div class="b-star__line"></div></div>`;
  }
  return `<div class="b-star">${bStarGlyph(28, "#B8914F")}<div class="b-star__line"></div></div>`;
}

/** Rule III: the one button style, .b-cta (or .b-cta--serif for a room
 * card) — a single line, uppercase, arrow on the right. */
export function bCta({ key, text, action, arg, enabled = true, serif = false, testId }) {
  const label = text ?? L(key);
  return `<button class="b-cta${serif ? " b-cta--serif" : ""} pressable" ${enabled ? "" : "disabled"} data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""} ${testId ? `data-testid="${testId}"` : ""}>${escHtml(label)}<span class="b-cta__arrow" aria-hidden="true">${B_FORWARD_ARROW_SVG}</span></button>`;
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
    return `<button class="b-pill pressable" type="button" data-action="toggleHeader">${escHtml(L("room.expand"))}</button>`;
  }
  const modeCaptionKey = cfg.modes.includes("discussion") ? "room.mode_caption.discussion" : "room.mode_caption.sequential";
  return `<div class="b-glass" style="margin-top:10px;padding:26px 22px 20px;display:flex;flex-direction:column;gap:14px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div class="b-eyebrow b-eyebrow--left">${escHtml(L(cfg.nameKey))}</div>
        ${activeRoleName ? `<span class="badge-name" style="color:${activeRoleDotClass === "a" ? "var(--ink)" : "var(--gold)"}">${escHtml(activeRoleName)}</span>` : ""}
      </div>
      <h1 class="b-h1" style="font-size:44px;">${escHtml(L(cfg.questionKey))}</h1>
      <div class="b-tile"><p class="b-body" style="font-size:16px;">${escHtml(L(instructionKeyOverride ?? cfg.instructionKey))}</p></div>
      ${hideExtras ? "" : `<div style="padding:0 6px;"><p class="b-body" style="font-weight:500;color:var(--ink);font-size:16px;">${escHtml(L("room.why_it_helps_label"))}</p><p class="b-body" style="font-size:15px;">${escHtml(L(cfg.whyItHelpsKey))}</p></div>`}
      <div class="b-label">${escHtml(L(modeCaptionKey))}</div>
      ${!hideExtras && cfg.forbiddenKey ? `<div class="b-tile"><p class="b-body" style="color:var(--ink);font-size:16px;">${escHtml(L("room.forbidden_prefix"))}</p><p class="b-body" style="font-size:15px;">${escHtml(L(cfg.forbiddenKey))}</p></div>` : ""}
      ${bCta({ key: "room.read_it", action: "toggleHeader", serif: true })}
    </div>`;
}

