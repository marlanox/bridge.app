// Procedurally synthesized tones — no bundled/licensed audio files, so nothing to track
// down (mirrors Bridge/ViewModels/ChimeSynth.swift on iOS). A shared AudioContext is
// created lazily on first use, since iOS Safari refuses to start one before a user
// gesture; every call site here is already inside a click handler, so that's satisfied.

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

/** A very short, quiet blip for an ordinary button tap. */
export function playTap() {
  const audio = getContext();
  if (!audio) return;
  playTone(740, audio.currentTime, 0.045, 0.06);
}

/** A soft three-note ascending chime (C5-E5-G5) — played once when the language
 * picker first appears. */
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

// =========================================================== Ambient pad
// A very soft, continuously-looping ambient pad — three sustained oscillators forming an
// open A-major chord (A3, E4, C#5), with a slow LFO on the gain so it breathes rather than
// droning flat. Mirrors Bridge/ViewModels/AmbientMusic.swift. Plays through every screen
// before a couple starts walking through the house; silent from the first room onward.
// start()/stop() are both idempotent.

const AMBIENT_FREQUENCIES = [220.0, 329.63, 415.3];
let ambientNodes = null;

export function startAmbient() {
  if (ambientNodes) return;
  const audio = getContext();
  if (!audio) return;

  const masterGain = audio.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audio.destination);
  // Gentle fade-in.
  masterGain.gain.setValueAtTime(0, audio.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.05, audio.currentTime + 2.5);

  // A slow LFO modulating the master gain gives the pad a soft "breathing" swell instead
  // of a flat sustained drone.
  const lfo = audio.createOscillator();
  const lfoGain = audio.createGain();
  lfo.frequency.value = 0.06; // ~16s per swell cycle
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  lfo.start();

  const oscillators = AMBIENT_FREQUENCIES.map((freq) => {
    const osc = audio.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(masterGain);
    osc.start();
    return osc;
  });

  ambientNodes = { masterGain, lfo, oscillators, audio };
}

export function stopAmbient() {
  if (!ambientNodes) return;
  const { masterGain, lfo, oscillators, audio } = ambientNodes;
  const fadeOutEnd = audio.currentTime + 1.5;
  masterGain.gain.cancelScheduledValues(audio.currentTime);
  masterGain.gain.setValueAtTime(masterGain.gain.value, audio.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, fadeOutEnd);
  oscillators.forEach((osc) => osc.stop(fadeOutEnd));
  lfo.stop(fadeOutEnd);
  ambientNodes = null;
}
