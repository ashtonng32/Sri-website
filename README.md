# Skyline Reclamation, Inc. — website

Static marketing site for Skyline Reclamation, Inc. (SRI), Fairview, Utah. Plain HTML, CSS and a little JavaScript, with no framework and no runtime dependencies. It can be hosted anywhere static files are served (GitHub Pages, Netlify, Cloudflare Pages, any web host).

## Structure

```
src/partials/     shared head (SEO + LocalBusiness schema), header/nav, footer, CTA band, logo walls, BARS badge
src/pages/        page bodies with a small front-matter block (title, description, nav)
scripts/build.mjs assembles src/ into the finished pages below
index.html, services/*.html, results.html, safety.html, equipment.html, about.html, contact.html   ← generated output
assets/css/styles.css   design system (colors, type, panels, data tables, stripe, CTA band)
assets/js/main.js       mobile nav, dropdown, fade-ins, form fallback
assets/img/             logo placeholders, favicon, photos
```

**Edit files in `src/`, then rebuild:**

```sh
node scripts/build.mjs
```

Generated pages are committed so the site can be deployed straight from the repository root. Don't edit them directly, because the next build overwrites them.

## Before launch: placeholders to fill in

Search the `src/` folder for `[` to find each one.

| Item | Where |
| --- | --- |
| **Photos.** Add job-site photos to `assets/img/photos/`. For heroes, uncomment `--photo: url(...)` in the section's `style`. For cards, add `style="--photo:url(...)"` to the `<figure class="photo">` and remove the label. | all pages |
| **Client and agency logos.** 10 of 14 are in place. Still needed: W.W. Clyde, Ames Construction, DOGM, FFSL. Add each as a PNG in `assets/img/logos/`, point `src/partials/logos-*.html` at it, and set a height like the others. Confirm logo usage rights with each client. | logo walls |
| **BARS badge.** Replace with the official BARS Silver mark per Flight Safety Foundation guidelines. | `src/partials/bars-badge.html`, drone and safety pages |
| **SRI logo.** The header uses an interim mark. Swap in the official logo. | `src/partials/header.html`, `footer.html` |
| Drone payload specs and notes | `services/drone-seeding.html` |
| Fleet quantities, track machine make and model | `equipment.html` |
| Insurance coverage, audit date, EMR/TRIR | `safety.html` |
| Results details (Deer Creek, high-elevation, Mayflower result) | `results.html` |
| Dave Lee's title, bios, headshots, service area | `about.html` |
| Office hours | `contact.html` |
| Specific SWPPP BMPs | `erosion-control.html` |
| Production domain (canonical URLs and schema) | `SITE_URL` in `scripts/build.mjs` |
| Social share image, 1200×630 | `assets/img/og-image.png` |

## Hosting (GitHub Pages)

`.github/workflows/pages.yml` rebuilds the site and publishes it on every push to `main`, or when run manually from the Actions tab. Only the generated pages and `assets/` are published.

One-time setup: in the repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

The site will be at `https://ashtonng32.github.io/Sri-website/`. All links are relative, so it works under that sub-path. To use your own domain, add it under Settings → Pages → Custom domain and update `SITE_URL` in `scripts/build.mjs`.

## Forms

The quote form (`contact.html`) and parts form (`equipment.html`) post to placeholder Formspree URLs. Until those are replaced, submitting shows a message asking the visitor to call or email. To connect them:

1. Create two forms with a form service that supports **file uploads** (for example Formspree or Netlify Forms).
2. Replace `[QUOTE_FORM_ID]` and `[PARTS_FORM_ID]` in `src/pages/contact.html` and `src/pages/equipment.html`.
3. Rebuild.

Linking to `contact.html?topic=safety-docs#quote` (as the Safety page does) pre-checks “Safety documentation request.”

## Brand reference

| Token | Hex | Use |
| --- | --- | --- |
| Forest | `#2f492f` (hover `#1f321f`) | headings, nav, footer, primary buttons |
| Field | `#6aa84f` | CTAs, CTA band, stripe, icons, active states (text on it: `#1c211c`) |
| Accent text | `#3d7a32` | eyebrows, secondary links |
| Panel | `#eaf1e3` | section bands, card and table headers |
| Stripe | `#f8fbf5` | alternating rows |
| Ink / Muted / Rule | `#1c211c` / `#55605a` / `#d9dcd6` | text, secondary text, borders |

Fonts: Source Serif 4 (headings) and Inter (body/UI), loaded from Google Fonts.
