# Content Authoring Plan — Salesforce Personalization Implementation Guide

> **Purpose:** Step-by-step plan for the **website-author** agent to read all source documentation, then produce Markdown content files for every page of the guide, and finally create a **handoff document** for the **website-builder** agent.
>
> **Scope:** This agent produces **text content only** (Markdown). No HTML, CSS, or JavaScript. The website-builder agent handles all website implementation.

---

## Phase 0: Read & Internalize All Source Material

Before writing any content, read every source file end-to-end. This builds the knowledge base needed to author accurate, cross-referenced content.


### 0.2 — Read the Core Implementation Document

| Step | File | What to Extract |
|------|------|-----------------|
| 0.2.1 | `DetailedImplementationDoc/Doc.md` (~1,900 lines) | Read the **entire** file. Extract: implementation personas, blueprint guidance, Web SDK anatomy, sitemap/schema code examples, data stream deployment steps, DLO-to-DMO mapping tables, identity resolution config, profile & item data graph setup, personalization types (manual content vs. recommendations), recommender types (rules-based vs. objective-based), engagement signals & metrics, response templates, personalization points/decisions/experiments, web templates (Handlebars transformers), WPM workflow, measurement/attribution/analytics |

### 0.3 — Read All Developer Docs

| Step | File | What to Extract |
|------|------|-----------------|
| 0.3.1 | `DeveloperDocs/README.md` | Table of contents, section structure |
| 0.3.2 | `DeveloperDocs/01-Overview.md` | How Personalization works with Data Cloud, data flow (5 steps), key concepts |
| 0.3.3 | `DeveloperDocs/02-Personalize-Web-Experiences/01-Overview.md` | SDK components, namespace structure, sub-topic list |
| 0.3.4 | `DeveloperDocs/02-Personalize-Web-Experiences/02-Integrate-Salesforce-Interactions-SDK.md` | 7-step integration guide, data space creation, website connector, schema upload, SDK script tag, sitemap creation, data stream deploy, DMO mapping tables |
| 0.3.5 | `DeveloperDocs/02-Personalize-Web-Experiences/03-Configure-Personalization-Module.md` | Personalization module config, template management, flicker defense, engagement destinations |
| 0.3.6 | `DeveloperDocs/02-Personalize-Web-Experiences/04-Initialize-Personalization-Module.md` | `Personalization.Config.initialize()` code example, four config options, initialization order |
| 0.3.7 | `DeveloperDocs/02-Personalize-Web-Experiences/05-Define-Configure-Transformers.md` | Handlebars transformer structure, code block |
| 0.3.8 | `DeveloperDocs/02-Personalize-Web-Experiences/06-Integrate-Modern-Frontend-Frameworks.md` | Content zone handlers for React/Vue/Angular, `ContentZoneHandler.set()` API |
| 0.3.9 | `DeveloperDocs/02-Personalize-Web-Experiences/07-Request-Personalization-Through-Sitemap.md` | `Personalization.fetch()` method, data space config, Promise-based fetch pattern |

### 0.4 — Note Content Gaps (Placeholder Sections)

These directories are **empty**. Content must be authored based on `Doc.md`, official Salesforce docs referenced therein, and expert knowledge. Mark authored content with a `> **🔍 Needs Validation:**` callout.

| Directory | Topic | Authoring Approach |
|-----------|-------|-------------------|
| `DeveloperDocs/03-Personalize-Mobile-Experiences/` | iOS & Android SDK | Base on web SDK patterns from `Doc.md`; adapt for native mobile. Reference official Salesforce Mobile SDK docs. |
| `DeveloperDocs/04-Decisioning-API/` | Decisioning API | Use API details from `Doc.md` + `07-Request-Personalization-Through-Sitemap.md` fetch pattern. |
| `DeveloperDocs/05-Experimentation-Assignment-API/` | Experimentation API | Use experiment config details from `Doc.md` experiments section. |
| `DeveloperDocs/06-Personalization-Invocable-Actions/` | Invocable Actions | Use invocable action references from `Doc.md`. |
| `DeveloperDocs/07-Data-Model-Object-Reference/` | DMO Reference | Use DMO names/fields from mapping tables in `Doc.md` and `02-Integrate-Salesforce-Interactions-SDK.md`. |
| `DeveloperDocs/08-Sample-Templates/` | Handlebars Templates | Use transformer examples from `Doc.md` and `05-Define-Configure-Transformers.md`. |

