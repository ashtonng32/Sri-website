# Skyline Reclamation, Inc. — website

Static marketing site for Skyline Reclamation, Inc. (SRI), Fairview, Utah. Plain HTML, CSS and a little JavaScript, with no framework and no runtime dependencies. It can be hosted anywhere static files are served (GitHub Pages, Netlify, Cloudflare Pages, any web host).

## Structure

```
src/partials/     shared head (SEO + LocalBusiness schema, palette), header/nav, footer (closing band + contact), logo rows
src/pages/        page bodies with a small front-matter block (title, description, nav, optional bodyclass and moments)
scripts/build.mjs assembles src/ into the finished pages below; <!-- photo:id|alt|class|attrs --> expands to a WebP <img>
index.html, services/*.html, results.html, safety.html, equipment.html, about.html, contact.html, credits.html   ← generated output
assets/kit/             the design system (tokens, grid, sections, buttons, nav, forms, motion, photo-chapter moments); don't edit
assets/css/site.css     the site's own few rules on top of the kit (logo, logo rows, form, a few per-section heights)
assets/js/site.js       footer year, ?topic= pre-check on the quote form
assets/img/             SRI logos, client/agency logos, stand-in photographs (photo-f*.webp; sizes in photos.json)
```

**Edit files in `src/`, then rebuild:**

```sh
node scripts/build.mjs
```

Generated pages are committed so the site can be deployed straight from the repository root. Don't edit them directly, because the next build overwrites them.

## Before launch: what's still needed from SRI

Each gap is an HTML comment in `src/` starting with "still to come" or "stand-in". Search for those.

| Item | Where |
| --- | --- |
| **Photos.** Every photograph is a licensed Wikimedia Commons stand-in (`data-source="stand-in"`). Replace each with SRI's own job photos, convert to WebP at 640 / 1280 (and 1920 for full-width ones), and add the size to `assets/img/photos.json`. | all pages |
| **Client and agency logos.** W.W. Clyde, Ames Construction, DOGM and FFSL are left out until real files arrive (their SVGs are placeholders). | `src/partials/logos-*.html` |
| **BARS badge.** The old placeholder badge is gone; add the official BARS Silver mark when available. | drone and safety pages |
| Drone payload specs | `services/drone-seeding.html` |
| Fleet quantities, track machine make and model | `equipment.html` |
| Insurance coverage, audit date, EMR/TRIR | `safety.html` |
| Results details (Deer Creek, Mayflower result) | `results.html` |
| Dave Lee's title, bios, headshots, service area | `about.html` |
| Office hours | `contact.html` |
| Specific SWPPP BMPs; application record format; closeout deliverables | erosion, herbicide, services pages |
| Production domain (canonical URLs and schema) | `SITE_URL` in `scripts/build.mjs` |

## Hosting (GitHub Pages)

`.github/workflows/pages.yml` rebuilds the site and publishes it on every push to `main`, or when run manually from the Actions tab. Only the generated pages and `assets/` are published.

One-time setup: in the repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

The site will be at `https://ashtonng32.github.io/Sri-website/`. All links are relative, so it works under that sub-path. To use your own domain, add it under Settings → Pages → Custom domain and update `SITE_URL` in `scripts/build.mjs`.

## Photo credits

All photographs are stand-ins from Wikimedia Commons; `credits.html` (linked from the footer) lists each photographer and licence. The share image is `assets/img/share.jpg` (a shot of the home hero).

## Forms

The quote form (`contact.html`) and parts form (`equipment.html`) open an email to johnlee@skylinereclamation.com until a form service is connected. To connect one (it must accept **file uploads** for plans):

1. Create the two forms with a service such as Formspree.
2. Put each form's address in its `data-endpoint=""` attribute in `src/pages/contact.html` and `src/pages/equipment.html`, and rebuild. The kit then posts to it and shows the sent message.

Linking to `contact.html?topic=safety-docs#quote` (as the Safety page does) pre-checks "Safety documentation".

## Brand reference

| Token | Hex | Use |
| --- | --- | --- |
| Ground | `#efe9e0` (surface `#e2d9cb`) | page background, warm stone |
| Ink | `#22261f` (muted `#5a5c53`) | text; also the dark band ground |
| Pine | `#2e5b44` | buttons, links, focus |

Font: Hanken Grotesk (headings at 400, text 400/500), from Google Fonts. Radius "soft", block buttons.
