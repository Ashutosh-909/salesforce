# Website Build Plan — Salesforce Personalization Guide

> **Purpose:** Step-by-step plan for the **webdeveloper** agent to build a complete, production-ready static website from the Markdown content files and the handoff.md specification.
>
> **Approach:** Plain HTML/CSS/JS static site with a Node.js build script that reads Markdown content files, applies a shared HTML layout template, and outputs 21 fully rendered pages to `site/`.
>
> **Date:** March 2026

---

## Phase 0 — Project Scaffolding

| # | Task | Details |
|---|---|---|
| 0.1 | Create `site/` output directory structure | Mirror the URL paths from handoff.md §1 (21 directories, each with `index.html`). |
| 0.2 | Initialize `package.json` | Minimal — only dev dependencies for the build script. |
| 0.3 | Install build dependencies | `markdown-it` (MD parser), `markdown-it-anchor` (heading IDs), `prismjs` (syntax highlighting), `glob` (file matching). |
| 0.4 | Create directory layout | `build/` (build script + templates), `site/css/`, `site/js/`, `site/assets/`. |

---

## Phase 1 — Shared Layout & CSS

| # | Task | Spec Reference |
|---|---|---|
| 1.1 | **HTML layout template** (`build/layout.html`) | Includes: `<head>` with AdSense script, nav bar, header ad slot, sidebar (TOC + donation card + sidebar ad), breadcrumbs, `<main>` content area, prev/next buttons, end-of-page donation CTA, footer ad, footer. Placeholder tokens: `{{TITLE}}`, `{{BREADCRUMBS}}`, `{{TOC}}`, `{{CONTENT}}`, `{{PREV_NEXT}}`, etc. |
| 1.2 | **Homepage layout template** (`build/homepage-layout.html`) | Variant of layout.html: hero section, feature card grid, CTA button — no sidebar TOC. §7. |
| 1.3 | **CSS stylesheet** (`site/css/style.css`) | Full stylesheet implementing §4.1–§4.7: colors, typography, nav bar (`#0176D3`, sticky, 56px), sidebar (260px, sticky), breadcrumbs, code blocks (dark theme, border-radius 6px, 16px padding, language label, copy button area), tables (header `#F3F3F3`, zebra striping, borders), callout boxes (5 types — tip/important/warning/note/needs-validation with colored borders/backgrounds), prev/next card buttons, footer (`#181818` bg), responsive breakpoints (≥1200, 768–1199, <768), hamburger menu, donation button (`#FF813F` pill), sidebar donation card, ad containers. |
| 1.4 | **Google Fonts / Inter** | Add `<link>` for Inter and JetBrains Mono fonts from Google Fonts CDN. |

---

## Phase 2 — JavaScript Interactivity

| # | Task | Details |
|---|---|---|
| 2.1 | **`site/js/main.js`** | Hamburger menu toggle, dropdown nav (hover on desktop, tap on mobile), scroll spy for sidebar TOC active state, smooth scroll on TOC click. |
| 2.2 | **`site/js/copy-code.js`** | Attach click handler to every `.copy-btn` inside code blocks → copy `<code>` text to clipboard, show "Copied!" feedback. |
| 2.3 | **Mermaid.js** | Include Mermaid CDN script in `<head>`. Initialize on `DOMContentLoaded` to render any `<pre><code class="language-mermaid">` blocks as SVG diagrams. |
| 2.4 | **Prism.js CSS** | Include Prism dark theme CSS for code block syntax highlighting. Build script applies Prism classes server-side. |

---

## Phase 3 — Build Script (`build/build.js`)

The core Node.js build script that reads content and generates HTML pages.

