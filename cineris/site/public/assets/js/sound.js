/* THE THREE — the sound of the house. Synthesised in the browser (no recordings, no licences),
   rendered to audio files and played through <audio>, so it also plays on an iPhone set to silent.
   A low velvet hum with distant silver; a chime when something rises out of the dark; a link click
   on every choice. Off until the visitor asks for it. */
(function () {
  'use strict';
  const btn = document.querySelector('.sound-btn');
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OAC) { if (btn) btn.hidden = true; document.querySelectorAll('.enter-sound').forEach(b => { b.hidden = true; }); return; }
  const KEY = 'tt-sound', SR = 44100;
  let on = false, loop = null, chimes = [], tick = null, ready = null;

  function wav(buf) {
    const ch = buf.getChannelData(0), n = ch.length, out = new DataView(new ArrayBuffer(44 + n * 2));
    const w = (o, s) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); out.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); out.setUint32(16, 16, true);
    out.setUint16(20, 1, true); out.setUint16(22, 1, true); out.setUint32(24, SR, true); out.setUint32(28, SR * 2, true);
    out.setUint16(32, 2, true); out.setUint16(34, 16, true); w(36, 'data'); out.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) out.setInt16(44 + i * 2, Math.max(-1, Math.min(1, ch[i])) * 0x7fff, true);
    return URL.createObjectURL(new Blob([out], { type: 'audio/wav' }));
  }
  function bell(ctx, t, f, gain, decay) {
    const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
    car.frequency.value = f; mod.frequency.value = f * 3.51;
    mg.gain.setValueAtTime(f * 1.3, t); mg.gain.exponentialRampToValueAtTime(1, t + decay * 0.7);
    mod.connect(mg); mg.connect(car.frequency); car.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    car.start(t); mod.start(t); car.stop(t + decay + 0.1); mod.stop(t + decay + 0.1);
  }
  async function render() {
    // 1. a 24-second velvet loop: low hum, air, three distant silver bells
    const L = 24, ctx = new OAC(1, SR * L, SR);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; lp.connect(ctx.destination);
    [[55, 0.16], [82.4, 0.09], [110, 0.04]].forEach(([f, g]) => {
      const o = ctx.createOscillator(); o.frequency.value = f; const gn = ctx.createGain(); gn.gain.value = g;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 1 / 12; const lg = ctx.createGain(); lg.gain.value = g * 0.5;
      lfo.connect(lg); lg.connect(gn.gain); o.connect(gn); gn.connect(lp); o.start(); lfo.start();
    });
    const nb = ctx.createBuffer(1, SR * L, SR), d = nb.getChannelData(0); let last = 0;
    for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 6; }
    const air = ctx.createBufferSource(); air.buffer = nb; const ag = ctx.createGain(); ag.gain.value = 0.12; air.connect(ag); ag.connect(lp); air.start();
    [[3.0, 1567.98], [11.5, 2093], [18.2, 1760]].forEach(([t, f]) => bell(ctx, t, f, 0.05, 4.5));
    const mix = await ctx.startRendering();
    const ch = mix.getChannelData(0), fade = SR * 1.5; // seamless loop edges
    for (let i = 0; i < fade; i++) { const k = i / fade; ch[i] *= k; ch[ch.length - 1 - i] *= k; }
    loop = new Audio(wav(mix)); loop.loop = true; loop.volume = 0.7; loop.setAttribute('playsinline', '');
    // 2. chimes for things appearing
    for (const f of [1318.5, 1567.98, 1760, 2093, 2349.3]) {
      const c = new OAC(1, SR * 4, SR); bell(c, 0.01, f, 0.18, 3.8);
      chimes.push(wav(await c.startRendering()));
    }
    // 3. the click of a link
    const k = new OAC(1, SR * 0.15, SR), o = k.createOscillator(), g = k.createGain(), hp = k.createBiquadFilter();
    o.type = 'triangle'; o.frequency.setValueAtTime(3400, 0); o.frequency.exponentialRampToValueAtTime(1900, 0.05);
    hp.type = 'highpass'; hp.frequency.value = 1200; o.connect(hp); hp.connect(g); g.connect(k.destination);
    g.gain.setValueAtTime(0.0001, 0); g.gain.exponentialRampToValueAtTime(0.35, 0.004); g.gain.exponentialRampToValueAtTime(0.0001, 0.09);
    o.start(0); o.stop(0.1); tick = wav(await k.startRendering());
  }
  function play(url, vol) { if (!on || !url) return; const a = new Audio(url); a.volume = vol; a.play().catch(() => {}); }
  const chime = () => play(chimes[Math.floor(Math.random() * chimes.length)], 0.5);
  const click = () => play(tick, 0.5);

  async function set(v) {
    on = v;
    if (btn) { btn.setAttribute('aria-pressed', String(v)); btn.textContent = v ? 'Sound · on' : 'Sound · off'; }
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* private mode */ }
    if (v) {
      ready = ready || render();
      await ready;
      if (!on) return;
      loop.currentTime = 0; loop.play().catch(() => { if (btn) btn.textContent = 'Sound · tap again'; });
      setTimeout(chime, 600);
    } else if (loop) loop.pause();
  }
  if (btn) btn.addEventListener('click', () => set(!on));
  document.querySelectorAll('.enter-sound').forEach(b => b.addEventListener('click', () => {
    set(true);
    const t = document.querySelector(b.dataset.scroll || '');
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  }));
  // pre-render quietly so the first tap is instant
  if ('requestIdleCallback' in window) requestIdleCallback(() => { ready = ready || render(); }, { timeout: 4000 });
  let wanted = false; try { wanted = localStorage.getItem(KEY) === '1'; } catch (e) { /* none */ }
  if (wanted && btn) { btn.textContent = 'Sound · tap'; const first = () => { set(true); window.removeEventListener('pointerdown', first); }; window.addEventListener('pointerdown', first); }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) chime(); }), { threshold: 0.55 });
    document.querySelectorAll('.whole, .bead-stage, .cell-card, .headline').forEach(el => io.observe(el));
  }
  document.addEventListener('change', e => { if (e.target.matches('input[type=radio], input[type=checkbox], select')) click(); });
  document.addEventListener('submit', () => chime(), true);
  window.TheThreeSound = { chime, click, set };
})();
