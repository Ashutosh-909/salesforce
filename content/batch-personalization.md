# Batch Personalization

Run personalization at scale outside of real-time decisioning. Batch personalization lets you generate personalized recommendations and content for large audiences on a schedule — ideal for email campaigns, push notifications, CRM-driven workflows, and other offline or asynchronous channels.

> **📝 Note:** Acronyms used in this section — **SP** = Salesforce Personalization, **DMO** = Data Model Object, **DG** = Data Graph, **CI** = Calculated Insight, **IR** = Identity Resolution, **IA** = Invocable Action, **WPM** = Web Personalization Manager.

---

## 1. What Is Batch Personalization?

Real-time personalization evaluates decisions at the moment a user interacts with your website or mobile app. **Batch personalization**, by contrast, generates personalized decisions for a set of individuals ahead of time — either on a recurring schedule or triggered by a specific event — so the results can be consumed by downstream systems.

Key differences from real-time personalization:

| Aspect | Real-Time | Batch |
|---|---|---|
| **When decisions run** | At the moment of interaction (sub-second) | On a schedule or triggered by a Flow |
| **Typical channels** | Web, mobile app | Email, push notifications, CRM workflows, agentic conversations |
| **Profile data source** | Hot-store (real-time profile data graph) | Lakehouse (standard data graph refresh cycle) |
| **Primary use case** | In-session experiences (banners, recommendations, pop-ups) | Pre-computed personalization for offline or asynchronous delivery |

> **💡 Tip:** Batch personalization complements real-time personalization — it extends the same personalization points and recommenders you've already configured to channels where a real-time round-trip isn't practical.

---

## 2. Use Cases

Batch personalization unlocks a wide range of scenarios where decisions need to be made ahead of time or at scale:

### Personalized Email Content

Generate individualized product recommendations or content for each recipient in an email campaign. For example:

- **"You may also like"** product recommendations in a weekly newsletter
- **Abandoned cart follow-up** emails with the specific products the customer left behind
- **Post-purchase cross-sell** emails recommending complementary items

> **📝 Note:** Personalization points created via the email builder in **Marketing Cloud Growth** or **Marketing Cloud Advanced** appear in the Personalization app with a source of **"CMS Content"**. These points use the same decisioning pipeline as web and mobile personalization.

### Pre-Computed Recommendations for Push Notifications

Mobile push notifications can include personalized product or content recommendations that were pre-computed via batch personalization. This avoids the latency of making a real-time API call at send time.

### CRM-Driven Next-Best-Action

Use batch personalization to feed personalized recommendations into CRM workflows — for example, surfacing the next-best-offer for a sales representative to discuss during a customer call. By pre-computing decisions, the recommendations are available instantly when the rep opens the account record.

### Agentforce Integration

Salesforce Personalization extends decisioning services into the **Agentforce** ecosystem through agent actions. Available actions include:

- **Get Recommendations:** Allows an agent to request a personalized decision configured in Salesforce Personalization and inject individualized, ML-powered relevance into the agentic conversation.
- **Get Context:** Personalization's context curation service ensures that your agent is always armed with the relevant data needed to address the customer's question.

> **💡 Tip:** Start with a simple batch use case — such as adding personalized product recommendations to a recurring email campaign — before tackling more complex scenarios like real-time Agentforce integrations.

---

## 3. Prerequisites

Before configuring batch personalization, ensure the following are in place:

| Prerequisite | Details |
|---|---|
| **Personalization point** | At least one personalization point must be created with decisions or experiments configured. See [Personalization Points](web-implementation/personalization-points.md) for setup steps. |
| **Recommender** (for Recommendations type) | A trained recommender (rules-based or objective-based) must be associated with the decisions on your personalization point. See [Recommenders](web-implementation/recommenders.md). |
| **Profile data graph** | A profile data graph (standard or real-time) must be configured and associated with the personalization point. Batch decisioning reads profile data from the **Lakehouse**, not the hot-store. See [Data Graphs](data-capturing-modeling/data-graphs.md). |
| **Item data graph** (for Recommendations type) | An item data graph must be configured for the DMO you want to recommend (e.g., Goods Product, Knowledge Article). See [Data Graphs](data-capturing-modeling/data-graphs.md). |
| **Identity resolution** | Your IR ruleset must be deployed so that unified individual records exist in the Lakehouse. See [DLO-DMO Mapping & IR](data-capturing-modeling/dlo-dmo-mapping-ir.md). |
| **Calculated insights** (for rules-based recommenders) | Any CIs powering your rules-based recommenders must be scheduled and refreshed. See [Calculated Insights](data-capturing-modeling/calculated-insights.md). |

