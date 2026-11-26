import { site, plans, addons, offer } from './config.mjs';
import { services, serviceGroups } from './data/services.mjs';
import { audiences } from './data/audiences.mjs';
import { locations, regions, travelRule } from './data/locations.mjs';
import { guides } from './data/guides.mjs';
import { esc, makeLinker, leadForm, faqBlock, faqSchema, crumbSchema, crumbs, canonical } from './layout.mjs';
import { generalFaqs, checkpoints } from './home.mjs';

const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
const needFor = { 'home-watch': 0, 'mail-package-handling': 1, 'vendor-contractor-access': 2, 'vacant-listing-care': 3, 'pre-sale-preparation-staging': 4, 'sell-your-home': 5, 'estate-property-care': 6, 'power-of-attorney-services': 6, 'renovation-oversight': 7 };

const hero = (path, { crumbs: c, eyebrow, h1, lead, price, cta = true, lang = 'en' }) => {
  const { link } = makeLinker(path);
  return `<section class="phero"><div class="wrap">
  ${c ? crumbs(path, c) : ''}
  ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}
  <h1>${h1}</h1>
  ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
  ${price ? `<p class="price-tag">${esc(price)}</p>` : ''}
  ${cta ? `<div class="row on-dark"><a class="btn arrow" href="#lead">${lang === 'es' ? 'Reserve una visita gratis' : 'Book a free walkthrough'}</a><a class="btn line" href="tel:${site.phoneE164}">${site.phone}</a></div>` : ''}
</div></section>`;
};

const serviceCards = (path, slugs) => {
  const { link } = makeLinker(path);
  return `<div class="grid g3">${slugs.map((s) => bySlug[s]).filter(Boolean).map((s) => `<a class="card rv" href="${link(s.slug)}"><span class="k">${serviceGroups[s.group]}</span><h3>${esc(s.name)}</h3><p class="muted small">${esc(s.description.split('. ')[0])}.</p><span class="more arrow"></span></a>`).join('')}</div>`;
};

const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

const serviceSchema = (s, path, area = 'Los Angeles, CA') => ({
  '@context': 'https://schema.org', '@type': 'Service', name: s.name || s, serviceType: 'Home watch', url: canonical(path),
  provider: { '@id': site.url + '/#business' }, areaServed: { '@type': 'City', name: area },
});

// ---------- Service pages ----------
export function servicePage(s) {
  const path = s.slug;
  const c = [['Home', 'index'], ['Services', 'services'], [s.name, path]];
  const body = `${hero(path, { crumbs: c, eyebrow: serviceGroups[s.group], h1: esc(s.h1), lead: s.lead, price: s.price })}
<section class="sec"><div class="wrap split">
  <article class="prose">
    <h2 style="margin-top:0">What is included</h2>
    ${list(s.includes)}
    <h2>Why it is better with Mansionly</h2>
    <div class="better">${s.better.map(([b, p]) => `<div><b>${esc(b)}</b><p>${esc(p)}</p></div>`).join('')}</div>
    ${s.note ? `<p class="note">${esc(s.note)} ${site.dreLicense}.</p>` : ''}
    <h2>Questions</h2>
    ${faqBlock(s.faqs)}
  </article>
  <aside class="aside" id="lead">${leadForm({ path, need: needFor[s.slug] ?? 0, title: 'Get a quote for ' + s.name.toLowerCase(), source: 'service:' + s.slug })}</aside>
</div></section>
<section class="sec stone"><div class="wrap"><div class="sec-head"><span class="eyebrow">Related services</span><h2>Often booked together</h2></div>${serviceCards(path, s.related)}</div></section>`;
  return { path, lang: 'en', title: s.title, description: s.description, body, schema: [serviceSchema(s, path), faqSchema(s.faqs), crumbSchema(c)] };
}

// ---------- Audience pages ----------
export function audiencePage(a) {
  const path = 'for/' + a.slug;
  const { link } = makeLinker(path);
  const c = [['Home', 'index'], ['Who we serve', 'who-we-serve'], [a.name, path]];
  const body = `${hero(path, { crumbs: c, eyebrow: 'Who we serve · ' + a.name, h1: esc(a.h1), lead: a.lead })}
<section class="sec"><div class="wrap split">
  <article class="prose">
    <h2 style="margin-top:0">What usually goes wrong</h2>
    ${list(a.pains)}
    <h2>How Mansionly helps</h2>
    <p>One local team with your keys, one schedule, one report after every visit, and one number to call for anything else. ${a.partner ? 'Your clients get the reports, and so do you, if they agree.' : 'You get the reports; anyone you choose can get access too.'}</p>
    ${a.partner ? `<p class="note">Interested in referring clients? See our <a href="${link('partners')}">partner program</a>. We follow your profession’s rules on referral fees: where fees are not allowed, we offer client perks instead.</p>` : ''}
  </article>
  <aside class="aside" id="lead">${leadForm({ path, source: 'audience:' + a.slug })}</aside>
</div></section>
<section class="sec stone"><div class="wrap"><div class="sec-head"><span class="eyebrow">Services for you</span><h2>Where most clients like you start</h2></div>${serviceCards(path, a.services)}</div></section>`;
  return { path, lang: 'en', title: a.title, description: a.description, body, schema: [crumbSchema(c)] };
}