---

## Phase 1: Write Homepage Content

### 1.1 — Create `content/homepage.md`

Write the homepage content as a Markdown file including:

1. **Hero heading:** *"Learn Salesforce Personalization — A Hands-On Implementation Guide"* — plus a subheading explaining this is a step-by-step guide for beginners.
2. **What is Salesforce Personalization?** — Plain-English explanation:
   - Customer 360 application built on Data Cloud
   - Delivers personalized experiences (product recommendations, targeted content) across web, mobile, email, and agentic channels
   - Uses real-time behavioral data, unified customer profiles, data graphs, calculated insights, and ML-driven recommendations
3. **Salient Features** — Present all 10 capabilities from the agent definition as a list or grouped descriptions:
   - Real-time data ingestion via Web SDK and Mobile SDK
   - Unified customer profiles through Identity Resolution
   - Profile and Item Data Graphs for fast decisioning
   - Manual Content and ML-powered Recommendations (rules-based and objective-based)
   - Web Personalization Manager (WYSIWYG, no-code experience builder)
   - Experimentation with A/B testing and traffic allocation
   - Attribution analytics and Pipeline Intelligence dashboards
   - Decisioning API for headless/server-side personalization
   - Batch personalization for offline/scheduled use cases
   - Agentforce integration via Invocable Actions
4. **"Start Learning" call-to-action** — Text pointing readers to the Setup & Permissions section.

**Source files:** `agent.md` (homepage section), `DeveloperDocs/01-Overview.md` (data flow), `DetailedImplementationDoc/Doc.md` (overview).

---

## Phase 2: Write Section 1 — Setup & Permissions

### 2.1 — Create `content/setup-permissions.md`

**Source files:** `DetailedImplementationDoc/Doc.md` → "Salesforce Administrator" section, "Defining an Implementation Blueprint" section; `DeveloperDocs/02-Personalize-Web-Experiences/02-Integrate-Salesforce-Interactions-SDK.md` → "Create a Data Space" steps.

**Content to write:**

1. **Required Licenses** — Data Cloud, Personalization, Data Spaces add-on (if multi-space)
2. **Permission Set Assignment** — Personalization Admin PSL, Data Cloud Admin, creating scoped permission sets for day-to-day users
3. **Personalization Datakit Deployment** — Navigate to Setup → Personalization, deploy datakit, deploy Pipeline Intelligence CIs
4. **Data Space Creation** — Step-by-step from SDK integration doc
5. **Implementation Blueprint Guidance** — Identify target site, list/prioritize use cases, map data requirements, plan IR identifiers, define rollout schedule

---

## Phase 3: Write Section 2 — Data Capturing & Modeling (6 files)

### 3.1 — Create `content/data-capturing-modeling/overview.md`

Brief overview introducing the data pipeline: Website/Mobile → SDK → Data Cloud → DLO → DMO → IR → Data Graph → Personalization. Link to all 5 sub-sections.

**Source:** `DeveloperDocs/01-Overview.md` (data flow), `DetailedImplementationDoc/Doc.md` (overview + lego blocks).

### 3.2 — Create `content/data-capturing-modeling/web-data-capturing.md` (Section 2A)

**Source:** `DeveloperDocs/02-Personalize-Web-Experiences/02-Integrate-Salesforce-Interactions-SDK.md` (primary), `DetailedImplementationDoc/Doc.md` → "Sitemaps & Web Schemas".

**Content:**
1. Create a Website Connector — step-by-step
2. Upload Web Event Schema — download recommended JSON, upload, review
3. Install Interactions SDK — CDN script, add to `<head>`, initialize with `SalesforceInteractions.init`
4. Build a Sitemap — with code examples covering:
   - Consent management (`consents` array)
   - Page types (`isMatch`, interaction with `eventType`)
   - Content zones (name + CSS selector)
   - Engagement vs. profile events, event type splitting
   - Standard vs. custom interaction names
   - Best practices
5. Web Schema Configuration — JSON schema structure
6. Deploy Website Data Streams — create data streams, select events, choose data space, Partial refresh mode
7. Map DLOs to DMOs — full mapping tables (Product Browse, Shopping Cart, Product Order, Contact Point Email/Phone, Identity, Party Identification)