> **⚠️ Important:** Batch personalization relies on profile data from the **Lakehouse** (not the real-time hot-store). This means profile data used for batch decisions reflects the most recent standard data graph refresh cycle (typically every 30 minutes) rather than sub-second real-time updates.

---

## 4. Personalization Points Across Channels

A key concept in Salesforce Personalization is that **personalization points are reusable across channels**. Any channel that can be configured to call the Personalization decisioning API can make a request against a personalization point. This means:

- The **same personalization point** you created for your website homepage recommendations can also be used in an email campaign, a mobile push notification, or an Agentforce conversation.
- **Channel-specific logic** (when to make the request, where to render, how to display) is handled by the consuming application — not by the personalization point itself.
- Each decision request requires an **individual ID** and one or more **personalization point IDs**. Context data (such as an anchor item ID) can be included for recommendations filtering.

### How the Decisioning Pipeline Works in Batch

The decisioning pipeline follows the same stages whether the request is real-time or batch:

1. **Personalization Request** — The request includes an individual ID and personalization point ID(s). Context data can optionally be provided.
2. **Augmenting Phase** — Personalization retrieves the individual's profile data graph from Data Cloud. For batch requests, this is read from the Lakehouse.
3. **Qualifying Phase** — The pipeline evaluates targeting rules on each decision to determine which decision the individual qualifies for. Experiments are treated as the highest-priority object on a personalization point.
4. **Personalizing Phase** — For manual content, the configured text/image values are returned. For recommendations, the profile is passed to the recommendations service to generate 1:1 personalized results.
5. **Decision Response** — The response is returned to the requesting application and logged to the personalization log in Data Cloud.

> **📝 Note:** Each decision made by personalization consumes **1 decision credit**. If a batch request includes 2 personalization points, that's 2 decision credits per individual.

---

## 5. Invocable Actions — Get Personalization Decision

The primary mechanism for triggering batch personalization is the **"Get Personalization Decision"** invocable action. This action can be used in **Salesforce Flow** and **Agentforce** to request a personalization decision programmatically for a specific individual.

### What Is an Invocable Action?

An invocable action (IA) is a reusable unit of logic that can be called from Flows, Process Builder, Agentforce agents, Apex, and the REST API. The **Get Personalization Decision** IA calls the Personalization decisioning pipeline and returns the decision response — just like a real-time request from the Web SDK, but triggered from server-side logic.

### When to Use the Invocable Action

| Scenario | Example |
|---|---|
| **Flow-triggered personalization** | A record-triggered Flow fires when a new Contact is created and requests personalized onboarding content |
| **Scheduled batch personalization** | A scheduled Flow runs nightly, iterates over a segment of customers, and requests product recommendations for each |
| **Agentforce agent** | An agent requests personalized recommendations during a customer conversation |
| **Apex-driven workflows** | Custom Apex code calls the IA to embed personalized decisions in a business process |

### Setting Up the Get Personalization Decision Invocable Action in Flow

Follow these steps to use the invocable action in a Salesforce Flow:

1. Navigate to **Setup** → **Flows** and create a new Flow (Auto-Launched or Scheduled, depending on your use case).
2. Add an **Action** element to your Flow canvas.
3. Search for and select the **"Get Personalization Decision"** invocable action.
4. Configure the input parameters:

| Parameter | Type | Description |
|---|---|---|
| **Individual ID** | String | The Unified Individual ID (from your identity resolution output) for the person to personalize for |
| **Personalization Point Name(s)** | String | The API name(s) of the personalization point(s) to evaluate |
| **Data Space Name** | String | The API name of the data space where the personalization point is configured |
| **Context Data** *(optional)* | String / JSON | Additional context for recommendation filtering (e.g., anchor item ID, category) |

