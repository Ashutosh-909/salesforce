# Data Graphs

Data Graphs are pre-calculated views built from your Data Model Objects (DMOs). They combine structured data to create optimized, easy-to-use representations of your information that the Personalization decisioning engine accesses at run-time. This section explains how to build both Profile Data Graphs and Item Data Graphs, configure caching for real-time performance, understand refresh cycles, and debug data issues.

> **📝 Note:** Acronyms used in this section — **DG** = Data Graph, **DMO** = Data Model Object, **RT** = Real-Time, **NRT** = Near Real-Time, **IR** = Identity Resolution, **CI** = Calculated Insight, **ML** = Machine Learning.

---

## Overview

There are two types of data graphs critical to Salesforce Personalization:

| Data Graph Type | Purpose | Root DMO | Used For |
|---|---|---|---|
| **Profile Data Graph (Real-Time)** | Represents the unified understanding of a person | Unified Individual | Decision targeting, recommendation inputs, personalization eligibility evaluation |
| **Item Data Graph (Standard)** | Represents business context objects that can be recommended | Business object (e.g., Goods Product, Knowledge Article) | Recommendation responses, item filtering, item metadata for decision rendering |

Almost every part of the Personalization ecosystem relies on one or both of these data graph types. The Profile Data Graph is effectively the **heartbeat of personalization** — it's referenced at run-time for every personalization decision.

---

## 1. Profile Data Graph (Real-Time)

A Real-Time Profile Data Graph combines the unified understanding of an individual with their engagement history, segment memberships, and calculated insights. It is used by the decisioning engine to:

- Evaluate **targeting rules** on personalization decisions (who should see what)
- Provide **input to ML-based recommenders** (what items to recommend)
- Support **real-time updates** as users interact with your website or app

### Understanding the Storage Layers

Before creating your Profile DG, it's important to understand where profiles can live. There are three layers:

```
┌──────────────────────────────────────────────┐
│                  Hot-Store                    │
│  (Real-Time Layer)                           │
│  • Profiles promoted here when an RT event   │
│    is registered via SDK                     │
│  • Locked from lakehouse updates during      │
│    active session                            │
│  • Session duration is configurable          │
└──────────────────────────────────────────────┘
                     ▲
                     │ (promoted on RT event)
┌──────────────────────────────────────────────┐
│               Pre-Fetch Cache                │
│  (Warm Layer)                                │
│  • Profiles pre-loaded from lakehouse based  │
│    on configurable lookback and record count │
│  • Enables faster profile access at run-time │
│  • Supports first-page personalization       │
└──────────────────────────────────────────────┘
                     ▲
                     │ (pre-loaded based on activity)
┌──────────────────────────────────────────────┐
│                 Lakehouse                    │
│  (Standard Layer)                            │
│  • All profiles are stored here              │
│  • All non-real-time data flows into the     │
│    lakehouse                                 │
│  • Synced to pre-fetch/hot-store on refresh  │
└──────────────────────────────────────────────┘
```

**Key behavior:**
- When a user visits your website and the SDK fires an event, their profile is **promoted from pre-fetch (or lakehouse) to the hot-store**
- While in the hot-store, the profile is **locked from lakehouse updates** until the session ends
- Profiles get loaded into pre-fetch when an engagement event against an engagement object on the DG definition occurs within the cache lookback window — this includes updates from **any data source**, not just real-time
- A nightly job trims the pre-fetch cache down to the configured maximum

### Creating a Real-Time Profile Data Graph

#### Step 1: Configure DG Settings

When creating a new Profile Data Graph, you'll encounter several critical configuration options:

| Setting | Description | Recommendation |
|---|---|---|
| **Cache Duration** | How recently a user must have been active to be eligible for pre-fetch caching. Determines the lookback window for the initial cache load. | Set based on your typical visitor return frequency (e.g., 30 days). |
| **Max # of Records** | Maximum number of profiles to hold in the pre-fetch cache layer. Respected on initial cache load; can be exceeded during the day and is trimmed nightly. | Start with a value that covers your typical monthly active users. Monitor and adjust. |
| **Session End** | How long a profile remains active in the hot-store. While in the hot-store, lakehouse updates are blocked. | Set based on your typical session duration (e.g., 30 minutes). |
| **Disable Record Caching** | Controls whether the pre-fetch cache is used. | **Must be OFF** (disabled) for real-time web personalization. If enabled, every request falls back to the lakehouse, effectively treating everyone as anonymous. |
| **Real-Time Data Ingestion** | Whether DMO updates via the Ingestion API are pushed to the DG in real time. | Enable if you use the Ingestion API for real-time data updates beyond the Web/Mobile SDK. |

> **🚨 Warning:** The "Disable Record Caching" setting is **ON by default**. You **must turn it OFF** for real-time web personalization. If left on, every personalization request will route to the lakehouse, resulting in increased latency and users being treated as anonymous on initial page load.

#### Step 2: Select the Root DMO

1. Set the root DMO to the **Unified Individual** object created by your Identity Resolution ruleset (see [DLO-DMO Mapping & IR](dlo-dmo-mapping-ir.md)).
2. On the right-hand pane, **select the fields** from the Unified Individual that you want available on the DG.

Using the Unified Individual as the root ensures personalization has access to the unified view of each person for cross-channel decisioning.

> **⚠️ Important:** Once you select a field and save the DG, you **cannot remove** that field from the DG definition. You can always add more fields later. Be intentional about field selection but don't worry about perfection — you can expand over time.

#### Step 3: Add Segment Memberships

If segments are built against the root DMO of your DG, the **Segment Memberships** object becomes available for selection. Adding it enables:

- Using segment memberships in **personalization decision targeting** (e.g., "Show this decision only to members of the 'High-Value Customers' segment")
- Using segment memberships in **recommendation filters** (e.g., "Exclude items already purchased by 'Repeat Buyers' segment")

#### Step 4: Add Related Engagement Objects

Related objects are DMOs that have a relationship to the root DMO. For personalization recommenders, it is **critical** that you add engagement objects as related objects to your Profile DG. These engagement objects capture an individual's interactions with business objects and are the underlying fuel for ML-based recommendation strategies.

Common engagement objects to add:

| Engagement Object | What It Captures |
|---|---|
| Product Browse Engagement | Product views (page visits to product detail pages) |
| Shopping Cart Engagement | Add-to-cart actions |
| Shopping Cart Product Engagement | Product-level cart details (product, quantity, price) |
| Product Order Engagement | Purchases |
| Knowledge Article Engagement | Article views and interactions |

> **⚠️ Important:** If you plan to use recommendation-type personalization, you **must** add the relevant engagement objects to your Profile DG. Without them, the recommender cannot access the engagement data it needs for training and run-time decisioning.

#### Step 5: Add Calculated Insights

Calculated Insights (CIs) written against the root DMO of the DG are available for selection. Adding CIs to the Profile DG enables:

- Using CI values in **personalization decision targeting** (e.g., "Show this decision only if the customer's lifetime purchase count > 5")
- Using CI values in **recommendation filters**

See [Calculated Insights](calculated-insights.md) for details on creating CIs.

#### Step 6: Select Fields and Apply Filters

- **Select fields:** For every object added to the DG (root DMO, related objects, CIs), select the specific fields you want available. Only selected fields are accessible for targeting, filtering, and decision responses.
- **Apply filters (optional):** Filters can be applied to DG objects to limit the number of engagement events stored within a DMO on the DG. This can help manage DG size.

> **📝 Note:** For more details on DG limits and considerations, see the [Data Graphs documentation](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm).

---

## 2. Item Data Graph (Standard)

Item Data Graphs represent business context data — the things you want to recommend. Products, articles, offers, events — anything modeled as an Item DG becomes **recommendable** by Salesforce Personalization's decisioning service.

