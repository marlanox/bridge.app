// MARLA KNOX — static site builder. Zero dependencies: `node src/build.mjs`
// Output: ../public  (deploy to Netlify, Vercel, Cloudflare Pages or GitHub Pages)
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
const NAV = [['build.html', 'Compose'], ['vault.html', 'Vault'], ['legend.html', 'Legend'], ['faq.html', 'Questions']];
const GSAP = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/';

const ORG = {
  '@type': ['Organization', 'OnlineStore'], '@id': CFG.url + '/#house', name: CFG.name, url: CFG.url + '/', email: CFG.email,
  founder: { '@type': 'Person', name: CFG.founder.name }, foundingDate: String(CFG.founder.since),
  description: `The Three Fine Jewelry, Los Angeles: a private Vault cell for one year, and the sterling silver chain made by hand by ${CFG.founder.name} that is its only key. Jewelry since ${CFG.founder.since}.`,
  address: { '@type': 'PostalAddress', addressLocality: CFG.city, addressRegion: CFG.region, addressCountry: 'US' },
  areaServed: 'Worldwide', sameAs: [CFG.instagramUrl]
};

function layout(p) {
  const R = '../'.repeat(p.path.split('/').length - 1);
  const fix = s => (s || '').replace(/(href|src)="@\//g, `$1="${R}`).replace(/url\(@\//g, `url(${R}`);
  const canonical = CFG.url + '/' + (p.path === 'index.html' ? '' : p.path);
  const title = p.path === 'index.html' ? `${CFG.name} — ${CFG.line}` : `${p.title} — ${CFG.name}`;
  const graph = [ORG, { '@type': 'WebPage', '@id': canonical, url: canonical, name: title, description: p.description }];
  if (p.crumbs) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ name: CFG.name, url: CFG.url + '/' }, ...p.crumbs.map(([n, u]) => ({ name: n, url: CFG.url + '/' + u }))].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })) });
  if (p.schema) graph.push(...[].concat(p.schema));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(p.description)}">
${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta name="theme-color" content="#000000">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="${CFG.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${CFG.url}/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${R}assets/img/mark.png" type="image/png">
<link rel="apple-touch-icon" href="${R}assets/img/mark.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Courier+Prime&display=swap">
<link rel="stylesheet" href="${R}assets/css/main.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
</head>
<body>
<a class="sr" href="#main">Skip to content</a>
<header class="site-head">
  <div class="wrap">
    <a class="mark" href="${R}index.html" aria-label="${CFG.name} ${CFG.line}"><img class="mark-img" src="${R}assets/img/three.png" alt=""></a>
    <button class="sound-btn cap" type="button" aria-pressed="false" title="Sound">Sound · off</button>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">${NAV.map(([u, n]) => `<a href="${R}${u}"${u === p.path ? ' aria-current="page"' : ''}>${n}</a>`).join('')}</nav>
  </div>
</header>
<main id="main">
${fix(p.body)}
</main>
<footer class="site-foot">
  <nav class="cap" aria-label="Footer"><a href="${R}build.html">Compose your key</a><a href="${R}vault.html">Open a cell</a><a href="${R}seal.html">Seal your cell</a><a href="${R}legend.html">Legend</a><a href="${R}contact.html">Contact</a><a href="${R}journal.html">Journal</a><a href="${R}codex.html">Codex</a><a href="${R}faq.html">Questions</a><a href="${R}care.html">Care</a><a href="${R}terms.html">Terms</a><a href="${R}privacy.html">Privacy</a></nav>
  <img src="${R}assets/img/three.png" alt="" style="height:30px;width:auto;margin:0 auto;opacity:.8">
  <p class="cap dim">Fine Jewelry · Los Angeles</p>
  ${CFG.clothingUrl ? `<p class="cap"><a href="${CFG.clothingUrl}" target="_blank" rel="noopener">${CFG.clothingName} →</a></p>` : `<p class="cap dim">${CFG.clothingName}</p>`}
  <p class="cap">${CFG.city} · Since ${CFG.founder.since} · <a href="${CFG.instagramUrl}" target="_blank" rel="noopener">${CFG.instagram}</a></p>
  <p class="cap">© <span data-year>2026</span> ${CFG.name} · Final sale</p>
</footer>
<script src="${GSAP}gsap.min.js" defer></script>
<script src="${GSAP}ScrollTrigger.min.js" defer></script>
${['config.js', 'main.js', 'sound.js', ...(p.scripts || [])].map(s => `<script src="${R}assets/js/${s}" defer></script>`).join('\n')}
</body>
</html>
`;
}

function articlePage(a, section) {
  const all = [...codex, ...journal];
  const href = x => `@/${codex.includes(x) ? 'codex' : 'journal'}/${x.slug}.html`;
  const rel = (a.related || []).map(s => all.find(x => x.slug === s)).filter(Boolean).slice(0, 3);
  return {
    path: `${section}/${a.slug}.html`, title: a.title, description: a.description, ogType: 'article',
    crumbs: [[section === 'codex' ? 'Codex' : 'Journal', `${section}.html`], [a.short || a.title, `${section}/${a.slug}.html`]],
    body: `<section class="wrap page"><div class="page-head"><p class="cap dim"><a href="@/${section}.html">${section === 'codex' ? 'Codex' : 'Journal'}</a></p><h1 class="title">${a.short || a.title}</h1>${a.dek ? `<p class="it dim">${a.dek}</p>` : ''}</div>
<article class="prose">${a.body}</article>${rel.length ? `<ul class="list" style="margin-top:100px">${rel.map(x => `<li><a href="${href(x)}"><span class="cap">${x.short || x.title}</span><small>${x.description}</small></a></li>`).join('')}</ul>` : ''}</section>`,
    schema: { '@type': 'Article', headline: a.title, description: a.description, author: { '@type': 'Person', name: CFG.founder.name }, publisher: { '@id': CFG.url + '/#house' }, datePublished: a.date || '2026-11-06' }
  };
}

/* ---------- build ---------- */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const copyDir = (src, dst) => { mkdirSync(dst, { recursive: true }); for (const f of readdirSync(src)) { const s = join(src, f), d = join(dst, f); statSync(s).isDirectory() ? copyDir(s, d) : copyFileSync(s, d); } };
copyDir(join(HERE, 'assets'), join(OUT, 'assets'));
writeFileSync(join(OUT, 'assets/js/config.js'), `window.CINERIS_CONFIG=${JSON.stringify({ email: CFG.email, instagram: CFG.instagram, formEndpoint: CFG.formEndpoint, vaultMaxDays: CFG.vaultMaxDays, vaultApi: CFG.vaultApi })};\n`);

const pages = [...core({ CFG, pieces, codex, journal, esc }), ...pieces.map(x => x.page({ CFG })), ...codex.map(a => articlePage(a, 'codex')), ...journal.map(a => articlePage(a, 'journal'))];
for (const p of pages) { const f = join(OUT, p.path); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, layout(p)); }

const bad = [];
for (const p of pages) {
  for (const [, u] of layout(p).matchAll(/(?:href|src)="([^"#:?]+)(?:[#?][^"]*)?"|url\(([^)#:?]+)\)/g)) {
    if (!u || /^(https?:|mailto:|tel:|\/\/)/.test(u)) continue;
    const target = posix.normalize(posix.join(posix.dirname(p.path), u));
    if (!existsSync(join(OUT, target))) bad.push(`${p.path} → ${u}`);
  }
}
if (bad.length) { console.error('Broken links:\n' + [...new Set(bad)].join('\n')); process.exitCode = 1; }

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => !p.noindex).map(p => `  <url><loc>${CFG.url}/${p.path === 'index.html' ? '' : p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${CFG.url}/sitemap.xml\n`);
console.log(`Built ${pages.length} pages into ${OUT}`);
