// KEPT — core pages. Few words. Objects first.
const chainSvg = (segs, shape = 'loop', extra = '') => `<svg data-chain='${JSON.stringify(segs)}' data-shape="${shape}" ${extra} aria-hidden="true"></svg>`;

export default function core({ CFG, pieces, codex, journal }) {
  const E = CFG.edition;
  const chains = pieces.filter(x => x.group === 'chain');
  const memory = pieces.filter(x => x.group === 'memory');
  const objects = pieces.filter(x => x.group === 'object');
  const money = n => '$' + n.toLocaleString('en-US');
  const card = x => `<a class="card" href="@/pieces/${x.slug}.html"><div class="plate" data-parallax>${chainSvg(x.segs, x.shape || 'loop', x.numeral ? `data-numeral="${x.numeral}"` : '')}</div><div class="row"><h3>${x.name}</h3><span class="mute num">${x.priceLabel}</span></div></a>`;
  const pages = [];

  /* ---------------- HOME ---------------- */
  pages.push({
    path: 'index.html',
    title: 'KEPT — Silver for what you keep · Los Angeles',
    description: 'KEPT makes sterling silver chains by hand on Melrose Avenue, Los Angeles. Fine chain that breaks into forged weight at one black link with a gold point. A tear, a voice or a lock of hair, kept in silver.',
    body: `
<section class="hero">
  <div class="stage" aria-hidden="true"><svg id="hero-chain"></svg></div>
  <div class="wrap">
    <h1 class="word">KEPT</h1>
    <div class="under">
      <p class="lede">Silver for what you keep.</p>
      <div class="actions"><a class="link-arrow" href="@/collection.html">Collection</a><span class="cap">Melrose Ave, Los Angeles</span></div>
    </div>
  </div>
</section>

<section class="break" aria-label="The Break">
  <div class="wrap grid3">
    <div class="words"><b>Fine.</b><b>The Mark.</b><b>Weight.</b></div>
    <svg aria-hidden="true"></svg>
    <p class="note mute">Every chain turns from 2.4&nbsp;mm to forged 11&nbsp;mm at one black link with a gold point. Always on the left.</p>
  </div>
</section>

<section class="sec" style="padding-bottom:40px">
  <div class="wrap stack"><p class="cap">Collection</p></div>
</section>
<section class="rail-wrap" aria-label="Collection">
  <div class="rail">${chains.map(card).join('')}</div>
</section>

<section class="sec">
  <div class="wrap"><p class="statement" data-reveal>A tear. A voice. A lock of hair. <span class="serif">Kept.</span></p></div>
</section>

<section aria-label="Memory">
  <div class="mem">
    ${memory.map(x => `<a href="@/pieces/${x.slug}.html"><div class="plate">${chainSvg(x.segs, 'line', 'data-fixed="false"')}</div><h3>${x.name}</h3><p class="mute">${x.short}</p></a>`).join('')}
    <a href="@/message.html"><div class="plate">${chainSvg([{ t: 'cable', cm: 3 }, { t: 'passport' }, { t: 'cable', cm: 3 }], 'line', 'data-fixed="false"')}</div><h3>Message</h3><p class="mute">Sealed until a date you choose.</p></a>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div class="plate" data-parallax style="aspect-ratio:4/5">${chainSvg([{ t: 'cable', cm: 14 }, { t: 'ash' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 16 }], 'loop', `data-numeral="${E.no}"`)}<span class="tag cap">Edition ${E.no}</span></div>
    <div class="stack" data-reveal>
      <p class="cap">Edition ${E.no} · ${E.chains} chains</p>
      <h2>${E.title}.</h2>
      <p class="mute">One letter, burned unread. Its ash sealed inside the Mark of ten chains. Never made again.</p>
      <div class="actions"><a class="link-arrow" href="@/edition.html">Edition ${E.no}</a></div>
    </div>
  </div>
</section>

<section class="sec" style="border-top:1px solid var(--line)">
  <div class="wrap split">
    <h2 data-reveal>By appointment<br>on Melrose.</h2>
    <div class="stack" data-reveal>
      <p class="mute">Every chain is made by hand for one person. Nine to twenty-one days.</p>
      <div class="actions"><a class="btn" href="@/atelier.html">Book an appointment</a></div>
    </div>
  </div>
</section>`
  });

  /* ---------------- COLLECTION ---------------- */
  pages.push({
    path: 'collection.html', title: 'Collection', crumbs: [['Collection', 'collection.html']],
    description: 'KEPT sterling silver chains: Break, Ruby, Old Diamond, Pearl, Tear and Voice. Handmade to order in Los Angeles from $1,800.',
    head: `<h1>Collection</h1>`,
    body: `<section class="wrap" style="padding-bottom:120px">
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:40px 16px">${chains.map(card).join('')}</div>
<p class="cap" style="margin:120px 0 24px">Objects</p>
<ul class="list">${[...objects, ...pieces.filter(x => x.group === 'house')].map(x => `<li><a href="@/pieces/${x.slug}.html"><span><h3>${x.name}</h3><small>${x.short}</small></span><span class="mute num">${x.priceLabel}</span></a></li>`).join('')}</ul>
</section>`
  });

  /* ---------------- MEMORY ---------------- */
  pages.push({
    path: 'memory.html', title: 'Memory links: a tear, a voice, a lock of hair', crumbs: [['Memory', 'memory.html']],
    description: 'Keep a tear, a voice or a lock of hair inside a sterling silver chain. Tear on paper sealed in resin, a voice engraved as a waveform with NFC, hair sealed in glass. KEPT, Los Angeles.',
    head: `<h1>Memory</h1><p class="lede" style="margin-top:28px">Some things should not be photographed. They should be worn.</p>`,
    body: `<section class="mem" style="margin-bottom:120px">
${memory.map(x => `<a href="@/pieces/${x.slug}.html"><div class="plate">${chainSvg(x.segs, 'line', 'data-fixed="false"')}</div><h3>${x.name} <span class="mute num">· ${x.priceLabel}</span></h3><p class="mute">${x.short}</p></a>`).join('')}
<a href="@/message.html"><div class="plate">${chainSvg([{ t: 'cable', cm: 3 }, { t: 'passport' }, { t: 'cable', cm: 3 }], 'line', 'data-fixed="false"')}</div><h3>Message <span class="mute">· included</span></h3><p class="mute">Text, a photo or a film, sealed until a date you choose.</p></a>
</section>`
  });

  /* ---------------- MESSAGE (vault) ---------------- */
  pages.push({
    path: 'message.html', title: 'Message: sealed until the date you choose', crumbs: [['Message', 'message.html']], scripts: ['vault.js'],
    description: 'Every KEPT chain has a code and a sealed message: text, photo or video that opens only on the date the giver chooses. Enter your code to see how long is left.',
    head: `<h1>Message</h1><p class="lede" style="margin-top:28px">Every chain carries a code and a sealed message. It opens on the date the giver chose. Not before.</p>`,
    body: `<section class="wrap split" style="align-items:start;padding-bottom:140px">
<div class="terminal">
  <form id="vault-form" class="stack" autocomplete="off">
    <label class="cap" for="vault-code">Code on the plate</label>
    <div class="inline-form"><input id="vault-code" placeholder="KP-0007-K4M9" spellcheck="false"><button class="btn" type="submit">Open</button></div>
  </form>
  <p class="out" id="vault-out" aria-live="polite">&nbsp;</p>
  <div class="samples"><button type="button" data-target="vault-code">KP-0001-ASHE</button><button type="button" data-target="vault-code">KP-0007-K4M9</button></div>
</div>
<div class="stack mute">
  <p>A proposal that opens in ninety days. A letter from a father, at eighteen. A note to yourself, in a year.</p>
  <p>The giver seals it. The wearer sees only how long is left.</p>
  <p class="cap">Demonstration codes above.</p>
</div>
</section>`
  });

  /* ---------------- EDITION ---------------- */
  pages.push({
    path: 'edition.html', title: `Edition ${E.no}: ${E.title}`, crumbs: [[`Edition ${E.no}`, 'edition.html']],
    description: `KEPT Edition ${E.no}: ten sterling silver chains whose black Mark holds the ash of one letter, burned unread. Numbered 1 to 10. Never repeated.`,
    head: `<p class="cap">Edition ${E.no} · ${E.chains} chains · ${E.status}</p><h1 style="margin-top:18px">${E.title}</h1>`,
    body: `<section class="wrap split" style="align-items:start;padding-bottom:140px">
<div class="plate" style="aspect-ratio:4/5">${chainSvg([{ t: 'cable', cm: 14 }, { t: 'ash' }, { t: 'forged', cm: 10 }, { t: 'cable', cm: 16 }], 'loop', `data-numeral="${E.no}"`)}</div>
<div class="stack">
  <p class="lede">A letter inside an old locket, marked <span class="serif">not to be opened.</span></p>
  <p class="mute">We never opened it. We burned it, divided the ash into ten, and sealed it behind the gold point of ten Marks. Numbered 1 to 10. When the tenth is made, the edition closes.</p>
  <div class="actions"><a class="btn" href="@/atelier.html">Apply</a></div>
</div>
</section>`
  });

  /* ---------------- ATELIER ---------------- */
  pages.push({
    path: 'atelier.html', title: 'Atelier on Melrose Avenue', crumbs: [['Atelier', 'atelier.html']],
    description: `Book a private appointment at the KEPT atelier on Melrose Avenue, Los Angeles. Custom handmade sterling silver chains. ${CFG.hours}`,
    head: `<h1>Atelier</h1><p class="lede" style="margin-top:28px">${CFG.address.street}, ${CFG.address.city}. ${CFG.hours}</p>`,
    body: `<section class="wrap split" style="align-items:start;padding-bottom:140px">
<div class="stack mute">
  <p>One hour. We measure, you hold the weight, we choose the object. Bring the tear, the voice, the hair.</p>
  <p>Nine to twenty-one days at the bench. Insured shipping worldwide.</p>
  <div class="actions"><a class="link-arrow" href="${CFG.mapsUrl}" target="_blank" rel="noopener">Google Maps</a></div>
</div>
<form class="form" data-form="appointment">
  <div class="row"><div class="field"><label for="a-name">Name</label><input id="a-name" name="name" autocomplete="name" required></div><div class="field"><label for="a-contact">Email or Instagram</label><input id="a-contact" name="contact" required></div></div>
  <div class="row"><div class="field"><label for="a-kind">For</label><select id="a-kind" name="kind"><option>Appointment on Melrose</option><option>Video appointment</option><option>Edition ${E.no}</option><option>Press and styling</option></select></div><div class="field"><label for="a-when">When</label><input id="a-when" name="when"></div></div>
  <div class="field"><label for="a-note">Note</label><textarea id="a-note" name="note"></textarea></div>
  <p class="mute" style="font-size:.85rem">Made to order. Final sale. <a href="@/terms.html">Terms</a>.</p>
  <div class="actions"><button class="btn" type="submit">Send</button></div>
  <div class="form-out" aria-live="polite"></div>
</form>
</section>`
  });

  /* ---------------- INDEXES ---------------- */
  const idx = (path, title, list, section, description) => ({
    path, title, description, crumbs: [[title, path]], narrow: true, head: `<h1>${title}</h1>`,
    body: `<section class="wrap narrow" style="padding-bottom:140px"><ul class="list">${list.map(x => `<li><a href="@/${section}/${x.slug}.html"><span><h3>${x.short || x.title}</h3><small>${x.description}</small></span><span class="cap">Read</span></a></li>`).join('')}</ul></section>`
  });
  pages.push(idx('journal.html', 'Journal', journal, 'journal', 'Notes from the KEPT atelier in Los Angeles: how to wear a silver chain, silver with diamonds, memory jewelry, gifts and custom chains on Melrose.'));
  pages.push(idx('codex.html', 'Codex', codex, 'codex', 'Reference on silver and old jewelry: oxidized silver, 925 hallmarks, chain lengths, cameos, rubies, hair jewelry and tear bottles.'));

  /* ---------------- SMALL PAGES ---------------- */
  const small = (path, title, description, html) => ({ path, title, description, crumbs: [[title, path]], narrow: true, head: `<h1>${title}</h1>`, body: `<article class="wrap narrow prose">${html}</article>` });
  pages.push(small('care.html', 'Care', 'How to care for oxidized sterling silver: dry cloth only, no silver dip. Lifetime repair of workmanship at the KEPT atelier.',
    `<p>Wipe with a dry cloth. Never use silver dip or polish; it removes the black. Keep it in its case. The silver brightens where you touch it. That is intended.</p><p>We repair workmanship for life. Re-blackening on request.</p>`));
  pages.push(small('terms.html', 'Terms', 'KEPT terms of sale: made to order, 50% deposit, final sale with no returns or exchanges, defects repaired, message terms.',
    `<p><b>All sales are final. Every chain is made to order for one person, so we do not accept returns or exchanges, and payments are not refundable once work has begun.</b></p>
<p>A 50% deposit begins the work; the balance is due before delivery. You may cancel within 24 hours of the deposit, before work starts, for a full refund.</p>
<p>Every chain is 925 sterling silver; gold is solid 18k. Defects in materials or workmanship are repaired or remade free of charge. Workmanship is repaired for life. Nothing here limits your rights under the law where you live.</p>
<p>Tears, hair and recordings are sealed at your request. Keep a copy of anything irreplaceable.</p>
<p>Messages are stored encrypted and released on the date set by the giver. If KEPT ever closes, we will give 90 days’ notice and release every sealed message to the person who sealed it.</p>
<p class="mute">${CFG.email}</p>`));
  pages.push(small('privacy.html', 'Privacy', 'How KEPT handles personal data and sealed messages.',
    `<p>We keep what we need to make and deliver your chain. We do not sell it. Sealed messages are encrypted and unreadable until their date. California residents may request access or deletion at ${CFG.email}.</p>`));
  const FAQ = [
    ['Is it real silver?', '925 sterling silver, hallmarked. Gold is solid 18k. Stones are natural.'],
    ['How do I recognise a KEPT chain?', 'Fine chain that turns into forged weight at one black link with a gold point. Weight on the left.'],
    ['How much?', `From ${money(CFG.priceFrom)}. Most chains are $2,150 to $2,800.`],
    ['How long?', 'Nine to twenty-one days.'],
    ['Returns?', 'Final sale. Every chain is made for one person. Workmanship repaired for life.'],
    ['How is a tear kept?', 'You drop it on blotting paper, it stains the paper, and we seal the paper in clear resin inside a silver link.'],
    ['How does Voice work?', 'You record ten seconds. We engrave the waveform on the link and set an NFC chip; tap a phone to hear it.'],
    ['Where?', `By appointment on ${CFG.address.street}, ${CFG.address.city}. Video appointments worldwide.`]
  ];
  pages.push({ ...small('faq.html', 'Questions', 'KEPT questions: real silver, prices, timing, final sale, how a tear and a voice are kept, Melrose atelier.', FAQ.map(([q, a]) => `<h2>${q}</h2><p>${a}</p>`).join('')),
    schema: { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) } });
  pages.push({ path: '404.html', noindex: true, title: 'Not here', description: 'Page not found.', head: `<h1>Not here.</h1><div class="actions" style="margin-top:32px"><a class="link-arrow" href="@/index.html">KEPT</a></div>`, body: '<div style="height:30vh"></div>' });
  return pages;
}
