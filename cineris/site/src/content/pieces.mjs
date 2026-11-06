// The chains and artifacts. Each becomes /pieces/<slug>.html with Product structured data.
const P = [
  {
    slug: 'vigil-chain', photo: 'necklace-serpent', name: 'The Vigil', kind: 'Chain', price: 1900, priceLabel: 'From $1,900',
    segs: [{ t: 'bali', cm: 10 }, { t: 'drop' }, { t: 'cable', cm: 12 }, { t: 'serpent' }, { t: 'bali', cm: 12 }],
    short: 'Heavy oxidized cable with a single artifact. The quietest chain we make.',
    desc: 'A handmade 925 sterling silver cable chain, oxidized black and hand-burnished, with one artifact of your choice set into the links. Unisex, worn by men over knitwear.',
    body: `<p>The Vigil is where most members begin. Forty-odd centimetres of forged oval cable in 4.2 mm wire, darkened and rubbed back by hand, interrupted once. You choose the interruption: a micro cameo, a ruby in a closed bezel, a ring of 18k gold, or a reliquary link.</p>
<p>It is heavy enough to fall straight on a black crew-neck and quiet enough to wear every day for twenty years. It is the chain we would give a man who has never worn jewelry.</p>
<h2>Specification</h2><ul><li>925 sterling silver, oxidized and hand-burnished</li><li>Forged cable, 4.2 mm wire, approximately 9 × 14 mm links</li><li>One artifact of your choice</li><li>Hand-chased toggle clasp with house mark, 925 hallmark tag, engraved passport plate</li><li>One Vault cell, one role in the Order</li><li>45 to 70 cm, built to your measurement</li></ul>`
  },
  {
    slug: 'reliquary-chain', photo: 'necklace-wing', name: 'The Reliquary', kind: 'Chain', price: 2500, priceLabel: 'From $2,500 · as shown, about $4,300',
    segs: [{ t: 'bali', cm: 6 }, { t: 'wing' }, { t: 'bali', cm: 4 }, { t: 'ruby' }, { t: 'cross' }, { t: 'goldring' }, { t: 'bali', cm: 8 }, { t: 'heart' }, { t: 'bali', cm: 6 }, { t: 'goldring' }, { t: 'relic' }, { t: 'bali', cm: 6 }, { t: 'cameo' }, { t: 'bead' }, { t: 'bali', cm: 4 }],
    short: 'The house chain. Plain links, a cameo, Balinese granulation, one gold ring, a woven section and a sealed reliquary.',
    desc: 'The signature Ordo Cineris chain: handmade 925 sterling silver with mixed Balinese, cable and Byzantine links, a micro cameo, an 18k gold ring and a sealed reliquary link for hair or a tear.',
    body: `<p>This is the chain that defines the house. It reads like a sentence: ten centimetres of plain cable, then a carved cameo the size of a fingernail, then Balinese links granulated by hand, then one ring of solid 18k gold, then a dense Byzantine section for weight, then the reliquary, sealed with whatever you bring us.</p>
<p>No two are the same, because no two people bring the same lock of hair. The order of the links is yours to change in the <a href="@/build.html">atelier</a>.</p>
<h2>Specification</h2><ul><li>925 sterling silver, oxidized and hand-burnished; one 18k yellow gold link</li><li>Cable, Balinese embossed and Byzantine sections</li><li>Hand-carved shell cameo, 14 mm, granulated bezel</li><li>Reliquary link: borosilicate glass capsule with silver caps, sealed at the bench</li><li>Toggle clasp, hallmark, passport plate, Vault cell, role in the Order</li><li>Typical weight 90–140 g</li></ul>`
  },
  {
    slug: 'burning-chain', photo: 'collar-relics', name: 'Burning No. I', kind: 'Numbered edition', price: null, priceLabel: 'On application',
    segs: [{ t: 'cable', cm: 10 }, { t: 'ash' }, { t: 'bali', cm: 9 }, { t: 'goldring' }, { t: 'byzantine', cm: 5 }, { t: 'cable', cm: 10 }],
    short: 'Ten chains, each holding ash from one artifact burned unread. Never repeated.',
    desc: 'Burning No. I: a numbered edition of ten handmade sterling silver chains, each with an ash link holding the ash of one destroyed artifact. Never repeated.',
    body: `<p>Each Burning edition is built around a single destroyed object. Its ash is divided into ten parts and sealed inside an oxidized silver capsule engraved with the edition numeral. The rest of the chain is yours to compose.</p>
<p>When ten are bound, the edition closes. <a href="@/burning.html">Read about the Burning</a>.</p>
<h2>Specification</h2><ul><li>Ash link: silver capsule with glass window, engraved numeral and number 1–10</li><li>Remaining links composed with you in the atelier</li><li>Certificate of provenance of the artifact, held in your Vault cell</li><li>Invitation to witness the next Burning</li></ul>`
  },
  {
    slug: 'concordance-pair', photo: 'necklace-heart', name: 'The Concordance Pair', kind: 'Two chains', price: 4600, priceLabel: 'From $4,600 the pair',
    segs: [{ t: 'cable', cm: 12 }, { t: 'goldring' }, { t: 'bali', cm: 10 }, { t: 'goldring' }, { t: 'cable', cm: 12 }],
    short: 'Two chains bound on the same day from the same silver, with passports that open a shared cell.',
    desc: 'Two handmade sterling silver chains bound together from the same silver, with paired passport codes that open a shared Vault cell. For couples, siblings, parent and child.',
    body: `<p>Two chains, cut from the same length of silver and bound on the same afternoon. Each has its own passport code; together they form a <a href="@/concordance.html">Concordance</a> key that opens a cell sealed for the two of you.</p>
<p>Couples commission them before a wedding. Parents commission one for themselves and one for a child to receive at eighteen. Brothers commission them after a funeral.</p>
<h2>Specification</h2><ul><li>Two chains, each composed individually</li><li>One shared 18k gold link design, mirrored</li><li>Paired passport plates and a shared Vault cell</li></ul>`
  },
  {
    slug: 'micro-cameo-link', photo: 'cameo-detail', name: 'Micro Cameo', kind: 'Artifact', price: 420, priceLabel: '$420 as a link',
    segs: [{ t: 'cable', cm: 4 }, { t: 'cameo' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'A hand-carved shell cameo, 14 mm, in a granulated silver bezel.',
    desc: 'A hand-carved shell micro cameo, 14 mm, set in an oxidized granulated sterling silver bezel and built into a chain as a link. Unisex, made in Los Angeles.',
    body: `<p>A cameo is a carving in relief, cut from shell so that the pale layer stands above the dark. Ours are 14 mm tall, small enough that people lean in. The profile looks away from the wearer, toward whoever is looking.</p><p>We set each one in a closed bezel with a ring of granulation and build it into the chain with a jump ring on either side, so it moves with the links. <a href="@/codex/cameo-history.html">On the history of cameos</a>.</p>`
  },
  {
    slug: 'ruby-bezel-link', photo: 'ruby-crystal-detail', name: 'Ruby in Bezel', kind: 'Artifact', price: 600, priceLabel: '$600 as a link',
    segs: [{ t: 'bali', cm: 4 }, { t: 'ruby' }, { t: 'bali', cm: 4 }], shape: 'line', fixed: false,
    short: 'A natural ruby of about 0.4 carat in a closed silver bezel. The only red thing in the chain.',
    desc: 'A natural ruby, about 0.4 ct, set in a closed oxidized sterling silver bezel and built into a handmade chain. A single drop of red in dark silver.',
    body: `<p>One natural ruby, roughly 0.4 carat, set low in a closed bezel of sterling silver so that it sits flush, like a drop of blood on a blade. In oxidized silver a ruby reads darker and deeper than it does in gold.</p><p>We source untreated or heat-only stones and tell you which. <a href="@/codex/ruby-in-silver.html">Why ruby and silver</a>.</p>`
  },
  {
    slug: 'gold-ring-link', photo: 'gold-ring-detail', name: 'The 18k Ring', kind: 'Artifact', price: 290, priceLabel: '$290 as a link',
    segs: [{ t: 'cable', cm: 4 }, { t: 'goldring' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'One link of solid 18k gold in a chain of dark silver.',
    desc: 'A single solid 18k yellow gold link set into a handmade oxidized sterling silver chain. The one warm link, where the thumb rests.',
    body: `<p>One ring of solid 18 karat yellow gold, forged to the same profile as the silver around it. In a chain of blackened silver it is the only warm thing, and it is where people put their thumb. Some members add a second ring each year. <a href="@/codex/mixing-gold-and-silver.html">On mixing metals</a>.</p>`
  },
  {
    slug: 'wing-link', photo: 'wing-detail', name: 'The Wing', kind: 'Artifact', price: 380, priceLabel: '$380 as a link',
    segs: [{ t: 'bali', cm: 4 }, { t: 'wing' }, { t: 'bali', cm: 4 }], shape: 'line', fixed: false,
    short: 'A single cast wing, every feather chased by hand, built into the chain.',
    desc: 'A hand-chased sterling silver wing set into a handmade oxidized chain as a link. One wing, never a pair: the other belongs to someone else.',
    body: `<p>We cast one wing, never two. The feathers are chased by hand after casting, then darkened so every vane reads. It sits sideways in the chain, along the collarbone, as if something had landed there.</p><p>Members say the second wing belongs to whoever they gave the other chain to. Concordance pairs often carry a left and a right.</p>`
  },
  {
    slug: 'bone-relic-link', photo: 'bone-cameo-detail', name: 'The Bone Relic', kind: 'Artifact', price: 420, priceLabel: '$420 as a link',
    segs: [{ t: 'bali', cm: 4 }, { t: 'relic' }, { t: 'bali', cm: 4 }], shape: 'line', fixed: false,
    short: 'Cast in silver from a found bone or horn. Pitted, raw, and never the same twice.',
    desc: 'A sterling silver relic link cast from a found bone or horn, left pitted and raw, set into a handmade oxidized chain. Memento mori for the modern neck.',
    body: `<p>Each relic is cast directly from a found object: a fragment of antler, a tooth, a small bone from the desert outside Los Angeles. The original is lost in the casting, so every relic is unique. We leave the surface pitted and rough, the opposite of the polished links around it.</p><p>It is the house’s <a href="@/codex/memento-mori-jewelry.html">memento mori</a>. You may bring your own object to be cast.</p>`
  },
  {
    slug: 'rock-crystal-link', photo: 'crystal-detail', name: 'Rock Crystal', kind: 'Artifact', price: 420, priceLabel: '$420 as a link',
    segs: [{ t: 'cable', cm: 4 }, { t: 'crystal' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'A rough quartz point held in eight silver claws.',
    desc: 'A natural rough rock crystal quartz point held in an eight-claw sterling silver setting and built into a handmade oxidized chain.',
    body: `<p>Rock crystal is clear quartz, the stone medieval goldsmiths used for reliquary windows. We leave it rough, as it came out of the ground, and hold it in eight hand-bent claws so that light passes straight through.</p><p>In a dark chain it reads like a shard of ice, or a piece of a broken window. It pairs well with a ruby a few links away.</p>`
  },
  {
    slug: 'baroque-pearl-link', photo: 'pearl-detail', name: 'Baroque Pearl', kind: 'Artifact', price: 320, priceLabel: '$320 as a link',
    segs: [{ t: 'cable', cm: 4 }, { t: 'pearl' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'An irregular freshwater pearl in a gold-rimmed cup. No two the same shape.',
    desc: 'A freshwater baroque pearl set in a gold-rimmed silver cup and built into a handmade oxidized sterling silver chain. Unisex.',
    body: `<p>A baroque pearl is one that grew wrong: lumpy, twisted, asymmetrical. Renaissance jewelers loved them for exactly that reason and turned them into the bodies of mermaids and dragons. We set them plainly, in a small silver cup rimmed with 18k gold, so the shape speaks for itself.</p><p>On a man’s chain, one irregular pearl is the most unexpected thing we make.</p>`
  },
  {
    slug: 'reliquary-link', name: 'The Reliquary Link', kind: 'Artifact', price: 560, priceLabel: '$560 as a link',
    segs: [{ t: 'cable', cm: 4 }, { t: 'reliquary', v: 'tear' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'A sealed glass capsule for a lock of hair, a tear on silk, a line of a letter or earth from a place.',
    desc: 'A reliquary link for a handmade silver chain: a sealed glass capsule with silver caps holding a lock of hair, a tear taken on silk, a line of a letter or earth from a place.',
    body: `<p>A capsule of clear borosilicate glass between two silver caps, sealed at the bench in front of you. Inside goes whatever you bring: a lock of hair, a line cut from a letter, a pinch of earth, or a tear. A tear will not keep in liquid form, so we take it on a short thread of silk, let it dry, and seal the silk. It is the closest thing to keeping a moment.</p>
<p>The idea is old. <a href="@/codex/hair-jewelry-history.html">Hair jewelry</a> was worn across Europe and America for two centuries, and <a href="@/codex/lachrymatory-tear-bottles.html">tear bottles</a> for longer.</p>`
  }
];

export default P.map(x => ({
  ...x,
  page: ({ CFG }) => ({
    path: `pieces/${x.slug}.html`,
    title: `${x.name} · Handmade Sterling Silver ${x.kind === 'Artifact' ? 'Chain Link' : 'Chain'}`,
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
