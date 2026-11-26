// Static site generator for Mansionly. No dependencies: `node build.mjs`.
//   CLEAN=1 node build.mjs     -> production build with clean URLs (/pricing), for Cloudflare Pages / Netlify / Vercel
//   node build.mjs             -> preview build with relative .html links (opens from disk)
//   ARTIFACT=1 node build.mjs  -> preview build whose index.html is a bare fragment for the Claude artifact viewer
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './src/config.mjs';
import { services } from './src/data/services.mjs';
import { audiences } from './src/data/audiences.mjs';
import { locations } from './src/data/locations.mjs';
import { guides } from './src/data/guides.mjs';
import { head, header, footer, makeLinker, canonical, config, CLEAN } from './src/layout.mjs';
import { homePage } from './src/home.mjs';
import { servicePage, audiencePage, locationPage, guidePage, servicesHub, areasHub, audiencesHub, guidesHub, pricingPage, corePages, spanishPages } from './src/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, process.env.OUT || 'dist');
const ARTIFACT = process.env.ARTIFACT === '1';

const css = readFileSync(join(root, 'assets/css/site.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();

const ver = (f) => createHash('sha1').update(readFileSync(join(root, 'assets/js', f))).digest('hex').slice(0, 8);

const pages = [
  homePage('en'), homePage('es'),
  ...services.map(servicePage), ...audiences.map(audiencePage), ...locations.map(locationPage), ...guides.map(guidePage),
  servicesHub(), areasHub(), audiencesHub(), guidesHub(), pricingPage('en'), pricingPage('es'),
  ...corePages(), ...spanishPages(),
];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const p of pages) {
  const { link, asset } = makeLinker(p.path);
  const hw = { ...config(), portalUrl: link('portal') };
  const scripts = ['site.js', ...(p.scripts || [])].map((s) => `<script src="${asset('js/' + s)}?v=${ver(s)}" defer></script>`).join('');
  const ga = site.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.gaId}')</script>` : '';
  const headHtml = head({ ...p, css });
  const bodyHtml = `${header({ path: p.path, lang: p.lang, current: p.current })}
<main id="main">${p.body}</main>
${p.noFooter ? '' : footer({ path: p.path, lang: p.lang })}
<script>window.HW=${JSON.stringify(hw)}</script>${scripts}${ga}`;
  const fragment = ARTIFACT && p.path === 'index';
  const html = fragment
    ? `${headHtml.replace(/<meta charset[^>]*>\n?/, '').replace(/<meta name="viewport"[^>]*>\n?/, '')}\n<meta name="claude:viewport-fit-sides" content="cover">\n${bodyHtml}`
    : `<!doctype html>\n<html lang="${p.lang}">\n<head>\n${headHtml}\n</head>\n<body>\n${bodyHtml}\n</body>\n</html>\n`;
  const file = join(out, p.path + '.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

cpSync(join(root, 'assets'), join(out, 'assets'), { recursive: true, filter: (s) => !s.endsWith('.css') });

const indexable = pages.filter((p) => !p.noindex);
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((p) => `<url><loc>${canonical(p.path)}</loc><lastmod>2026-11-19</lastmod><priority>${p.path === 'index' ? '1.0' : p.path.includes('/') ? '0.7' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /portal\nDisallow: /login\nSitemap: ${site.url}/sitemap.xml\n`);
// Cloudflare Pages / Netlify headers: long cache for fonts and scripts, security headers for pages.
writeFileSync(join(out, '_headers'), `/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`);

console.log(`Built ${pages.length} pages (${indexable.length} indexable) into ${out}${CLEAN ? ' [clean URLs]' : ''}${ARTIFACT ? ' [artifact]' : ''}`);
