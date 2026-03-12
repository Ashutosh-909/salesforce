# Personalization Decisions

A **decision** defines what personalized content a specific audience receives when a personalization point is requested. Each personalization point can have up to **25 decisions**, evaluated by priority to determine the winning response for each individual.

---

## Anatomy of a Decision

Every decision has four key components:

### 1. Priority

Each decision is assigned a **priority value** that determines evaluation order. Key facts:

- New decisions are automatically assigned the **lowest priority** (evaluated last)
- Priority can be adjusted from the related object list view on the personalization point
- When an individual qualifies for **multiple decisions**, the **highest priority qualifying decision** wins
- Personalization returns **only one decision response** per personalization point — it does not return responses for multiple decisions

### 2. Targeting Rules

Targeting rules are **optional** and determine **who is eligible** to receive a specific decision. If no rules are defined, any individual is eligible.

Rules can be written against:

| Rule Source | Examples |
|---|---|
| **Profile DG direct attributes** | `Unified Individual → Country = "US"` |
| **Profile DG related attributes** | `Contact Point Email → Email Domain contains "enterprise.com"` |
| **Calculated Insights** | `Total Lifetime Value > 500` |
| **Segment memberships** | `Member of "High Value Customers" segment` |
| **Contextual rules** | `Current page URL contains "/sale"`, `Device type = "mobile"` |

> **📝 Note:** Up to **50 conditions** can be added to a single decision's targeting rules.

### 3. Personalization Attributes

These are the **string entry text fields** defined by the [response template](response-templates.md). For Manual Content decisions, this is where business users type in the content values (header text, CTA text, image URLs, etc.). The values entered here are returned in the decision response for qualifying individuals.

### 4. Recommender

For decisions on personalization points of type **Recommendations**, you select a **recommender** that determines which items are returned. Available recommenders must:

- Be configured with the **same profile DG** as the personalization point
- Return items from the **same DMO** that the response template is configured against

---

## Creating a Decision — Step by Step

1. Navigate to the **Personalization** app → **Personalization Points**
2. Open the personalization point where you want to add a decision
3. In the **Decisions** section, click **New Decision**
4. Optionally configure **targeting rules** to restrict who qualifies
5. Fill in the **personalization attributes** (for Manual Content) or select a **recommender** (for Recommendations)
6. Save the decision
7. Adjust **priority** if needed from the personalization point's decision list view

---

## Multiple Decisions — Priority Evaluation

When a personalization point has multiple decisions, the evaluation follows a strict priority order:

```
Individual requests personalization point "home_hero"
│
├── Decision 1 (Priority: Highest) — Rules: "VIP Segment"
│   └── Does the individual qualify? → YES → Return this decision ✓
│                                    → NO  → Continue ↓
│
├── Decision 2 (Priority: Medium) — Rules: "New Customer Segment"
│   └── Does the individual qualify? → YES → Return this decision ✓
│                                    → NO  → Continue ↓
│
└── Decision 3 (Priority: Lowest) — Rules: None (default/fallback)
    └── All individuals qualify → Return this decision ✓
```

> **💡 Tip:** Always create a **lowest-priority decision with no targeting rules** as a fallback. This ensures every individual receives some personalized content, even if they don't qualify for higher-priority, more targeted decisions.

---

## Run-Time Decision Flow

When a personalization request reaches the decisioning pipeline, it passes through five stages:

### 1. Personalization Request
The request contains:
- An **individual ID** (anonymous or known)
- One or more **personalization point IDs**
- Optional **context data** (anchor item ID, page URL, category, etc.)

The Web SDK automatically sends context data required for any contextual rules configured on decisions or experiments.

### 2. Augmenting Phase
Personalization uses the individual ID to request the corresponding **profile data graph** from the Data Cloud profile API. If no profile exists, the individual is treated as a first-time anonymous visitor.

### 3. Qualifying Phase
For each personalization point in the request, the pipeline evaluates:
- **Experiments first** — Experiments are always the highest-priority item on a point
- Then **decisions by priority** — The highest-priority qualifying decision wins

### 4. Personalizing Phase
Once the qualifying decision (or experiment cohort) is determined:
- **Manual Content** — The text values from the decision are assembled into the response
- **Recommendations** — The profile DG is passed to the recommendations service alongside the recommender ID. The service generates personalized 1:1 recommendations based on the real-time profile.

### 5. Decision Response & Logging
The decision response is returned to the requesting application. Simultaneously, the decision is **logged in Data Cloud** in the personalization log. This logging is critical for analytics and attribution tracking.

---

## Targeting Rule Examples

### Segment-Based Targeting
> Show a premium product banner only to members of the "High Value Customers" segment.

| Condition | Operator | Value |
|---|---|---|
| Segment Membership: High Value Customers | equals | true |

### Attribute-Based Targeting
> Show a localized promotion to users in a specific region.

| Condition | Operator | Value |
|---|---|---|
| Unified Individual → Country | equals | United States |
| Unified Individual → State | is one of | CA, NY, TX |

### CI-Based Targeting
> Show a re-engagement offer to users who haven't purchased recently.

| Condition | Operator | Value |
|---|---|---|
| Days Since Last Purchase (CI) | greater than | 30 |

### Contextual Targeting
> Show a category-specific promotion only on category pages.

| Condition | Operator | Value |
|---|---|---|
| Current Page URL | contains | /category/outdoor |

---

## Best Practices

1. **Start with 2–3 decisions per point** — A targeted decision, a secondary audience, and a fallback
2. **Use contextual rules sparingly** — They add runtime evaluation overhead
3. **Test before going live** — Use the WPM preview to validate targeting against specific individuals
4. **Monitor blank responses** — If a point frequently returns empty responses, add a fallback decision with no targeting rules
5. **Coordinate with recommender filters** — Decision targeting rules determine *who* qualifies; recommender filters determine *which items* are returned. Make sure both are aligned.

---

**Next:** [Experiments](experiments.md) — Learn how to A/B test different decisioning strategies on a personalization point.