### 3.3 — Create `content/data-capturing-modeling/mobile-data-capturing.md` (Section 2B)

**Source:** `DetailedImplementationDoc/Doc.md` (mobile references), web SDK patterns adapted for mobile.

**Content:** *(Authored from limited sources — mark with `🔍 Needs Validation` callouts)*
1. Create Mobile App Connector
2. Upload Mobile Event Schema
3. iOS SDK Integration — CocoaPods/SPM, initialization, event sending
4. Android SDK Integration — Gradle, initialization, event sending
5. Mobile Sitemap Equivalent
6. Deploy Mobile Data Streams

### 3.4 — Create `content/data-capturing-modeling/dlo-dmo-mapping-ir.md` (Section 2C)

**Source:** `DetailedImplementationDoc/Doc.md` → DLO/DMO section + "Configuring Identity Resolution"; `DeveloperDocs/02-Personalize-Web-Experiences/02-Integrate-Salesforce-Interactions-SDK.md` → mapping tables.

**Content:**
1. Understanding DLOs and DMOs — what they are, why mapping matters
2. Progressive Mapping Strategy — split by event type, auto-mapping via `masterLabel`
3. Identity Resolution — why it matters, plan identifiers, create IR ruleset, exact match vs. normalized vs. fuzzy, deploy ruleset

### 3.5 — Create `content/data-capturing-modeling/data-graphs.md` (Section 2D)

**Source:** `DetailedImplementationDoc/Doc.md` → "Profile Data Graphs" + "Item Data Graphs".

**Content:**
1. Profile Data Graph (Real-Time) — root on Unified Individual, enable caching, add engagement objects, segments, CIs, hot-store vs. pre-fetch vs. lakehouse
2. Item Data Graph (Standard) — root on business object DMO, add related objects, select fields
3. DG Refresh Cycles — 30-min for RT DGs
4. Viewing Data — Data Explorer debugging, DG lookup flow

### 3.6 — Create `content/data-capturing-modeling/calculated-insights.md` (Section 2E)

**Source:** `DetailedImplementationDoc/Doc.md` → CI references throughout personalization building blocks.

**Content:**
1. What CIs are — multidimensional metrics
2. CI for Rules-Based Recommenders — top sellers, most viewed, co-browse, co-buy
3. CI for Targeting & Filtering
4. Adding CIs to Data Graphs

---

## Phase 4: Write Section 3 — Web Implementation (9 files)

### 4.1 — Create `content/web-implementation/overview.md`

Brief overview of the personalization building blocks. Link to all 8 sub-sections (3A–3H).

**Source:** `DetailedImplementationDoc/Doc.md` → "Personalization Building Blocks" intro.

### 4.2 — Create `content/web-implementation/personalization-types.md` (Section 3A)

**Source:** `DetailedImplementationDoc/Doc.md` → "Personalization Types".

**Content:** Manual Content vs. Recommendations — when to use each, prerequisites.

### 4.3 — Create `content/web-implementation/recommenders.md` (Section 3B)

**Source:** `DetailedImplementationDoc/Doc.md` → "Recommenders" section.

**Content:** Rules-based (CI-powered), Objective-based (ML), Engagement Signals, Engagement Signal Metrics, Recommender Filters (decision context, static, profile DG), Recommender Training (24-hr cycle, 3 engagement rows minimum).

### 4.4 — Create `content/web-implementation/response-templates.md` (Section 3C)

**Source:** `DetailedImplementationDoc/Doc.md` → "Response Templates".

**Content:** Manual Content Templates, Recommendations Templates, applying to Personalization Points.

### 4.5 — Create `content/web-implementation/personalization-points.md` (Section 3D)

**Source:** `DetailedImplementationDoc/Doc.md` → "Personalization Points".

**Content:** Creating a Personalization Point, configuration options, reusability across channels.

### 4.6 — Create `content/web-implementation/decisions.md` (Section 3E)

**Source:** `DetailedImplementationDoc/Doc.md` → "Decisions".

**Content:** Decision config (priority, targeting rules, attributes, recommender), up to 25 per point, targeting rules (profile DG, segments, CIs, contextual).

### 4.7 — Create `content/web-implementation/experiments.md` (Section 3F)

**Source:** `DetailedImplementationDoc/Doc.md` → "Experiments".

