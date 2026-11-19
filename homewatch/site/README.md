# Homeward website

A static site with 82 pages (English and Spanish) and no frameworks or dependencies. It is built for 100/100 PageSpeed: CSS inlined in every page, self-hosted fonts, one 4 KB script.

## Build

```bash
node build.mjs              # preview build in dist/ with .html links
CLEAN=1 node build.mjs      # production build with clean URLs (/pricing)
```

## Where things live

| What | File |
|---|---|
| Phone, email, address, domain, prices, Supabase and Stripe keys | `src/config.mjs` |
| Service pages (16) | `src/data/services.mjs` |
| "Who we serve" pages (11) | `src/data/audiences.mjs` |
| Neighborhood pages (16) | `src/data/locations.mjs` |
| Guides / blog (12) | `src/data/guides.mjs` |
| Home page and scroll scene | `src/home.mjs`, `src/scene.mjs` |
| Other pages, Spanish pages | `src/pages.mjs` |
| Design (colors, fonts, layout) | `assets/css/site.css` |
| Database for portal and leads | `supabase/schema.sql` |

To add a page (for example a new neighborhood), add an entry to the data file and rebuild. The sitemap, footer links and schema markup update automatically.

## Hosting (free)

Cloudflare Pages: connect the repo, set the build command to `cd homewatch/site && CLEAN=1 node build.mjs` and the output directory to `homewatch/site/dist`. Then connect the domain and change `site.url` in `src/config.mjs`.

## Turning on leads, portal and payments

1. Create a free Supabase project, run `supabase/schema.sql` in the SQL editor, and put the project URL and anon key in `src/config.mjs`. Website forms then save to the `leads` table, and the client login works. Until this is done, forms open an email to the office address.
2. Create Stripe Payment Links for the three plans and paste the links into `site.stripe`.
3. Add a Google Analytics ID in `site.gaId`.

## Before launch: must be true or must be changed

- **Insurance and bond**: the site says "Bonded & insured". Buy the policy first.
- **Reviews**: the home page reviews are labeled samples. Replace them with real ones. Fake reviews are illegal under the FTC rule.
- **License number**: put the agent's real DRE number in `site.dreLicense`. California requires it on real-estate advertising.
- **Privacy and Terms**: these are drafts. Have an attorney review them.
- **Referral fees** to attorneys and real-estate licensees: confirm with an attorney what each profession allows.
- **LLC name**: update `site.legalName`.
