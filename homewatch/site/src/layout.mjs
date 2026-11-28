import { site } from './config.mjs';
import { services } from './data/services.mjs';
import { audiences } from './data/audiences.mjs';
import { locations } from './data/locations.mjs';

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Build mode: CLEAN=1 gives root-relative clean URLs for production hosting.
// Otherwise links are relative "page.html" files that open straight from disk or in a preview.
export const CLEAN = process.env.CLEAN === '1';

export function makeLinker(path) {
  const depth = path.split('/').length - 1;
  const pre = CLEAN ? '/' : '../'.repeat(depth);
  const link = (target) => {
    if (target.startsWith('http') || target.startsWith('#') || target.startsWith('tel:') || target.startsWith('mailto:')) return target;
    const [t, hash] = target.split('#');
    let out;
    if (CLEAN) out = t === 'index' ? '/' : t === 'es/index' ? '/es/' : '/' + t;
    else out = pre + t + '.html';
    return hash ? out + '#' + hash : out;
  };
  const asset = (p) => pre + 'assets/' + p;
  return { link, asset, pre };
}

export const canonical = (path) => {
  if (path === 'index') return site.url + '/';
  if (path === 'es/index') return site.url + '/es/';
  return site.url + '/' + path;
};

// English page <-> Spanish page pairs, for hreflang and the language switch.
export const esPairs = {
  index: 'es/index', services: 'es/servicios', 'home-watch': 'es/vigilancia-de-casas', pricing: 'es/precios',
  'get-started': 'es/contacto', faq: 'es/preguntas-frecuentes', partners: 'es/socios', about: 'es/sobre-nosotros', sell: 'es/vender',
};
const enPairs = Object.fromEntries(Object.entries(esPairs).map(([a, b]) => [b, a]));

export const ui = {
  en: {
    nav: [['home-watch', 'Home Watch'], ['services', 'Services'], ['pricing', 'Pricing'], ['sell', 'Sell & Pre-Sale'], ['partners', 'Partners'], ['guides', 'Guides']],
    login: 'Client login', cta: 'Free walkthrough', ctaTarget: 'get-started', skip: 'Skip to content', call: 'Call',
    formTitle: 'Book a free walkthrough', formSub: 'Tell us about the home. We reply within one business hour.',
    name: 'Full name', phone: 'Phone', email: 'Email', area: 'Neighborhood or ZIP', need: 'I need help with', message: 'Anything we should know? (optional)',
    send: 'Request my walkthrough', consent: 'By sending, you agree we may contact you by phone, text or email about your request. No spam, ever.',
    okTitle: 'Thank you. We have your request.', okText: 'A member of our team will call you within one business hour. Urgent? Call us now at ',
    needs: ['Weekly home watch', 'Mail & package handling', 'Letting vendors in', 'Vacant listing care', 'Pre-sale preparation & staging', 'Selling my home', 'Estate or probate property', 'Renovation or rebuild oversight', 'Something else'],
    fServices: 'Services', fWho: 'Who we serve', fAreas: 'Areas', fCompany: 'Company',
    company: [['about', 'About us'], ['how-it-works', 'How it works'], ['pricing', 'Pricing'], ['partners', 'Partner program'], ['referral', 'Refer a friend'], ['careers', 'Careers'], ['faq', 'FAQ'], ['contact', 'Contact'], ['login', 'Client login']],
    notSecurity: 'Mansionly provides home watch, concierge and coordination services. We are not a security, alarm or guard company. Real estate services are provided by a licensed California real estate salesperson under their supervising broker. Legal services are provided only by independent licensed attorneys.',
    privacy: 'Privacy', terms: 'Terms', lang: 'ES', langLabel: 'Ver en español',
  },
  es: {
    nav: [['es/vigilancia-de-casas', 'Vigilancia'], ['es/servicios', 'Servicios'], ['es/precios', 'Precios'], ['es/vender', 'Vender'], ['es/socios', 'Socios'], ['es/preguntas-frecuentes', 'Preguntas']],
    login: 'Acceso clientes', cta: 'Visita gratis', ctaTarget: 'es/contacto', skip: 'Ir al contenido', call: 'Llamar',
    formTitle: 'Reserve una visita gratis', formSub: 'Cuéntenos sobre la casa. Respondemos en menos de una hora hábil.',
    name: 'Nombre completo', phone: 'Teléfono', email: 'Correo electrónico', area: 'Vecindario o código postal', need: 'Necesito ayuda con', message: '¿Algo más que debamos saber? (opcional)',
    send: 'Solicitar mi visita', consent: 'Al enviar, acepta que le contactemos por teléfono, mensaje o correo sobre su solicitud. Nunca spam.',
    okTitle: 'Gracias. Recibimos su solicitud.', okText: 'Le llamaremos en menos de una hora hábil. ¿Es urgente? Llámenos ahora al ',
    needs: ['Vigilancia semanal de la casa', 'Correo y paquetes', 'Dar acceso a proveedores', 'Casa vacía en venta', 'Preparación para la venta', 'Vender mi casa', 'Propiedad en sucesión (probate)', 'Supervisión de remodelación', 'Otra cosa'],
    fServices: 'Servicios', fWho: 'Para quién', fAreas: 'Zonas', fCompany: 'Empresa',
    company: [['es/sobre-nosotros', 'Nosotros'], ['es/precios', 'Precios'], ['es/socios', 'Programa de socios'], ['es/preguntas-frecuentes', 'Preguntas frecuentes'], ['es/contacto', 'Contacto'], ['login', 'Acceso clientes']],
    notSecurity: 'Mansionly ofrece vigilancia de casas, conserjería y coordinación. No somos una empresa de seguridad, alarmas ni guardias. Los servicios inmobiliarios los presta un agente con licencia de California bajo su corredor supervisor. Los servicios legales los prestan solo abogados independientes con licencia.',
    privacy: 'Privacidad', terms: 'Términos', lang: 'EN', langLabel: 'View in English',
  },
};

