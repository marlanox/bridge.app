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
    let tx = 0.5, ty = 0.45, x = tx, y = ty, touched = false, t0 = performance.now();
    const move = (cx, cy) => { const r = th.getBoundingClientRect(); tx = (cx - r.left) / r.width; ty = (cy - r.top) / r.height; touched = true; };
    th.addEventListener('pointermove', e => move(e.clientX, e.clientY));
    th.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); }, { passive: true });
    const loop = now => {
      if (!touched || now - t0 > 0) {
        if (!touched) { const s = (now - t0) / 1000; tx = 0.5 + Math.sin(s * 0.35) * 0.22; ty = 0.48 + Math.sin(s * 0.53) * 0.2; }
      }
      x += (tx - x) * (reduce ? 1 : 0.06); y += (ty - y) * (reduce ? 1 : 0.06);
      th.style.setProperty('--x', (x * 100).toFixed(2) + '%');
      th.style.setProperty('--y', (y * 100).toFixed(2) + '%');
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

  /* product options: length, memory, vault message */
  const buy = $('.buy[data-base]');
  if (buy) {
    const base = +buy.dataset.base;
    const money = n => '$' + n.toLocaleString('en-US');
    const upd = () => {
      let t = base;
      $$('input[type=radio]:checked', buy).forEach(r => { t += +(r.dataset.add || 0); });
      $('.total .num', buy).textContent = money(t);
      const seal = $('input[name=seal]:checked', buy);
      $('.seal-date', buy).hidden = !seal || seal.value !== 'yes';
      const ini = $('input[name=ini]:checked', buy);
      if ($('.ini-letter', buy)) $('.ini-letter', buy).hidden = !ini || ini.value !== 'yes';
      return t;
    };
    const d = $('#seal-date', buy);
    if (d) { const now = new Date(); const max = new Date(now.getTime() + (CFG.vaultMaxDays || 365) * 864e5); d.min = new Date(now.getTime() + 864e5).toISOString().slice(0, 10); d.max = max.toISOString().slice(0, 10); }
    buy.addEventListener('change', upd);
    upd();
    $('.req', buy).addEventListener('click', () => {
      const f = $('form', buy); f.hidden = false;
      const sum = [buy.dataset.name, ...$$('input[type=radio]:checked', buy).map(r => r.nextElementSibling.textContent.trim()), d && !$('.seal-date', buy).hidden && d.value ? 'opens ' + d.value : '', $('#ini-letter', buy) && !$('.ini-letter', buy).hidden && $('#ini-letter', buy).value ? 'initial ' + $('#ini-letter', buy).value.toUpperCase() : '', money(upd())].filter(Boolean).join(' · ');
      $('input[name=piece]', f).value = sum;
      $('input', f).focus();
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
  if (motion) window.addEventListener('load', () => ST.refresh());
})();