// ---------- Location pages ----------
export function locationPage(l) {
  const path = 'home-watch/' + l.slug;
  const { link } = makeLinker(path);
  const c = [['Home', 'index'], ['Areas', 'areas'], [l.name, path]];
  const near = l.nearby.map((n) => locations.find((x) => x.slug === n)).filter(Boolean);
  const faqs = [
    [`How much does home watch cost in ${l.name}?`, `Plans start at $189/mo for two visits a month. Weekly visits are $349/mo. Large estates are usually on our Estate plan at $690/mo.`],
    l.far ? [`Do you charge more for ${l.name}?`, `${l.name} is more than 30 miles from our West Hollywood office, so a travel fee is added per visit. We quote it individually after the free walkthrough, and visits run on fixed route days.`]
      : [`How fast can you get to a home in ${l.name}?`, `Our office is in West Hollywood. For clients we respond to emergencies in ${l.name} as fast as traffic allows, usually within the hour.`],
    [`Do you serve all of ${l.name}?`, `Yes, including ZIP codes ${l.zips}.`],
  ];
  const body = `${hero(path, { crumbs: c, eyebrow: `Home watch · ${l.name} · ${l.region || 'Los Angeles'}`, h1: `Home watch in ${esc(l.name)}.`, lead: l.intro, price: l.far ? 'From $189/mo + travel fee, quoted for your home' : 'From $189/mo · weekly from $349/mo' })}
<section class="sec"><div class="wrap split">
  <article class="prose">
    <h2 style="margin-top:0">What we watch for in ${esc(l.name)}</h2>
    ${list(l.risks)}
    <h2>Every visit, 34 checkpoints</h2>
    <p>Exterior, entry points, interior, systems, mail and landscape, photographed and in your portal within two hours. The same inspector learns your home, so changes stand out.</p>
    <ul>${checkpoints.en.map(([h, i]) => `<li><strong>${h}:</strong> ${i.slice(0, 3).join(', ').toLowerCase()}</li>`).join('')}</ul>
    <h2>Questions from ${esc(l.name)} owners</h2>
    ${faqBlock(faqs)}
    <p class="muted small">ZIP codes served: ${l.zips}. Nearby: ${near.map((n) => `<a href="${link('home-watch/' + n.slug)}">${n.name}</a>`).join(', ')}.</p>
  </article>
  <aside class="aside" id="lead">${leadForm({ path, title: `Free walkthrough in ${l.name}`, source: 'area:' + l.slug })}</aside>
</div></section>
<section class="sec stone"><div class="wrap"><div class="sec-head"><span class="eyebrow">Services in ${esc(l.name)}</span><h2>More than a weekly check</h2></div>${serviceCards(path, ['home-watch', 'mail-package-handling', 'vendor-contractor-access', 'landscape-code-compliance', 'pre-sale-preparation-staging', 'sell-your-home'])}</div></section>`;
  return { path, lang: 'en', title: `Home Watch in ${l.name}, CA | Weekly Visits & Reports | Mansionly`, description: `Home watch in ${l.name}, CA (${l.zips}). Weekly visits, same-day photo reports and squatter, leak and city-code checks for empty and second homes. From $189/mo.`, body, schema: [serviceSchema('Home watch in ' + l.name, path, l.name + ', CA'), faqSchema(faqs), crumbSchema(c)] };
}

// ---------- Guides ----------
export function guidePage(g) {
  const path = 'guides/' + g.slug;
  const { link } = makeLinker(path);
  const c = [['Home', 'index'], ['Guides', 'guides'], [g.h1, path]];
  const content = g.body.map(([h, parts]) => `<h2>${esc(h)}</h2>${parts.map((p) => Array.isArray(p) ? list(p) : `<p>${esc(p)}</p>`).join('')}`).join('');
  const rel = g.related.map((r) => guides.find((x) => x.slug === r) ? ['guides/' + r, guides.find((x) => x.slug === r).h1] : bySlug[r] ? [r, bySlug[r].name] : null).filter(Boolean);
  const body = `${hero(path, { crumbs: c, eyebrow: `Guide · ${g.minutes} min read`, h1: esc(g.h1), lead: g.description, cta: false })}
<section class="sec"><div class="wrap split">
  <article class="prose">${content.replace('<h2>', '<h2 style="margin-top:0">')}
    <p class="note">This guide is general information, not legal, tax or insurance advice. Rules change; check with a licensed professional for your situation. Last reviewed November 2026.</p>
    <h2>Keep reading</h2><ul>${rel.map(([p, n]) => `<li><a href="${link(p)}">${esc(n)}</a></li>`).join('')}</ul>
  </article>
  <aside class="aside" id="lead">${leadForm({ path, title: 'Want us to handle it?', sub: 'Book a free walkthrough and we will take this off your list.', source: 'guide:' + g.slug })}</aside>
</div></section>`;
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, mainEntityOfPage: canonical(path), author: { '@id': site.url + '/#business' }, publisher: { '@id': site.url + '/#business' }, dateModified: '2026-11-19', inLanguage: 'en' };
  return { path, lang: 'en', title: g.title + ' | Mansionly', description: g.description, body, schema: [article, crumbSchema(c)] };
}

// ---------- Hubs ----------
export function servicesHub() {
  const path = 'services';
  const groups = Object.entries(serviceGroups).map(([k, name]) => `<div class="sec-head" style="margin:48px 0 20px"><span class="eyebrow">${name}</span></div>${serviceCards(path, services.filter((s) => s.group === k).map((s) => s.slug))}`).join('');
  const body = `${hero(path, { crumbs: [['Home', 'index'], ['Services', path]], eyebrow: 'Services', h1: 'Everything your home needs while you are away.', lead: 'Start with home watch. Add care, preparation, sale and on-your-behalf services whenever you need them, from the same trusted team.' })}
<section class="sec"><div class="wrap">${groups}</div></section>
<section class="sec dark"><div class="wrap split"><div style="display:grid;gap:16px;align-content:start"><h2>Not sure what you need?</h2><p class="lead">Tell us about the home and your plans. We will recommend the smallest plan that covers you.</p></div><div id="lead">${leadForm({ path, dark: true, source: 'services-hub' })}</div></div></section>`;
  return { path, lang: 'en', title: 'Home Watch, Concierge & Pre-Sale Services | Mansionly Los Angeles', description: 'All Mansionly services: home watch, mail, vendor access, arrival prep, vacant listing care, pre-sale staging, selling with our licensed agent and power-of-attorney services.', body, schema: [] };
}