export const logoSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 4h76v42c0 26-17 41-38 50C29 87 12 72 12 46z" fill="currentColor"/><circle cx="50" cy="38" r="12" fill="var(--logo-bg,#0F2747)"/><path d="M43.4 44.6 39 69h22l-4.4-24.4z" fill="var(--logo-bg,#0F2747)"/></svg>`;
export const wordmark = '<span class="wm"><span class="wm-m">m</span>ansionly<span class="wm-m">.</span></span>';

const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

export const orgSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': site.url + '/#business',
  name: site.name, legalName: site.legalName,
  description: 'Home watch, concierge and estate services for vacant and second homes across Southern California.',
  url: site.url + '/',
  telephone: site.phoneE164,
  email: site.email,
  priceRange: '$$$',
  address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.zip, addressCountry: site.address.country },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  openingHours: site.hours,
  areaServed: locations.map((l) => ({ '@type': 'City', name: l.name + ', CA' })),
  knowsLanguage: ['en', 'es'],
});

export function head({ path, lang, title, description, css, schema = [], noindex = false }) {
  const { asset } = makeLinker(path);
  const alt = lang === 'en' ? esPairs[path] : enPairs[path];
  const enPath = lang === 'en' ? path : alt;
  const esPath = lang === 'es' ? path : alt;
  const hreflang = alt ? `<link rel="alternate" hreflang="en" href="${canonical(enPath)}"><link rel="alternate" hreflang="es" href="${canonical(esPath)}"><link rel="alternate" hreflang="x-default" href="${canonical(enPath)}">` : '';
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="${canonical(path)}">
${hreflang}
<meta name="theme-color" content="#0F2747">
<meta property="og:type" content="website"><meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical(path)}"><meta property="og:image" content="${site.url}/assets/og.png">
<meta property="og:locale" content="${lang === 'es' ? 'es_US' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset('app-icon.svg')}">
<link rel="preload" href="${asset('fonts/Manrope-800.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${asset('fonts/Inter.woff2')}" as="font" type="font/woff2" crossorigin>
<style>${css.replaceAll('url(FONT/', 'url(' + asset('fonts/'))}</style>
${[orgSchema(), ...schema].map(jsonLd).join('\n')}`;
}

export function header({ path, lang, current }) {
  const { link } = makeLinker(path);
  const t = ui[lang];
  const alt = lang === 'en' ? (esPairs[path] || 'es/index') : (enPairs[path] || 'index');
  const nav = t.nav.map(([href, label]) => `<a href="${link(href)}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<a class="skip" href="#main">${t.skip}</a>
<header class="hdr"><div class="wrap">
  <a class="logo" href="${link(lang === 'es' ? 'es/index' : 'index')}" aria-label="${site.name} home">${logoSvg}${wordmark}<small class="wm-sub">${lang === 'es' ? 'Vigilancia de casas' : 'Home Watch'}</small></a>
  <nav class="menu" aria-label="Main">${nav}<a href="${link('login')}">${t.login}</a></nav>
  <div class="hdr-r">
    <a class="tel" href="tel:${site.phoneE164}">${site.phone}</a>
    <a class="lang" href="${link(alt)}" hreflang="${lang === 'en' ? 'es' : 'en'}" aria-label="${t.langLabel}">${t.lang}</a>
    <a class="btn" href="${link(t.ctaTarget)}">${t.cta}</a>
    <details class="burger"><summary aria-label="Menu"><span></span></summary><nav aria-label="Mobile">${nav}<a href="${link('login')}">${t.login}</a><a href="${link(alt)}">${t.langLabel}</a><a href="tel:${site.phoneE164}">${site.phone}</a><a class="btn" href="${link(t.ctaTarget)}">${t.cta}</a></nav></details>
  </div>
