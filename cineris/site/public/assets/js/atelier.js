/* ORDO CINERIS — the atelier configurator.
   House grammar: Silence → the Break (Ash Link) → Weight → Silence → one object.
   Rules: exactly one Ash Link, at most two brutal sections, at most two objects (three from 65 cm). */
(function () {
  'use strict';
  const C = window.CinerisChain;
  const root = document.getElementById('atelier');
  if (!root || !C) return;
  const $ = s => root.querySelector(s);
  const KEY = 'oc-atelier-v3';
  const DEFAULT = [
    { t: 'cable', cm: 14 }, { t: 'ashlink' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 10 }, { t: 'ruby' }, { t: 'cable', cm: 12 }
  ];
  const SHORT = { cable: 'F', paperclip: 'L', forged: 'W', bali: 'B', byzantine: 'Z', ashlink: 'ASH', cameo: 'CAM', ruby: 'RBY', diamond: 'DIA', goldring: 'AU', pearl: 'PRL', crystal: 'XTL', reliquary: 'REL', relic: 'RLC', drop: 'GRN' };
  const clone = a => a.map(s => ({ ...s }));
  let segs;
  try { segs = JSON.parse(localStorage.getItem(KEY)) || clone(DEFAULT); } catch (e) { segs = clone(DEFAULT); }
  segs = segs.filter(s => C.CATALOG[s.t] && !C.CATALOG[s.t].restricted);
  if (!segs.some(s => s.t === 'ashlink')) segs.splice(1, 0, { t: 'ashlink' });
  const money = n => '$' + n.toLocaleString('en-US');
  const count = (w) => segs.filter(s => { const c = C.CATALOG[s.t]; return w === 'artifact' ? c.kind === 'artifact' : c.weight === w; }).length;
  const say = m => { $('#add-msg').textContent = m; };

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
    const art = count('artifact');
    $('#r-days').textContent = (9 + art * 2) + '–' + (14 + art * 3) + ' days';
    const fit = len < 46 ? 'Collar. Sits at the base of the neck; layers under a longer chain.' : len < 53 ? 'Classic. On the collarbone, at an open shirt or a T-shirt.' : len < 63 ? 'Over the knit or the lapel. Falls onto a sweater or inside a blazer.' : 'Long. To the sternum; wear it alone or doubled.';
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
      const sig = c.kind === 'signature';
      const li = document.createElement('li');
      li.className = 'seg' + (sig ? ' sig' : '') + (c.weight === 'brutal' ? ' brutal' : '');
      let ctl = '';
      if (c.kind === 'chain') ctl += `<button type="button" data-a="minus" aria-label="Shorten ${c.label}">−</button><span class="cm num">${s.cm} cm</span><button type="button" data-a="plus" aria-label="Lengthen ${c.label}">+</button>`;
      if (c.variants) ctl += `<label class="sr" for="v-${i}">Contents</label><select id="v-${i}" data-a="variant">${Object.entries(c.variants).map(([k, v]) => `<option value="${k}"${s.v === k ? ' selected' : ''}>${v}</option>`).join('')}</select>`;
      ctl += `<button type="button" data-a="up" aria-label="Move up"${i === 0 ? ' disabled' : ''}>↑</button><button type="button" data-a="down" aria-label="Move down"${i === segs.length - 1 ? ' disabled' : ''}>↓</button>`;
      if (!sig) ctl += `<button type="button" data-a="del" aria-label="Remove ${c.label}">×</button>`;
      const tag = sig ? 'signature · included' : c.kind === 'chain' ? (c.weight === 'brutal' ? 'weight' : 'silence') + ' · $' + c.perCm + '/cm' : 'object · $' + c.price;
      li.innerHTML = `<span class="n num">${String(i + 1).padStart(2, '0')}</span><span class="name">${c.label} <span class="muted mono">· ${tag}</span><small>${c.note}</small></span><span class="ctl">${ctl}</span>`;
      li.addEventListener('click', e => {
        const a = e.target.dataset.a;
        if (!a || a === 'variant') return;
        if (a === 'minus') s.cm = Math.max(2, s.cm - 2);
        if (a === 'plus') s.cm = Math.min(c.weight === 'brutal' ? 20 : 40, s.cm + 2);
        if (a === 'up' && i > 0) [segs[i - 1], segs[i]] = [segs[i], segs[i - 1]];
        if (a === 'down' && i < segs.length - 1) [segs[i + 1], segs[i]] = [segs[i], segs[i + 1]];
        if (a === 'del') segs.splice(i, 1);
        say('');
        draw();
      });
      const sel = li.querySelector('select');
      if (sel) sel.addEventListener('change', () => { s.v = sel.value; draw(); });
      ul.appendChild(li);
    });
  }

  root.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
    const t = b.dataset.add, c = C.CATALOG[t];
    const maxArt = C.length(segs) >= 65 ? 3 : 2;
    if (c.kind === 'artifact' && count('artifact') >= maxArt) { say(`House rule: ${maxArt === 2 ? 'two objects' : 'three objects'} at most. One object is a statement; four is a charm bracelet. Remove one to add another.`); return; }
    if (c.weight === 'brutal' && count('brutal') >= 2) { say('House rule: weight appears at most twice. The power of the chain is in the silence around it.'); return; }
    say('');
    segs.push(c.kind === 'chain' ? { t, cm: c.weight === 'brutal' ? 6 : 8 } : c.variants ? { t, v: 'hair' } : { t });
    draw();
  }));
  const reset = root.querySelector('[data-reset]');
  if (reset) reset.addEventListener('click', () => { segs = clone(DEFAULT); say(''); draw(); });

  window.CinerisAtelier = {
    summary: () => `${code()} | ${C.length(segs).toFixed(1)} cm | ${money(C.price(segs))} | ` + segs.map(s => C.CATALOG[s.t].label + (s.cm ? ' ' + s.cm + 'cm' : '') + (s.v ? ' (' + C.CATALOG[s.t].variants[s.v] + ')' : '')).join(' → ')
  };
  draw();
})();
