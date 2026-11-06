/* ORDO CINERIS — the atelier configurator. Builds a chain segment by segment. */
(function () {
  'use strict';
  const C = window.CinerisChain;
  const root = document.getElementById('atelier');
  if (!root || !C) return;
  const $ = s => root.querySelector(s);
  const KEY = 'oc-atelier-v1';
  const DEFAULT = [
    { t: 'cable', cm: 12 }, { t: 'cameo' }, { t: 'bali', cm: 10 }, { t: 'goldring' }, { t: 'byzantine', cm: 6 }, { t: 'cable', cm: 12 }
  ];
  const SHORT = { cable: 'C', bali: 'B', byzantine: 'Z', paperclip: 'L', cameo: 'CAM', ruby: 'RBY', goldring: 'AU', reliquary: 'REL' };
  let segs;
  try { segs = JSON.parse(localStorage.getItem(KEY)) || DEFAULT.slice(); } catch (e) { segs = DEFAULT.slice(); }
  const money = n => '$' + n.toLocaleString('en-US');

  function code() {
    return 'OC/' + segs.map(s => SHORT[s.t] + (s.cm ? s.cm : '') + (s.v ? ':' + s.v.toUpperCase() : '')).join('-');
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(segs)); } catch (e) { /* private mode */ } }

  function draw() {
    C.render($('#atelier-svg'), segs, { shape: 'loop', code: 'OC·YOURS' });
    const len = C.length(segs), price = C.price(segs);
    $('#r-len').textContent = len.toFixed(1) + ' cm';
    $('#r-in').textContent = (len / 2.54).toFixed(1) + ' in';
    $('#r-price').textContent = money(price);
    const art = segs.filter(s => C.CATALOG[s.t].kind === 'artifact').length;
    $('#r-days').textContent = (9 + art * 2) + '–' + (14 + art * 3) + ' days';
    const fit = len < 46 ? 'Collar. Sits at the base of the neck.' : len < 53 ? 'Classic. Lies on the collarbone, visible at an open shirt.' : len < 63 ? 'Over the knit. Falls onto a crew-neck sweater.' : 'Long. Reaches the sternum; can be doubled.';
    $('#r-fit').textContent = fit;
    $('#r-code').textContent = code();
    list();
    save();
  }

  function list() {
    const ul = $('#seglist');
    ul.innerHTML = '';
    segs.forEach((s, i) => {
      const c = C.CATALOG[s.t];
      const li = document.createElement('li');
      li.className = 'seg';
      let ctl = '';
      if (c.kind === 'chain') ctl += `<button type="button" data-a="minus" aria-label="Shorten ${c.label}">−</button><span class="cm num">${s.cm} cm</span><button type="button" data-a="plus" aria-label="Lengthen ${c.label}">+</button>`;
      if (c.variants) ctl += `<label class="sr" for="v-${i}">Contents</label><select id="v-${i}" data-a="variant">${Object.entries(c.variants).map(([k, v]) => `<option value="${k}"${s.v === k ? ' selected' : ''}>${v}</option>`).join('')}</select>`;
      ctl += `<button type="button" data-a="up" aria-label="Move up"${i === 0 ? ' disabled' : ''}>↑</button><button type="button" data-a="down" aria-label="Move down"${i === segs.length - 1 ? ' disabled' : ''}>↓</button><button type="button" data-a="del" aria-label="Remove ${c.label}">×</button>`;
      const cost = c.kind === 'chain' ? '$' + c.perCm + '/cm' : '$' + c.price;
      li.innerHTML = `<span class="n num">${String(i + 1).padStart(2, '0')}</span><span class="name">${c.label} <span class="muted mono">· ${cost}</span><small>${c.note}</small></span><span class="ctl">${ctl}</span>`;
      li.addEventListener('click', e => {
        const a = e.target.dataset.a;
        if (!a || a === 'variant') return;
        if (a === 'minus') s.cm = Math.max(2, s.cm - 2);
        if (a === 'plus') s.cm = Math.min(40, s.cm + 2);
        if (a === 'up' && i > 0) [segs[i - 1], segs[i]] = [segs[i], segs[i - 1]];
        if (a === 'down' && i < segs.length - 1) [segs[i + 1], segs[i]] = [segs[i], segs[i + 1]];
        if (a === 'del') segs.splice(i, 1);
        draw();
      });
      const sel = li.querySelector('select');
      if (sel) sel.addEventListener('change', () => { s.v = sel.value; draw(); });
      ul.appendChild(li);
    });
    if (!segs.length) ul.innerHTML = '<li class="seg"><span></span><span class="name muted">Empty. Add a length of chain to begin.</span><span></span></li>';
  }

  root.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
    const t = b.dataset.add, c = C.CATALOG[t];
    const arts = segs.filter(s => C.CATALOG[s.t].kind === 'artifact').length;
    const msg = $('#add-msg');
    if (c.kind === 'artifact' && arts >= 6) { msg.textContent = 'Six artifacts is the limit of one chain. Remove one to add another.'; return; }
    msg.textContent = '';
    segs.push(c.kind === 'chain' ? { t, cm: 8 } : c.variants ? { t, v: 'hair' } : { t });
    draw();
  }));
  const reset = root.querySelector('[data-reset]');
  if (reset) reset.addEventListener('click', () => { segs = DEFAULT.map(s => ({ ...s })); draw(); });

  window.CinerisAtelier = {
    summary: () => `${code()} | ${C.length(segs).toFixed(1)} cm | ${money(C.price(segs))} | ` + segs.map(s => C.CATALOG[s.t].label + (s.cm ? ' ' + s.cm + 'cm' : '') + (s.v ? ' (' + C.CATALOG[s.t].variants[s.v] + ')' : '')).join(' → ')
  };
  draw();
})();
