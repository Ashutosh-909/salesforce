# Calculated Insights

Calculated Insights (CIs) are multidimensional metrics computed over your Data Model Objects (DMOs). They provide a flexible mechanism to analyze data, define custom metrics, and make computed values available for personalization targeting, recommendation strategies, and filtering. This section explains what CIs are, how to use them for different personalization scenarios, and how to add them to your Data Graphs.

> **📝 Note:** Acronyms used in this section — **CI** = Calculated Insight, **DMO** = Data Model Object, **DG** = Data Graph, **PK** = Primary Key, **ML** = Machine Learning.

---

## 1. What Are Calculated Insights?

A Calculated Insight is a Data Cloud feature that lets you define and calculate **multidimensional metrics** across your DMOs. Think of CIs as custom aggregations — counts, sums, averages, min/max values — computed over your data on a configurable schedule.

CIs are useful because they turn raw data into **actionable signals** that Personalization can use for:

- **Rules-based recommendation strategies** — "Show top-selling products" or "Show most-viewed articles"
- **Personalization decision targeting** — "Show this decision only to customers with lifetime purchase count > 5"
- **Recommendation filtering** — "Only recommend products with an average rating above 4.0"

### CI vs. Segments

| Feature | Calculated Insights | Segments |
|---|---|---|
| **Output** | Numeric metrics (count, sum, average, ratio) attached to individual records | Boolean membership (individual is in or out of the segment) |
| **Granularity** | Can be computed per individual, per item, or per any DMO dimension | Always per individual |
| **Use in targeting** | Yes, via DG — numeric comparisons (e.g., "total purchases > 10") | Yes, via DG — membership checks (e.g., "is member of 'VIP' segment") |
| **Use in recommendations** | Yes — powers rules-based recommenders and recommendation filters | Yes — can filter recommendations by segment membership |
| **Refresh** | Batch schedule (minimum 1 hour) | Batch or streaming schedule |

---

## 2. CIs for Rules-Based Recommenders

Rules-based recommenders use CIs to determine what items to show. Unlike objective-based recommenders that use ML, rules-based recommenders rely entirely on mathematical calculations — making them simpler to set up and easier to reason about.

Any CI defined on an **Item Data Graph** can be used to power a rules-based recommendation strategy. Common examples:

### Top Sellers

Shows products with the highest purchase count.

**CI definition:**
- **Root DMO:** Goods Product (or your item DMO)
- **Metric:** Count of Product Order Engagement rows per product
- **Dimension:** Product ID (PK of the root DMO)
- **Sort:** Descending by count

**What it answers:** "Which products are purchased most frequently?"

### Most Viewed

Shows products or articles that receive the most page views.

**CI definition:**
- **Root DMO:** Goods Product or Knowledge Article Version
- **Metric:** Count of Product Browse Engagement (or Article Engagement) rows per item
- **Dimension:** Item ID (PK of the root DMO)
- **Sort:** Descending by count

**What it answers:** "Which items are viewed most often?"

### Co-Browse

Shows products frequently viewed together with the product currently being viewed.

**CI definition:**
- **Root DMO:** Goods Product
- **Metric:** Count of co-occurrence — for a given pair of products, how many unique individuals viewed both
- **Dimensions:** Product A ID, Product B ID
- **Filter at decision time:** Anchor item = Product A → return all Product B items sorted by co-occurrence count

**What it answers:** "What other products do people view when they view this product?"

### Co-Buy

Shows products frequently purchased together.

**CI definition:**
- **Root DMO:** Goods Product
- **Metric:** Count of co-purchase — for a given pair of products, how many unique individuals purchased both
- **Dimensions:** Product A ID, Product B ID

**What it answers:** "What products are commonly bought together?"

> **💡 Tip:** Start with simpler CIs like **Top Sellers** and **Most Viewed** for your first rules-based recommenders. These require only a single dimension (item ID) and a count metric, making them straightforward to create and validate. Co-browse and co-buy CIs involve pair-wise calculations and are more complex.

### Requirements for Recommender CIs

When creating CIs intended for use in a rules-based recommender:

1. **At least one dimension must be the PK of the root DMO** of your Item Data Graph. This ensures the CI can be added to the DG definition and that the recommender can match CI values to specific items.
2. The CI must be **added to the Item Data Graph** definition (see Section 4 below).
3. The CI metric should output a **date or integer value** suitable for sorting. The recommender uses this value to rank items.

---

## 3. CIs for Targeting and Filtering

Beyond powering recommenders, CIs are valuable for personalization decision targeting and recommendation filtering.

### Targeting Examples

CIs added to the **Profile Data Graph** enable numeric targeting rules on personalization decisions:

| CI Metric | Targeting Rule Example |
|---|---|
| Lifetime purchase count | Show VIP decision only if purchase count ≥ 10 |
| Total revenue | Show premium offer only if total spend > $500 |
| Days since last purchase | Show re-engagement banner if last purchase > 30 days ago |
| Average order value | Show high-value recommendations if AOV > $100 |
| Page views in last 7 days | Show loyalty prompt if weekly visits ≥ 5 |

### Filtering Examples

CIs added to the **Item Data Graph** enable item-level filtering in recommendations:

