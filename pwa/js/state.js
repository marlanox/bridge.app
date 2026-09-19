// Game state — mirrors Bridge/ViewModels/SessionViewModel.swift + Bridge/App/AppState.swift
// + Bridge/Models/*.swift as closely as a plain JS object graph reasonably can.
// See PARITY.md: this is deliberately NOT sharing code with the Swift side, only the
// product logic it implements (same rules, same order of operations).

import { room, flowOrder } from "./content.js";

const PROFILES_KEY = "bridge.profiles";
const ACTIVE_PROFILE_KEY = "bridge.activeProfileId";
const snapshotKey = (profileId) => `bridge.snapshot.${profileId}`;

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const ROOM_ORDER = ["hall", "livingRoom", "study", "kidsRoom", "kitchen"];

function freshProfile() {
  return {
    id: uuid(),
    createdAt: Date.now(),
    displayName: "",
    partnerAName: "",
    partnerBName: "",
    greenTokens: 0,
    redTokens: 0,
    currency: 0,
    hasCompletedFirstSession: false,
    hasUnlockedFullVersion: false,
    couplesAgreement: [],
    sessionHistory: [],
  };
}

function freshGameSession(profile) {
  return {
    id: uuid(),
    partnerA: { name: profile.partnerAName, color: "purple" },
    partnerB: { name: profile.partnerBName, color: "green" },
    intensityA: 0,
    intensityB: 0,
    stateA: { states: [], customText: "" },
    stateB: { states: [], customText: "" },
    firstToSpeak: null,
    currentRoom: "hall",
    greenTokensEarned: 0,
    redTokensEarned: 0,
    cardsPlayed: [],
    basementExchanges: [],
    bridgeFinal: { partnerA: {}, partnerB: {} },
    voiceNoteRecorded: {},
    startedAt: Date.now(),
    completedAt: null,
  };
}

/** 1 green cancels 1 red, remaining greens convert to spendable currency — mirrors
 * RelationshipProfile.applyTokens on iOS. */
function applyTokens(profile, green, red) {
  profile.greenTokens += green;
  profile.redTokens += red;
  const cancel = Math.min(profile.greenTokens, profile.redTokens);
  profile.greenTokens -= cancel;
  profile.redTokens -= cancel;
  profile.currency += profile.greenTokens;
  profile.greenTokens = 0;
}

export class Store {
  constructor() {
    this.listeners = new Set();
    this._history = [];
    this.profiles = this._loadProfiles();
    if (this.profiles.length === 0) this.profiles = [freshProfile()];
    const savedActiveId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    this.activeProfileId = this.profiles.some((p) => p.id === savedActiveId)
      ? savedActiveId
      : this.profiles[0].id;
    this._saveProfiles();

    this._initSessionState(this.activeProfile());
    const snap = this._loadSnapshot(this.activeProfileId);
    if (snap) this._restore(snap);
  }

  // ---------------------------------------------------------------- plumbing

  /** Every screen transition (advance/jump) is recorded here so `back()` can always
   * retrace it — including all the way to the very first screen — and this is
   * persisted with the rest of the snapshot, so closing the app mid-walk and
   * reopening it never strands anyone on a step with no way back. */
  get flow() { return this._flow; }
  set flow(next) {
    if (this._flow !== undefined && !this._suppressHistory) {
      this._history.push(this._flow);
    }
    this._flow = next;
  }

  canGoBack() { return this._history.length > 0; }

  back() {
    if (!this.canGoBack()) return;
    this.set(() => {
      this._suppressHistory = true;
      this.flow = this._history.pop();
      this._suppressHistory = false;
    });
  }

  /** The escape hatch when a page is a genuine dead end: wipes the whole in-progress
   * walk (not the couple's saved names/agreement) and returns to Welcome. Reachable
   * from Settings on every screen. */
  restartWalk() {
    const profile = this.activeProfile();
    this.set(() => {
      this._initSessionState(profile);
      this._history = [];
    });
  }