export function areasHub() {
  const path = 'areas';
  const { link } = makeLinker(path);
  const groups = regions.map((r) => {
    const ls = locations.filter((l) => (l.region || 'Los Angeles') === r);
    if (!ls.length) return '';
    return `<div class="sec-head" style="margin:44px 0 18px"><span class="eyebrow">${r}</span></div><div class="grid g3">${ls.map((l) => `<a class="card rv" href="${link('home-watch/' + l.slug)}"><span class="k">${l.far ? 'Travel fee · quoted' : 'Standard pricing'}</span><h3>${l.name}</h3><p class="muted small">${esc(l.intro.split('. ')[0])}.</p><span class="more arrow"></span></a>`).join('')}</div>`;
  }).join('');
  const body = `${hero(path, { crumbs: [['Home', 'index'], ['Areas', path]], eyebrow: 'Areas we serve', h1: 'Home watch across Southern California.', lead: site.coverage + '. ' + travelRule })}
<section class="sec"><div class="wrap">${groups}
<p class="muted" style="margin-top:32px">Your area is not listed? We work anywhere in Southern California. <a href="${link('contact')}">Ask us for a quote</a>.</p></div></section>`;
  return { path, lang: 'en', title: 'Areas We Serve | Home Watch Across Southern California | Mansionly', description: 'Mansionly home watch covers Los Angeles, Beverly Hills, Malibu, the South Bay, Calabasas, Orange County, Montecito, Palm Springs and San Diego. Standard prices within 30 miles of West Hollywood.', body, schema: [] };
}

export function audiencesHub() {
  const path = 'who-we-serve';
  const { link } = makeLinker(path);
  const body = `${hero(path, { crumbs: [['Home', 'index'], ['Who we serve', path]], eyebrow: 'Who we serve', h1: 'For owners, families and the professionals who advise them.', lead: 'Every situation where a home waits for its owner: travel, second homes, sales, estates, rebuilds and family transitions.' })}
<section class="sec"><div class="wrap"><div class="grid g3">${audiences.map((a) => `<a class="card rv" href="${link('for/' + a.slug)}"><span class="k">${a.partner ? 'Partners' : 'Owners & families'}</span><h3>${esc(a.name)}</h3><p class="muted small">${esc(a.lead)}</p><span class="more arrow"></span></a>`).join('')}</div></div></section>`;
  return { path, lang: 'en', title: 'Who We Serve | Mansionly Home Watch Los Angeles', description: 'Mansionly serves second-home owners, travelers, executors, families of seniors, owners rebuilding after fires, and the realtors, attorneys and insurance agents who advise them.', body, schema: [] };
}

export function guidesHub() {
  const path = 'guides';
  const { link } = makeLinker(path);
  const body = `${hero(path, { crumbs: [['Home', 'index'], ['Guides', path]], eyebrow: 'Guides', h1: 'Plain answers for owners who are away.', lead: 'Insurance rules, squatters, probate, brush clearance, selling from afar. Written by people who look after empty homes every week.', cta: false })}
<section class="sec"><div class="wrap"><div class="grid g3">${guides.map((g) => `<a class="card rv" href="${link('guides/' + g.slug)}"><span class="k">${g.minutes} min read</span><h3>${esc(g.h1)}</h3><p class="muted small">${esc(g.description)}</p><span class="more arrow"></span></a>`).join('')}</div></div></section>`;
  return { path, lang: 'en', title: 'Home Watch Guides for Absent Homeowners | Mansionly', description: 'Guides on vacant home insurance, squatter prevention, probate property, brush clearance, selling from out of state and preparing your home for a long trip.', body, schema: [] };
}

