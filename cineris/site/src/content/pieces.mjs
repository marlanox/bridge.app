// THE THREE — pieces. Photography only. Each becomes /pieces/<slug>.html.
// line 'sealed' = the unisex chains that carry a letter in the Vault (the house's main line).
// line 'ravens' = a separate collection, by request.
const P = [
  { line: 'sealed', slug: 'no-i', name: 'Sealed Chain No. I', short: 'No. I', price: 2600, cover: 'necklace-wing', shots: ['necklace-wing', 'worn-turtleneck', 'wing-detail', 'toggle-cameo-detail', 'bone-cameo-detail'],
    what: 'Wing, garnet, small cross, cast relic, shell cameo in 18k gold, Bali bead, two solid 18k gold links, toggle clasp.' },
  { line: 'sealed', slug: 'no-ii', name: 'Sealed Chain No. II', short: 'No. II', price: 2400, cover: 'necklace-heart', shots: ['necklace-heart', 'cameo-detail', 'gold-ring-detail'],
    what: 'Wing, garnet, cross, beaded heart, cast relic, shell cameo in 18k gold, toggle clasp.' },
  { line: 'sealed', slug: 'no-iii', name: 'Sealed Chain No. III', short: 'No. III', price: 2500, cover: 'necklace-serpent', shots: ['necklace-serpent', 'worn-crewneck', 'ruby-crystal-detail', 'crystal-detail'],
    what: 'Long chain. Serpent, garnet drop, cast horn wrapped in 18k gold, shell cameo, Bali bead.' },
  { line: 'sealed', slug: 'no-iv', name: 'Sealed Collar No. IV', short: 'No. IV', price: 3200, cover: 'collar-relics', shots: ['collar-relics', 'pearl-detail'],
    what: 'Heavy collar. Wing, cast claw and horn, baroque pearls in gold, two shell cameos, beaded heart.' },
  { line: 'ravens', slug: 'no-v', name: 'Ravens No. V', short: 'No. V', price: null, cover: 'raven-chain', shots: ['raven-chain'],
    what: 'Raven, two garnets in raw bezels, pavé disc around carved bone, gothic initial.' },
  { line: 'ravens', slug: 'no-vi', name: 'Ravens No. VI', short: 'No. VI', price: null, cover: 'charm-collar', shots: ['charm-collar'],
    what: 'Heavy link collar hung with two cameos, an eagle, a raven, a garnet and a gothic initial.' },
  { line: 'ravens', slug: 'no-vii', name: 'Ravens No. VII', short: 'No. VII', price: null, cover: 'bone-charms', shots: ['bone-charms'],
    what: 'Two carved bone medallions in silver, a raven, a garnet, a gothic initial.' }
];

const money = n => '$' + n.toLocaleString('en-US');

const STEPS = lead => [
  ['Choose', 'Choose the chain and its length. Add a lock of hair or a tear if you want one.'],
  ['Deposit', 'Pay a 50% deposit. The work begins the day it arrives.'],
  ['Made by hand', `Your chain is forged, set and blackened by hand in Los Angeles. ${lead}.`],
  ['Seal', 'You receive a code. In the Vault you seal a letter: words, a photograph or a film, and the day it opens, up to one year.'],
  ['Delivered', 'The balance is paid and the chain ships, insured, anywhere in the world. The code is engraved by the clasp.'],
  ['Opened', 'On the day you chose, the code opens your letter. Not one day before. Not for the wearer, not for you, not for us.']
];