</div></header>`;
}

export function leadForm({ path, lang = 'en', id = 'lead', title, sub, need = 0, dark = false, source = '' }) {
  const t = ui[lang];
  const opts = t.needs.map((n, i) => `<option${i === need ? ' selected' : ''}>${esc(n)}</option>`).join('');
  return `<form class="form${dark ? ' dk' : ''}" id="${id}" name="lead" method="POST" data-netlify="true" netlify-honeypot="company_website" data-lead data-source="${esc(source || path)}" novalidate>
  <input type="hidden" name="form-name" value="lead">
  <h3>${esc(title || t.formTitle)}</h3>
  <p class="muted small">${esc(sub || t.formSub)}</p>
  <div class="f2">
    <div class="field"><label for="${id}-name">${t.name}</label><input id="${id}-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="${id}-phone">${t.phone}</label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" required></div>
  </div>
  <div class="f2">
    <div class="field"><label for="${id}-email">${t.email}</label><input id="${id}-email" name="email" type="email" autocomplete="email"></div>
    <div class="field"><label for="${id}-area">${t.area}</label><input id="${id}-area" name="area" autocomplete="postal-code"></div>
  </div>
  <div class="field"><label for="${id}-need">${t.need}</label><select id="${id}-need" name="need">${opts}</select></div>
  <div class="field"><label for="${id}-msg">${t.message}</label><textarea id="${id}-msg" name="message" rows="3"></textarea></div>
  <input class="hp" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
  <input type="hidden" name="lang" value="${lang}"><input type="hidden" name="source"><input type="hidden" name="page"><input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="ref"><input type="hidden" name="plan">
  <button class="btn arrow" type="submit">${t.send}</button>
  <p class="consent">${t.consent}</p>
  <div class="form-ok" role="status"><h3>${t.okTitle}</h3><p>${t.okText}<a href="tel:${site.phoneE164}">${site.phone}</a>.</p></div>
</form>`;
}

export function faqBlock(faqs) {
  return `<div class="faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>`;
}
export const faqSchema = (faqs) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
export const crumbSchema = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: canonical(p) })) });

export function crumbs(path, items) {
  const { link } = makeLinker(path);
  return `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([name, p], i) => i < items.length - 1 ? `<a href="${link(p)}">${esc(name)}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${esc(name)}</span>`).join('')}</nav>`;
}

export function footer({ path, lang }) {
  const { link } = makeLinker(path);
  const t = ui[lang];
  const svc = services.slice(0, 9).map((s) => `<li><a href="${link(s.slug)}">${esc(s.name)}</a></li>`).join('');
  const who = audiences.slice(0, 8).map((a) => `<li><a href="${link('for/' + a.slug)}">${esc(a.name)}</a></li>`).join('');
  const areas = locations.slice(0, 9).map((l) => `<li><a href="${link('home-watch/' + l.slug)}">${esc(l.name)}</a></li>`).join('') + `<li><a href="${link('areas')}">${lang === 'es' ? 'Todas las zonas' : 'All areas'}</a></li>`;
  const comp = t.company.map(([h, l]) => `<li><a href="${link(h)}">${l}</a></li>`).join('');
  const year = new Date().getFullYear();
  return `<footer class="ftr"><div class="wrap">
  <div class="cols">
    <div class="nap">
      <a class="logo" href="${link(lang === 'es' ? 'es/index' : 'index')}">${logoSvg}${wordmark}</a>
      <p style="margin-top:12px;max-width:34ch"><strong style="color:var(--stone);font-weight:600">${lang === 'es' ? site.sloganEs : site.slogan}</strong><br>${lang === 'es' ? site.promiseEs : site.promise}</p>
      <address class="nap" style="margin-top:8px">
        <span>${site.address.street}<br>${site.address.city}, ${site.address.region} ${site.address.zip}</span>
        <a href="tel:${site.phoneE164}">${site.phone}</a>
        <a href="mailto:${site.email}">${site.email}</a>
        <span>${site.hoursText}</span>
      </address>
    </div>
    <div><h4>${t.fServices}</h4><ul>${svc}<li><a href="${link('services')}">${lang === 'es' ? 'Todos los servicios' : 'All services'}</a></li></ul></div>
    <div><h4>${t.fWho}</h4><ul>${who}</ul></div>
    <div><h4>${t.fAreas}</h4><ul>${areas}</ul></div>
    <div><h4>${t.fCompany}</h4><ul>${comp}</ul></div>
  </div>
  <p class="small" style="margin-top:48px;max-width:110ch">${t.notSecurity}</p>
  <div class="bottom"><span>© ${year} ${site.legalName}. Mansionly is a brand of ${site.legalName}.</span><span><a href="${link('privacy')}">${t.privacy}</a> · <a href="${link('terms')}">${t.terms}</a> · <a href="${link(lang === 'en' ? 'es/index' : 'index')}">${lang === 'en' ? 'Español' : 'English'}</a></span></div>
</div></footer>
<div class="mbar"><a class="btn line" href="tel:${site.phoneE164}" style="color:var(--stone);border-color:rgba(236,232,225,.4);background:transparent">${t.call}</a><a class="btn" href="${link(t.ctaTarget)}" style="background:var(--stone);color:var(--night);border-color:var(--stone)">${t.cta}</a></div>`;
}

export const config = () => ({ supabaseUrl: site.supabaseUrl, supabaseAnonKey: site.supabaseAnonKey, email: site.email, phone: site.phone });