// ---------- Pricing with plan builder ----------
export function pricingPage(lang = 'en') {
  const es = lang === 'es';
  const path = es ? 'es/precios' : 'pricing';
  const { link } = makeLinker(path);
  const radio = (name, id, label, sub, price, checked) => `<label class="opt"><input type="radio" name="${name}" value="${id}" data-price="${price}"${checked ? ' checked' : ''}><span><b>${label}</b><br><span>${sub}</span></span><span>${price ? '$' + price : '$0'}${es ? '/mes' : '/mo'}</span></label>`;
  const planR = plans.map((p, i) => radio('plan', p.id, p.name, es ? p.es.cadence : p.cadence, p.price, i === 1)).join('');
  const sizes = es ? [['s', 'Hasta 3,000 pies²', 0], ['m', '3,000 – 6,000 pies²', 40], ['l', 'Más de 6,000 pies² o varias construcciones', 90]] : [['s', 'Up to 3,000 sq ft', 0], ['m', '3,000 – 6,000 sq ft', 40], ['l', 'Over 6,000 sq ft or several buildings', 90]];
  const sizeR = sizes.map(([id, l, p], i) => `<label class="opt"><input type="radio" name="size" value="${id}" data-price="${p}"${i === 0 ? ' checked' : ''}><span><b>${l}</b></span><span>+$${p}</span></label>`).join('');
  const monthly = addons.filter((a) => a.unit === '/mo');
  const addR = monthly.map((a) => `<label class="opt"><input type="checkbox" name="addon" value="${a.id}" data-price="${a.price}"><span><b>${es ? a.es : a.name}</b></span><span>+$${a.price}${es ? '/mes' : '/mo'}</span></label>`).join('');
  const per = addons.filter((a) => a.unit !== '/mo').map((a) => `<tr><td>${es ? a.es : a.name}</td><td>$${a.price} ${a.unit}</td></tr>`).join('');
  const faqs = es ? generalFaqs.es.slice(2, 5) : [
    ['Is there a setup fee?', 'No. The walkthrough and onboarding are free.'],
    ['Can I change plans?', 'Yes, any time. Changes apply from your next billing date.'],
    ['How do I pay?', 'By card or bank transfer, billed monthly in advance. Vendor costs are passed through at cost with the receipt.'],
    ['What if I come home for a month?', 'Pause visits while you are home and pay only for key holding at $49/mo.'],
    ['Can I order an extra visit?', 'Yes. An extra visit on request is $99, for example before a storm or after a neighbor calls.'],
    ['Do you work outside Los Angeles?', 'Yes, anywhere in Southern California. ' + travelRule],
  ];
  const body = `${hero(path, { crumbs: es ? null : [['Home', 'index'], ['Pricing', path]], eyebrow: es ? 'Precios' : 'Pricing', h1: es ? 'Precios claros. Mes a mes.' : 'Clear prices. Month to month.', lead: es ? 'Elija la frecuencia, el tamaño de la casa y los extras. Vea el precio exacto.' : 'Choose how often we visit, the size of the home and any extras. See your exact monthly price.', cta: false, lang })}
<section class="sec"><div class="wrap calc" id="calc">
  <form id="builder" onsubmit="return false">
    <fieldset><legend>${es ? '1 · Frecuencia' : '1 · How often'}</legend>${planR}</fieldset>
    <fieldset><legend>${es ? '2 · Tamaño de la casa' : '2 · Size of the home'}</legend>${sizeR}</fieldset>
    <fieldset><legend>${es ? '3 · Extras mensuales' : '3 · Monthly extras'}</legend>${addR}</fieldset>
  </form>
  <div class="total" aria-live="polite">
    <span class="eyebrow" style="color:var(--slate)">${es ? 'Su plan' : 'Your plan'}</span>
    <div class="amt"><span id="total">$349</span><small>${es ? '/mes' : '/mo'}</small></div>
    <p id="summary" class="small" style="color:var(--slate)">Signature</p>
    <p class="small" style="color:var(--glow)">${offer.title}: ${es ? 'primer mes a mitad de precio' : 'first month at half price'}</p>
    <a class="btn arrow" id="reserve" href="${link(es ? 'es/contacto' : 'get-started')}">${es ? 'Reservar este plan' : 'Reserve this plan'}</a>
    <p class="small" style="color:var(--slate)">${es ? 'Sin cargo de alta. Cancele con 30 días de aviso.' : 'No setup fee. Cancel with 30 days’ notice.'}</p>
    <p class="small" style="color:var(--slate)">${es ? 'Más de 30 millas de West Hollywood: cargo de traslado, cotizado.' : 'More than 30 miles from West Hollywood: travel fee, quoted for your home.'}</p>
  </div>
</div></section>
<section class="sec stone"><div class="wrap split">
  <div class="prose"><h2 style="margin-top:0">${es ? 'Servicios por uso' : 'Pay-per-use services'}</h2><div class="scroll-x"><table class="table"><tbody>${per}<tr><td>${es ? 'Conserjería y diligencias' : 'Concierge & errands'}</td><td>$85 per hour</td></tr><tr><td>${es ? 'Gestiones con poder notarial' : 'Power-of-attorney tasks'}</td><td>from $95 per hour</td></tr><tr><td>${es ? 'Supervisión de obra' : 'Renovation oversight'}</td><td>from $390/mo</td></tr><tr><td>${es ? 'Preparación para la venta' : 'Pre-sale preparation'}</td><td>8% of the preparation budget</td></tr></tbody></table></div></div>
  <div class="prose"><h2 style="margin-top:0">${es ? 'Preguntas' : 'Pricing questions'}</h2>${faqBlock(faqs)}</div>
</div></section>`;
  const offers = { '@context': 'https://schema.org', '@type': 'Product', name: 'Mansionly home watch plans', brand: { '@type': 'Brand', name: site.name }, offers: plans.map((p) => ({ '@type': 'Offer', name: p.name, price: p.price, priceCurrency: 'USD', url: canonical(path) })) };
  return { path, lang, title: es ? 'Precios de vigilancia de casas en Los Ángeles | Mansionly' : 'Home Watch Pricing Los Angeles | Plans from $189/mo | Mansionly', description: es ? 'Planes de vigilancia de casas desde $189/mes. Calcule su precio exacto.' : 'Transparent home watch pricing: Essential $189/mo, Signature $349/mo weekly, Estate $690/mo. Build your plan and see the exact price.', body, schema: [offers, faqSchema(faqs)] };
}

// ---------- Simple core pages ----------
const simple = (path, title, description, heroOpts, inner, schema = [], lang = 'en', extra = {}) => ({ path, lang, title, description, body: hero(path, { ...heroOpts, lang }) + inner, schema, ...extra });

