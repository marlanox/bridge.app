import { L, LF, deck, deckSections } from "./content.js";

export function primaryButton({ key, text, action, arg, enabled = true, compact = false, onDark = false, testId }) {
  const label = text ?? L(key);
  return `<button class="btn-primary pressable${compact ? " compact" : ""}${onDark ? " on-dark" : ""}"
      ${enabled ? "" : "disabled"} data-action="${action}" ${arg !== undefined ? `data-arg="${escAttr(arg)}"` : ""}
      ${testId ? `data-testid="${testId}"` : ""}>
      <span class="f-button">${label}</span>
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

export function deckSheet(deckId, selectableFilter = null, customDraft = "") {
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
  return `<div class="sheet-backdrop" data-action="backdropClose" data-close="closeSheet">
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
    .map((play) => `<div style="background:rgba(23,23,26,0.1)">${escHtml(cardDisplayText(play))}</div>`)
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
export function roomHeader(cfg, { activeRoleName = null, activeRoleDotClass = null, expanded = true } = {}) {
  if (!expanded) {
    return `<button class="expand-bar pressable" data-action="toggleHeader">
        <span class="chevron">▾</span><span>${escHtml(L("room.expand"))}</span>
      </button>`;
  }
  const modeIcon = cfg.modes.includes("discussion") ? "💬" : cfg.modes.includes("silentProtocol") ? "🤫" : "🎙";
  const modeCaptionKey = cfg.modes.includes("discussion") ? "room.mode_caption.discussion" : "room.mode_caption.sequential";
  const modeCaptionIcon = cfg.modes.includes("discussion") ? "💬" : "🎙";
  return `<div class="room-header">
      <div class="top-row">
        ${activeRoleName ? `<span class="badge-name" style="color:${activeRoleDotClass === "a" ? "var(--purple)" : "var(--green)"}">${escHtml(activeRoleName)}</span>` : ""}
        <span class="spacer"></span>
        <span class="mode-icon">${modeIcon}</span>
      </div>
      <p class="room-title">${escHtml(L(cfg.nameKey))}</p>
      <p class="room-question">${escHtml(L(cfg.questionKey))}</p>
      <span class="mode-caption">${modeCaptionIcon} ${escHtml(L(modeCaptionKey))}</span>
      <div class="instruction-text">${escHtml(L(cfg.instructionKey))}</div>
      <div class="why-it-helps">${escHtml(L(cfg.whyItHelpsKey))}</div>
      ${cfg.forbiddenKey ? `<div class="forbidden-box"><strong>${escHtml(L("room.forbidden_prefix"))}</strong>${escHtml(L(cfg.forbiddenKey))}</div>` : ""}
      <button class="read-it-btn pressable" data-action="toggleHeader">✓ ${escHtml(L("room.read_it"))}</button>
    </div>`;
}

