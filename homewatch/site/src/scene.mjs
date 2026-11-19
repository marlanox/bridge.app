// Home page scroll scene: a modern hillside estate above Beverly Hills at blue hour.
// White architecture, floor-to-ceiling glass, a cantilevered upper floor and an infinity pool.
// As the visitor scrolls, rooms light up one by one, then the pool and the garden lights.
// Lit elements read --t (start point) against --p (scroll progress 0..1) in CSS.

const WALL = '#D5DDE8', SLAB = '#EEF2F7', SHADE = '#AEBBCC', FRAME = '#8C9BB0';

// A run of glass panes between x0 and x1. Each pane lights in order starting at t0.
function glass(x0, x1, y, h, n, t0, step, interior = '') {
  const w = (x1 - x0) / n;
  let o = `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="url(#glassDark)"/>`;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * w;
    o += `<rect class="lit" style="--t:${(t0 + i * step).toFixed(3)}" x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" fill="url(#warm)"/>`;
  }
  o += interior;
  for (let i = 1; i < n; i++) o += `<rect x="${(x0 + i * w - 1).toFixed(1)}" y="${y}" width="2" height="${h}" fill="${FRAME}"/>`;
  o += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="url(#sheen)"/>`;
  return o;
}

export function landSvg() {
  return `<svg viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 200C190 150 360 160 560 120 760 84 940 128 1120 96 1300 66 1460 92 1600 72V400H0Z" fill="#3A5680" opacity=".55"/><path d="M0 268C240 236 430 252 640 244 880 236 1080 248 1320 236 1460 230 1540 234 1600 230V400H0Z" fill="#1E3356"/></svg>`;
}

