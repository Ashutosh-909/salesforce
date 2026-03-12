# Recommenders

Recommenders are the engines that power **Recommendations** personalization. They combine an understanding of a person (via a profile data graph) with an understanding of business items (via an item data graph) to determine **which items** should be returned in a decision response.

This page covers the two recommender strategies, their supporting components (engagement signals, metrics, filters), and how recommender training works.

> **📝 Note:** Recommenders can be built against any item data graph configured in your Data Cloud org. See [Data Graphs](../data-capturing-modeling/data-graphs.md) for details on setting up item and profile data graphs.

---

## Recommender Types at a Glance

| | Rules-Based | Objective-Based |
|---|---|---|
| **Powered by** | Calculated Insights (CIs) | Machine Learning |
| **Personalization level** | Segment or global (same items for similar users) | 1:1 individual-level |
| **Setup complexity** | Lower — requires a CI | Higher — requires engagement signals, metrics, and training data |
| **Training** | No ML training — uses CI sort order | 24-hour automated training cycle |
| **Best for** | Top sellers, most viewed, co-browse, co-buy | Maximize revenue, maximize clicks, custom objectives |

---

## Rules-Based Recommenders

Rules-based recommenders use **Data Cloud Calculated Insights** to determine which items to show. There is no machine learning involved — items are selected and ranked based on the CI's computed values.

### How They Work

A CI computes a metric (a date or integer value) for each item in your item data graph. The recommender uses these values to sort and select items for the decision response.

### Common Examples

| CI Strategy | What It Returns |
|---|---|
| **Top Selling Products** | Products with the highest total sales units |
| **Most Clicked Articles** | Articles with the highest click counts |
| **Most Recently Published** | Items sorted by publication date |
| **Co-Browse** | Items frequently browsed together with the current item |
| **Co-Buy** | Items frequently purchased together with the current item |

### Key Requirements

- The CI must have **at least one dimension** that matches the primary key of the root DMO of your item data graph. This ensures the CI can be added to the DG definition.
- The CI must be **added to the item data graph** for it to be available to the recommender.

> **💡 Tip:** Any business requirement that you can express as a measure on a CI — outputting a date or integer value for sorting — and that is available on your item data graph can power a rules-based recommendations decision.

---

## Objective-Based Recommenders

Objective-based recommenders use **machine learning** to optimize recommendations at the 1:1 individual level based on a desired business outcome. Instead of selecting items from a pre-sorted list, the ML model learns which items are most likely to drive the configured objective for each individual person.

### The Philosophy

Traditional personalization platforms require users to choose from a list of algorithms (collaborative filtering, similar items, etc.). Salesforce Personalization flips this by letting business users focus on the **outcome** they want to achieve. The model handles algorithm selection internally, reducing the cognitive load required to execute a use case.

### Out-of-the-Box Objectives

Salesforce Personalization ships with two built-in objectives:

| Objective | Target DMO | What It Optimizes |
|---|---|---|
| **Maximize Revenue** | Goods Product | Maximizes the revenue generated from product recommendations |
| **Maximize Clicks** | Knowledge Article Version | Maximizes the click-through rate on article recommendations |

### Custom Objectives

Beyond the built-in options, you can configure **custom objectives** tailored to your business. A custom objective is composed of three parts:

1. **Engagement Signals** — Named event definitions (covered below)
2. **Engagement Signal Metric** — A measurable value derived from the signal (covered below)
3. **Direction** — Whether the model should **maximize** or **minimize** the metric

---

## Engagement Signals

An engagement signal is a **named event definition** configured against a Data Cloud engagement DMO. It represents an occurrence of a row being added to that engagement DMO — optionally meeting certain filter conditions.

### Example

Consider the Sales Order Product engagement DMO:

- **Signal: "Purchase"** — Increments every time a new row is added (a purchase occurred)
- **Signal: "Nike Purchase"** — Same as above, but with a filter condition: only counts purchases where the brand is "Nike"

### Where Engagement Signals Are Used

Engagement signals are a foundational building block used in multiple contexts:

| Context | How Signals Are Used |
|---|---|
| **Custom Objective Recommenders** | Signals act as the foundation for engagement signal metrics. They also serve as additional training data inputs for the ML model. |
| **Automation Event-Triggered Flows** | Trigger a Flow based on an engagement signal being recorded. Real-time automation flows are triggered off of signals defined against engagement objects on a real-time Profile Data Graph. |
| **Attribution Modeling** | Signals and their metrics power attribution analysis to measure personalization lift and effectiveness. |

> **⚠️ Important:** When configuring an engagement signal for use in a recommender, make sure a value is defined for the **item ID**. This ensures the model can understand which item a person is interacting with when an engagement is logged.

### Configuration Reference

