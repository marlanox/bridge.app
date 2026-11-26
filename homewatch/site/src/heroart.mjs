// Home hero art: a modern hillside house above Los Angeles. Inline SVG, no images.
// Scroll-linked: site.js sets --p (0 → 1) over the first ~third of a screen of scrolling;
// every light has its own threshold --t and fades in as --p passes it.
// Reduced motion: --p is 1, so the scene shows fully lit.

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const f = (n) => Math.round(n * 10) / 10;
const L = (t, inner) => `<g class="L" style="--t:${t}">${inner}</g>`;

const defs = `<defs>
<linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F2747"/><stop offset=".42" stop-color="#1A3A68"/><stop offset=".6" stop-color="#34588C"/><stop offset=".68" stop-color="#5D7BA6"/></linearGradient>
<linearGradient id="hNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1B36" stop-opacity="0"/><stop offset=".3" stop-color="#0A1B36"/><stop offset=".68" stop-color="#0E2544"/></linearGradient>
<radialGradient id="hHaze" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F0CC97" stop-opacity=".34"/><stop offset=".6" stop-color="#C9A57A" stop-opacity=".1"/><stop offset="1" stop-color="#C9A57A" stop-opacity="0"/></radialGradient>
<linearGradient id="hBasin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E3B66"/><stop offset=".25" stop-color="#14294A"/><stop offset="1" stop-color="#0B1A31"/></linearGradient>
<linearGradient id="hHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E203C"/><stop offset="1" stop-color="#050E1E"/></linearGradient>
<linearGradient id="hRoom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3DC"/><stop offset=".18" stop-color="#F9DFAF"/><stop offset=".75" stop-color="#E7B77A"/><stop offset="1" stop-color="#C99256"/></linearGradient>
<linearGradient id="hDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A3459"/><stop offset="1" stop-color="#0F2340"/></linearGradient>
<linearGradient id="hCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8E8" stop-opacity=".75"/><stop offset="1" stop-color="#FFF8E8" stop-opacity="0"/></linearGradient>
<linearGradient id="hGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".09"/><stop offset=".55" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="hStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFC5B1"/><stop offset="1" stop-color="#8F8674"/></linearGradient>
<linearGradient id="hWash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7BD" stop-opacity=".55"/><stop offset="1" stop-color="#FFE7BD" stop-opacity="0"/></linearGradient>
<linearGradient id="hSlab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6F7F9"/><stop offset="1" stop-color="#C9D1DD"/></linearGradient>
<linearGradient id="hConc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22395F"/><stop offset="1" stop-color="#132644"/></linearGradient>
<linearGradient id="hWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A5785"/><stop offset="1" stop-color="#163A62"/></linearGradient>
<linearGradient id="hWaterL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD6F5"/><stop offset="1" stop-color="#2F86C6"/></linearGradient>
<linearGradient id="hUp" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFE2B0" stop-opacity=".5"/><stop offset="1" stop-color="#FFE2B0" stop-opacity="0"/></linearGradient>
<linearGradient id="hTower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22406B"/><stop offset="1" stop-color="#172F52"/></linearGradient>
<radialGradient id="hBloom"><stop offset="0" stop-color="#FFE6B8" stop-opacity=".9"/><stop offset="1" stop-color="#FFE6B8" stop-opacity="0"/></radialGradient>
</defs>`;

function stars() {
  const r = rng(7); let d = '';
  for (let i = 0; i < 90; i++) { const x = f(r() * 1600), y = f(r() * 290), s = r() > .9 ? 1.8 : 1.1; d += `M${x} ${y}h${s}v${s}h-${s}z`; }
  return L(.5, `<path d="${d}" fill="#fff" opacity=".65"/>`);
}