export function corePages() {
  const out = [];
  const L = (p) => makeLinker(p).link;

  out.push(simple('get-started', 'Book a Free Home Walkthrough | Mansionly Los Angeles', 'Book a free 30-minute walkthrough of your home. We map the risks, explain what we would check and send a written risk check you keep.',
    { crumbs: [['Home', 'index'], ['Get started', 'get-started']], eyebrow: 'Get started', h1: 'Book your free walkthrough.', lead: 'Thirty minutes at your home, or by video if you are away. You keep the written risk check, whether or not you sign up.', cta: false },
    `<section class="sec"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">What happens next</h2><ul><li>We call you within one business hour to pick a time.</li><li>We walk the home with you or your representative, or by video.</li><li>Within a day you receive a written risk check and a plan recommendation.</li><li>If you go ahead, your first visit can happen the same week.</li></ul><p class="note">${offer.title}: ${offer.text}</p></div><div id="lead">${leadForm({ path: 'get-started', id: 'lead-main', source: 'get-started' })}</div></div></section>`));

  out.push(simple('contact', 'Contact Mansionly | Home Watch in West Hollywood & Los Angeles', `Call ${site.phone}, email us or visit our office at ${site.address.street}, ${site.address.city}.`,
    { crumbs: [['Home', 'index'], ['Contact', 'contact']], eyebrow: 'Contact', h1: 'Talk to a person, not a call center.', lead: site.hoursText, cta: false },
    `<section class="sec"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">Office</h2><p>${site.address.street}<br>${site.address.city}, ${site.address.region} ${site.address.zip}</p><h2>Phone</h2><p><a href="tel:${site.phoneE164}">${site.phone}</a></p><h2>Email</h2><p><a href="mailto:${site.email}">${site.email}</a></p><p><a href="https://maps.google.com/?q=${encodeURIComponent(site.address.street + ', ' + site.address.city + ' ' + site.address.zip)}" rel="noopener" target="_blank">Open in Google Maps →</a></p></div><div id="lead">${leadForm({ path: 'contact', source: 'contact' })}</div></div></section>`));

  out.push(simple('about', 'About Mansionly | A Home Watch Company Built on Trust', 'Mansionly is a Los Angeles home watch and estate services company based in West Hollywood. Our standards, our team and why we started.',
    { crumbs: [['Home', 'index'], ['About', 'about']], eyebrow: 'About Mansionly', h1: 'We look after homes the way their owners would.', lead: 'Mansionly started with a simple observation: people trust their homes to strangers with a clipboard and an old pickup. Owners deserve better.', cta: false },
    `<section class="sec"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">Our standards</h2><ul><li>Every inspector is background-checked, trained on our 34-point visit and covered by our insurance.</li><li>Every visit is photographed, timestamped and saved permanently.</li><li>Keys are coded and never labeled with an address.</li><li>We never mark up vendor invoices.</li><li>We tell you the truth, including when you do not need a service.</li></ul><h2>One team for the whole life of your home</h2><p>We begin with home watch because it is how trust is earned: week after week, visit after visit. Over time our clients ask us for more: managing repairs, preparing a home for sale, selling it with our licensed agent, or acting for them with a power of attorney. We built Mansionly so that the same team can do all of it.</p><h2>What we are not</h2><p>We are not a security company, a brokerage or a law firm. Where a license is required, the work is done by licensed professionals: our in-house real estate agent working under their broker, licensed contractors and independent attorneys.</p></div><div id="lead">${leadForm({ path: 'about', source: 'about' })}</div></div></section>`));

  out.push(simple('how-it-works', 'How Home Watch Works | Mansionly Los Angeles', 'From free walkthrough to weekly visits: how Mansionly onboards your home, what happens on each visit and how emergencies are handled.',
    { crumbs: [['Home', 'index'], ['How it works', 'how-it-works']], eyebrow: 'How it works', h1: 'Simple for you. Thorough for your home.', lead: 'Four steps from first call to first report, usually within a week.' },
    `<section class="sec"><div class="wrap"><ol class="steps"><li><h3>Free walkthrough</h3><p class="muted">We learn the home: shut-offs, panel, alarm, pool, irrigation, quirks and vendors.</p></li><li><h3>Home profile & keys</h3><p class="muted">Keys coded and stored; emergency plan and pre-approved actions signed.</p></li><li><h3>Scheduled visits</h3><p class="muted">Same inspector, same 34 checkpoints, report within two hours.</p></li><li><h3>Portal & requests</h3><p class="muted">Reports, mail, invoices and requests in one place. Message us any time.</p></li></ol></div></section>
<section class="sec stone"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">When something is wrong</h2><ul><li>Minor issue: noted in the report with photos and a recommendation.</li><li>Needs attention: we call or text you the same day with options and quotes.</li><li>Emergency: we take the steps you pre-approved (for example shutting off water), call the right vendor and keep you updated until it is solved.</li></ul></div><div class="prose"><h2 style="margin-top:0">The 34 checkpoints</h2>${checkpoints.en.map(([h, i]) => `<p><strong>${h}.</strong> ${i.join(', ')}.</p>`).join('')}</div></div></section>`));

  out.push(simple('partners', 'Partner Program for Realtors, Attorneys & Insurance Agents | Mansionly', 'Refer clients with vacant homes and give them a trusted caretaker. Shared reports, client perks and referral rewards where your profession allows.',
    { crumbs: [['Home', 'index'], ['Partners', 'partners']], eyebrow: 'Partner program', h1: 'Your clients’ homes, in hands you can recommend.', lead: 'For realtors, estate and family law attorneys, fiduciaries, insurance agents, property managers and wealth advisors.' },
    `<section class="sec"><div class="wrap"><div class="grid g3">
<div class="card"><span class="k">For your client</span><h3>First month at half price</h3><p class="muted small">Plus priority onboarding and a free written risk check.</p></div>
<div class="card"><span class="k">For you</span><h3>Shared reports</h3><p class="muted small">With your client’s consent, see every report. No more driving over to check.</p></div>
<div class="card"><span class="k">For your business</span><h3>Referral rewards</h3><p class="muted small">A reward for every signed client where your profession’s rules allow it. Attorneys and fiduciaries receive client perks instead.</p></div>
</div></div></section>
<section class="sec stone"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">Who we partner with</h2><ul>${audiences.filter((a) => a.partner).map((a) => `<li><a href="${L('partners')(('for/' + a.slug))}">${a.name}</a></li>`).join('')}<li>Property managers and HOA managers</li><li>Wealth advisors and family offices</li><li>Relocation companies</li></ul><p class="note">Referral arrangements follow the rules of each profession (for example, California rules for attorneys and real estate licensees). We will confirm what applies to you before anything is paid.</p></div><div id="lead">${leadForm({ path: 'partners', title: 'Become a partner', sub: 'Tell us about your practice. We will send a partner kit and sample reports.', need: 8, source: 'partner-application' })}</div></div></section>`));

  out.push(simple('referral', 'Refer a Friend | One Month Free for Both of You | Mansionly', 'Know someone who travels or owns a second home? Refer them to Mansionly: when they sign up, you both get one month free.',
    { crumbs: [['Home', 'index'], ['Refer a friend', 'referral']], eyebrow: 'Refer a friend', h1: 'Give a month. Get a month.', lead: 'When someone you refer starts any monthly plan, you both get one month free. No limit on referrals.', cta: false },
    `<section class="sec"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">How it works</h2><ul><li>Send us your friend’s name and number, or share your personal link from the client portal.</li><li>We call them, gently, once.</li><li>When they start a plan, one month is credited to both accounts.</li></ul></div><div id="lead">${leadForm({ path: 'referral', title: 'Refer someone', sub: 'Put your friend’s details below and your own name in the message.', need: 8, source: 'referral' })}</div></div></section>`));

  out.push(simple('careers', 'Careers at Mansionly | Home Watch Inspector Jobs in Los Angeles', 'Join Mansionly as a home watch inspector or house manager in Los Angeles. Reliable, detail-oriented people who take pride in their work.',
    { crumbs: [['Home', 'index'], ['Careers', 'careers']], eyebrow: 'Careers', h1: 'We hire people we would give our own keys to.', lead: 'Home watch inspectors and house managers in Los Angeles. Bilingual English and Spanish is a plus.', cta: false },
    `<section class="sec"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">Home watch inspector</h2><ul><li>Visit client homes on a set route and complete our 34-point inspection</li><li>Photograph and report in our app</li><li>Meet vendors and handle small tasks</li><li>Clean driving record, own reliable car, background check</li></ul><h2>House manager (Estate clients)</h2><ul><li>Own a portfolio of large homes and their vendors</li><li>Prepare arrivals and run concierge requests</li><li>Experience in hospitality or estate management</li></ul></div><div id="lead">${leadForm({ path: 'careers', title: 'Apply', sub: 'Tell us which role and a little about you.', need: 8, source: 'careers' })}</div></div></section>`));

  out.push(simple('faq', 'Home Watch FAQ | Mansionly Los Angeles', 'Answers about home watch: what we check, keys, insurance, contracts, emergencies, pricing and areas served.',
    { crumbs: [['Home', 'index'], ['FAQ', 'faq']], eyebrow: 'FAQ', h1: 'Frequently asked questions.', cta: false },
    `<section class="sec"><div class="wrap split"><div>${faqBlock([...generalFaqs.en, ...services.flatMap((s) => s.faqs.slice(0, 1))])}</div><div id="lead">${leadForm({ path: 'faq', source: 'faq' })}</div></div></section>`,
    [faqSchema([...generalFaqs.en, ...services.flatMap((s) => s.faqs.slice(0, 1))])]));

  out.push(simple('privacy', 'Privacy Policy | Mansionly', 'How Mansionly collects, uses and protects your information.', { eyebrow: 'Legal', h1: 'Privacy policy', cta: false },
    `<section class="sec"><div class="wrap prose"><p class="note">Draft: have this reviewed by your attorney before launch.</p><h2>What we collect</h2><p>Contact details you send us, property details, photos and reports from visits, and basic analytics about how the website is used.</p><h2>How we use it</h2><p>To respond to requests, provide services, send reports and invoices, and improve our service. We do not sell personal information.</p><h2>Photos of your home</h2><p>Visit photos are stored privately in your portal and shared only with people you authorize.</p><h2>Your rights</h2><p>California residents may request access to, correction of or deletion of their personal information under the CCPA/CPRA. Email ${site.email}.</p><h2>Contact</h2><p>${site.legalName}, ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.zip}.</p></div></section>`));

  out.push(simple('terms', 'Terms of Service | Mansionly', 'Terms for using the Mansionly website and services.', { eyebrow: 'Legal', h1: 'Terms of service', cta: false },
    `<section class="sec"><div class="wrap prose"><p class="note">Draft: have this reviewed by your attorney before launch.</p><h2>Our services</h2><p>Mansionly provides scheduled visual inspections, reporting, key holding, concierge and coordination services. We are not a security, alarm monitoring, construction, brokerage or legal services provider.</p><h2>Plans and billing</h2><p>Monthly plans are billed in advance and may be cancelled with 30 days’ written notice.</p><h2>Limits</h2><p>Visual inspections cannot detect every hidden condition. Our responsibility is set out in your service agreement.</p></div></section>`));

  out.push(simple('404', 'Page not found | Mansionly', 'This page does not exist.', { eyebrow: '404', h1: 'This page is away from home.', lead: 'The link may be old. Try the home page or call us.', cta: false },
    `<section class="sec"><div class="wrap"><a class="btn arrow" href="${L('404')('index')}">Go to the home page</a></div></section>`, [], 'en', { noindex: true }));

  out.push(simple('login', 'Client Login | Mansionly', 'Sign in to your Mansionly client portal.', { eyebrow: 'Client portal', h1: 'Welcome home.', lead: 'Sign in to see your reports, photos, mail and requests.', cta: false },
    `<section class="sec"><div class="wrap" style="max-width:520px"><form class="form" id="login" novalidate><div class="banner" id="login-note" hidden>The portal opens with your first visit. Until then you can <a href="${L('login')('portal')}">preview a demo</a>.</div><div class="field"><label for="li-email">Email</label><input id="li-email" type="email" autocomplete="email" required></div><div class="field"><label for="li-pass">Password</label><input id="li-pass" type="password" autocomplete="current-password" required></div><button class="btn" type="submit">Sign in</button><button class="btn line" type="button" id="magic">Email me a sign-in link</button><p class="consent" id="login-msg" role="status"></p></form><p class="muted small" style="margin-top:16px">Staff? Use the same sign-in; your account opens the inspector view.</p></div></section>`, [], 'en', { noindex: true, scripts: ['portal.js'] }));

  out.push(portalPage());
  return out;
}