| CI Metric | Filter Rule Example |
|---|---|
| Average product rating | Only recommend products with rating ≥ 4.0 |
| Stock level | Exclude products with stock = 0 |
| Trending score (views in last 24h) | Only recommend items with trending score > threshold |
| Margin percentage | Only recommend items with margin above a business-defined minimum |

> **💡 Tip:** CIs provide flexibility that segments alone cannot offer. While a segment tells you whether someone is *in* or *out* of a group, a CI gives you a **numeric value** that can be used in range comparisons, threshold checks, and sorting — enabling more nuanced targeting and filtering logic.

---

## 4. Adding CIs to Data Graphs

A CI must be added to a Data Graph definition before it can be used by Personalization. CIs are **not automatically available** — you must explicitly select them.

### Adding a CI to a Profile Data Graph

1. Open the **Profile Data Graph** configuration.
2. In the object selection pane, locate the **Calculated Insights** section.
3. CIs written against the **root DMO** of the DG (Unified Individual) are available for selection.
4. Select the CI and choose the specific fields/metrics you want available.
5. **Save** the DG.

Once added, the CI values are available for:
- Personalization decision targeting rules
- Recommendation filters (Profile DG type)

### Adding a CI to an Item Data Graph

1. Open the **Item Data Graph** configuration.
2. Locate the **Calculated Insights** section.
3. CIs written against the **root DMO** of the Item DG (e.g., Goods Product) are available for selection.
4. Select the CI and choose the specific metrics you want available.
5. **Save** the DG.

Once added, the CI values are available for:
- Rules-based recommender strategies (the CI metric drives the recommendation ranking)
- Recommendation filters (Item DG type)

> **⚠️ Important:** After adding a CI to a DG, the CI values won't appear on the DG immediately. The CI must complete a **batch refresh**, and then a **DG refresh** must occur. For a CI on a 1-hour schedule with a 30-minute DG refresh, it could take up to 1.5 hours for new CI values to be reflected.

### CI Refresh Schedules

| Schedule Option | Refresh Frequency | Best For |
|---|---|---|
| **1 hour** | Fastest available | CIs powering real-time recommendations where freshness matters (e.g., trending items) |
| **4 hours** | Balanced frequency | General-purpose CIs (e.g., top sellers, most viewed) |
| **12 hours / Daily** | Less frequent | CIs with stable values that don't change rapidly (e.g., lifetime purchase count) |
| **No Schedule** | Manual/API trigger only | CIs where you want to control the exact refresh timing via Data Cloud APIs or Flow orchestration |

> **💡 Tip:** For CIs powering recommendation strategies where **new items** need to be included quickly (e.g., a new product added to your catalog), use the 1-hour schedule. The recommendation pipeline requires the CI to refresh (up to 1hr) → Item DG to refresh (up to 30min) before the new item appears in rules-based recommendations. See [Data Graphs — Refresh Cycles](data-graphs.md#3-data-graph-refresh-cycles) for the full timeline.

---

## 5. Creating a Calculated Insight

### Steps

1. In Data Cloud, navigate to **Calculated Insights** (under Data Management or Analytics).
2. Click **New Calculated Insight**.
3. **Name** the CI descriptively (e.g., "Product Total Sales Count", "Customer Lifetime Purchase Count").
4. **Define the data source** — select the DMO(s) the CI will compute over.
5. **Define dimensions** — the grouping keys for the metric:
   - For Item DG CIs: Include the PK of the root DMO (e.g., Product ID)
   - For Profile DG CIs: Include the Individual ID or Unified Individual ID
6. **Define the metric** — the aggregation to compute:
   - Count, Sum, Average, Min, Max, or a custom expression
7. **Set the schedule** — how frequently the CI should refresh.
8. **Save and activate** the CI.

> **📝 Note:** CIs won't compute or be available until they are both activated and scheduled (or manually triggered).

---

## Summary Checklist

- [ ] **CIs for rules-based recommenders created** *(if applicable)* — Top sellers, most viewed, co-browse, co-buy, or other item-level metrics defined
- [ ] **CIs for targeting created** *(if applicable)* — Profile-level metrics for decision targeting rules defined
- [ ] **CIs for filtering created** *(if applicable)* — Item-level or profile-level metrics for recommendation filters defined
- [ ] **CIs added to Data Graphs** — Each CI added to the appropriate Profile DG or Item DG
- [ ] **CI schedules configured** — Refresh frequency set based on data freshness requirements
- [ ] **CI values validated** — Confirmed in Data Explorer or DG preview that CI values are computing correctly

---

## What's Next?

With your data pipeline complete — data capturing, modeling, identity resolution, data graphs, and calculated insights — you're ready to start building personalization experiences. Head to the Web Implementation section to learn about personalization types, recommenders, response templates, and more.

**[← Previous: Data Graphs](data-graphs.md)** | **[Next: Web Implementation Overview →](../web-implementation/overview.md)**

---

## Additional Resources

- [Salesforce Help: Calculated Insights](https://help.salesforce.com/s/articleView?id=sf.c360_a_insights.htm)
- [Salesforce Help: Create Calculated Insights](https://help.salesforce.com/s/articleView?id=sf.c360_a_calculated_insights_create.htm)
- [Salesforce Help: Data Graphs](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm)
