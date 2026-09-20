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