function portalPage() {
  const path = 'portal';
  const body = `<div class="app">
  <nav class="side" aria-label="Portal"><a href="#" aria-current="page">Overview</a><a href="#visits">Visits</a><a href="#mail">Mail</a><a href="#requests">Requests</a><a href="#billing">Billing</a><a href="#people">Access</a></nav>
  <main class="main" id="portal-root">
    <div class="banner" id="demo-banner">Demo with example data. Real clients see their own home here after signing in.</div>
    <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:end"><div><span class="eyebrow">Laurel Ave · West Hollywood</span><h1 style="font-size:clamp(34px,4vw,48px);margin-top:8px">Good evening, Alexandra.</h1></div><a class="btn" href="#requests">New request</a></div>
    <div class="kpis"><div class="kpi"><b>All clear</b><span>Last visit · Tue 7:11 pm</span></div><div class="kpi"><b>46</b><span>Visits this year</span></div><div class="kpi"><b>6</b><span>New mail items</span></div><div class="kpi"><b>1</b><span>Open recommendation</span></div></div>
    <section id="visits" style="display:grid;gap:12px"><h2 style="font-size:30px">Recent visits</h2><div class="scroll-x"><table class="table"><thead><tr><th>Date</th><th>Inspector</th><th>Photos</th><th>Result</th></tr></thead><tbody>
      <tr><td>Tue, Nov 17 · 6:42 pm</td><td>Daniel R.</td><td>38</td><td><span class="pill ok">All clear</span></td></tr>
      <tr><td>Tue, Nov 10 · 9:15 am</td><td>Daniel R.</td><td>36</td><td><span class="pill warn">1 note · branch over sidewalk</span></td></tr>
      <tr><td>Tue, Nov 3 · 9:30 am</td><td>Daniel R.</td><td>37</td><td><span class="pill ok">All clear</span></td></tr>
      <tr><td>Tue, Oct 27 · 10:05 am</td><td>Maria L.</td><td>39</td><td><span class="pill ok">All clear</span></td></tr>
    </tbody></table></div></section>
    <section id="mail" style="display:grid;gap:12px"><h2 style="font-size:30px">Mail</h2><div class="scroll-x"><table class="table"><thead><tr><th>Received</th><th>From</th><th>Action</th></tr></thead><tbody>
      <tr><td>Nov 17</td><td>LA County Treasurer · property tax</td><td><span class="pill warn">Open & scan?</span></td></tr>
      <tr><td>Nov 17</td><td>Chase Bank</td><td>Forward weekly</td></tr>
      <tr><td>Nov 10</td><td>City of West Hollywood</td><td>Scanned · read</td></tr>
    </tbody></table></div></section>
    <section id="requests" class="grid g2"><form class="form" onsubmit="event.preventDefault();this.classList.add('sent')"><h3>New request</h3><div class="field"><label for="rq-type">What do you need?</label><select id="rq-type"><option>Let a vendor in</option><option>Prepare for my arrival</option><option>Forward mail now</option><option>Extra visit</option><option>Something else</option></select></div><div class="field"><label for="rq-note">Details</label><textarea id="rq-note"></textarea></div><button class="btn" type="submit">Send request</button><div class="form-ok"><h3>Request sent.</h3><p>Your house manager will confirm shortly.</p></div></form>
    <div class="form" id="billing"><h3>Billing</h3><p>Signature plan · <strong>$349/mo</strong></p><p class="muted small">Next invoice Dec 1 · Visa •••• 4242</p><p class="muted small">Referral link: mansionly.co/r/alexandra</p><div id="people"><h3 style="margin-top:12px">Access</h3><p class="muted small">You · Owner<br>J. Park, Esq. · Reports only<br>Michael M. · Family</p></div></div></section>
  </main>
</div>`;
  return { path, lang: 'en', title: 'Client Portal | Mansionly', description: 'Your Mansionly client portal.', body, schema: [], noindex: true, scripts: ['portal.js'], noFooter: true };
}