Detailed documentation on engagement signal configuration is available in the [Salesforce Help: Engagement Signals](https://help.salesforce.com/s/articleView?id=sf.persnl_engagement_signals.htm).

---

## Engagement Signal Metrics

Once you create an engagement signal, a **default count metric** is automatically generated. You can create additional metrics from the **Related Objects** tab of an engagement signal.

### Metric Types

| Type | Description | Example |
|---|---|---|
| **Count** | Counts the number of signal occurrences | "Count of article clicks" |
| **Sum/Value** | Looks at a specific attribute on the signal to aggregate | "Sum of net order amount for purchases" |
| **Compound** | Combines two single metrics using a Divide By function to create a ratio or rate metric | "Purchase conversion rate = purchases / product browses" |

### How Metrics Map to Objectives

For a simple objective like **Maximize Clicks**, the default count metric works:
- Signal: "Article Click" → Metric: Count of article clicks → Objective: Maximize this count

For a complex objective like **Maximize Revenue**, you create a value metric:
- Signal: "Purchase" → Metric: Sum of `netOrderAmount` → Objective: Maximize this amount

Any metric you create from an engagement signal is usable as an objective in a recommender.

### Documentation

Detailed documentation on engagement signal metrics and compound metrics is available in the [Salesforce Help: Engagement Signal Metrics](https://help.salesforce.com/s/articleView?id=sf.persnl_engagement_signal_metrics.htm).

---

## Key Requirements for Objective-Based Recommenders

For a metric and signal to be selectable on a recommender definition, **both** must meet these criteria:

1. **Built against a DG engagement object** — The signal's engagement DMO must exist on the profile data graph selected in the first step of the recommender configuration. If the engagement DMO isn't on the profile DG, the recommender has no access to the engagement data for training.

2. **Item identifier defined** — The signal must have an item identifier that maps to the ID value of the object being recommended. Without this, the model cannot correlate engagement data with specific items.

> **🚨 Warning:** If you are recommending products but the engagement signals don't have a product ID, the model will never know how to interpret that engagement data. Similarly, if you're recommending articles, engagement data against products (without a link to an article) won't help the model train.

---

## Recommender Filters

Filters refine which items are eligible to return in a decision response. When configuring a recommender, there are **three types of filters** you can apply:

### 1. Decision Context Filters

Compare attributes from the **item data graph** against attributes from an **anchor item** defined in the context object of the request.

**Example:** Only return products that match the brand of the product currently being viewed.

> **📝 Note:** When using the anchor ID field on the context object, the model expects the anchor ID value to correspond to an item matching the type being recommended. For example, if `anchorId = 123` and you're recommending products, the model interprets `123` as a product ID.

### 2. Static Filters

Compare a data point from the item data graph against either:
- A **manually defined value** (hardcoded)
- A **dynamic context variable** using Salesforce Merge Language (SML), which is replaced by a value from the context object at run-time

**Example (Basic):** Only return articles where `topic = "Mortgage Loans"`.

**Example (Dynamic):** Only return articles where `category = {!category}` (value passed in the decision request).

Advanced recommendation filters with dynamic context variables are documented in the [Salesforce Help: Advanced Recommendation Filters](https://help.salesforce.com/s/articleView?id=sf.persnl_recommendation_filters.htm).

### 3. Profile Data Graph Filters

Compare item attributes to **profile data points** from the selected profile data graph.

**Example:** Exclude products where the product ID matches a product ID from the purchase engagement object on the profile DG (don't recommend items the person already bought).

### Filter Best Practices

> **🚨 Warning:** **Overly restrictive filters** can result in empty decision responses. If you experience scenarios where no items are returned, review your filters to see if they are too specific or too numerous.

> **⚠️ Important:** **Match filters to request context.** If a recommender has filters expecting context data (like an anchor item), make sure the recommender is used in a location where that data is available. A recommender expecting an anchor item won't return results on a homepage where no anchor item exists.

More detailed filter documentation is available in the [Salesforce Help: Recommender Filters](https://help.salesforce.com/s/articleView?id=sf.persnl_recommender_filters.htm).

---

## Recommender Training & Item Updates

### Training Cycle

Objective-based recommenders train automatically on a **24-hour cycle**. Key facts about training:

- The training schedule is based on when the recommender was initially created — there is no single nightly job for all recommenders. Each one has an **independent schedule**.
- In order for a recommender to serve items, it must complete **at least one successful training**.
- **Minimum data requirement:** There must be at least **3 engagement rows** across the referenced engagement objects for the model to train.
- You can track training history from the recommender detail page → **Refresh History** tab.

### How New Items Become Recommendable

When a recommender trains, Personalization creates an **index** of all items in the item data graph. This index is used for both training and run-time decisioning. For new items added to a DMO, the following must happen before they can appear in decision responses:

#### Rules-Based Recommenders

1. **CI Refresh** — The CI must refresh after the new item enters Data Cloud. The fastest automated batch CI refresh window is **1 hour**.
2. **Item DG Refresh** — Once the CI runs, the item data graph must refresh (current fastest NRT DG refresh: **30 minutes**).
3. Item is now available in decision responses.

> **💡 Tip:** You can set a batch CI to "No Schedule" and use Data Cloud APIs or Flow to trigger the CI manually as soon as a new record arrives — reducing the wait time significantly.

#### Objective-Based Recommenders

1. Steps 1 and 2 above (CI refresh + DG refresh)
2. **Recommender Training** — One full training cycle must occur after the item appears in the index to generate the necessary embeddings (up to **24 hours**).

### Updates to Existing Items

Updates to items already in the index are reflected much faster. Once the metadata change makes it into the item data graph, an **index update job** runs on a **15-minute cadence** to reflect the updated values.

**Example:** If a product's price changes from $50 to $45, the updated price appears in decision responses within ~15 minutes of the change reaching the item DG.

---

## Creating a Recommender — Step by Step

1. Navigate to the **Personalization** app in Salesforce Setup
2. Go to **Recommenders** and click **New Recommender**
3. Select the **profile data graph** and **item data graph** to use
4. Choose a strategy:
   - **Rules-Based** — Select the Calculated Insight to use for ranking items
   - **Objective-Based** — Select the engagement signal metric and direction (maximize/minimize)
5. Optionally configure **filters** (decision context, static, or profile DG)
6. Save the recommender
7. For objective-based recommenders, wait for the first **training cycle** to complete (check the Refresh History tab)

> **⚠️ Important:** The profile data graph selected in step 3 determines which engagement signals and metrics are available for selection. Only signals built against engagement objects on that DG will appear.

---

**Next:** [Response Templates](response-templates.md) — Learn how to define the shape of data returned in a decision response.
