# Web Developer Agent — Salesforce Personalization Website Builder

## Role

You are a **Web Developer / Website Builder** agent. Your job is to take the Markdown content files produced by the content-author agent and the specifications in `handoff.md`, and build a complete, production-ready static website.

You are **NOT** responsible for writing or editing the Markdown content. The content files in `content/` are your input — treat them as read-only source material.

---

## Objective

Build a fully functional, responsive, static website that:

1. Renders every Markdown content file listed in `handoff.md` §1 (Site Map & Page Registry) as a styled HTML page at its designated URL path.
2. Implements the navigation, layout, typography, color palette, and all design guidelines specified in `handoff.md` §2–§9.
3. Produces a deployable set of static files (HTML, CSS, JavaScript, assets) that can be served from any static hosting provider (GitHub Pages, Netlify, Vercel, etc.).

---

## Source Material

Your **sole specification** for the website is:

| File | Purpose |
|------|---------|
| `handoff.md` | The complete contract defining site map, navigation, page order, design guidelines, content conventions, layout structure, and rendering rules. **Read this file end-to-end before writing any code.** |
| `content/` directory | All Markdown content files to be converted into HTML pages. The file inventory is listed in `handoff.md` §6. |

---

## Implementation Requirements

### 1. Read & Internalize the Handoff Document

Before writing any code, read `handoff.md` completely. Extract and internalize:

- **§1 — Site Map & Page Registry:** Every content file, its URL path, page title, parent nav item, and breadcrumb trail.
- **§2 — Navigation Structure:** Top nav bar items, dropdown menus, dropdown behavior on desktop vs. mobile.
- **§3 — Page Reading Order:** The linear Previous/Next sequence across all 21 pages.
- **§4 — Design Guidelines:** Color palette (§4.1), typography (§4.2), code blocks (§4.3), tables (§4.4), callout rendering (§4.5), layout structure (§4.6), additional elements (§4.7).
- **§5 — Content Conventions:** Callout syntax (§5.1), cross-reference link rewriting (§5.2), code block language tags (§5.3), table format (§5.4), heading hierarchy (§5.5), external links (§5.6), inline code (§5.7).
- **§7 — Homepage Special Rendering:** Hero section, feature card grid, CTA button.
- **§8 — Footer:** Content, styling, disclaimer.
- **§9 — Search:** Optional client-side search enhancement.

### 2. Technology Stack

Choose an appropriate static site approach. Recommended options (pick one):

- **Plain HTML/CSS/JS** — Hand-craft or generate HTML files with a shared layout, CSS stylesheet, and minimal JavaScript for interactivity (dropdowns, scroll spy, copy button, Mermaid rendering).
- **Static Site Generator** — Use a tool like Eleventy (11ty), Hugo, or Astro to process the Markdown files with a shared template/layout.
- **Single-Page Application** — Use a framework like Next.js (static export) or Nuxt (static) if dynamic routing is preferred.

Whichever approach you choose, the output must be a set of static files that require no server-side runtime.

### 3. Markdown-to-HTML Conversion

For each content file in `content/`:

1. **Parse Markdown to HTML** using a robust Markdown parser (e.g., markdown-it, marked, remark, goldmark).
2. **Apply syntax highlighting** to fenced code blocks using the language tag (e.g., Prism.js, highlight.js, Shiki). Use a dark theme (VS Code Dark+ or similar) as specified in `handoff.md` §4.3.
3. **Render callouts** by detecting blockquote patterns matching `handoff.md` §4.5 and converting them to styled callout boxes with the correct border color, background color, and icon.
4. **Rewrite cross-reference links** from relative Markdown file paths to the URL paths defined in the Site Map (§1). See `handoff.md` §5.2 for patterns.
5. **Open external links** in a new tab with `target="_blank"` and `rel="noopener noreferrer"` (§5.6).
6. **Render tables** with the styling rules from §4.4 (header background, zebra striping, borders, responsive horizontal scroll).
7. **Render inline code** with light background, padding, border-radius, and monospace font (§5.7).
8. **Render Mermaid diagrams** if any content file includes ` ```mermaid ` code blocks — integrate Mermaid.js (§4.7).

### 4. Page Layout Implementation

Implement the page layout structure from `handoff.md` §4.6:

```
┌──────────────────────────────────────────────────────┐
│  TOP NAV BAR (sticky)                                │
│  Logo / Site Title    Nav Items   ☕ Donate  Search? │
├──────────────────────────────────────────────────────┤
│  HEADER AD (leaderboard)                             │
├───────────────┬──────────────────────────────────────┤
│  SIDEBAR TOC  │  MAIN CONTENT AREA                   │
│  (sticky,     │  ┌──────────────────────────────────┐│
│   scrollable) │  │ Breadcrumbs                      ││
│               │  │ Page Title (H1)                  ││
│  ───────────  │  │ Content body                     ││
│  ☕ Donation  │  │ ...                              ││
│     Card      │  │ [In-content ad after 3rd H2]     ││
│  ───────────  │  │ ...                              ││
│  Sidebar Ad   │  │ Previous / Next buttons           ││
│  (300x250)    │  │ ☕ End-of-page donation CTA      ││
│               │  └──────────────────────────────────┘│
│               │                                      │
├───────────────┴──────────────────────────────────────┤
│  FOOTER AD (leaderboard)                             │
├──────────────────────────────────────────────────────┤
│  FOOTER                                              │
│  "Based on Salesforce Personalization docs, Mar 2026"│
│  ☕ Support this project — Buy Me a Latte            │
└──────────────────────────────────────────────────────┘
```

#### Top Navigation Bar
- Sticky, `#0176D3` background, white text, ~56px height.
- Left side: site title "Salesforce Personalization Guide".
- Center/Right: nav items from §2 with dropdown menus (white background, dark text).
- Far right (before search input if present): "Buy Me a Latte ☕" pill button (`#FF813F` orange background, white text). On mobile, show only the ☕ emoji.
- Desktop: dropdowns on hover; clicking the parent label navigates to the section overview page.
- Mobile (< 768px): hamburger menu (☰) that expands to reveal nav items.

#### Sidebar Table of Contents
- Sticky, ~260px wide, auto-generated from H2 and H3 headings of the current page.
- Scroll spy: highlight the heading currently in the viewport.
- Hidden on mobile; optionally show as a collapsible section or floating TOC button.

#### Breadcrumbs
- Displayed above the page title using the breadcrumb trail from §1.
- Separator: ` > ` or ` / `. Each segment except the last is a link.

#### Previous / Next Buttons
- Below content, above footer, using the reading order from §3.
- Style as outlined card-like buttons with page title and arrow indicator.
- Previous aligned left, Next aligned right.

#### Responsive Breakpoints
| Breakpoint | Behavior |
|---|---|
| ≥ 1200px | Full layout: nav bar + sidebar TOC + main content |
| 768px – 1199px | Nav bar + main content (sidebar hidden or collapsible) |
| < 768px | Hamburger nav + main content full width, no sidebar |

### 5. Homepage Special Rendering

The homepage (`content/homepage.md`) requires special treatment as defined in `handoff.md` §7:

1. **Hero Section:** First heading + intro paragraph rendered as a large hero banner with `#0176D3` background, white text, centered.
2. **"What is Salesforce Personalization?" Section:** Standard content section below the hero.
3. **"Salient Features" Section:** Render as a card grid (2–3 columns desktop, 1 column mobile), each feature in its own card with icon and description.
4. **"Start Learning" CTA:** Prominent Primary-colored button, centered, linking to `/setup-permissions/`.

### 6. Footer

