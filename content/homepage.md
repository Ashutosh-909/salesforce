# Learn Salesforce Personalization — A Hands-On Implementation Guide

**A step-by-step guide for beginners to implement Salesforce Personalization from the ground up.** Whether you're a Salesforce admin, developer, or business analyst, this guide walks you through every stage — from Data Cloud setup to delivering personalized web and mobile experiences.

> **📝 Note:** This guide is based on documentation as of March 2026. Salesforce releases updates three times per year, so always verify against the [latest release notes](https://help.salesforce.com/s/articleView?id=release-notes.salesforce_release_notes.htm).

---

## What is Salesforce Personalization?

Salesforce Personalization (SP) is a **Customer 360 application** built on top of **Data Cloud**. It delivers personalized experiences — such as product recommendations, targeted banners, and custom content — across **web, mobile, email, and agentic channels**.

At its core, SP uses:

- **Real-time behavioral data** captured through the Salesforce Interactions SDK (Web SDK and Mobile SDK) to understand what individuals are doing right now.
- **Unified customer profiles** created through Data Cloud's Identity Resolution (IR), which stitches together anonymous and known interactions into a single view of each person.
- **Data Graphs** — pre-calculated views of Data Model Objects (DMOs) — that give the decisioning engine fast access to profile data, engagement history, segment memberships, and item catalogs.
- **Calculated Insights (CIs)** — multidimensional metrics computed over your data — that power rules-based recommendations and targeting logic.
- **Machine-learning-driven recommendations** that select the most relevant items for each individual based on configured business objectives (maximize revenue, maximize clicks, etc.).

### How Does It Work?

The personalization data flow follows five key steps:

1. **Ingest** — User interaction data is captured by the Salesforce Interactions SDK and sent to Data Cloud. Data flows into two processing layers simultaneously: a real-time layer for immediate processing and a standard layer for regular batch processing.
2. **Identify** — Data Cloud's Identity Resolution performs real-time matching to identify the user profile. If the user is unknown, a new anonymous profile is created.
3. **Update** — The known or anonymous profile in the real-time data graph is updated with the ingested engagement and profile event data.
4. **Compute** — Real-time insights and segments are calculated, and the real-time profile data graph is updated with metrics and segmentation results.
5. **Decide** — When a personalization decision is needed, the Personalization service calls the Data Cloud profile API to obtain the updated individual profile from the real-time profile data graph, evaluates targeting rules, and returns the winning decision.

---

## Salient Features

Salesforce Personalization provides a comprehensive set of capabilities for delivering relevant, individualized experiences. Here's what you can do with it:

### Real-Time Data Ingestion
Capture user behavior as it happens using the **Web SDK** (for websites) and **Mobile SDK** (for native iOS and Android apps). Every page view, product browse, cart action, and purchase is streamed into Data Cloud in real time.

### Unified Customer Profiles
**Identity Resolution** stitches together anonymous browsing sessions, email addresses, phone numbers, login credentials, and other identifiers to create a single, unified view of each individual — across channels and devices.

### Profile and Item Data Graphs
**Data Graphs** are pre-calculated views built from your Data Model Objects. A **Profile Data Graph** combines a unified individual with their engagement history, segment memberships, and calculated insights. An **Item Data Graph** organizes business objects — products, articles, events — so they can be used in recommendations.

### Manual Content and ML-Powered Recommendations
Two personalization types are available:
- **Manual Content** — Return static, targeted text or images (banners, infobars, pop-ups) without needing item data. Great for quick wins.
- **Recommendations** — Return dynamic, ML-driven item recommendations powered by recommenders. Recommenders come in two flavors:
  - **Rules-Based** — Driven by Calculated Insights (top sellers, most viewed, co-browse, co-buy).
  - **Objective-Based** — ML-driven, configured around business outcomes like maximizing revenue or clicks.

### Web Personalization Manager
The **Web Personalization Manager (WPM)** is a WYSIWYG, no-code experience builder. Append `?sf_personalization_wpm` to your website URL, and business users can visually add, configure, preview, and publish personalized experiences — without writing any code.

### Experimentation with A/B Testing
Test different decisioning strategies against each other using **Experiments**. Define primary and secondary metrics, create cohorts with customizable traffic allocations, optionally include a control group, and measure which approach performs best.

### Attribution Analytics and Pipeline Intelligence
Track and understand personalization performance with two analytics frameworks:
- **Pipeline Intelligence** — Operational metrics on the Personalization request pipeline: decision requests, personalization points served, unique individuals targeted.
- **Attribution Service** — Business metrics showing how visitor engagement with personalized content drives revenue, product orders, and other business outcomes.

### Decisioning API
Use the **Decisioning API** to request personalization decisions programmatically from any channel — server-side applications, headless commerce platforms, kiosks, or any system that can make REST API calls. Personalization as a Service.

### Batch Personalization
Generate personalized recommendations at scale on a schedule for offline channels — email campaigns, push notifications, CRM-driven next-best-action workflows — without requiring real-time decisioning.

### Agentforce Integration via Invocable Actions
Extend personalization into the **Agentforce** ecosystem using invocable actions:
- **Get Recommendations** — Inject individualized, ML-powered recommendations into agentic conversations.
- **Get Context** — Provide agents with the relevant customer data they need to address questions intelligently.

---

## What You'll Learn

This guide is organized into seven sections, each building on the previous one:

| Section | What You'll Do |
|---|---|
| **[Setup & Permissions](setup-permissions.md)** | Configure licenses, permission sets, deploy the Personalization datakit, and plan your implementation blueprint |
| **[Data Capturing & Modeling](data-capturing-modeling/overview.md)** | Install the Web and Mobile SDKs, build sitemaps, map data into Data Cloud, configure Identity Resolution, and create Data Graphs |
| **[Web Implementation](web-implementation/overview.md)** | Configure recommenders, response templates, personalization points, decisions, experiments, web templates, and the Web Personalization Manager |
| **[Mobile Implementation](mobile-implementation.md)** | Deliver personalized experiences in native iOS and Android apps |
| **[Personalization API](personalization-api.md)** | Use the Decisioning API for server-side and headless personalization |
| **[Experimentation](experimentation.md)** | Set up A/B tests, define metrics, allocate traffic, and analyze results |
| **[Batch Personalization](batch-personalization.md)** | Run personalization at scale for email, push, and offline channels |

---

## Ready to Get Started?

Begin with the fundamentals: set up your Salesforce org, assign the right permissions, and deploy the Personalization datakit.

**[Start Learning: Setup & Permissions →](setup-permissions.md)**

---

## Additional Resources

- [Salesforce Help: Personalization](https://help.salesforce.com/s/articleView?id=mktg.persnl_basics.htm)
- [Salesforce Help: Personalization and Data Cloud Setup](https://help.salesforce.com/s/articleView?id=mktg.persnl_setup.htm)
- [Salesforce Help: About Salesforce Data Cloud](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_cloud.htm)
- [Salesforce Help: Data Graphs](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm)
- [Salesforce Developer Docs: Personalization Overview](https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/overview.html)
