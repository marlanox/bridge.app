// Home page hero: a modern hillside house above the lights of Los Angeles.
// Thin cantilevered roof planes, floor-to-ceiling glass in black frames, a dark clad volume,
// a terrace with a glass railing and a pool on the edge of the hill.
// On load the lights come on room by room (--p animates 0 → 1); lit parts read --t against --p.

// Deterministic pseudo-random numbers so the city lights are the same on every build.
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

export function landSvg() {
  const r = rng(7);
  let lights = '';
  for (let i = 0; i < 220; i++) {
    const x = r() * 1600, y = 292 + r() * 70 + (x / 1600) * 10, w = r() > 0.85 ? 3 : 2;
    const t = (0.15 + r() * 0.7).toFixed(2);
    const c = r() > 0.7 ? '#FFFFFF' : '#F4D9A8';
    lights += `<rect class="lit" style="--t:${t}" x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w}" height="2" fill="${c}" opacity=".8"/>`;
  }
  return `<svg viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">
<path d="M0 230C200 214 380 220 560 206 760 190 980 204 1180 194 1360 186 1500 192 1600 188V400H0Z" fill="#132744"/>
<rect x="0" y="286" width="1600" height="114" fill="#0B1629"/>
${lights}
</svg>`;
}

export function sceneSvg() {
  // glass run with black mullions; each pane lights in turn
  const glass = (x0, x1, y, h, n, t0, step, inner = '') => {
    const w = (x1 - x0) / n;
    let o = `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="url(#gl)"/>`;
    for (let i = 0; i < n; i++) o += `<rect class="lit" style="--t:${(t0 + i * step).toFixed(3)}" x="${(x0 + i * w).toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" fill="url(#room)"/>`;
    o += inner;
    for (let i = 1; i < n; i++) o += `<rect x="${(x0 + i * w - 0.8).toFixed(1)}" y="${y}" width="1.6" height="${h}" fill="#0B1220"/>`;
    o += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="none" stroke="#0B1220" stroke-width="2"/>`;
    o += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="url(#sheen)"/>`;
    return o;
  };
  const upperInner = `<g class="lit" style="--t:.5" fill="#5A3E26">
    <rect x="858" y="372" width="70" height="10"/><rect x="852" y="366" width="8" height="16"/>
    <rect x="980" y="366" width="64" height="4"/><rect x="986" y="370" width="3" height="12"/><rect x="1035" y="370" width="3" height="12"/>
    <rect x="1110" y="338" width="44" height="26" fill="#7A5A3A"/>
    <rect x="1190" y="360" width="40" height="22"/></g>
    <g class="lit" style="--t:.52" fill="#FFF3D6"><circle cx="996" cy="344" r="2.5"/><circle cx="1012" cy="344" r="2.5"/><circle cx="1028" cy="344" r="2.5"/></g>`;
  const lowerInner = `<g class="lit" style="--t:.2" fill="#5A3E26">
    <path d="M930 456l70-48h8l-70 48z"/>
    <rect x="1040" y="444" width="96" height="12"/><rect x="1040" y="436" width="14" height="20"/>
    <rect x="1160" y="420" width="28" height="36" fill="#7A5A3A"/></g>`;
  const downlights = [860, 920, 980, 1040, 1100, 1160, 1220, 1280].map((x) => `<g class="lit" style="--t:.62"><circle cx="${x}" cy="322" r="10" fill="url(#halo)"/><rect x="${x - 2}" y="318" width="4" height="2" fill="#FFF0CC"/></g>`).join('');
  const palm = (x, top) => `<path d="M${x} 474C${x + 2} 400 ${x + 6} 300 ${x + 10} ${top}" stroke="#0A1628" stroke-width="5" fill="none" stroke-linecap="round"/><g stroke="#0A1628" stroke-width="3" fill="none" stroke-linecap="round"><path d="M${x + 10} ${top}c-28-8-56-2-76 14M${x + 10} ${top}c-20-20-50-26-72-18M${x + 10} ${top}c4-26 20-44 40-50M${x + 10} ${top}c24-14 52-14 72 0M${x + 10} ${top}c26 2 48 16 58 36"/></g>`;
  return `<svg viewBox="600 150 960 450" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
<defs>
  <linearGradient id="gl" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#3C5276"/><stop offset=".55" stop-color="#22344F"/><stop offset="1" stop-color="#16233A"/></linearGradient>
  <linearGradient id="room" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9E6C2"/><stop offset=".6" stop-color="#EFC88C"/><stop offset="1" stop-color="#D9A86A"/></linearGradient>
  <linearGradient id="sheen" x1="0" y1="0" x2="1" y2=".3"><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".32" stop-color="#fff" stop-opacity=".09"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="slab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4F6F9"/><stop offset="1" stop-color="#C9D1DC"/></linearGradient>
  <linearGradient id="clad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1E2633"/><stop offset="1" stop-color="#151B26"/></linearGradient>
  <radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE2AE" stop-opacity=".7"/><stop offset="1" stop-color="#FFE2AE" stop-opacity="0"/></radialGradient>
  <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F6D7A2" stop-opacity=".22"/><stop offset="1" stop-color="#F6D7A2" stop-opacity="0"/></radialGradient>
  <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9D3E6"/><stop offset="1" stop-color="#6E93B4"/></linearGradient>
</defs>
${palm(1440, 236)}${palm(1484, 270)}
<ellipse class="lit" style="--t:.3" cx="1100" cy="400" rx="420" ry="130" fill="url(#glow)"/>
<!-- hillside: steep slope dropping to the left, house on the crest -->
<path d="M600 600V588C680 576 752 556 810 530 860 508 900 492 960 486L1560 480V600Z" fill="#0B1629"/>
<path d="M600 588C680 576 752 556 810 530 860 508 900 492 960 486L1560 480" stroke="#26406A" stroke-width="1.5" fill="none"/>
<path d="M700 600C740 588 790 566 830 540" stroke="#13233F" stroke-width="10" fill="none" opacity=".7"/>
<!-- stone plinth / retaining wall -->
<rect x="880" y="464" width="560" height="22" fill="#2A3447"/>
<path d="M880 474h560" stroke="#323E54" stroke-width="1"/>
<!-- lower level: glass + dark clad volume -->
${glass(904, 1220, 400, 64, 5, 0.08, 0.05, lowerInner)}
<rect x="1220" y="396" width="200" height="68" fill="url(#clad)"/>
${[1236, 1252, 1268, 1284, 1300, 1316, 1332, 1348, 1364, 1380, 1396].map((x) => `<rect x="${x}" y="396" width="1" height="68" fill="#283244"/>`).join('')}
<rect x="1360" y="410" width="34" height="44" fill="url(#gl)"/><rect class="lit" style="--t:.7" x="1360" y="410" width="34" height="44" fill="url(#room)"/><rect x="1360" y="410" width="34" height="44" fill="none" stroke="#0B1220" stroke-width="2"/>
<!-- floor slab between levels -->
<rect x="884" y="388" width="548" height="9" fill="url(#slab)"/>
<rect x="884" y="397" width="548" height="2" fill="#000" opacity=".25"/>
<!-- upper level cantilevered to the left -->
${glass(836, 1268, 326, 62, 6, 0.36, 0.05, upperInner)}
<rect x="822" y="326" width="14" height="62" fill="#E4E9EF"/><rect x="1268" y="326" width="14" height="62" fill="#E4E9EF"/>
<!-- thin roof plane with deep overhang and wood soffit -->
<rect x="786" y="308" width="540" height="10" fill="url(#slab)"/>
<rect x="792" y="318" width="528" height="5" fill="#7C5A3C"/>
<rect class="lit" style="--t:.6" x="792" y="318" width="528" height="5" fill="#D9A36A"/>
<rect x="786" y="318" width="540" height="1" fill="#000" opacity=".2"/>
${downlights}
<!-- terrace, glass railing, pool on the edge -->
<rect x="840" y="486" width="600" height="6" fill="#C3CBD6"/>
<rect x="872" y="492" width="380" height="9" fill="#1A2B45"/>
<rect class="lit" style="--t:.8" x="872" y="492" width="380" height="9" fill="url(#pool)" opacity=".85"/>
<rect x="840" y="470" width="600" height="16" fill="#fff" opacity=".05"/>
<rect x="840" y="470" width="600" height="1.2" fill="#C3CBD6" opacity=".6"/>
<rect class="lit" style="--t:.4" x="904" y="486" width="316" height="6" fill="#F3D9A8" opacity=".35"/>
<!-- planting -->
<g fill="#0A1628"><ellipse cx="1452" cy="470" rx="30" ry="18"/><ellipse cx="1494" cy="462" rx="24" ry="20"/><ellipse cx="862" cy="480" rx="22" ry="10"/></g>
<g class="lit" style="--t:.86"><circle cx="1446" cy="474" r="24" fill="url(#halo)"/><circle cx="1488" cy="470" r="20" fill="url(#halo)"/></g>
</svg>`;
}
