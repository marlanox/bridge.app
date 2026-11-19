// The home page scroll scene: a modern Los Angeles house at dusk.
// As the visitor scrolls, the inspector "walks" the house: rooms light up one by one,
// then the pool and garden, while the visit log on the right ticks off each check.
// Every lit element reads --t (its start point) against --p (scroll progress 0..1) in CSS.

const win = (x, y, w, h, t, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#141E33"/>` +
  `<g class="lit" style="--t:${t}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#warm)"/>${extra}</g>` +
  `<path d="M${x} ${y}h${w}v${h}H${x}z" fill="none" stroke="#3B4867" stroke-width="2"/>`;

export function landSvg() {
  return `<svg viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 170C170 120 330 132 520 98 700 66 860 112 1040 82 1220 52 1420 88 1600 56V400H0Z" fill="#1A2643"/><path d="M0 250C220 220 420 232 620 226 860 218 1100 230 1320 220 1450 214 1530 218 1600 214V400H0Z" fill="#131D35"/></svg>`;
}

export function sceneSvg() {
  return `<svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
<defs>
  <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DDAA"/><stop offset="1" stop-color="#D9A564"/></linearGradient>
  <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FC1DA"/><stop offset="1" stop-color="#2D7FA0"/></linearGradient>
  <radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F3CF92" stop-opacity=".55"/><stop offset="1" stop-color="#F3CF92" stop-opacity="0"/></radialGradient>
  <linearGradient id="refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9C68C" stop-opacity=".35"/><stop offset="1" stop-color="#E9C68C" stop-opacity="0"/></linearGradient>
</defs>
<g transform="translate(180 0)">
<!-- glow behind the house once rooms are lit -->
<ellipse class="lit" style="--t:.3" cx="860" cy="440" rx="460" ry="150" fill="url(#halo)"/>
<!-- house: lower volume -->
<rect x="560" y="414" width="600" height="112" fill="#222D49"/>
${win(596, 428, 112, 86, .62, '<path d="M612 514v-28h40v28M650 486h22" fill="none" stroke="#B9874C" stroke-width="3"/>')}
${win(716, 428, 92, 86, .1, '<path d="M762 428v12M748 452h28l-6-12h-16z" fill="#B9874C"/>')}
${win(816, 428, 140, 86, .22, '<path d="M836 514v-22h96v22M836 500h96" fill="none" stroke="#B9874C" stroke-width="3"/><circle cx="944" cy="470" r="10" fill="#9E7344"/>')}
${win(964, 428, 160, 86, .34, '<path d="M984 488h60v26M1060 514v-50h40v50" fill="none" stroke="#B9874C" stroke-width="3"/>')}
<rect x="1124" y="428" width="24" height="86" fill="#1B2540"/>
<!-- lower roof slab -->
<rect x="532" y="404" width="652" height="10" fill="#34415F"/>
<!-- upper cantilevered volume -->
<rect x="660" y="318" width="540" height="86" fill="#1D2742"/>
${win(690, 330, 128, 64, .46, '<path d="M716 394v-20h70v20" fill="none" stroke="#B9874C" stroke-width="3"/>')}
${win(826, 330, 170, 64, .54, '<path d="M846 394v-14h130v14M911 346v14" fill="none" stroke="#B9874C" stroke-width="3"/>')}
${win(1004, 330, 168, 64, .7, '<path d="M1030 394v-24h60v24" fill="none" stroke="#B9874C" stroke-width="3"/>')}
<rect x="630" y="306" width="600" height="12" fill="#3A4766"/>
<!-- steps and walkway -->
<path d="M716 526h92v8h-92zM700 534h124v8H700z" fill="#2B3654"/>
<!-- pool with reflection -->
<path d="M430 556h560l-24 30H406z" fill="#12203A"/>
<path class="lit" style="--t:.78" d="M430 556h560l-24 30H406z" fill="url(#pool)"/>
<path class="lit" style="--t:.78" d="M470 566h120M640 574h140M820 566h100" stroke="#B6E4F1" stroke-width="2" opacity=".55"/>
<rect class="lit" style="--t:.4" x="560" y="526" width="600" height="26" fill="url(#refl)"/>
<!-- hedge and garden -->
<rect x="500" y="540" width="720" height="10" fill="#0D1729"/>
<path d="M1160 526c10-30 40-34 52-10 12-24 44-18 46 8z" fill="#0D1729"/>
<path d="M528 526c6-24 32-30 44-8 10-18 30-12 32 8z" fill="#0D1729"/>
<g class="lit" style="--t:.86">
  <circle cx="452" cy="600" r="18" fill="url(#halo)"/><circle cx="452" cy="600" r="2.6" fill="#F6DDAA"/>
  <circle cx="1010" cy="600" r="18" fill="url(#halo)"/><circle cx="1010" cy="600" r="2.6" fill="#F6DDAA"/>
  <circle cx="1240" cy="560" r="22" fill="url(#halo)"/><circle cx="1240" cy="560" r="2.8" fill="#F6DDAA"/>
  <circle cx="540" cy="560" r="22" fill="url(#halo)"/><circle cx="540" cy="560" r="2.8" fill="#F6DDAA"/>
</g>
</g>
<!-- palms, right of the house -->
<g fill="none" stroke="#0A1120" stroke-linecap="round">
  <path d="M1478 604C1474 500 1466 390 1450 250" stroke-width="8"/>
  <path d="M1450 250c-40-14-82-6-112 22M1450 250c-30-30-74-40-110-30M1450 250c4-40 30-66 62-76M1450 250c34-22 78-24 108-6M1450 250c38 0 70 22 86 50M1450 250c-14 34-40 56-70 66" stroke-width="5"/>
  <path d="M1562 606C1560 520 1554 440 1542 350" stroke-width="7"/>
  <path d="M1542 350c-34-10-66-2-90 18M1542 350c-22-24-58-32-88-22M1542 350c6-32 28-52 52-58M1542 350c28-16 62-16 86 0M1542 350c30 2 54 20 66 42" stroke-width="4"/>
  <path d="M640 600C642 540 646 490 654 430" stroke-width="5"/>
  <path d="M654 430c-26-8-52-2-70 14M654 430c-18-18-46-24-68-16M654 430c4-24 20-40 40-44M654 430c22-12 48-12 66 0" stroke-width="3.5"/>
</g>
</svg>`;
}
