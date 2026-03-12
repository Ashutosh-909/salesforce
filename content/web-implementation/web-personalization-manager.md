# Web Personalization Manager (WPM)

The **Web Personalization Manager (WPM)** is a WYSIWYG tool that allows business users to apply personalization points to their websites as **web personalization experiences** — without writing code or modifying the sitemap manually.

The WPM overlays on top of your website, letting you visually select where personalized content appears, define when it triggers, configure engagement tracking, and preview the experience before publishing.

---

## Accessing the WPM

1. Navigate to your website in a browser
2. Append `?sf_personalization_wpm` to the URL

   ```
   https://www.yourwebsite.com?sf_personalization_wpm
   ```

3. The WPM authentication prompt appears — log in with your Salesforce credentials
4. Once authenticated, the WPM toolbar appears at the top of the page

> **📝 Note:** You must have the **Personalization Admin** permission set (or equivalent) to access the WPM.

---

## Adding a New Experience

### Step 1: Select a Personalization Point

1. Click **"+ New"** from the **Personalization Experiences** dropdown in the top left
2. A modal displays all [personalization points](personalization-points.md) configured in the data space defined in your sitemap
3. Select the personalization point you want to apply to this page

> **💡 Tip:** If you don't see any personalization points listed, verify that your sitemap has the correct data space information included in the `SalesforceInteractions.init` configuration.

> **⚠️ Important:** You cannot mix personalization points from **multiple data spaces** on a single website.

### Step 2: Choose a Rendering Method

Once the personalization point is selected, choose how the decision response will be rendered:

| Method | When to Use | Description |
|---|---|---|
| **Manually Personalize Page Elements** | Simple text replacement, basic banner changes | Personalize the site without a pre-created template. Uses string substitution on existing page elements. |
| **Use a Template Defined in the Sitemap** | Recommendations carousels, hero banners, pop-ups | Templates contain pre-built logic for rendering different personalization decision responses. |

> **💡 Tip:** For advanced use cases like product recommendations and overlays, use templates. For quick text swaps and simple banner changes, manual element personalization works well without developer involvement.

> **⚠️ Important:** When using templates, the template developer and the business user creating the response templates must coordinate. The template's `substitutionDefinitions` must align with the fields returned in the decision response. For example, if the response template returns a `price` field, the template needs a corresponding substitution definition and Handlebars code to render it.

### Step 3: Configure WHEN (Page Option)

The **page option** determines when the personalization request fires from the Personalization module of the SDK.

| Option | Description | Example |
|---|---|---|
| **Page Type** | Maps to page types defined in the sitemap (e.g., "Homepage", "PDP Page", "Category Page", "Global"). Selecting a page type fires the experience on every matching page. | Select "PDP Page" → recommendations fire on every product detail page |
| **URL** | Targets a specific URL pattern not mapped to a sitemap page type. Useful for non-standard pages. | Enter `/promotions/summer-sale` → experience fires only on that URL |

> **💡 Tip:** Use **page types** whenever possible. They decouple the experience from specific URLs, so if your site URL structure changes, the experiences still work.

### Step 4: Configure WHERE (Display Method)

The **display method** determines where on the page the template renders the decision response.

| Option | Description | Best For |
|---|---|---|
| **Content Zone** | Select a pre-defined content zone from the sitemap. Replaces the content within that zone. | Stable, well-defined personalization hotspots |
| **Element Selection** | Use the WPM's selector detector to manually choose a `<div>` on the page. Then choose to **replace** the element or **insert** the response before/after it. | Personalizing areas not pre-defined as content zones |
| **Overlay** | Render the response as a pop-up overlay, triggered by scroll percentage, exit intent, element click, or other triggers. | Pop-ups for email capture, promotions, or announcements |

> **💡 Tip:** Define content zones in your sitemap at the start of implementation. They represent stable, predictable areas of the page where personalization is expected. This reduces reliance on fragile CSS selectors.

> **💡 Tip:** **Pop-ups are a powerful use case** for capturing information like email addresses or SMS opt-in numbers. They can convert anonymous individuals to known profiles and grow your list size for outbound communications.

---

## Configuring Engagement Data Tracking

The second tab of the WPM lets you define **where engagement data should be sent** when a user interacts with a personalization experience.

### Why Engagement Tracking Matters

While every personalization decision is logged in Data Cloud's **personalization log** automatically, it's critical that engagement data (views and clicks) is captured in the appropriate **engagement DMO** to enable:

- Attribution tracking and analysis
- Experiment measurement
- Recommender training (for objective-based recommenders)

