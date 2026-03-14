/* ==========================================================================
   config.js — Page Registry, Ads Config, Donation Config
   Source of truth: handoff.md §1, §3
   ========================================================================== */

'use strict';

// ── Google AdSense Configuration ──────────────────────────────────────────
const ADS_CONFIG = {
  adsensePublisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
  adSlots: {
    header:    'XXXXXXXXXX',
    sidebar:   'XXXXXXXXXX',
    inContent: 'XXXXXXXXXX',
    footer:    'XXXXXXXXXX',
  },
};

// ── Buy Me a Latte / Donation Configuration ───────────────────────────────
const DONATION_CONFIG = {
  url: 'https://buymeacoffee.com/YOUR_USERNAME',
  label: 'Buy Me a Latte ☕',
  emoji: '☕',
};

// ── Page Registry ─────────────────────────────────────────────────────────
// Reading order from handoff.md §3 determines prev/next linkage.
// Index in the array IS the reading order (0-based).
const PAGES = [
  {
    contentFile: 'content/homepage.md',
    urlPath: '/',
    title: 'Home',
    parentNav: null,
    breadcrumb: ['Home'],
    isHomepage: true,
  },
  {
    contentFile: 'content/setup-permissions.md',
    urlPath: '/setup-permissions/',
    title: 'Setup & Permissions',
    parentNav: 'Setup & Permissions',
    breadcrumb: ['Home', 'Setup & Permissions'],
  },
  {
    contentFile: 'content/data-capturing-modeling/overview.md',
    urlPath: '/data-capturing-modeling/',
    title: 'Data Capturing & Modeling',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling'],
  },
  {
    contentFile: 'content/data-capturing-modeling/web-data-capturing.md',
    urlPath: '/data-capturing-modeling/web-data-capturing/',
    title: 'Web Data Capturing',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'Web Data Capturing'],
  },
  {
    contentFile: 'content/data-capturing-modeling/mobile-data-capturing.md',
    urlPath: '/data-capturing-modeling/mobile-data-capturing/',
    title: 'Mobile Data Capturing',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'Mobile Data Capturing'],
  },
  {
    contentFile: 'content/data-capturing-modeling/dlo-dmo-mapping-ir.md',
    urlPath: '/data-capturing-modeling/dlo-dmo-mapping-ir/',
    title: 'DLO-DMO Mapping & Identity Resolution',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'DLO-DMO Mapping & IR'],
  },
  {
    contentFile: 'content/data-capturing-modeling/data-graphs.md',
    urlPath: '/data-capturing-modeling/data-graphs/',
    title: 'Data Graphs',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'Data Graphs'],
  },
  {
    contentFile: 'content/data-capturing-modeling/calculated-insights.md',
    urlPath: '/data-capturing-modeling/calculated-insights/',
    title: 'Calculated Insights',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'Calculated Insights'],
  },
  {
    contentFile: 'content/web-implementation/overview.md',
    urlPath: '/web-implementation/',
    title: 'Web Campaign Configuration',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation'],
  },
  {
    contentFile: 'content/web-implementation/personalization-types.md',
    urlPath: '/web-implementation/personalization-types/',
    title: 'Personalization Types',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Personalization Types'],
  },
  {
    contentFile: 'content/web-implementation/recommenders.md',
    urlPath: '/web-implementation/recommenders/',
    title: 'Recommenders',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Recommenders'],
  },
  {
    contentFile: 'content/web-implementation/response-templates.md',
    urlPath: '/web-implementation/response-templates/',
    title: 'Response Templates',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Response Templates'],
  },
  {
    contentFile: 'content/web-implementation/personalization-points.md',
    urlPath: '/web-implementation/personalization-points/',
    title: 'Personalization Points',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Personalization Points'],
  },
  {
    contentFile: 'content/web-implementation/decisions.md',
    urlPath: '/web-implementation/decisions/',
    title: 'Personalization Decisions',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Decisions'],
  },
  {
    contentFile: 'content/web-implementation/experiments.md',
    urlPath: '/web-implementation/experiments/',
    title: 'Experiments',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Experiments'],
  },
  {
    contentFile: 'content/web-implementation/web-templates.md',
    urlPath: '/web-implementation/web-templates/',
    title: 'Web Templates (Transformers)',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Web Templates'],
  },
  {
    contentFile: 'content/web-implementation/web-personalization-manager.md',
    urlPath: '/web-implementation/web-personalization-manager/',
    title: 'Web Personalization Manager (WPM)',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Web Personalization Manager'],
  },
  {
    contentFile: 'content/mobile-implementation.md',
    urlPath: '/mobile-implementation/',
    title: 'Mobile App Implementation',
    parentNav: 'Mobile Implementation',
    breadcrumb: ['Home', 'Mobile Implementation'],
  },
  {
    contentFile: 'content/personalization-api.md',
    urlPath: '/personalization-api/',
    title: 'Personalization API (Decisioning API)',
    parentNav: 'Personalization API',
    breadcrumb: ['Home', 'Personalization API'],
  },
  {
    contentFile: 'content/experimentation.md',
    urlPath: '/experimentation/',
    title: 'Experimentation Setup',
    parentNav: 'Experimentation',
    breadcrumb: ['Home', 'Experimentation'],
  },
  {
    contentFile: 'content/batch-personalization.md',
    urlPath: '/batch-personalization/',
    title: 'Batch Personalization',
    parentNav: 'Batch Personalization',
    breadcrumb: ['Home', 'Batch Personalization'],
  },
];

// ── URL-path lookup (contentFile → urlPath) ───────────────────────────────
// Build a map from content file path (relative to project root) to URL path.
// Also index by the bare filename and by directory-relative patterns so the
// cross-reference link rewriter can resolve ../sibling/file.md style links.
function buildContentToUrlMap() {
  const map = {};
  for (const page of PAGES) {
    // Full relative path:  content/foo/bar.md  →  /foo/bar/
    map[page.contentFile] = page.urlPath;
  }
  return map;
}

module.exports = { ADS_CONFIG, DONATION_CONFIG, PAGES, buildContentToUrlMap };