// Downtown towers with lit windows and red aviation lights.
function skyline(cx, base) {
  const r = rng(41); let t = '', w = '', cap = '';
  const n = 15;
  for (let i = 0; i < n; i++) {
    const bw = 9 + r() * 12, h = 18 + r() * 92 * (1 - Math.abs(i - n / 2) / (n * .62)), x = cx - n * 5.5 + i * 11 + r() * 4;
    t += `M${f(x)} ${base}V${f(base - h)}h${f(bw)}V${base}z`;
    if (h > 70) cap += `<rect x="${f(x + bw / 2 - 1)}" y="${f(base - h - 3)}" width="2" height="2" fill="#FF7A66"/>`;
    for (let yy = base - h + 4; yy < base - 2; yy += 4.5) for (let xx = x + 1.5; xx < x + bw - 1.5; xx += 3) if (r() < .42) w += `M${f(xx)} ${f(yy)}h1.3v1.8h-1.3z`;
  }
  return `<path d="${t}" fill="url(#hTower)"/>` + L(.04, `<path d="${w}" fill="#FFE3B4"/>${cap}`);
}

// The basin: rows of lights in perspective plus boulevards running toward downtown.
// Lights switch on in a wave that starts downtown (cx) and rolls outward.
function city(cx) {
  const r = rng(11); const G = 10; const g = Array.from({ length: G }, () => ({ a: '', b: '' }));
  let always = '';
  for (let j = 0; j < 22; j++) {
    const t = j / 21; const y = 410 + 150 * t * t; const s = .7 + t * 2.1; const n = Math.round(200 * (1 - t * .3));
    for (let i = 0; i < n; i++) {
      if (r() < .15) continue;
      const x = r() * 1700 - 50, yy = y + (r() - .5) * (1.5 + t * 9), sz = f(s * (r() * .6 + .7));
      const d = `M${f(x)} ${f(yy)}h${sz}v${sz}h-${sz}z`;
      if (r() < .05) { always += d; continue; }
      const k = Math.min(G - 1, Math.floor((Math.abs(x - cx) / 1200 + t * .45) * G * .85));
      g[k][r() < .6 ? 'a' : 'b'] += d;
    }
  }
  for (let ex = -2400; ex <= 4000; ex += 230) for (let k = 2; k <= 24; k++) {
    const t = Math.pow(k / 24, 1.8), x = cx + (ex - cx) * t, y = 408 + 220 * t; if (x < -30 || x > 1630 || y > 572) continue;
    const sz = f(.8 + t * 2.6), gi = Math.min(G - 1, Math.floor((Math.abs(x - cx) / 1200 + t * .45) * G * .85));
    g[gi].a += `M${f(x)} ${f(y)}h${sz}v${sz}h-${sz}z`;
  }
  const bl = Array.from({ length: 26 }, () => { const x = f(r() * 1600), y = f(420 + r() * 130); return `<circle cx="${x}" cy="${y}" r="${f(3 + r() * 4)}" fill="url(#hBloom)" opacity=".55"/>`; });
  return `<path d="${always}" fill="#FFD9A0" opacity=".8"/>` + g.map((p, k) => L(f(.06 + k * .065), `<path d="${p.a}" fill="#FFD59A"/><path d="${p.b}" fill="#F2F5FF"/>${bl.slice(k * 2.6 | 0, (k + 1) * 2.6 | 0).join('')}`)).join('');
}

function palm(x, y, h, lean, sc, t) {
  const tx = x + lean, ty = y - h;
  const trunk = `<path d="M${f(x - 3.2 * sc)} ${y}Q${f(x + lean * .25)} ${f(y - h * .55)} ${f(tx - 1.2 * sc)} ${ty}h${f(2.4 * sc)}Q${f(x + lean * .25 + 2 * sc)} ${f(y - h * .55)} ${f(x + 3.2 * sc)} ${y}z" fill="#07142A"/>`;
  const leaves = [[-70, 18], [-58, 34], [-36, 46], [-12, 50], [12, 50], [36, 44], [58, 32], [70, 16], [-50, -4], [50, -6], [-22, -12], [22, -14]].map(([dx, dy]) => {
    const ex = tx + dx * sc, ey = ty + dy * sc, mx = tx + dx * .5 * sc, my = ty + (-18 + dy * .15) * sc;
    return `M${tx} ${ty}Q${f(mx)} ${f(my - 3 * sc)} ${f(ex)} ${f(ey)}Q${f(mx)} ${f(my + 3 * sc)} ${tx} ${ty}z`;
  }).join('');
  const up = L(t, `<path d="M${x - 1} ${y}L${f(tx - 30 * sc)} ${f(ty + 10)}H${f(tx + 30 * sc)}Z" fill="url(#hUp)" opacity=".28"/><circle cx="${x}" cy="${y - 1}" r="2" fill="#FFF1D2"/>`);
  return up + trunk + `<path d="${leaves}" fill="#07142A"/>`;
}

