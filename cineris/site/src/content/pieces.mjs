// The chains and artifacts. Each becomes /pieces/<slug>.html with Product structured data.
const P = [
  {
    slug: 'vigil-chain', name: 'The Vigil', kind: 'Chain', price: 1900, priceLabel: 'From $1,900',
    segs: [{ t: 'cable', cm: 22 }, { t: 'cameo' }, { t: 'cable', cm: 22 }],
    short: 'Heavy oxidized cable with a single artifact. The quietest chain we make.',
    desc: 'A handmade 925 sterling silver cable chain, oxidized black and hand-burnished, with one artifact of your choice set into the links. Unisex, worn by men over knitwear.',
    body: `<p>The Vigil is where most members begin. Forty-odd centimetres of forged oval cable in 4.2 mm wire, darkened and rubbed back by hand, interrupted once. You choose the interruption: a micro cameo, a ruby in a closed bezel, a ring of 18k gold, or a reliquary link.</p>
<p>It is heavy enough to fall straight on a black crew-neck and quiet enough to wear every day for twenty years. It is the chain we would give a man who has never worn jewelry.</p>
<h2>Specification</h2><ul><li>925 sterling silver, oxidized and hand-burnished</li><li>Forged cable, 4.2 mm wire, approximately 9 × 14 mm links</li><li>One artifact of your choice</li><li>Cast box clasp with house mark, 925 hallmark tag, engraved passport plate</li><li>One Vault cell, one role in the Order</li><li>45 to 70 cm, built to your measurement</li></ul>`
  },
  {
    slug: 'reliquary-chain', name: 'The Reliquary', kind: 'Chain', price: 2500, priceLabel: 'From $2,500',
    segs: [{ t: 'cable', cm: 12 }, { t: 'cameo' }, { t: 'bali', cm: 10 }, { t: 'goldring' }, { t: 'byzantine', cm: 6 }, { t: 'reliquary', v: 'hair' }, { t: 'cable', cm: 10 }],
    short: 'The house chain. Plain links, a cameo, Balinese granulation, one gold ring, a woven section and a sealed reliquary.',
    desc: 'The signature Ordo Cineris chain: handmade 925 sterling silver with mixed Balinese, cable and Byzantine links, a micro cameo, an 18k gold ring and a sealed reliquary link for hair or a tear.',
    body: `<p>This is the chain that defines the house. It reads like a sentence: ten centimetres of plain cable, then a carved cameo the size of a fingernail, then Balinese links granulated by hand, then one ring of solid 18k gold, then a dense Byzantine section for weight, then the reliquary, sealed with whatever you bring us.</p>
<p>No two are the same, because no two people bring the same lock of hair. The order of the links is yours to change in the <a href="@/build.html">atelier</a>.</p>
<h2>Specification</h2><ul><li>925 sterling silver, oxidized and hand-burnished; one 18k yellow gold link</li><li>Cable, Balinese embossed and Byzantine sections</li><li>Hand-carved shell cameo, 14 mm, granulated bezel</li><li>Reliquary link: borosilicate glass capsule with silver caps, sealed at the bench</li><li>Box clasp, hallmark, passport plate, Vault cell, role in the Order</li><li>Typical weight 90–140 g</li></ul>`
  },
  {
    slug: 'burning-chain', name: 'Burning No. I', kind: 'Numbered edition', price: null, priceLabel: 'On application',
    segs: [{ t: 'cable', cm: 10 }, { t: 'ash' }, { t: 'bali', cm: 9 }, { t: 'goldring' }, { t: 'byzantine', cm: 5 }, { t: 'cable', cm: 10 }],
    short: 'Ten chains, each holding ash from one artifact burned unread. Never repeated.',
    desc: 'Burning No. I: a numbered edition of ten handmade sterling silver chains, each with an ash link holding the ash of one destroyed artifact. Never repeated.',
    body: `<p>Each Burning edition is built around a single destroyed object. Its ash is divided into ten parts and sealed inside an oxidized silver capsule engraved with the edition numeral. The rest of the chain is yours to compose.</p>
<p>When ten are bound, the edition closes. <a href="@/burning.html">Read about the Burning</a>.</p>
<h2>Specification</h2><ul><li>Ash link: silver capsule with glass window, engraved numeral and number 1–10</li><li>Remaining links composed with you in the atelier</li><li>Certificate of provenance of the artifact, held in your Vault cell</li><li>Invitation to witness the next Burning</li></ul>`
  },
  {
    slug: 'concordance-pair', name: 'The Concordance Pair', kind: 'Two chains', price: 4600, priceLabel: 'From $4,600 the pair',
    segs: [{ t: 'cable', cm: 12 }, { t: 'goldring' }, { t: 'bali', cm: 10 }, { t: 'goldring' }, { t: 'cable', cm: 12 }],
    short: 'Two chains bound on the same day from the same silver, with passports that open a shared cell.',
    desc: 'Two handmade sterling silver chains bound together from the same silver, with paired passport codes that open a shared Vault cell. For couples, siblings, parent and child.',
    body: `<p>Two chains, cut from the same length of silver and bound on the same afternoon. Each has its own passport code; together they form a <a href="@/concordance.html">Concordance</a> key that opens a cell sealed for the two of you.</p>
<p>Couples commission them before a wedding. Parents commission one for themselves and one for a child to receive at eighteen. Brothers commission them after a funeral.</p>
<h2>Specification</h2><ul><li>Two chains, each composed individually</li><li>One shared 18k gold link design, mirrored</li><li>Paired passport plates and a shared Vault cell</li></ul>`
  },
  {
    slug: 'micro-cameo-link', name: 'Micro Cameo', kind: 'Artifact', price: 690, priceLabel: '$690 as a link',
    segs: [{ t: 'cable', cm: 4 }, { t: 'cameo' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'A hand-carved shell cameo, 14 mm, in a granulated silver bezel.',
    desc: 'A hand-carved shell micro cameo, 14 mm, set in an oxidized granulated sterling silver bezel and built into a chain as a link. Unisex, made in Los Angeles.',
    body: `<p>A cameo is a carving in relief, cut from shell so that the pale layer stands above the dark. Ours are 14 mm tall, small enough that people lean in. The profile looks away from the wearer, toward whoever is looking.</p><p>We set each one in a closed bezel with a ring of granulation and build it into the chain with a jump ring on either side, so it moves with the links. <a href="@/codex/cameo-history.html">On the history of cameos</a>.</p>`
  },
  {
    slug: 'ruby-bezel-link', name: 'Ruby in Bezel', kind: 'Artifact', price: 860, priceLabel: '$860 as a link',
    segs: [{ t: 'bali', cm: 4 }, { t: 'ruby' }, { t: 'bali', cm: 4 }], shape: 'line', fixed: false,
    short: 'A natural ruby of about 0.4 carat in a closed silver bezel. The only red thing in the chain.',
    desc: 'A natural ruby, about 0.4 ct, set in a closed oxidized sterling silver bezel and built into a handmade chain. A single drop of red in dark silver.',
    body: `<p>One natural ruby, roughly 0.4 carat, set low in a closed bezel of sterling silver so that it sits flush, like a drop of blood on a blade. In oxidized silver a ruby reads darker and deeper than it does in gold.</p><p>We source untreated or heat-only stones and tell you which. <a href="@/codex/ruby-in-silver.html">Why ruby and silver</a>.</p>`
  },
  {
    slug: 'gold-ring-link', name: 'The 18k Ring', kind: 'Artifact', price: 480, priceLabel: '$480 as a link',
    segs: [{ t: 'cable', cm: 4 }, { t: 'goldring' }, { t: 'cable', cm: 4 }], shape: 'line', fixed: false,
    short: 'One link of solid 18k gold in a chain of dark silver.',
    desc: 'A single solid 18k yellow gold link set into a handmade oxidized sterling silver chain. The one warm link, where the thumb rests.',
    body: `<p>One ring of solid 18 karat yellow gold, forged to the same profile as the silver around it. In a chain of blackened silver it is the only warm thing, and it is where people put their thumb. Some members add a second ring each year. <a href="@/codex/mixing-gold-and-silver.html">On mixing metals</a>.</p>`
  },
  {
    slug: 'reliquary-link', name: 'The Reliquary Link', kind: 'Artifact', price: 890, priceLabel: '$890 as a link',
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
      image: `${CFG.url}/assets/img/pieces/${x.slug}.jpg`,
      ...(x.price ? { offers: { '@type': 'Offer', price: x.price, priceCurrency: 'USD', availability: 'https://schema.org/MadeToOrder', url: `${CFG.url}/pieces/${x.slug}.html`, seller: { '@id': CFG.url + '/#house' },
        hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'US', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' } } } : {})
    },
    head: `<p class="eyebrow">${x.kind}</p><h1 style="font-size:var(--step-3)">${x.name}</h1><p class="lede">${x.short}</p>`,
    body: `<section class="band" style="padding-top:0"><div class="wrap split" style="align-items:start">
<figure class="plate"><svg data-chain='${JSON.stringify(x.segs)}' data-shape="${x.shape || 'loop'}" data-fixed="${x.fixed === false ? 'false' : 'true'}" data-numeral="I" aria-label="Drawing of ${x.name}"></svg><figcaption>${x.name} · drawing to scale</figcaption></figure>
<div class="stack lg prose"><p class="display num" style="font-size:var(--step-2)">${x.priceLabel}</p>${x.body}
<div class="actions"><a class="btn" href="@/build.html">Compose in the atelier</a><a class="btn ghost" href="@/apply.html">Request an audience</a></div>
<p class="muted" style="font-size:.9em">Made to order in Los Angeles. All sales final; no returns or exchanges. <a href="@/policies.html">Terms</a>.</p></div>
</div></section>`
  })
}));
