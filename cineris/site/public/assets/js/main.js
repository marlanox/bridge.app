/* KEPT — page behaviour and scroll choreography.
   Uses GSAP + ScrollTrigger when present; every section is fully readable without them. */
(function () {
  'use strict';
  const CFG = window.CINERIS_CONFIG || {};
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const C = window.CinerisChain;
  const G = window.gsap, ST = window.ScrollTrigger;
  const motion = !reduce && G && ST;
  if (motion) G.registerPlugin(ST);

  /* ---------- menu ---------- */
  const btn = $('.menu-btn'), nav = $('.nav');
  if (btn && nav) {
    const set = open => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? 'Close' : 'Menu'; document.body.style.overflow = open ? 'hidden' : ''; };
    btn.addEventListener('click', () => set(!nav.classList.contains('open')));
    $$('a', nav).forEach(a => a.addEventListener('click', () => set(false)));
  }

  /* ---------- static chain drawings ---------- */
  $$('svg[data-chain]').forEach(svg => {
    try { C.render(svg, JSON.parse(svg.dataset.chain), { shape: svg.dataset.shape || 'loop', fixed: svg.dataset.fixed !== 'false', numeral: svg.dataset.numeral }); } catch (e) { /* leave empty */ }
  });

  /* ---------- hero ---------- */
  const heroSvg = $('#hero-chain');
  if (heroSvg && C) {
    C.render(heroSvg, [{ t: 'cable', cm: 12 }, { t: 'ashlink' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 8 }, { t: 'tear' }, { t: 'cable', cm: 6 }], { shape: 'line', fixed: false });
    if (!reduce) {
      const t0 = performance.now();
      const sway = now => { heroSvg.style.rotate = (Math.sin((now - t0) / 1800) * 1.2).toFixed(3) + 'deg'; requestAnimationFrame(sway); };
      requestAnimationFrame(sway);
    }
    if (motion) {
      G.from('.hero .word', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', delay: 0.1 });
      G.from('.hero .under > *', { y: 20, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.5, stagger: 0.1 });
      G.from(heroSvg, { yPercent: -30, duration: 2.2, ease: 'expo.out' });
      G.to('.hero .word', { yPercent: -30, opacity: 0.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      G.to('.hero .stage', { scale: 1.35, yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  }

  /* ---------- the break: chain assembles link by link while pinned ---------- */
  const brk = $('.break');
  if (brk && C) {
    const svg = $('svg', brk);
    C.render(svg, [{ t: 'cable', cm: 9 }, { t: 'ashlink' }, { t: 'forged', cm: 9 }], { shape: 'line', fixed: false });
    const links = $$('.oc-link', svg);
    const words = $$('.words b', brk);
    const ashIdx = links.findIndex(l => l.classList.contains('oc-ashlink'));
    if (motion) {
      words.forEach(w => w.classList.add('dim'));
      links.forEach(l => { l.style.opacity = 0; });
      ST.create({
        trigger: brk, start: 'top top', end: '+=180%', pin: true, scrub: 0.6,
        onUpdate: self => {
          const n = Math.round(self.progress * links.length * 1.15);
          links.forEach((l, i) => { l.style.opacity = i < n ? 1 : 0; });
          const stage = n <= ashIdx ? 0 : n <= ashIdx + 1 ? 1 : 2;
          words.forEach((w, i) => w.classList.toggle('dim', i !== stage));
        }
      });
    }
  }

  /* ---------- collection rail: horizontal on desktop ---------- */
  const rail = $('.rail');
  if (rail && motion && window.matchMedia('(min-width: 861px)').matches) {
    const dist = () => rail.scrollWidth - window.innerWidth + 80;
    G.to(rail, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.rail-wrap', start: 'center center', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true } });
  }

  /* ---------- reveals ---------- */
  if (motion) {
    $$('[data-reveal]').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      G.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    $$('.statement').forEach(el => {
      G.fromTo(el, { opacity: 0.15 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: true } });
    });
    $$('.plate[data-parallax] > svg, .plate[data-parallax] > img').forEach(el => {
      G.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.mem > *').forEach((el, i) => {
      G.from(el, { y: 60, opacity: 0, duration: 1.1, delay: i * 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.mem', start: 'top 80%' } });
    });
  }

  /* ---------- forms ---------- */
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
          out.innerHTML = '<p class="notice">Received. We reply by hand within three days.</p>';
          form.reset();
          return;
        } catch (e) { /* fall through to manual */ }
      }
      out.innerHTML = `<div class="notice"><p>Send this to <b>${CFG.email}</b> or DM <b>${CFG.instagram}</b>.</p><textarea readonly rows="5"></textarea><div class="actions"><button type="button" class="btn ghost">Copy</button></div></div>`;
      const ta = $('textarea', out); ta.value = text;
      $('button', out).addEventListener('click', e => {
        if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(() => { e.target.textContent = 'Copied'; }, () => ta.select()); else ta.select();
      });
    });
  });

  $$('[data-year]').forEach(n => { n.textContent = new Date().getFullYear(); });
  if (motion) window.addEventListener('load', () => ST.refresh());
})();