function cypress(x, y, h, w) {
  return `<path d="M${x} ${y - h}C${x + w * .7} ${y - h * .7} ${x + w * .6} ${y - h * .2} ${x + w * .35} ${y}H${x - w * .35}C${x - w * .6} ${y - h * .2} ${x - w * .7} ${y - h * .7} ${x} ${y - h}z" fill="#081630"/><path d="M${x + 1} ${y - h + 6}C${x + w * .6} ${y - h * .65} ${x + w * .52} ${y - h * .25} ${x + w * .3} ${y - 2}" stroke="#1F3B63" stroke-width="1" fill="none" opacity=".7"/>`;
}

// One room behind glass: dark when off, warm with downlight cones and furniture when on.
function room(x, y, w, h, t, furn) {
  const n = Math.max(1, Math.round(w / 46));
  const cones = Array.from({ length: n }, (_, i) => { const cx = x + (i + .5) * (w / n); return `<path d="M${f(cx - 3)} ${y + 2}h6l9 ${f(h * .7)}h-24z" fill="url(#hCone)" opacity=".45"/><rect x="${f(cx - 2)}" y="${y + 1}" width="4" height="1.6" fill="#fff"/>`; }).join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#hDark)"/>` +
    L(t, `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#hRoom)"/><rect x="${x}" y="${y}" width="${w}" height="${f(h * .1)}" fill="#E0B47C" opacity=".45"/>${cones}${furn}<rect x="${x}" y="${y + h - 3}" width="${w}" height="3" fill="#B07D45" opacity=".5"/>`);
}
const ink = '#5E4329';

