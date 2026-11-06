// MARLA KNOX — the pieces. Photography only. Each becomes /pieces/<slug>.html.
const P = [
  { slug: 'no-i', name: 'No. I', price: 2600, cover: 'necklace-wing', shots: ['necklace-wing', 'worn-turtleneck', 'wing-detail', 'toggle-cameo-detail', 'bone-cameo-detail'],
    line: 'Wing, garnet, cross, cast relic, cameo in gold.',
    desc: 'Withheld No. I: oxidized 925 sterling silver chain with a hand-chased wing, natural garnet, small cross, cast relic, shell cameo in an 18k gold bezel, Bali bead and two solid 18k gold links. Made to order.' },
  { slug: 'no-ii', name: 'No. II', price: 2400, cover: 'necklace-heart', shots: ['necklace-heart', 'cameo-detail', 'gold-ring-detail'],
    line: 'Wing, garnet, heart, relic, cameo in gold.',
    desc: 'Withheld No. II: oxidized 925 sterling silver chain with wing, natural garnet, cross, beaded heart, cast relic and shell cameo in an 18k gold bezel. Made to order.' },
  { slug: 'no-iii', name: 'No. III', price: 2500, cover: 'necklace-serpent', shots: ['necklace-serpent', 'worn-crewneck', 'ruby-crystal-detail', 'crystal-detail'],
    line: 'Serpent, garnet drop, horn with gold, cameo.',
    desc: 'Withheld No. III: long oxidized 925 sterling silver chain with serpent, garnet drop, cast horn wrapped in 18k gold, shell cameo and Bali bead. Made to order.' },
  { slug: 'no-iv', name: 'No. IV', price: 3200, cover: 'collar-relics', shots: ['collar-relics', 'pearl-detail'],
    line: 'Collar. Wing, claw, baroque pearls, two cameos, heart.',
    desc: 'Withheld No. IV: heavy oxidized 925 sterling silver collar with wing, cast claw and horn, baroque pearls in gold, two shell cameos and a beaded heart. Made to order.' }
];

const money = n => '$' + n.toLocaleString('en-US');
export default P.map(x => ({
  ...x,
  priceLabel: money(x.price),
  page: ({ CFG }) => ({
    path: `pieces/${x.slug}.html`,
    title: `${x.name} — oxidized sterling silver chain`,
    description: x.desc,
    crumbs: [['Collection', 'collection.html'], [x.name, `pieces/${x.slug}.html`]],
    schema: { '@type': 'Product', name: `${CFG.name} ${x.name}`, description: x.desc, brand: { '@type': 'Brand', name: CFG.name }, material: '925 sterling silver',
      image: x.shots.map(s => `${CFG.url}/assets/img/photos/${s}.jpg`),
      offers: { '@type': 'Offer', price: x.price, priceCurrency: 'USD', availability: 'https://schema.org/MadeToOrder', url: `${CFG.url}/pieces/${x.slug}.html`,
        hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'US', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' } } },
    body: `<section class="wrap page"><div class="product">
<div class="shots">${x.shots.map((s, i) => `<figure><img src="@/assets/img/photos/${s}.jpg" alt="${x.name}${i ? ', detail' : ''}"${i ? ' loading="lazy"' : ''}></figure>`).join('')}</div>
<div class="buy" data-base="${x.price}" data-name="${x.name}">
  <div style="display:grid;gap:14px"><p class="crumbs"><a href="@/collection.html">Collection</a></p><h1 class="title">${x.name}</h1><p class="it dim">${x.line}</p><p class="price num">${money(x.price)}</p></div>
  <fieldset class="opt" style="border:0;margin:0;padding:22px 0 0;border-top:1px solid var(--hair)"><legend class="cap" style="padding:0;margin-bottom:12px">Length</legend>
    <div class="choices">${CFG.lengths.map(([cm, add], i) => `<input type="radio" name="len" id="len-${cm}" value="${cm}" data-add="${add}"${i === 2 ? ' checked' : ''}><label for="len-${cm}">${cm} cm${add ? ' +$' + add : ''}</label>`).join('')}</div></fieldset>
  <fieldset class="opt" style="border:0;margin:0;padding:22px 0 0;border-top:1px solid var(--hair)"><legend class="cap" style="padding:0;margin-bottom:12px">Keep something inside</legend>
    <div class="choices">${CFG.memory.map(([k, label, add], i) => `<input type="radio" name="mem" id="mem-${k || 'none'}" value="${k}" data-add="${add}"${i === 0 ? ' checked' : ''}><label for="mem-${k || 'none'}">${k ? (k === 'hair' ? 'Hair' : 'Tear') + ' +$' + add : 'Nothing'}</label>`).join('')}</div>
    <p class="note">A lock of hair sealed in glass, or a tear on paper sealed in resin, set as one link.</p></fieldset>
  <fieldset class="opt" style="border:0;margin:0;padding:22px 0 0;border-top:1px solid var(--hair)"><legend class="cap" style="padding:0;margin-bottom:12px">Sealed message</legend>
    <div class="choices"><input type="radio" name="seal" id="seal-no" value="no" data-add="0" checked><label for="seal-no">No</label><input type="radio" name="seal" id="seal-yes" value="yes" data-add="0"><label for="seal-yes">Seal one</label></div>
    <div class="seal-date field" hidden><label for="seal-date">Opens on</label><input type="date" id="seal-date"></div>
    <p class="note">Words, a photograph or a film, kept in our vault until the day you choose, up to one year. <a href="@/vault.html">The Vault</a>.</p></fieldset>
  <div class="total"><span class="cap">Total</span><span class="num price">${money(x.price)}</span></div>
  <button class="btn full req" type="button">Request</button>
  <form class="form" data-form="order" hidden>
    <input type="hidden" name="piece">
    <div class="field"><label for="o-name">Name</label><input id="o-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="o-contact">Email or Instagram</label><input id="o-contact" name="contact" required></div>
    <div class="field"><label for="o-note">Note</label><textarea id="o-note" name="note"></textarea></div>
    <button class="btn full" type="submit">Send request</button>
    <div class="form-out" aria-live="polite"></div>
  </form>
  <p class="cap dim">Made to order · 3–4 weeks · Final sale</p>
</div>
</div></section>`
  })
}));
