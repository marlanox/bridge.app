/* MARLA KNOX — light, darkness, and very little else. */
(function () {
  'use strict';
  const CFG = window.CINERIS_CONFIG || {};
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const G = window.gsap, ST = window.ScrollTrigger;
  const motion = !reduce && G && ST;
  if (motion) G.registerPlugin(ST);

  /* menu */
  const btn = $('.menu-btn'), nav = $('.nav');
  if (btn && nav) {
    const set = open => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? 'Close' : 'Menu'; document.body.style.overflow = open ? 'hidden' : ''; };
    btn.addEventListener('click', () => set(!nav.classList.contains('open')));
    $$('a', nav).forEach(a => a.addEventListener('click', () => set(false)));
  }

  /* the threshold: a beam of light finds the piece in the dark */
  const th = $('.threshold');
  if (th) {
    let tx = 0.5, ty = 0.45, x = tx, y = ty, last = -1e9, t0 = performance.now();
    const move = (cx, cy) => { const r = th.getBoundingClientRect(); tx = (cx - r.left) / r.width; ty = (cy - r.top) / r.height; last = performance.now(); };
    th.addEventListener('pointermove', e => move(e.clientX, e.clientY));
    th.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); }, { passive: true });
    const loop = now => {
      if (now - last > 2600) { const s = (now - t0) / 1000; tx = 0.5 + Math.sin(s * 0.31) * 0.26; ty = 0.46 + Math.sin(s * 0.47) * 0.24; }
      x += (tx - x) * (reduce ? 1 : 0.05); y += (ty - y) * (reduce ? 1 : 0.05);
      th.style.setProperty('--x', (x * 100).toFixed(2) + '%');
      th.style.setProperty('--y', (y * 100).toFixed(2) + '%');
      th.style.setProperty('--sx', ((0.5 - x) * 46).toFixed(1) + 'px');
      th.style.setProperty('--sy', ((0.5 - y) * 46 + 14).toFixed(1) + 'px');
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    if (motion) {
      G.from('.threshold .name', { opacity: 0, letterSpacing: '1.2em', duration: 3, ease: 'power3.out' });
      G.from('.threshold .hint', { opacity: 0, duration: 2, delay: 2 });
      G.to('.threshold .center', { opacity: 0, ease: 'none', scrollTrigger: { trigger: th, start: 'top top', end: '60% top', scrub: true } });
    }
  }

  /* procession: each piece rises out of the dark, then returns to it */
  if (motion) {
    $$('.piece').forEach(p => {
      const img = $('img', p), label = $('.label', p);
      G.timeline({ scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } })
        .fromTo(img, { filter: 'brightness(0)', scale: 1.08 }, { filter: 'brightness(1)', scale: 1, ease: 'none', duration: 0.45 })
        .to(img, { filter: 'brightness(1)', duration: 0.1 })
        .to(img, { filter: 'brightness(0)', scale: 0.97, ease: 'none', duration: 0.45 });
      if (label) G.fromTo(label, { opacity: 0 }, { opacity: 1, scrollTrigger: { trigger: p, start: 'center 70%', end: 'center 50%', scrub: true } });
    });
    $$('.quiet .line, [data-reveal]').forEach(el => G.from(el, { opacity: 0, duration: 2.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 80%' } }));
    $$('.shots img').forEach(img => G.fromTo(img, { filter: 'brightness(0.1)' }, { filter: 'brightness(1)', ease: 'none', scrollTrigger: { trigger: img, start: 'top 95%', end: 'top 45%', scrub: true } }));
  }

  /* scenes: each object rises out of the dark, holds, and sinks back; its words breathe with it */
  if (motion) {
    $$('.scene').forEach(sc => {
      const media = $('.media', sc), words = $$('.line, .words, .small', sc);
      const tl = G.timeline({ scrollTrigger: { trigger: sc, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      if (media) tl.fromTo(media, { filter: 'brightness(0) blur(16px)', scale: 1.14, y: 60 }, { filter: 'brightness(1) blur(0px)', scale: 1, y: 0, ease: 'power1.out', duration: 0.45 }, 0)
        .to(media, { filter: 'brightness(0) blur(10px)', scale: 0.94, y: -50, ease: 'power1.in', duration: 0.4 }, 0.6);
      if (words.length) tl.fromTo(words, { opacity: 0, y: 30, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.3, stagger: 0.04 }, 0.2)
        .to(words, { opacity: 0, y: -24, duration: 0.25 }, 0.72);
    });
  }

  /* velvet silence: things rise out of the dark and sink back */
  if (motion) {
    $$('.whole img, .bead-sec .bead').forEach(el => {
      G.timeline({ scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
        .fromTo(el, { filter: 'brightness(0.04) blur(10px)', scale: 1.1 }, { filter: 'brightness(1) blur(0px)', scale: 1, ease: 'none', duration: 0.42 })
        .to(el, { filter: 'brightness(1) blur(0px)', duration: 0.16 })
        .to(el, { filter: 'brightness(0.15) blur(4px)', scale: 0.97, ease: 'none', duration: 0.42 });
    });
    $$('.headline, .title').forEach(h => G.from(h, { y: 60, opacity: 0, filter: 'blur(12px)', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } }));
    $$('.lead, .chips li, .steps li, .plain li, .cells article, .cell-card').forEach((el, i) => G.from(el, { y: 26, opacity: 0, duration: 1.4, ease: 'expo.out', delay: (i % 4) * 0.08, scrollTrigger: { trigger: el, start: 'top 92%' } }));
    $$('.velvet-light').forEach(sec => G.fromTo(sec, { '--ly': '-10%' }, { '--ly': '110%', ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } }));
  }

  /* product options: length, memory; total and 50% deposit */
  const buy = $('.buy[data-base]');
  if (buy) {
    const base = +buy.dataset.base;
    const money = n => '$' + Math.round(n).toLocaleString('en-US');
    const upd = () => {
      let t = base;
      $$('input[type=radio]:checked', buy).forEach(r => { t += +(r.dataset.add || 0); });
      const tot = $('.total .price', buy), dep = $('.deposit', buy);
      if (tot) tot.textContent = money(t);
      if (dep) dep.textContent = money(t / 2);
      return t;
    };
    buy.addEventListener('change', upd);
    upd();
    $('.req', buy).addEventListener('click', () => {
      const f = $('form', buy); f.hidden = false;
      const t = upd();
      const sum = [buy.dataset.name, ...$$('input[type=radio]:checked', buy).map(r => r.nextElementSibling.textContent.trim()), base ? money(t) + ' (deposit ' + money(t / 2) + ')' : 'by request'].join(' · ');
      $('input[name=piece]', f).value = sum;
      $('input:not([type=hidden])', f).focus();
    });
  }

  /* forms */
  $$('form[data-form]').forEach(form => {
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      const out = $('.form-out', form);
      const data = Object.fromEntries(new FormData(form).entries());
      data.form = form.dataset.form;
      const text = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
      if (CFG.formEndpoint) {
        try {
          const r = await fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error(r.status);
          out.innerHTML = '<p class="notice">Received. We will write to you.</p>'; form.reset(); return;
        } catch (e) { /* manual fallback */ }
      }
      out.innerHTML = `<div class="notice"><p>Send this to <b>${CFG.email}</b> or <b>${CFG.instagram}</b>.</p><textarea readonly rows="5"></textarea><button type="button" class="btn">Copy</button></div>`;
      const ta = $('textarea', out); ta.value = text;
      $('button', out).addEventListener('click', e => { if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(() => { e.target.textContent = 'Copied'; }, () => ta.select()); else ta.select(); });
    });
  });

  $$('[data-year]').forEach(n => { n.textContent = new Date().getFullYear(); });

  /* cell timers */
  const timers = $$('[data-countdown]');
  if (timers.length) {
    const pad = n => String(n).padStart(2, '0');
    const tick = () => timers.forEach(el => {
      let s = Math.max(0, Math.floor((new Date(el.dataset.countdown) - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60); s -= m * 60;
      el.textContent = `${d} d ${pad(h)} h ${pad(m)} m ${pad(s)} s`;
    });
    tick(); setInterval(tick, 1000);
  }
  if (motion) window.addEventListener('load', () => ST.refresh());
})();
