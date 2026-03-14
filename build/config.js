/* ==========================================================================
   config.js — Page Registry, Ads Config, Donation Config
   Source of truth: handoff.md §1, §3
   ========================================================================== */

'use strict';

// ── Site Configuration ────────────────────────────────────────────────────
const SITE_CONFIG = {
  siteUrl: 'https://www.salesforce-personalization.guide',  // Primary domain (www)
  siteName: 'Salesforce Personalization Guide',
  siteDescription: 'A step-by-step implementation guide for Salesforce Personalization — from Data Cloud setup to delivering personalized web and mobile experiences.',
  locale: 'en_US',
  twitterHandle: '',  // Optional: @yourhandle
};

// ── Google AdSense Configuration ──────────────────────────────────────────
const ADS_CONFIG = {
  adsensePublisherId: 'ca-pub-2226503306776174',
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
    description: 'A step-by-step guide for beginners to implement Salesforce Personalization — from Data Cloud setup to delivering personalized web and mobile experiences.',
    parentNav: null,
    breadcrumb: ['Home'],
    isHomepage: true,
  },
  {
    contentFile: 'content/setup-permissions.md',
    urlPath: '/setup-permissions/',
    title: 'Setup & Permissions',
    description: 'Configure licenses, permission sets, deploy the Personalization datakit, and plan your Salesforce Personalization implementation.',
    parentNav: 'Setup & Permissions',
    breadcrumb: ['Home', 'Setup & Permissions'],
  },
  {
    contentFile: 'content/data-capturing-modeling/overview.md',
    urlPath: '/data-capturing-modeling/',
    title: 'Data Capturing & Modeling',
    description: 'Learn how to capture and model data in Salesforce Personalization using Web SDK, Mobile SDK, DLOs, DMOs, and Identity Resolution.',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling'],
  },
  {
    contentFile: 'content/data-capturing-modeling/web-data-capturing.md',
    urlPath: '/data-capturing-modeling/web-data-capturing/',
    title: 'Web Data Capturing',
    description: 'Capture web interaction data using the Salesforce Interactions SDK — page views, clicks, cart actions, and purchases in real time.',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'Web Data Capturing'],
  },
  {
    contentFile: 'content/data-capturing-modeling/mobile-data-capturing.md',
    urlPath: '/data-capturing-modeling/mobile-data-capturing/',
    title: 'Mobile Data Capturing',
    description: 'Implement mobile data capturing for iOS and Android apps using the Salesforce Mobile SDK for Personalization.',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'Mobile Data Capturing'],
  },
  {
    contentFile: 'content/data-capturing-modeling/dlo-dmo-mapping-ir.md',
    urlPath: '/data-capturing-modeling/dlo-dmo-mapping-ir/',
    title: 'DLO-DMO Mapping & Identity Resolution',
    description: 'Understand Data Lake Objects, Data Model Objects, mapping rules, and Identity Resolution in Salesforce Data Cloud.',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'DLO-DMO Mapping & IR'],
  },
  {
    contentFile: 'content/data-capturing-modeling/data-graphs.md',
    urlPath: '/data-capturing-modeling/data-graphs/',
    title: 'Data Graphs',
    description: 'Build Profile and Item Data Graphs in Salesforce Data Cloud to power personalization decisions and recommendations.',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'Data Graphs'],
  },
  {
    contentFile: 'content/data-capturing-modeling/calculated-insights.md',
    urlPath: '/data-capturing-modeling/calculated-insights/',
    title: 'Calculated Insights',
    description: 'Create and use Calculated Insights in Salesforce Data Cloud for rules-based recommendations and personalization targeting.',
    parentNav: 'Data Capturing & Modeling',
    breadcrumb: ['Home', 'Data Capturing & Modeling', 'Calculated Insights'],
  },
  {
    contentFile: 'content/web-implementation/overview.md',
    urlPath: '/web-implementation/',
    title: 'Web Campaign Configuration',
    description: 'Configure web personalization campaigns in Salesforce — personalization types, recommenders, response templates, and decisions.',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation'],
  },
  {
    contentFile: 'content/web-implementation/personalization-types.md',
    urlPath: '/web-implementation/personalization-types/',
    title: 'Personalization Types',
    description: 'Understand Manual Content and Recommendation personalization types in Salesforce Personalization for web campaigns.',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Personalization Types'],
  },
  {
    contentFile: 'content/web-implementation/recommenders.md',
    urlPath: '/web-implementation/recommenders/',
    title: 'Recommenders',
    description: 'Configure rules-based and ML-powered recommenders in Salesforce Personalization for product and content recommendations.',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Recommenders'],
  },
  {
    contentFile: 'content/web-implementation/response-templates.md',
    urlPath: '/web-implementation/response-templates/',
    title: 'Response Templates',
    description: 'Design and configure response templates that define the JSON payload structure for Salesforce Personalization decisions.',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Response Templates'],
  },
  {
    contentFile: 'content/web-implementation/personalization-points.md',
    urlPath: '/web-implementation/personalization-points/',
    title: 'Personalization Points',
    description: 'Set up Personalization Points to define where and when personalized content appears on your website.',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Personalization Points'],
  },
  {
    contentFile: 'content/web-implementation/decisions.md',
    urlPath: '/web-implementation/decisions/',
    title: 'Personalization Decisions',
    description: 'Configure personalization decisions that evaluate targeting rules and return the winning content or recommendation.',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Decisions'],
  },
  {
    contentFile: 'content/web-implementation/experiments.md',
    urlPath: '/web-implementation/experiments/',
    title: 'Experiments',
    description: 'Set up A/B tests and experiments to measure the impact of your Salesforce Personalization campaigns.',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Experiments'],
  },
  {
    contentFile: 'content/web-implementation/web-templates.md',
    urlPath: '/web-implementation/web-templates/',
    title: 'Web Templates (Transformers)',
    description: 'Build web templates (transformers) to render personalized content on your website using the Salesforce Interactions SDK.',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Web Templates'],
  },
  {
    contentFile: 'content/web-implementation/web-personalization-manager.md',
    urlPath: '/web-implementation/web-personalization-manager/',
    title: 'Web Personalization Manager (WPM)',
    description: 'Use the Web Personalization Manager to test, preview, and debug personalization campaigns directly on your website.',
    parentNav: 'Web Implementation',
    breadcrumb: ['Home', 'Web Implementation', 'Web Personalization Manager'],
  },
  {
    contentFile: 'content/mobile-implementation.md',
    urlPath: '/mobile-implementation/',
    title: 'Mobile App Implementation',
    description: 'Implement Salesforce Personalization in native iOS and Android apps using the Mobile SDK.',
    parentNav: 'Mobile Implementation',
    breadcrumb: ['Home', 'Mobile Implementation'],
  },
  {
    contentFile: 'content/personalization-api.md',
    urlPath: '/personalization-api/',
    title: 'Personalization API (Decisioning API)',
    description: 'Use the Salesforce Personalization Decisioning API for server-side personalization across any channel.',
    parentNav: 'Personalization API',
    breadcrumb: ['Home', 'Personalization API'],
  },
  {
    contentFile: 'content/experimentation.md',
    urlPath: '/experimentation/',
    title: 'Experimentation Setup',
    description: 'Set up experimentation infrastructure for A/B testing and measuring personalization impact in Salesforce.',
    parentNav: 'Experimentation',
    breadcrumb: ['Home', 'Experimentation'],
  },
  {
    contentFile: 'content/batch-personalization.md',
    urlPath: '/batch-personalization/',
    title: 'Batch Personalization',
    description: 'Implement batch personalization for email, push notifications, and other non-real-time channels using Salesforce Data Cloud.',
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

module.exports = { SITE_CONFIG, ADS_CONFIG, DONATION_CONFIG, PAGES, buildContentToUrlMap };
