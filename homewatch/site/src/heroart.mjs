// Home hero art: two variants, plain inline SVG + CSS keyframes (no JS, no scroll-jacking).
// A: modern mansion on a Hollywood hillside at dusk, rooms lighting up one by one.
// B: the LA basin seen from a hillside terrace, the city lighting up from downtown outward.
// Lights run once on load (about 3 s). Reduced motion shows the finished, lit state.

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const f = (n) => Math.round(n * 10) / 10;

function sky(id) {
  return `<defs>
<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F2747"/><stop offset=".45" stop-color="#173763"/><stop offset=".64" stop-color="#2E5286"/><stop offset=".7" stop-color="#4A6C9C"/></linearGradient>
<linearGradient id="${id}n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1E3A" stop-opacity="0"/><stop offset=".35" stop-color="#0B1E3A"/><stop offset=".7" stop-color="#11284B"/></linearGradient>
<radialGradient id="${id}h" cx=".5" cy="1" r=".6"><stop offset="0" stop-color="#A3B7D6" stop-opacity=".45"/><stop offset="1" stop-color="#A3B7D6" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8EA"/><stop offset=".55" stop-color="#F8DFAE"/><stop offset="1" stop-color="#EDBE78"/></linearGradient>
<radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F2CF92" stop-opacity=".28"/><stop offset="1" stop-color="#F2CF92" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE2A8" stop-opacity=".28"/><stop offset="1" stop-color="#FFE2A8" stop-opacity="0"/></linearGradient>
<linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5D93C6"/><stop offset=".35" stop-color="#21497A"/><stop offset="1" stop-color="#0F2747"/></linearGradient>
<linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14294A"/><stop offset="1" stop-color="#0C1B33"/></linearGradient>
</defs>
<rect width="1600" height="640" fill="url(#${id}s)"/>
<rect class="dusk" width="1600" height="640" fill="url(#${id}n)"/>
<ellipse cx="800" cy="430" rx="900" ry="120" fill="url(#${id}h)"/>`;
}

function stars(seed, n) {
  const r = rng(seed); let d = '';
  for (let i = 0; i < n; i++) { const x = f(r() * 1600), y = f(r() * 300), s = r() > .85 ? 2 : 1.3; d += `M${x} ${y}h${s}v${s}h-${s}z`; }
  return `<path class="on tw" style="animation-delay:1.4s" d="${d}" fill="#fff" opacity=".7"/>`;
}

// City lights in perspective, split into groups that switch on in waves.
function city({ seed, y0, y1, groups, rows, perRow, cx = 800, wave = false, start = .5, step = .22 }) {
  const r = rng(seed); const g = Array.from({ length: groups }, () => ({ w: '', y: '' }));
  for (let j = 0; j < rows; j++) {
    const t = j / (rows - 1); const y = y0 + (y1 - y0) * t * t; const s = .9 + t * 2.4; const n = Math.round(perRow * (1 - t * .35));
    for (let i = 0; i < n; i++) {
      if (r() < .18) continue;
      const x = r() * 1700 - 50; const yy = y + (r() - .5) * (2 + t * 10);
      const k = wave ? Math.min(groups - 1, Math.floor((Math.abs(x - cx) / 900 + t * .5) * groups * .8)) : Math.floor(r() * groups);
      const warm = r() < .62; const sz = f(s * (r() * .6 + .7));
      g[k][warm ? 'y' : 'w'] += `M${f(x)} ${f(yy)}h${sz}v${sz}h-${sz}z`;
    }
  }
  return g.map((p, k) => `<g class="on" style="animation-delay:${(start + k * step).toFixed(2)}s"><path d="${p.y}" fill="#FFD99A"/><path d="${p.w}" fill="#F4F7FF"/></g>`).join('');
}

