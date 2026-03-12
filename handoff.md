# Handoff Document — Salesforce Personalization Implementation Guide

> **Purpose:** This document is the contract between the **website-author** agent (content producer) and the **website-builder** agent (site implementer). It defines the site map, navigation, page order, design guidelines, and content conventions needed to assemble all Markdown content files into a complete static website.
>
> **Date:** March 2026

---

## 1. Site Map & Page Registry

Every content file, its target URL path, page title, parent navigation item, and breadcrumb trail:

| # | Content File | URL Path | Page Title | Parent Nav Item | Breadcrumb Trail |
|---|---|---|---|---|---|
| 1 | `content/homepage.md` | `/` | Home | — | Home |
| 2 | `content/setup-permissions.md` | `/setup-permissions/` | Setup & Permissions | Setup & Permissions | Home > Setup & Permissions |
| 3 | `content/data-capturing-modeling/overview.md` | `/data-capturing-modeling/` | Data Capturing & Modeling | Data Capturing & Modeling | Home > Data Capturing & Modeling |
| 4 | `content/data-capturing-modeling/web-data-capturing.md` | `/data-capturing-modeling/web-data-capturing/` | Web Data Capturing | Data Capturing & Modeling | Home > Data Capturing & Modeling > Web Data Capturing |
| 5 | `content/data-capturing-modeling/mobile-data-capturing.md` | `/data-capturing-modeling/mobile-data-capturing/` | Mobile Data Capturing | Data Capturing & Modeling | Home > Data Capturing & Modeling > Mobile Data Capturing |
| 6 | `content/data-capturing-modeling/dlo-dmo-mapping-ir.md` | `/data-capturing-modeling/dlo-dmo-mapping-ir/` | DLO-DMO Mapping & Identity Resolution | Data Capturing & Modeling | Home > Data Capturing & Modeling > DLO-DMO Mapping & IR |
| 7 | `content/data-capturing-modeling/data-graphs.md` | `/data-capturing-modeling/data-graphs/` | Data Graphs | Data Capturing & Modeling | Home > Data Capturing & Modeling > Data Graphs |
| 8 | `content/data-capturing-modeling/calculated-insights.md` | `/data-capturing-modeling/calculated-insights/` | Calculated Insights | Data Capturing & Modeling | Home > Data Capturing & Modeling > Calculated Insights |
| 9 | `content/web-implementation/overview.md` | `/web-implementation/` | Web Campaign Configuration | Web Implementation | Home > Web Implementation |
| 10 | `content/web-implementation/personalization-types.md` | `/web-implementation/personalization-types/` | Personalization Types | Web Implementation | Home > Web Implementation > Personalization Types |
| 11 | `content/web-implementation/recommenders.md` | `/web-implementation/recommenders/` | Recommenders | Web Implementation | Home > Web Implementation > Recommenders |
| 12 | `content/web-implementation/response-templates.md` | `/web-implementation/response-templates/` | Response Templates | Web Implementation | Home > Web Implementation > Response Templates |
| 13 | `content/web-implementation/personalization-points.md` | `/web-implementation/personalization-points/` | Personalization Points | Web Implementation | Home > Web Implementation > Personalization Points |
| 14 | `content/web-implementation/decisions.md` | `/web-implementation/decisions/` | Personalization Decisions | Web Implementation | Home > Web Implementation > Decisions |
| 15 | `content/web-implementation/experiments.md` | `/web-implementation/experiments/` | Experiments | Web Implementation | Home > Web Implementation > Experiments |
| 16 | `content/web-implementation/web-templates.md` | `/web-implementation/web-templates/` | Web Templates (Transformers) | Web Implementation | Home > Web Implementation > Web Templates |
| 17 | `content/web-implementation/web-personalization-manager.md` | `/web-implementation/web-personalization-manager/` | Web Personalization Manager (WPM) | Web Implementation | Home > Web Implementation > Web Personalization Manager |
| 18 | `content/mobile-implementation.md` | `/mobile-implementation/` | Mobile App Implementation | Mobile Implementation | Home > Mobile Implementation |
| 19 | `content/personalization-api.md` | `/personalization-api/` | Personalization API (Decisioning API) | Personalization API | Home > Personalization API |
| 20 | `content/experimentation.md` | `/experimentation/` | Experimentation Setup | Experimentation | Home > Experimentation |
| 21 | `content/batch-personalization.md` | `/batch-personalization/` | Batch Personalization | Batch Personalization | Home > Batch Personalization |

