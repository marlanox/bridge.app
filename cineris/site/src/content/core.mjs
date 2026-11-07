// THE THREE — Fine Jewelry. A private vault; the key is a chain.
import { BASE, LINKS, ARTIFACTS, KEEP, CLASPS, LENGTHS, IN_CELL, STEPS, money } from './pieces.mjs';

let beadId = 0;
// A large resin/glass bead between two silver caps, holding a tear stain or a lock of hair.
export function bead(kind, size = 320, extra = '') {
  const p = 'bd' + (++beadId);
  const inside = kind === 'hair'
    ? `<path d="M138 120 C 170 150, 120 185, 156 214 S 128 280, 164 310 S 140 360, 158 384" fill="none" stroke="#4a2f1d" stroke-width="2.4" opacity=".9"/>
       <path d="M150 118 C 182 150, 132 190, 166 222 S 140 284, 172 316 S 152 362, 166 386" fill="none" stroke="#6b4428" stroke-width="1.6" opacity=".85"/>
       <path d="M128 126 C 158 160, 112 196, 146 226 S 122 290, 154 322" fill="none" stroke="#2f1d12" stroke-width="1.4" opacity=".8"/>`
    : `<rect x="104" y="150" width="116" height="200" rx="4" fill="#efe9dc" transform="rotate(-4 162 250)"/>
       <path d="M150 196 C 196 192, 214 240, 200 276 C 188 310, 140 318, 126 290 C 110 258, 120 200, 150 196 Z" fill="url(#${p}s)" transform="rotate(-4 162 250)"/>
       <path d="M150 196 C 196 192, 214 240, 200 276 C 188 310, 140 318, 126 290 C 110 258, 120 200, 150 196 Z" fill="none" stroke="#5a4c8c" stroke-width="1.4" opacity=".55" transform="rotate(-4 162 250)"/>`;
  return `<svg class="bead" ${extra} viewBox="0 0 324 470" width="${size}" height="${Math.round(size * 470 / 324)}" role="img" aria-label="${kind === 'hair' ? 'A lock of hair sealed in a clear bead' : 'A tear on paper sealed in a clear bead'}">
<defs>
<linearGradient id="${p}ag" x1="0" x2="1"><stop offset="0" stop-color="#1b1b1c"/><stop offset=".22" stop-color="#5c5955"/><stop offset=".46" stop-color="#cfcac0"/><stop offset=".56" stop-color="#efebe2"/><stop offset=".72" stop-color="#6c6863"/><stop offset="1" stop-color="#141415"/></linearGradient>
<radialGradient id="${p}g" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".22"/><stop offset=".5" stop-color="#d9e2ea" stop-opacity=".08"/><stop offset="1" stop-color="#9fb0bf" stop-opacity=".16"/></radialGradient>
<radialGradient id="${p}glass" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#f2f6f9" stop-opacity=".34"/><stop offset=".55" stop-color="#c9d4dd" stop-opacity=".16"/><stop offset="1" stop-color="#e9eff3" stop-opacity=".3"/></radialGradient>
<radialGradient id="${p}s" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#a99bd0" stop-opacity=".35"/><stop offset=".7" stop-color="#7a6cb2" stop-opacity=".6"/><stop offset="1" stop-color="#4a3e86" stop-opacity=".75"/></radialGradient>
</defs>
<ellipse cx="162" cy="24" rx="20" ry="20" fill="none" stroke="url(#${p}ag)" stroke-width="9"/>
<rect x="104" y="44" width="116" height="44" rx="10" fill="url(#${p}ag)"/>
<rect x="112" y="80" width="100" height="10" fill="#0d0d0d" opacity=".55"/>
<path d="M162 86 C 250 120, 262 230, 256 300 C 248 372, 210 402, 162 402 C 114 402, 76 372, 68 300 C 62 230, 74 120, 162 86 Z" fill="url(#${p}glass)" stroke="#eef3f6" stroke-opacity=".7" stroke-width="2.5"/>
<clipPath id="${p}c"><path d="M162 86 C 250 120, 262 230, 256 300 C 248 372, 210 402, 162 402 C 114 402, 76 372, 68 300 C 62 230, 74 120, 162 86 Z"/></clipPath>
<g clip-path="url(#${p}c)">${inside}<rect x="60" y="80" width="210" height="330" fill="url(#${p}g)"/></g>
<path d="M112 140 C 96 190, 94 250, 104 300" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>
<path d="M216 320 C 226 300, 230 276, 230 250" fill="none" stroke="#ffffff" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>
<rect x="128" y="398" width="68" height="26" rx="8" fill="url(#${p}ag)"/>
<ellipse cx="162" cy="446" rx="16" ry="16" fill="none" stroke="url(#${p}ag)" stroke-width="8"/>
</svg>`;
}