function palm(x, y, h, lean = 0, sc = 1) {
  const tx = x + lean, ty = y - h;
  const fr = [[-62, 10], [-48, 26], [-26, 34], [0, 30], [26, 34], [48, 24], [62, 8], [-38, -6], [38, -8], [0, -14]]
    .map(([dx, dy]) => `M${tx} ${ty}q${f(dx * .5 * sc)} ${f((-22 + dy * .2) * sc)} ${f(dx * sc)} ${f(dy * sc)}`).join('');
  return `<path d="M${x} ${y}Q${f(x + lean * .2)} ${f(y - h * .55)} ${tx} ${ty}" stroke="#081529" stroke-width="${f(4.2 * sc)}" fill="none" stroke-linecap="round"/><path d="${fr}" stroke="#081529" stroke-width="${f(3 * sc)}" fill="none" stroke-linecap="round"/>`;
}

function pane(x, y, w, h, d, id, inside = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#132A4C"/><g class="on" style="animation-delay:${d}s"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}w)"/>${inside}</g>`;
}

function skyline(cx, base, n) {
  const r = rng(41); let t = '', w = '';
  for (let i = 0; i < n; i++) {
    const bw = 10 + r() * 14, h = 20 + r() * 90 * (1 - Math.abs(i - n / 2) / (n * .6)), x = cx - n * 6 + i * 12 + r() * 5;
    t += `M${f(x)} ${base}V${f(base - h)}h${f(bw)}V${base}z`;
    for (let yy = base - h + 5; yy < base - 3; yy += 6) for (let xx = x + 2; xx < x + bw - 2; xx += 4) if (r() < .5) w += `M${f(xx)} ${f(yy)}h1.5v2h-1.5z`;
  }
  return `<path d="${t}" fill="#1B355E"/><path class="on" style="animation-delay:.25s" d="${w}" fill="#FFE2AE"/>`;
}

