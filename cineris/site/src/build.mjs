// KEPT — static site builder. Zero dependencies: `node src/build.mjs`
// Output: ../public  (deploy that folder to Netlify, Vercel, Cloudflare Pages or GitHub Pages)
import { mkdirSync, writeFileSync, readdirSync, rmSync, copyFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import CFG from '../site.config.mjs';
import core from './content/core.mjs';
import pieces from './content/pieces.mjs';
import codex from './content/codex.mjs';
import journal from './content/journal.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'public');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const NAV = [['collection.html', 'Collection'], ['memory.html', 'Memory'], ['message.html', 'Message'], ['atelier.html', 'Atelier']];
const GSAP = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/';

const STORE = {
  '@type': 'JewelryStore', '@id': CFG.url + '/#store', name: CFG.name, url: CFG.url + '/', email: CFG.email,
  description: 'Handmade 925 sterling silver chains made to order on Melrose Avenue, Los Angeles. Fine chain that breaks into hand-forged weight at one black link with a gold rivet. Memory links for a tear, a voice or a lock of hair.',
  priceRange: '$$$$',
  address: { '@type': 'PostalAddress', streetAddress: CFG.address.street, addressLocality: CFG.address.city, addressRegion: CFG.address.region, postalCode: CFG.address.zip, addressCountry: CFG.address.country },
  geo: { '@type': 'GeoCoordinates', latitude: CFG.address.lat, longitude: CFG.address.lng },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '12:00', closes: '19:00', description: 'By appointment' }],
  sameAs: [CFG.instagramUrl], hasMap: CFG.mapsUrl
};