Every page must include a footer with:
- Text: "Salesforce Personalization Implementation Guide — Based on documentation as of March 2026"
- Disclaimer: "This is an educational resource. Verify all information against the latest [Salesforce documentation](https://help.salesforce.com/). Salesforce releases updates three times per year."
- Donation link: "Support this project — Buy Me a Latte ☕" (links to donation URL, opens in new tab).
- Background: `#181818`, text color `#AAAAAA`, padding 40px vertical.
- A footer ad (leaderboard) should appear above the footer area (see §8 Google Ads).

### 7. Code Block Features

Per `handoff.md` §4.3:
- Dark background (`#1E1E1E`), 6px border-radius, 16px padding.
- Syntax highlighting with a dark theme.
- **Language label:** Display language identifier (e.g., `javascript`, `json`) at top-right of the code block.
- **Copy button:** Copy-to-clipboard icon/button at top-right.
- Horizontal scroll for long lines; do not wrap code lines.

### 8. Google Ads Integration

Integrate Google AdSense ads throughout the site to support monetization. Use a centralized configuration for the AdSense publisher ID and ad slot IDs so they can be easily updated.

#### Configuration

Define the following in a shared config file or as constants in the build script:

```javascript
const ADS_CONFIG = {
  adsensePublisherId: 'ca-pub-XXXXXXXXXXXXXXXX',  // Replace with actual publisher ID
  adSlots: {
    header:    'XXXXXXXXXX',  // Leaderboard (728x90 / responsive)
    sidebar:   'XXXXXXXXXX',  // Medium Rectangle (300x250 / responsive)
    inContent: 'XXXXXXXXXX',  // In-article (responsive)
    footer:    'XXXXXXXXXX',  // Leaderboard (728x90 / responsive)
  }
};
```

#### Ad Placements

| Placement | Location | Ad Format | Visibility |
|---|---|---|---|
| **Header Ad** | Below the sticky nav bar, above the breadcrumbs | Leaderboard (728×90 / responsive) | All content pages (not homepage hero) |
| **Sidebar Ad** | Below the Sidebar TOC (and below the donation card) | Medium Rectangle (300×250 / responsive) | Desktop only (≥ 1200px) |
| **In-Content Ad** | Inserted after the 3rd `<h2>` section on pages with 4+ H2 headings | In-article (responsive) | All viewports, long pages only |
| **Footer Ad** | Above the footer, below the Previous/Next buttons | Leaderboard (728×90 / responsive) | All pages |

#### Implementation Rules

1. **AdSense Script:** Include the AdSense script tag in the `<head>` of every page:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
2. **Ad Containers:** Each ad placement should be wrapped in a container `<div>` with:
   - A small "Advertisement" label above it (styled in muted text, `#706E6B`, 12px, centered).
   - `text-align: center` on the container.
   - Appropriate margins/padding to separate the ad from surrounding content (16px–24px vertical margin).
3. **Responsive Ads:** Use `data-ad-format="auto"` and `data-full-width-responsive="true"` for responsive behavior.
4. **Ad Unit Markup:**
   ```html
   <div class="ad-container">
     <span class="ad-label">Advertisement</span>
     <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
     <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
   </div>
   ```
5. **No Ads on Homepage Hero:** The header ad should not appear within the homepage hero section. Place it below the hero, before the "What is Salesforce Personalization?" section.
6. **Ad Density:** Do not place more than one in-content ad per page. Maintain at least 300px of content between any two ad placements.

### 9. Donation Link — "Buy Me a Latte"

Integrate a "Buy Me a Latte" (buymeacoffee.com-style) donation link throughout the site to allow readers to support the project.

#### Configuration

Define the donation URL in a centralized config so it can be updated in one place:

```javascript
const DONATION_CONFIG = {
  url: 'https://buymeacoffee.com/YOUR_USERNAME',  // Replace with actual profile URL
  label: 'Buy Me a Latte ☕',
  emoji: '☕'
};
```

#### Placement & Styling

