// Home page scroll scene: a classical Beverly Hills estate at dusk.
// As the visitor scrolls, the inspector walks the house: the foyer lights first, then each
// room, then the lanterns, column uplights and the fountain in the motor court.
// Lit elements read --t (start point) against --p (scroll progress 0..1) in CSS.

const WALL = '#232A37', WING = '#1E2430', TRIM = '#3A4150', ROOF = '#12161E', DARK = '#10151D', MULL = '#2B3240';

// Rectangular window with mullions and lit state.
const rectWin = (x, y, w, h, t) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${DARK}"/>` +
  `<rect class="lit" style="--t:${t}" x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#warm)"/>` +
  `<path d="M${x + w / 2} ${y}v${h}M${x} ${y + h / 3}h${w}M${x} ${y + (2 * h) / 3}h${w}" stroke="${MULL}" stroke-width="2"/>` +
  `<rect x="${x - 3}" y="${y + h}" width="${w + 6}" height="3" fill="${TRIM}"/>`;

// Arched French door / window.
const archWin = (x, y, w, h, t) => {
  const r = w / 2;
  const d = `M${x} ${y + h}V${y + r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h}Z`;
  return `<path d="${d}" fill="${DARK}"/><path class="lit" style="--t:${t}" d="${d}" fill="url(#warm)"/>` +
    `<path d="M${x + r} ${y}v${h}M${x} ${y + r + (h - r) / 3}h${w}M${x} ${y + r + (2 * (h - r)) / 3}h${w}" stroke="${MULL}" stroke-width="2"/>` +
    `<path d="${d}" fill="none" stroke="${TRIM}" stroke-width="2.5"/>`;
};

const cypress = (x, base, h, w) => `<path d="M${x} ${base}C${x - w} ${base - h * 0.35} ${x - w * 0.8} ${base - h * 0.75} ${x} ${base - h}C${x + w * 0.8} ${base - h * 0.75} ${x + w} ${base - h * 0.35} ${x} ${base}Z" fill="#0A0E14"/>`;

const lantern = (x, y, t) => `<g class="lit" style="--t:${t}"><circle cx="${x}" cy="${y}" r="22" fill="url(#halo)"/><rect x="${x - 3}" y="${y - 5}" width="6" height="10" fill="#F6E0B0"/></g><rect x="${x - 4}" y="${y - 7}" width="8" height="2" fill="${TRIM}"/>`;

export function landSvg() {
  return `<svg viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 170C170 128 330 136 520 106 700 78 860 116 1040 90 1220 64 1420 96 1600 70V400H0Z" fill="#171C26"/><path d="M0 250C220 222 420 234 620 228 860 220 1100 232 1320 222 1450 216 1530 220 1600 216V400H0Z" fill="#10141C"/></svg>`;
}

