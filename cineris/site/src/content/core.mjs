// MARLA KNOX — core pages. Silence first.
export default function core({ CFG, pieces, codex, journal }) {
  const F = CFG.founder;
  const img = n => `@/assets/img/photos/${n}.jpg`;
  const pages = [];

  /* ---------------- THRESHOLD + PROCESSION ---------------- */
  const procession = [
    ['worn-crewneck', pieces[2]], ['necklace-wing', pieces[0], 'wide'], ['wing-detail', pieces[0]],
    ['necklace-heart', pieces[1], 'wide'], ['worn-turtleneck', pieces[0]], ['collar-relics', pieces[3], 'wide'],
    ['ruby-crystal-detail', pieces[2]], ['necklace-serpent', pieces[2], 'wide']
  ];
  pages.push({
    path: 'index.html',
    title: 'Marla Knox',
    description: `Marla Knox. Oxidized sterling silver chains, made by hand to order. Jewelry since ${F.since}. West Hollywood, California.`,
    bare: true,
    body: `
<section class="threshold" aria-label="${CFG.name}">
  <div class="faint" style="background-image:url(${img('necklace-wing')})"></div>
  <div class="lit" style="background-image:url(${img('necklace-wing')})"></div>
  <div class="center"><h1 class="name">Marla Knox</h1></div>
  <p class="hint cap dim">Enter</p>
</section>

<section class="proc" aria-label="Pieces">
${procession.map(([p, x, w]) => `<div class="piece${w ? ' ' + w : ''}"><a href="@/pieces/${x.slug}.html"><figure><img src="${img(p)}" alt="${x.name}" loading="lazy"></figure><span class="label"><span class="cap">${x.name}</span><span class="cap dim num">${x.priceLabel}</span></span></a></div>`).join('\n')}
</section>

<section class="quiet"><p class="line">Since ${F.since}.</p></section>
<section class="quiet" style="min-height:50svh"><a class="cap" href="@/collection.html">Collection</a></section>`
  });

  /* ---------------- COLLECTION ---------------- */
  pages.push({
    path: 'collection.html', title: 'Collection', crumbs: [['Collection', 'collection.html']],
    description: 'Marla Knox collection: No. I, No. II, No. III and the No. IV collar. Oxidized sterling silver, made to order, from $2,400.',
    body: `<section class="wrap page"><div class="grid">${pieces.map(x => `<a href="@/pieces/${x.slug}.html"><figure><img src="${img(x.cover)}" alt="${x.name}" loading="lazy"></figure><span class="row"><span class="cap">${x.name}</span><span class="cap dim num">${x.priceLabel}</span></span></a>`).join('')}</div></section>`
  });

  /* ---------------- VAULT ---------------- */
  pages.push({
    path: 'vault.html', title: 'The Vault', crumbs: [['Vault', 'vault.html']], scripts: ['vault.js'],
    description: 'Every Marla Knox piece can carry a sealed message: words, a photograph or a film, kept in our vault for up to one year and opened only on the day the giver chose.',
    body: `<section class="wrap page"><div class="vault">
<h1 class="title">The Vault</h1>
<p class="dim">A message sealed with the piece. Words, a photograph, a film. It opens on the day you choose, up to one year. Not before.</p>
<form id="vault-form" autocomplete="off" class="field"><label for="vault-code">Code</label><div class="inline"><input id="vault-code" placeholder="MK-0007-K4M9" spellcheck="false"><button class="btn" type="submit">Open</button></div></form>
<p class="out" id="vault-out" aria-live="polite">&nbsp;</p>
<div class="samples"><button type="button" data-target="vault-code">MK-0001-ASHE</button><button type="button" data-target="vault-code">MK-0007-K4M9</button></div>
</div></section>`
  });

  /* ---------------- HOUSE ---------------- */
  const steps = [
    [String(F.since), 'Revenge', 'A first jewelry house.'],
    ['France', 'Fashion design', 'Trained as a designer.'],
    ['Ten years', 'Fashion weeks', 'A decade of shows.'],
    ['', '8 Billion People', 'Clothing.'],
    ['', 'The Three', 'Couture streetwear. Cashmere, hand stitches, open seams.'],
    ['Now', 'Marla Knox', 'West Hollywood.']
  ];
  pages.push({
    path: 'house.html', title: 'House', crumbs: [['House', 'house.html']],
    description: `Marla Knox founded her first jewelry house, Revenge, in ${F.since}, trained in fashion design in France, spent ten years at fashion weeks with 8 Billion People and The Three, and now makes jewelry in West Hollywood.`,
    body: `<section class="wrap page">
<div class="page-head"><h1 class="title">Since ${F.since}</h1></div>
<ol class="timeline">${steps.map(([y, t, d]) => `<li data-reveal><span class="cap dim num">${y}</span><div><h3>${t}</h3><p class="dim it">${d}</p></div></li>`).join('')}</ol>
<figure style="margin:120px 0 0;max-width:560px"><img src="${img('worn-turtleneck')}" alt="" loading="lazy"></figure>
</section>`
  });

  /* ---------------- CONTACT ---------------- */
  pages.push({
    path: 'contact.html', title: 'Contact', crumbs: [['Contact', 'contact.html']],
    description: `Contact the Marla Knox studio in ${CFG.city}, California. Online orders, worldwide delivery, private requests.`,
    body: `<section class="wrap page"><div class="vault">
<h1 class="title">Contact</h1>
<p class="dim">Studio in ${CFG.city}. Online, by request. Worldwide delivery.</p>
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

  /* ---------------- QUIET PAGES ---------------- */
  const prose = (path, title, description, html) => ({ path, title, description, crumbs: [[title, path]], body: `<section class="wrap page"><div class="page-head"><h1 class="title">${title}</h1></div><article class="prose">${html}</article></section>` });
  const list = (path, title, items, dir, description) => ({ path, title, description, crumbs: [[title, path]], body: `<section class="wrap page"><div class="page-head"><h1 class="title">${title}</h1></div><ul class="list">${items.map(x => `<li><a href="@/${dir}/${x.slug}.html"><span class="cap">${x.short || x.title}</span><small>${x.description}</small></a></li>`).join('')}</ul></section>` });
  pages.push(list('journal.html', 'Journal', journal, 'journal', 'Notes from the Marla Knox studio: how to wear a silver chain, memory jewelry, gifts, care.'));
  pages.push(list('codex.html', 'Codex', codex, 'codex', 'On silver and old jewelry: oxidized silver, hallmarks, chain lengths, cameos, rubies, hair jewelry, tear bottles.'));
  pages.push(prose('terms.html', 'Terms', 'Marla Knox terms of sale: made to order, final sale, no returns or exchanges, defects repaired, vault messages up to one year.',
    `<p><b>All sales are final. Every piece is made to order for one person; we do not accept returns or exchanges, and payments are not refundable once work has begun.</b></p>
<p>A 50% deposit begins the work; the balance is due before delivery. You may cancel within 24 hours of the deposit, before work starts, for a full refund.</p>
<p>925 sterling silver; gold is solid 18k; stones are natural. Defects in materials or workmanship are repaired or remade free of charge. Workmanship is repaired for life. Nothing here limits your rights under the law where you live.</p>
<p>Hair and tears are sealed at your request; keep a portion of anything irreplaceable.</p>
<p>Vault messages are stored encrypted and released on the date set by the giver, at most one year after delivery. If the house ever closes, sealed messages are released to the person who sealed them with 90 days’ notice.</p>`));
  pages.push(prose('privacy.html', 'Privacy', 'How Marla Knox handles personal data and sealed messages.',
    `<p>We keep what we need to make and deliver your piece. We do not sell it. Sealed messages are encrypted and unreadable until their date. California residents may request access or deletion at ${CFG.email}.</p>`));
  pages.push(prose('care.html', 'Care', 'How to care for oxidized sterling silver: dry cloth only, never silver dip. Lifetime repair of workmanship.',
    `<p>A dry cloth. Never silver dip or polish. Keep it closed in its box. The silver brightens where it touches you; that is intended. Workmanship is repaired for life.</p>`));
  const FAQ = [
    ['Material', '925 sterling silver, oxidized by hand. Solid 18k gold. Natural stones.'],
    ['Time', 'Three to four weeks. Each piece is made to order.'],
    ['Length', '45 to 70 cm. Chosen on the piece.'],
    ['Hair or a tear', 'A lock of hair sealed in glass, or a tear on paper sealed in resin, set as one link.'],
    ['The Vault', 'A sealed message, opened on the day you choose, up to one year.'],
    ['Returns', 'Final sale. Workmanship repaired for life.'],
    ['Where', `Studio in ${CFG.city}, California. Online. Worldwide delivery.`]
  ];
  pages.push({ ...prose('faq.html', 'Questions', 'Marla Knox: materials, timing, lengths, hair and tear links, the vault, final sale, delivery.', FAQ.map(([q, a]) => `<h2>${q}</h2><p>${a}</p>`).join('')),
    schema: { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) } });
  pages.push({ path: '404.html', noindex: true, title: 'Nothing here', description: 'Not found.', bare: true, body: `<section class="quiet" style="min-height:100svh"><a class="cap" href="@/index.html">Marla Knox</a></section>` });
  return pages;
}