**Content:** Creating an experiment, primary/secondary metrics, cohorts, control cohort, lifecycle (90-day window, archive vs. delete).

### 4.8 — Create `content/web-implementation/web-templates.md` (Section 3G)

**Source:** `DetailedImplementationDoc/Doc.md` → "Web Templates (Transformers)"; `DeveloperDocs/02-Personalize-Web-Experiences/05-Define-Configure-Transformers.md`; `06-Integrate-Modern-Frontend-Frameworks.md`.

**Content:** Handlebars transformer structure, substitution definitions, example templates (SimpleRecs, SimpleHero, SimpleOverlay), content zone handlers for React.

### 4.9 — Create `content/web-implementation/web-personalization-manager.md` (Section 3H)

**Source:** `DetailedImplementationDoc/Doc.md` → "Web Personalization Manager".

**Content:** Accessing WPM (`?sf_personalization_wpm`), adding experiences, When/Where config, engagement tracking, preview, publish.

---

## Phase 5: Write Section 4 — Mobile Implementation

### 5.1 — Create `content/mobile-implementation.md`

**Source:** `DetailedImplementationDoc/Doc.md` (mobile references), authored content.

**Content:** *(Authored — mark with `🔍 Needs Validation` callouts)*
1. Mobile SDK Setup Recap (cross-reference Section 2B)
2. Requesting Personalization in Mobile — Decisioning API from mobile SDK
3. Rendering Responses — native UI (SwiftUI/UIKit, Jetpack Compose/XML)
4. Tracking Engagement — impression/click events via mobile SDK
5. Mobile-Specific Considerations — offline, deep linking, push notification triggers

---

## Phase 6: Write Section 5 — Personalization API

### 6.1 — Create `content/personalization-api.md`

**Source:** `DetailedImplementationDoc/Doc.md` (personalization points, run-time flow); `DeveloperDocs/02-Personalize-Web-Experiences/07-Request-Personalization-Through-Sitemap.md`.

**Content:** *(Partially authored — mark with `🔍 Needs Validation` where applicable)*
1. API Overview
2. Authentication — OAuth token flow (emphasize security, no real credentials in examples)
3. Request Structure — individual ID, point names, context data
4. Fetching via Web SDK — `SalesforceInteractions.Personalization.fetch()` with Promise handling
5. Server-Side Request — REST endpoint, request/response JSON
6. Response Structure — `personalizations` array with `personalizationId`, `data`, `attributes`
7. Pipeline Diagnostics
8. Data Space Configuration

---

## Phase 7: Write Section 6 — Experimentation

### 7.1 — Create `content/experimentation.md`

**Source:** `DetailedImplementationDoc/Doc.md` → "Experiments" + "Measuring" sections.

**Content:**
1. What is Experimentation?
2. Prerequisites — active personalization point, engagement signals & metrics configured
3. Creating an Experiment — point, metrics, targeting, cohorts, control
4. Runtime Behavior — highest priority, random assignment
5. Viewing Analytics — 24-hr delay, Experiments tab
6. Lifecycle Management — 90-day cap, archive vs. delete

---

## Phase 8: Write Section 7 — Batch Personalization

### 8.1 — Create `content/batch-personalization.md`

**Source:** `DetailedImplementationDoc/Doc.md` (batch/invocable action references).

**Content:** *(Authored — mark with `🔍 Needs Validation` callouts)*
1. What is Batch Personalization?
2. Use Cases — email, push, CRM next-best-action
3. Configuration — jobs, segments, recommenders
4. Invocable Actions — "Get Personalization Decision" in Flow/Agentforce
5. Output & Consumption — stored results, downstream systems

---

## Phase 9: Create the Handoff Document

### 9.1 — Create `handoff.md`

After all content files are complete, produce the handoff document at the project root. This is the contract for the **website-builder** agent. Include:

#### Section 1: Site Map & Page Registry

A table listing every content file with its:
- Source Markdown file path (e.g., `content/homepage.md`)
- Target URL path (e.g., `/`)
- Page title (e.g., "Home")
- Parent navigation item
- Breadcrumb trail (e.g., `Home > Data Capturing & Modeling > Web Data Capturing`)

#### Section 2: Navigation Structure

