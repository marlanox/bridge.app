import { loadContent, L, LF, getLanguage, setLanguage, deck, allRoomKinds } from "./content.js";
import { Store, ROOM_KIND_ORDER } from "./state.js";
import * as S from "./screens.js";
import {
  playTap, playWelcomeChime, playDice, playSuccess, playPage,
  startAmbientMusic, stopAmbientMusic, duckAmbientMusic, unduckAmbientMusic,
  muteAmbientForRecording, unmuteAmbientAfterRecording,
  isMusicEnabled, isSoundEnabled, setMusicEnabled, setSoundEnabled,
} from "./sounds.js";
import { escHtml } from "./components.js";
import { saveVoiceNote, listVoiceNotes, deleteVoiceNotesForRelationship } from "./voiceStore.js";

const appEl = document.getElementById("app");
let store;

/** `#app` fills the screen via plain `position:fixed;inset:0` in CSS and nothing else.
 * An earlier version of this file set `#app.style.height` from `window.innerHeight` /
 * `window.visualViewport.height` on every resize, meant to patch a black bar at the
 * bottom on iOS. It didn't — the bar is a documented iOS standalone-PWA bug where
 * *any* measured viewport height (`innerHeight`, `visualViewport.height`, and the CSS
 * `dvh`/`lvh`/`svh` units alike) under-reports the real usable height by roughly the
 * home-indicator's height, so setting an explicit `height` from any of them just
 * recreated the same shortfall under a different name — `inset:0` alone reads the
 * browser's actual viewport rect directly, with no unit/measurement step to be wrong
 * about, so every full-bleed layer (`#app`, `.b-photo`, `.b-shade` in bridge.css) now
 * uses it instead. Do not reintroduce a JS- or dvh-measured height here. */

/** Ephemeral, per-screen UI state that mirrors each SwiftUI view's local `@State` —
 * never persisted, reset whenever the flow moves to a different step. See
 * `resetUiForStep`. */
const ui = {
  diceRolling: false, diceFace: 1,
  intensity: { partnerA: null, partnerB: null },
  stateSelected: { partnerA: [], partnerB: [] },
  stateCustom: { partnerA: "", partnerB: "" },
  breathing: false,
  oathChecked: [],
  roomV3: { entered: false, handoffAcked: false, told: false, moreOpen: false, emotion: { value: null, chips: [], custom: "" } },
  basementV3: { handoffAcked: false, fearChoice: null, fearCustom: "" },
  intensityTurn: "partnerA",
  intensityHandoffAcked: false,
  bridgeTurn: "partnerA",
  bridgeStage: "handoff",
  bridgeStepIndex: 0,
  bridgeCarouselIndex: 0,
  voiceTurn: "partnerA",
  voiceStage: "handoff",
  voiceBlobUrl: { partnerA: null, partnerB: null },
  voiceBlob: { partnerA: null, partnerB: null },
  voiceRecordSeconds: 0,
  voiceNotesList: null,
  recordingRole: null,
  recorders: { partnerA: null, partnerB: null },
  closingLineIsCourage: Math.random() < 0.5,
  closingSaved: false,
  houseMapTextExpanded: true,
  settingsOpen: false,
  paywallOpen: false,
  globalSheet: null,
  newRuleDraft: "",
};

let voiceTimer = null;
let lastFlowKey = null;
let splashDone = false;
let splashTimer = null;
const SPLASH_DURATION_MS = 1800;

function flowKey(flow) {
  return flow ? `${flow.step}:${flow.kind ?? ""}` : "";
}

