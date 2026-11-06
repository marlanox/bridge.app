// The chains and objects. Each becomes /pieces/<slug>.html with Product structured data.
// House grammar: Silence → the Break (Ash Link) → Weight → Silence → one object (two at most).
const SPEC = `<li>925 sterling silver, oxidized and hand-burnished</li><li>Fine 2.4 mm cable and hand-forged 11 mm ovals</li><li>The Ash Link: matte black oval, silver rim, solid 18k gold rivet</li><li>Hand-chased toggle clasp, 925 hallmark tag, engraved passport plate</li><li>One Vault cell, one role in the Order</li><li>45 to 70 cm, built to your measurement; weight worn on the left</li>`;
const P = [
  {
    slug: 'vigil-chain', name: 'The Vigil', kind: 'Chain', price: 1800, priceLabel: 'From $1,800',
    segs: [{ t: 'cable', cm: 16 }, { t: 'ashlink' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 16 }],
    short: 'Silence, the Break, weight. Nothing else. The purest form of the house.',
    desc: 'The Vigil: a handmade 925 sterling silver chain that turns from fine cable to hand-forged weight at the signature black Ash Link with an 18k gold rivet. Unisex, made in Los Angeles.',
    body: `<p>The Vigil is the house with nothing added. Fine chain, the black Ash Link with its single gold rivet, and then ten centimetres of hand-forged weight on the left side. It is the chain people layer next to a diamond tennis necklace, wear under an open collar, and stop taking off.</p><h2>Specification</h2><ul>${SPEC}</ul>`
  },
  {
    slug: 'amulet-chain', name: 'The Amulet', kind: 'Chain', price: 2400, priceLabel: 'From $2,400',
    segs: [{ t: 'cable', cm: 14 }, { t: 'ashlink' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 10 }, { t: 'ruby' }, { t: 'cable', cm: 12 }],
    short: 'The Vigil with one object of your choosing: a ruby, a cameo, a baroque pearl, rock crystal.',
    desc: 'The Amulet: a handmade sterling silver chain with the signature Ash Link, hand-forged weight and one object, such as a natural ruby, micro cameo, baroque pearl or rock crystal.',
    body: `<p>One object, placed in the silence after the weight, on the opposite side of the neck. It balances the chain the way a single ring balances a hand. Most members choose a ruby; some choose an object that came from their family.</p><h2>Specification</h2><ul>${SPEC}<li>One object from the atelier, or one you bring</li></ul>`
  },
  {
    slug: 'old-diamond-chain', name: 'The Old Diamond', kind: 'Chain', price: 2800, priceLabel: 'From $2,800',
    segs: [{ t: 'cable', cm: 14 }, { t: 'ashlink' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 10 }, { t: 'diamond' }, { t: 'cable', cm: 12 }],
    short: 'An antique old-cut diamond, set in blackened silver, on the house chain.',
    desc: 'A handmade sterling silver chain with the signature Ash Link and an antique old-mine cut diamond set in blackened silver. Made to order on Melrose Avenue, Los Angeles.',
    body: `<p>An old-mine diamond was cut by hand, by candlelight, before electric polishing wheels. It has a high crown, a small table and a soft, broken sparkle that modern stones do not have. We set one, around a third of a carat, in a closed bezel of blackened silver, so it glints out of darkness.</p><p>It is the chain for people who already own diamonds and want one that nobody else has. <a href="@/journal/silver-with-diamonds.html">Wearing silver with diamonds</a>.</p><h2>Specification</h2><ul>${SPEC}<li>Antique old-mine or old-European cut diamond, ~0.3 ct, with its origin noted in your Vault cell</li></ul>`
  },
  {
    slug: 'reliquary-chain', name: 'The Reliquary', kind: 'Chain', price: 2400, priceLabel: 'From $2,400',
    segs: [{ t: 'cable', cm: 12 }, { t: 'ashlink' }, { t: 'forged', cm: 8 }, { t: 'cable', cm: 10 }, { t: 'reliquary', v: 'hair' }, { t: 'cable', cm: 12 }],
    short: 'The house chain with a sealed glass capsule: a lock of hair, a tear on silk, a line of a letter.',
    desc: 'A handmade sterling silver chain with the signature Ash Link and a sealed reliquary capsule holding a lock of hair, a tear on silk, a line of a letter or earth from a place.',
    body: `<p>The object here is not bought. It is brought. A lock of someone’s hair, a tear taken on silk, a line cut from a letter, earth from a place. We seal it in glass between two silver caps while you watch. See the <a href="@/pieces/reliquary-link.html">reliquary capsule</a>.</p><h2>Specification</h2><ul>${SPEC}<li>Borosilicate glass capsule with silver caps, sealed at the bench</li></ul>`
  },
  {
    slug: 'burning-chain', name: 'Burning No. I', kind: 'Numbered edition', price: null, priceLabel: 'On application',
    segs: [{ t: 'cable', cm: 14 }, { t: 'ash' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 16 }],
    short: 'Ten chains whose Ash Link holds real ash, from one artifact burned unread. Never repeated.',
    desc: 'Burning No. I: a numbered edition of ten handmade sterling silver chains whose Ash Link holds the ash of one destroyed artifact. Never repeated.',
    body: `<p>In a Burning chain the Ash Link is literal. Behind its gold rivet is a sealed chamber holding one tenth of the ash of a single destroyed object, and the link is engraved with the edition numeral and its number from 1 to 10. When ten are bound, the edition closes. <a href="@/burning.html">Read about the Burning</a>.</p><h2>Specification</h2><ul>${SPEC}<li>Ash Link with sealed ash chamber, numbered 1–10</li><li>Certificate of provenance of the artifact, held in your Vault cell</li></ul>`
  },
  {
    slug: 'concordance-pair', name: 'The Concordance Pair', kind: 'Two chains', price: 4600, priceLabel: 'From $4,600 the pair',
    segs: [{ t: 'cable', cm: 14 }, { t: 'ashlink' }, { t: 'byzantine', cm: 8 }, { t: 'cable', cm: 12 }, { t: 'goldring' }, { t: 'cable', cm: 8 }],
    short: 'Two chains bound on the same day from the same silver. One wears the weight on the left, one on the right.',
    desc: 'Two handmade sterling silver chains bound together from the same silver, mirrored so the weight falls left on one and right on the other, with paired passports that open a shared Vault cell.',
    body: `<p>The only time the house breaks its own rule. A Concordance pair is mirrored: one chain carries its weight on the left, the other on the right, so that standing side by side the two Breaks face each other. Their passports form a <a href="@/concordance.html">Concordance</a> key that opens a cell sealed for the two of you.</p><h2>Specification</h2><ul>${SPEC}<li>Two chains, mirrored; paired passport plates and a shared Vault cell</li></ul>`
  },
  {
    slug: 'ash-link', name: 'The Ash Link', kind: 'Signature', price: null, priceLabel: 'In every chain',
    segs: [{ t: 'cable', cm: 4 }, { t: 'ashlink' }, { t: 'forged', cm: 4 }], shape: 'line', fixed: false,
    short: 'A matte black oval, a silver rim, one 18k gold rivet. Exactly one in every chain.',
    desc: 'The Ash Link is the signature of Ordo Cineris: a matte black oval link with a silver rim and a single 18k gold rivet, placed at the Break where fine chain becomes hand-forged weight.',
    body: `<p>Every house needs a mark that can be read from across a room without a logo. Ours is a link. The Ash Link is a solid sterling oval, blackened to a deep matte, framed by a polished silver rim and pierced at its centre by one rivet of solid 18k gold.</p><p>It is placed at the Break, where 2.4 mm fine chain ends and hand-forged weight begins. There is exactly one in every chain we make. It is never sold separately, and never made for anyone else.</p><p>The name comes from the first Burning, when ash was sealed behind the gold rivets of the first ten chains. <a href="@/legend.html">The legend</a>.</p>`
  },
  {
    slug: 'forged-link', name: 'Forged Weight', kind: 'Section', price: null, priceLabel: '$70 per cm',
    segs: [{ t: 'forged', cm: 10 }], shape: 'line', fixed: false,
    short: 'Hand-forged 11 mm ovals, hammered on the anvil. The weight in every chain.',
    desc: 'Hand-forged sterling silver oval links, 11 mm, hammered flat on the anvil and blackened: the weighted section of every Ordo Cineris chain.',
    body: `<p>Each oval is forged from heavy sterling wire, closed and soldered, then hammered on the anvil so its faces flatten and catch light in facets. After blackening, the hammer marks read as a texture you can feel with a thumb. Ten centimetres weighs about as much as a whole fine chain.</p><p>We use it in one section of each chain, never more than two, always on the left. <a href="@/journal/the-break.html">Why</a>.</p>`
  },
  {
    slug: 'old-diamond-link', name: 'Old-Cut Diamond', kind: 'Object', price: 980, priceLabel: '$980 as an object',
    segs: [{ t: 'cable', cm: 4 }, { t: 'diamond' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'An antique old-mine diamond, about a third of a carat, set in blackened silver.',
    desc: 'An antique old-mine cut diamond, about 0.3 ct, in a closed bezel of blackened sterling silver, built into a handmade chain as a single object.',
    body: `<p>Old-mine and old-European cuts were cut by hand before the twentieth century. We source them from estate jewelry, record what we know of each stone’s history in its Vault cell, and set it in a closed bezel of blackened silver so it glints out of darkness. <a href="@/journal/silver-with-diamonds.html">On silver and diamonds</a>.</p>`
  },
  {
    slug: 'ruby-bezel-link', photo: 'ruby-crystal-detail', name: 'Ruby in Bezel', kind: 'Object', price: 600, priceLabel: '$600 as an object',
    segs: [{ t: 'cable', cm: 4 }, { t: 'ruby' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'A natural ruby of about 0.4 carat in a closed silver bezel. The only red thing on you.',
    desc: 'A natural ruby, about 0.4 ct, set in a closed oxidized sterling silver bezel and built into a handmade chain. A single drop of red in dark silver.',
    body: `<p>One natural ruby, roughly 0.4 carat, set low in a closed bezel of sterling silver so that it sits flush. In oxidized silver a ruby reads darker and deeper than it does in gold. We tell you in writing whether it is unheated or heat-only. <a href="@/codex/ruby-in-silver.html">Why ruby and silver</a>.</p>`
  },
  {
    slug: 'micro-cameo-link', photo: 'cameo-detail', name: 'Micro Cameo', kind: 'Object', price: 420, priceLabel: '$420 as an object',
    segs: [{ t: 'cable', cm: 4 }, { t: 'cameo' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'A hand-carved shell cameo, 14 mm, in a plain bezel.',
    desc: 'A hand-carved shell micro cameo, 14 mm, set in a plain sterling silver bezel and built into a chain as a single object. Unisex, made in Los Angeles.',
    body: `<p>A cameo the size of a fingernail, carved from shell so the pale layer stands above the dark. People have to lean in to see that it is a face. We often source antique cameos, so each one is unique. <a href="@/codex/cameo-history.html">On the history of cameos</a>.</p>`
  },
  {
    slug: 'baroque-pearl-link', photo: 'pearl-detail', name: 'Baroque Pearl', kind: 'Object', price: 320, priceLabel: '$320 as an object',
    segs: [{ t: 'cable', cm: 4 }, { t: 'pearl' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'An irregular freshwater pearl in a gold-rimmed cup. No two the same shape.',
    desc: 'A freshwater baroque pearl set in a gold-rimmed silver cup and built into a handmade oxidized sterling silver chain. Unisex.',
    body: `<p>A baroque pearl is one that grew wrong: lumpy, twisted, asymmetrical. We set them plainly, in a small silver cup rimmed with 18k gold, so the shape speaks for itself. Next to hand-forged silver, a single pearl is the most unexpected thing we make.</p>`
  },
  {
    slug: 'rock-crystal-link', photo: 'crystal-detail', name: 'Rock Crystal', kind: 'Object', price: 420, priceLabel: '$420 as an object',
    segs: [{ t: 'cable', cm: 4 }, { t: 'crystal' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'A rough quartz point held in eight silver claws.',
    desc: 'A natural rough rock crystal quartz point held in an eight-claw sterling silver setting and built into a handmade oxidized chain.',
    body: `<p>Rock crystal is clear quartz, the stone medieval goldsmiths used for reliquary windows. We leave it rough and hold it in eight hand-bent claws, so light passes straight through. In a dark chain it reads like a shard of ice.</p>`
  },
  {
    slug: 'gold-ring-link', photo: 'gold-ring-detail', name: 'The 18k Ring', kind: 'Object', price: 290, priceLabel: '$290 as an object',
    segs: [{ t: 'cable', cm: 4 }, { t: 'goldring' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'One link of solid 18k gold. A second warm point, after the rivet.',
    desc: 'A single solid 18k yellow gold link set into a handmade oxidized sterling silver chain.',
    body: `<p>One ring of solid 18 karat gold, forged to the same profile as the silver around it. With the gold rivet of the Ash Link it makes two warm points on the chain, never more. Some members add one ring each year. <a href="@/codex/mixing-gold-and-silver.html">On mixing metals</a>.</p>`
  },
  {
    slug: 'reliquary-link', name: 'Reliquary Capsule', kind: 'Object', price: 560, priceLabel: '$560 as an object',
    segs: [{ t: 'cable', cm: 4 }, { t: 'reliquary', v: 'tear' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'A sealed glass capsule for a lock of hair, a tear on silk, a line of a letter or earth from a place.',
    desc: 'A reliquary capsule for a handmade silver chain: sealed glass with silver caps holding a lock of hair, a tear taken on silk, a line of a letter or earth from a place.',
    body: `<p>A capsule of clear borosilicate glass between two silver caps, sealed at the bench in front of you. A tear will not keep in liquid form, so we take it on a short thread of silk, let it dry, and seal the silk. The idea is old: <a href="@/codex/hair-jewelry-history.html">hair jewelry</a> and <a href="@/codex/lachrymatory-tear-bottles.html">tear bottles</a> were worn for centuries.</p>`
  },
  {
    slug: 'found-relic-link', name: 'Found Relic', kind: 'Object', price: 420, priceLabel: '$420 as an object',
    segs: [{ t: 'cable', cm: 4 }, { t: 'relic' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'Cast in silver from an object you bring: a key, a stone, a shell.',
    desc: 'A sterling silver relic cast from a personal object you bring, such as a key, a stone or a shell, and set into a handmade oxidized chain.',
    body: `<p>Bring us a small object that matters: the key to a house you left, a stone from a beach, a shell, a button. We cast it in sterling silver, leave the surface raw, and set it in your chain. The original is kept or returned, as you wish. The cast exists once.</p>`
  }
];

export default P.map(x => ({
  ...x,
  page: ({ CFG }) => ({
    path: `pieces/${x.slug}.html`,
    title: `${x.name} · Handmade Sterling Silver ${x.kind === 'Chain' || x.kind === 'Two chains' || x.kind === 'Numbered edition' ? 'Chain' : 'Chain Link'}`,
    description: x.desc,
    crumbs: [['Chains', 'pieces.html'], [x.name, `pieces/${x.slug}.html`]],
    schema: {
      '@type': 'Product', name: `${x.name} — ${CFG.name}`, description: x.desc, brand: { '@type': 'Brand', name: CFG.name }, material: '925 sterling silver',
      image: `${CFG.url}/assets/img/${x.photo ? 'photos/' + x.photo : 'og'}.jpg`,
      ...(x.price ? { offers: { '@type': 'Offer', price: x.price, priceCurrency: 'USD', availability: 'https://schema.org/MadeToOrder', url: `${CFG.url}/pieces/${x.slug}.html`, seller: { '@id': CFG.url + '/#house' },
        hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'US', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' } } } : {})
    },
    head: `<p class="eyebrow">${x.kind}</p><h1 style="font-size:var(--step-3)">${x.name}</h1><p class="lede">${x.short}</p>`,
    body: `<section class="band" style="padding-top:0"><div class="wrap split" style="align-items:start">
<div class="stack">${x.photo ? `<figure class="plate photo"><img src="@/assets/img/photos/${x.photo}.jpg" alt="${x.name}, handmade oxidized sterling silver" loading="eager"><figcaption>Composition example · each chain is built to order</figcaption></figure>` : ''}
<figure class="plate${x.photo ? ' small' : ''}"><svg data-chain='${JSON.stringify(x.segs)}' data-shape="${x.shape || 'loop'}" data-fixed="${x.fixed === false ? 'false' : 'true'}" data-numeral="I" aria-label="Drawing of ${x.name}"></svg><figcaption>${x.name} · drawing to scale</figcaption></figure></div>
<div class="stack lg prose"><p class="display num" style="font-size:var(--step-2)">${x.priceLabel}</p>${x.body}
<div class="actions"><a class="btn" href="@/build.html">Compose in the atelier</a><a class="btn ghost" href="@/apply.html">Request an audience</a></div>
<p class="muted" style="font-size:.9em">Made to order in Los Angeles. All sales final; no returns or exchanges. <a href="@/policies.html">Terms</a>.</p></div>
</div></section>`
  })
}));