  /** "Redo this page" — for a room/basement this actually re-rolls the room's
   * progress (mirrors starting it fresh); every other screen keeps its accumulated
   * session data (names, dice result, etc.) and only its own local UI selections are
   * cleared, which `app.js` handles by re-running `resetUiForStep`. */
  redoCurrentPage() {
    const f = this.flow;
    if (f.step === "room") { this.set(() => this._startRoom(f.kind)); return true; }
    if (f.step === "basement") { this.set(() => this._startBasement()); return true; }
    return false;
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Every mutator goes through here: apply the change, persist, re-render. */
  set(fn) {
    fn();
    this._persistSnapshot();
    for (const l of this.listeners) l();
  }

  activeProfile() {
    return this.profiles.find((p) => p.id === this.activeProfileId);
  }

  _loadProfiles() {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  _saveProfiles() {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(this.profiles));
    localStorage.setItem(ACTIVE_PROFILE_KEY, this.activeProfileId);
  }

  _loadSnapshot(profileId) {
    try {
      const raw = localStorage.getItem(snapshotKey(profileId));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  _persistSnapshot() {
    const snap = {
      flow: this.flow,
      session: this.session,
      couplesAgreement: this.couplesAgreement,
      roomDoneFlags: this.roomDoneFlags,
      activePartner: this.activePartner,
      placedCardsThisTurn: this.placedCardsThisTurn,
      basementQuestionsAsked: this.basementQuestionsAsked,
      basementCurrentAsker: this.basementCurrentAsker,
      voiceNoteSkipped: this.voiceNoteSkipped,
      history: this._history,
    };
    localStorage.setItem(snapshotKey(this.activeProfileId), JSON.stringify(snap));
  }

  _clearSnapshot(profileId) {
    localStorage.removeItem(snapshotKey(profileId));
  }

  _initSessionState(profile) {
    // Suppressed: this can run when an old session's flow is still set (ending a
    // walk, switching profiles) — that stale step must never leak into the new
    // session's back-history.
    this._suppressHistory = true;
    this.flow = { step: "welcome" };
    this._suppressHistory = false;
    this._history = [];
    this.session = freshGameSession(profile);
    this.activePartner = "partnerA";
    this.couplesAgreement = [...profile.couplesAgreement];
    this.roomTimeRemainingSeconds = 0;
    this.roomDoneFlags = { partnerA: false, partnerB: false };
    this.timerFired = false;
    this.timeUpBannerShown = false;
    this.placedCardsThisTurn = [];
    this.pendingReveal = null;
    this.basementQuestionsAsked = { partnerA: 0, partnerB: 0 };
    this.basementCurrentAsker = "partnerA";
    this.pendingBasementFearCardID = null;
    this.pendingBasementCustomText = null;
    this.voiceNoteSkipped = { partnerA: false, partnerB: false };
  }

  _restore(snap) {
    this._suppressHistory = true;
    this.flow = snap.flow;
    this._suppressHistory = false;
    this._history = snap.history ?? [];
    this.session = snap.session;
    this.couplesAgreement = snap.couplesAgreement;
    this.roomDoneFlags = snap.roomDoneFlags;
    this.activePartner = snap.activePartner;
    this.placedCardsThisTurn = snap.placedCardsThisTurn;
    this.basementQuestionsAsked = snap.basementQuestionsAsked;
    this.basementCurrentAsker = snap.basementCurrentAsker;
    this.voiceNoteSkipped = snap.voiceNoteSkipped;
    const cfg = this.currentRoomConfig();
    this.roomTimeRemainingSeconds = (cfg?.timeMinutes ?? 7) * 60;
  }

  other(role) {
    return role === "partnerA" ? "partnerB" : "partnerA";
  }

  seatRotation(role) {
    return role === "partnerB" ? 180 : 0;
  }

  name(role) {
    return role === "partnerA" ? this.session.partnerA.name : this.session.partnerB.name;
  }

  color(role) {
    return role === "partnerA" ? this.session.partnerA.color : this.session.partnerB.color;
  }

  // ------------------------------------------------------------- onboarding

  setNames(a, b) {
    this.set(() => {
      this.session.partnerA.name = a;
      this.session.partnerB.name = b;
    });
  }

  addAgreementRule(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.set(() => this.couplesAgreement.push(trimmed));
  }

  removeAgreementRule(index) {
    this.set(() => this.couplesAgreement.splice(index, 1));
  }

  // -------------------------------------------- dice / intensity / rituals

  rollDice() {
    const result = Math.random() < 0.5 ? "partnerA" : "partnerB";
    this.set(() => (this.session.firstToSpeak = result));
    return result;
  }

  setIntensity(value, role) {
    this.set(() => {
      if (role === "partnerA") this.session.intensityA = value;
      else this.session.intensityB = value;
    });
  }

  toggleState(state, role) {
    this.set(() => {
      const sel = role === "partnerA" ? this.session.stateA : this.session.stateB;
      const i = sel.states.indexOf(state);
      if (i >= 0) sel.states.splice(i, 1);
      else sel.states.push(state);
    });
  }

  setCustomStateText(text, role) {
    this.set(() => {
      if (role === "partnerA") this.session.stateA.customText = text;
      else this.session.stateB.customText = text;
    });
  }

  needsCalmDown() {
    return Math.max(this.session.intensityA, this.session.intensityB) >= 7;
  }

  completeOath() {
    this.set(() => this._awardTokens(1, 0));
  }

  completeRitual() {
    this.set(() => this._awardTokens(1, 0));
  }

  _awardTokens(green, red) {
    this.session.greenTokensEarned += green;
    this.session.redTokensEarned += red;
  }

  flagAgreementBroken() {
    this.set(() => this._awardTokens(0, 1));
  }

  // --------------------------------------------------------- flow advance

  /** Mirrors SessionViewModel.advance() exactly, case for case. */
  advance() {
    this.set(() => {
      const f = this.flow;
      switch (f.step) {
        case "welcome":
          this.flow = this.activeProfile().hasCompletedFirstSession
            ? { step: "dice" }
            : { step: "howItWorksWhatIsBridge" };
          break;
        case "howItWorksWhatIsBridge": this.flow = { step: "howItWorksApology" }; break;
        case "howItWorksApology": this.flow = { step: "disclaimer" }; break;
        case "disclaimer": this.flow = { step: "houseMap" }; break;
        case "houseMap": this.flow = { step: "names" }; break;
        case "names": this.flow = { step: "dice" }; break;
        case "couplesAgreementSetup": this.flow = { step: "voiceSnapshot" }; break;
        case "dice": this.flow = { step: "intensityState" }; break;
        case "intensityState":
          this.flow = this.needsCalmDown() ? { step: "calmDown" } : { step: "oath" };
          break;
        case "calmDown": this.flow = { step: "oath" }; break;
        case "oath": this.flow = { step: "ritual" }; break;
        case "ritual":
          this.flow = { step: "room", kind: "hall" };
          this._startRoom("hall");
          break;
        case "room":
          if (f.kind === "kitchen") {
            this.flow = { step: "basement" };
            this._startBasement();
          } else {
            const next = ROOM_ORDER[ROOM_ORDER.indexOf(f.kind) + 1];
            this.flow = { step: "room", kind: next };
            this._startRoom(next);
          }
          break;
        case "basement": this.flow = { step: "bridgeFinale" }; break;
        case "bridgeFinale":
          this._awardTokens(1, 0);
          this.flow = { step: "couplesAgreementSetup" };
          break;
        case "voiceSnapshot": this.flow = { step: "closing" }; break;
        case "closing": break;
      }
    });
  }

  jumpTo(step, extra = {}) {
    this.set(() => {
      this.flow = { step, ...extra };
      if (step === "room") this._startRoom(extra.kind, { seed: true });
      if (step === "basement") this._startBasement({ seed: true });
    });
  }

  // ------------------------------------------------------------- room life

  currentRoomConfig() {
    const f = this.flow;
    if (f.step === "room") return room(f.kind);
    if (f.step === "basement") return room("basement");
    return null;
  }

  isSequentialSpeakingRoom() {
    return this.currentRoomConfig()?.modes.includes("speaks") ?? false;
  }

  _startRoom(kind, opts = {}) {
    this.session.currentRoom = kind;
    const cfg = room(kind);
    this.roomDoneFlags = { partnerA: false, partnerB: false };
    this.placedCardsThisTurn = [];
    this.pendingReveal = null;
    this.timerFired = false;
    this.timeUpBannerShown = false;
    if (opts.seed) this._seedForPreview();

    const first = this.session.firstToSpeak || "partnerA";
    if (cfg.modes.includes("speaks")) {
      this.activePartner = cfg.order % 2 === 1 ? first : this.other(first);
    } else {
      this.activePartner = first;
    }
    this.roomTimeRemainingSeconds = (cfg.timeMinutes ?? 7) * 60;
  }

  playCard(card, deckId, customText = null) {
    this.set(() => {
      const play = {
        room: this.session.currentRoom,
        deckId,
        cardId: card.id,
        customText,
        playedBy: this.activePartner,
      };
      this.session.cardsPlayed.push(play);
      this.placedCardsThisTurn.push(play);
    });
  }

  markRoomDone(role) {
    this.set(() => {
      if (this.isSequentialSpeakingRoom()) {
        if (role !== this.activePartner) return;
        this.roomDoneFlags[role] = true;
        this.pendingReveal = { from: role, to: this.other(role), cards: [...this.placedCardsThisTurn] };
      } else {
        this.roomDoneFlags[role] = true;
        if (this.roomDoneFlags.partnerA && this.roomDoneFlags.partnerB) {
          this._awardTokens(1, 0);
          this._advanceInline();
        }
      }
    });
  }

  confirmReveal() {
    this.set(() => {
      const reveal = this.pendingReveal;
      if (!reveal) return;
      this.pendingReveal = null;
      if (this.roomDoneFlags[reveal.from] && this.roomDoneFlags[reveal.to]) {
        this._awardTokens(1, 0);
        this._advanceInline();
      } else {
        this.activePartner = reveal.to;
        this.placedCardsThisTurn = [];
        this.roomTimeRemainingSeconds = (this.currentRoomConfig()?.timeMinutes ?? 7) * 60;
        this.timerFired = false;
        this.timeUpBannerShown = false;
      }
    });
  }

  /** advance() without the outer `set()` wrapper, for callers already inside one. */
  _advanceInline() {
    const wasListeners = this.listeners;
    this.listeners = new Set(); // suppress nested notify; outer set() will notify once
    this.advance();
    this.listeners = wasListeners;
  }

  addMoreTime() {
    this.set(() => {
      this.roomTimeRemainingSeconds += 120;
      this.timeUpBannerShown = false;
    });
  }

  // ------------------------------------------------------------- basement

  _startBasement(opts = {}) {
    this.session.currentRoom = "basement";
    this.roomDoneFlags = { partnerA: false, partnerB: false };
    this.basementQuestionsAsked = { partnerA: 0, partnerB: 0 };
    this.basementCurrentAsker = this.session.firstToSpeak || "partnerA";
    this.activePartner = this.basementCurrentAsker;
    this.pendingBasementFearCardID = null;
    this.timerFired = false;
    this.timeUpBannerShown = false;
    this.roomTimeRemainingSeconds = 10 * 60;
    if (opts.seed) this._seedForPreview();
  }

  canCurrentAskerAsk() {
    return (this.basementQuestionsAsked[this.basementCurrentAsker] ?? 0) < 15 && !this.pendingBasementFearCardID;
  }

  askBasementQuestion(fearCardID, customText = null) {
    this.set(() => {
      if (!this.canCurrentAskerAsk()) return;
      this.pendingBasementFearCardID = fearCardID;
      this.pendingBasementCustomText = customText;
      this.activePartner = this.other(this.basementCurrentAsker);
    });
  }

  submitBasementResponse(response) {
    this.set(() => {
      const fearCardID = this.pendingBasementFearCardID;
      if (!fearCardID) return;
      this.basementQuestionsAsked[this.basementCurrentAsker] =
        (this.basementQuestionsAsked[this.basementCurrentAsker] ?? 0) + 1;
      this.session.basementExchanges.push({
        askedBy: this.basementCurrentAsker,
        fearCardID,
        customFearText: this.pendingBasementCustomText,
        response,
      });
      this.pendingBasementFearCardID = null;
      this.pendingBasementCustomText = null;
      this.basementCurrentAsker = this.other(this.basementCurrentAsker);
      this.activePartner = this.basementCurrentAsker;
    });
  }

  markBasementDone(role) {
    this.set(() => {
      this.roomDoneFlags[role] = true;
      if (this.roomDoneFlags.partnerA && this.roomDoneFlags.partnerB) {
        this._awardTokens(1, 0);
        this._advanceInline();
      }
    });
  }

  // ---------------------------------------------------------- bridge finale

  selectedBridgeCardID(kind, role) {
    return this.session.bridgeFinal[role]?.[`${kind}CardID`] ?? null;
  }

  selectBridgeCard(cardId, kind, role) {
    this.set(() => {
      const sel = this.session.bridgeFinal[role] || {};
      sel[`${kind}CardID`] = cardId;
      this.session.bridgeFinal[role] = sel;
    });
  }

  completeMandatoryCard(role) {
    this.set(() => {
      const sel = this.session.bridgeFinal[role] || {};
      sel.completedMandatoryCard = true;
      this.session.bridgeFinal[role] = sel;
    });
  }

  bridgeFinaleComplete() {
    const isComplete = (s) => !!(s && s.stepTowardCardID && s.needCardID && s.giftCardID && s.completedMandatoryCard);
    return isComplete(this.session.bridgeFinal.partnerA) && isComplete(this.session.bridgeFinal.partnerB);
  }

  // --------------------------------------------------------- voice snapshot

  markVoiceNoteRecorded(role) {
    this.set(() => (this.session.voiceNoteRecorded[role] = true));
  }

  // -------------------------------------------------------------- ticking

  /** Deliberately NOT wrapped in `set()` — a full re-render every second would blow
   * away focus/scroll position on whatever's on screen (e.g. an open card sheet).
   * app.js updates the visible clock text directly instead, and only asks for a real
   * render on the rare tick that actually changes what's on screen (the time-up
   * banner appearing). Still persists every tick so a reload never loses more than a
   * few seconds of countdown. */
  tick() {
    if (this.roomTimeRemainingSeconds <= 0) return { changed: false };
    this.roomTimeRemainingSeconds -= 1;
    let changed = false;
    if (this.roomTimeRemainingSeconds === 60) { this.timerFired = true; }
    if (this.roomTimeRemainingSeconds === 0) { this.timeUpBannerShown = true; changed = true; }
    this._persistSnapshot();
    return { changed };
  }

  // ------------------------------------------------------------- lifecycle

  canStartSession() {
    const p = this.activeProfile();
    return !p.hasCompletedFirstSession || p.hasUnlockedFullVersion;
  }

  /** Mirrors AppState.endActiveSession(). */
  endActiveSession() {
    const profile = this.activeProfile();
    this.session.completedAt = Date.now();
    applyTokens(profile, this.session.greenTokensEarned, this.session.redTokensEarned);
    profile.couplesAgreement = this.couplesAgreement;
    profile.partnerAName = this.session.partnerA.name;
    profile.partnerBName = this.session.partnerB.name;
    profile.hasCompletedFirstSession = true;
    profile.sessionHistory.push({
      id: this.session.id,
      date: Date.now(),
      greenEarned: this.session.greenTokensEarned,
      redEarned: this.session.redTokensEarned,
    });
    this._saveProfiles();
    this._clearSnapshot(profile.id);
    this.set(() => this._initSessionState(profile));
  }

  abandonActiveSession() {
    const profile = this.activeProfile();
    this.set(() => {
      this._initSessionState(profile);
      const snap = this._loadSnapshot(profile.id);
      if (snap) this._restore(snap);
    });
  }

  unlockFullVersionTestMode() {
    this.set(() => {
      const p = this.activeProfile();
      p.hasUnlockedFullVersion = true;
      this._saveProfiles();
    });
  }

  createProfile(displayName) {
    const p = freshProfile();
    p.displayName = displayName;
    this.set(() => {
      this.profiles.push(p);
      this.activeProfileId = p.id;
      this._saveProfiles();
      this._initSessionState(p);
    });
  }

  selectProfile(id) {
    this.set(() => {
      this.activeProfileId = id;
      this._saveProfiles();
      const p = this.activeProfile();
      this._initSessionState(p);
      const snap = this._loadSnapshot(p.id);
      if (snap) this._restore(snap);
    });
  }

  deleteActiveProfileData() {
    this.set(() => {
      const id = this.activeProfileId;
      this._clearSnapshot(id);
      this.profiles = this.profiles.filter((p) => p.id !== id);
      if (this.profiles.length === 0) this.profiles = [freshProfile()];
      this.activeProfileId = this.profiles[0].id;
      this._saveProfiles();
      this._initSessionState(this.activeProfile());
    });
  }

  /** Seeds deterministic content for a direct screen jump (dev/QA shortcut, mirrors
   * SessionViewModel.seedForUITestScreenshot — reachable via ?jump=<step> in the URL). */
  _seedForPreview() {
    if (!this.session.partnerA.name) this.session.partnerA.name = "Alex";
    if (!this.session.partnerB.name) this.session.partnerB.name = "Jordan";
    if (!this.session.firstToSpeak) this.session.firstToSpeak = "partnerA";
  }
}

export const ROOM_KIND_ORDER = ROOM_ORDER;
