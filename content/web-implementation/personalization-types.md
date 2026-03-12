# Personalization Types

Salesforce Personalization supports two types of personalization that you can deliver on a website: **Manual Content** and **Recommendations**. Understanding the difference between these two types is the first step in designing your personalization strategy.

---

## Manual Content

Manual Content is the **simplest type of personalization** you can execute with Salesforce Personalization. It's ideal for getting started quickly and delivering targeted, rules-based experiences.

### How It Works

With Manual Content personalization, a business user defines string values directly on a personalization decision — things like CTA text, header text, image URLs, and subheadings. Whatever values they type in are stored on the decision definition and returned in the decision response at run-time for qualified individuals.

The fields available for text entry are defined by the **response template** associated with the personalization point (see [Response Templates](response-templates.md)).

### Common Use Cases

- **Banners with CTA** — Targeted hero banners with custom headlines and call-to-action buttons
- **Infobars** — Promotional bars at the top or bottom of a page (shipping offers, sale announcements)
- **Pop-ups** — Overlay modals triggered by scroll, exit intent, or time on page
- **Text replacement** — Swap headlines, descriptions, or button text based on audience segments

### Key Characteristics

| Characteristic | Detail |
|---|---|
| **Data source** | Content is stored on the decision definition itself — no Data Cloud DMO needed |
| **Complexity** | Low — no recommender, no item data graph required |
| **Targeting** | Rules-based, using profile data graph attributes, segments, CIs, or contextual rules |
| **Engagement tracking** | Tracked at the personalization point / decision level (not at the item level) |
| **Best for** | Quick wins early in your implementation lifecycle |

> **💡 Tip:** Manual Content use cases are excellent candidates for your first personalization experiences. Since they don't require a recommender or item DMOs configured in Data Cloud, you can deliver value quickly while the more complex data infrastructure for recommendations is being built out.

---

## Recommendations

Recommendations personalization is **dynamic and ML-driven**, capable of delivering 1:1 personalized item recommendations to each individual visitor.

### How It Works

With Recommendations, a business user selects a **recommender** on a personalization decision. The recommender is built against a profile data graph and an item data graph. At run-time, the recommender evaluates the individual's profile data, engagement history, and the item catalog to determine which items to return.

### Common Use Cases

- **Product recommendations** — "Recommended for you" carousels on homepage or product pages
- **Article recommendations** — "You might also like" sections on knowledge base or blog pages
- **Cross-sell / upsell** — Related product suggestions on cart or checkout pages
- **Similar items** — Products or articles similar to the one currently being viewed

### Key Characteristics

| Characteristic | Detail |
|---|---|
| **Data source** | Item data must exist in a Data Cloud DMO (product name, price, image URL, etc.) |
| **Complexity** | Higher — requires a recommender, item data graph, and profile data graph |
| **Targeting** | Can be personalized down to the 1:1 level via ML (objective-based recommenders) |
| **Engagement tracking** | Tracked at the item level — each recommended item gets a `personalizationContentId` |
| **Best for** | Dynamic, data-driven experiences after your data infrastructure is established |

> **⚠️ Important:** For recommendations to return content in a decision response, the item metadata must be available in a Data Cloud DMO. For example, to render product recommendations, you need product attributes like name, price, image URL, and purchase URL mapped to a DMO and included in an item data graph.

---

## Choosing the Right Type

Use the decision tree below to determine which personalization type fits your use case:

```
Is the content you want to show stored in a Data Cloud DMO?
│
├── NO → Use Manual Content
│   - Define the content directly on the decision
│   - Great for banners, infobars, pop-ups, text changes
│
└── YES → Do you want ML-driven 1:1 personalization?
    │
    ├── NO → Use Manual Content (with static rules)
    │   - You can still target specific audiences
    │   - Content is manually defined per decision
    │
    └── YES → Use Recommendations
        - Configure a recommender (rules-based or objective-based)
        - Build an item data graph for the item type
        - Dynamic, personalized results per individual
```

---

## Summary

| | Manual Content | Recommendations |
|---|---|---|
| **Content defined by** | Business user typing values on the decision | Recommender selecting items from an item data graph |
| **Item data graph required?** | No | Yes |
| **Recommender required?** | No | Yes |
| **Personalization level** | Segment-level (rules-based targeting) | 1:1 individual-level (with objective-based recommenders) |
| **Implementation complexity** | Low | Medium to High |
| **Speed to value** | Fast — can be set up in minutes | Slower — requires data infrastructure |
| **Example** | "Free shipping on orders over $50" infobar | "Recommended for You" product carousel |

---

**Next:** [Recommenders](recommenders.md) — Learn how to configure the engines that power personalized recommendations.
