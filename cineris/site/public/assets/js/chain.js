/* ORDO CINERIS — chain engine.
   Draws an oxidized-silver chain as SVG from a list of segments.
   All geometry is in centimetres; the SVG viewBox does the scaling.
   Used by the hero (straight drop) and the atelier configurator (laid loop). */
(function (global) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* ---------- catalogue: what can go into a chain ---------- */
  const CATALOG = {
    cable:     { label: 'Heavy cable',        kind: 'chain',    perCm: 22, pitch: 1.25, note: 'Hand-forged oval links, 4.2 mm wire.' },
    bali:      { label: 'Balinese embossed',  kind: 'chain',    perCm: 34, pitch: 1.35, note: 'Granulated, hand-stamped links in the Celuk tradition.' },
    byzantine: { label: 'Byzantine weave',    kind: 'chain',    perCm: 46, pitch: 0.85, note: 'Dense woven section. Heaviest per centimetre.' },
    paperclip: { label: 'Long link',          kind: 'chain',    perCm: 24, pitch: 2.1,  note: 'Elongated forged links. Quiet, architectural.' },
    cameo:     { label: 'Micro cameo',        kind: 'artifact', price: 690, len: 2.6, note: 'Hand-carved shell cameo, 14 mm, set in a granulated bezel.' },
    ruby:      { label: 'Ruby in bezel',      kind: 'artifact', price: 860, len: 1.7, note: 'Natural ruby, ~0.4 ct, closed silver bezel.' },
    goldring:  { label: '18k gold ring',      kind: 'artifact', price: 480, len: 1.7, note: 'One solid 18k yellow-gold link. The only warm metal in the chain.' },
    reliquary: { label: 'Reliquary link',     kind: 'artifact', price: 890, len: 3.0, note: 'Sealed glass capsule for a lock of hair, a tear on silk, a line of a letter, or earth.',
                 variants: { hair: 'Lock of hair', tear: 'A tear on silk', letter: 'A line of a letter', earth: 'Earth from a place' } },
    ash:       { label: 'Ash link',           kind: 'artifact', price: 0,   len: 2.2, restricted: true, note: 'Only in numbered Burning editions.' },
    hallmark:  { label: 'Hallmark tag',       kind: 'fixed',    len: 1.3 },
    passport:  { label: 'Passport plate',     kind: 'fixed',    len: 2.0 },
    clasp:     { label: 'Box clasp',          kind: 'fixed',    len: 2.8 }
  };
  const BINDING = 420; // clasp, hallmark, passport plate, vault cell, hand assembly

  /* ---------- pricing & length ---------- */
  function price(segments) {
    let p = BINDING;
    for (const s of segments) {
      const c = CATALOG[s.t];
      if (!c) continue;
      p += c.kind === 'chain' ? Math.round(c.perCm * (s.cm || 0)) : (c.price || 0);
    }
    return p;
  }
  function expand(segments, withFixed) {
    const items = [];
    if (withFixed) items.push({ t: 'clasp', len: CATALOG.clasp.len });
    for (const s of segments) {
      const c = CATALOG[s.t];
      if (!c) continue;
      if (c.kind === 'chain') {
        const n = Math.max(1, Math.round((s.cm || 0) / c.pitch));
        for (let i = 0; i < n; i++) items.push({ t: s.t, len: c.pitch, alt: i % 2 });
      } else {
        items.push({ t: s.t, len: c.len, v: s.v });
      }
    }
    if (withFixed) {
      items.push({ t: 'hallmark', len: CATALOG.hallmark.len });
      items.push({ t: 'passport', len: CATALOG.passport.len });
    }
    return items;
  }
  function length(segments) {
    return expand(segments, true).reduce((a, i) => a + i.len, 0);
  }

  /* ---------- paths the chain is laid along ---------- */
  function sampler(fn, L) {
    // fn(t) -> {x,y}, t in [0,1]; returns lookup by arc length, scaled to total length L
    const N = 600, pts = [];
    let s = 0, prev = fn(0);
    pts.push({ x: prev.x, y: prev.y, s: 0 });
    for (let i = 1; i <= N; i++) {
      const p = fn(i / N);
      s += Math.hypot(p.x - prev.x, p.y - prev.y);
      pts.push({ x: p.x, y: p.y, s });
      prev = p;
    }
    const k = L / s;
    pts.forEach(p => { p.x *= k; p.y *= k; p.s *= k; });
    return function at(d) {
      d = Math.max(0, Math.min(L, d));
      let lo = 0, hi = pts.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m].s < d) lo = m; else hi = m; }
      const a = pts[lo], b = pts[hi], f = (d - a.s) / ((b.s - a.s) || 1);
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, ang: Math.atan2(b.y - a.y, b.x - a.x) };
    };
  }
  const SHAPES = {
    line: t => ({ x: 0, y: t }),
    // a necklace laid flat: pear-shaped loop, clasp at the top
    loop: t => {
      const th = t * Math.PI * 2;
      return { x: Math.sin(th) * (1 - 0.32 * Math.cos(th)), y: -1.15 * Math.cos(th) };
    }
  };

  /* ---------- defs: metals, stones ---------- */
  function defs(svg, p) {
    const d = el('defs', {}, svg);
    const lin = (id, stops, x2, y2) => {
      const g = el('linearGradient', { id: p + id, x1: 0, y1: 0, x2: x2 ?? 1, y2: y2 ?? 0 }, d);
      stops.forEach(([o, c, op]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op ?? 1 }, g));
    };
    lin('ag',  [[0, '#18181a'], [0.2, '#4a4845'], [0.44, '#b9b4ab'], [0.54, '#e4dfd5'], [0.68, '#67635d'], [1, '#141416']]);
    lin('agS', [[0, '#0f0f10'], [0.35, '#5a5752'], [0.5, '#a9a49b'], [0.65, '#45433f'], [1, '#0d0d0e']]);
    lin('agV', [[0, '#d8d3c9'], [0.5, '#6d6a64'], [1, '#1a1a1b']], 0, 1);
    lin('au',  [[0, '#3e2a0b'], [0.3, '#9c7230'], [0.5, '#f0d18a'], [0.7, '#9a6b24'], [1, '#2e1f08']]);
    const r = el('radialGradient', { id: p + 'ruby', cx: 0.38, cy: 0.35, r: 0.75 }, d);
    [[0, '#ff6b7c'], [0.25, '#c8102e'], [0.7, '#6a0515'], [1, '#2a0107']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, r));
    const cb = el('radialGradient', { id: p + 'cameo', cx: 0.5, cy: 0.42, r: 0.7 }, d);
    [[0, '#8a3a26'], [0.7, '#5a1f12'], [1, '#2e0e07']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, cb));
    const ash = el('radialGradient', { id: p + 'ash', cx: 0.5, cy: 0.5, r: 0.6 }, d);
    [[0, '#3a2a24'], [0.6, '#151112'], [1, '#050505']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, ash));
    const glow = el('filter', { id: p + 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, d);
    el('feGaussianBlur', { stdDeviation: 0.18, result: 'b' }, glow);
    const m = el('feMerge', {}, glow);
    el('feMergeNode', { in: 'b' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);
  }

  /* ---------- link drawings (local coords, axis = +y, centred) ---------- */
  const PROFILE = 'M-1,-10C-5,-10-5,-6-5,-5L-6.5,-2.5L-5,-2C-5.5,-1-5,-0.5-4.6,0C-5,0.6-5,1.2-4.4,1.6C-4.5,3-3.5,3.5-2,3.5L-1.5,6C0,7,3,7,5,6C4,4,4.5,1,6,-1C8,-3,8,-9,3,-10.5C2,-11,0,-11-1,-10Z';

  function jump(g, p, y) { el('rect', { x: -0.09, y: y - 0.26, width: 0.18, height: 0.52, rx: 0.09, fill: `url(#${p}agS)` }, g); }

  const DRAW = {
    cable(g, p, it) {
      if (!it.alt) {
        el('ellipse', { rx: 0.5, ry: 0.84, fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.27 }, g);
        el('ellipse', { rx: 0.42, ry: 0.76, fill: 'none', stroke: '#f4efe6', 'stroke-opacity': 0.16, 'stroke-width': 0.03 }, g);
      } else {
        el('rect', { x: -0.15, y: -0.9, width: 0.3, height: 1.8, rx: 0.15, fill: `url(#${p}agS)` }, g);
      }
    },
    bali(g, p, it) {
      if (!it.alt) {
        el('ellipse', { rx: 0.55, ry: 0.82, fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.32 }, g);
        for (let i = 0; i < 14; i++) {
          const a = (i / 14) * Math.PI * 2;
          el('circle', { cx: Math.cos(a) * 0.55, cy: Math.sin(a) * 0.82, r: 0.075, fill: i % 2 ? '#cfc9be' : '#2a2826', 'fill-opacity': i % 2 ? 0.75 : 0.9 }, g);
        }
      } else {
        el('rect', { x: -0.17, y: -0.92, width: 0.34, height: 1.84, rx: 0.17, fill: `url(#${p}agS)` }, g);
        for (let k = -2; k <= 2; k++) el('line', { x1: -0.15, x2: 0.15, y1: k * 0.3, y2: k * 0.3 + 0.06, stroke: '#0c0c0c', 'stroke-width': 0.035, 'stroke-opacity': 0.8 }, g);
      }
    },
    byzantine(g, p) {
      el('ellipse', { rx: 0.44, ry: 0.27, transform: 'rotate(38)', fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.15 }, g);
      el('ellipse', { rx: 0.44, ry: 0.27, transform: 'rotate(-38)', fill: 'none', stroke: `url(#${p}agS)`, 'stroke-width': 0.15 }, g);
      el('rect', { x: -0.42, y: -0.36, width: 0.13, height: 0.72, rx: 0.06, fill: `url(#${p}agS)` }, g);
      el('rect', { x: 0.29, y: -0.36, width: 0.13, height: 0.72, rx: 0.06, fill: `url(#${p}agS)` }, g);
    },
    paperclip(g, p, it) {
      if (!it.alt) el('rect', { x: -0.45, y: -1.32, width: 0.9, height: 2.64, rx: 0.45, fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.22 }, g);
      else el('rect', { x: -0.11, y: -1.32, width: 0.22, height: 2.64, rx: 0.11, fill: `url(#${p}agS)` }, g);
    },
    cameo(g, p) {
      jump(g, p, -1.15); jump(g, p, 1.15);
      el('ellipse', { rx: 0.86, ry: 1.06, fill: `url(#${p}ag)` }, g);
      for (let i = 0; i < 22; i++) {
        const a = (i / 22) * Math.PI * 2;
        el('circle', { cx: Math.cos(a) * 0.8, cy: Math.sin(a) * 0.99, r: 0.05, fill: '#d9d3c8', 'fill-opacity': 0.55 }, g);
      }
      el('ellipse', { rx: 0.68, ry: 0.88, fill: `url(#${p}cameo)` }, g);
      el('path', { d: PROFILE, transform: 'scale(0.068)', fill: '#ece2d2', 'fill-opacity': 0.94 }, g);
    },
    ruby(g, p) {
      jump(g, p, -0.72); jump(g, p, 0.72);
      el('circle', { r: 0.56, fill: `url(#${p}ag)` }, g);
      const oct = [];
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; oct.push((Math.cos(a) * 0.42).toFixed(3) + ',' + (Math.sin(a) * 0.42).toFixed(3)); }
      el('polygon', { points: oct.join(' '), fill: `url(#${p}ruby)` }, g);
      const tbl = [];
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; tbl.push((Math.cos(a) * 0.2).toFixed(3) + ',' + (Math.sin(a) * 0.2).toFixed(3)); }
      el('polygon', { points: tbl.join(' '), fill: 'none', stroke: '#ffb3bd', 'stroke-opacity': 0.35, 'stroke-width': 0.025 }, g);
      el('circle', { cx: -0.13, cy: -0.14, r: 0.06, fill: '#fff', 'fill-opacity': 0.75 }, g);
    },
    goldring(g, p) {
      el('ellipse', { rx: 0.52, ry: 0.64, fill: 'none', stroke: `url(#${p}au)`, 'stroke-width': 0.26 }, g);
      el('ellipse', { rx: 0.44, ry: 0.56, fill: 'none', stroke: '#fff3cf', 'stroke-opacity': 0.3, 'stroke-width': 0.03 }, g);
    },
    reliquary(g, p, it) {
      jump(g, p, -1.4);
      el('rect', { x: -0.33, y: -1.2, width: 0.66, height: 0.34, rx: 0.08, fill: `url(#${p}ag)` }, g);
      el('rect', { x: -0.33, y: 0.86, width: 0.66, height: 0.34, rx: 0.08, fill: `url(#${p}ag)` }, g);
      el('rect', { x: -0.27, y: -0.88, width: 0.54, height: 1.76, rx: 0.1, fill: '#c9d3dc', 'fill-opacity': 0.08, stroke: '#dfe5ea', 'stroke-opacity': 0.5, 'stroke-width': 0.035 }, g);
      const v = it.v || 'hair';
      if (v === 'hair') {
        el('path', { d: 'M-0.08,-0.75C0.15,-0.4-0.2,-0.1,0.06,0.2S-0.1,0.6,0.05,0.78', fill: 'none', stroke: '#5b3a22', 'stroke-width': 0.035 }, g);
        el('path', { d: 'M0.04,-0.75C0.2,-0.35-0.12,0,0.12,0.3S-0.02,0.62,0.1,0.78', fill: 'none', stroke: '#3a2416', 'stroke-width': 0.025 }, g);
      } else if (v === 'tear') {
        el('line', { x1: 0, x2: 0, y1: -0.85, y2: 0.85, stroke: '#e8dfcf', 'stroke-opacity': 0.5, 'stroke-width': 0.02 }, g);
        el('path', { d: 'M0,-0.25C0.16,0.02,0.2,0.18,0.2,0.28A0.2,0.2,0,0,1-0.2,0.28C-0.2,0.18-0.16,0.02,0,-0.25Z', fill: '#bcd2e4', 'fill-opacity': 0.55 }, g);
      } else if (v === 'letter') {
        el('rect', { x: -0.12, y: -0.6, width: 0.24, height: 1.2, rx: 0.1, fill: '#d6c8ad' }, g);
        for (let k = -4; k <= 4; k++) el('line', { x1: -0.08, x2: 0.08, y1: k * 0.12, y2: k * 0.12, stroke: '#5a4a35', 'stroke-width': 0.012 }, g);
      } else {
        for (let k = 0; k < 26; k++) el('circle', { cx: (Math.sin(k * 7.3) * 0.18).toFixed(3), cy: (0.2 + ((k * 37) % 60) / 100).toFixed(3), r: 0.045, fill: k % 3 ? '#5a4632' : '#2e241b' }, g);
      }
      jump(g, p, 1.4);
    },
    ash(g, p, it) {
      jump(g, p, -0.95); jump(g, p, 0.95);
      el('rect', { x: -0.42, y: -0.8, width: 0.84, height: 1.6, rx: 0.42, fill: `url(#${p}ag)` }, g);
      el('rect', { x: -0.3, y: -0.66, width: 0.6, height: 1.32, rx: 0.3, fill: `url(#${p}ash)`, filter: `url(#${p}glow)` }, g);
      for (let k = 0; k < 18; k++) el('circle', { cx: (Math.sin(k * 3.1) * 0.18).toFixed(3), cy: (Math.cos(k * 1.7) * 0.5).toFixed(3), r: 0.022, fill: k % 4 ? '#8a8078' : '#c44b2a', 'fill-opacity': 0.8 }, g);
      el('text', { y: 0.09, 'text-anchor': 'middle', 'font-size': 0.28, 'font-family': 'Bodoni Moda, Didot, serif', fill: '#e8e0d2', 'fill-opacity': 0.85 }, g).textContent = it.numeral || 'I';
    },
    hallmark(g, p) {
      jump(g, p, -0.55);
      el('ellipse', { cy: 0.12, rx: 0.34, ry: 0.44, fill: `url(#${p}ag)` }, g);
      el('text', { y: 0.2, 'text-anchor': 'middle', 'font-size': 0.2, 'font-family': 'IBM Plex Mono, monospace', fill: '#151515', 'letter-spacing': 0.01 }, g).textContent = '925';
    },
    passport(g, p, it) {
      jump(g, p, -0.95); jump(g, p, 0.95);
      el('rect', { x: -0.3, y: -0.78, width: 0.6, height: 1.56, rx: 0.06, fill: `url(#${p}ag)` }, g);
      el('rect', { x: -0.24, y: -0.72, width: 0.48, height: 1.44, rx: 0.04, fill: 'none', stroke: '#111', 'stroke-opacity': 0.55, 'stroke-width': 0.02 }, g);
      el('text', { transform: 'rotate(90)', y: 0.06, 'text-anchor': 'middle', 'font-size': 0.15, 'font-family': 'IBM Plex Mono, monospace', fill: '#121212' }, g).textContent = it.code || 'OC·I·07·K4M9';
    },
    clasp(g, p) {
      el('rect', { x: -0.55, y: -0.95, width: 1.1, height: 1.7, rx: 0.12, fill: `url(#${p}ag)` }, g);
      el('rect', { x: -0.45, y: -0.85, width: 0.9, height: 1.5, rx: 0.08, fill: 'none', stroke: '#0e0e0e', 'stroke-opacity': 0.6, 'stroke-width': 0.03 }, g);
      for (let k = -3; k <= 3; k++) el('line', { x1: -0.38, x2: 0.38, y1: k * 0.18 - 0.1, y2: k * 0.18 + 0.1, stroke: '#0e0e0e', 'stroke-opacity': 0.28, 'stroke-width': 0.02 }, g);
      el('text', { y: 0.02, 'text-anchor': 'middle', 'font-size': 0.36, 'font-family': 'Bodoni Moda, Didot, serif', 'font-style': 'italic', fill: '#141414' }, g).textContent = 'OC';
      el('rect', { x: -0.22, y: 0.75, width: 0.44, height: 0.3, rx: 0.05, fill: `url(#${p}agS)` }, g);
      jump(g, p, 1.22);
    }
  };

  /* ---------- render ---------- */
  function render(svg, segments, opts) {
    opts = opts || {};
    const shape = opts.shape || 'line';
    const p = 'oc' + (++uid) + '-';
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    defs(svg, p);
    const items = expand(segments, opts.fixed !== false);
    const L = items.reduce((a, i) => a + i.len, 0);
    const at = sampler(SHAPES[shape], L);
    const root = el('g', {}, svg);
    let s = 0, minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    items.forEach((it, idx) => {
      const c = at(s + it.len / 2);
      s += it.len;
      const deg = (c.ang * 180) / Math.PI - 90;
      const g = el('g', { transform: `translate(${c.x.toFixed(3)} ${c.y.toFixed(3)}) rotate(${deg.toFixed(2)})`, class: 'oc-link oc-' + it.t, 'data-i': idx }, root);
      it.code = opts.code; it.numeral = opts.numeral;
      (DRAW[it.t] || DRAW.cable)(g, p, it);
      minX = Math.min(minX, c.x); maxX = Math.max(maxX, c.x); minY = Math.min(minY, c.y); maxY = Math.max(maxY, c.y);
    });
    const m = 1.6;
    const vb = [minX - m, minY - m, maxX - minX + 2 * m, maxY - minY + 2 * m];
    svg.setAttribute('viewBox', vb.map(n => n.toFixed(2)).join(' '));
    svg.setAttribute('role', 'img');
    return { length: L, items: items.length, viewBox: vb };
  }

  global.CinerisChain = { CATALOG, BINDING, render, price, length, expand };
})(window);
