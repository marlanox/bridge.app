/* THE THREE — the sound of the house, synthesised in the browser (no recordings, no licences).
   A low velvet hum; a silver chime when something rises out of the dark; a small click of a link
   when a choice is made. Off until the visitor turns it on. */
(function () {
  'use strict';
  const btn = document.querySelector('.sound-btn');
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!btn || !AC) { if (btn) btn.hidden = true; return; }
  const KEY = 'tt-sound';
  let ctx = null, master = null, on = false, hum = [];
  const NOTES = [1318.5, 1567.98, 1760, 2093, 2349.3, 2637]; // E6 G6 A6 C7 D7 E7, a silver pentatonic

  function start() {
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') ctx.resume();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2.5);
    // velvet hum: two low detuned sines and filtered air
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; lp.connect(master);
    [[55, 0.05], [82.6, 0.03], [110.3, 0.012]].forEach(([f, g]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const gn = ctx.createGain(); gn.gain.value = g;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05 + Math.random() * 0.05;
      const lg = ctx.createGain(); lg.gain.value = g * 0.6; lfo.connect(lg); lg.connect(gn.gain);
      o.connect(gn); gn.connect(lp); o.start(); lfo.start(); hum.push(o, lfo);
    });
    const len = ctx.sampleRate * 3, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3; }
    const air = ctx.createBufferSource(); air.buffer = buf; air.loop = true;
    const ag = ctx.createGain(); ag.gain.value = 0.05; air.connect(ag); ag.connect(lp); air.start(); hum.push(air);
  }
  function stop() {
    if (!ctx || !master) return;
    const m = master, h = hum; hum = [];
    m.gain.cancelScheduledValues(ctx.currentTime); m.gain.setValueAtTime(m.gain.value, ctx.currentTime);
    m.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    setTimeout(() => { h.forEach(n => { try { n.stop(); } catch (e) { /* stopped */ } }); m.disconnect(); }, 1400);
    master = null;
  }
  // a struck silver bell: FM synthesis, slow decay
  function chime(gain = 0.05) {
    if (!on || !ctx || !master) return;
    const t = ctx.currentTime, f = NOTES[Math.floor(Math.random() * NOTES.length)];
    const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
    car.frequency.value = f; mod.frequency.value = f * 3.51; mg.gain.setValueAtTime(f * 1.4, t); mg.gain.exponentialRampToValueAtTime(1, t + 2.4);
    mod.connect(mg); mg.connect(car.frequency); car.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
    car.start(t); mod.start(t); car.stop(t + 3.8); mod.stop(t + 3.8);
  }
  // a link closing: a short bright tick
  function click() {
    if (!on || !ctx || !master) return;
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), hp = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.setValueAtTime(3400, t); o.frequency.exponentialRampToValueAtTime(1900, t + 0.05);
    hp.type = 'highpass'; hp.frequency.value = 1200;
    o.connect(hp); hp.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.start(t); o.stop(t + 0.1);
  }
  function set(v) {
    on = v; btn.setAttribute('aria-pressed', String(v)); btn.textContent = v ? 'Sound · on' : 'Sound · off';
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* private mode */ }
    v ? start() : stop();
  }
  btn.addEventListener('click', () => set(!on));
  // a remembered "on" still waits for the first touch, as browsers require
  let wanted = false; try { wanted = localStorage.getItem(KEY) === '1'; } catch (e) { /* none */ }
  if (wanted) { btn.textContent = 'Sound · tap'; const first = () => { set(true); window.removeEventListener('pointerdown', first); }; window.addEventListener('pointerdown', first); }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) chime(); }), { threshold: 0.55 });
    document.querySelectorAll('.whole, .bead-stage, .cell-card, .headline').forEach(el => io.observe(el));
  }
  document.addEventListener('change', e => { if (e.target.matches('input[type=radio], input[type=checkbox], select')) click(); });
  document.addEventListener('submit', () => chime(0.07), true);
  window.TheThreeSound = { chime, click };
})();