export { STEPS, money };
export default P.map(x => ({
  ...x,
  priceLabel: x.price ? money(x.price) : 'By request',
  page: ({ CFG }) => {
    const sealed = x.line === 'sealed';
    const title = sealed ? `${x.name} — Sterling Silver Chain with a Sealed Message` : `${x.name} — Sterling Silver Collar`;
    const desc = sealed
      ? `${x.name} by The Three: unisex oxidized 925 sterling silver chain, made by hand in Los Angeles, engraved with a code that opens a message you seal in our Vault for up to one year. ${x.what} ${money(x.price)}.`
      : `${x.name} from the Ravens collection by The Three: oxidized 925 sterling silver. ${x.what} Made by hand in Los Angeles. By request.`;
    const dep = CFG.deposit[x.slug];
    return {
      path: `pieces/${x.slug}.html`, title, description: desc,
      crumbs: [[sealed ? 'Sealed Chains' : 'Ravens', sealed ? 'collection.html' : 'ravens.html'], [x.name, `pieces/${x.slug}.html`]],
      schema: { '@type': 'Product', name: `The Three ${x.name}`, description: desc, brand: { '@type': 'Brand', name: CFG.name }, material: '925 sterling silver', category: 'Necklaces',
        image: x.shots.map(s => `${CFG.url}/assets/img/photos/${s}.jpg`),
        ...(x.price ? { offers: { '@type': 'Offer', price: x.price, priceCurrency: 'USD', availability: 'https://schema.org/MadeToOrder', url: `${CFG.url}/pieces/${x.slug}.html`,
          hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'US', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' } } } : {}) },
      body: `<section class="wrap page"><div class="product">
<div class="shots">${x.shots.map((s, i) => `<figure><img src="@/assets/img/photos/${s}.jpg" alt="${x.name}, oxidized sterling silver${i ? ', detail' : ''}"${i ? ' loading="lazy"' : ''}></figure>`).join('')}</div>
<div class="buy" data-base="${x.price || 0}" data-name="${x.name}">
  <div style="display:grid;gap:14px"><p class="crumbs"><a href="@/${sealed ? 'collection' : 'ravens'}.html">${sealed ? 'Sealed Chains' : 'Ravens'}</a></p><h1 class="title">${x.name}</h1><p class="it dim">${x.what}</p>${x.price ? `<p class="price num">${money(x.price)}</p>` : '<p class="cap dim">By request</p>'}</div>
  ${sealed ? `<p class="dim">Unisex. Sterling silver, blackened by hand. Engraved with a code that opens <a href="@/vault.html">your sealed letter</a>, on the day you choose, up to one year.</p>` : ''}
  <fieldset class="opt"><legend class="cap">Length</legend>
    <div class="choices">${CFG.lengths.map(([cm, add], i) => `<input type="radio" name="len" id="len-${cm}" value="${cm}" data-add="${add}"${i === 2 ? ' checked' : ''}><label for="len-${cm}">${cm} cm${add && x.price ? ' +$' + add : ''}</label>`).join('')}</div></fieldset>
  <fieldset class="opt"><legend class="cap">Keep something inside</legend>
    <div class="choices">${CFG.memory.map(([k, , add], i) => `<input type="radio" name="mem" id="mem-${k || 'none'}" value="${k}" data-add="${x.price ? add : 0}"${i === 0 ? ' checked' : ''}><label for="mem-${k || 'none'}">${k ? (k === 'hair' ? 'Hair' : 'Tear') + (x.price ? ' +$' + add : '') : 'Nothing'}</label>`).join('')}</div>
    <p class="note">A lock of hair sealed in glass, or a tear on paper sealed in resin, set as one link.</p></fieldset>
  ${x.price ? `<div class="total"><span class="cap">Total</span><span class="num price">${money(x.price)}</span></div>
  <div class="total" style="padding-top:0;border:0"><span class="cap dim">Deposit today, 50%</span><span class="num dim deposit">${money(x.price / 2)}</span></div>` : ''}
  ${dep ? `<a class="btn full" href="${dep}" target="_blank" rel="noopener">Pay the deposit</a>` : ''}
  <button class="btn full req" type="button">${x.price ? (dep ? 'Ask a question' : 'Order') : 'Request'}</button>
  <form class="form" data-form="order" hidden>
    <input type="hidden" name="piece">
    <div class="field"><label for="o-name">Name</label><input id="o-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="o-contact">Email or Instagram</label><input id="o-contact" name="contact" required></div>
    <div class="field"><label for="o-ship">Ships to (city, country)</label><input id="o-ship" name="ship_to"></div>
    <div class="field"><label for="o-note">Note</label><textarea id="o-note" name="note"></textarea></div>
    <button class="btn full" type="submit">Send</button>
    <p class="note">We reply within two days with the deposit invoice. Nothing is charged until you pay it.</p>
    <div class="form-out" aria-live="polite"></div>
  </form>
  <ul class="facts cap dim"><li>Made by hand · ${CFG.leadTime}</li><li>50% deposit · balance before shipping</li><li>Final sale · no returns</li><li>Insured worldwide delivery</li></ul>
</div>
</div></section>`
    };
  }
}));
