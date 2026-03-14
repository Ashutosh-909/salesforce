/* ==========================================================================
   build.js — Static Site Generator
   Reads Markdown content files, applies layout templates, writes HTML to site/
   ========================================================================== */

'use strict';

const fs   = require('fs');
const path = require('path');
const markdownIt   = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const Prism = require('prismjs');

// Load additional Prism languages
require('prismjs/components/prism-json');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-swift');
require('prismjs/components/prism-kotlin');
require('prismjs/components/prism-sql');
require('prismjs/components/prism-handlebars');
require('prismjs/components/prism-markup'); // HTML

const { PAGES, buildContentToUrlMap } = require('./config');

// ── Paths ─────────────────────────────────────────────────────────────────
const ROOT      = path.resolve(__dirname, '..');
const SITE_DIR  = path.join(ROOT, 'site');
const BUILD_DIR = __dirname;

// ── Templates ─────────────────────────────────────────────────────────────
const layoutTemplate   = fs.readFileSync(path.join(BUILD_DIR, 'layout.html'), 'utf8');
const homepageTemplate = fs.readFileSync(path.join(BUILD_DIR, 'homepage-layout.html'), 'utf8');

// ── Content → URL map for cross-reference rewriting ───────────────────────
const contentToUrl = buildContentToUrlMap();

// ── Markdown-it setup ─────────────────────────────────────────────────────
const md = markdownIt({
  html: true,
  linkify: false,
  typographer: false,
  highlight: function (str, lang) {
    const language = lang || '';
    const normalizedLang = language.toLowerCase().trim();
    let highlighted = '';

    // Map some language aliases
    const langMap = {
      'js': 'javascript',
      'ts': 'typescript',
      'html': 'markup',
      'xml': 'markup',
      'sh': 'bash',
      'shell': 'bash',
    };
    const prismLang = langMap[normalizedLang] || normalizedLang;

    if (prismLang && Prism.languages[prismLang]) {
      try {
        highlighted = Prism.highlight(str, Prism.languages[prismLang], prismLang);
      } catch (_) {
        highlighted = md.utils.escapeHtml(str);
      }
    } else {
      highlighted = md.utils.escapeHtml(str);
    }

    // Build the <pre> with language label and copy button
    const langLabel = language
      ? `<span class="code-lang">${md.utils.escapeHtml(language)}</span>`
      : '';
    const copyBtn = '<button class="copy-btn" aria-label="Copy code">Copy</button>';
    return `<pre>${langLabel}${copyBtn}<code class="language-${md.utils.escapeHtml(language)}">${highlighted}</code></pre>`;
  }
});

md.use(markdownItAnchor, {
  permalink: false,
  slugify: slugify,
});

// ── Slugify (same logic as markdown-it-anchor default) ────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ══════════════════════════════════════════════════════════════════════════
//  POST-PROCESSING FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════

/**
 * Transform blockquotes that match callout patterns into styled callout divs.
 * Patterns: 💡 Tip, ⚠️ Important, 🚨 Warning, 📝 Note, 🔍 Needs Validation
 */
function transformCallouts(html) {
  // Match <blockquote> elements
  return html.replace(/<blockquote>\s*([\s\S]*?)\s*<\/blockquote>/gi, function (match, inner) {
    // Try to match the callout pattern in the first <p> or <strong>
    const calloutPatterns = [
      { pattern: /💡\s*Tip:?/,              type: 'tip',        icon: '💡', label: 'Tip' },
      { pattern: /⚠️\s*Important:?/,        type: 'important',  icon: '⚠️', label: 'Important' },
      { pattern: /🚨\s*Warning:?/,          type: 'warning',    icon: '🚨', label: 'Warning' },
      { pattern: /📝\s*Note:?/,             type: 'note',       icon: '📝', label: 'Note' },
      { pattern: /🔍\s*Needs Validation:?/, type: 'validation', icon: '🔍', label: 'Needs Validation' },
    ];

    for (const cp of calloutPatterns) {
      if (cp.pattern.test(inner)) {
        // Remove the bold label + emoji from the content, keep the rest
        let body = inner
          // Remove <strong>EMOJI Label:</strong> pattern
          .replace(/<strong>\s*(?:💡|⚠️|🚨|📝|🔍)\s*(?:Tip|Important|Warning|Note|Needs Validation):?\s*<\/strong>\s*/i, '')
          .trim();

        return `<div class="callout callout-${cp.type}"><p><span class="callout-label">${cp.icon} ${cp.label}:</span> ${body.replace(/^<p>/, '').replace(/<\/p>\s*$/, '')}</p></div>`;
      }
    }

    // Not a callout — return original blockquote
    return match;
  });
}