---

## 2. Navigation Structure

A persistent top navigation bar with the following items. Items marked *(dropdown)* expand to reveal sub-pages on hover/click.

```
Home → /

Setup & Permissions → /setup-permissions/

Data Capturing & Modeling → (dropdown)
  ├── Overview                        → /data-capturing-modeling/
  ├── Web Data Capturing              → /data-capturing-modeling/web-data-capturing/
  ├── Mobile Data Capturing           → /data-capturing-modeling/mobile-data-capturing/
  ├── DLO-DMO Mapping & IR            → /data-capturing-modeling/dlo-dmo-mapping-ir/
  ├── Data Graphs                     → /data-capturing-modeling/data-graphs/
  └── Calculated Insights             → /data-capturing-modeling/calculated-insights/

Web Implementation → (dropdown)
  ├── Overview                        → /web-implementation/
  ├── Personalization Types           → /web-implementation/personalization-types/
  ├── Recommenders                    → /web-implementation/recommenders/
  ├── Response Templates              → /web-implementation/response-templates/
  ├── Personalization Points          → /web-implementation/personalization-points/
  ├── Decisions                       → /web-implementation/decisions/
  ├── Experiments                     → /web-implementation/experiments/
  ├── Web Templates                   → /web-implementation/web-templates/
  └── Web Personalization Manager     → /web-implementation/web-personalization-manager/

Mobile Implementation → /mobile-implementation/

Personalization API → /personalization-api/

Experimentation → /experimentation/

Batch Personalization → /batch-personalization/
```

### Dropdown Behavior

- On **desktop**: dropdowns open on hover and remain open while the cursor is within the dropdown area. Clicking the parent label navigates to the section overview page (e.g., clicking "Data Capturing & Modeling" goes to `/data-capturing-modeling/`).
- On **mobile**: dropdowns open on tap/toggle. The parent label acts as an expand/collapse toggle; the overview page link should appear as the first item inside the expanded dropdown.

---

## 3. Page Reading Order (Previous / Next)

The linear sequence below defines the **Previous** and **Next** navigation buttons on each page. The first page has no Previous button; the last page has no Next button.

| # | Page Title | URL Path |
|---|---|---|
| 1 | Home | `/` |
| 2 | Setup & Permissions | `/setup-permissions/` |
| 3 | Data Capturing & Modeling (Overview) | `/data-capturing-modeling/` |
| 4 | Web Data Capturing | `/data-capturing-modeling/web-data-capturing/` |
| 5 | Mobile Data Capturing | `/data-capturing-modeling/mobile-data-capturing/` |
| 6 | DLO-DMO Mapping & Identity Resolution | `/data-capturing-modeling/dlo-dmo-mapping-ir/` |
| 7 | Data Graphs | `/data-capturing-modeling/data-graphs/` |
| 8 | Calculated Insights | `/data-capturing-modeling/calculated-insights/` |
| 9 | Web Campaign Configuration (Overview) | `/web-implementation/` |
| 10 | Personalization Types | `/web-implementation/personalization-types/` |
| 11 | Recommenders | `/web-implementation/recommenders/` |
| 12 | Response Templates | `/web-implementation/response-templates/` |
| 13 | Personalization Points | `/web-implementation/personalization-points/` |
| 14 | Personalization Decisions | `/web-implementation/decisions/` |
| 15 | Experiments | `/web-implementation/experiments/` |
| 16 | Web Templates (Transformers) | `/web-implementation/web-templates/` |
| 17 | Web Personalization Manager (WPM) | `/web-implementation/web-personalization-manager/` |
| 18 | Mobile App Implementation | `/mobile-implementation/` |
| 19 | Personalization API (Decisioning API) | `/personalization-api/` |
| 20 | Experimentation Setup | `/experimentation/` |
| 21 | Batch Personalization | `/batch-personalization/` |

### Previous / Next Button Format

Each page should display:

```
← Previous: <Page Title>          Next: <Page Title> →
```

Where `<Page Title>` is the title from the table above and the button links to the corresponding URL path. Align Previous to the left and Next to the right, placed below the page content and above the footer.

---

## 4. Design Guidelines for the Website-Builder

The website-builder agent is responsible for all visual implementation. The guidelines below define the target look and feel.

