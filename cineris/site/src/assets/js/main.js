/* ORDO CINERIS — page behaviour. No dependencies. */
(function () {
  'use strict';
  const CFG = window.CINERIS_CONFIG || {};
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- menu ---------- */
  const btn = $('.menu-btn'), nav = $('.nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Menu'; document.body.style.overflow = ''; }));
  }

  /* ---------- reveal: only things below the fold start lowered ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rise').forEach(n => { if (n.getBoundingClientRect().top > window.innerHeight) { n.classList.add('pre'); io.observe(n); } });
  }

  const C = window.CinerisChain;

  /* ---------- hero chain: hangs, sways, lengthens with scroll ---------- */
  const heroSvg = $('#hero-chain');
  if (heroSvg && C) {
    C.render(heroSvg, [
      { t: 'cable', cm: 9 }, { t: 'ashlink' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 7 }, { t: 'diamond' }, { t: 'cable', cm: 5 }
    ], { shape: 'line', code: 'OC·I·07·K4M9', numeral: 'I' });
    if (!reduce) {
      let t0 = performance.now();
      const tick = now => {
        const t = (now - t0) / 1000;
        const sc = Math.min(1, window.scrollY / 900);
        heroSvg.style.transform = `rotate(${(Math.sin(t * 0.55) * 1.4 + sc * 4).toFixed(3)}deg)`;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------- ash: slow embers in the hero ---------- */
  const cv = $('canvas.ash');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let W, H, parts = [];
    const size = () => { const r = cv.getBoundingClientRect(); W = cv.width = r.width * devicePixelRatio; H = cv.height = r.height * devicePixelRatio; };
    size(); window.addEventListener('resize', size);
    for (let i = 0; i < 70; i++) parts.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.3, v: Math.random() * 0.00035 + 0.00008, d: Math.random() * Math.PI * 2, ember: Math.random() < 0.12 });
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.y -= p.v; p.d += 0.004; p.x += Math.sin(p.d) * 0.00025;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = p.ember ? `rgba(208,37,63,${0.35 + 0.3 * Math.sin(p.d * 3)})` : 'rgba(196,190,179,0.18)';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  /* ---------- spine: a chain down the left edge that grows as you read ---------- */
  const spine = $('.spine svg');
  if (spine && C) {
    const segs = [];
    for (let i = 0; i < 5; i++) segs.push({ t: 'cable', cm: 26 }, { t: 'ashlink' }, { t: 'forged', cm: 10 });
    C.render(spine, segs, { shape: 'line', fixed: false });
    spine.setAttribute('preserveAspectRatio', 'xMidYMin slice');
    const links = $$('.oc-link', spine);
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      const f = h > 0 ? scrollY / h : 0;
      const n = Math.round(f * links.length);
      links.forEach((l, i) => { l.style.opacity = i <= n ? 1 : 0.08; });
    };
    upd(); addEventListener('scroll', upd, { passive: true });
  }

  /* ---------- anatomy: each step lights its part of the chain ---------- */
  const stage = $('.anatomy .stage svg');
  if (stage && C) {
    const plan = [
      { t: 'cable', cm: 5 }, { t: 'ashlink' }, { t: 'forged', cm: 7 }, { t: 'cable', cm: 4 }, { t: 'pearl' }, { t: 'cable', cm: 3 }
    ];
    C.render(stage, plan, { shape: 'line', code: 'OC·I·07·K4M9' });
    const box = stage.parentElement;
    const kinds = { 0: ['clasp'], 1: ['cable'], 2: ['ashlink'], 3: ['forged'], 4: ['pearl'], 5: ['hallmark', 'passport'] };
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const k = kinds[e.target.dataset.step] || [];
      box.classList.add('focusing');
      $$('.oc-link', stage).forEach(l => l.classList.toggle('on', k.some(x => l.classList.contains('oc-' + x))));
    }), { rootMargin: '-45% 0px -45% 0px' });
    $$('.anatomy .step').forEach(s => io.observe(s));
  }

  /* ---------- small decorative chains in plates ---------- */
  $$('svg[data-chain]').forEach(svg => {
    try { C.render(svg, JSON.parse(svg.dataset.chain), { shape: svg.dataset.shape || 'loop', code: svg.dataset.code, numeral: svg.dataset.numeral, fixed: svg.dataset.fixed !== 'false' }); } catch (e) { /* leave empty */ }
  });

  /* ---------- forms: send to endpoint if configured, else draft a message ---------- */
  $$('form[data-form]').forEach(form => {
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      const out = $('.form-out', form) || form.appendChild(Object.assign(document.createElement('div'), { className: 'form-out' }));
      const data = Object.fromEntries(new FormData(form).entries());
      data.form = form.dataset.form;
      if (window.CinerisAtelier && form.dataset.form === 'commission') data.chain = window.CinerisAtelier.summary();
      const text = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
      if (CFG.formEndpoint) {
        try {
          const r = await fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error(r.status);
          out.innerHTML = '<p class="notice ok">Received. The atelier answers every request by hand, usually within three days. If you are chosen, you will hear from us by the channel you gave.</p>';
          form.reset();
          return;
        } catch (e) {
          out.innerHTML = '<p class="notice err">The request could not be delivered just now. Please send the text below to the atelier instead.</p>';
        }
      } else out.innerHTML = '';
      const note = document.createElement('div');
      note.className = 'notice';
      note.innerHTML = `<p>Copy this request and send it to <b class="mono">${CFG.email || 'atelier@ordocineris.com'}</b> or by direct message to <b class="mono">${CFG.instagram || '@ordocineris'}</b>.</p><textarea readonly rows="6" id="draft-${form.dataset.form}"></textarea><div class="actions"><button type="button" class="btn small ghost">Copy request</button></div>`;
      $('textarea', note).value = text;
      $('button', note).addEventListener('click', e => {
        const ta = $('textarea', note);
        const done = () => { e.target.textContent = 'Copied'; };
        if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(done, () => { ta.select(); });
        else ta.select();
      });
      out.appendChild(note);
    });
  });

  /* ---------- year ---------- */
  $$('[data-year]').forEach(n => { n.textContent = new Date().getFullYear(); });
})();