/**
 * Rewrite cross-reference links from .md paths to URL paths.
 * Handles relative paths like ../web-implementation/foo.md
 */
function rewriteCrossRefs(html, sourceContentFile) {
  const sourceDir = path.dirname(sourceContentFile);

  return html.replace(/href="([^"]*\.md(?:#[^"]*)?)"/gi, function (match, rawHref) {
    // Split off any fragment
    const hashIdx = rawHref.indexOf('#');
    let mdPath = hashIdx >= 0 ? rawHref.substring(0, hashIdx) : rawHref;
    const fragment = hashIdx >= 0 ? rawHref.substring(hashIdx) : '';

    // Resolve relative to the source file's directory
    const resolved = path.posix.normalize(path.posix.join(sourceDir.replace(/\\/g, '/'), mdPath));

    // Look up in our content → URL map
    if (contentToUrl[resolved]) {
      return `href="${contentToUrl[resolved]}${fragment}"`;
    }

    // Try with content/ prefix
    const withContent = 'content/' + resolved.replace(/^content\//, '');
    if (contentToUrl[withContent]) {
      return `href="${contentToUrl[withContent]}${fragment}"`;
    }

    // Try normalizing differently — strip leading ./
    const cleaned = resolved.replace(/^\.\//, '');
    const withContent2 = 'content/' + cleaned;
    if (contentToUrl[withContent2]) {
      return `href="${contentToUrl[withContent2]}${fragment}"`;
    }

    console.warn(`  ⚠ Unresolved cross-ref: ${rawHref} (from ${sourceContentFile})`);
    return match;
  });
}

/**
 * Add target="_blank" rel="noopener noreferrer" to external links (https://, http://)
 */
function processExternalLinks(html) {
  return html.replace(/<a\s+href="(https?:\/\/[^"]+)"/gi, function (match, url) {
    // Don't double-add if attributes already present
    if (match.includes('target=')) return match;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer"`;
  });
}

/**
 * Wrap tables in .table-wrapper for horizontal scroll on mobile
 */
function wrapTables(html) {
  return html.replace(/<table>/gi, '<div class="table-wrapper"><table>');
  // Also close the wrapper
}
function wrapTablesComplete(html) {
  // Wrap each <table>...</table> block
  return html.replace(/<table>([\s\S]*?)<\/table>/gi, '<div class="table-wrapper"><table>$1</table></div>');
}

/**
 * Extract H2 and H3 headings from HTML and generate TOC markup.
 */
function generateTOC(html) {
  const headingRegex = /<h([23])\s+id="([^"]*)"[^>]*>([\s\S]*?)<\/h[23]>/gi;
  let tocItems = [];
  let m;

  while ((m = headingRegex.exec(html)) !== null) {
    const level = parseInt(m[1], 10);
    const id = m[2];
    // Strip HTML tags from heading text
    const text = m[3].replace(/<[^>]+>/g, '').trim();
    tocItems.push({ level, id, text });
  }

  if (tocItems.length === 0) {
    return '<ul><li><em>No sections</em></li></ul>';
  }

  let tocHtml = '<ul>\n';
  for (const item of tocItems) {
    const cssClass = item.level === 3 ? ' class="toc-h3"' : '';
    tocHtml += `  <li${cssClass}><a href="#${item.id}">${item.text}</a></li>\n`;
  }
  tocHtml += '</ul>';
  return tocHtml;
}

/**
 * Generate breadcrumb HTML from breadcrumb array.
 * Each segment except the last is a link.
 */
