# Personalization API (Decisioning API)

Salesforce Personalization exposes a **Decisioning API** that lets you request personalized content programmatically — from the Web SDK on a browser, from a native mobile app, or from a server-side integration. Whether you are rendering product recommendations on a single-page application, powering a headless commerce storefront, or driving personalized email content from a backend service, the Decisioning API is the single endpoint that evaluates an individual against your configured personalization points and returns the right content for the right person.

This section covers the API's request and response structure, authentication options, client-side and server-side usage patterns, diagnostics, and data space configuration.

> **📝 Note:** DLO = Data Lake Object · DMO = Data Model Object · DG = Data Graph · CI = Calculated Insight · WPM = Web Personalization Manager · SDK = Software Development Kit

---

## Prerequisites

Before you can request personalization decisions through the API, ensure the following are in place:

1. **At least one Personalization Point** is created with an active Decision or Experiment configured on it. A personalization point without a decision or experiment returns an empty response.
2. **A Profile Data Graph** is deployed and populated with individual profile data. The DG must have record caching enabled for real-time web personalization.
3. **Response Templates** are configured and applied to your personalization points so the API knows what shape of data to return.
4. **The Web SDK is installed** (for client-side usage) and initialized with `SalesforceInteractions.init()`.
5. **For recommendations use cases:** A Recommender is configured against the same Profile DG selected on the personalization point, and an Item Data Graph is built with the fields you want returned in the response.

> **💡 Tip:** You can start requesting personalization decisions as soon as you have a Manual Content personalization point with a decision configured — no recommender or item data graph required. This is the fastest path to delivering value.

---

## How the Decisioning Pipeline Works

When a personalization request hits the Decisioning API, it flows through four stages before a response is returned. Understanding this pipeline helps you debug issues and design effective personalization strategies.

### 1. Personalization Request

A request sent to the decisioning pipeline contains two key components:

- **Individual ID** — Identifies who is requesting personalization (e.g., a device ID for anonymous visitors, a unified individual ID for known users).
- **One or more Personalization Point IDs** — The named points you want decisions for (e.g., `"home_recommendations"`, `"home_hero"`).
- **Context data** *(optional)* — Additional data for recommendation filtering, such as an anchor item ID for "similar items" recommendations. The Web SDK automatically sends context data required by any contextual rules configured on the point's decisions or experiments.

### 2. Augmenting Phase

Personalization takes the individual ID from the request and calls the Data Cloud Profile API to retrieve the corresponding **Profile Data Graph**. The profile DG returned is the one configured on the personalization point.

- If a profile exists, its full real-time data (engagement history, segment memberships, calculated insights) is available for targeting and recommendation generation.
- If **no profile exists**, the individual is treated as a **first-time anonymous visitor**.

> **⚠️ Important:** Personalization assumes that all personalization points included in a single request use the **same Profile Data Graph**. If one of the points references a different DG than a point listed earlier in the request, it will be skipped.

### 3. Qualifying Phase

Using the profile data retrieved from Data Cloud, personalization evaluates each personalization point and determines which decision or experiment cohort the individual qualifies for.

- **Experiments are treated as the highest priority** on a personalization point. The individual is evaluated against the experiment first before any decisions.
- Only **one** cohort or decision is returned per personalization point — the highest-priority qualifying match.

### 4. Personalizing Phase

Once the qualifying cohort or decision is selected, the actual decision content is generated:

- **Manual Content:** The text values entered on the decision (e.g., CTA text, header text, image URL) are collected and returned directly.
- **Recommendations:** The Profile DG is passed to the Recommendations Service alongside the recommender ID selected on the decision/cohort. The service generates **personalized, 1:1 recommendations** based on the real-time understanding of the individual.

### 5. Decision Response & Logging

Personalization returns the decision response to the requesting application and simultaneously **logs the decision** in Data Cloud's personalization log. This decision logging is critical for:

- **Attribution analytics** — measuring what personalization is driving
- **Pipeline Intelligence dashboards** — tracking decision volume and performance
- **Experimentation** — recording which cohort an individual was assigned to

> **📝 Note:** For each decision that personalization makes, **1 decision credit is consumed**. If a request includes 1 personalization point, that is 1 credit. If a request includes 2 personalization points, that is 2 credits. Plan your credit consumption accordingly.

---