| # | Task | Details |
|---|---|---|
| 3.1 | **Page registry** (`build/config.js`) | Hardcode the 21-page registry from §1 as a JS array: `{ contentFile, urlPath, title, parentNav, breadcrumb, prevPage, nextPage }`. Also define `ADS_CONFIG` and `DONATION_CONFIG`. |
| 3.2 | **Markdown parsing pipeline** | For each page: read `.md` → parse with `markdown-it` (with plugins for tables, fenced code, anchors) → apply Prism.js highlighting on server side for language-tagged code blocks. |
| 3.3 | **Callout transformation** | Post-process HTML: detect `<blockquote>` elements whose first child contains bold text matching `💡 Tip:`, `⚠️ Important:`, `🚨 Warning:`, `📝 Note:`, or `🔍 Needs Validation:` → replace with styled `<div class="callout callout-{type}">`. |
| 3.4 | **Cross-reference link rewriting** | Regex-replace `href="...*.md"` relative links → map to URL paths from the page registry (§5.2). Handle `../` paths by resolving relative to the source file's directory. |
| 3.5 | **External link processing** | Find all `<a href="https://...">` → add `target="_blank" rel="noopener noreferrer"` (§5.6). |
| 3.6 | **TOC generation** | Extract H2/H3 headings from parsed HTML → generate sidebar TOC HTML with `<a href="#heading-id">` links. |
| 3.7 | **Breadcrumb generation** | From page registry breadcrumb data → generate `<nav class="breadcrumbs">` HTML with links for each segment except the last. |
| 3.8 | **Prev/Next generation** | From reading order (§3) → generate prev/next card HTML with arrow icons and page titles. |
| 3.9 | **In-content ad injection** | Count H2 headings in content. If ≥ 4, inject ad container `<div>` after the 3rd `<h2>` section. |
| 3.10 | **Template assembly** | Insert all generated fragments (TOC, breadcrumbs, content, prev/next, ads) into the layout template. Write to `site/{urlPath}/index.html`. |
| 3.11 | **Homepage special build** | Parse `homepage.md` differently: extract hero content (first H1 + intro), feature cards from "Salient Features" section, CTA button → inject into homepage layout template. Write to `site/index.html`. |

---

## Phase 4 — Ad & Donation Integration

| # | Task | Details |
|---|---|---|
| 4.1 | **Ads config** | Define `ADS_CONFIG` object with placeholder publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) and slot IDs. Include AdSense `<script>` in HTML `<head>`. |
| 4.2 | **Header ad** | Leaderboard ad container below sticky nav, above breadcrumbs. Not in homepage hero. |
| 4.3 | **Sidebar ad** | Medium rectangle ad below TOC and donation card. Desktop only (≥1200px). |
| 4.4 | **In-content ad** | Injected after 3rd H2 on long pages (handled in build script §3.9). |
| 4.5 | **Footer ad** | Leaderboard ad above footer, below prev/next buttons. |
| 4.6 | **"Advertisement" labels** | Each ad container gets a centered, muted label (`#706E6B`, 12px) above the ad unit. |
| 4.7 | **Donation config** | Define `DONATION_CONFIG` with placeholder URL (`https://buymeacoffee.com/YOUR_USERNAME`). |
| 4.8 | **Nav bar donation button** | `#FF813F` pill button, right side of nav. Full "Buy Me a Latte ☕" label on desktop, ☕ only on mobile. |
| 4.9 | **Sidebar donation card** | Warm card (`#FFF8F0` bg, `#FFD6B3` border) below TOC: "Enjoying this guide?" + "Buy Me a Latte" button. Desktop only. |
| 4.10 | **End-of-page CTA** | Centered banner below prev/next: "Found this guide helpful? Buy Me a Latte ☕". |
| 4.11 | **Footer donation link** | Text link in footer: "Support this project — Buy Me a Latte ☕". |

---

## Phase 5 — Page-by-Page Build & Verification

Build all 21 pages and verify each renders correctly:

| # | Content File | URL Path |
|---|---|---|
| 5.1 | `content/homepage.md` | `/` (special rendering) |
| 5.2 | `content/setup-permissions.md` | `/setup-permissions/` |
| 5.3 | `content/data-capturing-modeling/overview.md` | `/data-capturing-modeling/` |
| 5.4 | `content/data-capturing-modeling/web-data-capturing.md` | `/data-capturing-modeling/web-data-capturing/` |
| 5.5 | `content/data-capturing-modeling/mobile-data-capturing.md` | `/data-capturing-modeling/mobile-data-capturing/` |
| 5.6 | `content/data-capturing-modeling/dlo-dmo-mapping-ir.md` | `/data-capturing-modeling/dlo-dmo-mapping-ir/` |
| 5.7 | `content/data-capturing-modeling/data-graphs.md` | `/data-capturing-modeling/data-graphs/` |
| 5.8 | `content/data-capturing-modeling/calculated-insights.md` | `/data-capturing-modeling/calculated-insights/` |
| 5.9 | `content/web-implementation/overview.md` | `/web-implementation/` |
| 5.10 | `content/web-implementation/personalization-types.md` | `/web-implementation/personalization-types/` |
| 5.11 | `content/web-implementation/recommenders.md` | `/web-implementation/recommenders/` |
| 5.12 | `content/web-implementation/response-templates.md` | `/web-implementation/response-templates/` |
| 5.13 | `content/web-implementation/personalization-points.md` | `/web-implementation/personalization-points/` |
| 5.14 | `content/web-implementation/decisions.md` | `/web-implementation/decisions/` |
| 5.15 | `content/web-implementation/experiments.md` | `/web-implementation/experiments/` |
| 5.16 | `content/web-implementation/web-templates.md` | `/web-implementation/web-templates/` |
| 5.17 | `content/web-implementation/web-personalization-manager.md` | `/web-implementation/web-personalization-manager/` |
| 5.18 | `content/mobile-implementation.md` | `/mobile-implementation/` |
| 5.19 | `content/personalization-api.md` | `/personalization-api/` |
| 5.20 | `content/experimentation.md` | `/experimentation/` |
| 5.21 | `content/batch-personalization.md` | `/batch-personalization/` |

---

## Phase 6 — Quality Assurance