Full nav bar definition with dropdowns:
```
Home → /
Setup & Permissions → /setup-permissions/
Data Capturing & Modeling → (dropdown with 6 items)
Web Implementation → (dropdown with 9 items)
Mobile Implementation → /mobile-implementation/
Personalization API → /personalization-api/
Experimentation → /experimentation/
Batch Personalization → /batch-personalization/
```

#### Section 3: Page Reading Order (Previous/Next)

Linear sequence for Previous/Next navigation:
```
Home → Setup & Permissions → Data Capturing Overview → Web Data Capturing →
Mobile Data Capturing → DLO-DMO Mapping & IR → Data Graphs → Calculated Insights →
Web Implementation Overview → Personalization Types → Recommenders → Response Templates →
Personalization Points → Decisions → Experiments → Web Templates → WPM →
Mobile Implementation → Personalization API → Experimentation → Batch Personalization
```

#### Section 4: Design Guidelines for Website-Builder

Pass through the visual design specs from `agent.md`:
- Color palette (Astro blue `#0176D3`, white, grays, teal `#04844B`)
- Typography (sans-serif stack, 16px body, hierarchical headings)
- Code blocks (syntax-highlighted, dark bg, language labels)
- Tables (zebra-striped, responsive)
- Callout rendering rules (map Markdown callout syntax → styled boxes with colored left borders)
- Layout (sticky nav, sidebar TOC, breadcrumbs, Previous/Next, mobile responsive)
- Diagram rendering (handle Mermaid or ASCII diagrams in content)

#### Section 5: Content Conventions Reference

Document the Markdown conventions used across all content files:
- Callout syntax: `> **💡 Tip:** ...`, `> **⚠️ Important:** ...`, `> **🚨 Warning:** ...`, `> **📝 Note:** ...`, `> **🔍 Needs Validation:** ...`
- Cross-reference format: standard Markdown links to other content files
- Code block language tags used: `javascript`, `json`, `html`, `swift`, `kotlin`, `bash`
- Table format: standard Markdown tables
- Heading hierarchy: `#` = page title, `##` = major section, `###` = subsection, `####` = sub-subsection

---

## Phase 10: Quality Pass

After all content files and the handoff doc are created, review:

### 10.1 — Cross-References
- Verify all Markdown links between content files use correct relative paths.
- Every "See [Page Name](path)" reference resolves to an actual content file.

### 10.2 — Code Example Accuracy
- All JavaScript code examples use `SalesforceInteractions` namespace correctly.
- Sitemap code examples match patterns from `Doc.md` and SDK docs.
- JSON examples are valid JSON.
- Handlebars template examples are syntactically correct.

### 10.3 — Callout Audit
- Every authored/placeholder section has a `🔍 Needs Validation` callout.
- Appropriate Tip/Important/Warning callouts placed throughout:
  - **Important** before irreversible steps (deploy datakit, deploy IR ruleset)
  - **Warning** for common pitfalls (initialization order, schema before data streams)
  - **Tip** for best practices (progressive mapping, simple use cases first)

### 10.4 — Acronym Definitions
- On first use in each content file, define: DLO, DMO, IR, CI, DG, WPM, SDK, PSL

### 10.5 — External Links
- Preserve all Salesforce Help and Developer Doc links from source material.
- Add "Learn More" references linking to official docs where appropriate.

### 10.6 — Handoff Completeness
- Verify the handoff doc lists every content file that was created.
- Verify the reading order covers all pages.
- Verify nav structure includes all pages.

---

## Execution Order Summary

| Phase | Deliverables | Depends On |
|-------|-------------|------------|
| **0** | Read all source files | — |
| **1** | `content/homepage.md` | Phase 0 |
| **2** | `content/setup-permissions.md` | Phase 0 |
| **3** | `content/data-capturing-modeling/` (6 `.md` files) | Phase 0 |
| **4** | `content/web-implementation/` (9 `.md` files) | Phase 0 |
| **5** | `content/mobile-implementation.md` | Phase 0 |
| **6** | `content/personalization-api.md` | Phase 0 |
| **7** | `content/experimentation.md` | Phase 0 |
| **8** | `content/batch-personalization.md` | Phase 0 |
| **9** | `handoff.md` | Phases 1–8 |
| **10** | Quality pass across all files | Phases 1–9 |

**Total content files to create:** 20 Markdown files + 1 handoff document = **21 files**

---

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
