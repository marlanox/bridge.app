import { loadContent, L, LF, getLanguage, setLanguage, deck, room, allRoomKinds } from "./content.js";
import { Store, ROOM_KIND_ORDER } from "./state.js";
import * as S from "./screens.js";
import { playTap, playWelcomeChime, startWelcomeMusic, stopWelcomeMusic } from "./sounds.js";
import { escHtml } from "./components.js";

const appEl = document.getElementById("app");
let store;

/** `#app`'s own `position:fixed;inset:0` is supposed to be enough on its own, but iOS
 * Safari (both a plain tab, where the address bar hides/shows as you scroll, and an
 * installed standalone app) has repeatedly been seen leaving `inset: 0` computed
 * against a stale/short viewport in exactly this app — the fixed box just doesn't
 * always get re-measured against the *current* visual viewport. Measuring
 * `window.innerHeight` directly in JS and writing it as an explicit pixel height is
 * the one thing that can't be wrong regardless of which viewport unit iOS decides to
 * shortchange that day. Re-measured on every resize/orientation change, and once more
 * a beat after each one since iOS sometimes reports the old height for a moment
 * during the address-bar hide/show transition. */
function syncViewportHeight() {
  appEl.style.height = `${window.innerHeight}px`;
}
syncViewportHeight();
window.addEventListener("resize", syncViewportHeight);
window.addEventListener("orientationchange", () => {
  syncViewportHeight();
  setTimeout(syncViewportHeight, 300);
});

/** Ephemeral, per-screen UI state that mirrors each SwiftUI view's local `@State` —
 * never persisted, reset whenever the flow moves to a different step. See
 * `resetUiForStep`. */
const ui = {
  diceRolling: false, diceFace: 1,
  intensity: { partnerA: 0, partnerB: 0 },
  stateSelected: { partnerA: [], partnerB: [] },
  stateCustom: { partnerA: "", partnerB: "" },
  openStatePickerRole: null,
  breathing: false,
  headerExpanded: true,
  openDeckId: null,
  bridgeActiveTab: "partnerA",
  recordingRole: null,
  recorders: { partnerA: null, partnerB: null },
  closingLineIsCourage: Math.random() < 0.5,
  closingSaved: false,
  houseMapTextExpanded: true,
  settingsOpen: false,
  paywallOpen: false,
  globalSheet: null,
  newRuleDraft: "",
  customCardDraft: "",
};

let lastFlowKey = null;
let lastActivePartner = null;
let splashDone = false;
let splashTimer = null;
const SPLASH_DURATION_MS = 1800;

function flowKey(flow) {
  return flow ? `${flow.step}:${flow.kind ?? ""}` : "";
}

function resetUiForStep(step, kind) {
  if (step === "dice") { ui.diceRolling = false; ui.diceFace = 1; store.resetDice(); }
  if (step === "intensityState") {
    ui.intensity = { partnerA: store.session.intensityA, partnerB: store.session.intensityB };
    ui.stateSelected = {
      partnerA: [...store.session.stateA.states],
      partnerB: [...store.session.stateB.states],
    };
    ui.stateCustom = { partnerA: store.session.stateA.customText, partnerB: store.session.stateB.customText };
    ui.openStatePickerRole = null;
  }
  if (step === "calmDown") ui.breathing = false;
  if (step === "room" || step === "basement") {
    // Collapsed by default on short screens (SE-class phones) so the fully-expanded
    // instruction/why-it-helps/forbidden text doesn't push the Done button below the
    // fold before a first-time user realizes they can collapse it themselves.
    ui.headerExpanded = window.innerHeight >= 700;
    ui.openDeckId = null;
    ui.customCardDraft = "";
  }
  if (step === "couplesAgreementSetup") ui.newRuleDraft = "";
  if (step === "bridgeFinale") ui.bridgeActiveTab = "partnerA";
  if (step === "voiceSnapshot") { ui.recordingRole = null; }
  if (step === "closing") { ui.closingLineIsCourage = Math.random() < 0.5; ui.closingSaved = false; }
  if (step === "houseMap") ui.houseMapTextExpanded = true;
}

