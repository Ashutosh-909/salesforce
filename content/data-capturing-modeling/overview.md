# Data Capturing & Modeling

This section covers the full data pipeline that powers Salesforce Personalization — from capturing user interactions on your website or mobile app, through data ingestion and modeling in Data Cloud, to building the unified profiles and item catalogs that the decisioning engine uses at run-time.

> **📝 Note:** Acronyms used in this section — **SDK** = Software Development Kit, **DLO** = Data Lake Object, **DMO** = Data Model Object, **IR** = Identity Resolution, **CI** = Calculated Insight, **DG** = Data Graph, **WPM** = Web Personalization Manager.

---

## The Data Pipeline at a Glance

The diagram below shows how data flows from user interactions to personalized decisions:

```
Website / Mobile App
        │
        ▼
  Salesforce Interactions SDK
  (captures events in real-time)
        │
        ▼
  Data Cloud — Ingestion Layer
  (events land in Data Lake Objects)
        │
        ▼
  Data Stream Mapping
  (DLOs mapped to Data Model Objects)
        │
        ▼
  Identity Resolution
  (anonymous + known profiles → Unified Individual)
        │
        ▼
  Data Graphs
  ┌─────────────────┐    ┌─────────────────┐
  │  Profile DG      │    │   Item DG        │
  │  (Real-Time)     │    │   (Standard)     │
  │  - Unified       │    │   - Products     │
  │    Individual    │    │   - Articles     │
  │  - Engagements   │    │   - Offers       │
  │  - Segments      │    │   - CIs          │
  │  - CIs           │    │                  │
  └─────────────────┘    └─────────────────┘
        │                        │
        └────────┬───────────────┘
                 ▼
        Personalization Decisioning
        (targeting, recommendations, experiments)
```

### Data Flow in Five Steps

1. **Ingest** — The Salesforce Interactions SDK captures user interaction data from your website or mobile app and sends it to Data Cloud. Data flows simultaneously into a **real-time layer** (for immediate processing) and a **standard layer** (for regular batch processing).
2. **Model** — Events land in Data Lake Objects (DLOs) and are mapped to Data Model Objects (DMOs) within a Data Cloud data space. DMOs are the structured representation of your data — engagement events, profile attributes, and item metadata.
3. **Resolve** — Data Cloud's Identity Resolution performs real-time matching to stitch together anonymous and known profiles into a single **Unified Individual**. If a user is unknown, an anonymous profile is created.
4. **Graph** — Data Graphs combine DMOs into pre-calculated views optimized for fast access. A **Profile Data Graph** provides the unified understanding of a person, while an **Item Data Graph** organizes business objects (products, articles) for recommendations.
5. **Enrich** — Calculated Insights (CIs) compute multidimensional metrics over your data and are added to data graphs. CIs power rules-based recommender strategies and enable advanced targeting logic.

---

## What You'll Learn in This Section

This section is divided into five sub-topics, each building on the previous one:

| Sub-Section | What It Covers |
|---|---|
| [Web Data Capturing](web-data-capturing.md) | Create a website connector, install the Interactions SDK, build a sitemap, configure a web schema, deploy data streams, and map DLOs to DMOs |
| [Mobile Data Capturing](mobile-data-capturing.md) | Create a mobile app connector, integrate the iOS and Android SDKs, configure mobile event tracking, and deploy mobile data streams |
| [DLO-DMO Mapping & Identity Resolution](dlo-dmo-mapping-ir.md) | Understand the relationship between DLOs and DMOs, take a progressive approach to mapping, and configure an Identity Resolution strategy for real-time profile unification |
| [Data Graphs](data-graphs.md) | Build Profile Data Graphs (real-time) and Item Data Graphs (standard), configure caching, understand refresh cycles, and debug data using Data Explorer |
| [Calculated Insights](calculated-insights.md) | Create CIs for rules-based recommender strategies, targeting, and filtering, and add them to your data graphs |

---

## Prerequisites

Before starting this section, make sure you've completed the steps in [Setup & Permissions](../setup-permissions.md):

- [ ] Licenses verified (Data Cloud + Personalization)
- [ ] Permission sets assigned (Personalization Admin + Data Cloud Admin)
- [ ] Personalization datakit deployed
- [ ] Data space configured
- [ ] Implementation blueprint created (target website identified, use cases listed, data requirements mapped)

---

## Where to Start

If you're implementing a **web-first** approach (recommended for most implementations), start with [Web Data Capturing](web-data-capturing.md). This is the most common starting point and covers the end-to-end process of getting real-time behavioral data flowing from your website into Data Cloud.

If you need to capture data from a **mobile app**, proceed to [Mobile Data Capturing](mobile-data-capturing.md) after completing the web setup (or in parallel if you have dedicated mobile development resources).

Once data is flowing, move on to [DLO-DMO Mapping & Identity Resolution](dlo-dmo-mapping-ir.md) to structure your data and unify customer identities, then to [Data Graphs](data-graphs.md) and [Calculated Insights](calculated-insights.md) to prepare the data views that the Personalization decisioning engine consumes.

---

**[← Previous: Setup & Permissions](../setup-permissions.md)** | **[Next: Web Data Capturing →](web-data-capturing.md)**