function resetUiForStep(step, kind) {
  if (step === "dice") { ui.diceRolling = false; ui.diceFace = 1; store.resetDice(); }
  if (step === "intensityState") {
    ui.intensity = { partnerA: null, partnerB: null };
    ui.stateSelected = {
      partnerA: [...store.session.stateA.states],
      partnerB: [...store.session.stateB.states],
    };
    ui.stateCustom = { partnerA: store.session.stateA.customText, partnerB: store.session.stateB.customText };
    ui.intensityTurn = "partnerA";
    ui.intensityHandoffAcked = false;
  }
  if (step === "calmDown") ui.breathing = false;
  if (step === "oath") ui.oathChecked = [];
  if (step === "room") {
    ui.roomV3 = { entered: false, handoffAcked: false, told: false, moreOpen: false, emotion: { value: null, chips: [], custom: "" } };
  }
  if (step === "basement") {
    ui.basementV3 = { handoffAcked: false, fearChoice: null, fearCustom: "" };
  }
  if (step === "couplesAgreementSetup") ui.newRuleDraft = "";
  if (step === "bridgeFinale") {
    ui.bridgeTurn = "partnerA";
    ui.bridgeStage = "handoff";
    ui.bridgeStepIndex = 0;
    ui.bridgeCarouselIndex = 0;
  }
  if (step === "voiceSnapshot") {
    ui.recordingRole = null;
    ui.voiceTurn = "partnerA";
    ui.voiceStage = "handoff";
    ui.voiceBlobUrl = { partnerA: null, partnerB: null };
    ui.voiceBlob = { partnerA: null, partnerB: null };
  }
  if (step === "closing") { ui.closingLineIsCourage = Math.random() < 0.5; ui.closingSaved = false; playSuccess(); }
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
    startAmbientMusic();
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
  }
  // Every render, not just on a step change — ui.voiceStage (handoff -> record) toggles
  // within the same "voiceSnapshot" step, and the mute-for-recording rule needs to react
  // to that too. All of these are idempotent, so calling them redundantly is harmless.
  syncAmbientMusic(store.flow, ui);

  let html;
  if (ui.paywallOpen) {
    html = S.paywallScreen(ui);
  } else if (ui.settingsOpen) {
    html = S.settingsScreen(store, ui);
  } else {
    html = renderFlowScreen();
  }
  // Every real flow screen (see renderFlowScreen below) now renders its own
  // `.b-topbar` via bScreen() — there is no more floating global nav pill to add on
  // top of it (FIXES-v4 §0 also retires the "read together" caption that pill used
  // to carry, and its gear icon lives in each screen's own topbar instead).
  appEl.innerHTML = html + S.globalOverlays(store, ui);
  document.body.classList.toggle("is-light", !ui.paywallOpen && !ui.settingsOpen && LIGHT_STEPS.has(store.flow?.step));
}

// FIXES-v5 §6: the ambient loop now plays throughout instead of stopping once the
// couple enters the first room — it just ducks to ~15% in a room/basement
// conversation, and mutes outright on the voice-recording screen specifically.
function syncAmbientMusic(flow, uiState) {
  startAmbientMusic();
  if (flow.step === "voiceSnapshot" && uiState.voiceStage === "record") {
    muteAmbientForRecording();
    return;
  }
  unmuteAmbientAfterRecording();
  if (flow.step === "room" || flow.step === "basement") duckAmbientMusic();
  else unduckAmbientMusic();
}

