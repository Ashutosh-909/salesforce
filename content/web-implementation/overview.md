# Web Campaign Configuration

This section covers the **personalization building blocks** you configure in the Salesforce Personalization application to deliver personalized web experiences. By the end of this section, you'll know how to set up every component needed to go from a configured Data Cloud environment to live personalized content on your website.

> **📝 Note:** Acronyms used in this section — **WPM** = Web Personalization Manager, **DG** = Data Graph, **DMO** = Data Model Object, **CI** = Calculated Insight, **CTA** = Call to Action.

---

## Prerequisites

Before you begin, make sure you've completed the following from the [Data Capturing & Modeling](../data-capturing-modeling/overview.md) section:

- **Salesforce Interactions SDK** is installed and capturing events on your website
- **Data streams** are deployed and mapping DLOs to DMOs
- **Identity Resolution** is configured and running
- **Profile Data Graph** (real-time) is built with engagement objects, segments, and CIs
- **Item Data Graph** (standard) is built for the items you plan to recommend (products, articles, etc.)

---

## The Building Blocks

Configuring a personalized web experience involves several interconnected components. Here's the order you'll work through them:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Personalization Building Blocks                   │
│                                                                     │
│   1. Personalization Types ─── Manual Content or Recommendations    │
│                                                                     │
│   2. Recommenders ─────────── Rules-Based or Objective-Based        │
│       ├── Engagement Signals                                        │
│       ├── Engagement Signal Metrics                                 │
│       └── Recommender Filters                                       │
│                                                                     │
│   3. Response Templates ───── Define what data is returned          │
│                                                                     │
│   4. Personalization Points ─ Where decisions are requested         │
│                                                                     │
│   5. Decisions ────────────── Who gets what (targeting + priority)   │
│                                                                     │
│   6. Experiments ──────────── A/B test different strategies          │
│                                                                     │
│   7. Web Templates ───────── Convert JSON responses to HTML         │
│                                                                     │
│   8. Web Personalization      Apply experiences to your website     │
│      Manager (WPM)            via a WYSIWYG tool                    │
└─────────────────────────────────────────────────────────────────────┘
```

> **💡 Tip:** You don't need all of these components for your first personalization experience. A simple **Manual Content** experience (like an infobar or banner) only requires a response template, a personalization point, a decision, and the WPM — no recommenders or item data graphs needed. Start simple and layer in recommendations later.

---

## Section Index

| Sub-Section | What You'll Learn |
|---|---|
| [Personalization Types](personalization-types.md) | The two types of personalization — Manual Content and Recommendations — and when to use each |
| [Recommenders](recommenders.md) | Rules-based and objective-based recommenders, engagement signals, metrics, filters, and training |
| [Response Templates](response-templates.md) | How to define the shape of data returned in a decision response |
| [Personalization Points](personalization-points.md) | Creating the decision endpoints that map to parts of your experience |
| [Decisions](decisions.md) | Configuring targeting rules, priority, and content for each personalization point |
| [Experiments](experiments.md) | Setting up A/B tests to compare different decisioning strategies |
| [Web Templates (Transformers)](web-templates.md) | Building Handlebars templates to convert JSON decision responses into HTML |
| [Web Personalization Manager](web-personalization-manager.md) | Using the WYSIWYG tool to apply personalization experiences to your website |

---

## Recommended Reading Order

For your first implementation, we recommend following the sub-sections in order from top to bottom. Each section builds on concepts introduced in the previous one. If you're looking to ship a quick win, jump directly to:

1. [Personalization Types](personalization-types.md) — understand the difference between Manual Content and Recommendations
2. [Response Templates](response-templates.md) — create a Manual Content response template
3. [Personalization Points](personalization-points.md) — create your first personalization point
4. [Decisions](decisions.md) — configure a decision with targeting rules
5. [Web Personalization Manager](web-personalization-manager.md) — apply the experience to your website

You can return to [Recommenders](recommenders.md), [Experiments](experiments.md), and [Web Templates](web-templates.md) when you're ready for ML-powered recommendations and A/B testing.