export function artA() {
  const id = 'ha';
  const glow = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#132A4C"/>`;
  // Lower floor: living room, five tall panes; interiors are simple silhouettes.
  const lowIn = [
    '<rect x="664" y="430" width="44" height="12" rx="2" fill="#8A6A40" opacity=".5"/>',
    '<rect x="736" y="398" width="22" height="16" fill="#C79A5C" opacity=".35"/><path d="M748 384v14" stroke="#7A5E3A"/>',
    '<path d="M874 384v20" stroke="#7A5E3A"/><circle cx="874" cy="407" r="5" fill="#FFFBF0"/><rect x="852" y="432" width="48" height="10" rx="2" fill="#8A6A40" opacity=".45"/>',
    '<circle cx="944" cy="426" r="8" fill="#5E6B4A" opacity=".55"/><circle cx="938" cy="420" r="6" fill="#5E6B4A" opacity=".5"/><rect x="940" y="430" width="8" height="12" fill="#6F5636" opacity=".6"/>',
    '']
  const lower = [0.9, 1.5, 1.1, 1.8, 1.3].map((d, i) => { const x = 652 + i * 64; return glow(x, 386, 60, 64) + `<g class="on" style="animation-delay:${d}s"><rect x="${x}" y="386" width="60" height="64" fill="url(#${id}w)"/><rect x="${x}" y="386" width="60" height="5" fill="#C9A26A" opacity=".35"/>${lowIn[i] || ''}</g>`; }).join('');
  const upIn = ['', '<rect x="918" y="356" width="42" height="12" fill="#8A6A40" opacity=".45"/>', '', '<path d="M1048 320v14" stroke="#7A5E3A"/><circle cx="1048" cy="337" r="4" fill="#FFFBF0"/>', ''];
  const upper = [1.6, 1.2, 2.0, 1.45, 2.2].map((d, i) => { const x = 854 + i * 59; return glow(x, 320, 56, 56) + `<g class="on" style="animation-delay:${d}s"><rect x="${x}" y="320" width="56" height="56" fill="url(#${id}w)"/><rect x="${x}" y="320" width="56" height="4" fill="#C9A26A" opacity=".35"/>${upIn[i]}</g>`; }).join('');
  const refl = [0, 1, 2, 3, 4].map((i) => `<rect x="${662 + i * 64}" y="457" width="40" height="7" fill="#FFE7B8" opacity=".35"/>`).join('');
  const stone = [392, 400, 408, 416, 424, 432, 440].map((y) => `M974 ${y}h76`).join('');
  const joints = Array.from({ length: 13 }, (_, i) => `M${620 + i * 40} 466v22`).join('');
  return `<svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
${sky(id)}${stars(7, 70)}
<path d="M0 372C140 352 250 366 380 344 520 320 610 352 760 336 900 320 1010 300 1150 318 1300 338 1440 312 1600 326V440H0Z" fill="#1D3B66"/>
<ellipse class="on" style="animation-delay:1.2s" cx="800" cy="430" rx="980" ry="70" fill="url(#${id}g)"/>
<path d="M0 418C200 404 420 414 640 402 860 392 1100 410 1320 400 1450 394 1540 402 1600 400V640H0Z" fill="url(#${id}b)"/>
${skyline(1150, 404, 13)}${city({ seed: 11, y0: 408, y1: 570, groups: 9, rows: 20, perRow: 190, wave: true, cx: 1150, start: .25, step: .26 })}
<path d="M0 640V566C140 552 300 526 460 500 530 488 572 474 606 466H1092C1150 478 1230 500 1330 524 1450 550 1530 560 1600 562V640Z" fill="#0A1830"/>
<path d="M0 640V604C200 596 420 606 640 616 900 628 1200 608 1600 616V640Z" fill="#071226"/>
<g transform="translate(-84 0)">
<ellipse class="on" style="animation-delay:1.6s" cx="860" cy="400" rx="360" ry="120" fill="url(#${id}g)"/>
<rect x="600" y="466" width="500" height="22" fill="#152B4E"/><path d="${joints}" stroke="#1F3A63" stroke-width="1.5"/>
<ellipse cx="616" cy="462" rx="22" ry="12" fill="#091629"/><ellipse cx="1080" cy="460" rx="18" ry="14" fill="#091629"/>
${palm(548, 476, 236, -14)}${palm(586, 470, 198, 10, .9)}${palm(1206, 488, 222, 16, .95)}
<rect x="560" y="456" width="420" height="10" fill="#3F6FA3"/><g class="on" style="animation-delay:2.3s"><rect x="560" y="456" width="420" height="10" fill="#8CC8F0"/>${refl}</g>
<rect x="640" y="450" width="420" height="6" fill="#E9EEF5"/>
${lower}
<rect x="972" y="386" width="80" height="64" fill="#9AA8BF"/><path d="${stone}" stroke="#8695AE" stroke-width="1"/>
<path d="M650 386v64M714 386v64M778 386v64M842 386v64M906 386v64M970 386v64" stroke="#E9EEF5" stroke-width="2.5"/>
<rect x="628" y="376" width="444" height="10" fill="#F1F4F8"/>
<g class="on" style="animation-delay:2.5s" fill="#FFE7B8"><circle cx="680" cy="388" r="1.6"/><circle cx="744" cy="388" r="1.6"/><circle cx="808" cy="388" r="1.6"/><circle cx="872" cy="388" r="1.6"/><circle cx="936" cy="388" r="1.6"/></g>
<rect x="640" y="360" width="150" height="16" fill="#A3B7D6" opacity=".14"/><path d="M640 360H790M640 360v16M715 360v16" stroke="#C9D3E3" stroke-width="1.4" opacity=".7"/>
<rect x="792" y="320" width="62" height="56" fill="#C4CEDD"/>
${upper}
<path d="M852 320v56M911 320v56M970 320v56M1029 320v56M1088 320v56M1147 320v56" stroke="#E9EEF5" stroke-width="2.5"/>
<rect x="772" y="304" width="410" height="12" fill="#F4F6FA"/><rect x="772" y="316" width="410" height="4" fill="#8E9CB4"/>
<rect class="on" style="animation-delay:2.7s" x="780" y="316" width="394" height="2" fill="#FFE2A8"/>
<rect x="852" y="376" width="300" height="4" fill="#DDE3EC"/>
<g class="on" style="animation-delay:2.8s" fill="#FFE7B8"><circle cx="618" cy="500" r="1.8"/><circle cx="586" cy="514" r="1.8"/><circle cx="548" cy="528" r="1.8"/><circle cx="1110" cy="498" r="1.8"/><circle cx="1150" cy="512" r="1.8"/><circle cx="1196" cy="526" r="1.8"/></g>
</g>
</svg>`;
}

