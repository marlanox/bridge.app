/* THE THREE — compose your key: length, links (≤4), artifacts (≤3, the most precious included),
   clasp, a tear or a lock of hair in one bead. Live price, live drawing, order request. */
(function () {
  'use strict';
  const root = document.getElementById('bld');
  if (!root) return;
  const C = window.CinerisChain;
  const $ = s => root.querySelector(s);
  const $$ = s => Array.from(root.querySelectorAll(s));
  const BASE = +root.dataset.base;
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const name = el => el.nextElementSibling.querySelector('span') ? el.nextElementSibling.querySelector('span').textContent : el.nextElementSibling.textContent.replace(/\s*\+\$.*/, '').trim();

  // small drawings of each link type
  if (C) $$('svg[data-link]').forEach(svg => { try { C.render(svg, [{ t: svg.dataset.link, cm: 4 }], { shape: 'line', fixed: false }); } catch (e) { /* skip */ } });

  const limit = (sel, max, min, msg) => {
    $$(sel).forEach(cb => cb.addEventListener('change', () => {
      const on = $$(sel + ':checked');
      if (on.length > max) { cb.checked = false; say(msg); }
      else if (on.length < min) { cb.checked = true; say('At least one is needed.'); }
      else say('');
      update();
    }));
  };
  const say = m => { $('#art-msg').textContent = m || 'The most precious one you choose is included.'; };
  limit('input[name=link]', 4, 1, 'Four kinds of links at most.');
  limit('input[name=art]', 3, 1, 'Three artifacts at most. The rest of the chain is ours to string.');

  function state() {
    const radio = n => $(`input[name=${n}]:checked`);
    const arts = $$('input[name=art]:checked');
    const prices = arts.map(a => +a.dataset.price);
    const artCost = prices.reduce((s, p) => s + p, 0) - (prices.length ? Math.max(...prices) : 0);
    const total = BASE + +radio('len').dataset.add + +radio('clasp').dataset.add + +radio('keep').dataset.add + artCost;
    return { len: radio('len'), clasp: radio('clasp'), keep: radio('keep'), links: $$('input[name=link]:checked'), arts, total };
  }

  function update() {
    const s = state();
    $('#b-total').textContent = money(s.total);
    $('#b-dep').textContent = money(s.total / 2);
    $('.stone-color').hidden = !s.arts.some(a => a.value === 'stone');

    // tray: chosen artifacts as photographs
    const tray = $('#tray-arts');
    tray.innerHTML = '';
    s.arts.forEach(a => {
      const im = a.nextElementSibling.querySelector('img');
      const f = document.createElement('figure');
      f.innerHTML = `<img src="${im.getAttribute('src')}" alt="" style="object-position:${im.style.objectPosition}"><figcaption class="cap">${name(a)}${a.value === 'stone' ? ' · ' + $('#stone-color').value : ''}</figcaption>`;
      tray.appendChild(f);
    });

    // the bead
    const kind = s.keep.value;
    $('#tray-bead').hidden = !kind;
    $$('#tray-bead svg').forEach(svg => { svg.hidden = svg.dataset.kind !== kind; });
    $('#bead-caption').textContent = kind === 'tear' ? 'here: your tear, sealed in resin' : kind === 'hair' ? 'here: the hair of the one you love, sealed in glass' : '';

    // the chain, drawn to your length with your links
    if (C) {
      const segs = [];
      const n = s.links.length, per = Math.max(4, Math.round((+s.len.value - 10) / (n + (kind ? 1 : 0))));
      s.links.forEach((l, i) => { segs.push({ t: l.value, cm: per }); if (i === 0 && kind) segs.push(kind === 'tear' ? { t: 'tear' } : { t: 'reliquary', v: 'hair' }); });
      try { C.render(getSvg(), segs, { shape: 'loop', code: 'TT·YOURS' }); } catch (e) { /* skip */ }
    }

    $('#tray-sum').textContent = summary(s);
  }
  function getSvg() {
    let svg = $('#tray-links svg');
    if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('aria-label', 'Drawing of your chain'); $('#tray-links').appendChild(svg); }
    return svg;
  }
  function summary(s) {
    return [s.len.value + ' cm', s.links.map(name).join(' + '), s.arts.map(a => name(a) + (a.value === 'stone' ? ' (' + $('#stone-color').value + ')' : '')).join(', '), name(s.clasp).replace(/ clasp$/i, '') + ' clasp', s.keep.value ? name(s.keep) + ' in one bead' : '', 'Vault cell, one year'].filter(Boolean).join(' · ');
  }

  root.addEventListener('change', update);
  $('#b-order').addEventListener('click', () => {
    const s = state();
    const f = document.getElementById('order-form');
    const text = summary(s) + ' · ' + money(s.total) + ' (deposit ' + money(s.total / 2) + ')';
    f.querySelector('input[name=key]').value = text;
    document.getElementById('order-sum').textContent = text;
    f.hidden = false;
    f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => f.querySelector('#o-name').focus({ preventScroll: true }), 400);
  });
  update();
})();