> **💡 Tip:** Item Data Graphs are **not required** for simpler personalization use cases like infobars, pop-ups, and manual content banners. To deliver value early in your implementation, deploy Manual Content use cases while you continue building out Item Data Graphs. See [Personalization Types](../web-implementation/personalization-types.md) for more on Manual Content vs. Recommendations.

### Creating an Item Data Graph

Item Data Graphs should be configured as **Standard Data Graphs** (not real-time).

#### Step 1: Select the Root DMO

The root DMO is your primary business object:

| If You're Recommending... | Root DMO |
|---|---|
| Products | Goods Product |
| Articles | Knowledge Article Version |
| Offers | Custom offer DMO |
| Events | Custom event DMO |

When Personalization delivers a recommendation, it returns data from the **root DMO** of the Item DG. Only attributes selected on the right pane of the DG configuration screen are eligible for use in:

- **Recommendation filters** — determining which items can be recommended
- **Decision responses** — the data returned to the requesting application for rendering

> **⚠️ Important:** Make sure any attribute necessary for **rendering the decision response** (like image URL, product name, price, product page URL) is defined on the **root DMO** and selected as a field. Personalization can only return attributes from the root DMO of the Item DG in decision responses.

#### Step 2: Add Related Objects

Add DMOs that have a relationship to the root DMO. Related objects are primarily used in **recommendation filters** to determine item eligibility. For example:

- A Category DMO related to Goods Product lets you filter recommendations by product category
- A Brand DMO related to Goods Product lets you filter by brand

#### Step 3: Add Calculated Insights

CIs defined on the Item DG serve two purposes:

1. **Rules-Based Recommender Strategies:** Any CI on an Item DG can power a rules-based recommendations strategy. Examples include:
   - **Top sellers** — CI counting total purchases per product
   - **Most viewed** — CI counting total product views per product
   - **Co-browse** — CI identifying products frequently viewed together
   - **Co-buy** — CI identifying products frequently purchased together

2. **Recommendation Filters:** CIs on an Item DG can be used to restrict which items are eligible for recommendation (e.g., only recommend items with a view count above a threshold).

See [Calculated Insights](calculated-insights.md) for details on creating CIs for recommenders.

> **📝 Note:** When creating CIs for use in a recommender, ensure that at least one of the CI's dimensions is the **primary key of the root DMO** of your Item DG. This ensures the CI can be added to the DG definition.

---

## 3. Data Graph Refresh Cycles

Understanding when data updates reach your data graphs is important for knowing when personalization decisions reflect the latest information.

### Profile Data Graph Refresh

| Scenario | When Updates Appear |
|---|---|
| **Real-time events** (Web/Mobile SDK) | Immediately — events are processed in the RT layer and pushed to the hot-store profile |
| **Lakehouse data updates** (non-RT sources, batch ingestion) | After the next DG refresh cycle. Recommended: **30-minute refresh cadence** (default for RT DGs). |
| **Profile in hot-store + lakehouse update** | Lakehouse updates are **blocked** until the profile exits the hot-store (session ends). After session end, the next DG refresh merges lakehouse data. |
| **Segment membership changes** | After the segment recalculates **AND** the next DG refresh occurs. If a segment runs every 4 hours, the membership change appears after the segment update + the next 30-min DG refresh. |
| **Calculated insight updates** | Same as segment memberships — CI batch job must complete, then DG refresh must occur. |

### Item Data Graph Refresh

Item Data Graphs follow the standard DG refresh cadence (typically 30 minutes for NRT). When item metadata changes (e.g., a product price update):

1. The change flows into the DMO
2. On the next DG refresh, the Item DG reflects the updated value
3. For items already in the recommender index, an **incremental index update** runs every **15 minutes** to sync changes

### Consumption Patterns After Initial DG Creation

When you first create your Profile DG, expect the following pattern:

1. **Initial pre-fetch load:** A job runs to populate the cache with all profiles that have had engagement activity within the cache duration lookback window (e.g., last 30 days).
2. **Continued cache growth:** As new visitors arrive via your website, anonymous profiles are added to the cache. Profile consumption (unique profiles per month) will climb.
3. **Stabilization:** Eventually, profiles aging out of the cache (no activity within the lookback window) will balance against new profiles being added. The initial upward trend in cached profiles is **not** indicative of a perpetual increase.

---

## 4. Viewing Data in the RT Profile Data Graph

When debugging real-time events, it's helpful to view the data currently stored in the Profile DG.

### Method 1: Data Explorer

1. In Data Cloud, navigate to **Data Explorer**.
2. Select the **Profile Data Graph** object.
3. Search for a specific individual.
4. View the JSON representation of their profile.
5. Toggle the **Real-Time View** to **On** to see the hot-store version of the profile. Toggle it **Off** to see the lakehouse (NRT) version.

> **💡 Tip:** When debugging RT events, make sure you have the Real-Time View set to "On". Otherwise you'll be looking at the lakehouse version, which may not reflect the latest real-time interactions.

### Method 2: Data Graph Lookup Flow

If you don't know the Unified Individual ID, you can create a flow to look up DG data by other identifiers:

1. Create an **auto-triggered flow** with the developer name `LookupDataGraph`.
2. Add three **input parameters** (exact API names required):
   - `DataGraphAPIName` (String)
   - `DataspaceAPIName` (String)
   - `LookupKey` (String)
3. Add one **output parameter**:
   - `OutputDataGraph` (String)
4. Add a single action invoking the **"Data Cloud Get Data Graph By Lookup"** invocable action.
5. Map the three input parameters to the corresponding action parameters.
6. Assign the action output to the `OutputDataGraph` variable.

**Lookup Key Format:**

```
<DMORelationshipName>.SourceRecordId__c=<IdValue>
```

Replace `<DMORelationshipName>` with the relationship name of the DMO you're looking up and `<IdValue>` with the actual identifier value.

To test the flow, enter different ID values for the lookup key and run in **debug mode**.

---

## Summary Checklist

- [ ] **Profile Data Graph created** — Real-time type, rooted on Unified Individual
- [ ] **Record caching enabled** — "Disable Record Caching" is OFF; cache duration, max records, and session end configured
- [ ] **Engagement objects added** — Product Browse, Shopping Cart, Product Order, and other relevant engagement DMOs added as related objects
- [ ] **Segment memberships added** *(if applicable)* — Available if segments are built against the root DMO
- [ ] **Calculated insights added** *(if applicable)* — CIs built against the root DMO, selected on the DG
- [ ] **Fields selected** — All attributes needed for targeting, filtering, and ML input are selected on each object
- [ ] **Item Data Graph created** *(if using recommendations)* — Standard type, rooted on the business object DMO (e.g., Goods Product)
- [ ] **Item DG fields selected** — All attributes needed for rendering decision responses (name, image, price, URL) are selected on the root DMO
- [ ] **Refresh cadence set** — 30-minute refresh for RT Profile DG (should be default)
- [ ] **DG data validated** — Confirmed in Data Explorer that profiles and items appear correctly

---

## What's Next?

With your Data Graphs in place, you may want to add Calculated Insights for rules-based recommendations and advanced targeting. Head to the next section to learn how.

**[← Previous: DLO-DMO Mapping & Identity Resolution](dlo-dmo-mapping-ir.md)** | **[Next: Calculated Insights →](calculated-insights.md)**

---

## Additional Resources

- [Salesforce Help: Data Graphs](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm)
- [Salesforce Help: Real-Time Data Graphs](https://help.salesforce.com/s/articleView?id=sf.c360_a_rt_data_graphs.htm)
- [Salesforce Help: Data Graph Limits](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm)