export function artB() {
  const id = 'hb';
  const r = rng(23); let towers = '', tw = '';
  for (let i = 0; i < 17; i++) {
    const w = 12 + r() * 16, h = 26 + r() * 110 * (1 - Math.abs(i - 8) / 10), x = 700 + i * 12 + r() * 6;
    towers += `M${f(x)} 406V${f(406 - h)}h${f(w)}V406z`;
    for (let yy = 406 - h + 5; yy < 402; yy += 6) for (let xx = x + 2; xx < x + w - 2; xx += 4) if (r() < .5) tw += `M${f(xx)} ${f(yy)}h1.6v2.2h-1.6z`;
  }
  // Boulevards: lines of lights running from downtown toward the viewer.
  const V = [800, 406]; const lines = Array.from({ length: 9 }, () => ({ y: '', w: '' }));
  for (let ex = -2200; ex <= 3800; ex += 200) {
    for (let k = 1; k <= 26; k++) {
      const t = Math.pow(k / 26, 1.7); const x = V[0] + (ex - V[0]) * t, y = V[1] + (640 - V[1]) * t; if (x < -40 || x > 1640 || y > 600) continue;
      const sz = f(.9 + t * 3.2); const g = Math.min(8, Math.floor((Math.abs(x - 800) / 1000 + t * .6) * 7));
      lines[g][k % 3 ? 'y' : 'w'] += `M${f(x)} ${f(y)}h${sz}v${sz}h-${sz}z`;
    }
  }
  const blvd = lines.map((p, k) => `<g class="on" style="animation-delay:${(.45 + k * .24).toFixed(2)}s"><path d="${p.y}" fill="#FFD08A"/><path d="${p.w}" fill="#FFFFFF"/></g>`).join('');
  return `<svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
${sky(id)}${stars(5, 80)}
<path d="M0 386C160 368 300 380 450 360 600 340 700 372 820 362 960 350 1080 330 1220 346 1380 364 1480 344 1600 352V420H0Z" fill="#1D3B66"/>
<ellipse class="on" style="animation-delay:.9s" cx="800" cy="410" rx="1000" ry="90" fill="url(#${id}g)"/>
<path d="M0 406H1600V640H0Z" fill="url(#${id}b)"/>
<path d="${towers}" fill="#1B355E"/>
<path class="on" style="animation-delay:.3s" d="${tw}" fill="#FFE2AE"/>
<rect class="on tw" style="animation-delay:.5s" x="796" y="276" width="3" height="3" fill="#FF8C7A"/>
${city({ seed: 31, y0: 408, y1: 600, groups: 9, rows: 24, perRow: 170, wave: true, start: .5, step: .24 })}
${blvd}
<path class="flow" d="M-40 590C260 560 520 470 790 410" stroke="#FFFFFF" stroke-width="1.8" fill="none" opacity=".75"/>
<path class="flow rev" d="M1640 600C1340 560 1060 470 812 410" stroke="#FF8C7A" stroke-width="1.8" fill="none" opacity=".75"/>
<path d="M0 640V584C120 570 220 556 330 546 380 541 420 546 452 554 520 572 600 584 700 590H900C1000 584 1080 572 1148 554 1180 546 1220 541 1270 546 1380 556 1480 570 1600 584V640Z" fill="#081529"/>
${palm(330, 550, 250, -10)}${palm(372, 550, 206, 14, .9)}${palm(1268, 550, 236, 12, .95)}
<rect x="0" y="600" width="1600" height="40" fill="#0E2444"/><g class="on" style="animation-delay:2.4s"><rect x="0" y="600" width="1600" height="40" fill="url(#${id}p)"/></g>
<rect x="0" y="598" width="1600" height="2" fill="#C9D3E3" opacity=".8"/>
</svg>`;
}

export const heroArt = (v = 'a') => `<div class="hart" aria-hidden="true">${v === 'b' ? artB() : artA()}</div>`;