// =============================================================== render

function render() {
  if (!splashDone) {
    appEl.innerHTML = S.splashScreen();
    // Best-effort: iOS Safari blocks autoplay before any user gesture, so this often
    // silently fails here — the guaranteed start is still the language-picker tap in
    // setLanguage() below, but firing it here too means it just works whenever the
    // platform does allow it (e.g. relaunching an already-installed PWA).
    startWelcomeMusic();
    if (!splashTimer) {
      splashTimer = setTimeout(() => { splashDone = true; render(); }, SPLASH_DURATION_MS);
    }
    return;
  }

  if (getLanguage() === null) {
    appEl.innerHTML = S.languageScreen();
    return;
  }

  const key = flowKey(store.flow);
  if (key !== lastFlowKey) {
    resetUiForStep(store.flow.step, store.flow.kind);
    lastFlowKey = key;
    lastActivePartner = store.activePartner;
    syncWelcomeMusic(store.flow);
  } else if (
    (store.flow.step === "room" || store.flow.step === "basement") &&
    store.activePartner !== lastActivePartner
  ) {
    // A new person taking their turn must see the full instructions, not whatever
    // collapsed state the previous partner happened to leave it in.
    ui.headerExpanded = true;
    lastActivePartner = store.activePartner;
  }

  let html;
  if (ui.paywallOpen) {
    html = S.paywallScreen(ui);
  } else if (ui.settingsOpen) {
    html = S.settingsScreen(store, ui);
  } else {
    html = renderFlowScreen();
  }
  const nav = (ui.paywallOpen || ui.settingsOpen) ? "" : globalNavBar();
  appEl.innerHTML = html + nav + S.globalOverlays(store, ui);
}

/** Back (all the way to the first screen) and Settings (which itself holds "start
 * over" / "redo this page") are reachable from every single screen — getting stuck
 * on one dead-end step, with no way out, is exactly the failure this exists to
 * prevent. */