function layout(page) {
  const p = page;
  const R = '../'.repeat(p.path.split('/').length - 1);
  const fix = s => (s || '').replace(/(href|src)="@\//g, `$1="${R}`);
  const canonical = CFG.url + '/' + (p.path === 'index.html' ? '' : p.path);
  const title = p.path === 'index.html' ? p.title : `${p.title} — ${CFG.name}`;
  const graph = [STORE, { '@type': 'WebPage', '@id': canonical, url: canonical, name: title, description: p.description }];
  if (p.crumbs) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ name: CFG.name, url: CFG.url + '/' }, ...p.crumbs.map(([n, u]) => ({ name: n, url: CFG.url + '/' + u }))].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })) });
  if (p.schema) graph.push(...[].concat(p.schema));
  const crumbs = p.crumbs ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="${R}index.html">${CFG.name}</a>${p.crumbs.map(([n, u], i) => `<span aria-hidden="true">/</span>${i === p.crumbs.length - 1 ? `<span>${esc(n)}</span>` : `<a href="${R}${u}">${esc(n)}</a>`}`).join('')}</nav>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(p.description)}">
${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta name="theme-color" content="#090909">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="${CFG.name}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${CFG.url}/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${R}assets/img/mark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..700&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="${R}assets/css/main.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
</head>
<body>
<a class="sr" href="#main">Skip to content</a>
<header class="site-head">
  <div class="wrap">
    <a class="mark" href="${R}index.html" aria-label="${CFG.name}, home">KEPT</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">
      ${NAV.map(([u, n]) => `<a href="${R}${u}"${u === p.path ? ' aria-current="page"' : ''}>${n}</a>`).join('\n      ')}
    </nav>
  </div>
</header>
<main id="main">
${p.head ? `<section class="page-head"><div class="wrap${p.narrow ? ' narrow' : ''}">${crumbs}${fix(p.head)}</div></section>` : ''}
${fix(p.body)}
</main>
<footer class="site-foot">
  <div class="wrap">
    <div class="cols">
      <div class="stack"><p>${CFG.address.street}, ${CFG.address.city}<br><span class="mute">${CFG.hours}</span></p><p class="mute">${CFG.email}<br><a href="${CFG.instagramUrl}" rel="noopener" target="_blank">${CFG.instagram}</a></p></div>
      <ul><li><a href="${R}collection.html">Collection</a></li><li><a href="${R}memory.html">Memory</a></li><li><a href="${R}message.html">Message</a></li><li><a href="${R}edition.html">Edition 01</a></li></ul>
      <ul><li><a href="${R}atelier.html">Atelier</a></li><li><a href="${R}journal.html">Journal</a></li><li><a href="${R}codex.html">Codex</a></li><li><a href="${R}faq.html">Questions</a></li></ul>
      <ul><li><a href="${R}care.html">Care</a></li><li><a href="${R}terms.html">Terms</a></li><li><a href="${R}privacy.html">Privacy</a></li></ul>
    </div>
    <p class="big" aria-hidden="true">KEPT</p>
    <div class="legal cap"><span>© <span data-year>2026</span> ${CFG.name}</span><span>925 sterling · Los Angeles</span><span>Made to order. Final sale.</span></div>
  </div>
</footer>
<script src="${GSAP}gsap.min.js" defer></script>
<script src="${GSAP}ScrollTrigger.min.js" defer></script>
${['config.js', 'chain.js', 'main.js', ...(p.scripts || [])].map(s => `<script src="${R}assets/js/${s}" defer></script>`).join('\n')}
</body>
</html>
`;
}

function articlePage(a, section) {
  const all = [...codex, ...journal];
  const href = x => `@/${codex.includes(x) ? 'codex' : 'journal'}/${x.slug}.html`;
  const rel = (a.related || []).map(s => all.find(x => x.slug === s)).filter(Boolean).slice(0, 3);
  return {
    path: `${section}/${a.slug}.html`, title: a.title, description: a.description, ogType: 'article', narrow: true,
    crumbs: [[section === 'codex' ? 'Codex' : 'Journal', `${section}.html`], [a.short || a.title, `${section}/${a.slug}.html`]],
    head: `<p class="cap">${a.kicker || ''}</p><h1 style="margin-top:18px">${a.short || a.title}</h1>${a.dek ? `<p class="lede" style="margin-top:28px">${a.dek}</p>` : ''}`,
    body: `<article class="wrap narrow prose">${a.body}${rel.length ? `<p class="cap" style="margin-top:48px">Continue</p><ul class="list">${rel.map(x => `<li><a href="${href(x)}"><span><h3>${x.short || x.title}</h3><small>${x.description}</small></span><span class="cap">Read</span></a></li>`).join('')}</ul>` : ''}</article>`,
    schema: { '@type': 'Article', headline: a.title, description: a.description, author: { '@type': 'Organization', name: CFG.name }, publisher: { '@id': CFG.url + '/#store' }, datePublished: a.date || '2026-11-06' }
  };
}

/* ---------- build ---------- */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const copyDir = (src, dst) => { mkdirSync(dst, { recursive: true }); for (const f of readdirSync(src)) { const s = join(src, f), d = join(dst, f); statSync(s).isDirectory() ? copyDir(s, d) : copyFileSync(s, d); } };
copyDir(join(HERE, 'assets'), join(OUT, 'assets'));
writeFileSync(join(OUT, 'assets/js/config.js'), `window.CINERIS_CONFIG=${JSON.stringify({ email: CFG.email, instagram: CFG.instagram, formEndpoint: CFG.formEndpoint })};\n`);

const pages = [...core({ CFG, pieces, codex, journal, esc }), ...pieces.map(x => x.page({ CFG })), ...codex.map(a => articlePage(a, 'codex')), ...journal.map(a => articlePage(a, 'journal'))];
for (const p of pages) { const f = join(OUT, p.path); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, layout(p)); }

// internal link check: every relative href/src must exist
const bad = [];
for (const p of pages) {
  const html = layout(p);
  for (const [, u] of html.matchAll(/(?:href|src)="([^"#:?]+)(?:[#?][^"]*)?"/g)) {
    if (/^(https?:|mailto:|tel:|\/\/)/.test(u)) continue;
    const target = posix.normalize(posix.join(posix.dirname(p.path), u));
    if (!existsSync(join(OUT, target))) bad.push(`${p.path} → ${u}`);
  }
}
if (bad.length) { console.error('Broken links:\n' + [...new Set(bad)].join('\n')); process.exitCode = 1; }

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => !p.noindex).map(p => `  <url><loc>${CFG.url}/${p.path === 'index.html' ? '' : p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${CFG.url}/sitemap.xml\n`);
console.log(`Built ${pages.length} pages into ${OUT}`);
