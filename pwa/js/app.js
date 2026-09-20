import { loadContent, L, LF, getLanguage, setLanguage, deck, allRoomKinds } from "./content.js";
import { Store, ROOM_KIND_ORDER } from "./state.js";
import * as S from "./screens.js";
import { playTap, playWelcomeChime } from "./sounds.js";

const appEl = document.getElementById("app");
let store;

/** Ephemeral, per-screen UI state that mirrors each SwiftUI view's local `@State` —
 * never persisted, reset whenever the flow moves to a different step. See
 * `resetUiForStep`. */
const ui = {
  diceRolled: false, diceWinner: null, diceWinnerName: "", diceFace: 1,
  intensity: { partnerA: 0, partnerB: 0 },
  stateSelected: { partnerA: [], partnerB: [] },
  stateCustom: { partnerA: "", partnerB: "" },
  openStatePickerRole: null,
  breathing: false,
  chosenLine: null,
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

function flowKey(flow) {
  return flow ? `${flow.step}:${flow.kind ?? ""}` : "";
}

function resetUiForStep(step, kind) {
  if (step === "dice") { ui.diceRolled = false; ui.diceWinner = null; ui.diceFace = 1; }
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
  if (step === "ritual") ui.chosenLine = null;
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
  if (getLanguage() === null) {
    appEl.innerHTML = S.languageScreen();
    return;
  }

  const key = flowKey(store.flow);
  if (key !== lastFlowKey) {
    resetUiForStep(store.flow.step, store.flow.kind);
    lastFlowKey = key;
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
function globalNavBar() {
  const back = store.canGoBack()
    ? `<button class="nav-pill pressable" data-action="goBack"><span>‹</span><span>${L("nav.back")}</span></button>`
    : "<span></span>";
  return `<div class="global-nav">
      ${back}
      <button class="nav-gear pressable" data-action="openSettings" aria-label="${L("settings.title")}">⚙</button>
    </div>`;
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
    case "dice": return S.diceScreen(ui);
    case "intensityState": return S.intensityScreen(store, ui);
    case "calmDown": return S.calmDownScreen(ui);
    case "oath": return S.oathScreen();
    case "ritual": return S.ritualScreen(ui);
    case "room": return S.roomScreen(store, ui, f.kind);
    case "basement": return S.basementScreen(store, ui);
    case "bridgeFinale": return S.bridgeFinaleScreen(store, ui);
    case "voiceSnapshot": return S.voiceSnapshotScreen(store, ui);
    case "closing": return S.closingScreen(ui);
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
    const dieEl = document.querySelector(".die-face");
    if (dieEl) dieEl.style.transform = "rotate(720deg)";
    // Actually cycle through different faces while it "rolls" — a single static face
    // just spinning in place reads as broken/unresponsive, not as a die being rolled.
    const faceTimer = setInterval(() => {
      ui.diceFace = 1 + Math.floor(Math.random() * 6);
      render();
    }, 60);
    const result = store.rollDice();
    ui.diceWinnerName = store.name(result);
    setTimeout(() => {
      clearInterval(faceTimer);
      ui.diceFace = 1 + Math.floor(Math.random() * 6);
      ui.diceWinner = result;
      ui.diceRolled = true;
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
  chooseRitualLine(el) { ui.chosenLine = Number(el.dataset.arg); render(); },
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
    if (store.flow.step === "basement") {
      if (!store.canCurrentAskerAsk()) return;
      store.askBasementQuestion(cardId);
    } else {
      store.playCard(card, deckId);
    }
    ui.openDeckId = null;
    render();
  },
  submitCustomCard(el) {
    const deckId = el.dataset.arg;
    const input = document.getElementById("writeOwnInput");
    const text = input.value.trim();
    if (!text) return;
    if (store.flow.step === "basement") {
      const id = `fears_custom_${Date.now().toString(16)}`;
      store.askBasementQuestion(id, text);
    } else {
      store.playCard({ id: `custom_${Date.now()}` }, deckId, text);
    }
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
  submitBasementResponse(el) { store.submitBasementResponse(el.dataset.arg); render(); },
  markBasementDone() { store.markBasementDone(store.activePartner); render(); },

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

function intensityColor(v) {
  const t = v / 10;
  const r = Math.round((0.55 + 0.4 * t) * 255);
  const g = Math.round((0.45 - 0.35 * t) * 255);
  const b = Math.round((0.2 - 0.15 * t) * 255);
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
  if (store.pendingBasementFearCardID) return; // no countdown while mid fear-exchange
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
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

boot();