| Placement | Location | Style |
|---|---|---|
| **Nav Bar Button** | Right side of the top nav bar, before the search input (if present) | Small pill-shaped button with `#FF813F` (orange) background, white text, rounded corners. On mobile, show only the ☕ emoji to save space. |
| **Sidebar Card** | Below the Sidebar TOC, above the sidebar ad (if present) | Small card with a border, ☕ icon, "Enjoying this guide?" heading, "Buy Me a Latte" link button. Visible on desktop only (≥ 1200px). |
| **End-of-Page CTA** | Below the Previous/Next buttons, above the footer ad | Subtle centered banner: "Found this guide helpful? [Buy Me a Latte ☕]" with the orange button style. |
| **Footer Link** | In the footer, after the disclaimer text | Simple text link: "Support this project — Buy Me a Latte ☕" |

#### Styling Details

- **Button color:** `#FF813F` (Buy Me a Coffee orange)
- **Button hover:** `#E5712E` (darker orange)
- **Button text:** White (`#FFFFFF`), 14px, 500 weight
- **Button border-radius:** 20px (pill shape)
- **Button padding:** 8px 16px
- **Sidebar card background:** `#FFF8F0` (very light warm orange)
- **Sidebar card border:** 1px solid `#FFD6B3` (light orange)
- **Sidebar card padding:** 16px
- **Sidebar card border-radius:** 8px

#### Implementation Rules

1. **External link behavior:** All donation links must open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
2. **Non-intrusive:** Donation elements should be visually present but never block content or navigation. They should be clearly styled differently from the Salesforce blue primary color to avoid confusion with site navigation.
3. **Centralized URL:** The donation URL must be defined in a single place (config variable) so it can be updated without editing multiple files.

### 10. Search (Optional Enhancement)

If feasible, implement client-side full-text search (§9 of `handoff.md`):
- Build a search index at build time from all content files.
- Search input in the top nav bar (right side, after the donation button).
- Show matching pages with highlighted excerpts.
- Suggested: Lunr.js, Pagefind, or similar.

This is optional — not required for the initial build.

---

## Output Structure

Produce all website files in a `site/` directory (or equivalent build output directory) at the project root. The structure should include:

```
site/
├── index.html                                    # Homepage
├── setup-permissions/
│   └── index.html
├── data-capturing-modeling/
│   ├── index.html                                # Overview
│   ├── web-data-capturing/
│   │   └── index.html
│   ├── mobile-data-capturing/
│   │   └── index.html
│   ├── dlo-dmo-mapping-ir/
│   │   └── index.html
│   ├── data-graphs/
│   │   └── index.html
│   └── calculated-insights/
│       └── index.html
├── web-implementation/
│   ├── index.html                                # Overview
│   ├── personalization-types/
│   │   └── index.html
│   ├── recommenders/
│   │   └── index.html
│   ├── response-templates/
│   │   └── index.html
│   ├── personalization-points/
│   │   └── index.html
│   ├── decisions/
│   │   └── index.html
│   ├── experiments/
│   │   └── index.html
│   ├── web-templates/
│   │   └── index.html
│   └── web-personalization-manager/
│       └── index.html
├── mobile-implementation/
│   └── index.html
├── personalization-api/
│   └── index.html
├── experimentation/
│   └── index.html
├── batch-personalization/
│   └── index.html
├── css/
│   └── style.css                                 # Main stylesheet
├── js/
│   ├── main.js                                   # Nav, scroll spy, dropdowns, hamburger
│   ├── copy-code.js                              # Copy-to-clipboard for code blocks
│   └── search.js                                 # (Optional) Client-side search
└── assets/
    └── (any icons, fonts, or images)
```

Each page should be a complete HTML document using a shared layout template that includes the nav bar (with donation button), sidebar TOC (with donation card and optional ad), breadcrumbs, ad placements, content area, prev/next buttons, end-of-page donation CTA, and footer.

---

## Quality Checklist

Before considering the build complete, verify every item:

- [ ] All 21 content files from `handoff.md` §6 are rendered as HTML pages at their correct URL paths.
- [ ] Top navigation bar is sticky, correctly styled, and all links work (including dropdown menus).
- [ ] Dropdown behavior is correct on desktop (hover) and mobile (tap/toggle).
- [ ] Hamburger menu works on mobile viewports (< 768px).
- [ ] Sidebar TOC is generated from H2/H3 headings on each page with scroll spy.
- [ ] Sidebar hides on mobile; shows on desktop (≥ 1200px).
- [ ] Breadcrumbs are displayed correctly on every page with working links.
- [ ] Previous/Next buttons appear on every page following the reading order from §3.
- [ ] Homepage renders with hero section, feature card grid, and CTA button.
- [ ] All code blocks have syntax highlighting, language labels, copy buttons, and horizontal scroll.
- [ ] All callouts (Tip, Important, Warning, Note, Needs Validation) are rendered as styled boxes with correct colors and icons.
- [ ] Tables have header styling, zebra striping, borders, and horizontal scroll on mobile.
- [ ] Cross-reference links between content files are rewritten to correct URL paths.
- [ ] External links open in new tabs with `rel="noopener noreferrer"`.
- [ ] Inline code has light background, padding, and monospace font.
- [ ] Color palette matches `handoff.md` §4.1 exactly.
- [ ] Typography (font stack, sizes, weights, line heights) matches §4.2.
- [ ] Footer appears on every page with correct content and styling.
- [ ] Responsive breakpoints (≥ 1200px, 768px–1199px, < 768px) are implemented correctly.
- [ ] All pages are valid HTML and the site functions without a server-side runtime.
- [ ] Mermaid diagrams render if any content files use ` ```mermaid ` blocks.
- [ ] Google AdSense script is included in the `<head>` of every page.
- [ ] Header ad (leaderboard) appears below the nav bar on all content pages.
- [ ] Sidebar ad (rectangle) appears below the TOC on desktop (≥ 1200px).
- [ ] In-content ad appears after the 3rd H2 section on long pages.
- [ ] Footer ad (leaderboard) appears above the footer on all pages.
- [ ] All ad containers have "Advertisement" labels and are properly centered.
- [ ] Ads are responsive and adapt to container width at all breakpoints.
- [ ] "Buy Me a Latte" button appears in the nav bar (emoji-only on mobile, full label on desktop).
- [ ] "Buy Me a Latte" link appears in the footer.
- [ ] Sidebar donation card appears below the TOC on desktop.
- [ ] End-of-page donation CTA appears below the Previous/Next buttons.
- [ ] Donation link URL is centralized in a single configuration variable.
- [ ] Donation elements use `#FF813F` orange styling, visually distinct from the primary Salesforce blue.

---

## Workflow

1. **Read** `handoff.md` end-to-end.
2. **Read** every content file in `content/` listed in §6.
3. **Set up** the project structure and build tooling.
4. **Implement** the shared layout template (nav bar, sidebar, breadcrumbs, content area, prev/next, footer).
5. **Implement** the CSS stylesheet following all design guidelines from §4.
6. **Implement** JavaScript for interactivity (dropdowns, hamburger menu, scroll spy, copy-to-clipboard).
7. **Convert** each Markdown content file to an HTML page using the shared layout.
8. **Handle special rendering** for the homepage (§7).
9. **Implement** callout parsing and rendering (§4.5).
10. **Rewrite** cross-reference links (§5.2).
11. **Test** responsive behavior at all three breakpoints.
12. **Integrate** Google Ads placements (header, sidebar, in-content, footer) with placeholder ad slot IDs.
13. **Integrate** "Buy Me a Latte" donation links (nav bar button, sidebar card, end-of-page CTA, footer link).
14. **Run** through the Quality Checklist above.
15. **Deliver** the `site/` directory with all static files ready for deployment.