| # | Check | How |
|---|---|---|
| 6.1 | All 21 pages exist | Verify `site/*/index.html` count = 21 (including root `index.html`). |
| 6.2 | Nav bar | Sticky, `#0176D3`, correct links, dropdowns work. |
| 6.3 | Hamburger menu | Visible < 768px, toggles nav items. |
| 6.4 | Sidebar TOC | Generated from H2/H3, scroll spy active class, hidden on mobile. |
| 6.5 | Breadcrumbs | Correct trail per §1, links work, last segment is plain text. |
| 6.6 | Prev/Next buttons | Correct reading order per §3, first page has no prev, last page has no next. |
| 6.7 | Homepage | Hero section, feature card grid, CTA button linking to `/setup-permissions/`. |
| 6.8 | Code blocks | Dark background, syntax highlighting, language label, copy button, horizontal scroll. |
| 6.9 | Callouts | All 5 types render with correct colors, borders, backgrounds, icons. |
| 6.10 | Tables | Header bg, zebra striping, borders, horizontal scroll on mobile. |
| 6.11 | Cross-reference links | All `.md` links rewritten to URL paths, no broken links. |
| 6.12 | External links | Open in new tab with `rel="noopener noreferrer"`. |
| 6.13 | Inline code | Light bg, padding, border-radius, monospace font. |
| 6.14 | Color palette | Matches §4.1 exactly. |
| 6.15 | Typography | Font stack, sizes, weights, line heights match §4.2. |
| 6.16 | Footer | Correct text, disclaimer, donation link, `#181818` bg. |
| 6.17 | Responsive | 3 breakpoints tested (≥1200, 768–1199, <768). |
| 6.18 | Ads | AdSense script in head, 4 ad placements correct, "Advertisement" labels. |
| 6.19 | Donation elements | Nav button, sidebar card, end-of-page CTA, footer link — all present, correct styling. |
| 6.20 | Mermaid diagrams | Render if any content uses ` ```mermaid ` blocks. |
| 6.21 | Valid HTML | No unclosed tags, well-formed documents. |
| 6.22 | Static deployment | Serve `site/` with any static server — all pages load correctly. |

---

## Technology Choices

| Concern | Choice | Rationale |
|---|---|---|
| Markdown parser | `markdown-it` + plugins | Robust, extensible, supports GFM tables, fenced code, footnotes. |
| Syntax highlighting | `prismjs` (server-side via `markdown-it-prism` or manual integration) | Lightweight, dark theme available, supports all required languages. |
| Diagrams | Mermaid.js CDN (client-side) | No build-time dependency; renders in-browser. |
| Fonts | Google Fonts CDN (Inter, JetBrains Mono) | Fast, reliable, no self-hosting needed. |
| Search | Deferred (optional Phase 7) | Lunr.js or Pagefind can be added later. |

---

## File Structure (Build Artifacts)

```
salesforce/
├── package.json
├── build/
│   ├── build.js              # Main build script
│   ├── config.js             # Ads config, donation config, page registry
│   ├── layout.html           # Shared page layout template
│   └── homepage-layout.html  # Homepage layout template
├── content/                  # (read-only input — 21 .md files)
├── site/                     # (generated output)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── copy-code.js
│   ├── assets/
│   ├── setup-permissions/
│   │   └── index.html
│   ├── data-capturing-modeling/
│   │   ├── index.html
│   │   ├── web-data-capturing/
│   │   │   └── index.html
│   │   ├── mobile-data-capturing/
│   │   │   └── index.html
│   │   ├── dlo-dmo-mapping-ir/
│   │   │   └── index.html
│   │   ├── data-graphs/
│   │   │   └── index.html
│   │   └── calculated-insights/
│   │       └── index.html
│   ├── web-implementation/
│   │   ├── index.html
│   │   ├── personalization-types/
│   │   │   └── index.html
│   │   ├── recommenders/
│   │   │   └── index.html
│   │   ├── response-templates/
│   │   │   └── index.html
│   │   ├── personalization-points/
│   │   │   └── index.html
│   │   ├── decisions/
│   │   │   └── index.html
│   │   ├── experiments/
│   │   │   └── index.html
│   │   ├── web-templates/
│   │   │   └── index.html
│   │   └── web-personalization-manager/
│   │       └── index.html
│   ├── mobile-implementation/
│   │   └── index.html
│   ├── personalization-api/
│   │   └── index.html
│   ├── experimentation/
│   │   └── index.html
│   └── batch-personalization/
│       └── index.html
├── handoff.md
└── plan.md
```

---

## Execution Order Summary

1. **Phase 0** — Scaffolding: `package.json`, install deps, create directories.
2. **Phase 1** — Layout templates + CSS.
3. **Phase 2** — Client-side JS (nav, scroll spy, copy button, Mermaid init).
4. **Phase 3** — Build script: MD parsing, callout transform, link rewriting, TOC gen, template assembly.
5. **Phase 4** — Ads & donation integration into templates.
6. **Phase 5** — Run build, generate all 21 pages.
7. **Phase 6** — QA pass against checklist.

## File Checklist

- [ ] `content/homepage.md`
- [ ] `content/setup-permissions.md`
- [ ] `content/data-capturing-modeling/overview.md`
- [ ] `content/data-capturing-modeling/web-data-capturing.md`
- [ ] `content/data-capturing-modeling/mobile-data-capturing.md`
- [ ] `content/data-capturing-modeling/dlo-dmo-mapping-ir.md`
- [ ] `content/data-capturing-modeling/data-graphs.md`
- [ ] `content/data-capturing-modeling/calculated-insights.md`
- [ ] `content/web-implementation/overview.md`
- [ ] `content/web-implementation/personalization-types.md`
- [ ] `content/web-implementation/recommenders.md`
- [ ] `content/web-implementation/response-templates.md`
- [ ] `content/web-implementation/personalization-points.md`
- [ ] `content/web-implementation/decisions.md`
- [ ] `content/web-implementation/experiments.md`
- [ ] `content/web-implementation/web-templates.md`
- [ ] `content/web-implementation/web-personalization-manager.md`
- [ ] `content/mobile-implementation.md`
- [ ] `content/personalization-api.md`
- [ ] `content/experimentation.md`
- [ ] `content/batch-personalization.md`
- [ ] `handoff.md`
- [ ] Quality pass completed
