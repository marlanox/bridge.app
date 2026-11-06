// KEPT — pieces. Each becomes /pieces/<slug>.html with Product data.
// Every chain: fine 2.4 mm → the Mark (black link, gold point) → forged 11 mm on the left → one object.
const base = x => [{ t: 'cable', cm: 14 }, { t: 'ashlink' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 10 }, ...(x ? [x] : []), { t: 'cable', cm: 12 }];
const SPEC = '<ul><li>925 sterling silver, blackened and hand-burnished</li><li>2.4 mm fine cable, 11 mm hand-forged links</li><li>The Mark: black link, 18k gold point</li><li>Toggle clasp, hallmark, coded plate, sealed message</li><li>45–70 cm, made to your measurement</li></ul>';

const P = [
  // chains
  { group: 'chain', slug: 'break', name: 'Break', price: 1800, segs: [{ t: 'cable', cm: 16 }, { t: 'ashlink' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 16 }],
    short: 'Fine, the Mark, weight. Nothing else.', desc: 'KEPT Break: a handmade sterling silver chain that turns from 2.4 mm fine cable to hand-forged 11 mm links at one black link with an 18k gold point.',
    body: `<p>The chain with nothing added. Worn alone, or beside a diamond tennis chain.</p>${SPEC}` },
  { group: 'chain', slug: 'ruby', name: 'Ruby', price: 2400, segs: base({ t: 'ruby' }),
    short: 'One natural ruby, set flush in silver.', desc: 'KEPT Ruby: handmade sterling silver chain with the black Mark, forged weight and one natural ruby (~0.4 ct) set flush in silver.',
    body: `<p>One natural ruby, about 0.4 carat, in a closed bezel. The only red thing on you.</p>${SPEC}` },
  { group: 'chain', slug: 'old-diamond', name: 'Old Diamond', price: 2800, segs: base({ t: 'diamond' }),
    short: 'An antique old-mine diamond in blackened silver.', desc: 'KEPT Old Diamond: handmade sterling silver chain with an antique old-mine cut diamond (~0.3 ct) set in blackened silver.',
    body: `<p>A diamond cut by hand more than a century ago. Soft, broken light out of black metal.</p>${SPEC}` },
  { group: 'chain', slug: 'pearl', name: 'Pearl', price: 2150, segs: base({ t: 'pearl' }),
    short: 'One baroque pearl that grew wrong.', desc: 'KEPT Pearl: handmade sterling silver chain with forged weight and one freshwater baroque pearl in a gold-rimmed cup.',
    body: `<p>An irregular freshwater pearl, set plainly. No two the same shape.</p>${SPEC}` },
  { group: 'chain', slug: 'tear', name: 'Tear', price: 2300, segs: base({ t: 'tear' }),
    short: 'Your tear on paper, sealed in resin.', desc: 'KEPT Tear: handmade sterling silver chain with a memory link holding a tear dropped on paper and sealed in clear resin.',
    body: `<p>See <a href="@/pieces/tear-link.html">how a tear is kept</a>.</p>${SPEC}` },
  { group: 'chain', slug: 'voice', name: 'Voice', price: 2350, segs: base({ t: 'voice' }),
    short: 'Ten seconds of a voice, engraved.', desc: 'KEPT Voice: handmade sterling silver chain with a link engraved with the waveform of a voice and an NFC chip that plays it.',
    body: `<p>See <a href="@/pieces/voice-link.html">how a voice is kept</a>.</p>${SPEC}` },
  // memory links
  { group: 'memory', slug: 'tear-link', name: 'Tear', price: 450, segs: [{ t: 'cable', cm: 3 }, { t: 'tear' }, { t: 'cable', cm: 3 }], shape: 'line', fixed: false,
    short: 'A tear on paper changes its colour. We seal it in resin, forever.', desc: 'A memory link for a silver chain: a tear dropped on reactive paper, which changes colour, sealed in clear resin inside a sterling silver frame.',
    body: `<p>You let one tear fall on a square of reactive paper. Where it lands, the paper changes colour. That stain is the only record of that moment.</p><p>We cut it, seal it in clear resin inside a silver frame, and set it in your chain. Done at the atelier, or with a kit we send you.</p>` },
  { group: 'memory', slug: 'voice-link', name: 'Voice', price: 520, segs: [{ t: 'cable', cm: 3 }, { t: 'voice' }, { t: 'cable', cm: 3 }], shape: 'line', fixed: false,
    short: 'Ten seconds of a voice, engraved as its waveform. Tap to hear.', desc: 'A memory link for a silver chain: ten seconds of a voice engraved as its waveform, with a hidden NFC chip that plays the recording when a phone touches it.',
    body: `<p>Record ten seconds: a name, a laugh, a sentence. We engrave its waveform into the silver. A small chip under the gold point plays it back when a phone touches the link.</p>` },
  { group: 'memory', slug: 'hair-link', name: 'Hair', price: 560, segs: [{ t: 'cable', cm: 3 }, { t: 'reliquary', v: 'hair' }, { t: 'cable', cm: 3 }], shape: 'line', fixed: false,
    short: 'A lock of hair, sealed in glass.', desc: 'A memory link for a silver chain: a lock of hair sealed in clear glass between silver caps.',
    body: `<p>A lock of hair, sealed in clear glass between two silver caps, in front of you. Hair keeps for centuries away from air.</p><p><a href="@/codex/hair-jewelry-history.html">A short history of hair jewelry</a>.</p>` },
  // house
  { group: 'house', slug: 'the-mark', name: 'The Mark', price: null, priceLabel: 'In every chain', segs: [{ t: 'cable', cm: 3 }, { t: 'ashlink' }, { t: 'forged', cm: 4 }], shape: 'line', fixed: false,
    short: 'A black link with one gold point. One in every chain.', desc: 'The Mark is the signature of KEPT: a matte black sterling silver link with a polished rim and a single 18k gold point, placed where fine chain becomes forged weight.',
    body: `<p>Matte black silver, polished rim, one point of 18k gold. One in every chain, exactly where fine becomes heavy. Never sold alone.</p>` },
  { group: 'house', slug: 'forged', name: 'Forged weight', price: null, priceLabel: '$70 / cm', segs: [{ t: 'forged', cm: 8 }], shape: 'line', fixed: false,
    short: 'Hand-forged 11 mm links, hammered and blackened.', desc: 'Hand-forged 11 mm sterling silver oval links, hammered on the anvil and blackened: the weight in every KEPT chain.',
    body: `<p>Each oval forged, soldered and hammered on the anvil, then blackened. Worn on the left.</p>` },
  // objects
  { group: 'object', slug: 'old-diamond-link', name: 'Old-mine diamond', price: 980, segs: [{ t: 'cable', cm: 3 }, { t: 'diamond' }, { t: 'cable', cm: 3 }], shape: 'line', fixed: false,
    short: 'Antique, ~0.3 ct, set in black.', desc: 'An antique old-mine cut diamond, about 0.3 ct, set in blackened sterling silver as a chain link.', body: '<p>Sourced from estate jewelry. Its history goes into the sealed message.</p>' },
  { group: 'object', slug: 'ruby-link', name: 'Ruby', price: 600, segs: [{ t: 'cable', cm: 3 }, { t: 'ruby' }, { t: 'cable', cm: 3 }], shape: 'line', fixed: false,
    short: 'Natural, ~0.4 ct, closed bezel.', desc: 'A natural ruby, about 0.4 ct, in a closed sterling silver bezel, set as a chain link.', body: '<p>Unheated or heat-only, stated in writing. <a href="@/codex/ruby-in-silver.html">Ruby in silver</a>.</p>' },
  { group: 'object', slug: 'pearl-link', name: 'Baroque pearl', price: 320, segs: [{ t: 'cable', cm: 3 }, { t: 'pearl' }, { t: 'cable', cm: 3 }], shape: 'line', fixed: false,
    short: 'Freshwater, gold-rimmed cup.', desc: 'A freshwater baroque pearl in a gold-rimmed silver cup, set as a chain link.', body: '<p>Every one a different shape.</p>' },
  { group: 'object', slug: 'cameo-link', name: 'Micro cameo', price: 420, segs: [{ t: 'cable', cm: 3 }, { t: 'cameo' }, { t: 'cable', cm: 3 }], shape: 'line', fixed: false,
    short: 'Carved shell, 14 mm, often antique.', desc: 'A hand-carved shell micro cameo, 14 mm, in a plain silver bezel, set as a chain link.', body: '<p><a href="@/codex/cameo-history.html">On cameos</a>.</p>' },
  { group: 'object', slug: 'crystal-link', name: 'Rock crystal', price: 420, segs: [{ t: 'cable', cm: 3 }, { t: 'crystal' }, { t: 'cable', cm: 3 }], shape: 'line', fixed: false,
    short: 'Rough quartz in eight claws.', desc: 'A rough rock crystal quartz point in an eight-claw sterling silver setting, set as a chain link.', body: '<p>Left rough. Light passes straight through.</p>' },
  { group: 'object', slug: 'gold-link', name: '18k gold link', price: 290, segs: [{ t: 'cable', cm: 3 }, { t: 'goldring' }, { t: 'cable', cm: 3 }], shape: 'line', fixed: false,
    short: 'One solid gold link. Some add one a year.', desc: 'A single solid 18k gold link set into a sterling silver chain.', body: '<p><a href="@/codex/mixing-gold-and-silver.html">Mixing gold and silver</a>.</p>' }
];