function generateBreadcrumbs(breadcrumbTrail, currentUrlPath) {
  if (!breadcrumbTrail || breadcrumbTrail.length === 0) return '';

  const parts = [];
  for (let i = 0; i < breadcrumbTrail.length; i++) {
    const segment = breadcrumbTrail[i];
    const isLast = i === breadcrumbTrail.length - 1;

    if (isLast) {
      parts.push(`<span class="breadcrumb-current">${escapeHtml(segment)}</span>`);
    } else {
      // Resolve the breadcrumb segment to its URL
      const url = breadcrumbSegmentToUrl(segment);
      parts.push(`<a href="${url}">${escapeHtml(segment)}</a>`);
    }
  }

  return parts.join('<span class="breadcrumb-sep"> &gt; </span>');
}

/**
 * Map a breadcrumb segment name to its URL path.
 */
function breadcrumbSegmentToUrl(segment) {
  const map = {
    'Home': '/',
    'Setup & Permissions': '/setup-permissions/',
    'Data Capturing & Modeling': '/data-capturing-modeling/',
    'Web Implementation': '/web-implementation/',
    'Mobile Implementation': '/mobile-implementation/',
    'Personalization API': '/personalization-api/',
    'Experimentation': '/experimentation/',
    'Batch Personalization': '/batch-personalization/',
  };
  return map[segment] || '/';
}

/**
 * Generate Previous/Next navigation HTML.
 */
function generatePrevNext(pageIndex) {
  const prevPage = pageIndex > 0 ? PAGES[pageIndex - 1] : null;
  const nextPage = pageIndex < PAGES.length - 1 ? PAGES[pageIndex + 1] : null;

  let html = '';

  if (prevPage) {
    html += `<a href="${prevPage.urlPath}" class="prev-next-btn pn-prev">
      <span class="pn-direction">← Previous</span>
      <span class="pn-title">${escapeHtml(prevPage.title)}</span>
    </a>`;
  }

  if (nextPage) {
    html += `<a href="${nextPage.urlPath}" class="prev-next-btn pn-next">
      <span class="pn-direction">Next →</span>
      <span class="pn-title">${escapeHtml(nextPage.title)}</span>
    </a>`;
  }

  return html;
}

/**
 * Inject in-content ad after the 3rd <h2> section if there are 4+ H2s.
 */
function injectInContentAd(html) {
  const h2Regex = /<h2[\s>]/gi;
  const h2Matches = [];
  let m;
  while ((m = h2Regex.exec(html)) !== null) {
    h2Matches.push(m.index);
  }

  if (h2Matches.length < 4) return html;

  // Insert ad container just before the 4th <h2> (i.e., after the 3rd section)
  const insertPos = h2Matches[3];
  const adHtml = `
  <div class="ad-container ad-in-content">
    <span class="ad-label">Advertisement</span>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
         data-ad-slot="XXXXXXXXXX"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>
`;

  return html.substring(0, insertPos) + adHtml + html.substring(insertPos);
}

/**
 * Compute the ROOT_PATH relative prefix (e.g. "../" or "../../")
 * so that CSS/JS/nav links resolve correctly from nested pages.
 */
