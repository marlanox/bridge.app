// Real bundled audio (FIXES-v5 §5/§6) plus two synthesized tones kept for moments no
// file was supplied for (the welcome chime, the plain button blip used before the real
// tap.m4a landed). A shared AudioContext is created lazily on first use, since iOS
// Safari refuses to start one before a user gesture; every synthesized call site is
// already inside a click handler, so that's satisfied.

let ctx = null;

function getContext() {
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    ctx = new AudioContextClass();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(frequency, startTime, duration, volume) {
  const audio = getContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.connect(audio.destination);

  const attack = 0.015;
  const release = Math.min(duration / 2, 0.15);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + attack);
  gain.gain.setValueAtTime(volume, startTime + duration - release);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/** A soft three-note ascending chime (C5-E5-G5) — played once when the language
 * picker first appears. No file was supplied for this one, so it stays synthesized. */
export function playWelcomeChime() {
  const audio = getContext();
  if (!audio) return;
  const notes = [523.25, 659.25, 783.99];
  const noteDuration = 0.42;
  const gap = 0.1;
  notes.forEach((freq, i) => {
    playTone(freq, audio.currentTime + i * (noteDuration + gap), noteDuration, 0.1);
  });
}

// ======================================================= settings (persisted)
// FIXES-v5 §6: "Музыка" and "Звуки кнопок" toggles in Settings. Read once at module
// load, kept in memory, written straight through on every change — there's no
// migration concern here, just two booleans.
const MUSIC_PREF_KEY = "bridge.pref.music";
const SOUND_PREF_KEY = "bridge.pref.sound";

function readBoolPref(key) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? true : v === "1";
  } catch {
    return true;
  }
}
function writeBoolPref(key, value) {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* private-browsing/storage-denied — the toggle still works for this session */
  }
}

let musicPref = readBoolPref(MUSIC_PREF_KEY);
let soundPref = readBoolPref(SOUND_PREF_KEY);

export function isMusicEnabled() {
  return musicPref;
}
export function isSoundEnabled() {
  return soundPref;
}
export function setMusicEnabled(value) {
  musicPref = value;
  writeBoolPref(MUSIC_PREF_KEY, value);
  if (value) startAmbientMusic();
  else stopAmbientMusic();
}
export function setSoundEnabled(value) {
  soundPref = value;
  writeBoolPref(SOUND_PREF_KEY, value);
}

// ======================================================= one-shot sound effects
// tap.m4a / success.m4a / page.m4a / dice.m4a — real files (FIXES-v5 §6), each play
// gated by the "Звуки кнопок" toggle. A fresh Audio() per call rather than one shared
// element: taps can overlap in quick succession and each needs its own playback head.
function playEffect(fileName, volume) {
  if (!soundPref) return;
  try {
    const el = new Audio(`assets/audio/${fileName}`);
    el.volume = volume;
    el.play().catch(() => {});
  } catch {
    /* ignore — a missed sound effect is never worth surfacing to the couple */
  }
}

/** A very short, quiet click for an ordinary button tap — every `.b-cta`/`.b-chip`/
 * `.b-check` already routes through the single delegated click handler in app.js, so
 * wiring it there covers all three in one place. Paired with a light haptic tick. */
export function playTap() {
  playEffect("tap.m4a", 0.5);
  if (navigator.vibrate) navigator.vibrate(8);
}

/** Room complete, oath marked, certificate reached. */
export function playSuccess() {
  playEffect("success.m4a", 0.65);
}

/** Map / room-to-room transitions. */
export function playPage() {
  playEffect("page.m4a", 0.5);
}

/** The dice roll, played the instant the roll starts. The haptic tick belongs at the
 * *end* of the ~0.8s spin instead (FIXES-v5 §5), so rollDice() in app.js times that
 * itself rather than firing it from in here. */
export function playDice() {
  playEffect("dice.m4a", 0.7);
}

// ======================================================= ambient background music
// ambient-loop.m4a (FIXES-v5 §6): starts after the first tap anywhere (iOS blocks
// autoplay before a user gesture), fades in over ~2s to ~35% volume, ducks to ~15% in
// a room/basement conversation, and mutes outright on the voice-recording screen. iOS
// silent-mode respect (AVAudioSession .ambient) has no web equivalent — that's a
// native-only guarantee and stays out of scope here.
const AMBIENT_SRC = "assets/audio/ambient-loop.m4a";
const AMBIENT_VOLUME_NORMAL = 0.35;
const AMBIENT_VOLUME_DUCKED = 0.15;
const AMBIENT_FADE_STEP_MS = 60;
const AMBIENT_FADE_STEP = 0.03;

let ambientEl = null;
let ambientFadeTimer = null;
let ambientTargetVolume = AMBIENT_VOLUME_NORMAL;
let ambientMutedForRecording = false;

function fadeAmbientTo(target) {
  if (!ambientEl) return;
  clearInterval(ambientFadeTimer);
  ambientFadeTimer = setInterval(() => {
    const v = ambientEl.volume;
    if (Math.abs(v - target) < AMBIENT_FADE_STEP) {
      ambientEl.volume = target;
      clearInterval(ambientFadeTimer);
      if (target === 0) ambientEl.pause();
      return;
    }
    ambientEl.volume = v < target ? v + AMBIENT_FADE_STEP : v - AMBIENT_FADE_STEP;
  }, AMBIENT_FADE_STEP_MS);
}

function currentAmbientTarget() {
  return ambientMutedForRecording ? 0 : ambientTargetVolume;
}

/** Idempotent — safe to call on every render. First call creates the element and
 * attempts playback (blocked silently until a real user gesture reaches it); later
 * calls just make sure a previously-stopped loop resumes. */
export function startAmbientMusic() {
  if (!musicPref) return;
  if (!ambientEl) {
    ambientEl = new Audio(AMBIENT_SRC);
    ambientEl.loop = true;
    ambientEl.volume = 0;
  }
  ambientEl.play().catch(() => {});
  fadeAmbientTo(currentAmbientTarget());
}

export function stopAmbientMusic() {
  if (!ambientEl) return;
  fadeAmbientTo(0);
}

/** In a room/basement conversation. */
export function duckAmbientMusic() {
  ambientTargetVolume = AMBIENT_VOLUME_DUCKED;
  if (ambientEl && musicPref) fadeAmbientTo(currentAmbientTarget());
}

/** Everywhere else the loop plays at its normal level. */
export function unduckAmbientMusic() {
  ambientTargetVolume = AMBIENT_VOLUME_NORMAL;
  if (ambientEl && musicPref) fadeAmbientTo(currentAmbientTarget());
}

/** The voice-recording screen specifically — muted outright, not just ducked, so it
 * never bleeds into the recording. */
export function muteAmbientForRecording() {
  ambientMutedForRecording = true;
  if (ambientEl) fadeAmbientTo(0);
}

export function unmuteAmbientAfterRecording() {
  ambientMutedForRecording = false;
  if (ambientEl && musicPref) fadeAmbientTo(currentAmbientTarget());
}