### 4.1 Color Palette

| Token | Value | Usage |
|---|---|---|
| **Primary** | `#0176D3` (Astro Blue) | Nav bar background, primary buttons, link color, active states |
| **Primary Hover** | `#014486` | Button/link hover states |
| **Accent** | `#04844B` (Teal) | Code block accents, success states, secondary CTAs |
| **Background** | `#FFFFFF` (White) | Page background |
| **Surface** | `#F3F3F3` (Light Gray) | Sidebar background, callout backgrounds, table header rows |
| **Text Primary** | `#181818` (Near Black) | Body text, headings |
| **Text Secondary** | `#444444` (Dark Gray) | Secondary labels, breadcrumb text, metadata |
| **Text Muted** | `#706E6B` (Medium Gray) | Placeholder text, disabled states |
| **Border** | `#DDDBDA` (Light Border Gray) | Table borders, card borders, dividers |
| **Code Background** | `#1E1E1E` (Dark) | Code block background |
| **Code Text** | `#D4D4D4` (Light Gray) | Default code text color |

### 4.2 Typography

| Element | Font Stack | Size | Weight | Line Height |
|---|---|---|---|---|
| **Body** | `'Inter', 'Salesforce Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | 16px | 400 (Regular) | 1.6 |
| **H1** (Page Title) | Same stack | 32px | 700 (Bold) | 1.3 |
| **H2** (Major Section) | Same stack | 26px | 600 (Semi-Bold) | 1.35 |
| **H3** (Subsection) | Same stack | 21px | 600 (Semi-Bold) | 1.4 |
| **H4** (Sub-subsection) | Same stack | 18px | 600 (Semi-Bold) | 1.4 |
| **Code (inline)** | `'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace` | 14px | 400 | 1.5 |
| **Code (block)** | Same mono stack | 14px | 400 | 1.6 |
| **Table text** | Same body stack | 15px | 400 | 1.5 |
| **Nav bar** | Same body stack | 15px | 500 (Medium) | 1.0 |

### 4.3 Code Blocks

- **Background:** `#1E1E1E` (dark)
- **Text:** Syntax-highlighted using a dark theme (VS Code Dark+ or similar)
- **Border radius:** 6px
- **Padding:** 16px
- **Language label:** Display the language identifier (e.g., `javascript`, `json`) as a small label at the top-right corner of the code block, styled in muted text
- **Copy button:** Include a copy-to-clipboard icon/button at the top-right of each code block
- **Horizontal scroll:** Enable horizontal scrolling for lines that exceed the container width; do not wrap code lines
- **Language tags used in content files:** `javascript`, `json`, `html`, `swift`, `kotlin`, `bash`, `sql`

### 4.4 Tables

- **Header row:** Bold text, `#F3F3F3` (Surface) background
- **Body rows:** Zebra-striped — alternate between `#FFFFFF` and `#F9F9F9`
- **Borders:** 1px solid `#DDDBDA` on all cell edges
- **Padding:** 10px 14px per cell
- **Responsive behavior:** On mobile viewports (< 768px), tables should be horizontally scrollable within their container. Wrap tables in an overflow container with `overflow-x: auto`
- **Alignment:** Left-align text columns, left-align header row

### 4.5 Callout Rendering

Content files use blockquote-based callout syntax. The website-builder must parse and render these as styled callout boxes:

| Callout Type | Markdown Syntax | Left Border Color | Background Color | Icon |
|---|---|---|---|---|
| **Tip** | `> **💡 Tip:** <text>` | `#04844B` (Teal/Green) | `#F0FAF0` (Light Green) | 💡 |
| **Important** | `> **⚠️ Important:** <text>` | `#DD7A01` (Amber) | `#FFFBF0` (Light Amber) | ⚠️ |
| **Warning** | `> **🚨 Warning:** <text>` | `#C23934` (Red) | `#FFF0F0` (Light Red) | 🚨 |
| **Note** | `> **📝 Note:** <text>` | `#0176D3` (Blue) | `#F0F7FF` (Light Blue) | 📝 |
| **Needs Validation** | `> **🔍 Needs Validation:** <text>` | `#7526C2` (Purple) | `#F5F0FF` (Light Purple) | 🔍 |

**Rendering rules:**