## Fetching Personalization via the Web SDK

The most common way to request personalization on a website is through the `SalesforceInteractions` Web SDK. The SDK's `Personalization` module provides a `fetch` method that calls the Decisioning API client-side.

### Basic Fetch Example

```javascript
SalesforceInteractions.Personalization.fetch(["home_recommendations", "home_hero"])
  .then((personalizationResponse) => {
    // Custom logic to render personalization on the website
    console.log("Personalization Response", personalizationResponse);
  });
```

**How it works:**

1. The `fetch` method accepts an **array of personalization point names** as its parameter.
2. It returns a **Promise**. When the Promise resolves, the callback function receives the full personalization response.
3. Inside the callback, you implement your own rendering logic — updating DOM elements, populating a recommendations carousel, showing a banner, etc.

> **💡 Tip:** When using the Web Personalization Manager (WPM) to configure experiences, you typically don't call `fetch` manually. WPM automatically creates the sitemap configuration that triggers fetch calls and renders responses using your configured templates. Use manual `fetch` calls when you need full control over the rendering process or are integrating with a modern frontend framework.

### Fetching in Modern Frameworks (React, Vue, Angular)

For single-page applications built with React, Vue, Angular, or similar frameworks, use the **Content Zone Handler** API instead of relying on WPM's DOM-based rendering. This gives your framework full control over rendering lifecycle.

```javascript
SalesforceInteractions.ContentZoneHandler.set({
  contentZoneName: "home_recs_zone",
  callback: (response) => {
    // Use your framework's state management to render the response
    // React example: setState, Redux dispatch, etc.
    // Vue example: reactive data update
    // Angular example: Observable emission
    renderRecommendations(response);
  }
});
```

> **📝 Note:** Content Zone Handlers are registered in your sitemap and fire whenever a personalization response is returned for the named content zone. See [Web Templates](web-implementation/web-templates.md) for details on transformer-based rendering.

---

## Configuring the Data Space

If your Salesforce org has **more than one data space**, you must specify which data space to use when initializing the SDK. If you don't specify one, the `fetch` method uses the `default` data space.

```javascript
SalesforceInteractions.init({
  consents: [],
  personalization: {
    dataspace: "personalizationDemo",
  },
});
```

> **⚠️ Important:** You **cannot mix personalization points from multiple data spaces** on a single website. All points requested in a single page load must belong to the same data space. If you don't see any personalization points listed in WPM, verify that your sitemap has the correct data space information configured.

---

## Authenticated Requests

By default, personalization requests from the Web SDK are **anonymous** — the individual is identified by a device ID managed by the SDK. However, for sensitive personalization use cases, you can mark a personalization point as requiring authentication.

### When to Use Authenticated Requests

- **Logged-in user experiences** where the personalization content is sensitive or user-specific (e.g., account-specific offers, loyalty tier content)
- **Server-side integrations** where you want to ensure only authorized systems can request decisions
- **Compliance requirements** where you need to verify the caller's identity before returning personalized content

### Configuring Authentication on a Personalization Point

1. Navigate to the **Personalization** app in Salesforce Setup.
2. Open or create a **Personalization Point**.
3. In the configuration modal, enable the **Authentication Required** option.
4. Save the personalization point.

Once enabled, any request against this point must go through personalization's **authenticated Decisioning API** with proper OAuth credentials.

### Server-Side Authentication Flow

For server-side integrations, use the standard Salesforce **OAuth 2.0 token flow** to obtain an access token:

1. **Create a Connected App** in your Salesforce org with the appropriate OAuth scopes.
2. **Request an access token** using the OAuth 2.0 client credentials flow or JWT bearer flow.
3. **Include the access token** in the `Authorization` header of your API request.

```bash
# Example: Obtain an access token via client credentials flow
curl -X POST https://login.salesforce.com/services/oauth2/token \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CONNECTED_APP_CLIENT_ID" \
  -d "client_secret=YOUR_CONNECTED_APP_CLIENT_SECRET"
```

> **🚨 Warning:** Never hardcode client secrets or access tokens in client-side code. Store credentials securely in environment variables or a secrets manager. Rotate credentials regularly and use the principle of least privilege when configuring Connected App permissions.

> **🔍 Needs Validation:** The specific OAuth scopes required for the authenticated Decisioning API and the exact REST endpoint URL should be verified against the latest Salesforce Personalization API documentation, as these may evolve across releases.