// A plain inline SVG, not a Unicode "⚙" glyph — the character renders in a colorful
// "emoji-style" on some devices depending on font fallback, which read as a broken/
// "crazy 3D" icon instead of a plain flat settings glyph. Stroke-only (no filled
// teeth, no drop-shadow) and evenly spaced — a flat, perfectly symmetric cog rather
// than the previous filled-path version, which could read as slightly lopsided at
// this size.
const GEAR_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="3"/>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
</svg>`;

function globalNavBar() {
  const back = store.canGoBack()
    ? `<button class="nav-pill pressable" data-action="goBack"><span>‹</span><span>${L("nav.back")}</span></button>`
    : "<span></span>";
  const caption = store.flow && needsReadTogetherCaption(store.flow)
    ? `<div class="read-together-row"><span class="read-together-badge">${escHtml(L("nav.read_together"))}</span></div>`
    : "";
  return `<div class="global-nav-wrap">
      <div class="global-nav">
        ${back}
        <button class="nav-gear pressable" data-action="openSettings" aria-label="${L("settings.title")}">${GEAR_SVG}</button>
      </div>
      ${caption}
    </div>`;
}

// Mirrors AppFlowStep.needsReadTogetherCaption on iOS — only a sequential "one speaks,
// one listens" room physically rotates 180° for a private turn; every other screen,
// room or not, needs the reminder that it's meant to be read together. Basement draws
// its own copy inline (it needs to sit inside its own scroll layout, not float above it).
// Every screen before the couple actually enters the first room (Hall) — the supplied
// piano track plays through these and fades out the instant a room begins.
const BEFORE_FIRST_ROOM_STEPS = new Set([
  "welcome", "howItWorksWhatIsBridge", "howItWorksApology", "disclaimer",
  "ritual", "oath", "houseMap", "names", "dice", "intensityState", "calmDown",
]);

function syncWelcomeMusic(flow) {
  if (BEFORE_FIRST_ROOM_STEPS.has(flow.step)) startWelcomeMusic();
  else stopWelcomeMusic();
}

// Mirrors AppFlowStep.needsReadTogetherCaption on iOS. intensityState's partner-B half
// is already rotated 180deg in place — that screen is two private halves, not one
// shared screen, so the caption would be simply wrong there, not just redundant.
function needsReadTogetherCaption(flow) {
  if (flow.step === "basement" || flow.step === "intensityState") return false;
  if (flow.step === "room") {
    const cfg = room(flow.kind);
    return !cfg.modes.includes("speaks");
  }
  return true;
}

function renderFlowScreen() {
  const f = store.flow;
  switch (f.step) {
    case "welcome": return S.welcomeScreen();
    case "howItWorksWhatIsBridge":
      return S.onboardingTextPage({ titleKey: "onboarding.what_is_bridge.title", bodyKey: "onboarding.what_is_bridge.body", buttonKey: "onboarding.next", pageIndex: 0, pageCount: 2, action: "advance" });
    case "howItWorksApology":
      return S.onboardingTextPage({ titleKey: "onboarding.apology.title", bodyKey: "onboarding.apology.body", buttonKey: "onboarding.next", pageIndex: 1, pageCount: 2, action: "advance" });
    case "disclaimer": return S.disclaimerScreen();
    case "houseMap": return S.houseMapScreen("onboarding", ui.houseMapTextExpanded);
    case "names": return S.namesScreen(store);
    case "couplesAgreementSetup": return S.couplesAgreementScreen(store, ui);
    case "dice": return S.diceScreen(ui, store);
    case "intensityState": return S.intensityScreen(store, ui);
    case "calmDown": return S.calmDownScreen(ui);
    case "oath": return S.oathScreen();
    case "ritual": return S.ritualScreen(ui);
    case "room": return S.roomScreen(store, ui, f.kind);
    case "basement": return S.basementScreen(store, ui);
    case "bridgeFinale": return S.bridgeFinaleScreen(store, ui);
    case "voiceSnapshot": return S.voiceSnapshotScreen(store, ui);
    case "closing": return S.closingScreen(store, ui);
    default: return `<div class="screen">Unknown step: ${f.step}</div>`;
  }
}

// =============================================================== actions

const actions = {
  /** Every sheet/dialog backdrop uses this: closes only when the click landed on the
   * backdrop itself, not on any of its content (so tapping inside the sheet never
   * closes it, without needing stopPropagation — which would also block the
   * delegated data-action clicks on everything inside the sheet). */
  backdropClose(el, ev) {
    if (ev.target !== el) return;
    const fn = actions[el.dataset.close];
    if (fn) fn(el, ev);
  },

  setLanguage(el) {
    // Fires inside this click handler (already a user gesture, and playTap() above has
    // already unlocked the AudioContext) so it's guaranteed to actually play, unlike an
    // autoplay attempt on the bare language screen render — browsers block audio before
    // any interaction at all.
    playWelcomeChime();
    startWelcomeMusic();
    setLanguage(el.dataset.arg);
    render();
  },
  setLanguageInSettings(el) { setLanguage(el.dataset.arg); ui.globalSheet = null; render(); },

  openSettings() { ui.settingsOpen = true; render(); },
  closeSettings() { ui.settingsOpen = false; render(); },
  goBack() { store.back(); render(); },
  confirmStartOver() { ui.globalSheet = "startOverConfirm"; render(); },
  startOver() {
    store.restartWalk();
    ui.settingsOpen = false;
    ui.globalSheet = null;
    render();
  },
  confirmRedoPage() { ui.globalSheet = "redoPageConfirm"; render(); },
  redoPage() {
    if (!store.redoCurrentPage()) {
      // No session-level data to reset for this screen — just clear its local UI state.
      resetUiForStep(store.flow.step, store.flow.kind);
    }
    ui.settingsOpen = false;
    ui.globalSheet = null;
    render();
  },
  closePaywall() { ui.paywallOpen = false; render(); },
  unlockTestMode() { store.unlockFullVersionTestMode(); ui.paywallOpen = false; render(); },
  beginFromWelcome() {
    if (store.canStartSession()) store.advance();
    else { ui.paywallOpen = true; render(); }
  },

  openProfiles() { ui.globalSheet = "profiles"; render(); },
  openHouseMapFromSettings() { ui.houseMapTextExpanded = true; ui.globalSheet = "houseMapSettings"; render(); },
  openDisclaimerSheet() { ui.globalSheet = "disclaimer"; render(); },
  openCrisis() { ui.globalSheet = "crisis"; render(); },
  openPrivacy() { ui.globalSheet = "privacy"; render(); },
  openTerms() { ui.globalSheet = "terms"; render(); },
  openLanguagePicker() { ui.globalSheet = "language"; render(); },
  closeGlobalSheet() { ui.globalSheet = null; render(); },
  confirmDeleteData() { ui.globalSheet = "deleteConfirm"; render(); },
  deleteData() { store.deleteActiveProfileData(); ui.globalSheet = null; ui.settingsOpen = false; render(); },
  createProfile() {
    const name = prompt("Name this relationship (optional):", "") || "";
    store.createProfile(name);
    ui.globalSheet = null;
    render();
  },
  selectProfile(el) { store.selectProfile(el.dataset.arg); ui.globalSheet = null; render(); },
  restorePurchasesTestMode() { alert("PWA test mode: no real purchases to restore. See PARITY.md."); },

  advance() { store.advance(); render(); },

  // House Map
  collapseHouseMapText() { ui.houseMapTextExpanded = false; render(); },
  expandHouseMapText() { ui.houseMapTextExpanded = true; render(); },
  houseMapContinue() {
    if (ui.globalSheet === "houseMapSettings") { ui.globalSheet = null; render(); return; }
    store.advance();
  },

  // Names
  submitNames() {
    const a = document.getElementById("nameA").value.trim();
    const b = document.getElementById("nameB").value.trim();
    if (!a || !b) return;
    store.setNames(a, b);
    store.advance();
  },

  // Couple's agreement
  addRuleFromKey(el) { store.addAgreementRule(L(el.dataset.arg)); render(); },
  removeRule(el) { store.removeAgreementRule(Number(el.dataset.arg)); render(); },
  addCustomRule() {
    const input = document.getElementById("newRuleInput");
    store.addAgreementRule(input.value);
    ui.newRuleDraft = "";
    render();
  },

  // Dice
  rollDice() {
    ui.diceRolling = true;
    const dieEl = document.querySelector(".die-face");
    if (dieEl) dieEl.style.transform = "rotate(720deg)";
    // Actually cycle through different faces while it "rolls" — a single static face
    // just spinning in place reads as broken/unresponsive, not as a die being rolled.
    const faceTimer = setInterval(() => {
      ui.diceFace = 1 + Math.floor(Math.random() * 6);
      render();
    }, 60);
    setTimeout(() => {
      clearInterval(faceTimer);
      const value = store.rollDiceStep();
      ui.diceFace = value;
      ui.diceRolling = false;
      render();
    }, 600);
  },

  // Intensity & state
  openStatePicker(el) { ui.openStatePickerRole = el.dataset.arg; render(); },
  closeStatePicker() { ui.openStatePickerRole = null; render(); },
  toggleStateOption(el) {
    const role = el.dataset.arg, state = el.dataset.arg2;
    const list = ui.stateSelected[role];
    const i = list.indexOf(state);
    if (i >= 0) list.splice(i, 1); else list.push(state);
    render();
  },
  submitIntensityState() {
    const customA = document.getElementById("custom-partnerA")?.value.trim() ?? ui.stateCustom.partnerA;
    const customB = document.getElementById("custom-partnerB")?.value.trim() ?? ui.stateCustom.partnerB;
    store.setIntensity(ui.intensity.partnerA, "partnerA");
    store.setIntensity(ui.intensity.partnerB, "partnerB");
    for (const s of ui.stateSelected.partnerA) store.toggleState(s, "partnerA");
    for (const s of ui.stateSelected.partnerB) store.toggleState(s, "partnerB");
    store.setCustomStateText(customA, "partnerA");
    store.setCustomStateText(customB, "partnerB");
    store.advance();
  },

  // Calm down
  startBreathing() { ui.breathing = true; render(); },

  // Oath
  completeOathAndAdvance() { store.completeOath(); store.advance(); },

  // Ritual
  completeRitualAndAdvance() {
    store.completeRitual();
    store.advance();
  },

  // Rooms (generic)
  toggleHeader() { ui.headerExpanded = !ui.headerExpanded; render(); },
  openDeckSheet(el) { ui.openDeckId = el.dataset.arg; ui.customCardDraft = ""; render(); },
  closeSheet() { ui.openDeckId = null; render(); },
  pickCard(el) {
    const deckId = el.dataset.arg, cardId = el.dataset.arg2;
    const d = deck(deckId);
    const card = d.cards.find((c) => c.id === cardId);
    if (!card) return;
    store.playCard(card, deckId);
    ui.openDeckId = null;
    render();
  },
  submitCustomCard(el) {
    const deckId = el.dataset.arg;
    const input = document.getElementById("writeOwnInput");
    const text = input.value.trim();
    if (!text) return;
    store.playCard({ id: `custom_${Date.now()}` }, deckId, text);
    ui.openDeckId = null;
    ui.customCardDraft = "";
    render();
  },
  markRoomDone(el) { store.markRoomDone(el.dataset.arg); render(); },
  markRoomDoneActive() { store.markRoomDone(store.activePartner); render(); },
  markRoomDoneForTimer() { store.markRoomDone(store.activePartner); render(); },
  setActivePartner(el) { store.activePartner = el.dataset.arg; render(); },
  addMoreTime() { store.addMoreTime(); render(); },
  confirmReveal() { store.confirmReveal(); render(); },
  flagAgreementBroken() {
    store.flagAgreementBroken();
    const btn = document.querySelector('[data-action="flagAgreementBroken"]');
    if (btn) { btn.style.background = "rgba(200,60,60,0.35)"; setTimeout(() => { if (btn) btn.style.background = ""; }, 600); }
  },

  // Basement
  markBasementFearsDone(el) { store.markBasementFearsDone(el.dataset.arg); render(); },
  markBasementQuestionsDone(el) { store.markBasementQuestionsDone(el.dataset.arg); render(); },

  // Bridge finale
  setBridgeTab(el) { ui.bridgeActiveTab = el.dataset.arg; render(); },
  selectBridgeCard(el) { store.selectBridgeCard(el.dataset.arg2, el.dataset.arg, ui.bridgeActiveTab); render(); },
  completeMandatoryCard(el) { store.completeMandatoryCard(el.dataset.arg); render(); },

  // Voice snapshot
  async toggleVoiceRecording(el) {
    const role = el.dataset.arg;
    if (ui.recordingRole === role) {
      ui.recorders[role]?.stop();
      ui.recordingRole = null;
      render();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        store.markVoiceNoteRecorded(role);
        render();
      };
      recorder.start();
      ui.recorders[role] = recorder;
      ui.recordingRole = role;
      render();
    } catch {
      alert("Microphone access was not granted — you can skip the voice snapshot instead.");
    }
  },

  // Closing
  saveClosingCard() { saveClosingCardImage(); },
  closeSession() { store.endActiveSession(); render(); },
};

function saveClosingCardImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 640; canvas.height = 760;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#b7944c"; ctx.lineWidth = 3; ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  ctx.fillStyle = "#b7944c"; ctx.font = "48px serif"; ctx.textAlign = "center";
  ctx.fillText("🏅", canvas.width / 2, 140);
  ctx.fillStyle = "#17171a"; ctx.font = "bold 34px Georgia, serif";
  ctx.fillText(L("closing.title"), canvas.width / 2, 220);
  ctx.font = "16px -apple-system, sans-serif"; ctx.fillStyle = "#666";
  ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 260);
  ctx.fillStyle = "#17171a"; ctx.font = "22px -apple-system, sans-serif";
  wrapText(ctx, L("closing.line_1"), canvas.width / 2, 340, 520, 30);
  ctx.font = "bold 22px -apple-system, sans-serif";
  wrapText(ctx, L(ui.closingLineIsCourage ? "closing.line_2b" : "closing.line_2a"), canvas.width / 2, 420, 520, 30);
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      const a = document.createElement("a");
      a.href = url; a.download = "bridge-todays-mark.png"; a.click();
    }
    ui.closingSaved = true;
    render();
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "", cy = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word + " "; cy += lineHeight;
    } else line = test;
  }
  ctx.fillText(line, x, cy);
}

// =============================================================== dispatch

appEl.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const fn = actions[el.dataset.action];
  if (fn) {
    playTap();
    fn(el, e);
  }
});

appEl.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset.action === "intensitySlider") {
    handleIntensitySliderInput(el);
    return;
  }
  if (el.id === "custom-partnerA") ui.stateCustom.partnerA = el.value;
  if (el.id === "custom-partnerB") ui.stateCustom.partnerB = el.value;
  if (el.id === "newRuleInput") ui.newRuleDraft = el.value;
  if (el.id === "writeOwnInput") ui.customCardDraft = el.value;
});

// Mirrors intensityColor() in screens.js exactly — kept in sync by hand since this
// copy runs on every live slider drag (see handleIntensitySliderInput below) while
// the other renders the initial value; they must always agree on the same gradient.
function intensityColor(v) {
  const t = v / 10;
  const r = Math.round(63 + (214 - 63) * t);
  const g = Math.round(114 + (69 - 114) * t);
  const b = Math.round(201 + (94 - 201) * t);
  return `rgb(${r},${g},${b})`;
}

/** Deliberately mutates the live DOM node directly instead of calling render() — a
 * full re-render mid-drag would recreate the slider element and cancel the user's
 * touch gesture. See the equivalent comment on Store.tick() in state.js. */
function handleIntensitySliderInput(el) {
  const role = el.dataset.arg;
  const value = Number(el.value);
  ui.intensity[role] = value;
  const color = intensityColor(value);
  el.style.setProperty("--slider-color", color);
  const label = el.nextElementSibling;
  if (label) { label.textContent = value; label.style.color = color; }
  const section = el.closest(".partner-section");
  const flag = section?.querySelector(".overwhelmed-flag");
  if (flag) {
    flag.style.display = value >= 7 ? "" : "none";
    flag.style.background = color;
  }
}

// =============================================================== ticking

setInterval(() => {
  if (!store) return;
  const f = store.flow;
  if (f.step !== "room" && f.step !== "basement") return;
  const { changed } = store.tick();
  if (changed) { render(); return; }
  document.querySelectorAll(".timer-clock").forEach((elm) => {
    const s = Math.max(store.roomTimeRemainingSeconds, 0);
    elm.textContent = `${(s / 60) | 0}:${String(s % 60).padStart(2, "0")}`;
  });
}, 1000);

// =============================================================== boot

async function boot() {
  await loadContent();
  store = new Store();
  store.subscribe(render);
  render();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then((reg) => {
      // sw.js calls skipWaiting()+clients.claim() on every deploy, so a new worker
      // takes control of this page within moments of install — but the HTML/JS
      // *already loaded* in this tab or in an installed "Add to Home Screen" app
      // doesn't magically re-fetch itself just because the worker behind it changed.
      // Without this, a person has to know to manually clear Safari's site data to
      // ever see a new deploy — reload once, automatically, the moment a new worker
      // actually takes over, so an update is visible without anyone doing anything.
      let reloadedForUpdate = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (reloadedForUpdate) return;
        reloadedForUpdate = true;
        window.location.reload();
      });
      // An installed home-screen app on iOS can sit frozen for days without ever
      // re-checking for a new version on its own — force that check every time the
      // app is actually brought back to the foreground, not just on a cold launch.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") reg.update().catch(() => {});
      });
    }).catch(() => {});
  }
}

boot();