1. Parse the blockquote content. If the first bold phrase matches one of the patterns above (with or without the emoji), render as a styled callout box.
2. Apply a **4px left border** in the specified color.
3. Use the specified background color for the callout container.
4. Display the emoji icon to the left of the bold label.
5. The callout body text follows on the same line after the colon and space.
6. Multi-line callouts: All content within the blockquote (lines starting with `>`) belongs to the same callout.

### 4.6 Layout

#### Overall Page Structure

```
┌──────────────────────────────────────────────────────┐
│  TOP NAV BAR (sticky)                                │
│  Logo / Site Title    Nav Items (see §2)    Search?  │
├───────────────┬──────────────────────────────────────┤
│  SIDEBAR TOC  │  MAIN CONTENT AREA                   │
│  (sticky,     │  ┌──────────────────────────────────┐│
│   scrollable) │  │ Breadcrumbs                      ││
│               │  │ Page Title (H1)                  ││
│               │  │ Content body                     ││
│               │  │ ...                              ││
│               │  │ Previous / Next buttons           ││
│               │  └──────────────────────────────────┘│
│               │                                      │
├───────────────┴──────────────────────────────────────┤
│  FOOTER                                              │
│  "Based on Salesforce Personalization docs, Mar 2026"│
└──────────────────────────────────────────────────────┘
```

#### Top Navigation Bar

- **Position:** Sticky (remains visible on scroll)
- **Background:** `#0176D3` (Primary)
- **Text color:** `#FFFFFF`
- **Height:** ~56px
- **Left side:** Site title — "Salesforce Personalization Guide"
- **Center/Right:** Navigation items as defined in §2. Dropdown menus have a white background with dark text.
- **Mobile:** Collapse nav items into a hamburger menu (☰)

#### Sidebar Table of Contents

- **Position:** Sticky (scrolls independently within its container, stays visible alongside content)
- **Width:** ~260px on desktop
- **Content:** Auto-generated from the H2 and H3 headings of the current page
- **Active state:** Highlight the heading currently in the viewport (scroll spy)
- **Mobile:** Hide sidebar by default; optionally show as a collapsible section above the content or as a floating TOC button

#### Breadcrumbs

- Displayed above the page title
- Use the breadcrumb trail from the Page Registry (§1)
- Separator: ` > ` or ` / `
- Each segment except the last is a link

#### Previous / Next Buttons

- Placed at the bottom of the main content area, above the footer
- Use the reading order from §3
- Style as outlined card-like buttons with the page title and an arrow indicator

#### Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| **≥ 1200px** | Full layout: nav bar + sidebar TOC + main content |
| **768px – 1199px** | Nav bar + main content (sidebar hidden or collapsible) |
| **< 768px** | Hamburger nav + main content full width, no sidebar |

### 4.7 Additional Elements