// bridge.css's `.b-screen--light` (daytime onboarding screens like Names) needs
// `body.is-light` too, or the strip of body background visible during iOS's overscroll
// bounce stays the dark v3 default instead of matching the light screen underneath.
const LIGHT_STEPS = new Set(["names"]);

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
    case "houseMapGate": return S.houseMapGateScreen();
    case "houseMapAfterRoom": return S.houseMapAfterRoomScreen(f.completedKind);
    case "names": return S.namesScreen(store);
    case "couplesAgreementSetup": return S.couplesAgreementScreen(store, ui);
    case "contractView": return S.contractViewScreen(store);
    case "dice": return S.diceScreen(ui, store);
    case "intensityState": return S.intensityScreen(store, ui);
    case "calmDown": return S.calmDownScreen(ui);
    case "oath": return S.oathScreen(ui);
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
    startAmbientMusic();
    setLanguage(el.dataset.arg);
    render();
  },
  setLanguageInSettings(el) { setLanguage(el.dataset.arg); ui.globalSheet = null; render(); },

  openSettings() { ui.settingsOpen = true; render(); },
  toggleMusicPref() { setMusicEnabled(!isMusicEnabled()); render(); },
  toggleSoundPref() { setSoundEnabled(!isSoundEnabled()); render(); },
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
  openVoiceNotes() {
    ui.globalSheet = "voiceNotes";
    ui.voiceNotesList = null;
    render();
    listVoiceNotes(store.activeProfileId).then((notes) => {
      if (ui.globalSheet !== "voiceNotes") return;
      ui.voiceNotesList = notes;
      render();
    });
  },
  playVoiceNote(el) {
    const note = (ui.voiceNotesList || [])[Number(el.dataset.arg)];
    if (note) new Audio(URL.createObjectURL(note.blob)).play();
  },
  // The IndexedDB copy (voiceStore.js) is already as durable as the relationship
  // history in localStorage — same no-server, same-origin browser storage, same
  // survives-close-and-reopen guarantee. This is a manual backup on top of that, not
  // a fix for it: hands the actual audio file to the OS share sheet (Save to Files,
  // AirDrop, any cloud app) exactly like saveContract()'s image export below, so a
  // copy can live somewhere outside the browser's storage too.
  async exportVoiceNote(el) {
    const note = (ui.voiceNotesList || [])[Number(el.dataset.arg)];
    if (!note) return;
    const filename = `bridge-voice-${note.role}-${new Date(note.createdAt).toISOString().slice(0, 10)}.webm`;
    const file = new File([note.blob], filename, { type: note.blob.type || "audio/webm" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: L("voice_notes.title") }); return; }
      catch { /* user cancelled the share sheet or it failed — fall through to download */ }
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
  },
  openHouseMapFromSettings() { ui.houseMapTextExpanded = true; ui.globalSheet = "houseMapSettings"; render(); },
  openDisclaimerSheet() { ui.globalSheet = "disclaimer"; render(); },
  openCrisis() { ui.globalSheet = "crisis"; render(); },
  openPrivacy() { ui.globalSheet = "privacy"; render(); },
  openTerms() { ui.globalSheet = "terms"; render(); },
  closeGlobalSheet() { ui.globalSheet = null; render(); },
  confirmDeleteData() { ui.globalSheet = "deleteConfirm"; render(); },
  deleteData() {
    deleteVoiceNotesForRelationship(store.activeProfileId);
    store.deleteActiveProfileData();
    ui.globalSheet = null;
    ui.settingsOpen = false;
    render();
  },
  createProfile() {
    const name = prompt("Name this relationship (optional):", "") || "";
    store.createProfile(name);
    ui.globalSheet = null;
    render();
  },
  selectProfile(el) { store.selectProfile(el.dataset.arg); ui.globalSheet = null; render(); },
  restorePurchasesTestMode() { alert("PWA test mode: no real purchases to restore. See PARITY.md."); },

  advance() {
    store.advance();
    // page.m4a — map and room-to-room transitions specifically (FIXES-v5 §6), not
    // every single "advance" in the app (onboarding pages, agreement, etc).
    const step = store.flow.step;
    if (step === "houseMapGate" || step === "houseMapAfterRoom" || step === "room" || step === "basement" || step === "bridge") playPage();
    render();
  },

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
  toggleAgreementRule(el) {
    const text = L(el.dataset.arg);
    const i = store.couplesAgreement.indexOf(text);
    if (i >= 0) store.removeAgreementRule(i);
    else store.addAgreementRule(text);
    render();
  },
  removeCustomRule(el) {
    const exampleKeys = Array.from({ length: 7 }, (_, i) => `couples_agreement.example.${String(i + 1).padStart(2, "0")}`);
    const customRules = store.couplesAgreement.filter((r) => !exampleKeys.some((k) => L(k) === r));
    const text = customRules[Number(el.dataset.arg)];
    const i = store.couplesAgreement.indexOf(text);
    if (i >= 0) store.removeAgreementRule(i);
    render();
  },
  addCustomRule() {
    const input = document.getElementById("newRuleInput");
    store.addAgreementRule(input.value);
    ui.newRuleDraft = "";
    render();
  },

  // Dice — FIXES-v5 §5: a real CSS 3D tumble (.b-die.is-rolling, ~0.8s) rather than
  // flickering through faces by re-rendering, so the animation must run uninterrupted —
  // a single render() starts it, a single render() 0.8s later reveals the result. The
  // sound plays the instant the roll starts; the haptic fires once the spin settles.
  rollDice() {
    ui.diceRolling = true;
    playDice();
    render();
    setTimeout(() => {
      const value = store.rollDiceStep();
      ui.diceFace = value;
      ui.diceRolling = false;
      if (navigator.vibrate) navigator.vibrate(20);
      render();
    }, 800);
  },

  // Intensity & state
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
  intensityHandoffReady() { ui.intensityHandoffAcked = true; render(); },
  setEmotionValue(el) { ui.intensity[el.dataset.arg] = Number(el.dataset.arg2); render(); },
  submitIntensityTurn() {
    const role = ui.intensityTurn;
    const customEl = document.getElementById(`custom-${role}`);
    if (customEl) ui.stateCustom[role] = customEl.value.trim();
    store.setIntensity(ui.intensity[role], role);
    for (const s of ui.stateSelected[role]) store.toggleState(s, role);
    store.setCustomStateText(ui.stateCustom[role], role);
    if (role === "partnerA") {
      ui.intensityTurn = "partnerB";
      ui.intensityHandoffAcked = false;
      render();
    } else {
      store.advance();
    }
  },

  // Calm down
  startBreathing() { ui.breathing = true; render(); },

  // Oath
  toggleOathLine(el) { ui.oathChecked[Number(el.dataset.arg)] = !ui.oathChecked[Number(el.dataset.arg)]; render(); },
  completeOathAndAdvance() { store.completeOath(); playSuccess(); store.advance(); },

  // Ritual
  completeRitualAndAdvance() {
    store.completeRitual();
    store.advance();
  },

  // Rooms — FIXES-v4 §6 linear cycle (every "speaks" room; Kitchen is a plain
  // discussion, see markRoomDone below). Never touches store.activePartner/
  // pendingReveal directly — those stay exactly as state.js already manages them;
  // this only decides which of the cycle's screens to show right now.
  enterRoomV3() { ui.roomV3.entered = true; render(); },
  handoffReadyV3() {
    ui.roomV3.handoffAcked = true;
    ui.roomV3.told = false;
    ui.roomV3.moreOpen = false;
    ui.roomV3.emotion = { value: null, chips: [], custom: "" };
    render();
  },
  toggleRoomMoreV3() { ui.roomV3.moreOpen = !ui.roomV3.moreOpen; render(); },
  roomTellDoneV3() { ui.roomV3.told = true; render(); },
  setRoomEmotionValueV3(el) { ui.roomV3.emotion.value = Number(el.dataset.arg2); render(); },
  toggleRoomEmotionChipV3(el) {
    const s = el.dataset.arg;
    const list = ui.roomV3.emotion.chips;
    const i = list.indexOf(s);
    if (i >= 0) list.splice(i, 1); else list.push(s);
    render();
  },
  submitRoomEmotionV3() {
    const customEl = document.getElementById("roomEmotionCustom");
    if (customEl) ui.roomV3.emotion.custom = customEl.value.trim();
    ui.roomV3.handoffAcked = false;
    store.submitRoomTurn(ui.roomV3.emotion);
  },
  confirmRevealV3() {
    // FIXES-v5 §3: the "X, ваша очередь" ready screen is only for a genuinely new
    // step starting with someone else — not for this specific handback, where the
    // partner who just finished reading immediately answers the very same question.
    // roomDoneFlags[reveal.to] is still false exactly when that's what's about to
    // happen (confirmReveal() below then sets activePartner = reveal.to); when it's
    // already true this reveal instead finishes the room and advances to a new step,
    // whose own screen resets ui.roomV3 anyway, so the value set here doesn't matter.
    const reveal = store.pendingReveal;
    const continuesSameQuestion = !!reveal && !store.roomDoneFlags[reveal.to];
    if (reveal && !continuesSameQuestion) playSuccess(); // the room just finished
    ui.roomV3.handoffAcked = continuesSameQuestion;
    ui.roomV3.told = false;
    ui.roomV3.moreOpen = false;
    ui.roomV3.emotion = { value: null, chips: [], custom: "" };
    store.confirmReveal();
  },

  // Kitchen (the one genuine two-person discussion room) and every other still-
  // generic "both tap their own Done" usage reuse this directly.
  markRoomDone(el) {
    const role = el.dataset.arg;
    const bothWereNotDoneYet = !store.roomDoneFlags.partnerA || !store.roomDoneFlags.partnerB;
    store.markRoomDone(role);
    if (bothWereNotDoneYet && store.roomDoneFlags.partnerA && store.roomDoneFlags.partnerB) playSuccess();
    render();
  },

  // Basement — FIXES-v4 §7.
  basementHandoffReady() {
    ui.basementV3.handoffAcked = true;
    ui.basementV3.fearChoice = null;
    ui.basementV3.fearCustom = "";
    render();
  },
  chooseBasementFearOption(el) { ui.basementV3.fearChoice = el.dataset.arg; render(); },
  submitBasementFear() {
    const choice = ui.basementV3.fearChoice;
    let text;
    if (choice === "custom") {
      const input = document.getElementById("basementFearCustom");
      text = (input?.value ?? ui.basementV3.fearCustom).trim();
      if (!text) return;
    } else {
      const card = deck("fears").cards.find((c) => c.id === choice);
      if (!card) return;
      text = L(card.textKey);
    }
    ui.basementV3.handoffAcked = false;
    store.chooseBasementFear(text);
  },
  confirmBasementFearReadV3() {
    ui.basementV3.handoffAcked = false;
    store.confirmBasementFearRead();
  },
  basementAnswerGiven() { store.advanceBasementAsked(); },
  finishBasementAskingV3() {
    const bothWereNotDoneYet = !store.roomDoneFlags.partnerA || !store.roomDoneFlags.partnerB;
    store.finishBasementAsking();
    if (bothWereNotDoneYet && store.roomDoneFlags.partnerA && store.roomDoneFlags.partnerB) playSuccess();
  },

  // Bridge finale — FIXES-v4 §8: sequential, one partner's 3-step carousel + promise
  // checklist at a time, never side-by-side tabs.
  bridgeHandoffReady() {
    ui.bridgeStage = "cards";
    ui.bridgeStepIndex = 0;
    ui.bridgeCarouselIndex = 0;
    render();
  },
  // FIXES-v5: the step/need/gift deck is a tap-to-select icon grid now, not a
  // swipe carousel — a tile tap sets the selected index directly.
  selectBridgeGridCard(el) {
    ui.bridgeCarouselIndex = Number(el.dataset.arg);
    render();
  },
  bridgeSelectCard() {
    const kind = ["stepToward", "need", "gift"][ui.bridgeStepIndex];
    const deckId = { stepToward: "step_toward", need: "needs_connection", gift: "gifts" }[kind];
    const card = deck(deckId).cards[ui.bridgeCarouselIndex];
    store.selectBridgeCard(card.id, kind, ui.bridgeTurn);
    if (ui.bridgeStepIndex < 2) {
      ui.bridgeStepIndex += 1;
      ui.bridgeCarouselIndex = 0;
      render();
    } else {
      ui.bridgeStage = "promise";
      render();
    }
  },
  toggleBridgePromise(el) {
    const n = Number(el.dataset.arg);
    const current = !!(store.session.bridgeFinal[ui.bridgeTurn] || {})[`promise${n}`];
    store.setBridgePromise(ui.bridgeTurn, n, !current);
  },
  bridgeFinishTurn() {
    ui.bridgeTurn = "partnerB";
    ui.bridgeStage = "handoff";
    render();
  },

  // Voice snapshot
  async toggleVoiceRecording(el) {
    const role = el.dataset.arg;
    if (ui.recordingRole === role) {
      ui.recorders[role]?.stop();
      ui.recordingRole = null;
      if (voiceTimer) { clearInterval(voiceTimer); voiceTimer = null; }
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
        const blob = new Blob(chunks, { type: "audio/webm" });
        ui.voiceBlob[role] = blob;
        ui.voiceBlobUrl[role] = URL.createObjectURL(blob);
        render();
      };
      recorder.start();
      ui.recorders[role] = recorder;
      ui.recordingRole = role;
      ui.voiceRecordSeconds = 0;
      voiceTimer = setInterval(() => {
        ui.voiceRecordSeconds += 1;
        if (ui.voiceRecordSeconds >= 60) actions.toggleVoiceRecording(el);
        else render();
      }, 1000);
      render();
    } catch {
      alert("Microphone access was not granted — you can skip the voice snapshot instead.");
    }
  },
  voiceHandoffReady() { ui.voiceStage = "record"; render(); },
  playVoiceRecording(el) {
    const url = ui.voiceBlobUrl[el.dataset.arg];
    if (url) new Audio(url).play();
  },
  retryVoiceRecording(el) {
    ui.voiceBlobUrl[el.dataset.arg] = null;
    ui.voiceRecordSeconds = 0;
    render();
  },
  saveVoiceAndAdvance() {
    store.markVoiceNoteRecorded(ui.voiceTurn);
    const blob = ui.voiceBlob[ui.voiceTurn];
    if (blob) saveVoiceNote(store.activeProfileId, ui.voiceTurn, blob);
    if (ui.voiceTurn === "partnerA") {
      ui.voiceTurn = "partnerB";
      ui.voiceStage = "handoff";
      ui.voiceRecordSeconds = 0;
      render();
    } else {
      store.advance();
    }
  },
  saveVoiceSkip() {
    if (ui.voiceTurn === "partnerA") {
      ui.voiceTurn = "partnerB";
      ui.voiceStage = "handoff";
      ui.voiceRecordSeconds = 0;
      render();
    } else {
      store.advance();
    }
  },

  // Closing (certificate) — share:true so iOS's real share sheet ("Save Image", which
  // goes straight to Photos) is what opens, not a generic file download into Files.
  saveClosingCard() {
    const names = `${store.name("partnerA")} ${L("closing.names_and")} ${store.name("partnerB")}`;
    downloadOrShareImage({
      title: L("closing.certificate"),
      lines: [names, L("closing.certificate_body"), new Date().toLocaleDateString()],
      filename: "bridge-certificate.png",
      share: true,
    }).then(() => { ui.closingSaved = true; render(); });
  },
  closeSession() { store.endActiveSession(); render(); },

  // Contract — FIXES-v5 §8: "PDF" via the browser's own print sheet (window.print(),
  // scoped to just .b-paper by the @media print rule in bridge.css — no PDF library
  // needed, and iOS's print sheet itself offers "Save to Files" as a real PDF).
  // "В Фото" keeps the existing share-image flow — the honest web equivalent of
  // PHPhotoLibrary, there's no native photo-library API available to a PWA.
  printContract() { window.print(); },
  saveContract() {
    const names = `${store.name("partnerA")} ${L("closing.names_and")} ${store.name("partnerB")}`;
    downloadOrShareImage({
      title: L("contract.title"),
      lines: [names, L("contract.section_stop"), ...store.couplesAgreement, "", L("contract.section_promise"), L("bridge.promise_1"), L("bridge.promise_2")],
      filename: "bridge-contract.png",
      share: true,
    });
  },
};