P.forEach(x => { x.priceLabel = x.priceLabel || ('$' + x.price.toLocaleString('en-US') + (x.group === 'chain' ? '' : ' as a link')); });
export default P.map(x => ({
  ...x,
  page: ({ CFG }) => ({
    path: `pieces/${x.slug}.html`,
    title: `${x.name}${x.group === 'chain' ? ' — sterling silver chain' : ''}`,
    description: x.desc,
    crumbs: [[x.group === 'memory' ? 'Memory' : 'Collection', x.group === 'memory' ? 'memory.html' : 'collection.html'], [x.name, `pieces/${x.slug}.html`]],
    schema: { '@type': 'Product', name: `${CFG.name} ${x.name}`, description: x.desc, brand: { '@type': 'Brand', name: CFG.name }, material: '925 sterling silver', image: `${CFG.url}/assets/img/og.jpg`,
      ...(x.price ? { offers: { '@type': 'Offer', price: x.price, priceCurrency: 'USD', availability: 'https://schema.org/MadeToOrder', url: `${CFG.url}/pieces/${x.slug}.html`,
        hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'US', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' } } } : {}) },
    body: `<section class="wrap split" style="align-items:start;padding-top:clamp(110px,14vw,170px);padding-bottom:140px">
<div class="plate" data-parallax style="aspect-ratio:4/5"><svg data-chain='${JSON.stringify(x.segs)}' data-shape="${x.shape || 'loop'}" data-fixed="${x.fixed === false ? 'false' : 'true'}" aria-label="${x.name}"></svg></div>
<div class="stack" style="position:sticky;top:110px">
  <p class="cap">${x.group === 'chain' ? 'Chain' : x.group === 'memory' ? 'Memory' : x.group === 'house' ? 'KEPT' : 'Object'}</p>
  <h1 style="font-size:clamp(2.4rem,1.4rem+4vw,4.8rem);line-height:.95;font-weight:500;letter-spacing:-.02em">${x.name}</h1>
  <p class="num">${x.priceLabel}</p>
  <div class="prose" style="padding:0">${x.body}</div>
  <div class="actions"><a class="btn" href="@/atelier.html">Book an appointment</a></div>
  <p class="mute" style="font-size:.85rem">Made to order in Los Angeles. Final sale.</p>
</div>
</section>`
  })
}));
