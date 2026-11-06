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
    // QUIET — the silence between events
    cable:     { label: 'Fine cable',          kind: 'chain', weight: 'quiet',  perCm: 18, pitch: 0.62, note: 'Fine 2.4 mm cable. Quiet enough to sit under a diamond tennis chain.' },
    paperclip: { label: 'Long fine link',      kind: 'chain', weight: 'quiet',  perCm: 20, pitch: 1.5,  note: 'Elongated fine links. Architectural, almost invisible.' },
    // BRUTAL — the weight
    forged:    { label: 'Forged link',         kind: 'chain', weight: 'brutal', perCm: 70, pitch: 2.0,  note: 'Hand-forged 11 mm ovals, hammered flat on the anvil. The weight.' },
    bali:      { label: 'Balinese granulated', kind: 'chain', weight: 'brutal', perCm: 60, pitch: 1.75, note: 'Massive granulated links stamped by hand in the Celuk tradition.' },
    byzantine: { label: 'Byzantine column',    kind: 'chain', weight: 'brutal', perCm: 60, pitch: 1.2,  note: 'A dense woven column. Falls dead straight.' },
    // THE SIGNATURE
    ashlink:   { label: 'The Ash Link',        kind: 'signature', price: 0, len: 3.0, note: 'The house signature: matte black oval, silver rim, one 18k gold rivet. Exactly one per chain, at the Break.' },
    // OBJECTS — one, two at most
    cameo:     { label: 'Micro cameo',         kind: 'artifact', price: 420, len: 2.6, note: 'Hand-carved shell cameo, 14 mm, in a plain bezel.' },
    ruby:      { label: 'Ruby in bezel',       kind: 'artifact', price: 600, len: 1.7, note: 'Natural ruby, ~0.4 ct, closed silver bezel. The only red thing on you.' },
    diamond:   { label: 'Old-cut diamond',     kind: 'artifact', price: 980, len: 1.7, note: 'An antique old-mine diamond, ~0.3 ct, set in blackened silver.' },
    goldring:  { label: '18k gold ring',       kind: 'artifact', price: 290, len: 1.7, note: 'One solid 18k link. The warm point.' },
    pearl:     { label: 'Baroque pearl',       kind: 'artifact', price: 320, len: 1.8, note: 'An irregular freshwater pearl in a gold-rimmed cup.' },
    crystal:   { label: 'Rock crystal',        kind: 'artifact', price: 420, len: 2.8, note: 'A rough quartz point held in eight silver claws.' },
    reliquary: { label: 'Reliquary capsule',   kind: 'artifact', price: 560, len: 3.0, note: 'Sealed glass for a lock of hair, a tear on silk, a line of a letter, or earth.',
                 variants: { hair: 'Lock of hair', tear: 'A tear on silk', letter: 'A line of a letter', earth: 'Earth from a place' } },
    tear:      { label: 'Tear',                kind: 'artifact', price: 450, len: 2.5, note: 'A tear dropped on paper changes its colour. We seal that paper in clear resin, in silver, forever.' },
    voice:     { label: 'Voice',               kind: 'artifact', price: 520, len: 2.7, note: 'Ten seconds of a voice, engraved as its waveform. Tap a phone to the link to hear it.' },
    relic:     { label: 'Found relic',         kind: 'artifact', price: 420, len: 3.2, note: 'Cast in silver from an object you bring: a key, a stone, a shell.' },
    drop:      { label: 'Garnet drop',         kind: 'artifact', price: 280, len: 1.6, note: 'A garnet briolette that hangs to one side.' },
    // FIXED / RESTRICTED
    ash:       { label: 'Burning ash link',    kind: 'signature', price: 0, len: 2.6, restricted: true, note: 'Numbered Burning editions only: the Ash Link holds real ash.' },
    hallmark:  { label: 'Hallmark tag',        kind: 'fixed', len: 1.3 },
    passport:  { label: 'Passport plate',      kind: 'fixed', len: 2.0 },
    clasp:     { label: 'Toggle clasp',        kind: 'fixed', len: 2.8 }
  };
  const BINDING = 480; // clasp, hallmark, passport, Ash Link, Vault cell, assembly // clasp, hallmark, passport plate, vault cell, hand assembly

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
    const bk = el('radialGradient', { id: p + 'black', cx: 0.4, cy: 0.35, r: 0.8 }, d);
    [[0, '#2a2726'], [0.6, '#0e0d0d'], [1, '#050505']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, bk));
    const di = el('radialGradient', { id: p + 'dia', cx: 0.35, cy: 0.3, r: 0.8 }, d);
    [[0, '#ffffff'], [0.4, '#dfe6ec'], [0.75, '#8d969e'], [1, '#3b4045']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, di));
    const st = el('radialGradient', { id: p + 'stain', cx: 0.5, cy: 0.5, r: 0.6 }, d);
    [[0, '#8c7fb0', 0.15], [0.7, '#6b5fa0', 0.55], [1, '#3e3470', 0.85]].forEach(([o, c, op]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op }, st));
    const pr = el('radialGradient', { id: p + 'pearl', cx: 0.4, cy: 0.35, r: 0.8 }, d);
    [[0, '#ffffff'], [0.45, '#e9e4dc'], [0.8, '#a9a39a'], [1, '#6d6862']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, pr));
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
    cable(g0, p, it) {
      const g = el('g', { transform: 'scale(0.5)' }, g0);
      if (!it.alt) {
        el('ellipse', { rx: 0.5, ry: 0.84, fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.27 }, g);
        el('ellipse', { rx: 0.42, ry: 0.76, fill: 'none', stroke: '#f4efe6', 'stroke-opacity': 0.16, 'stroke-width': 0.03 }, g);
      } else {
        el('rect', { x: -0.15, y: -0.9, width: 0.3, height: 1.8, rx: 0.15, fill: `url(#${p}agS)` }, g);
      }
    },
    bali(g0, p, it) {
      const g = el('g', { transform: 'scale(1.3)' }, g0);
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
    byzantine(g0, p) {
      const g = el('g', { transform: 'scale(1.45)' }, g0);
      el('ellipse', { rx: 0.44, ry: 0.27, transform: 'rotate(38)', fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.15 }, g);
      el('ellipse', { rx: 0.44, ry: 0.27, transform: 'rotate(-38)', fill: 'none', stroke: `url(#${p}agS)`, 'stroke-width': 0.15 }, g);
      el('rect', { x: -0.42, y: -0.36, width: 0.13, height: 0.72, rx: 0.06, fill: `url(#${p}agS)` }, g);
      el('rect', { x: 0.29, y: -0.36, width: 0.13, height: 0.72, rx: 0.06, fill: `url(#${p}agS)` }, g);
    },
    paperclip(g, p, it) {
      if (!it.alt) el('rect', { x: -0.22, y: -0.95, width: 0.44, height: 1.9, rx: 0.22, fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.09 }, g);
      else el('rect', { x: -0.05, y: -0.95, width: 0.1, height: 1.9, rx: 0.05, fill: `url(#${p}agS)` }, g);
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
    forged(g, p, it) {
      if (!it.alt) {
        el('ellipse', { rx: 0.82, ry: 1.3, fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.52 }, g);
        for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2 + 0.3; el('ellipse', { cx: Math.cos(a) * 0.82, cy: Math.sin(a) * 1.3, rx: 0.13, ry: 0.07, transform: `rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 0.82} ${Math.sin(a) * 1.3})`, fill: k % 2 ? '#efe9de' : '#0d0d0d', 'fill-opacity': k % 2 ? 0.22 : 0.45 }, g); }
      } else {
        el('rect', { x: -0.27, y: -1.42, width: 0.54, height: 2.84, rx: 0.27, fill: `url(#${p}agS)` }, g);
        el('rect', { x: -0.06, y: -1.2, width: 0.12, height: 2.4, rx: 0.06, fill: '#f1ece2', 'fill-opacity': 0.18 }, g);
      }
    },
    ashlink(g0, p, it) {
      const g = el('g', { transform: 'scale(1.3)' }, g0);
      el('ellipse', { rx: 0.86, ry: 1.18, fill: `url(#${p}agS)` }, g);
      el('ellipse', { rx: 0.72, ry: 1.04, fill: `url(#${p}black)` }, g);
      el('ellipse', { rx: 0.3, ry: 0.5, fill: '#0a0909' }, g);
      el('circle', { r: 0.15, fill: `url(#${p}au)` }, g);
      el('circle', { cx: -0.04, cy: -0.04, r: 0.05, fill: '#fff6d8', 'fill-opacity': 0.7 }, g);
    },
    diamond(g, p) {
      jump(g, p, -0.72); jump(g, p, 0.72);
      el('circle', { r: 0.5, fill: '#151414', stroke: `url(#${p}agS)`, 'stroke-width': 0.08 }, g);
      const pts = []; for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; pts.push((Math.cos(a) * 0.36).toFixed(3) + ',' + (Math.sin(a) * 0.36).toFixed(3)); }
      el('polygon', { points: pts.join(' '), fill: `url(#${p}dia)` }, g);
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; el('line', { x1: 0, y1: 0, x2: (Math.cos(a) * 0.36).toFixed(3), y2: (Math.sin(a) * 0.36).toFixed(3), stroke: '#ffffff', 'stroke-opacity': 0.35, 'stroke-width': 0.015 }, g); }
      el('circle', { cx: -0.1, cy: -0.12, r: 0.05, fill: '#fff' }, g);
    },
    tear(g, p) {
      jump(g, p, -1.12); jump(g, p, 1.12);
      el('ellipse', { rx: 0.62, ry: 0.86, fill: `url(#${p}ag)` }, g);
      el('ellipse', { rx: 0.5, ry: 0.74, fill: '#e9e3d6' }, g);
      el('path', { d: 'M-0.05,-0.42C0.22,-0.38,0.34,-0.1,0.26,0.16C0.2,0.4,-0.08,0.5,-0.24,0.32C-0.4,0.12,-0.3,-0.2,-0.05,-0.42Z', fill: `url(#${p}stain)` }, g);
      el('ellipse', { rx: 0.5, ry: 0.74, fill: '#ffffff', 'fill-opacity': 0.08 }, g);
      el('ellipse', { cx: -0.18, cy: -0.42, rx: 0.14, ry: 0.07, fill: '#fff', 'fill-opacity': 0.55, transform: 'rotate(-30 -0.18 -0.42)' }, g);
    },
    voice(g, p) {
      jump(g, p, -1.18); jump(g, p, 1.18);
      el('rect', { x: -0.42, y: -0.95, width: 0.84, height: 1.9, rx: 0.42, fill: `url(#${p}ag)` }, g);
      const h = [0.1, 0.25, 0.42, 0.3, 0.55, 0.38, 0.2, 0.48, 0.3, 0.15, 0.36, 0.22, 0.1];
      h.forEach((v, i) => el('rect', { x: -v / 2 * 0.9, y: -0.66 + i * 0.1, width: v * 0.9, height: 0.045, rx: 0.02, fill: '#0e0e0e', 'fill-opacity': 0.75 }, g));
      el('circle', { cy: 0.72, r: 0.07, fill: `url(#${p}au)` }, g);
    },
    ash(g, p, it) {
      jump(g, p, -0.95); jump(g, p, 0.95);
      el('rect', { x: -0.42, y: -0.8, width: 0.84, height: 1.6, rx: 0.42, fill: `url(#${p}ag)` }, g);
      el('rect', { x: -0.3, y: -0.66, width: 0.6, height: 1.32, rx: 0.3, fill: `url(#${p}ash)`, filter: `url(#${p}glow)` }, g);
      for (let k = 0; k < 18; k++) el('circle', { cx: (Math.sin(k * 3.1) * 0.18).toFixed(3), cy: (Math.cos(k * 1.7) * 0.5).toFixed(3), r: 0.022, fill: k % 4 ? '#8a8078' : '#c44b2a', 'fill-opacity': 0.8 }, g);
      el('text', { y: 0.09, 'text-anchor': 'middle', 'font-size': 0.28, 'font-family': 'Bodoni Moda, Didot, serif', fill: '#e8e0d2', 'fill-opacity': 0.85 }, g).textContent = it.numeral || '01';
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
      el('text', { transform: 'rotate(90)', y: 0.06, 'text-anchor': 'middle', 'font-size': 0.15, 'font-family': 'IBM Plex Mono, monospace', fill: '#121212' }, g).textContent = it.code || 'KP·0007·K4M9';
    },
    clasp(g, p) {
      // toggle: engraved bar across a granulated ring
      el('circle', { cy: 0.25, r: 0.62, fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.22 }, g);
      for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; el('circle', { cx: Math.cos(a) * 0.62, cy: 0.25 + Math.sin(a) * 0.62, r: 0.04, fill: '#1a1a1a', 'fill-opacity': 0.6 }, g); }
      el('rect', { x: -0.95, y: -0.62, width: 1.9, height: 0.28, rx: 0.14, fill: `url(#${p}agV)` }, g);
      el('circle', { cx: -0.98, cy: -0.48, r: 0.17, fill: `url(#${p}ag)` }, g);
      el('circle', { cx: 0.98, cy: -0.48, r: 0.17, fill: `url(#${p}ag)` }, g);
      for (let k = -3; k <= 3; k++) el('line', { x1: k * 0.22, x2: k * 0.22 + 0.08, y1: -0.6, y2: -0.36, stroke: '#0e0e0e', 'stroke-opacity': 0.5, 'stroke-width': 0.025 }, g);
      jump(g, p, 1.1);
    },
    relic(g0, p) {
      jump(g0, p, -1.45);
      const g = el('g', { transform: 'scale(1.4 1)' }, g0);
      el('path', { d: 'M-0.25,-1.2C0.3,-1.35,0.55,-0.9,0.4,-0.4C0.6,-0.1,0.75,0.2,0.4,0.35C0.2,0.8,0.05,1.2,-0.02,1.55C-0.25,1.1,-0.45,0.6,-0.4,0.1C-0.7,-0.2,-0.55,-0.6,-0.3,-0.7C-0.5,-0.95,-0.45,-1.15,-0.25,-1.2Z', fill: `url(#${p}ag)` }, g);
      for (let k = 0; k < 16; k++) el('circle', { cx: (Math.sin(k * 2.3) * 0.3).toFixed(3), cy: (-1 + (k * 0.15)).toFixed(3), r: 0.03 + (k % 3) * 0.012, fill: '#0c0c0c', 'fill-opacity': 0.55 }, g);
      el('path', { d: 'M0.4,-0.4C0.62,-0.38,0.85,-0.5,0.9,-0.75', fill: 'none', stroke: `url(#${p}ag)`, 'stroke-width': 0.14, 'stroke-linecap': 'round' }, g);
    },
    crystal(g, p) {
      jump(g, p, -1.3); jump(g, p, 1.3);
      el('polygon', { points: '0,-1.05 0.32,-0.7 0.34,0.75 0,1.05 -0.34,0.75 -0.32,-0.7', fill: '#dfe7ee', 'fill-opacity': 0.22, stroke: '#eef3f7', 'stroke-opacity': 0.6, 'stroke-width': 0.03 }, g);
      el('polyline', { points: '0,-1.05 0.05,0.2 0,1.05', fill: 'none', stroke: '#ffffff', 'stroke-opacity': 0.4, 'stroke-width': 0.025 }, g);
      el('polyline', { points: '-0.32,-0.7 0.05,0.2 0.34,0.75', fill: 'none', stroke: '#ffffff', 'stroke-opacity': 0.25, 'stroke-width': 0.02 }, g);
      for (const [x, y] of [[-0.36, -0.55], [0.36, -0.55], [-0.38, 0.0], [0.38, 0.0], [-0.36, 0.55], [0.36, 0.55], [-0.15, -0.95], [0.15, 0.95]]) el('path', { d: `M${x * 1.25},${y}L${x * 0.85},${y + 0.08}`, stroke: `url(#${p}ag)`, 'stroke-width': 0.07, 'stroke-linecap': 'round' }, g);
      el('rect', { x: -0.42, y: -1.15, width: 0.84, height: 0.16, rx: 0.08, fill: `url(#${p}ag)` }, g);
      el('rect', { x: -0.42, y: 1.0, width: 0.84, height: 0.16, rx: 0.08, fill: `url(#${p}ag)` }, g);
    },
    pearl(g, p) {
      jump(g, p, -0.8); jump(g, p, 0.8);
      el('path', { d: 'M-0.05,-0.6C0.4,-0.62,0.5,-0.25,0.45,0.05C0.52,0.35,0.3,0.62,0,0.58C-0.35,0.62,-0.52,0.3,-0.45,0C-0.55,-0.35,-0.35,-0.6,-0.05,-0.6Z', fill: `url(#${p}pearl)`, stroke: `url(#${p}au)`, 'stroke-width': 0.06 }, g);
      el('ellipse', { cx: -0.12, cy: -0.2, rx: 0.12, ry: 0.07, fill: '#fff', 'fill-opacity': 0.6 }, g);
    },
    bead(g, p) {
      el('circle', { r: 0.42, fill: `url(#${p}ag)` }, g);
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j <= 5) el('circle', { cx: i * 0.15, cy: j * 0.15, r: 0.045, fill: (i + j) % 2 ? '#1a1a1a' : '#e8e2d7', 'fill-opacity': 0.6 }, g);
      jump(g, p, -0.5); jump(g, p, 0.5);
    },
    drop(g, p) {
      DRAW.cable(g, p, { alt: 1 });
      el('line', { x1: 0, y1: 0, x2: 0.45, y2: 0.15, stroke: `url(#${p}agS)`, 'stroke-width': 0.06 }, g);
      el('path', { d: 'M0.55,0.05C0.8,0.35,0.9,0.6,0.85,0.8A0.3,0.3,0,0,1,0.25,0.8C0.2,0.6,0.3,0.35,0.55,0.05Z', fill: `url(#${p}ruby)` }, g);
      el('circle', { cx: 0.45, cy: 0.55, r: 0.05, fill: '#fff', 'fill-opacity': 0.6 }, g);
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