function computeRootPath(urlPath) {
  if (urlPath === '/') return '';
  // Count depth: /setup-permissions/ → 1, /data-capturing-modeling/web-data-capturing/ → 2
  const segments = urlPath.replace(/^\//, '').replace(/\/$/, '').split('/');
  return '../'.repeat(segments.length);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ══════════════════════════════════════════════════════════════════════════
//  HOMEPAGE SPECIAL BUILD
// ══════════════════════════════════════════════════════════════════════════

function buildHomepage(page, pageIndex) {
  const mdContent = fs.readFileSync(path.join(ROOT, page.contentFile), 'utf8');

  // Split homepage into sections based on ## headings
  const lines = mdContent.split('\n');
  let heroTitle = '';
  let heroSubtitle = '';
  let whatIsSection = '';
  let featuresSection = '';
  let ctaSection = '';
  let whatYoullLearnSection = '';
  let additionalSection = '';
  let currentSection = 'hero';

  let sectionContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i === 0 && line.startsWith('# ')) {
      heroTitle = `<h1>${escapeHtml(line.substring(2).trim())}</h1>`;
      continue;
    }

    if (line.startsWith('## ')) {
      // Flush previous section
      flushSection();

      const heading = line.substring(3).trim();
      if (/what is salesforce personalization/i.test(heading)) {
        currentSection = 'whatis';
      } else if (/salient features/i.test(heading)) {
        currentSection = 'features';
      } else if (/ready to get started/i.test(heading) || /start learning/i.test(heading)) {
        currentSection = 'cta';
      } else if (/what you.?ll learn/i.test(heading)) {
        currentSection = 'learn';
      } else if (/additional resources/i.test(heading)) {
        currentSection = 'additional';
      } else {
        currentSection = 'other';
      }
      sectionContent = [line];
      continue;
    }

    // Hero subtitle — the first non-empty paragraph after H1
    if (currentSection === 'hero' && heroSubtitle === '' && line.trim() !== '' && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('---')) {
      heroSubtitle = `<p>${processInlineMarkdown(line.trim())}</p>`;
      continue;
    }

    // Skip the callout note in hero area (render it in whatIs section instead)
    if (currentSection === 'hero' && (line.startsWith('>') || line.trim() === '' || line.startsWith('---'))) {
      if (line.startsWith('>')) {
        sectionContent.push(line);
      }
      continue;
    }

    sectionContent.push(line);
  }
  flushSection();

  function flushSection() {
    const raw = sectionContent.join('\n').trim();
    if (!raw) return;

    const rendered = md.render(raw);
    switch (currentSection) {
      case 'hero':
        // Any hero-area callout
        break;
      case 'whatis':
        whatIsSection = rendered;
        break;
      case 'features':
        featuresSection = raw; // We'll process features specially
        break;
      case 'cta':
        ctaSection = rendered;
        break;
      case 'learn':
        whatYoullLearnSection = rendered;
        break;
      case 'additional':
        additionalSection = rendered;
        break;
    }
    sectionContent = [];
  }

  // Process features into cards
  const featureCards = buildFeatureCards(featuresSection);

  // Process the "What is" section
  let whatIsHtml = transformCallouts(whatIsSection);
  whatIsHtml = rewriteCrossRefs(whatIsHtml, page.contentFile);
  whatIsHtml = processExternalLinks(whatIsHtml);
  whatIsHtml = wrapTablesComplete(whatIsHtml);

  // Process "What You'll Learn" section
  let learnHtml = transformCallouts(whatYoullLearnSection);
  learnHtml = rewriteCrossRefs(learnHtml, page.contentFile);
  learnHtml = processExternalLinks(learnHtml);
  learnHtml = wrapTablesComplete(learnHtml);

  // Process "Additional Resources" section
  let additionalHtml = processExternalLinks(additionalSection);
  additionalHtml = rewriteCrossRefs(additionalHtml, page.contentFile);

  // Build CTA button
  const ctaButtonHtml = `<a href="/setup-permissions/" class="btn btn-primary btn-cta">Start Learning: Setup &amp; Permissions →</a>`;

  // Combine body content (what is + learn + additional)
  let bodyContent = '';
  if (whatIsHtml) bodyContent += whatIsHtml;
  if (learnHtml) bodyContent += learnHtml;
  if (additionalHtml) bodyContent += additionalHtml;

  // Assemble homepage
  let html = homepageTemplate
    .replace('{{HERO_TITLE}}', heroTitle)
    .replace('{{HERO_SUBTITLE}}', heroSubtitle)
    .replace('{{CONTENT}}', bodyContent)
    .replace('{{FEATURE_CARDS}}', featureCards)
    .replace('{{CTA_BUTTON}}', ctaButtonHtml);

  // Write file
  const outFile = path.join(SITE_DIR, 'index.html');
  fs.writeFileSync(outFile, html, 'utf8');
  console.log(`  ✓ / (homepage → site/index.html)`);
}

/**
 * Parse feature subsections (### headings under ## Salient Features)
 * and build card HTML.
 */