5. Map the **output** of the action to Flow variables to capture the decision response.
6. Add downstream logic (e.g., send an email, update a record, call another service) that consumes the personalized decision data.
7. Activate the Flow.

```json
// Example: Decision response structure returned by the invocable action
{
  "personalizations": [
    {
      "personalizationPointId": "home_page_recs",
      "personalizationId": "0ppxx000000ABCDEF",
      "contentId": "decision_001",
      "data": {
        "recommendations": [
          {
            "itemId": "prod_12345",
            "name": "Running Shoes Pro",
            "imageUrl": "https://example.com/images/shoes-pro.jpg",
            "price": 129.99,
            "url": "/products/running-shoes-pro"
          },
          {
            "itemId": "prod_67890",
            "name": "Trail Running Jacket",
            "imageUrl": "https://example.com/images/trail-jacket.jpg",
            "price": 89.99,
            "url": "/products/trail-running-jacket"
          }
        ]
      }
    }
  ]
}
```

> **🔍 Needs Validation:** The exact parameter names and response structure for the Get Personalization Decision invocable action should be verified against the latest [Salesforce Personalization Invocable Actions documentation](https://developer.salesforce.com/docs/atlas.en-us.dc_personalization.meta/dc_personalization/dc-personalization-invocable-actions.htm). The structure shown above is representative and based on the standard decisioning response format.

> **⚠️ Important:** When using the invocable action in a scheduled Flow that iterates over a large number of records, be mindful of **decision credit consumption**. Each individual × personalization point combination consumes 1 decision credit. For example, a batch of 10,000 individuals with 2 personalization points = 20,000 decision credits.

---

## 6. Scheduled Batch Personalization with Flow

One of the most common batch personalization patterns is a **scheduled Flow** that runs on a recurring basis and generates personalized decisions for a target segment of customers.

### Example: Nightly Product Recommendations for Email

**Goal:** Every night at 8 PM, generate personalized product recommendations for all customers in the "Active Shoppers" segment, then store the results for the morning email send.

#### Step-by-Step Setup

1. **Create or confirm your segment** in Data Cloud:
   - Navigate to **Data Cloud** → **Segments**.
   - Create a segment called "Active Shoppers" targeting Unified Individuals who have browsed products in the last 30 days.
   
2. **Confirm your personalization point** has an active decision with a recommender:
   - Navigate to the **Personalization** app → **Personalization Points**.
   - Verify that your point (e.g., "Email Product Recs") has at least one active decision with a trained recommender.

3. **Create a Scheduled Flow:**
   - Navigate to **Setup** → **Flows** → **New Flow** → **Schedule-Triggered Flow**.
   - Set the schedule to run daily at 8:00 PM.
   - Add a **Get Records** element to retrieve Unified Individual records from the "Active Shoppers" segment.
   - Add a **Loop** element to iterate over each individual.
   - Inside the loop, add an **Action** element using the **"Get Personalization Decision"** invocable action.
     - Pass the individual's Unified Individual ID as the Individual ID input.
     - Pass the personalization point API name (e.g., `email_product_recs`).
   - After the action, add logic to store or route the decision response:
     - **Option A:** Update a custom object record with the recommendation data for later consumption by your email platform.
     - **Option B:** Use a **Send Email** action (if using Marketing Cloud on Core) to send the personalized email inline.
   - Activate the Flow.

> **💡 Tip:** For large audiences, consider breaking the batch into smaller segments to avoid hitting Flow governor limits and to manage decision credit consumption. You can also use **Batch Apex** to call the invocable action at scale, which provides better error handling and can process larger data volumes.

> **🔍 Needs Validation:** The specific interaction pattern between Scheduled Flows, the Get Personalization Decision invocable action, and Marketing Cloud email sends should be verified against the latest Salesforce documentation, as integration capabilities may vary by edition and release.

---

## 7. Marketing Cloud Integration

For customers using **Marketing Cloud Growth** or **Marketing Cloud Advanced** (both built on the Salesforce Platform with Data Cloud), personalization integrates directly into the email authoring experience.

### How It Works

1. When building an email in Marketing Cloud Growth or Advanced, use the email builder's **personalization component** to add a personalization block.
2. Behind the scenes, this creates a **personalization point** in the Personalization app with a source of **"CMS Content"**.
3. The email builder provides a visual interface for selecting:
   - The personalization point to use
   - The response template and decision configuration
   - Fallback content for recipients who don't qualify for any decision
4. At send time, the email system calls the Personalization decisioning pipeline for each recipient to generate individualized content.

> **📝 Note:** Profile data graph attributes from the root DMO (Unified Individual) are automatically available for **merge field personalization** in Marketing Cloud on Core. This means you can use profile attributes for both decisioning logic and email content personalization within the same email.

> **🔍 Needs Validation:** The specific email builder integration steps and available configuration options should be verified against the latest [Marketing Cloud Growth](https://help.salesforce.com/s/articleView?id=sf.mc_pers_personalization.htm) and [Marketing Cloud Advanced](https://help.salesforce.com/s/articleView?id=sf.mc_pers_personalization.htm) documentation, as these capabilities are evolving with each Salesforce release.

---

## 8. Output & Consumption

Batch personalization results can be consumed by downstream systems in several ways, depending on the integration pattern:

### Decision Response Storage

When using a Flow or Apex to call the Get Personalization Decision invocable action, the decision response is returned as a structured JSON object. You control where and how this data is stored:

| Storage Option | When to Use |
|---|---|
| **Custom object records** | Store recommendations per individual in a custom Salesforce object. Useful when downstream systems (email platforms, CRM UIs) read from Salesforce records. |
| **Platform events** | Publish decision responses as platform events for real-time consumption by subscriber systems. |
| **External systems** | Use an outbound HTTP callout (from Flow or Apex) to push decision data to external systems like a data warehouse, CDP, or custom application. |

### Decision Logging in Data Cloud

Regardless of how you consume the results, every decision made by the Personalization pipeline is **automatically logged** in Data Cloud's personalization log. This logging is critical for:

- **Attribution analytics** — Understanding which personalized experiences drive revenue and conversions.
- **Pipeline Intelligence dashboards** — Monitoring total personalization requests, unique individuals targeted, and decision distribution across personalization points.
- **Experiment analytics** — If the personalization point has an active experiment, batch decisions are included in experiment cohort analytics.

> **💡 Tip:** Even if you store decision results in a custom object for your email platform, the automatic decision logging in Data Cloud means you get attribution and analytics out of the box — no additional setup required.

---

## 9. Best Practices

### Manage Decision Credit Consumption

- **Segment-first approach:** Always target a specific segment of customers rather than running batch personalization against your entire customer base. Focus on individuals most likely to engage.
- **Limit personalization points per request:** Each personalization point in a request consumes a separate decision credit. Only request what you need.
- **Monitor usage:** Use the **Pipeline Intelligence dashboard** to track total personalization requests and unique individuals targeted over time.

### Optimize Data Freshness

- **Calculated Insight refresh:** For rules-based recommenders, the fastest automated refresh window for a batch CI is **1 hour**. If new items need to appear in recommendations quickly, consider manually triggering CI refreshes via Data Cloud APIs or Flow orchestration.
- **Item data graph refresh:** The standard NRT (near-real-time) data graph refresh cycle is **30 minutes**. New items added to a DMO will be available for rules-based recommender decisions after both a CI refresh and a DG refresh complete.
- **Recommender training:** Objective-based recommenders train on a **24-hour cycle**. New items require at least one training cycle to generate the embeddings needed for objective-based decisioning.

> **📝 Note:** For rules-based recommenders, you can set a Batch CI to **"No Schedule"** and use Data Cloud APIs or Flow to trigger the CI manually. This is useful when you need to orchestrate a CI refresh as soon as a new record arrives in the target DMO, rather than waiting for the next scheduled refresh window.

### Plan for Fallbacks

- **Fallback content:** Always configure fallback or default content on your personalization decisions for individuals who don't qualify for any targeting rules. This ensures every individual in your batch run receives some content rather than a blank response.
- **Error handling in Flow:** Add fault paths to your Flow to handle scenarios where the invocable action fails (e.g., the personalization point is misconfigured, the recommender hasn't trained, or the individual doesn't exist in the profile data graph).

### Security Considerations

- **Authenticated personalization points:** If your personalization point is marked as authentication required, batch requests via the invocable action must include proper credentials. The invocable action handles authentication within the Salesforce platform context, so this is typically seamless for server-side Flow execution.
- **Data access:** Ensure that the user running the scheduled Flow has the appropriate **Personalization** and **Data Cloud** permission sets assigned. See [Setup & Permissions](setup-permissions.md) for details.

> **🚨 Warning:** Never hardcode credentials or access tokens in Flow variables, Apex code, or custom metadata. Use Salesforce's **Named Credentials** for any external callouts, and rely on the platform's built-in authentication when calling invocable actions.

---

## 10. Putting It All Together — End-to-End Example

Here's a high-level walkthrough of setting up batch personalization for a weekly personalized email campaign:

### Scenario

You want to send a weekly email to customers in the "Loyalty Members" segment with personalized product recommendations based on their browsing and purchase history.

### Steps

1. **Data Foundation** (already in place):
   - Web SDK is capturing browse, cart, and purchase events → mapped to DMOs in Data Cloud.
   - Identity resolution is deployed → Unified Individual records exist.
   - Profile data graph includes engagement objects (Product Browse, Shopping Cart, Product Order).
   - Item data graph is configured for Goods Product with fields: name, image URL, price, product URL.
   - An objective-based recommender is trained and active.

2. **Create the Personalization Point:**
   - Navigate to the **Personalization** app → **Personalization Points** → **New**.
   - Select your data space, profile data graph, personalization type = **Recommendations**, and the appropriate response template.
   - Name it `loyalty_email_recs`.

3. **Add a Decision:**
   - On the `loyalty_email_recs` personalization point, add a decision.
   - Optionally add targeting rules (e.g., only target individuals with segment membership = "Loyalty Members").
   - Select your trained recommender.
   - Configure a fallback decision with top-selling products for individuals who don't qualify for the primary decision.

4. **Build the Scheduled Flow:**
   - Create a Schedule-Triggered Flow set to run weekly (e.g., every Monday at 6:00 AM).
   - Retrieve Unified Individual records from the "Loyalty Members" segment.
   - Loop through each individual and call the **Get Personalization Decision** IA with `loyalty_email_recs`.
   - Store each individual's recommendation results in a custom object (e.g., `Personalized_Email_Content__c`).

5. **Consume in Email Campaign:**
   - Your email platform (Marketing Cloud or other) reads from the `Personalized_Email_Content__c` records to populate each recipient's email with their personalized product recommendations.
   - Send the campaign.

6. **Measure Performance:**
   - Review the **Pipeline Intelligence dashboard** to see total batch decisions made.
   - Set up an **attribution model** to measure whether personalized email recipients convert at a higher rate than non-personalized recipients.
   - If you configured an experiment on the personalization point, review **experiment analytics** after the 24-hour data processing window.

---

## Summary

Batch personalization extends the power of Salesforce Personalization beyond real-time web and mobile experiences. By leveraging personalization points, the Decisioning API, invocable actions, and Salesforce Flow, you can deliver individualized recommendations and content through email, push notifications, CRM workflows, and Agentforce conversations.

| What You Learned | Where to Go Next |
|---|---|
| Batch vs. real-time personalization differences | [Personalization API](personalization-api.md) — for headless/server-side real-time requests |
| Invocable actions for Flow and Agentforce | [Personalization Points](web-implementation/personalization-points.md) — to create or modify points |
| Scheduled batch patterns with Flow | [Recommenders](web-implementation/recommenders.md) — to configure the recommender powering your decisions |
| Marketing Cloud email integration | [Experimentation](experimentation.md) — to A/B test your batch personalization strategies |
| Decision credit management | [Setup & Permissions](setup-permissions.md) — for permission set configuration |

> **🔍 Needs Validation:** This guide is based on documentation as of March 2026. Batch personalization capabilities, invocable action parameters, and Marketing Cloud integration options are actively evolving. Verify configuration details against the latest [Salesforce Personalization documentation](https://help.salesforce.com/s/articleView?id=sf.dc_personalization_overview.htm) and [release notes](https://help.salesforce.com/s/articleView?id=release-notes.salesforce_release_notes.htm).