### Available Engagement Destinations

Engagement destinations are defined in the sitemap by your developer. Common destinations include:

- **Product Browse** engagement DMO — for product recommendation interactions
- **Article Browse** engagement DMO — for article recommendation interactions
- Custom engagement destinations for other item types

> **💡 Tip:** For item recommendations, create a unique engagement destination for each item type. If you recommend both articles and products on your site, define separate destinations so engagement data lands in the correct DMO.

### Key Data Points Tracked

Every engagement event automatically captures:

| Data Point | Description |
|---|---|
| **Personalization ID** | A unique identifier generated for each decision. Recorded in the personalization log. Connecting this value to engagement data links a view or click to a specific decision. |
| **Personalization Content ID** | For recommendations, identifies which specific item was interacted with. Maps to a value in the personalization log. |
| **Personalization Point ID** | Optional. The ID of the personalization point. |
| **Decision ID** | Optional. The ID of the decision that generated the response. |

> **💡 Tip:** Including the personalization point and decision IDs in your engagement DMO enables **frequency capping**. For example, you could write a targeting rule that only shows a decision if the user has seen it fewer than 3 times in the past 7 days.

---

## Previewing the Experience

Before publishing, preview the experience to validate rendering and targeting logic.

### Preview Options

1. **Individual ID** — By default, the WPM uses your own individual ID. Override this field to preview against a different person's profile.

2. **Current User Decision** — Evaluates the experience using the targeting rules against the selected individual's profile data graph. Shows what that specific person would see.

3. **Decision Selector** — Choose any decision from a dropdown to preview its content, **ignoring targeting rules**. Use this to verify that the template renders correctly for each decision.

4. **Preview Button** — Click to render the preview on the page.

### Preview Workflow

1. Enter an **individual ID** (or keep the default)
2. Select **"Current User Decision"** to test real targeting, or select a specific decision to test rendering
3. Click **Preview**
4. Verify the rendered experience looks correct
5. If issues appear, check:
   - Template substitution definitions match the response fields
   - Content zone or element selector targets the right area
   - Decision targeting rules are configured as expected

---

## Publishing the Experience

### Experience States

| State | Behavior |
|---|---|
| **Disabled** (default) | The experience is saved but will **not** trigger personalization requests or render content |
| **Live** | The experience is active — personalization requests fire and content renders for qualifying individuals |

### Publishing Steps

1. Toggle the **Experience State** to **Live**
2. Click **Save**
3. The WPM automatically adds a **Personalization Experience Configuration** to your sitemap
4. The Personalization module of the Web SDK handles all requests associated with this configuration — no additional sitemap modifications are required

> **📝 Note:** After saving, the experience is live immediately. There is no separate deployment step.

---

## Managing Existing Experiences

To view and manage all experiences on a page:

1. Open the WPM on that page (`?sf_personalization_wpm`)
2. Click the **Personalization Experiences** dropdown in the top left
3. Below the **"+ New"** button, you'll see a list of all live experiences on the current page
4. Click an experience to edit its configuration, preview it, or change its state

---

## End-to-End Workflow Summary

Here's the complete workflow for adding a personalized experience to your website using the WPM:

```
1. Open WPM                → Append ?sf_personalization_wpm to your site URL
2. Select a Point          → Choose the personalization point to apply
3. Choose Rendering        → Template or manual element personalization
4. Configure WHEN          → Select page type or URL pattern
5. Configure WHERE         → Content zone, element selector, or overlay
6. Configure Tracking      → Select engagement destination, map data fields
7. Preview                 → Test against current user or specific individual
8. Set State to Live       → Enable the experience
9. Save                    → Experience config is added to the sitemap automatically
```

---

## Best Practices

1. **Preview with multiple profiles** — Test the experience against different individual IDs to validate that targeting rules work correctly for various audience segments
2. **Coordinate with developers** — Ensure templates align with response template fields before building experiences in the WPM
3. **Start with page types** — Use sitemap-defined page types for the WHEN configuration, rather than specific URLs, for more resilient experiences
4. **Use content zones** — Pre-define content zones in the sitemap for stable, consistent placement
5. **Name experiences clearly** — Use descriptive names that indicate the point, audience, and purpose (e.g., "Homepage Hero — VIP Customers — Spring Sale")
6. **Track engagement correctly** — Always configure engagement tracking on the second tab to ensure attribution data flows to the right DMO

---

**Previous:** [Web Templates (Transformers)](web-templates.md)

**Next:** [Mobile Implementation](../mobile-implementation.md) — Learn how to deliver personalized experiences in native mobile apps.