// ---------- Spanish pages ----------
export function spanishPages() {
  const out = [];
  const hw = bySlug['home-watch'];
  out.push(simple('es/servicios', 'Servicios de vigilancia y cuidado de casas | Mansionly Los Ángeles', 'Vigilancia de casas, correo, proveedores, preparación para llegadas, preparación para la venta, venta con agente con licencia y gestiones con poder notarial.',
    { eyebrow: 'Servicios', h1: 'Todo lo que su casa necesita mientras usted no está.', lead: 'Empiece con la vigilancia semanal. Agregue cuidado, preparación, venta y gestiones cuando lo necesite.' },
    `<section class="sec"><div class="wrap"><div class="grid g3">${[
      ['es/vigilancia-de-casas', 'Vigilancia de casas', 'Visitas programadas con 34 puntos de revisión e informe con fotos.'],
      ['mail-package-handling', 'Correo y paquetes', 'Recogemos, escaneamos y reenviamos su correo.'],
      ['vendor-contractor-access', 'Acceso de proveedores', 'Abrimos a jardineros, plomeros y contratistas, y revisamos el trabajo.'],
      ['pre-arrival-preparation', 'Preparación de llegada', 'Casa ventilada, limpia y abastecida cuando usted llega.'],
      ['pre-sale-preparation-staging', 'Preparación para la venta', 'Reparaciones, decoración, muebles, flores y fotografía.'],
      ['sell-your-home', 'Venta con agente con licencia', 'Vendemos la casa que ya conocemos mejor que nadie.'],
      ['power-of-attorney-services', 'Gestiones con poder notarial', 'Permisos, inspectores, seguros y subastas en su nombre.'],
      ['estate-property-care', 'Propiedades en sucesión', 'Cuidado documentado para albaceas y herederos.'],
      ['renovation-oversight', 'Supervisión de obras', 'Visitas semanales a su remodelación o reconstrucción.'],
    ].map(([p, h, d]) => `<a class="card rv" href="${makeLinker('es/servicios').link(p)}"><h3>${h}</h3><p class="muted small">${d}</p><span class="more arrow"></span></a>`).join('')}</div><p class="muted small" style="margin-top:20px">Algunas páginas de detalle están disponibles por ahora solo en inglés.</p></div></section>
<section class="sec dark"><div class="wrap split"><div style="display:grid;gap:16px;align-content:start"><h2>¿No sabe qué necesita?</h2><p class="lead">Cuéntenos sobre la casa y le recomendamos el plan más pequeño que le cubra.</p></div><div id="lead">${leadForm({ path: 'es/servicios', lang: 'es', dark: true, source: 'es-servicios' })}</div></div></section>`, [], 'es'));

  const esIncl = ['Recorrido exterior: techo, canaletas, cercas, rejas, ventanas y puertas', 'Entradas: cada cerradura, señales de entrada forzada u ocupación', 'Interior: techos, paredes y pisos para detectar agua, plagas y olores', 'Sistemas: llaves de agua, inodoros, calentador, aire acondicionado y refrigerador', 'Correo, volantes y paquetes retirados', 'Luces y persianas ajustadas para que la casa parezca habitada', 'Informe con 30 a 40 fotos con fecha y hora, en su portal en 2 horas'];
  out.push(simple('es/vigilancia-de-casas', 'Vigilancia de casas en Los Ángeles | Visitas semanales e informes | Mansionly', 'Vigilancia de casas vacías y segundas residencias en Los Ángeles. Inspección de 34 puntos e informe con fotos en 2 horas. Desde $189/mes.',
    { eyebrow: 'Vigilancia de casas', h1: 'Vigilancia de casas, como lo haría usted mismo.', lead: 'Un inspector de Mansionly visita su casa en un horario fijo, recorre cada habitación y el exterior, y le envía un informe con fotos.', price: 'Desde $189/mes' },
    `<section class="sec"><div class="wrap split"><article class="prose"><h2 style="margin-top:0">Qué incluye</h2>${list(esIncl)}<h2>Por qué es mejor con Mansionly</h2><div class="better"><div><b>Un informe que sirve</b><p>Fotos de cada punto con fecha y hora, guardadas para siempre. Útiles para aseguradoras, abogados y compradores.</p></div><div><b>El mismo inspector</b><p>Una persona conoce su casa y nota cualquier cambio.</p></div><div><b>Una llamada resuelve todo</b><p>Si encontramos un problema, con su aprobación traemos al proveedor adecuado y revisamos el trabajo.</p></div></div><h2>Preguntas</h2>${faqBlock(generalFaqs.es.slice(0, 4))}<p class="muted small"><a href="${makeLinker('es/vigilancia-de-casas').link('home-watch')}">Read this page in English</a></p></article><aside class="aside" id="lead">${leadForm({ path: 'es/vigilancia-de-casas', lang: 'es', source: 'es-home-watch' })}</aside></div></section>`,
    [serviceSchema(hw, 'es/vigilancia-de-casas'), faqSchema(generalFaqs.es.slice(0, 4))], 'es'));

  out.push(simple('es/contacto', 'Contacto y visita gratis | Mansionly Los Ángeles', `Llame al ${site.phone} o reserve una visita gratis de 30 minutos.`,
    { eyebrow: 'Contacto', h1: 'Reserve su visita gratis.', lead: 'Treinta minutos en su casa, o por video si está lejos. Se queda con el informe de riesgos aunque no contrate.', cta: false },
    `<section class="sec"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">Oficina</h2><p>${site.address.street}<br>${site.address.city}, ${site.address.region} ${site.address.zip}</p><h2>Teléfono</h2><p><a href="tel:${site.phoneE164}">${site.phone}</a></p><h2>Correo</h2><p><a href="mailto:${site.email}">${site.email}</a></p><p class="note">${offer.title}: ${offer.es}</p></div><div id="lead">${leadForm({ path: 'es/contacto', lang: 'es', id: 'lead-es', source: 'es-contacto' })}</div></div></section>`, [], 'es'));

  out.push(simple('es/preguntas-frecuentes', 'Preguntas frecuentes | Vigilancia de casas | Mansionly', 'Respuestas sobre vigilancia de casas: qué revisamos, llaves, seguros, contratos y emergencias.',
    { eyebrow: 'Preguntas', h1: 'Preguntas frecuentes.', cta: false },
    `<section class="sec"><div class="wrap split"><div>${faqBlock(generalFaqs.es)}</div><div id="lead">${leadForm({ path: 'es/preguntas-frecuentes', lang: 'es', source: 'es-faq' })}</div></div></section>`, [faqSchema(generalFaqs.es)], 'es'));

  out.push(simple('es/socios', 'Programa de socios para agentes, abogados y aseguradoras | Mansionly', 'Recomiende a sus clientes con casas vacías un cuidador de confianza. Informes compartidos y beneficios para sus clientes.',
    { eyebrow: 'Programa de socios', h1: 'Las casas de sus clientes, en manos que puede recomendar.', lead: 'Para agentes inmobiliarios, abogados de sucesiones y familia, aseguradoras y administradores.' },
    `<section class="sec"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">Beneficios</h2><ul><li>Su cliente: primer mes a mitad de precio y evaluación de riesgos gratis.</li><li>Usted: acceso a los informes con el permiso del cliente.</li><li>Recompensas por referencia donde las reglas de su profesión lo permitan.</li></ul></div><div id="lead">${leadForm({ path: 'es/socios', lang: 'es', title: 'Hágase socio', need: 8, source: 'es-partner' })}</div></div></section>`, [], 'es'));

  out.push(simple('es/sobre-nosotros', 'Sobre Mansionly | Vigilancia de casas en Los Ángeles', 'Mansionly es una empresa de vigilancia de casas con oficina en West Hollywood.',
    { eyebrow: 'Nosotros', h1: 'Cuidamos las casas como lo harían sus dueños.', lead: 'Inspectores verificados, informes con fotos en cada visita y un solo equipo para toda la vida de su casa.', cta: false },
    `<section class="sec"><div class="wrap split"><div class="prose"><h2 style="margin-top:0">Nuestros estándares</h2><ul><li>Inspectores con verificación de antecedentes y capacitación.</li><li>Cada visita fotografiada y guardada.</li><li>Llaves codificadas, nunca con su dirección.</li><li>Nunca aumentamos las facturas de proveedores.</li></ul><h2>Lo que no somos</h2><p>No somos empresa de seguridad, corredora inmobiliaria ni bufete de abogados. Donde se requiere licencia, el trabajo lo hacen profesionales con licencia.</p></div><div id="lead">${leadForm({ path: 'es/sobre-nosotros', lang: 'es', source: 'es-about' })}</div></div></section>`, [], 'es'));
  return out;
}