export function art() {
  const y1 = 392, h1 = 70;
  const living = room(560, y1, 164, h1, .14,
    `<rect x="580" y="${y1 + 14}" width="44" height="28" fill="#2E3A4F" opacity=".75"/><rect x="583" y="${y1 + 17}" width="38" height="22" fill="#B97A4A" opacity=".55"/><path d="M572 ${y1 + 52}h70a4 4 0 0 1 4 4v8h-78v-8a4 4 0 0 1 4-4z" fill="${ink}" opacity=".7"/><rect x="574" y="${y1 + 47}" width="66" height="7" rx="3" fill="${ink}" opacity=".5"/><rect x="662" y="${y1 + 58}" width="30" height="4" fill="${ink}" opacity=".6"/><path d="M706 ${y1 + 66}V${y1 + 22}q0-10 -12 -12" stroke="${ink}" stroke-width="1.4" fill="none" opacity=".7"/><circle cx="694" cy="${y1 + 12}" r="4.5" fill="#FFFBF1"/>`);
  const dining = room(726, y1, 108, h1, .3,
    `<path d="M748 ${y1 + 2}v14M812 ${y1 + 2}v14" stroke="${ink}" stroke-width="1" opacity=".6"/><rect x="744" y="${y1 + 16}" width="72" height="3" rx="1.5" fill="#FFFBF1"/><rect x="744" y="${y1 + 46}" width="72" height="4" fill="${ink}" opacity=".7"/><path d="M752 ${y1 + 50}v16M808 ${y1 + 50}v16" stroke="${ink}" stroke-width="2" opacity=".6"/>${[750, 766, 782, 798].map((cx) => `<rect x="${cx}" y="${y1 + 38}" width="8" height="18" rx="2" fill="${ink}" opacity=".55"/>`).join('')}`);
  const kitchen = room(836, y1, 164, h1, .22,
    `<rect x="846" y="${y1 + 10}" width="144" height="20" fill="#6B5238" opacity=".35"/><path d="M846 ${y1 + 20}h144" stroke="#4B3A28" stroke-width=".8" opacity=".4"/>${[882, 918, 954].map((cx) => `<path d="M${cx} ${y1}v20" stroke="${ink}" stroke-width=".8"/><circle cx="${cx}" cy="${y1 + 22}" r="3" fill="#FFFBF1"/>`).join('')}<rect x="862" y="${y1 + 44}" width="112" height="22" fill="#D8CDB8" opacity=".85"/><rect x="862" y="${y1 + 44}" width="112" height="3" fill="#F4EEE2"/>`);
  const y2 = 324, h2 = 60;
  const suite = room(772, y2, 216, h2, .42,
    `<rect x="800" y="${y2 + 22}" width="70" height="18" fill="#3C3226" opacity=".55"/><path d="M790 ${y2 + 40}h92v14h-92z" fill="${ink}" opacity=".6"/><rect x="792" y="${y2 + 36}" width="88" height="6" rx="2" fill="#F3E9D6" opacity=".9"/><circle cx="780" cy="${y2 + 30}" r="5" fill="#FFF7E4"/><circle cx="892" cy="${y2 + 30}" r="5" fill="#FFF7E4"/><rect x="926" y="${y2 + 12}" width="40" height="26" fill="#2E3A4F" opacity=".6"/>`);
  const study = room(990, y2, 160, h2, .54,
    `${[1004, 1020, 1036, 1052].map((x) => `<rect x="${x}" y="${y2 + 8}" width="14" height="44" fill="#5A4530" opacity=".45"/>`).join('')}<path d="M1002 ${y2 + 22}h66M1002 ${y2 + 36}h66" stroke="#3E2F20" stroke-width="1.2" opacity=".55"/><rect x="1086" y="${y2 + 38}" width="52" height="4" fill="${ink}" opacity=".7"/><path d="M1130 ${y2 + 38}l-6-14" stroke="${ink}" stroke-width="1.2"/><circle cx="1123" cy="${y2 + 23}" r="3.5" fill="#FFF7E4"/>`);
  const mull = (x0, x1, y, h, step) => { let d = ''; for (let x = x0; x <= x1 + .1; x += step) d += `M${f(x)} ${y}v${h}`; return `<path d="${d}" stroke="#E6EBF2" stroke-width="1.6"/>`; };
  const slats = Array.from({ length: 17 }, (_, i) => `M${704 + i * 4} ${y2}v${h2}`).join('');
  const joints = Array.from({ length: 6 }, (_, i) => `M1002 ${y1 + 10 + i * 11}h80`).join('') + 'M1040 392v10M1022 403v11M1058 414v11M1030 425v11M1050 436v11M1018 447v11';
  const board = Array.from({ length: 5 }, (_, i) => `M500 ${474 + i * 6}h610`).join('');
  const refl = [600, 650, 760, 790, 880, 930].map((x, i) => `<rect x="${x}" y="${465 + (i % 2)}" width="${18 + (i % 3) * 8}" height="1.6" fill="#FFE7B8" opacity=".75"/>`).join('');
  const soffit = Array.from({ length: 12 }, (_, i) => { const x = 700 + i * 40; return `<rect x="${x}" y="322" width="5" height="1.6" fill="#fff"/><path d="M${x} 323.6h5l14 60h-33z" fill="url(#hWash)" opacity=".5"/>`; }).join('');
  const under = Array.from({ length: 13 }, (_, i) => `<rect x="${566 + i * 42}" y="391" width="4" height="1.4" fill="#fff"/>`).join('');
  const lamps = [[600, 506], [570, 520], [536, 534], [498, 548], [1120, 504], [1160, 518], [1202, 532]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#FFE7B8"/><ellipse cx="${x}" cy="${y + 3}" rx="9" ry="2.4" fill="#FFE7B8" opacity=".18"/>`).join('');

  return `<svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">${defs}
<rect width="1600" height="640" fill="url(#hSky)"/><rect class="dusk" width="1600" height="640" fill="url(#hNight)"/>
${stars()}
<path d="M0 360C120 344 230 352 350 336 470 320 560 338 690 326 820 314 930 296 1060 306 1200 318 1330 300 1460 310 1530 314 1570 318 1600 318V430H0Z" fill="#3A5A88" opacity=".55"/>
<path d="M0 384C150 368 280 378 420 362 560 348 650 370 800 360 950 350 1080 336 1230 348 1380 360 1490 344 1600 350V430H0Z" fill="#26497A"/>
${L(.1, '<ellipse cx="760" cy="412" rx="1000" ry="74" fill="url(#hHaze)"/>')}
<path d="M0 404C200 398 420 404 640 400 860 396 1100 404 1320 400 1450 398 1540 402 1600 401V640H0Z" fill="url(#hBasin)"/>
${skyline(430, 406)}
${city(430)}
<path d="M0 640V560C140 548 290 526 440 506 500 498 540 486 568 478H1110C1160 488 1240 506 1340 526 1450 548 1530 556 1600 558V640Z" fill="url(#hHill)"/>
<path d="M0 560C140 548 290 526 440 506 500 498 540 486 568 478M1110 478C1160 488 1240 506 1340 526 1450 548 1530 556 1600 558" stroke="#2A4672" stroke-width="1.2" fill="none" opacity=".7"/>
<path d="M0 640V606C200 598 420 608 640 616 900 628 1200 610 1600 616V640Z" fill="#040B18"/>
${L(.86, lamps)}
${cypress(508, 480, 92, 20)}${cypress(530, 480, 70, 16)}
${palm(474, 498, 236, -12, 1, .84)}${palm(1172, 498, 250, 14, 1.05, .88)}${palm(1206, 506, 196, 22, .85, .9)}
<rect x="500" y="470" width="610" height="32" fill="url(#hConc)"/><path d="${board}" stroke="#2B4670" stroke-width=".7" opacity=".7"/>
<rect x="470" y="462" width="430" height="9" fill="url(#hWater)"/>${L(.76, `<rect x="470" y="462" width="430" height="9" fill="url(#hWaterL)"/>${refl}`)}
<rect x="470" y="461" width="430" height="1.4" fill="#E9EEF5"/>
<rect x="540" y="462" width="560" height="6" fill="url(#hSlab)"/>
${living}${dining}${kitchen}
${mull(560, 1000, y1, h1, 55)}
<rect x="560" y="${y1}" width="440" height="${h1}" fill="url(#hGlass)"/>
<rect x="1002" y="${y1}" width="80" height="${h1}" fill="url(#hStone)"/><path d="${joints}" stroke="#7E7564" stroke-width=".8" opacity=".8"/>${L(.66, `<rect x="1002" y="${y1}" width="80" height="${h1}" fill="url(#hWash)"/>`)}
<rect x="528" y="384" width="584" height="8" fill="url(#hSlab)"/><rect x="528" y="391" width="584" height="1.4" fill="#7F8DA4"/>${L(.7, under)}
<rect x="540" y="368" width="160" height="16" fill="#A3B7D6" opacity=".12"/><path d="M540 368H700M540 368v16M620 368v16M700 368v16" stroke="#D5DDE8" stroke-width="1.1" opacity=".75"/>
<rect x="700" y="${y2}" width="70" height="${h2}" fill="#4A3826"/><path d="${slats}" stroke="#8C6B48" stroke-width="2"/>${L(.6, `<rect x="700" y="${y2}" width="70" height="${h2}" fill="url(#hWash)"/>`)}
${suite}${study}
${mull(772, 1150, y2, h2, 54)}
<rect x="772" y="${y2}" width="378" height="${h2}" fill="url(#hGlass)"/>
<rect x="768" y="384" width="384" height="3" fill="#C9D1DD"/>
<rect x="680" y="308" width="500" height="13" fill="url(#hSlab)"/><rect x="680" y="320" width="500" height="2.4" fill="#7F8DA4"/>
${L(.62, soffit)}
<ellipse cx="560" cy="476" rx="26" ry="10" fill="#081630"/><ellipse cx="1092" cy="474" rx="22" ry="9" fill="#081630"/><ellipse cx="1120" cy="478" rx="16" ry="7" fill="#081630"/>
</svg>`;
}

export const heroArt = () => `<div class="hart" aria-hidden="true">${art()}</div>`;
