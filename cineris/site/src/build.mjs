// ORDO CINERIS — static site builder. Zero dependencies: `node src/build.mjs`
// Output: ../public  (deploy that folder to Netlify, Vercel, Cloudflare Pages or GitHub Pages)
import { mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, copyFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import CFG from '../site.config.mjs';
import core from './content/core.mjs';
import pieces from './content/pieces.mjs';
import codex from './content/codex.mjs';
import journal from './content/journal.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'public');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const NAV = [
  ['legend.html', 'Legend'], ['pieces.html', 'Chains'], ['build.html', 'Atelier'], ['vault.html', 'Vault'], ['order.html', 'The Order'], ['journal.html', 'Journal']
];

const ORG = {
  '@type': 'JewelryStore',
  '@id': CFG.url + '/#house',
  name: CFG.name,
  alternateName: CFG.tagline,
  url: CFG.url + '/',
  email: CFG.email,
  ...(CFG.phone ? { telephone: CFG.phone } : {}),
  description: 'Handmade sterling silver chains bound to order on Melrose Avenue, Los Angeles. Oxidized 925 silver, Balinese links, cameos, rubies, 18k gold rings and reliquary links.',
  priceRange: '$$$$',
  address: { '@type': 'PostalAddress', streetAddress: CFG.address.street, addressLocality: CFG.address.city, addressRegion: CFG.address.region, postalCode: CFG.address.zip, addressCountry: CFG.address.country },
  geo: { '@type': 'GeoCoordinates', latitude: CFG.address.lat, longitude: CFG.address.lng },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '12:00', closes: '19:00', description: 'By appointment' }],
  sameAs: [CFG.instagramUrl],
  hasMap: CFG.mapsUrl
};

function layout(page) {
  let p = page;
  const depth = p.path.split('/').length - 1;
  const R = '../'.repeat(depth);
  const canonical = CFG.url + '/' + (p.path === 'index.html' ? '' : p.path);
  const title = p.path === 'index.html' ? p.title : `${p.title} · ${CFG.name}`;
  const crumbs = [{ name: CFG.name, url: CFG.url + '/' }, ...(p.crumbs || []).map(([n, u]) => ({ name: n, url: CFG.url + '/' + u }))];
  const graph = [ORG, { '@type': 'WebPage', '@id': canonical, url: canonical, name: title, description: p.description, isPartOf: { '@type': 'WebSite', name: CFG.name, url: CFG.url + '/' } }];
  if (p.crumbs) graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })) });
  if (p.schema) graph.push(...[].concat(p.schema));
  const fix = s => (s || '').replace(/(href|src)="@\//g, `$1="${R}`);
  const body = fix(p.body);
  p = { ...p, head: fix(p.head) };
  const scripts = ['config.js', 'chain.js', 'main.js', ...(p.scripts || [])].map(s => `<script src="${R}assets/js/${s}" defer></script>`).join('\n');
  const crumbHtml = p.crumbs ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="${R}index.html">${CFG.name}</a>${p.crumbs.map(([n, u], i) => `<span aria-hidden="true">/</span>${i === p.crumbs.length - 1 ? `<span>${esc(n)}</span>` : `<a href="${R}${u}">${esc(n)}</a>`}`).join('')}</nav>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#0a0909">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="${CFG.name}">
<meta property="og:title" content="${esc(p.ogTitle || p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${CFG.url}/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${R}assets/img/mark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${R}assets/css/main.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
</head>
<body>
<a class="sr" href="#main">Skip to content</a>
<header class="site-head">
  <div class="wrap">
    <a class="mark" href="${R}index.html">Ordo Cineris</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">
      ${NAV.map(([u, n]) => `<a href="${R}${u}"${u === p.path ? ' aria-current="page"' : ''}>${n}</a>`).join('\n      ')}
      <a class="btn small" href="${R}apply.html">Request an audience</a>
    </nav>
  </div>
</header>
${p.spine === false ? '' : '<div class="spine" aria-hidden="true"><svg></svg></div>'}
<main id="main">
${p.head ? `<section class="page-head"><div class="wrap${p.narrow ? ' narrow' : ''}">${crumbHtml}${p.head}</div></section>` : ''}
${body}
</main>
<footer class="site-foot">
  <div class="wrap">
    <div class="cols">
      <div class="stack">
        <a class="mark" href="${R}index.html">Ordo Cineris</a>
        <p>Sterling silver chains bound by hand, one person at a time, on ${CFG.address.street}, ${CFG.address.city}. ${CFG.hours}</p>
        <p class="mono">${CFG.email}<br>${CFG.instagram}</p>
      </div>
      <div><p class="label">The House</p><ul><li><a href="${R}legend.html">Legend</a></li><li><a href="${R}burning.html">The Burning</a></li><li><a href="${R}order.html">The Order</a></li><li><a href="${R}concordance.html">Concordance</a></li><li><a href="${R}visit.html">The atelier on Melrose</a></li></ul></div>
      <div><p class="label">Chains</p><ul><li><a href="${R}pieces.html">All chains &amp; links</a></li><li><a href="${R}build.html">Build a chain</a></li><li><a href="${R}vault.html">The Vault</a></li><li><a href="${R}codex.html">Codex</a></li><li><a href="${R}journal.html">Journal</a></li></ul></div>
      <div><p class="label">Care &amp; terms</p><ul><li><a href="${R}care.html">Care &amp; repair</a></li><li><a href="${R}faq.html">Questions</a></li><li><a href="${R}policies.html">Terms &amp; no-return policy</a></li><li><a href="${R}privacy.html">Privacy</a></li></ul></div>
    </div>
    <div class="legal"><span>© <span data-year>2026</span> ${CFG.name}</span><span>925 sterling silver · Made in Los Angeles</span><span>All pieces made to order. No returns or exchanges.</span></div>
  </div>
</footer>
${scripts}
</body>
</html>
`;
}