function buildFeatureCards(rawMd) {
  if (!rawMd) return '';

  const lines = rawMd.split('\n');
  const features = [];
  let current = null;

  // Feature icons mapping
  const featureIcons = {
    'real-time data ingestion': '📡',
    'unified customer profiles': '👤',
    'profile and item data graphs': '📊',
    'manual content and ml-powered recommendations': '🤖',
    'web personalization manager': '🖥️',
    'experimentation with a/b testing': '🧪',
    'attribution analytics and pipeline intelligence': '📈',
    'decisioning api': '🔌',
    'batch personalization': '📦',
    'agentforce integration via invocable actions': '🤝',
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (current) features.push(current);
      const title = line.substring(4).trim();
      const iconKey = title.toLowerCase();
      current = {
        title,
        icon: featureIcons[iconKey] || '⚡',
        body: [],
      };
    } else if (current && line.startsWith('## ')) {
      // Next H2, stop collecting features
      if (current) features.push(current);
      current = null;
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) features.push(current);

  if (features.length === 0) return '';

  let html = '<h2>Salient Features</h2>\n<div class="feature-grid">\n';
  for (const feat of features) {
    const bodyMd = feat.body.join('\n').trim();
    let bodyHtml = md.render(bodyMd);
    bodyHtml = processExternalLinks(bodyHtml);
    bodyHtml = rewriteCrossRefs(bodyHtml, 'content/homepage.md');

    html += `  <div class="feature-card">
    <div class="feature-icon">${feat.icon}</div>
    <h3 class="feature-title">${escapeHtml(feat.title)}</h3>
    <div class="feature-body">${bodyHtml}</div>
  </div>\n`;
  }
  html += '</div>\n';

  return html;
}

function processInlineMarkdown(text) {
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  return text;
}

// ══════════════════════════════════════════════════════════════════════════
//  CONTENT PAGE BUILD
// ══════════════════════════════════════════════════════════════════════════

function buildContentPage(page, pageIndex) {
  const mdContent = fs.readFileSync(path.join(ROOT, page.contentFile), 'utf8');
  const rootPath = computeRootPath(page.urlPath);

  // Render Markdown to HTML
  let contentHtml = md.render(mdContent);

  // Post-processing pipeline
  contentHtml = transformCallouts(contentHtml);
  contentHtml = rewriteCrossRefs(contentHtml, page.contentFile);
  contentHtml = processExternalLinks(contentHtml);
  contentHtml = wrapTablesComplete(contentHtml);
  contentHtml = injectInContentAd(contentHtml);

  // Generate page fragments
  const tocHtml = generateTOC(contentHtml);
  const breadcrumbHtml = generateBreadcrumbs(page.breadcrumb, page.urlPath);
  const prevNextHtml = generatePrevNext(pageIndex);

  // Assemble into layout template
  let html = layoutTemplate
    .replace(/\{\{TITLE\}\}/g, escapeHtml(page.title))
    .replace(/\{\{ROOT_PATH\}\}/g, rootPath)
    .replace('{{TOC}}', tocHtml)
    .replace('{{BREADCRUMBS}}', breadcrumbHtml)
    .replace('{{CONTENT}}', contentHtml)
    .replace('{{PREV_NEXT}}', prevNextHtml);

  // Determine output file path
  const urlSegments = page.urlPath.replace(/^\//, '').replace(/\/$/, '');
  const outDir = path.join(SITE_DIR, urlSegments);
  const outFile = path.join(outDir, 'index.html');

  // Ensure directory exists
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, html, 'utf8');

  console.log(`  ✓ ${page.urlPath} → site/${urlSegments}/index.html`);
}

// ══════════════════════════════════════════════════════════════════════════
//  MAIN BUILD
// ══════════════════════════════════════════════════════════════════════════

function build() {
  console.log('Building Salesforce Personalization Guide...\n');
  console.log(`  Pages: ${PAGES.length}`);
  console.log(`  Output: ${SITE_DIR}\n`);

  for (let i = 0; i < PAGES.length; i++) {
    const page = PAGES[i];

    if (page.isHomepage) {
      buildHomepage(page, i);
    } else {
      buildContentPage(page, i);
    }
  }

  console.log(`\n✅ Build complete — ${PAGES.length} pages generated.`);
}

build();
