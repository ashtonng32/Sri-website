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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const PAGES = join(SRC, "pages");
const PARTIALS = join(SRC, "partials");

// Public site URL, used for canonical links, Open Graph and schema.
// [Confirm the production domain before launch.]
const SITE_URL = "https://www.skylinereclamation.com";

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
  html = expandIncludes(html);

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
  };
  html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));

  const out = join(ROOT, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  count++;
}
console.log(`Built ${count} pages.`);