/** Draws a plain "paper" card to a canvas and either downloads it (opens it in a new
 * tab, from which iOS Safari's share sheet offers "Save Image") or hands it to the
 * real Web Share API when `share` is true and the browser supports sharing files —
 * there is no native PDF generator or photo-library API available to a PWA, so this
 * is the honest web equivalent of both. FIXES-v5 §8: exported at 1290x2796 (3x) —
 * the resolution the spec gives for a proper Photos save on a current iPhone. */
async function downloadOrShareImage({ title, lines, filename, share }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1290; canvas.height = 2796;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#F4EDE2"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#C9A45C"; ctx.lineWidth = 6; ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
  ctx.strokeStyle = "#C9A45C"; ctx.lineWidth = 2; ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);
  ctx.fillStyle = "#1B1A18"; ctx.font = "bold 64px Georgia, serif"; ctx.textAlign = "center";
  ctx.fillText(title, canvas.width / 2, 190);
  ctx.fillStyle = "#1B1A18"; ctx.textAlign = "center";
  let y = 330;
  for (const line of lines) {
    if (line === "") { y += 30; continue; }
    ctx.font = /^[IVX]+\./.test(line) || line === lines[1] ? "600 40px -apple-system, sans-serif" : "44px -apple-system, sans-serif";
    y = wrapText(ctx, line, canvas.width / 2, y, 1120, 58) + 50;
  }
  const blob = await new Promise((resolve) => canvas.toBlob(resolve));
  if (share && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: "image/png" })] })) {
    try {
      await navigator.share({ files: [new File([blob], filename, { type: "image/png" })], title });
      return;
    } catch {
      // user cancelled the share sheet or it failed — fall through to download
    }
  }
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
  }
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
  return cy;
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
  if (el.id === "custom-partnerA") ui.stateCustom.partnerA = el.value;
  if (el.id === "custom-partnerB") ui.stateCustom.partnerB = el.value;
  if (el.id === "newRuleInput") ui.newRuleDraft = el.value;
});