export function sceneSvg() {
  const upperL = [846, 896, 946].map((x, i) => rectWin(x, 372, 30, 46, 0.44 + i * 0.03)).join('');
  const upperR = [1144, 1194, 1244].map((x, i) => rectWin(x, 372, 30, 46, 0.54 + i * 0.03)).join('');
  const lowerL = [846, 896, 946].map((x, i) => archWin(x, 458, 30, 76, 0.16 + i * 0.04)).join('');
  const lowerR = [1144, 1194, 1244].map((x, i) => archWin(x, 458, 30, 76, 0.28 + i * 0.04)).join('');
  const wingL = [688, 734, 780].map((x, i) => archWin(x, 474, 28, 62, 0.64 + i * 0.02)).join('');
  const wingR = [1312, 1358, 1404].map((x, i) => archWin(x, 474, 28, 62, 0.7 + i * 0.02)).join('');
  const balus = (x0, x1) => { let o = ''; for (let x = x0 + 6; x < x1 - 4; x += 12) o += `<rect x="${x}" y="412" width="4" height="12" fill="${TRIM}"/>`; return o; };
  const cols = [1004, 1034, 1078, 1108].map((x) => `<rect x="${x}" y="424" width="10" height="132" fill="#444C5C"/><rect x="${x - 3}" y="420" width="16" height="5" fill="#4E5666"/><rect x="${x - 3}" y="552" width="16" height="4" fill="#4E5666"/>`).join('');
  const upl = [1009, 1039, 1083, 1113].map((x) => `<path class="lit" style="--t:.8" d="M${x - 9} 556L${x + 5} 556L${x + 22} 424L${x - 26} 424Z" fill="url(#beam)"/>`).join('');
  return `<svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
<defs>
  <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7E2B4"/><stop offset=".6" stop-color="#E8BE7C"/><stop offset="1" stop-color="#C99554"/></linearGradient>
  <radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F3D39A" stop-opacity=".55"/><stop offset="1" stop-color="#F3D39A" stop-opacity="0"/></radialGradient>
  <radialGradient id="glow" cx=".5" cy=".6" r=".5"><stop offset="0" stop-color="#E7C285" stop-opacity=".28"/><stop offset="1" stop-color="#E7C285" stop-opacity="0"/></radialGradient>
  <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F3D39A" stop-opacity=".38"/><stop offset="1" stop-color="#F3D39A" stop-opacity="0"/></linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD3E3"/><stop offset="1" stop-color="#3E8199"/></linearGradient>
  <linearGradient id="spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E7C285" stop-opacity=".32"/><stop offset="1" stop-color="#E7C285" stop-opacity="0"/></linearGradient>
</defs>
<ellipse class="lit" style="--t:.24" cx="1060" cy="460" rx="560" ry="190" fill="url(#glow)"/>
${cypress(612, 572, 250, 22)}${cypress(642, 572, 200, 18)}${cypress(1508, 572, 250, 22)}${cypress(1478, 572, 200, 18)}
<!-- wings -->
<rect x="660" y="430" width="160" height="126" fill="${WING}"/><rect x="1300" y="430" width="160" height="126" fill="${WING}"/>
<rect x="652" y="424" width="176" height="8" fill="${TRIM}"/><rect x="1292" y="424" width="176" height="8" fill="${TRIM}"/>
${balus(652, 828)}${balus(1292, 1468)}<rect x="652" y="408" width="176" height="5" fill="${TRIM}"/><rect x="1292" y="408" width="176" height="5" fill="${TRIM}"/>
${wingL}${wingR}
<!-- main block -->
<rect x="820" y="352" width="480" height="204" fill="${WALL}"/>
<rect x="820" y="440" width="480" height="5" fill="${TRIM}"/>
<path d="M802 352L866 292H1254L1318 352Z" fill="${ROOF}"/>
<rect x="806" y="346" width="508" height="9" fill="${TRIM}"/>
<rect x="896" y="258" width="20" height="44" fill="${ROOF}"/><rect x="892" y="254" width="28" height="6" fill="${TRIM}"/>
<rect x="1204" y="258" width="20" height="44" fill="${ROOF}"/><rect x="1200" y="254" width="28" height="6" fill="${TRIM}"/>
${upperL}${upperR}${lowerL}${lowerR}
<!-- portico -->
<path d="M984 410L1060 370L1136 410Z" fill="#2D3442" stroke="${TRIM}" stroke-width="2"/>
<circle cx="1060" cy="396" r="9" fill="${DARK}"/><circle class="lit" style="--t:.1" cx="1060" cy="396" r="9" fill="url(#warm)"/>
<rect x="990" y="410" width="140" height="12" fill="#4E5666"/>
<path d="M1042 556V492A18 18 0 0 1 1078 492V556Z" fill="${DARK}"/>
<path class="lit" style="--t:.05" d="M1042 556V492A18 18 0 0 1 1078 492V556Z" fill="url(#warm)"/>
<path d="M1060 474v82" stroke="${MULL}" stroke-width="2"/>
${upl}${cols}
${lantern(1024, 500, 0.78)}${lantern(1096, 500, 0.78)}
<!-- terrace, steps, light spill -->
<rect x="640" y="556" width="840" height="14" fill="#2A303D"/>
<rect x="1010" y="570" width="100" height="6" fill="#2A303D"/><rect x="996" y="576" width="128" height="6" fill="#262C38"/>
<rect class="lit" style="--t:.3" x="660" y="570" width="800" height="34" fill="url(#spill)"/>
<!-- hedges -->
<rect x="664" y="540" width="150" height="18" rx="8" fill="#0C1118"/><rect x="1306" y="540" width="150" height="18" rx="8" fill="#0C1118"/>
<rect x="830" y="544" width="150" height="14" rx="7" fill="#0C1118"/><rect x="1140" y="544" width="150" height="14" rx="7" fill="#0C1118"/>
<!-- motor court and fountain -->
<ellipse cx="1060" cy="606" rx="250" ry="26" fill="#161B24"/>
<ellipse cx="1060" cy="604" rx="58" ry="11" fill="#2A303D"/>
<ellipse cx="1060" cy="602" rx="50" ry="8" fill="${DARK}"/>
<ellipse class="lit" style="--t:.86" cx="1060" cy="602" rx="50" ry="8" fill="url(#water)"/>
<g class="lit" style="--t:.86"><ellipse cx="1060" cy="592" rx="70" ry="30" fill="url(#halo)"/><path d="M1060 600v-26M1052 600c0-12 4-20 8-26M1068 600c0-12-4-20-8-26" stroke="#CFEAF2" stroke-width="1.6" fill="none" opacity=".8"/></g>
<!-- gate posts -->
<rect x="760" y="586" width="14" height="30" fill="#2A303D"/><rect x="1346" y="586" width="14" height="30" fill="#2A303D"/>
${lantern(767, 580, 0.9)}${lantern(1353, 580, 0.9)}
</svg>`;
}
