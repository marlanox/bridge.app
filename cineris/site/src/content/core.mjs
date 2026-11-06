// Core pages of the house.
export const ROLES = [
  ['I', 'The Witness', 'You saw something and said nothing. The Order asks you to say it once, to the right person.', 'Deliver one sentence you have kept for more than a year.'],
  ['II', 'The Ever-Guilty', 'The role nobody wants and everybody remembers. You carry blame that is not yours, gracefully.', 'Grant seven small wishes to seven people who wronged you.'],
  ['III', 'The Keeper', 'You hold a sealed cell for another member. You will never read it. You will know when to hand it over.', 'Keep a sealed envelope for one year without opening it.'],
  ['IV', 'The Heir', 'Something will come to you from a member you have never met. Accept it without asking why.', 'Receive. Then pass one thing you own to a stranger.'],
  ['V', 'The Messenger', 'You carry a letter across the city by hand. You may not mail it, text it or read it.', 'Hand-deliver a letter from the atelier to an address in Los Angeles.'],
  ['VI', 'The Debtor', 'You owe the world something unspecified. You pay it quietly.', 'Pay an anonymous stranger’s debt, bill or tab. Tell no one.'],
  ['VII', 'The Confessor', 'At a closed supper, one guest will tell you something true. You take it to the grave.', 'Attend the supper you are called to. Listen. Never repeat it.'],
  ['VIII', 'The Saint of Small Things', 'You work in the margins: children, animals, the forgotten.', 'Give one full day to a shelter for children or the unhoused.'],
  ['IX', 'The Thief of Hours', 'You take a whole day from someone you love and return it as a gift.', 'Plan one day for another person, from waking to sleep.'],
  ['X', 'The Mourner', 'You carry the ash of a Burning. You attend the next one.', 'Stand witness at the next Burning and bring one object to give up.'],
  ['XI', 'The Stranger', 'You will be seated at a table where no one knows your name.', 'Accept one invitation without asking who else is coming.'],
  ['XII', 'The Sovereign', 'Rare. Drawn perhaps once a year. You choose who is called to the next supper.', 'Name the twelve guests of the next closed supper.']
];

const plate = (segs, cap, shape = 'loop', extra = '') =>
  `<figure class="plate rise"><svg data-chain='${JSON.stringify(segs)}' data-shape="${shape}" ${extra} aria-label="${cap}"></svg><figcaption>${cap}</figcaption></figure>`;

