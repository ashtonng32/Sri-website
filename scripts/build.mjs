#!/usr/bin/env node
/**
 * Minimal static-site build for the Skyline Reclamation website.
 *
 * - Reads every page in src/pages/** (HTML with a small front-matter block)
 * - Wraps it with the shared partials in src/partials (head, header, footer)
 * - Expands <!-- include:name --> tags from src/partials/name.html
 * - Writes the finished pages to the repository root, mirroring the folder
 *   structure (src/pages/services/hydroseeding.html -> services/hydroseeding.html)
 *
 * No dependencies. Run with:  node scripts/build.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const PAGES = join(SRC, "pages");
const PARTIALS = join(SRC, "partials");

// Public site URL, used for canonical links, Open Graph and schema.
// [Confirm the production domain before launch.]
const SITE_URL = "https://www.skylinereclamation.com";

// Version tags for CSS/JS so browsers fetch the new file whenever it changes
// (GitHub Pages lets browsers cache assets for ~10 minutes).
const assetVersion = (rel) =>
  createHash("sha1").update(readFileSync(join(ROOT, rel))).digest("hex").slice(0, 10);
const CSS_V = assetVersion("assets/css/site.css");
const JS_V = assetVersion("assets/js/site.js");
const KIT_V = assetVersion("assets/kit/system.css");

const partial = (name) => readFileSync(join(PARTIALS, `${name}.html`), "utf8");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

function parseFrontMatter(src, file) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error(`Missing front matter in ${file}`);
  const data = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: src.slice(m[0].length) };
}

// <!-- photo:f123|alt text|class|extra attributes --> becomes the <img> with its 640/1280 WebP srcset
// (sizes from assets/img/photos.json, written when the photographs were converted)
const PHOTOS = JSON.parse(readFileSync(join(ROOT, "assets/img/photos.json"), "utf8"));
function expandPhotos(html) {
  return html.replace(/<!--\s*photo:(\w+)\|([^|]*)\|([^|]*)(?:\|([^>]*?))?\s*-->/g, (_, id, alt, cls, extra = "") => {
    const [w, h] = PHOTOS[id] || [1280, 853];
    const src = (n) => `{{root}}assets/img/photo-${id}-${n}.webp`;
    const lazy = /fetchpriority/.test(extra) ? "" : ' loading="lazy" decoding="async"';
    return `<img${cls ? ` class="${cls}"` : ""} src="${src(1280)}" srcset="${src(640)} 640w, ${src(1280)} 1280w" sizes="(max-width: 1023px) 100vw, 900px" width="${w}" height="${h}" alt="${alt}"${lazy} data-source="stand-in" ${extra.trim()}>`;
  });
}

function expandIncludes(html, depth = 0) {
  if (depth > 5) return html;
  return html.replace(/<!--\s*include:([\w-]+)\s*-->/g, (_, name) => expandIncludes(partial(name), depth + 1));
}

let count = 0;
for (const file of walk(PAGES)) {
  const rel = relative(PAGES, file).split(sep).join("/");
  const { data, body } = parseFrontMatter(readFileSync(file, "utf8"), rel);
  const depth = rel.split("/").length - 1;
  const root = depth === 0 ? "" : "../".repeat(depth);
  const urlPath = rel === "index.html" ? "/" : `/${rel}`;

  let html = [partial("head"), partial("header"), body, partial("footer")].join("\n");
  html = expandPhotos(expandIncludes(html));

  // Mark the active nav item.
  if (data.nav) {
    html = html.replaceAll(`data-nav="${data.nav}"`, `data-nav="${data.nav}" aria-current="page"`);
  }

  const vars = {
    root,
    title: data.title,
    description: data.description,
    canonical: SITE_URL + urlPath,
    site: SITE_URL,
    bodyclass: data.bodyclass || "",
    cssv: CSS_V,
    jsv: JS_V,
    kitv: KIT_V,
    // moments the page mounts (front matter "moments: photo-chapters, picture-develops"): preload their modules
    moments: (data.moments || "")
      .split(",").map((m) => m.trim()).filter(Boolean)
      .map((m) => `<link rel="modulepreload" href="${root}assets/kit/moments/${m}/moment.js">`).join("\n"),
  };
  html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));

  const out = join(ROOT, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  count++;
}
console.log(`Built ${count} pages.`);