export function sceneSvg() {
  const lower = glass(842, 1318, 448, 70, 7, 0.08, 0.035,
    `<g class="lit" style="--t:.12"><path d="M880 518v-16h88v16M900 502v-8h48v8" fill="#B77E45"/><path d="M1010 448v20M1004 468h12" stroke="#B77E45" stroke-width="2"/><circle cx="1010" cy="472" r="5" fill="#FFE3AE"/><path d="M1160 518v-22h70v22M1176 496v-14" fill="none" stroke="#B77E45" stroke-width="3"/><path d="M1268 518v-40l18-12" fill="none" stroke="#9C6A3A" stroke-width="3"/></g>`);
  const upper = glass(722, 1222, 360, 62, 6, 0.36, 0.04,
    `<g class="lit" style="--t:.42"><path d="M760 422v-14h96v14" fill="#B77E45"/><path d="M930 360v14M1080 360v14" stroke="#B77E45" stroke-width="2"/><circle cx="930" cy="378" r="4.5" fill="#FFE3AE"/><circle cx="1080" cy="378" r="4.5" fill="#FFE3AE"/><path d="M1130 422v-22h60v22" fill="none" stroke="#B77E45" stroke-width="3"/></g>`);
  const palm = (x, base, top, lean) => `<path d="M${x} ${base}C${x + lean * 0.2} ${base - (base - top) * 0.5} ${x + lean * 0.6} ${top + 30} ${x + lean} ${top}" stroke="#18294A" stroke-width="5" fill="none" stroke-linecap="round"/><g stroke="#18294A" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M${x + lean} ${top}c-30-10-62-4-84 16M${x + lean} ${top}c-22-22-56-30-82-22M${x + lean} ${top}c4-30 22-50 46-58M${x + lean} ${top}c26-16 58-18 82-4M${x + lean} ${top}c30 2 54 18 66 40"/></g>`;
  return `<svg viewBox="600 150 960 450" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
<defs>
  <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0CF"/><stop offset=".55" stop-color="#F6CF8E"/><stop offset="1" stop-color="#DFA663"/></linearGradient>
  <linearGradient id="glassDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5B7FAE"/><stop offset=".5" stop-color="#2F4E7C"/><stop offset="1" stop-color="#22406B"/></linearGradient>
  <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".10"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".6"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>
  <radialGradient id="glow" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#FFD7A0" stop-opacity=".30"/><stop offset="1" stop-color="#FFD7A0" stop-opacity="0"/></radialGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FE3F0"/><stop offset="1" stop-color="#2E9DBB"/></linearGradient>
  <linearGradient id="waterDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A6C98"/><stop offset="1" stop-color="#2A4670"/></linearGradient>
  <linearGradient id="refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD7A0" stop-opacity=".45"/><stop offset="1" stop-color="#FFD7A0" stop-opacity="0"/></linearGradient>
</defs>
${palm(1438, 520, 200, -14)}${palm(1486, 520, 240, 10)}
<ellipse class="lit" style="--t:.2" cx="1040" cy="430" rx="520" ry="170" fill="url(#glow)"/>
<!-- the hill -->
<path d="M520 640C600 600 680 566 760 548 860 528 980 530 1100 528 1260 526 1420 516 1600 506V640Z" fill="#1E3356"/>
<!-- upper floor, cantilevered to the left -->
<rect x="684" y="342" width="580" height="12" fill="${SLAB}"/>
<rect x="690" y="354" width="32" height="68" fill="${WALL}"/>
${upper}
<rect x="1222" y="354" width="36" height="68" fill="${WALL}"/>
<rect x="692" y="422" width="566" height="10" fill="${SLAB}"/>
<rect x="700" y="432" width="540" height="3" fill="${SHADE}"/>
<!-- tall side volume with a slot window -->
<rect x="1258" y="372" width="170" height="146" fill="${WALL}"/>
<rect x="1250" y="364" width="186" height="10" fill="${SLAB}"/>
<rect x="1384" y="390" width="16" height="110" fill="url(#glassDark)"/><rect class="lit" style="--t:.66" x="1384" y="390" width="16" height="110" fill="url(#warm)"/>
<!-- lower floor, set into the hill -->
<rect x="820" y="440" width="22" height="78" fill="${WALL}"/>
${lower}
<rect x="804" y="436" width="530" height="6" fill="${SLAB}"/>
<!-- stone plinth, terrace, infinity pool -->
<rect x="780" y="518" width="660" height="14" fill="#B7C3D3"/>
<rect x="760" y="532" width="560" height="16" fill="url(#waterDark)"/>
<rect class="lit" style="--t:.78" x="760" y="532" width="560" height="16" fill="url(#water)"/>
<rect class="lit" style="--t:.3" x="842" y="532" width="476" height="16" fill="url(#refl)"/>
<rect x="756" y="548" width="568" height="4" fill="#9FB0C6"/>
<rect class="lit" style="--t:.8" x="756" y="548" width="568" height="3" fill="#BFF3FA"/>
<path d="M760 552C820 560 900 566 1000 566" stroke="#2A4670" stroke-width="1" fill="none"/>
<!-- olive trees and planting -->
<g fill="#16294A"><ellipse cx="1470" cy="508" rx="34" ry="22"/><ellipse cx="1500" cy="498" rx="26" ry="20"/><rect x="1480" y="508" width="4" height="18"/><ellipse cx="740" cy="540" rx="30" ry="14"/><ellipse cx="1356" cy="526" rx="26" ry="10"/></g>
<!-- garden lights and palm uplights -->
<g class="lit" style="--t:.86">
  <circle cx="1440" cy="510" r="26" fill="url(#halo)"/><circle cx="1490" cy="512" r="22" fill="url(#halo)"/>
  <circle cx="780" cy="560" r="14" fill="url(#halo)"/><circle cx="780" cy="560" r="2" fill="#FFE8BC"/>
  <circle cx="880" cy="572" r="14" fill="url(#halo)"/><circle cx="880" cy="572" r="2" fill="#FFE8BC"/>
  <circle cx="980" cy="580" r="14" fill="url(#halo)"/><circle cx="980" cy="580" r="2" fill="#FFE8BC"/>
</g>
</svg>`;
}