// Finger-signature canvases on the contract (FIXES-v5 §8) — drawing never goes
// through a data-action, so it never triggers render() and never gets wiped
// mid-stroke; a fresh .b-sigpad element after any real render just starts blank
// again, which is fine since nothing here needs to persist past that screen.
let signing = null;
function sigPos(el, e) {
  const rect = el.getBoundingClientRect();
  const point = e.touches ? e.touches[0] : e;
  return { x: point.clientX - rect.left, y: point.clientY - rect.top };
}
appEl.addEventListener("pointerdown", (e) => {
  const el = e.target.closest(".b-sigpad");
  if (!el) return;
  e.preventDefault();
  const ctx = el.getContext("2d");
  ctx.strokeStyle = "#1B1A18";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  const { x, y } = sigPos(el, e);
  ctx.beginPath();
  ctx.moveTo(x, y);
  signing = el;
});
appEl.addEventListener("pointermove", (e) => {
  if (!signing) return;
  e.preventDefault();
  const ctx = signing.getContext("2d");
  const { x, y } = sigPos(signing, e);
  ctx.lineTo(x, y);
  ctx.stroke();
});
window.addEventListener("pointerup", () => { signing = null; });

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

// The ambient loop kept playing after the app was backgrounded/minimized — stop it
// the moment the tab/app is hidden, resume (respecting the music toggle and whatever
// duck level applied before) the moment it's visible again.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") stopAmbientMusic();
  else startAmbientMusic();
});

boot();