export default function core({ CFG, pieces, codex, journal }) {
  const B = CFG.burning;
  const pages = [];

  /* ======================= HOME ======================= */
  pages.push({
    path: 'index.html',
    title: 'Ordo Cineris — Sterling Silver Chains Bound by Hand on Melrose',
    ogTitle: 'Ordo Cineris · The Order of Ash',
    description: 'Ordo Cineris is a Los Angeles house of handmade 925 sterling silver chains: oxidized Balinese links, micro cameos, rubies, 18k gold rings and reliquary links for hair or a tear. Bound to order on Melrose Avenue.',
    scripts: [],
    body: `
<section class="hero">
  <canvas class="ash" aria-hidden="true"></canvas>
  <div class="wrap">
    <div class="copy">
      <p class="eyebrow">Melrose Avenue · Los Angeles · By appointment</p>
      <h1>Ordo<span class="l2">Cineris</span></h1>
      <p class="lede">The Order of Ash. Heavy sterling chains, darkened by hand, bound link by link for one person at a time. Some of them carry a lock of hair. Some carry ash. All of them carry a message that opens on a date of the giver’s choosing.</p>
      <div class="actions"><a class="btn" href="@/build.html">Build a chain</a><a class="btn ghost" href="@/legend.html">Read the legend</a></div>
      <div class="hero-meta"><span class="label">925 sterling</span><span class="label">Oxidized, never polished bright</span><span class="label">From $${CFG.priceFrom.toLocaleString('en-US')}</span></div>
    </div>
    <figure class="hero-photo"><img src="@/assets/img/photos/worn-crewneck.jpg" alt="A heavy oxidized silver chain with a wing, a serpent, a cameo and garnets, worn over a black sweater" fetchpriority="high"><figcaption class="cap">Worn over black wool · 60 cm</figcaption></figure>
  </div>
</section>

<section class="band manifesto">
  <div class="wrap narrow rise">
    <p>We do not make pendants. A pendant tells the world what to look at.</p>
    <p>Our chains are the whole sentence.</p>
    <p>Ten centimetres of plain cable. Then a cameo the size of a fingernail. Then Balinese links stamped by hand. Then one ring of gold, the only warm thing in the chain.</p>
    <p>Worn on black cashmere, by men and women who do not explain themselves.</p>
  </div>
</section>


<section class="band" aria-labelledby="bench">
  <div class="wrap stack lg">
    <div class="split" style="align-items:end"><div class="stack"><p class="eyebrow">From the bench</p><h2 id="bench">No two chains read the same.</h2></div><p class="rise">A wing that landed on the collarbone. A relic cast from a bone found in the desert. A rough crystal in eight claws. A baroque pearl that grew wrong. Every chain is a different sentence, written once.</p></div>
    <div class="gallery rise">
      <figure class="g-a"><img src="@/assets/img/photos/collar-relics.jpg" alt="Collar of oxidized silver with a wing, claw, bone relic, baroque pearls, cameo and heart" loading="lazy"></figure>
      <figure class="g-b"><img src="@/assets/img/photos/wing-detail.jpg" alt="Hand-chased silver wing link" loading="lazy"></figure>
      <figure class="g-c"><img src="@/assets/img/photos/ruby-crystal-detail.jpg" alt="Garnet, 18k gold ring and rough rock crystal in silver claws" loading="lazy"></figure>
      <figure class="g-d"><img src="@/assets/img/photos/worn-turtleneck.jpg" alt="Silver chain with wing and garnet worn on a black turtleneck" loading="lazy"></figure>
      <figure class="g-e"><img src="@/assets/img/photos/necklace-heart.jpg" alt="Necklace with wing, garnet, cross, gold links, bone relic, cameo and heart" loading="lazy"></figure>
      <figure class="g-f"><img src="@/assets/img/photos/toggle-cameo-detail.jpg" alt="Toggle clasp, Bali bead and cameo in gold bezel" loading="lazy"></figure>
    </div>
    <div class="actions"><a class="btn" href="@/build.html">Compose your own</a><a class="btn ghost" href="@/pieces.html">All chains &amp; artifacts</a></div>
  </div>
</section>
<section class="band" aria-labelledby="anat">
  <div class="wrap">
    <div class="stack" style="margin-bottom:6vh"><p class="eyebrow">Anatomy of a chain</p><h2 id="anat">Read it from the clasp.</h2></div>
    <div class="anatomy">
      <div class="steps">
        <div class="step" data-step="0"><p class="cm">0 cm · The clasp</p><h3>A toggle with a long bar.</h3><p>Cast and hand-chased, the bar half again as long as the ring is wide, so the weight of the chain keeps it closed. The house mark is under the bar.</p></div>
        <div class="step" data-step="1"><p class="cm">3–13 cm · Plain cable</p><h3>Silence first.</h3><p>Forged oval links from 4.2 mm wire. Every chain opens with plain links, so that what follows reads as an event.</p></div>
        <div class="step" data-step="2"><p class="cm">13 cm · The cameo</p><h3>A face the size of a fingernail.</h3><p>Carved shell, 14 mm, set in a granulated bezel. She looks away from the wearer, toward whoever is looking.</p></div>
        <div class="step" data-step="3"><p class="cm">16–23 cm · Balinese links</p><h3>Granulation, the old way.</h3><p>Links stamped and beaded by hand in the manner of the silversmiths of Celuk, then blackened and rubbed back so the high points catch light like wet stone.</p></div>
        <div class="step" data-step="4"><p class="cm">24 cm · 18k gold</p><h3>One warm link.</h3><p>A single ring of solid 18 karat gold. Only one. It is where you put your thumb when you are nervous.</p></div>
        <div class="step" data-step="5"><p class="cm">26–31 cm · Byzantine weave</p><h3>Weight.</h3><p>The densest section. It turns the chain from jewelry into something with mass, so it falls straight on a sweater.</p></div>
        <div class="step" data-step="6"><p class="cm">32 cm · The reliquary</p><h3>A tear, kept.</h3><p>A sealed glass link holding a lock of hair, a tear taken on silk, a line of a letter, or a pinch of earth from a place. We seal it at the bench while you watch.</p></div>
        <div class="step" data-step="7"><p class="cm">Back of the neck · Hallmark &amp; passport</p><h3>Proof, and a door.</h3><p>The 925 tag and the passport plate. The engraved code is the key to the chain’s cell in the Vault.</p></div>
      </div>
      <div class="stage" aria-hidden="true"><svg></svg></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="burn">
  <div class="wrap split">
    ${plate([{ t: 'cable', cm: 8 }, { t: 'ash' }, { t: 'bali', cm: 8 }, { t: 'goldring' }, { t: 'bali', cm: 8 }, { t: 'ruby' }, { t: 'cable', cm: 10 }], `Burning No. ${B.numeral} · ash link`, 'loop', `data-numeral="${B.numeral}"`)}
    <div class="stack lg rise">
      <p class="eyebrow">The Burning · No. ${B.numeral} · ${B.chains} chains</p>
      <h2 id="burn">Something is destroyed so that ten chains can exist.</h2>
      <p>For each numbered edition the house acquires one irreplaceable object and burns it in front of witnesses. Its ash is sealed into a single link in each of ${B.chains} chains. Then the edition closes forever.</p>
      <p>Burning No. ${B.numeral} is <em>${B.title}</em>: a folded note found inside a Victorian mourning locket, marked <em>not to be opened until I am forgiven</em>. We never opened it.</p>
      <p class="label ruby">${B.status}</p>
      <div class="actions"><a class="btn ghost" href="@/burning.html">The Burning</a></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="reliq">
  <div class="wrap split">
    <div class="stack lg rise">
      <p class="eyebrow">The reliquary link</p>
      <h2 id="reliq">Queen Victoria wore Albert’s hair for forty years.</h2>
      <p>When Prince Albert died in December 1861 the Queen went into black and stayed there. She wore lockets and bracelets holding his hair until her own death in 1901, and half of Britain copied her. Mourning jewelry was not morbid. It was a way to keep someone close enough to touch.</p>
      <p>We revive it for the living as well as the dead. Bring a lock of hair, a line from a letter, earth from a place, or a tear. A tear does not keep, so we take it on a thread of silk, let it dry, and seal the silk in glass. It is the only thing on earth that came from that exact moment.</p>
      <div class="actions"><a class="btn ghost" href="@/pieces/reliquary-link.html">The reliquary link</a><a class="btn ghost" href="@/codex/victorian-mourning-jewelry.html">History</a></div>
    </div>
    ${plate([{ t: 'cable', cm: 10 }, { t: 'reliquary', v: 'hair' }, { t: 'bali', cm: 10 }, { t: 'reliquary', v: 'tear' }, { t: 'cable', cm: 12 }], 'Hair and tear, sealed in glass')}
  </div>
</section>

<section class="band" aria-labelledby="vlt">
  <div class="wrap split">
    <div class="terminal rise">
      <p class="label">Present your chain</p>
      <p class="out" id="vault-out-home">Every chain is born with a sealed cell in the Vault. The giver places a message inside (words, a photograph, a film, a proposal) and chooses the day it opens. Until then nobody can read it. Not the wearer. Not us.</p>
      <div class="actions"><a class="btn" href="@/vault.html">Open the Vault</a></div>
    </div>
    <div class="stack lg rise">
      <p class="eyebrow">The Vault</p>
      <h2 id="vlt">A message that waits.</h2>
      <p>A father seals a letter for his daughter that opens on her thirtieth birthday. A man seals a proposal that opens in ninety days, and gives the chain today. Someone seals an accusation. Someone seals a confession to themselves.</p>
      <p>When the wearer presents the passport code, the Vault answers with one sentence: <em>this cell opens in 94 days.</em> That is all. The waiting is part of the gift.</p>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="ord">
  <div class="wrap stack lg">
    <div class="split" style="align-items:end"><div class="stack"><p class="eyebrow">The Order</p><h2 id="ord">You do not choose your role.</h2></div><p class="rise">When your chain is bound you draw a sealed card. It may say Sovereign. It may say Ever-Guilty. Each role carries one mission, entirely voluntary and never sold. Some roles are called, now and then, to a closed supper in Los Angeles.</p></div>
    <div class="grid c4 rise">
      ${ROLES.slice(0, 8).map(([n, name, d]) => `<div class="cell role"><span class="glyph">${n}</span><h3>${name}</h3><p>${d}</p></div>`).join('')}
    </div>
    <div class="actions"><a class="btn ghost" href="@/order.html">All twelve roles</a><a class="btn ghost" href="@/concordance.html">The Concordance</a></div>
  </div>
</section>

<section class="band" aria-labelledby="conc">
  <div class="wrap split">
    ${plate([{ t: 'cable', cm: 10 }, { t: 'goldring' }, { t: 'byzantine', cm: 6 }, { t: 'goldring' }, { t: 'cable', cm: 10 }], 'Two passports, one key')}
    <div class="stack lg rise">
      <p class="eyebrow">The Concordance</p>
      <h2 id="conc">Two chains make a key that neither has alone.</h2>
      <p>Put your passport code beside a friend’s, a lover’s, a brother’s. Together they produce a long key that exists only for that pair. It opens a cell in the Vault that neither of you could open alone: a prediction, an instruction, sometimes an invitation.</p>
      <div class="actions"><a class="btn ghost" href="@/concordance.html">Try a concordance</a></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="price">
  <div class="wrap split" style="align-items:start">
    <div class="stack lg"><p class="eyebrow">What it costs</p><h2 id="price">Silver is priced by weight. Ours is priced by the hour.</h2><p class="rise">Every chain is assembled by hand at the bench on Melrose, for one person. Most take nine to twenty-one days. Because each one is made for one neck and one story, nothing is returned or exchanged.</p></div>
    <div class="table-scroll rise"><table class="price-table">
      <thead><tr><th>Chain</th><th>From</th></tr></thead>
      <tbody>
        <tr><td>The Vigil<br><span class="muted">Plain cable with one artifact</span></td><td class="num">$1,900</td></tr>
        <tr><td>The Reliquary<br><span class="muted">Mixed links, cameo, gold ring, reliquary</span></td><td class="num">$2,500</td></tr>
        <tr><td>The Concordance pair<br><span class="muted">Two chains, one shared key</span></td><td class="num">$4,600</td></tr>
        <tr><td>Burning No. ${B.numeral}<br><span class="muted">Numbered, with ash link. ${B.chains} only</span></td><td class="num">On application</td></tr>
      </tbody>
    </table></div>
  </div>
</section>

<section class="band" aria-labelledby="visit">
  <div class="wrap split">
    <div class="stack lg">
      <p class="eyebrow">The atelier</p>
      <h2 id="visit">A black door on Melrose.</h2>
      <p>We bind chains at the bench in front of you. Bring the hair, the letter, the earth. Bring the person, if they are allowed to know. ${CFG.hours}</p>
      <div class="actions"><a class="btn" href="@/apply.html">Request an audience</a><a class="btn ghost" href="${CFG.mapsUrl}" rel="noopener" target="_blank">Find us on Google Maps</a></div>
    </div>
    <div class="stack rise"><p class="label">House</p><p class="display" style="font-size:var(--step-2)">${CFG.address.street}<br>${CFG.address.city}, ${CFG.address.region} ${CFG.address.zip}</p><p class="mono muted">${CFG.email} · ${CFG.instagram}</p></div>
  </div>
</section>`
  });

  /* ======================= LEGEND ======================= */
  pages.push({
    path: 'legend.html',
    title: 'The Legend of the Order of Ash',
    description: 'How Ordo Cineris began: a Victorian mourning locket from a Melrose flea market, a note that must not be opened, and the first Burning. The legend of a Los Angeles silver house.',
    crumbs: [['Legend', 'legend.html']],
    narrow: true,
    head: `<p class="eyebrow">The legend, as it is told at the bench</p><h1 style="font-size:var(--step-3)">The note that was never opened.</h1><p class="lede">Every house has a story it tells about itself. This is ours. We tell it the same way every time.</p>`,
    body: `<article class="article-body"><div class="wrap narrow prose">
<p>On Sunday mornings the parking lot of a high school on Fairfax turns into a market. Leather jackets, dead people’s china, records nobody wants. Somewhere between a stall of military buttons and a box of keys without locks, the founder of this house bought a Victorian mourning locket for eleven dollars.</p>
<p>It was black enamel over gold, worn thin at the edge where a thumb had rubbed it for decades. Inside, behind a crystal, was a coil of brown hair. Behind the hair, folded to the size of a postage stamp, was a note. On the outside of the note, in brown ink, one line:</p>
<blockquote>Not to be opened until I am forgiven.</blockquote>
<p>Nobody knows who wrote it, who was meant to forgive, or whether they ever did. The founder carried the locket for a year without opening the note. People asked about it. Everyone, without exception, wanted it opened. Nobody, without exception, wanted to be the one to do it.</p>
<h2>The first Burning</h2>
<p>At the end of that year the founder did the only thing that kept the promise and ended the temptation. The note was burned, unread, in a silver dish, in front of nine witnesses. The ash was divided into ten parts and sealed into ten links of glass and blackened silver. Ten chains were built around them. Those were the first chains of the Order.</p>
<p>What was written on the note is now inside ten people, scattered across Los Angeles, none of whom will ever know what it said. That is the whole idea of the house. Some things are worth more sealed.</p>
<h2>Why silver, and why dark</h2>
<p>Polished silver shines like a surgical instrument. We wanted the opposite: metal that looks like it has been held. Every chain is oxidized black and then rubbed back by hand so that the high points glow and the hollows stay dark, the way old church silver looks under candlelight. It is massive, it is quiet, and it gets better as it wears.</p>
<h2>Why chains, and no pendants</h2>
<p>A pendant is a full stop. Our chains are sentences: plain links, then an event, then texture, then a single ring of gold, then weight. You read them with your fingers. Men wear them over black cashmere. Women wear them doubled. Nobody asks what they mean, because it is obvious that you would not say.</p>
<h2>The Order</h2>
<p>The people who wear the first ten chains began, without being asked, to recognise one another. That is how the Order started: not as a club anyone joined, but as a fact. Today each new chain is bound with a passport, a sealed cell in the Vault, and a role drawn from a deck of twelve. There are suppers. There are missions. Most of it is never posted anywhere.</p>
<p>If you are reading this, you have been told about us by someone. That is the only way in.</p>
<div class="actions"><a class="btn" href="@/apply.html">Request an audience</a><a class="btn ghost" href="@/burning.html">The Burning</a></div>
</div></article>`
  });

  /* ======================= BURNING ======================= */
  pages.push({
    path: 'burning.html',
    title: `Burning No. ${B.numeral}: ${B.title}`,
    description: `Burning No. ${B.numeral} is a numbered edition of ${B.chains} handmade sterling silver chains, each holding a link sealed with the ash of one destroyed artifact. Applications only.`,
    crumbs: [['The Burning', 'burning.html']],
    head: `<p class="eyebrow">Numbered editions · ${B.chains} chains each</p><h1 style="font-size:var(--step-3)">The Burning</h1><p class="lede">One irreplaceable object. One fire. ${B.chains} chains that hold what is left. When the last is bound, the edition closes and is never made again.</p>`,
    body: `<section class="band" style="padding-top:0"><div class="wrap split">
${plate([{ t: 'cable', cm: 10 }, { t: 'ash' }, { t: 'bali', cm: 9 }, { t: 'goldring' }, { t: 'byzantine', cm: 5 }, { t: 'cable', cm: 10 }], `Burning No. ${B.numeral}`, 'loop', `data-numeral="${B.numeral}"`)}
<div class="stack lg"><p class="label ruby">${B.status}</p><h2>No. ${B.numeral}: ${B.title}</h2>
<p>A folded note from inside a Victorian mourning locket, inscribed <em>not to be opened until I am forgiven</em>. Burned unread in front of witnesses. Its ash is sealed in the ash link of each chain, engraved with the numeral ${B.numeral} and the chain’s number from 1 to ${B.chains}.</p>
<p>Each Burning chain is built to its owner’s length and order of links, around the ash link. Each carries the passport plate, a Vault cell, and a role from the Order.</p>
<div class="actions"><a class="btn" href="@/apply.html?edition=burning-${B.numeral}">Apply for a Burning chain</a></div></div>
</div></section>
<section class="band"><div class="wrap narrow prose">
<h2>How a Burning works</h2>
<ol>
<li><b>The artifact.</b> The house acquires one object that cannot be replaced: an unsent letter, a wedding photograph, a page of a diary, a contract never signed. Its provenance is recorded and kept in the Vault.</li>
<li><b>The witnesses.</b> The Burning happens at night in the atelier, in front of the members who hold the role of Mourner, and whoever the edition’s first owners invite.</li>
<li><b>The ash.</b> The ash is divided by weight into ${B.chains} equal parts and sealed into glass inside a blackened silver capsule.</li>
<li><b>The ${B.chains} chains.</b> Each owner chooses the rest of their chain in the atelier. The ash link is the only part that is the same in all of them.</li>
<li><b>The close.</b> When the last chain is bound, the edition is closed and announced. No Burning is ever repeated.</li>
</ol>
<h2>Future Burnings</h2>
<p>Members may propose an artifact for a future Burning. Most proposals are declined. The ones that are accepted are usually the ones that were hardest to give up.</p>
</div></section>`
  });

  /* ======================= ATELIER / BUILD ======================= */
  pages.push({
    path: 'build.html',
    title: 'The Atelier: Build a Sterling Silver Chain',
    description: 'Design your own handmade 925 silver chain link by link: heavy cable, Balinese embossed links, Byzantine weave, micro cameo, ruby, 18k gold ring, reliquary link for hair or a tear. Live price and length.',
    crumbs: [['Atelier', 'build.html']],
    scripts: ['atelier.js'],
    head: `<p class="eyebrow">The atelier</p><h1 style="font-size:var(--step-3)">Build a chain.</h1><p class="lede">Read from the clasp. Add lengths of chain and artifacts in the order you want them to fall. The drawing is to scale; the price is real.</p>`,
    body: `<section class="band" style="padding-top:0"><div class="wrap" id="atelier">
<div class="atelier">
  <div class="stack lg" style="min-width:0">
    <ol class="seglist" id="seglist"></ol>
    <div class="stack"><p class="label">Chain</p>
      <div class="addbar">
        <button type="button" data-add="cable">+ Cable</button><button type="button" data-add="bali">+ Balinese</button><button type="button" data-add="byzantine">+ Byzantine</button><button type="button" data-add="paperclip">+ Long link</button>
        </div><p class="label">Artifacts</p><div class="addbar">
        <button type="button" data-add="cameo">+ Cameo</button><button type="button" data-add="ruby">+ Ruby</button><button type="button" data-add="goldring">+ 18k ring</button><button type="button" data-add="reliquary">+ Reliquary</button>
        <button type="button" data-add="wing">+ Wing</button><button type="button" data-add="serpent">+ Serpent</button><button type="button" data-add="relic">+ Bone relic</button><button type="button" data-add="crystal">+ Rock crystal</button>
        <button type="button" data-add="pearl">+ Baroque pearl</button><button type="button" data-add="cross">+ Cross</button><button type="button" data-add="heart">+ Heart</button><button type="button" data-add="bead">+ Bali bead</button><button type="button" data-add="drop">+ Garnet drop</button>
      </div>
      <p class="muted" id="add-msg" aria-live="polite"></p>
      <div class="actions"><button type="button" class="btn small ghost" data-reset>Start again</button></div>
    </div>
    <form class="form" data-form="commission" style="border-top:1px solid var(--line);padding-top:28px">
      <p class="label">Commission this chain</p>
      <div class="row"><div class="field"><label for="c-name">Name</label><input id="c-name" name="name" autocomplete="name" required></div><div class="field"><label for="c-contact">Email or Instagram</label><input id="c-contact" name="contact" required></div></div>
      <div class="field"><label for="c-for">Who is it for?</label><input id="c-for" name="for" placeholder="Myself, a husband, a daughter, someone who must not know yet"></div>
      <div class="field"><label for="c-msg">Anything we should know</label><textarea id="c-msg" name="note" placeholder="Neck size, what you will bring for the reliquary, the date the Vault should open"></textarea></div>
      <p class="muted" style="font-size:.9em">Made to order. A 50% deposit begins the work; the balance is due before delivery. <b>All sales are final: no returns or exchanges.</b> See <a href="@/policies.html">terms</a>.</p>
      <div class="actions"><button class="btn" type="submit">Send commission request</button></div>
      <div class="form-out" aria-live="polite"></div>
    </form>
  </div>
  <div>
    <div class="preview"><svg id="atelier-svg" aria-label="Drawing of your chain"></svg></div>
    <div class="readout">
      <div><span class="label">Length</span><b class="num" id="r-len">–</b><span class="muted mono num" id="r-in"></span></div>
      <div><span class="label">Price</span><b class="num" id="r-price">–</b><span class="muted mono">incl. clasp, hallmark, passport, Vault cell</span></div>
      <div><span class="label">At the bench</span><b class="num" id="r-days">–</b></div>
    </div>
    <p class="muted" id="r-fit" style="padding-top:10px"></p>
    <p class="summary-code" id="r-code"></p>
  </div>
</div>
</div></section>`
  });

  /* ======================= VAULT ======================= */
  pages.push({
    path: 'vault.html',
    title: 'The Vault: Time-Locked Messages Inside Your Chain',
    description: 'Every Ordo Cineris chain has a passport code and a sealed cell in the Vault. Seal a letter, photo, video or proposal that opens only on the date you choose. Present your chain to check your cell.',
    crumbs: [['The Vault', 'vault.html']],
    scripts: ['vault.js'],
    head: `<p class="eyebrow">The Vault</p><h1 style="font-size:var(--step-3)">Present your chain.</h1><p class="lede">The code is engraved on the passport plate beside the clasp. Enter it below. If your cell is sealed, the Vault will tell you only how long you must wait.</p>`,
    body: `<section class="band" style="padding-top:0"><div class="wrap split" style="align-items:start">
<div class="terminal">
  <form id="vault-form" class="stack" autocomplete="off">
    <label class="label" for="vault-code">Passport code</label>
    <div class="inline-form"><input id="vault-code" placeholder="OC-0007-K4M9" spellcheck="false"><button class="btn" type="submit">Open</button></div>
  </form>
  <p class="out" id="vault-out" aria-live="polite">The Vault is listening.</p>
  <div class="stack"><p class="label">Demonstration codes</p><div class="samples"><button type="button" data-target="vault-code">OC-0001-ASHE</button><button type="button" data-target="vault-code">OC-0007-K4M9</button><button type="button" data-target="vault-code">OC-1A2B-3C4D</button></div></div>
</div>
<div class="stack lg prose">
<h2>How a cell is sealed</h2>
<p>When a chain is commissioned as a gift, the giver receives a private link to its cell. Inside they can place text, photographs, a voice note or a film. They choose the date it opens: tomorrow, in ninety days, on a wedding day, on an eighteenth birthday, or never, until a second chain is presented beside it.</p>
<p>The wearer only learns that the cell exists. When they present the code, the Vault answers with the number of days left. Not the content. Not the sender’s name, unless the sender chose to sign.</p>
<h3>What people seal</h3>
<ul><li>A proposal, opened on the anniversary of the first date.</li><li>A father’s letter to a child, opened at eighteen.</li><li>A confession, opened after the giver is gone.</li><li>A note to oneself, opened in one year.</li><li>An accusation. We do not judge what goes in.</li></ul>
<p class="muted">Cells are stored encrypted. The house cannot open a cell early, including for the wearer, the giver or us. Read the <a href="@/policies.html#vault">Vault terms</a>.</p>
</div>
</div></section>`
  });

  /* ======================= ORDER ======================= */
  pages.push({
    path: 'order.html',
    title: 'The Order: Twelve Roles, Missions and Closed Suppers',
    description: 'Every Ordo Cineris chain is bound with a role drawn from a deck of twelve, from the Sovereign to the Ever-Guilty. Each role carries one voluntary mission. Some are called to closed suppers in Los Angeles.',
    crumbs: [['The Order', 'order.html']],
    head: `<p class="eyebrow">The Order</p><h1 style="font-size:var(--step-3)">Twelve roles. You draw one.</h1><p class="lede">At the binding you draw a sealed card from a deck of twelve. Your role is engraved nowhere and written down only in your cell. It can change once a year, at the winter supper.</p>`,
    body: `<section class="band" style="padding-top:0"><div class="wrap stack lg">
<div class="grid c3">${ROLES.map(([n, name, d, m]) => `<div class="cell role"><span class="glyph">${n}</span><h3>${name}</h3><p>${d}</p><p class="mission"><span class="label">Mission</span><br>${m}</p></div>`).join('')}</div>
<div class="wrap narrow prose" style="padding:0">
<h2>The closed suppers</h2>
<p>A few times a year the house sets a long table somewhere in Los Angeles and calls certain roles to it: all the Confessors, or one Sovereign and eleven Strangers. Invitations arrive by hand. They cannot be bought, transferred or requested.</p>
<h2>The fine print, said plainly</h2>
<p>Roles and missions are a game the members play. Every mission is voluntary. Roles have no cash value, are not prizes, and are never sold or offered as a reason to buy. Nobody is ever asked to do anything unsafe, unlawful or against their conscience. Turning a mission down costs nothing.</p>
</div></div></section>`
  });

  /* ======================= CONCORDANCE ======================= */
  pages.push({
    path: 'concordance.html',
    title: 'The Concordance: Two Chains, One Key',
    description: 'Combine the passport codes of two or more Ordo Cineris chains to produce a unique key that opens a shared cell in the Vault: a prediction, an instruction or an invitation.',
    crumbs: [['Concordance', 'concordance.html']],
    scripts: ['vault.js'],
    head: `<p class="eyebrow">The Concordance</p><h1 style="font-size:var(--step-3)">Lay your chains side by side.</h1><p class="lede">Any two passports produce a key that belongs to neither. Three produce another. The cell it opens was written for that combination only.</p>`,
    body: `<section class="band" style="padding-top:0"><div class="wrap split" style="align-items:start">
<form id="conc-form" class="terminal" autocomplete="off">
  <div class="field"><label for="cc-1">First passport</label><input id="cc-1" placeholder="OC-0007-K4M9" spellcheck="false"></div>
  <div class="field"><label for="cc-2">Second passport</label><input id="cc-2" placeholder="OC-0001-ASHE" spellcheck="false"></div>
  <div class="field"><label for="cc-3">Third passport (optional)</label><input id="cc-3" spellcheck="false"></div>
  <div class="actions"><button class="btn" type="submit">Form the key</button></div>
  <p class="out" id="conc-out" aria-live="polite">Two or more codes. Order does not matter.</p>
  <div class="samples"><button type="button" data-target="cc-1">OC-0007-K4M9</button><button type="button" data-target="cc-2">OC-0001-ASHE</button></div>
</form>
<div class="stack lg prose">
<h2>Why people do this</h2>
<p>Couples do it on the night they exchange chains. Brothers do it at a funeral. Strangers at a closed supper do it to find out whether they were meant to meet. The key is calculated from the codes themselves, so the same chains always produce the same key, and no other combination ever will.</p>
<p>Concordance pairs can be commissioned together: two chains bound on the same day, from the same length of silver, with passport codes that belong to each other.</p>
<div class="actions"><a class="btn ghost" href="@/pieces/concordance-pair.html">The Concordance pair</a></div>
</div>
</div></section>`
  });

  /* ======================= VISIT ======================= */
  pages.push({
    path: 'visit.html',
    title: 'Visit the Atelier on Melrose Avenue, Los Angeles',
    description: `Ordo Cineris binds handmade silver chains by appointment at its atelier on Melrose Avenue, Los Angeles. ${CFG.hours} Custom jewelry, reliquary links and fittings.`,
    crumbs: [['Visit', 'visit.html']],
    narrow: true,
    head: `<p class="eyebrow">The atelier · ${CFG.address.city}</p><h1 style="font-size:var(--step-3)">A black door on Melrose.</h1><p class="lede">${CFG.hours}</p>`,
    body: `<article class="article-body"><div class="wrap narrow prose">
<p class="display" style="font-size:var(--step-2)">${CFG.address.street}<br>${CFG.address.city}, ${CFG.address.region} ${CFG.address.zip}</p>
<div class="actions"><a class="btn" href="${CFG.mapsUrl}" target="_blank" rel="noopener">Open in Google Maps</a><a class="btn ghost" href="@/apply.html">Request an audience</a></div>
<h2>What happens at an audience</h2>
<p>An audience lasts about an hour. We lay out lengths of chain on black felt and you hold them, because weight is the whole point and a screen cannot tell you about weight. We measure your neck over the sweater you will wear it with. If you are commissioning a reliquary link, bring what goes inside.</p>
<p>If you are commissioning for someone else, we will help you write the first message for the Vault and choose its date. Some people seal it on the spot.</p>
<h2>The binding</h2>
<p>Most chains are bound in nine to twenty-one days. You may return to watch the final link closed and the reliquary sealed. Many people do.</p>
<h2>From out of town</h2>
<p>We bind for clients outside Los Angeles by video audience. Chains ship insured and signature-required inside a black lacquered case.</p>
</div></article>`
  });

  /* ======================= APPLY ======================= */
  pages.push({
    path: 'apply.html',
    title: 'Request an Audience',
    description: 'Request a private appointment at the Ordo Cineris atelier on Melrose Avenue, Los Angeles, or apply for a numbered Burning chain. Every request is answered by hand.',
    crumbs: [['Request an audience', 'apply.html']],
    narrow: true,
    head: `<p class="eyebrow">By appointment</p><h1 style="font-size:var(--step-3)">Request an audience.</h1><p class="lede">We bind a limited number of chains each month. Tell us who you are and who the chain is for. Every request is read and answered by hand.</p>`,
    body: `<section class="article-body"><div class="wrap narrow">
<form class="form" data-form="audience">
  <div class="row"><div class="field"><label for="a-name">Name</label><input id="a-name" name="name" autocomplete="name" required></div><div class="field"><label for="a-contact">Email or Instagram</label><input id="a-contact" name="contact" required></div></div>
  <div class="row">
    <div class="field"><label for="a-kind">You are asking for</label><select id="a-kind" name="kind"><option>An audience at the atelier</option><option>A video audience</option><option>Burning No. ${B.numeral}</option><option>A Concordance pair</option><option>Press or styling</option></select></div>
    <div class="field"><label for="a-when">When</label><input id="a-when" name="when" placeholder="Any Thursday in December"></div>
  </div>
  <div class="field"><label for="a-ref">Who told you about us?</label><input id="a-ref" name="referred_by" placeholder="A name, a passport code, or the truth"></div>
  <div class="field"><label for="a-why">Who is the chain for, and why now?</label><textarea id="a-why" name="why"></textarea></div>
  <div class="actions"><button class="btn" type="submit">Send request</button></div>
  <div class="form-out" aria-live="polite"></div>
</form>
</div></section>`
  });

  /* ======================= PIECES INDEX ======================= */
  pages.push({
    path: 'pieces.html',
    title: 'Handmade Sterling Silver Chains and Links',
    description: 'The chains and artifacts of Ordo Cineris: The Vigil, The Reliquary, Burning editions, Concordance pairs, micro cameo, ruby bezel, 18k gold ring and reliquary links. 925 silver, made in Los Angeles.',
    crumbs: [['Chains', 'pieces.html']],
    head: `<p class="eyebrow">The chains</p><h1 style="font-size:var(--step-3)">Chains &amp; artifacts</h1><p class="lede">Four chains, and the artifacts you can set into them. Every one is built to order in the atelier.</p>`,
    body: `<section class="band" style="padding-top:0"><div class="wrap"><div class="grid c4">
${pieces.map(x => `<a class="cell" href="@/pieces/${x.slug}.html"><figure class="plate" style="aspect-ratio:1/1">${x.photo ? `<img src="@/assets/img/photos/${x.photo}.jpg" alt="" loading="lazy">` : `<svg data-chain='${JSON.stringify(x.segs)}' data-shape="${x.shape || 'loop'}" data-fixed="${x.fixed === false ? 'false' : 'true'}" aria-hidden="true"></svg>`}</figure><span class="label">${x.kind}</span><h3>${x.name}</h3><p>${x.short}</p><p class="mono num">${x.priceLabel}</p></a>`).join('')}
</div></div></section>`
  });

  /* ======================= CODEX & JOURNAL INDEX ======================= */
  pages.push({
    path: 'codex.html',
    title: 'Codex: Silver, Chains, Cameos and Mourning Jewelry',
    description: 'A reference on sterling silver chains and old jewelry: Balinese granulation, oxidized silver, 925 hallmarks, cameos, rubies, Victorian mourning and hair jewelry, chain lengths for men.',
    crumbs: [['Codex', 'codex.html']],
    narrow: true,
    head: `<p class="eyebrow">Codex</p><h1 style="font-size:var(--step-3)">What we know about silver.</h1><p class="lede">Notes from the bench on materials, techniques and the history we borrow from.</p>`,
    body: `<section class="article-body"><div class="wrap narrow"><ul class="toc-list">${codex.map(x => `<li><a href="@/codex/${x.slug}.html">${x.short || x.title}</a><small>${x.description}</small></li>`).join('')}</ul></div></section>`
  });
  pages.push({
    path: 'journal.html',
    title: 'Journal: Notes from the Atelier',
    description: 'Stories and guides from the Ordo Cineris atelier in Los Angeles: how men wear silver chains, meaningful gifts, time-locked messages, memorial jewelry and custom chains on Melrose.',
    crumbs: [['Journal', 'journal.html']],
    narrow: true,
    head: `<p class="eyebrow">Journal</p><h1 style="font-size:var(--step-3)">Notes from the atelier.</h1>`,
    body: `<section class="article-body"><div class="wrap narrow"><ul class="toc-list">${journal.map(x => `<li><a href="@/journal/${x.slug}.html">${x.short || x.title}</a><small>${x.description}</small></li>`).join('')}</ul></div></section>`
  });

  /* ======================= CARE ======================= */
  pages.push({
    path: 'care.html',
    title: 'Care and Repair of Oxidized Silver',
    description: 'How to care for an oxidized 925 sterling silver chain from Ordo Cineris: what to avoid, why not to use silver dip, lifetime repair of workmanship and re-oxidizing at the atelier.',
    crumbs: [['Care', 'care.html']],
    narrow: true,
    head: `<p class="eyebrow">Care &amp; repair</p><h1 style="font-size:var(--step-3)">Wear it. That is most of the care.</h1>`,
    body: `<article class="article-body"><div class="wrap narrow prose">
<p>Oxidized silver is meant to change. The high points get brighter where they touch skin and cloth; the hollows stay dark. After a year your chain will look like yours and nobody else’s.</p>
<h2>Do</h2><ul><li>Wipe it with a dry, soft cloth if it gets wet or sweaty.</li><li>Store it in the black case, closed, away from air.</li><li>Put it on last and take it off first: after perfume, before sleep.</li></ul>
<h2>Do not</h2><ul><li>Never use silver dip or polishing pastes. They strip the oxidation and the chain will look like hardware.</li><li>Do not swim in chlorine or the sea with it.</li><li>Do not open the reliquary link. It is sealed; opening it breaks the seal and the glass.</li></ul>
<h2>Repair, for life</h2><p>We repair the workmanship of every chain for as long as the house exists: a stretched link, a loose clasp, a cracked capsule. Bring it to Melrose or ship it insured. We re-oxidize and re-burnish on request for a small fee. Lengthening or adding artifacts later is charged as new work.</p>
</div></article>`
  });

  /* ======================= POLICIES ======================= */
  pages.push({
    path: 'policies.html',
    title: 'Terms of Sale and No-Return Policy',
    description: 'Ordo Cineris terms of sale: all chains are made to order, a 50% deposit begins work, and all sales are final with no returns or exchanges. Repairs, Vault terms and the Order, explained plainly.',
    crumbs: [['Terms', 'policies.html']],
    narrow: true,
    head: `<p class="eyebrow">Terms</p><h1 style="font-size:var(--step-3)">Terms of sale</h1><p class="lede"><b>All sales are final. Because every chain is made to order for one person, we do not accept returns or exchanges and do not issue refunds once work has begun.</b></p>`,
    body: `<article class="article-body"><div class="wrap narrow prose">
<h2>Made to order</h2><p>Every chain is assembled by hand after you commission it. A deposit of 50% of the quoted price begins the work. The balance is due before the chain is delivered or collected.</p>
<h2>No returns, no exchanges</h2><p>Because the length, the order of links, the artifacts and anything sealed inside are chosen by you, a chain cannot be resold or remade for anyone else. For that reason <b>we do not accept returns or exchanges, and payments are not refundable once work has begun.</b> You may cancel within 24 hours of paying the deposit, before work starts, for a full refund.</p>
<h2>What we do guarantee</h2><p>Every chain is 925 sterling silver unless described otherwise, and every gold ring is solid 18k. If a chain arrives with a defect in materials or workmanship, we repair or remake it free of charge. We repair workmanship for life (see <a href="@/care.html">care &amp; repair</a>). Nothing here limits any right you have under the law where you live.</p>
<h2>Materials you give us</h2><p>Hair, letters, earth or a tear on silk are sealed at your request. We handle them with care, but the house is not liable for loss of personal material beyond the value of the work. Please keep a portion of anything irreplaceable.</p>
<h2 id="vault">The Vault</h2><p>Each chain includes one Vault cell. Content is stored encrypted and released only on the date set by the person who sealed it. Content must be lawful and must not harm or threaten anyone; we may refuse or remove content that is. If the house ever ceases to operate, we will give at least 90 days’ notice and release every sealed cell to the person who sealed it.</p>
<h2>The Order</h2><p>Roles, missions and suppers are a game played by members. Participation is voluntary and free. Roles are not prizes, have no monetary value, are not transferable, and are not sold. No purchase is necessary to be invited to a supper.</p>
<h2>Shipping</h2><p>Chains ship fully insured with signature required. Customs duties outside the United States are paid by the recipient.</p>
<p class="muted">Questions: ${CFG.email}</p>
</div></article>`
  });

  pages.push({
    path: 'privacy.html',
    title: 'Privacy',
    description: 'How Ordo Cineris handles personal data, commission details and sealed Vault messages.',
    crumbs: [['Privacy', 'privacy.html']],
    narrow: true,
    head: `<p class="eyebrow">Privacy</p><h1 style="font-size:var(--step-3)">What we keep, and what we cannot read.</h1>`,
    body: `<article class="article-body"><div class="wrap narrow prose">
<p>We collect what you give us to make and deliver your chain: your name, how to reach you, your address for shipping, and the details of the commission. We do not sell it and we do not share it except with the carrier who delivers your chain and the payment processor who takes your payment.</p>
<p>Vault cells are encrypted. Until the opening date, their content is not readable by the wearer or by the house. After it opens, only someone presenting the passport code can read it.</p>
<p>This site does not use advertising trackers. If analytics are added, they will be listed here.</p>
<p>California residents may ask what we hold about them and ask us to delete it, at ${CFG.email}. Deleting your data deletes any unopened cell you sealed.</p>
</div></article>`
  });

  /* ======================= FAQ ======================= */
  const FAQ = [
    ['Is it real silver?', 'Yes. Every chain is 925 sterling silver, stamped and tagged with a hallmark. Gold rings are solid 18 karat gold. Rubies are natural. Cameos are carved shell.'],
    ['Can men wear these chains?', 'They were designed first for men: heavy, dark, without a pendant, made to lie on a black sweater. Women wear them too, often doubled. They are unisex by construction.'],
    ['How much does a chain cost?', `From $${CFG.priceFrom.toLocaleString('en-US')}. Most chains are between $2,400 and $4,500 depending on length, links and artifacts. Burning editions are priced on application.`],
    ['How long does it take?', 'Nine to twenty-one days at the bench, depending on how many artifacts the chain carries.'],
    ['Why are there no returns?', 'Every chain is made for one person to a specification they chose, and many hold personal material. It cannot be sold to anyone else, so all sales are final. We repair workmanship for life.'],
    ['Can I put my own hair, or a loved one’s, in the chain?', 'Yes. The reliquary link is a sealed glass capsule for a lock of hair, a tear taken on silk, a line of a letter, or earth from a place. We seal it in front of you.'],
    ['What is the Vault?', 'Each chain has a passport code engraved beside the clasp and a sealed cell online. The giver seals a message inside and chooses the day it opens. Until then the wearer can only see how many days remain.'],
    ['What is the Order?', 'Every chain is bound with a role drawn from a deck of twelve. Roles carry voluntary missions, and some are called to closed suppers. Roles are never sold.'],
    ['Do you ship?', 'Yes, insured and signature-required, in the United States and internationally. Audiences can be held by video.'],
    ['Where are you?', `By appointment on ${CFG.address.street}, ${CFG.address.city}.`]
  ];
  pages.push({
    path: 'faq.html',
    title: 'Questions About Our Silver Chains',
    description: 'Answers about Ordo Cineris chains: real 925 silver, men’s chains, prices, timing, no-return policy, reliquary links with hair, the Vault, the Order, shipping and the Melrose atelier.',
    crumbs: [['Questions', 'faq.html']],
    narrow: true,
    head: `<p class="eyebrow">Questions</p><h1 style="font-size:var(--step-3)">Questions people ask at the door.</h1>`,
    schema: { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    body: `<article class="article-body"><div class="wrap narrow prose">${FAQ.map(([q, a]) => `<h2 style="font-size:var(--step-1)">${q}</h2><p>${a}</p>`).join('')}</div></article>`
  });

  pages.push({
    path: '404.html',
    noindex: true,
    title: 'This Cell Is Empty',
    description: 'The page you asked for does not exist.',
    narrow: true,
    head: `<p class="eyebrow">404</p><h1 style="font-size:var(--step-3)">This cell is empty.</h1><p class="lede">Whatever was here has been burned, or was never sealed.</p><div class="actions"><a class="btn" href="@/index.html">Return to the house</a></div>`,
    body: ''
  });

  return pages;
}