/* ---------- build ---------- */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

function copyDir(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const f of readdirSync(src)) {
    const s = join(src, f), d = join(dst, f);
    if (statSync(s).isDirectory()) copyDir(s, d); else copyFileSync(s, d);
  }
}
copyDir(join(HERE, 'assets'), join(OUT, 'assets'));
writeFileSync(join(OUT, 'assets/js/config.js'), `window.CINERIS_CONFIG=${JSON.stringify({ email: CFG.email, instagram: CFG.instagram, formEndpoint: CFG.formEndpoint })};\n`);

const ctx = { CFG, pieces, codex, journal, esc };
const pages = [...core(ctx), ...pieces.map(x => x.page(ctx)), ...codex.map(x => x.page ? x.page(ctx) : articlePage(x, 'codex', ctx)), ...journal.map(x => articlePage(x, 'journal', ctx))];

function articlePage(a, section, { CFG }) {
  const isCodex = section === 'codex';
  const list = isCodex ? codex : journal;
  const rel = (a.related || list.filter(x => x.slug !== a.slug).slice(0, 3).map(x => x.slug)).map(s => [...codex, ...journal].find(x => x.slug === s)).filter(Boolean);
  const href = x => `@/${codex.includes(x) ? 'codex' : 'journal'}/${x.slug}.html`;
  return {
    path: `${section}/${a.slug}.html`,
    title: a.title,
    description: a.description,
    ogType: 'article',
    narrow: true,
    crumbs: [[isCodex ? 'Codex' : 'Journal', `${section}.html`], [a.short || a.title, `${section}/${a.slug}.html`]],
    head: `<p class="eyebrow">${isCodex ? 'Codex · ' + (a.kicker || 'Reference') : 'Journal · ' + (a.kicker || 'Notes from the atelier')}</p><h1 style="font-size:var(--step-3)">${a.h1 || a.title}</h1>${a.dek ? `<p class="lede">${a.dek}</p>` : ''}`,
    body: `<article class="article-body"><div class="wrap narrow prose">${a.body}
<p class="muted it">Ordo Cineris binds every chain by hand on ${CFG.address.street}, Los Angeles. <a href="@/build.html">Build yours in the atelier</a> or <a href="@/apply.html">request an audience</a>.</p></div></article>
<aside class="related"><div class="wrap narrow stack"><p class="label">Continue</p><ul class="toc-list">${rel.map(x => `<li><a href="${href(x)}">${x.short || x.title}</a><small>${x.description}</small></li>`).join('')}</ul></div></aside>`,
    schema: { '@type': 'Article', headline: a.title, description: a.description, author: { '@type': 'Organization', name: CFG.name }, publisher: { '@id': CFG.url + '/#house' }, datePublished: a.date || '2026-11-06', mainEntityOfPage: CFG.url + `/${section}/${a.slug}.html` }
  };
}

for (const p of pages) {
  const f = join(OUT, p.path);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, layout(p));
}

// sitemap & robots
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => !p.noindex).map(p => `  <url><loc>${CFG.url}/${p.path === 'index.html' ? '' : p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === 'index.html' ? '1.0' : p.path.includes('/') ? '0.6' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${CFG.url}/sitemap.xml\n`);
writeFileSync(join(OUT, 'CNAME'), CFG.url.replace(/^https?:\/\//, '') + '\n');

console.log(`Built ${pages.length} pages into ${OUT}`);