export default function core({ CFG, codex, journal }) {
  const F = CFG.founder;
  const img = n => `@/assets/img/photos/${n}.jpg`;
  const pages = [];
  const stepsHtml = `<ol class="steps">${STEPS(CFG.leadTime).map(([t, d], i) => `<li data-reveal><span class="cap dim num">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p class="dim">${d}</p></li>`).join('')}</ol>`;
  const opensDemo = new Date(Date.now() + 94 * 864e5 + 11 * 36e5).toISOString();

  /* ---------------- HOME ---------------- */
  pages.push({
    path: 'index.html',
    title: 'The Three — A Private Vault. The Key Is a Chain.',
    description: `The Three Fine Jewelry, Los Angeles: a private vault cell for one year, and the sterling silver chain that is its only key. Seal a letter, a film, a proposal or a secret; it opens for the one you love when the timer ends. ${money(BASE)}.`,
    body: `
<section class="threshold" aria-label="${CFG.name}">
  <div class="glow"></div>
  <div class="faint" style="background-image:url(${img('necklace-wing')})"></div>
  <div class="shade" style="background-image:url(${img('necklace-wing')})"></div>
  <div class="lit" style="background-image:url(${img('necklace-wing')})"></div>
  <div class="center"><h1 class="sr">The Three — fine jewelry that keeps a tear, a lock of hair and a sealed secret</h1><img class="hero3" src="@/assets/img/three.png" alt=""><p class="cap dim">Fine Jewelry · Los Angeles</p></div>
  <div class="hint"><a class="cap dim" href="#s-legend">Enter</a><button class="cap enter-sound" type="button" data-scroll="#s-legend">Enter with sound</button></div>
</section>

<section class="scene" id="s-legend">
  <div class="words">
    <p class="cap dim">${F.since}</p>
    <p class="line">He left her a chain and a sealed letter.<br>Three words on it: <em>not for one year.</em></p>
  </div>
</section>

${[
  ['wing-detail', 'A wing', '50% 74%'],
  ['cameo-detail', 'A cameo', '50% 50%'],
  ['ruby-crystal-detail', 'Garnet and rock crystal', '50% 40%'],
  ['pearl-detail', 'A pearl that grew wrong', '50% 40%'],
  ['bone-cameo-detail', 'Horn, wrapped in gold', '50% 55%'],
  ['gold-ring-detail', 'One link of gold', '50% 40%'],
  ['toggle-cameo-detail', 'The clasp', '50% 20%']
].map(([ph, name, pos], i) => `<section class="scene jewel ${i % 2 ? 'r' : 'l'}">
  <figure class="media"><img src="${img(ph)}" alt="${name}, oxidized sterling silver" loading="lazy" style="object-position:${pos}"></figure>
  <p class="line small">${name}</p>
</section>`).join('\n')}

<section class="scene">
  <figure class="media worn"><img src="${img('worn-crewneck')}" alt="A chain from The Three worn over black wool" loading="lazy"></figure>
  <p class="line small">For any neck.</p>
</section>

<section class="scene">
  <figure class="media bead-photo"><img src="${img('tear-bead')}" alt="A tear on paper, sealed in clear crystal set in silver prongs" loading="lazy"></figure>
  <p class="line">Your tear, kept forever.</p>
</section>

<section class="scene">
  <figure class="media bead-photo"><img src="${img('hair-bead')}" alt="A lock of hair sealed in clear crystal set in silver prongs" loading="lazy"></figure>
  <p class="line">Their hair, kept forever.</p>
</section>

<section class="scene">
  <div class="words">
    <p class="line">And a secret, sealed for a year.</p>
    <p class="small dim">A letter. A film. A proposal. A confession.</p>
    <p class="tick num dim" data-countdown="${opensDemo}">94 d 11 h 00 m 00 s</p>
  </div>
</section>

<section class="scene">
  <figure class="media whole-key"><img src="${img('necklace-wing')}" alt="The chain, whole" loading="lazy"></figure>
  <p class="line">The chain is the only key.</p>
</section>

<section class="scene last">
  <div class="words">
    <a class="cap" href="@/build.html">Your key · ${money(BASE)}</a>
    <a class="cap dim" href="@/legend.html">The legend</a>
    <a class="cap dim" href="@/tear-hair.html">Tear &amp; hair</a>
  </div>
</section>`
  });

  /* ---------------- CONSTRUCTOR ---------------- */
  pages.push({
    path: 'build.html', title: 'Customize Your Key — Vault Cell and Sterling Silver Chain', crumbs: [['Customize', 'build.html']], scripts: ['chain.js', 'build.js'],
    description: `Compose your key at The Three: choose the length, up to four kinds of links and up to three artifacts, add your tear or a lock of hair, and get a private Vault cell for one year. From ${money(BASE)}. Made by hand in Los Angeles.`,
    body: `<section class="wrap page" id="bld" data-base="${BASE}">
<div class="page-head"><h1 class="title">Customize your key</h1><p class="dim">A cell in the Vault for one year, and the chain that opens it. ${money(BASE)} includes the cell, the chain in your length, one artifact and the clasp. We string the rest ourselves.</p></div>
<div class="builder">
  <div class="tray">
    <div class="tray-arts" id="tray-arts" aria-live="polite"></div>
    <div class="tray-bead" id="tray-bead" hidden><img class="bead-img" data-kind="tear" src="${img('tear-bead')}" alt="Tear bead"><img class="bead-img" data-kind="hair" src="${img('hair-bead')}" alt="Hair bead" hidden><p class="type dim" id="bead-caption"></p></div>
    <div class="tray-links" id="tray-links"></div>
    <p class="type dim" id="tray-sum"></p>
  </div>
  <form class="controls" id="bld-form" autocomplete="off">
    <fieldset class="opt"><legend class="cap">01 · Length</legend>
      <div class="choices">${LENGTHS.map(([cm, add], i) => `<input type="radio" name="len" id="len-${cm}" value="${cm}" data-add="${add}"${i === 2 ? ' checked' : ''}><label for="len-${cm}">${cm} cm${add ? ' +$' + add : ''}</label>`).join('')}</div></fieldset>
    <fieldset class="opt"><legend class="cap">02 · Links <span class="dim">· up to four</span></legend>
      <div class="link-grid">${LINKS.map((l, i) => `<input type="checkbox" name="link" id="lk-${l.id}" value="${l.id}"${i < 2 ? ' checked' : ''}><label for="lk-${l.id}"><svg data-link="${l.id}" aria-hidden="true"></svg><span>${l.name}</span><small>${l.note}</small></label>`).join('')}</div></fieldset>
    <fieldset class="opt"><legend class="cap">03 · Artifacts <span class="dim">· up to three, one included</span></legend>
      <div class="art-grid">${ARTIFACTS.map((a, i) => `<input type="checkbox" name="art" id="ar-${a.id}" value="${a.id}" data-price="${a.price}"${i === 0 ? ' checked' : ''}><label for="ar-${a.id}"><img src="${img(a.photo)}" alt="" style="object-position:${a.pos}" loading="lazy"><span>${a.name}</span><small>${a.note}</small><small class="num">${money(a.price)}</small></label>`).join('')}</div>
      <div class="field stone-color" hidden><label for="stone-color">Stone</label><select id="stone-color" name="stone">${ARTIFACTS.find(a => a.id === 'stone').colors.map(c => `<option>${c}</option>`).join('')}</select></div>
      <p class="note" id="art-msg" aria-live="polite">The most precious one you choose is included.</p></fieldset>
    <fieldset class="opt"><legend class="cap">04 · Clasp</legend>
      <div class="choices">${CLASPS.map((c, i) => `<input type="radio" name="clasp" id="cl-${c.id}" value="${c.id}" data-add="${c.price}"${i === 0 ? ' checked' : ''}><label for="cl-${c.id}">${c.name}${c.price ? ' +$' + c.price : ''}</label>`).join('')}</div></fieldset>
    <fieldset class="opt"><legend class="cap">05 · Inside one bead</legend>
      <div class="choices">${KEEP.map((k, i) => `<input type="radio" name="keep" id="kp-${k.id || 'none'}" value="${k.id}" data-add="${k.price}"${i === 0 ? ' checked' : ''}><label for="kp-${k.id || 'none'}">${k.name}${k.price ? ' +$' + k.price : ''}</label>`).join('')}</div>
      <p class="note">Here will be your tear, or the hair of the one you love. Sealed into one bead of the chain. <a href="@/tear-hair.html">How it is done</a>.</p></fieldset>
    <fieldset class="opt"><legend class="cap">06 · The cell</legend>
      <p>One sealed cell in the Vault for one year, with a timer. You seal it after the deposit, with the code we send you. <a href="@/vault.html">How the Vault works</a>.</p></fieldset>
    <div class="total"><span class="cap">Total</span><span class="num price" id="b-total">${money(BASE)}</span></div>
    <div class="total" style="padding-top:0;border:0"><span class="cap dim">Deposit today, 50%</span><span class="num dim" id="b-dep">${money(BASE / 2)}</span></div>
    <button class="btn full" type="button" id="b-order">Order</button>
    <ul class="facts cap dim"><li>Made by hand · ${CFG.leadTime}</li><li>50% deposit · balance before shipping</li><li>Final sale · no returns</li><li>Insured worldwide delivery</li></ul>
  </form>
</div>
<form class="form order-form" data-form="order" id="order-form" hidden>
  <p class="cap">Your key</p>
  <input type="hidden" name="key">
  <p class="type dim" id="order-sum"></p>
  <div class="field"><label for="o-name">Name</label><input id="o-name" name="name" autocomplete="name" required></div>
  <div class="field"><label for="o-contact">Email or Instagram</label><input id="o-contact" name="contact" required></div>
  <div class="field"><label for="o-ship">Ships to (city, country)</label><input id="o-ship" name="ship_to"></div>
  <div class="field"><label for="o-note">Note</label><textarea id="o-note" name="note"></textarea></div>
  <button class="btn" type="submit">Send</button>
  <p class="note">We reply within two days with the deposit invoice and your cell. Nothing is charged until you pay it.</p>
  <div class="form-out" aria-live="polite"></div>
</form>
</section>`
  });


  /* ---------------- TEAR & HAIR ---------------- */
  pages.push({
    path: 'tear-hair.html', title: 'Tear and Hair — Kept in a Silver Bead', crumbs: [['Tear & Hair', 'tear-hair.html']],
    description: 'How The Three keeps a tear or a lock of hair inside a sterling silver chain: a tear on blotting paper sealed in clear resin, or a lock of hair sealed in glass, set as one bead. Step by step.',
    body: `<section class="wrap page">
<div class="page-head"><h1 class="title">Tear &amp; Hair</h1><p class="lead">One bead of your chain can hold a tear, or the hair of the one you love. It stays there for life.</p></div>
<div class="keep-two">
  <article class="keep">
    <div class="bead-stage"><img class="bead-img" src="${img('tear-bead')}" alt="A tear sealed in resin, in a silver bead" loading="lazy"></div>
    <p class="cap dim">A tear · +${money(450)}</p>
    <ol class="plain num-list">
      <li>We send you a small black envelope with a square of blotting paper.</li>
      <li>You let one tear fall on it. Where it lands, the paper changes colour.</li>
      <li>You send it back in the envelope we included.</li>
      <li>We cut the stained paper and seal it in clear resin inside a silver bead.</li>
      <li>The bead becomes one link of your chain.</li>
    </ol>
  </article>
  <article class="keep">
    <div class="bead-stage"><img class="bead-img" src="${img('hair-bead')}" alt="A lock of hair sealed in glass, in a silver bead" loading="lazy"></div>
    <p class="cap dim">A lock of hair · +${money(560)}</p>
    <ol class="plain num-list">
      <li>Cut a lock about 5 cm long and as thick as a pencil. Tie one end with thread first.</li>
      <li>Put it in the envelope we send you, or bring it to us.</li>
      <li>We seal it in clear glass between two silver caps.</li>
      <li>The bead becomes one link of your chain.</li>
    </ol>
    <p class="note">Keep a portion of anything irreplaceable.</p>
  </article>
</div>
<p style="margin-top:60px"><a class="btn" href="@/build.html">Customize your key</a></p>
</section>`
  });

  /* ---------------- LEGEND ---------------- */
  const chapters = [
    ['I', 'The letter', `In the winter of ${F.since}, ${F.name} had a jewelry house called Revenge, and a man who wore the first chain she ever made. The night he left, he took the chain off, wrapped it around a sealed envelope and closed her hand over both. On the envelope he had written three words. <em>Not for one year.</em>`],
    ['II', 'The year', 'She did not open it. She wore his chain instead, under her collar, every day for three hundred and sixty-five days. It was too long for her and too heavy, and she never took it off. She trained in France. She walked into ten years of fashion weeks. She made clothes for strangers. The envelope stayed shut.'],
    ['III', 'Three sentences', 'On the last night of the year she opened it. Inside were three sentences. She has never told anyone what they were. She says only that after them, revenge was impossible.'],
    ['IV', 'The Three', 'She closed Revenge. She kept the chain. Everything she has made since carries the name of that night: The Three. First the clothes. Then the silver.'],
    ['V', 'The Vault', 'From that night the house keeps letters for other people. A cell for one year, because she waited a year, and that was enough. And a chain for a key, because that is what he gave her.'],
    ['VI', 'The key', 'Every chain is cut from his: a man’s chain, worn by whoever it was given to. That is why ours belong to no one gender. Behind its code, a letter no one can read before its day. Not the one who wears it. Not the one who sent it. Not us.']
  ];
  pages.push({
    path: 'legend.html', title: 'The Legend of The Three', crumbs: [['Legend', 'legend.html']],
    description: `The legend of The Three: in ${F.since} a man left ${F.name} a chain and a sealed letter marked "not for one year". She waited. Inside were three sentences. Now the house keeps letters in a vault, and a chain is the only key.`,
    body: `<section class="wrap page">
<div class="page-head"><h1 class="title">The Legend</h1></div>
<ol class="timeline">${chapters.map(([n, t, d]) => `<li data-reveal><span class="cap dim">${n}</span><div style="display:grid;gap:12px"><h3>${t}</h3><p class="it">${d}</p></div></li>`).join('')}</ol>
<div class="quiet" style="min-height:50svh"><div class="intro" data-reveal><p class="it big">You will understand the three sentences when your own cell opens.</p><a class="btn" href="@/build.html">Customize your key</a></div></div>
</section>`
  });

  /* ---------------- VAULT: open ---------------- */
  pages.push({
    path: 'vault.html', title: 'The Vault — Open a Cell With Your Key', crumbs: [['Vault', 'vault.html']], scripts: ['vault.js'],
    description: 'The Vault of The Three: every cell has a timer and one key, a chain engraved with its code. Enter the code to open the cell when its time has come.',
    body: `<section class="wrap page"><div class="vault">
<h1 class="title">The Vault</h1>
<p class="lead">Buy a cell. Give the key.</p>
<ol class="thesis compact">
    <li data-reveal><span class="cap dim">01</span><h3>You fill a cell</h3><p class="dim">A letter, a film, a photograph, a proposal, a confession, a secret. Online, after your order. Confidential.</p></li>
    <li data-reveal><span class="cap dim">02</span><h3>You give the key</h3><p class="dim">A chain made by hand for them. The cell's code is engraved by its clasp. Without the chain, the cell does not open.</p></li>
    <li data-reveal><span class="cap dim">03</span><h3>They open it on the day</h3><p class="dim">When the timer ends, up to a year later, they enter the code and the cell opens. Not one day before. Not for us.</p></li>
  </ol>
<p class="dim">A cell holds up to 5,000 words and one photograph or film of up to 50 MB. It is sold only with its key, and only by us: ${money(BASE)} for the cell for one year and the chain.</p>
<h2 class="title" style="margin-top:40px">Open with your key</h2>
<form id="vault-form" autocomplete="off" class="field"><label for="vault-code">The code by the clasp</label><div class="inline"><input id="vault-code" placeholder="TT-0007-K4M9" spellcheck="false"><button class="btn" type="submit">Open</button></div></form>
<div class="out" id="vault-out" aria-live="polite">&nbsp;</div>
<div class="samples"><span class="cap dim">Try</span><button type="button" data-target="vault-code">TT-0001-ASHE</button><button type="button" data-target="vault-code">TT-0007-K4M9</button></div>
<p class="cap" style="margin-top:40px"><a href="@/seal.html">Seal your cell</a> · <a href="@/build.html">Get a key</a></p>
<p class="note">Confidential. The Vault is not a legal will; it keeps words, not property.</p>
<p class="note mode-note"></p>
</div></section>`
  });

  /* ---------------- VAULT: seal ---------------- */
  pages.push({
    path: 'seal.html', title: 'Seal Your Cell in the Vault', crumbs: [['Vault', 'vault.html'], ['Seal', 'seal.html']], scripts: ['vault.js'],
    description: 'Seal your cell in the Vault of The Three: a letter, a photograph or a film, opened only by the key when its timer ends, up to one year. You need the code from your order.',
    body: `<section class="wrap page"><div class="vault">
<h1 class="title">Seal your cell</h1>
<p class="dim">You need the code we sent with your order. What you seal here cannot be read before its timer ends. Not by the one who holds the key, not by you, not by us. You cannot change it afterwards.</p>
<form id="seal-form" class="form" autocomplete="off">
  <div class="field"><label for="s-code">Code</label><input id="s-code" name="code" placeholder="TT-0000-XXXX" required spellcheck="false" style="letter-spacing:.2em;text-transform:uppercase"></div>
  <div class="field"><label for="s-from">From (leave empty to stay anonymous)</label><input id="s-from" name="from" maxlength="80"></div>
  <div class="field"><label for="s-text">What you could not say yet</label><textarea id="s-text" name="text" maxlength="5000" required style="min-height:12em"></textarea></div>
  <div class="field"><label for="s-file">A photograph or a film (optional, up to 50 MB)</label><input id="s-file" name="file" type="file" accept="image/*,video/*"></div>
  <div class="field"><label for="s-date">The timer ends on</label><input id="s-date" name="opens" type="date" required></div>
  <div class="field"><label for="s-notify">Email to tell on the day (optional)</label><input id="s-notify" name="notify" type="email"></div>
  <label class="check"><input type="checkbox" id="s-ok" required> I understand this cell cannot be opened early or changed.</label>
  <button class="btn" type="submit">Seal</button>
  <div class="out" id="seal-out" aria-live="polite"></div>
  <p class="note mode-note"></p>
</form>
</div></section>`
  });

  /* ---------------- CONTACT ---------------- */
  pages.push({
    path: 'contact.html', title: 'Contact', crumbs: [['Contact', 'contact.html']],
    description: `Contact The Three Fine Jewelry, ${CFG.city}, California. Keys, cells, private requests, press.`,
    body: `<section class="wrap page"><div class="vault">
<h1 class="title">Contact</h1>
<p class="dim">Studio in ${CFG.city}. Online, by order. Worldwide delivery.</p>
<p class="cap">${CFG.email}<br><a href="${CFG.instagramUrl}" target="_blank" rel="noopener">${CFG.instagram}</a></p>
<form class="form" data-form="contact">
  <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" autocomplete="name" required></div>
  <div class="field"><label for="c-contact">Email or Instagram</label><input id="c-contact" name="contact" required></div>
  <div class="field"><label for="c-note">Message</label><textarea id="c-note" name="note"></textarea></div>
  <button class="btn" type="submit">Send</button>
  <div class="form-out" aria-live="polite"></div>
</form>
</div></section>`
  });

  /* ---------------- TEXT PAGES ---------------- */
  const prose = (path, title, description, html, h1 = title) => ({ path, title, description, crumbs: [[h1, path]], body: `<section class="wrap page"><div class="page-head"><h1 class="title">${h1}</h1></div><article class="prose">${html}</article></section>` });
  const list = (path, title, items, dir, description) => ({ path, title, description, crumbs: [[title, path]], body: `<section class="wrap page"><div class="page-head"><h1 class="title">${title}</h1></div><ul class="list">${items.map(x => `<li><a href="@/${dir}/${x.slug}.html"><span class="cap">${x.short || x.title}</span><small>${x.description}</small></a></li>`).join('')}</ul></section>` });
  pages.push(list('journal.html', 'Journal', journal, 'journal', 'The Three journal: sealed messages, time-capsule jewelry, proposals, memorial jewelry with hair, gifts, how to wear a sterling silver chain.'));
  pages.push(list('codex.html', 'Codex', codex, 'codex', 'The Three codex: oxidized silver, 925 hallmarks, chain lengths, Byzantine and Balinese chains, cameos, Victorian hair jewelry and tear bottles.'));
  pages.push(prose('terms.html', 'Terms of Sale', `The Three terms: ${money(BASE)} for a Vault cell for one year and the chain that is its key, 50% deposit, made by hand, final sale, confidentiality, cells issued only with a chain.`,
    `<p><b>All sales are final. Every key is made to order for one person; we do not accept returns or exchanges, and payments are not refundable once work has begun.</b></p>
<h2>What you buy</h2><p>A sealed cell in the Vault for one year from delivery, and the chain that is its only key. Cells and codes are issued only by The Three and only with a chain.</p>
<h2>Deposit</h2><p>A 50% deposit begins the work and issues your code. The balance is due before shipping. You may cancel within 24 hours of the deposit, before work starts, for a full refund.</p>
<h2>Making</h2><p>Made by hand in Los Angeles in ${CFG.leadTime}. We choose and string the connecting chain to your length.</p>
<h2>Materials</h2><p>925 sterling silver, oxidized by hand; solid 18k gold; natural stones. Defects are repaired or remade free of charge; workmanship is repaired for life. Nothing here limits your rights under the law where you live.</p>
<h2>The Vault</h2><p>Contents are confidential and stored encrypted; we do not read, share or release them before the timer ends. Contents must be lawful. The Vault is not a legal will and does not transfer property. If the house ever closes, sealed cells are released to their senders with 90 days’ notice.</p>
<h2>Delivery</h2><p>Insured, signature on delivery, worldwide. Duties outside the United States are paid by the recipient.</p>`));
  pages.push(prose('privacy.html', 'Privacy', 'How The Three handles personal data and sealed cells.',
    `<p>We keep what we need to make and deliver your key. We do not sell it. Sealed cells are encrypted and unreadable until their timer ends. California residents may request access or deletion at ${CFG.email}.</p>`));
  pages.push(prose('care.html', 'Care of Oxidized Silver', 'How to care for oxidized sterling silver: a dry cloth, never silver dip. Lifetime repair of workmanship.',
    `<p>A dry cloth. Never silver dip or polish: they remove the black. Keep it closed in its box. The silver brightens where it touches you; that is intended. Workmanship is repaired for life.</p>`, 'Care'));
  const FAQ = [
    ['What am I buying?', `A private cell in our Vault for one year, and the only key to it: a sterling silver chain made by hand, with the cell's code engraved by the clasp. ${money(BASE)}.`],
    ['What can I put in the cell?', 'A letter, a film, a photograph, a voice, a proposal, a confession of love, a last wish, an apology, a secret. Up to 5,000 words of text and one file of up to 50 MB.'],
    ['Who can open it, and when?', 'Only whoever holds the key, and only when the timer you set has ended, up to one year. Not before. Not you, not us.'],
    ['Is it confidential?', 'Yes. Contents are encrypted. We cannot read them, share them or open them early.'],
    ['Can I buy only a cell?', 'No. Cells and codes are issued only with a chain. The chain is the key.'],
    ['How do I order?', 'Compose your key and press Order. We reply within two days with an invoice for a 50% deposit and your code. You seal the cell; we make the chain; the balance is paid before shipping.'],
    ['How long does it take?', `${CFG.leadTime}. Every key is made by hand in Los Angeles.`],
    ['Can I return it?', 'No. Every key is made to order, so all sales are final. Defects are repaired or remade; workmanship is repaired for life.'],
    ['Can I add a tear or hair?', 'Yes: a tear on paper sealed in resin, or a lock of hair sealed in glass, as one bead of the chain.'],
    ['Is it a will?', 'No. The Vault keeps words, not property. For an estate, see a lawyer.'],
    ['Is silver fine jewelry?', 'Yes. Sterling silver is a precious metal; our keys add solid 18k gold and natural stones and are made by hand.']
  ];
  pages.push({ ...prose('faq.html', 'Questions — The Vault, the Key, Price, Timing', 'The Three questions: what you buy, what goes in a Vault cell, who can open it and when, confidentiality, ordering, deposit, timing, final sale, tear and hair beads.', FAQ.map(([q, a]) => `<h2>${q}</h2><p>${a}</p>`).join(''), 'Questions'),
    schema: { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) } });
  pages.push({ path: '404.html', noindex: true, title: 'Nothing here', description: 'Not found.', body: `<section class="quiet" style="min-height:100svh"><a class="cap" href="@/index.html">The Three</a></section>` });

  // Product structured data for the key, attached to the constructor page
  pages.find(p => p.path === 'build.html').schema = { '@type': 'Product', name: 'The Three Key — Vault cell for one year and sterling silver chain', description: 'A private Vault cell for one year and the sterling silver chain that is its only key, composed by you and made by hand in Los Angeles.', brand: { '@type': 'Brand', name: CFG.name }, material: '925 sterling silver', image: `${CFG.url}/assets/img/photos/necklace-wing.jpg`,
    offers: { '@type': 'Offer', price: BASE, priceCurrency: 'USD', availability: 'https://schema.org/MadeToOrder', url: `${CFG.url}/build.html`, hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'US', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' } } };
  return pages;
}
