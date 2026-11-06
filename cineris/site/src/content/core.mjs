// THE THREE — Fine Jewelry. Core pages.
import { STEPS, money } from './pieces.mjs';

export default function core({ CFG, pieces, codex, journal }) {
  const F = CFG.founder;
  const img = n => `@/assets/img/photos/${n}.jpg`;
  const sealed = pieces.filter(x => x.line === 'sealed');
  const ravens = pieces.filter(x => x.line === 'ravens');
  const from = money(Math.min(...sealed.map(x => x.price)));
  const pages = [];

  const stepsHtml = `<ol class="steps">${STEPS(CFG.leadTime).map(([t, d], i) => `<li data-reveal><span class="cap dim num">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p class="dim">${d}</p></li>`).join('')}</ol>`;
  const receive = ['The chain, forged and blackened by hand, in the length you chose', 'A code engraved by the clasp, hallmarked 925 and with the house mark', 'One letter in the Vault: words, a photograph or a film, sealed for up to a year', 'A black box, a wax seal, a card with your code', 'Repairs of workmanship, for life'];
  const terms = [`Made by hand · ${CFG.leadTime}`, '50% deposit to begin', 'Balance before shipping', 'Final sale · no returns or exchanges', 'Insured delivery worldwide'];

  /* ---------------- HOME ---------------- */
  pages.push({
    path: 'index.html',
    title: 'The Three — Fine Jewelry, Los Angeles',
    description: `The Three Fine Jewelry: unisex sterling silver chains made by hand in Los Angeles, each engraved with a code that opens a letter you seal in our Vault for up to one year. From ${from}. Jewelry by ${F.name} since ${F.since}.`,
    body: `
<section class="threshold" aria-label="${CFG.name}">
  <div class="faint" style="background-image:url(${img('necklace-wing')})"></div>
  <div class="lit" style="background-image:url(${img('necklace-wing')})"></div>
  <div class="center"><h1 class="sr">The Three Fine Jewelry — sterling silver chains with a sealed letter</h1><img class="hero3" src="@/assets/img/three.png" alt=""><p class="type dim">fine jewelry<br>los angeles</p></div>
  <p class="hint cap dim">Enter</p>
</section>

<section class="quiet"><div class="intro" data-reveal>
  <p class="cap dim">The Sealed Chain</p>
  <h2 class="title">A chain that carries a letter.</h2>
  <p class="dim">Sterling silver, blackened by hand. For any neck. Engraved with a code that opens a letter you seal, on the day you choose, up to one year later.</p>
</div></section>

<section class="proc" aria-label="Sealed chains">
${sealed.map((x, i) => `<div class="piece${i % 2 ? '' : ' wide'}"><a href="@/pieces/${x.slug}.html"><figure><img src="${img(x.cover)}" alt="${x.name}, oxidized sterling silver chain" loading="lazy"></figure><span class="label"><span class="cap">${x.short}</span><span class="cap dim num">${x.priceLabel}</span></span></a></div>`).join('\n')}
</section>

<section class="wrap block" aria-labelledby="how">
  <div class="page-head"><p class="cap dim">How it works</p><h2 class="title" id="how">Six steps. One year at most.</h2></div>
  ${stepsHtml}
</section>

<section class="wrap block two">
  <div><p class="cap dim">What you receive</p><ul class="plain">${receive.map(r => `<li data-reveal>${r}</li>`).join('')}</ul></div>
  <div><p class="cap dim">The terms</p><ul class="plain">${terms.map(r => `<li data-reveal>${r}</li>`).join('')}</ul><p style="margin-top:36px"><a class="btn" href="@/collection.html">Choose a chain · from ${from}</a></p></div>
</section>

<section class="quiet"><div class="intro" data-reveal>
  <p class="cap dim">The Legend</p>
  <p class="it big">In ${F.since} a man left her a chain and a sealed letter. On it, three words: <span class="nobr">not for one year.</span> She waited. Inside were three sentences.</p>
  <a class="cap" href="@/legend.html">Read the legend</a>
</div></section>

<section class="wrap block" aria-labelledby="rv">
  <div class="page-head"><p class="cap dim">A separate collection</p><h2 class="title" id="rv">Ravens</h2></div>
  <div class="grid three">${ravens.map(x => `<a href="@/pieces/${x.slug}.html"><figure><img src="${img(x.cover)}" alt="${x.name}" loading="lazy"></figure><span class="row"><span class="cap">${x.short}</span><span class="cap dim">By request</span></span></a>`).join('')}</div>
</section>`
  });

  /* ---------------- SEALED CHAINS ---------------- */
  pages.push({
    path: 'collection.html', title: 'Sealed Chains — Unisex Sterling Silver Chains with a Sealed Message', crumbs: [['Sealed Chains', 'collection.html']],
    description: `Sealed Chains by The Three: unisex oxidized sterling silver chains made by hand in Los Angeles, each with a code that opens a letter sealed in our Vault for up to one year. From ${from}. 50% deposit, ${CFG.leadTime}, final sale.`,
    body: `<section class="wrap page"><div class="page-head"><h1 class="title">Sealed Chains</h1><p class="dim">Unisex. Sterling silver, blackened by hand. Each carries a letter that waits.</p></div>
<div class="grid">${sealed.map(x => `<a href="@/pieces/${x.slug}.html"><figure><img src="${img(x.cover)}" alt="${x.name}, unisex sterling silver chain" loading="lazy"></figure><span class="row"><span class="cap">${x.short}</span><span class="cap dim num">${x.priceLabel}</span></span></a>`).join('')}</div>
<div style="margin-top:140px">${stepsHtml}</div></section>`
  });

  /* ---------------- RAVENS ---------------- */
  pages.push({
    path: 'ravens.html', title: 'Ravens — Sterling Silver Collars and Charm Chains', crumbs: [['Ravens', 'ravens.html']],
    description: 'Ravens by The Three: a separate collection of oxidized sterling silver collars and chains with ravens, garnets, cameos, carved bone and gothic initials. Made by hand in Los Angeles, by request.',
    body: `<section class="wrap page"><div class="page-head"><h1 class="title">Ravens</h1><p class="dim">A separate collection. By request.</p></div>
<div class="grid">${ravens.map(x => `<a href="@/pieces/${x.slug}.html"><figure><img src="${img(x.cover)}" alt="${x.name}" loading="lazy"></figure><span class="row"><span class="cap">${x.short}</span><span class="cap dim">By request</span></span></a>`).join('')}</div></section>`
  });

  /* ---------------- LEGEND ---------------- */
  const chapters = [
    ['I', 'The letter', `In the winter of ${F.since}, ${F.name} had a jewelry house called Revenge, and a man who wore the first chain she ever made. The night he left, he took the chain off, wrapped it around a sealed envelope and closed her hand over both. On the envelope he had written three words. <em>Not for one year.</em>`],
    ['II', 'The year', 'She did not open it. She wore his chain instead, under her collar, every day for three hundred and sixty-five days. It was too long for her and too heavy, and she never took it off. She trained in France. She walked into ten years of fashion weeks. She made clothes for strangers. The envelope stayed shut.'],
    ['III', 'Three sentences', 'On the last night of the year she opened it. Inside were three sentences. She has never told anyone what they were. She says only that after them, revenge was impossible.'],
    ['IV', 'The Three', 'She closed Revenge. She kept the chain. Everything she has made since carries the name of that night: The Three. First the clothes. Then the silver.'],
    ['V', 'The rule', 'From that night the house has one rule. Every chain we make carries a letter that waits. Never longer than a year, because she waited a year, and that was enough.'],
    ['VI', 'The chain', 'Every chain is cut from his: a man’s chain, worn by whoever it was given to. That is why ours belong to no one gender. Silver, blackened by hand. A clasp engraved with a code. Behind the code, in our vault, a letter that no one can read before its day. Not the one who wears it. Not the one who sent it. Not us.']
  ];
  pages.push({
    path: 'legend.html', title: 'The Legend of The Three', crumbs: [['Legend', 'legend.html']],
    description: `The legend of The Three: in ${F.since} a man left ${F.name} a chain and a sealed letter marked "not for one year". She waited. Inside were three sentences. Every chain the house makes now carries a letter that waits.`,
    body: `<section class="wrap page">
<div class="page-head"><h1 class="title">The Legend</h1></div>
<ol class="timeline">${chapters.map(([n, t, d]) => `<li data-reveal><span class="cap dim">${n}</span><div style="display:grid;gap:12px"><h3>${t}</h3><p class="it">${d}</p></div></li>`).join('')}</ol>
<div class="quiet" style="min-height:50svh"><div class="intro" data-reveal><p class="it big">You will understand the three sentences when your own letter opens.</p><a class="btn" href="@/collection.html">The Sealed Chains</a></div></div>
</section>`
  });

  /* ---------------- VAULT: open ---------------- */
  pages.push({
    path: 'vault.html', title: 'The Vault — Open a Sealed Letter', crumbs: [['Vault', 'vault.html']], scripts: ['vault.js'],
    description: 'The Vault of The Three: enter the code engraved by the clasp of your chain to open the letter sealed for you. If the day has not come, the Vault tells you only how long to wait.',
    body: `<section class="wrap page"><div class="vault">
<h1 class="title">The Vault</h1>
<p class="dim">Every chain carries a code by the clasp. Behind it, a letter. Enter the code. If its day has not come, the Vault tells you only how long to wait.</p>
<form id="vault-form" autocomplete="off" class="field"><label for="vault-code">Code</label><div class="inline"><input id="vault-code" placeholder="TT-0007-K4M9" spellcheck="false"><button class="btn" type="submit">Open</button></div></form>
<div class="out" id="vault-out" aria-live="polite">&nbsp;</div>
<div class="samples"><span class="cap dim">Try</span><button type="button" data-target="vault-code">TT-0001-ASHE</button><button type="button" data-target="vault-code">TT-0007-K4M9</button></div>
<p class="cap" style="margin-top:40px"><a href="@/seal.html">Seal a letter</a></p>
<p class="note mode-note"></p>
</div></section>`
  });

  /* ---------------- VAULT: seal ---------------- */
  pages.push({
    path: 'seal.html', title: 'Seal a Letter in the Vault', crumbs: [['Vault', 'vault.html'], ['Seal', 'seal.html']], scripts: ['vault.js'],
    description: 'Seal a letter in the Vault of The Three: words, a photograph or a film, opened only on the day you choose, up to one year after delivery. You need the code from your order.',
    body: `<section class="wrap page"><div class="vault">
<h1 class="title">Seal a Letter</h1>
<p class="dim">You need the code we sent with your order. What you seal here cannot be read before the day you choose. Not by the wearer, not by you, not by us. You cannot change it afterwards.</p>
<form id="seal-form" class="form" autocomplete="off">
  <div class="field"><label for="s-code">Code</label><input id="s-code" name="code" placeholder="TT-0000-XXXX" required spellcheck="false" style="letter-spacing:.2em;text-transform:uppercase"></div>
  <div class="field"><label for="s-from">From (leave empty to stay anonymous)</label><input id="s-from" name="from" maxlength="80"></div>
  <div class="field"><label for="s-text">The letter</label><textarea id="s-text" name="text" maxlength="5000" required style="min-height:12em"></textarea></div>
  <div class="field"><label for="s-file">A photograph or a short film (optional, up to 50 MB)</label><input id="s-file" name="file" type="file" accept="image/*,video/*"></div>
  <div class="field"><label for="s-date">Opens on</label><input id="s-date" name="opens" type="date" required></div>
  <div class="field"><label for="s-notify">Email to tell on the day (optional)</label><input id="s-notify" name="notify" type="email"></div>
  <label class="check"><input type="checkbox" id="s-ok" required> I understand this letter cannot be opened early or changed.</label>
  <button class="btn" type="submit">Seal</button>
  <div class="out" id="seal-out" aria-live="polite"></div>
  <p class="note mode-note"></p>
</form>
</div></section>`
  });

  /* ---------------- CONTACT ---------------- */
  pages.push({
    path: 'contact.html', title: 'Contact', crumbs: [['Contact', 'contact.html']],
    description: `Contact The Three Fine Jewelry, ${CFG.city}, California. Orders, private requests, press.`,
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
  pages.push(list('journal.html', 'Journal', journal, 'journal', 'The Three journal: how to wear a sterling silver chain, meaningful gifts, memorial jewelry with hair, time-capsule jewelry, proposals, care.'));
  pages.push(list('codex.html', 'Codex', codex, 'codex', 'The Three codex: oxidized silver, 925 hallmarks, chain lengths, Byzantine and Balinese chains, cameos, rubies, Victorian mourning and hair jewelry.'));
  pages.push(prose('terms.html', 'Terms of Sale', 'The Three terms of sale: made to order by hand, 50% deposit, balance before shipping, final sale with no returns or exchanges, defects repaired, Vault letters up to one year.',
    `<p><b>All sales are final. Every piece is made to order for one person; we do not accept returns or exchanges, and payments are not refundable once work has begun.</b></p>
<h2>Deposit</h2><p>A 50% deposit begins the work. The balance is due before the piece ships. You may cancel within 24 hours of paying the deposit, before work starts, for a full refund.</p>
<h2>Making</h2><p>Each piece is made by hand in Los Angeles in ${CFG.leadTime}. We tell you if anything changes.</p>
<h2>Materials</h2><p>925 sterling silver, oxidized by hand. Gold is solid 18k. Stones are natural. Defects in materials or workmanship are repaired or remade free of charge, and workmanship is repaired for life. Nothing here limits your rights under the law where you live.</p>
<h2>Hair and tears</h2><p>Sealed at your request. Keep a portion of anything irreplaceable.</p>
<h2>The Vault</h2><p>Letters are stored encrypted and released on the date set by the sender, at most one year after delivery. Content must be lawful. If the house ever closes, sealed letters are released to their senders with 90 days’ notice.</p>
<h2>Delivery</h2><p>Insured, signature on delivery, worldwide. Duties outside the United States are paid by the recipient.</p>`));
  pages.push(prose('privacy.html', 'Privacy', 'How The Three handles personal data and sealed letters.',
    `<p>We keep what we need to make and deliver your piece. We do not sell it. Sealed letters are encrypted and unreadable until their date. California residents may request access or deletion at ${CFG.email}.</p>`));
  pages.push(prose('care.html', 'Care of Oxidized Silver', 'How to care for oxidized sterling silver: a dry cloth, never silver dip. Lifetime repair of workmanship.',
    `<p>A dry cloth. Never silver dip or polish: they remove the black. Keep it closed in its box. The silver brightens where it touches you; that is intended. Workmanship is repaired for life.</p>`, 'Care'));
  const FAQ = [
    ['What is a Sealed Chain?', 'A unisex sterling silver chain, made by hand, engraved with a code. Behind the code, in our Vault, is a letter from the person who gave it: words, a photograph or a film. It opens on the day they chose, up to one year later.'],
    ['How do I buy one?', `Choose the chain and length and press Order. We reply within two days with an invoice for a 50% deposit. The work begins when it is paid; the balance is due before shipping.`],
    ['How much?', `From ${from}. Lengths of 60 and 70 cm and a hair or tear link cost extra; the total is shown on each chain.`],
    ['How long does it take?', `${CFG.leadTime}. Every piece is made by hand in Los Angeles.`],
    ['Can I return it?', 'No. Every piece is made to order for one person, so all sales are final. Defects are repaired or remade free of charge, and workmanship is repaired for life.'],
    ['Is it for men or women?', 'Both. The first chain was a man’s chain worn by a woman. Ours belong to no one gender.'],
    ['Is it fine jewelry if it is silver?', 'Yes. Sterling silver is a precious metal; our pieces add solid 18k gold and natural stones, and are made by hand. Fine jewelry is the right name.'],
    ['How do I seal the letter?', 'With your order you receive a code. On the Seal page you write the letter, add a photograph or a film if you want, and choose the day it opens, up to one year ahead. It cannot be opened early or changed.'],
    ['Can I add hair or a tear?', 'Yes. A lock of hair sealed in glass, or a tear dropped on paper and sealed in resin, set as one link.'],
    ['Do you ship worldwide?', 'Yes, insured, with signature on delivery.']
  ];
  pages.push({ ...prose('faq.html', 'Questions — How to Buy, Price, Timing, Returns', 'The Three questions: what a Sealed Chain is, how to buy, price, deposit, timing, final sale, unisex, fine jewelry in sterling silver, sealing a letter, hair and tear links, delivery.', FAQ.map(([q, a]) => `<h2>${q}</h2><p>${a}</p>`).join(''), 'Questions'),
    schema: { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) } });
  pages.push({ path: '404.html', noindex: true, title: 'Nothing here', description: 'Not found.', body: `<section class="quiet" style="min-height:100svh"><a class="cap" href="@/index.html">The Three</a></section>` });
  return pages;
}