- **Links:** Colored with Primary (`#0176D3`), underlined on hover
- **Lists:** Standard bullet (`•`) and numbered (`1.`) lists with 1.5em left padding
- **Horizontal rules:** Rendered as `1px solid #DDDBDA`
- **Images:** If any content file includes images in the future, render them responsively (max-width: 100%, centered, with optional caption from alt text)
- **Diagrams:** If content files include Mermaid code blocks (` ```mermaid `), render them using a Mermaid.js integration. If ASCII art diagrams appear in code blocks, render them in a monospace font block.

---

## 5. Content Conventions Reference

This section documents the Markdown conventions used across all content files so the website-builder knows exactly how to parse and render them.

### 5.1 Callout Syntax

Callouts use Markdown blockquote syntax with a bold emoji-label prefix:

```markdown
> **💡 Tip:** This is a tip callout. Best practices and shortcuts.

> **⚠️ Important:** This is an important callout. Required steps or prerequisites.

> **🚨 Warning:** This is a warning callout. Common pitfalls and irreversible actions.

> **📝 Note:** This is a note callout. Additional context.

> **🔍 Needs Validation:** Content authored from limited sources. Needs verification against latest official docs.
```

Rendering rules are detailed in §4.5.

### 5.2 Cross-Reference Links

Content files reference each other using standard Markdown relative links. The link targets are relative to the file's own directory.

**Example patterns found in content files:**

```markdown
<!-- From a file inside content/ (root level) -->
See [Setup & Permissions](setup-permissions.md) for details.
See [Web Data Capturing](data-capturing-modeling/web-data-capturing.md) for details.

<!-- From a file inside content/data-capturing-modeling/ -->
See [Personalization Points](../web-implementation/personalization-points.md) for details.

<!-- From a file inside content/web-implementation/ -->
See [Data Graphs](../data-capturing-modeling/data-graphs.md) for details.
```

**Builder action:** Convert these relative Markdown file paths to the corresponding URL paths (from §1). For example:
- `setup-permissions.md` → `/setup-permissions/`
- `data-capturing-modeling/web-data-capturing.md` → `/data-capturing-modeling/web-data-capturing/`
- `../web-implementation/personalization-points.md` → `/web-implementation/personalization-points/`

### 5.3 Code Block Language Tags

Content files use fenced code blocks with language identifiers. The builder should apply syntax highlighting based on the language tag.

| Language Tag | Usage |
|---|---|
| `javascript` | Web SDK code, sitemap configuration, initialization code, content zone handlers |
| `json` | Schema definitions, API request/response payloads, data stream mappings |
| `html` | Handlebars template HTML, script tags |
| `swift` | iOS SDK code examples |
| `kotlin` | Android SDK code examples |
| `bash` | Terminal/CLI commands, CocoaPods/Gradle commands |
| `sql` | Calculated Insight SQL examples |
| `handlebars` | Handlebars template examples (if used — may also appear as `html`) |

### 5.4 Table Format

All tables use standard Markdown pipe-delimited syntax:

```markdown
| Column A | Column B | Column C |
|---|---|---|
| Cell 1A | Cell 1B | Cell 1C |
| Cell 2A | Cell 2B | Cell 2C |
```

Rendering rules are detailed in §4.4.

### 5.5 Heading Hierarchy

Each content file follows this heading convention:

| Markdown | Semantic Role | Rendered As |
|---|---|---|
| `#` | Page title | H1 — one per file, always the first line |
| `##` | Major section | H2 — primary divisions of the page |
| `###` | Subsection | H3 — secondary divisions within a major section |
| `####` | Sub-subsection | H4 — tertiary divisions (used sparingly) |

The sidebar table of contents (§4.6) should be generated from **H2** and **H3** headings.

### 5.6 External Links

Content files include hyperlinks to official Salesforce documentation. These are standard Markdown links with full URLs:

```markdown
[Salesforce Personalization documentation](https://help.salesforce.com/s/articleView?id=sf.dc_personalization_overview.htm)
```

These should open in a **new tab** (`target="_blank"` with `rel="noopener noreferrer"`).

### 5.7 Inline Code

Inline code references to class names, method names, API fields, and configuration values are wrapped in backticks:

```markdown
Call `SalesforceInteractions.init()` to initialize the SDK.
Set the `eventType` field to `productBrowse`.
```

Render inline code with a light background (`#F3F3F3`), slight padding, border-radius, and the monospace font stack.

---

## 6. File Inventory Checklist

Use this checklist to verify all content files have been consumed by the builder:

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

**Total: 21 content files**

---

## 7. Homepage Special Rendering

The homepage (`content/homepage.md`) has a different structure than content pages and requires special treatment:

1. **Hero Section:** The first heading and introductory paragraph should be rendered as a large hero banner with the Primary color (`#0176D3`) background and white text. Center the heading and subtext.

2. **"What is Salesforce Personalization?" Section:** Render as a standard content section below the hero.

3. **"Salient Features" Section:** The features list should be rendered as a **card grid** (2–3 columns on desktop, 1 column on mobile). Each feature gets its own card with an icon and short description.

4. **"Start Learning" CTA:** Render as a prominent button styled with the Primary color, centered below the features section. Links to `/setup-permissions/`.

---

## 8. Footer

The footer appears on every page and should include:

- Text: "Salesforce Personalization Implementation Guide — Based on documentation as of March 2026"
- Disclaimer: "This is an educational resource. Verify all information against the latest [Salesforce documentation](https://help.salesforce.com/). Salesforce releases updates three times per year."
- Background: `#181818` (Near Black)
- Text color: `#AAAAAA` (Muted Light Gray)
- Padding: 40px vertical

---

## 9. Search (Optional Enhancement)

If feasible, implement client-side full-text search across all pages:

- **Index:** Build a search index at build time from all content files
- **UI:** Search input in the top nav bar (right side)
- **Results:** Show matching pages with highlighted excerpts
- **Technology suggestion:** Lunr.js, Pagefind, or similar static-site search library

This is an optional enhancement — not required for the initial build.