---

## Server-Side API Requests

For headless implementations, backend services, or any integration outside of the Web SDK, you can call the Decisioning API directly via REST.

### Request Format

Send a POST request to the Decisioning API endpoint with the following structure:

```json
{
  "individualId": "ba8f56683e2ca01c",
  "personalizationPoints": [
    {
      "name": "home_recommendations"
    },
    {
      "name": "home_hero"
    }
  ],
  "contextData": {
    "anchorItemId": "6010042"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `individualId` | String | Yes | The unique identifier for the individual (device ID, unified individual ID, or other configured identifier) |
| `personalizationPoints` | Array | Yes | Array of objects, each with a `name` field matching a configured personalization point name |
| `contextData` | Object | No | Optional key-value pairs for recommendation filtering (e.g., anchor item ID, category) |

### Including Authentication

For authenticated personalization points, include the OAuth access token in the request header:

```bash
curl -X POST https://<your-instance>.salesforce.com/services/data/personalization/decisioning \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "individualId": "ba8f56683e2ca01c",
    "personalizationPoints": [
      { "name": "home_recommendations" }
    ]
  }'
```

> **🔍 Needs Validation:** The exact REST API endpoint path for the Decisioning API should be verified against the latest Salesforce Personalization API reference documentation. The endpoint structure shown above is illustrative and may differ in your org.

---

## Response Structure

The Decisioning API returns a `personalizations` array, with one entry per requested personalization point that returned a qualifying decision.

### Example Response

```json
{
  "personalizations": [
    {
      "personalizationId": "96c4a971-71f5-4779-a82d-2c72dfa964fe",
      "requestId": "c73e348d-3336-4ed4-90f5-c3ed63280e10",
      "individualId": "ba8f56683e2ca01c",
      "dataSpace": "default",
      "personalizationPointId": "9ppSG00000004I9YAI",
      "personalizationPointName": "home_recommendations",
      "dmoName": "ssot__GoodsProduct__dlm",
      "data": [
        {
          "ssot__IsSellable__c": "Y",
          "ssot__BrandId__c": "NTO",
          "ssot__Id__c": "6010042",
          "ssot__DataSourceId__c": "nto_product_data",
          "ImageUrl__c": "https://www.northerntrailoutfitters.com/dw/image/v2/BDPX_PRD/on/demandware.static/-/Sites-nto-alpine-nutrition/default/dwf19b5e9c/images/hi-res/go-brew.jpg",
          "personalizationContentId": "96c4a971-71f5-4779-a82d-2c72dfa964fe:0",
          "PurchaseUrl__c": "https://www.northerntrailoutfitters.com/default/gobrew-connected-coffee-machine-6010042.html",
          "ssot__PrimaryProductCategory__c": "Coffee Machines",
          "ssot__Name__c": "GoBrew Connected Coffee Machine",
          "ssot__ProductSKU__c": "6010042",
          "GoodsProductSales__cio": "[{TotalSoldUnits__c=43.0, ProductId__c=6010042}]"
        }
      ]
    }
  ]
}
```

### Response Fields

| Field | Description |
|-------|-------------|
| `personalizationId` | Unique identifier for this specific personalization decision instance |
| `requestId` | Unique identifier for the overall API request |
| `individualId` | The individual ID from the request |
| `dataSpace` | The data space that served the decision |
| `personalizationPointId` | The Salesforce record ID of the personalization point |
| `personalizationPointName` | The developer-friendly name of the personalization point |
| `dmoName` | The API name of the DMO (Data Model Object) the recommended items belong to (for Recommendations type) |
| `data` | Array of recommended items or manual content attributes. Each item contains the fields selected on the Response Template |
| `personalizationContentId` | A unique identifier for each piece of content, used for engagement tracking (impressions, clicks) |

> **💡 Tip:** The fields returned in the `data` array are determined by two configurations: the **Response Template** applied to the personalization point and the **Item Data Graph** definition. A field must be selected on **both** the response template AND the item data graph to appear in the response.

### Empty Responses

A personalization point can return a **blank decision response** if:

- The individual does not qualify for any experiments or decisions configured on the point (due to targeting rules)
- A recommendations-based decision has no items to return (e.g., all items filtered out)
- The personalization point has no active decision or experiment

Handle empty responses gracefully in your rendering logic — either show a default fallback experience or hide the content zone.

---

## Pipeline Diagnostics

When personalization decisions are returning unexpected results — empty responses, wrong content, or missing recommendation items — use these diagnostic approaches to identify the root cause.

### 1. Verify the Profile Data Graph

The first step is to ensure the individual's profile data is reaching the real-time Profile Data Graph correctly.

**Using Data Explorer:**

1. Navigate to **Data Cloud** → **Data Explorer**.
2. Select the **Profile Data Graph** object.
3. Search for the individual by their ID.
4. Review the JSON output, which shows profile versions in two views:
   - **Hot-store (RT view):** Real-time data for individuals currently in an active session
   - **Lakehouse (NRT view):** Near real-time data from the most recent data graph refresh

> **⚠️ Important:** When debugging real-time events, ensure the Real-Time View toggle is set to **"On"** in Data Explorer. Otherwise you may be looking at stale lakehouse data and assume events are not arriving.

**Using a Data Graph Lookup Flow:**

For a more structured debugging approach, create a Screen Flow or auto-launched flow that invokes the **"Data Cloud Get Data Graph By Lookup"** invocable action:

1. Create a new flow with the developer name `LookupDataGraph`.
2. Add three **Input Parameters** (all String type):
   - `DataGraphAPIName` — API name of the profile data graph
   - `DataspaceAPIName` — API name of the data space
   - `LookupKey` — The lookup key in the format `.SourceRecordId__c=<value>`
3. Add one **Output Parameter** (String type):
   - `OutputDataGraph` — The returned data graph JSON
4. Add an **Action** element that invokes "Data Cloud Get Data Graph By Lookup", mapping the input/output parameters.
5. **To test:** Run the flow in debug mode and enter different individual IDs to inspect their profile data graphs.

### 2. Check Recommender Training Status

If recommendations are coming back empty, the recommender may not have completed its training cycle.

1. Open the **Personalization** app and navigate to your Recommender.
2. Click the **Refresh History** tab on the recommender detail page.
3. Verify that training has completed successfully.

Key training requirements:

| Factor | Detail |
|--------|--------|
| **Minimum data** | At least **3 engagement rows** across the referenced engagement objects are required for an objective-based recommender to train |
| **Training cadence** | Every **24 hours** (independent per recommender, not a global schedule) |
| **New items (Rules-Based)** | Available as soon as they enter the item index — CI refresh (fastest: 1 hour) + Item DG refresh (fastest: 30 minutes) |
| **New items (Objective-Based)** | Require **1 full training cycle** after the item enters the index (up to 24 hours) |
| **Incremental updates** | Reflected via the **15-minute index update job** (e.g., a price change from $50 to $45) |

### 3. Review Targeting Rules and Filters

If an individual is not qualifying for any decisions:

- Open the personalization point and check each decision's **targeting rules**
- Verify the individual's profile data graph contains the attributes used in targeting (segment memberships, CIs, profile fields)
- Check that **recommender filters** (decision context, static, profile DG filters) are not overly restrictive — removing all eligible items

> **💡 Tip:** Start with broad targeting rules and permissive filters to confirm the pipeline works end-to-end, then progressively tighten them once you've verified responses are flowing correctly.

### 4. Verify Decision and Experiment Configuration

- Ensure the personalization point has at least one active **Decision** or **Experiment** applied.
- If an experiment is active, remember it is treated as the **highest priority** — it will intercept traffic before any decisions are evaluated. If the experiment has narrow targeting rules, most individuals fall through to underlying decisions.
- Check that the decision's **response template** matches the personalization type (Manual Content vs. Recommendations).

### 5. Credit Consumption Check

If decisions are being returned but you suspect silent failures, review your **decision credit consumption** in the Personalization setup page to ensure credits are being consumed as expected (1 credit per personalization point per request).

---

## Rendering Personalization Responses

Once you receive a response from the Decisioning API, how you render it depends on your implementation approach.

### Using Web Templates (Transformers)

If you have configured **Handlebars transformers** in your sitemap, the Web SDK's Personalization module automatically converts the JSON response into HTML and injects it into the corresponding **content zone** on the page. See [Web Templates](web-implementation/web-templates.md) for details.

### Using WPM (No-Code)

The **Web Personalization Manager** handles the full lifecycle — requesting, rendering, and engagement tracking — through a WYSIWYG interface. Business users configure everything visually without writing code. See [Web Personalization Manager](web-implementation/web-personalization-manager.md) for details.

### Manual Rendering (Custom Code)

For full control, use the `fetch` method and write your own rendering logic:

```javascript
SalesforceInteractions.Personalization.fetch(["home_recommendations"])
  .then((response) => {
    const personalizations = response.personalizations;

    personalizations.forEach((personalization) => {
      const pointName = personalization.personalizationPointName;
      const items = personalization.data;

      if (pointName === "home_recommendations" && items.length > 0) {
        const container = document.getElementById("recs-container");

        items.forEach((item) => {
          const card = document.createElement("div");
          card.className = "recommendation-card";
          card.innerHTML = `
            <img src="${item.ImageUrl__c}" alt="${item.ssot__Name__c}" />
            <h3>${item.ssot__Name__c}</h3>
            <p>${item.ssot__PrimaryProductCategory__c}</p>
            <a href="${item.PurchaseUrl__c}">Shop Now</a>
          `;
          container.appendChild(card);
        });
      }
    });
  });
```

> **📝 Note:** When rendering manually, you are responsible for sending **engagement tracking events** (impressions, clicks) back to the SDK so that personalization analytics and attribution can function. See [Web Data Capturing](data-capturing-modeling/web-data-capturing.md) for details on engagement event tracking.

---

## Engagement Tracking for API-Driven Personalization

For personalization analytics, attribution, and experiment measurement to work correctly, you must track two types of engagement events when rendering decisions:

1. **Impression** — Fired when a personalized experience is displayed to the user. Include the `personalizationId` and `personalizationContentId` from the response.
2. **Click** — Fired when the user interacts with the personalized content (clicks a recommendation, clicks a CTA). Include the same identifiers.

These identifiers link user interactions back to the specific decision that was served, enabling:

- **Attribution analytics** — Understanding which personalization experiences drive conversions
- **Experiment measurement** — Comparing cohort performance in A/B tests
- **Pipeline Intelligence dashboards** — Tracking overall personalization effectiveness

> **⚠️ Important:** If you skip engagement tracking, you will still receive personalization decisions, but you will have **no visibility into their effectiveness**. Always implement impression and click tracking for production deployments.

---

## Summary

| Topic | Key Takeaway |
|-------|-------------|
| **Pipeline Flow** | Request → Augment (fetch profile DG) → Qualify (match decision/experiment) → Personalize (generate content) → Respond & Log |
| **Client-Side Fetch** | Use `SalesforceInteractions.Personalization.fetch(["point_name"])` — returns a Promise with the decision response |
| **Data Space** | Configure in `SalesforceInteractions.init()` under `personalization.dataspace`; cannot mix data spaces on one site |
| **Authentication** | Mark points as "Authentication Required"; use OAuth 2.0 for server-side requests; never expose secrets client-side |
| **Response Shape** | `personalizations[]` array with `personalizationId`, `personalizationPointName`, `dmoName`, and `data[]` containing item fields |
| **Credits** | 1 decision credit per personalization point per request |
| **Diagnostics** | Check Profile DG in Data Explorer, verify recommender training, review targeting rules and filters, confirm decision/experiment config |
| **Engagement Tracking** | Always track impressions and clicks with `personalizationId` and `personalizationContentId` for attribution and analytics |

---

## Learn More

- [Request Personalization Through the Sitemap](https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/request-personalization-through-sitemap.html) — Official Salesforce Developer documentation on the `Personalization.fetch()` method
- [Personalization Points](https://help.salesforce.com/s/articleView?id=sf.mc_perso_personalization_point.htm) — Salesforce Help article on creating and configuring personalization points
- [Decisioning API](https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/decisioning-api.html) — Official API reference documentation

> **🔍 Needs Validation:** The "Learn More" links above are based on known Salesforce documentation URL patterns as of March 2026. Verify these URLs are current, as Salesforce periodically reorganizes its documentation structure.

---

*Next: [Experimentation](experimentation.md) — Learn how to set up A/B tests on your personalization points.*

*Previous: [Mobile Implementation](mobile-implementation.md) — Delivering personalized experiences in native mobile apps.*
