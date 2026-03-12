# Setup & Permissions

Get your Salesforce org ready for Personalization. This section walks you through the required licenses, permission set assignments, Personalization datakit deployment, Data Space creation, and implementation planning guidance.

> **📝 Note:** Acronyms used in this section — **SP** = Salesforce Personalization, **PSL** = Permission Set License, **DMO** = Data Model Object, **CI** = Calculated Insight, **IR** = Identity Resolution, **DG** = Data Graph.

---

## Prerequisites

Before diving in, make sure you have:

- A **Salesforce org with Data Cloud** enabled
- **System Administrator** access to the org (or equivalent privileges for Setup, permission set management, and Data Cloud configuration)
- The **Personalization** license provisioned for your org

---

## 1. Required Licenses

Salesforce Personalization requires the following licenses to be provisioned in your org:

| License | Purpose |
|---|---|
| **Data Cloud** | Foundation platform — provides data ingestion, identity resolution, data graphs, segments, and calculated insights |
| **Personalization** | Enables the Personalization application, decisioning engine, recommenders, experiments, and the Web Personalization Manager |
| **Data Spaces Add-On** *(optional)* | Required only if you need to create additional data spaces beyond the default. Use additional data spaces to segregate data by brand, region, or department |

> **💡 Tip:** If you're just getting started, the default data space provided with Data Cloud is sufficient. You only need the Data Spaces add-on if your organization requires separate data partitions for different brands, regions, or lines of business.

---

## 2. Permission Set Assignment

Implementation resources need the right permission sets to configure and manage Salesforce Personalization. The Salesforce Administrator is responsible for user creation and permission set management.

### Required Permission Sets

There are two critical permission sets that must be assigned to anyone implementing SP:

| Permission Set | Details |
|---|---|
| **Personalization Admin** | A custom permission set based on the **Personalization permission set license (PSL)**. Grants full access to all Personalization features — personalization points, decisions, recommenders, experiments, response templates, and the Web Personalization Manager. |
| **Data Cloud Admin** | Grants full access to Data Cloud features — data streams, data model objects, identity resolution, data graphs, segments, and calculated insights. |

### Steps to Assign Permission Sets

1. Navigate to **Setup** → **Users** → **Permission Sets**.
2. Locate the **Personalization Admin** permission set.
   - If it doesn't exist yet, click **New** to create a custom permission set based on the **Personalization** permission set license.
3. Click the permission set name to open it.
4. Click **Manage Assignments** → **Add Assignment**.
5. Select the users who need implementation access and click **Assign**.
6. Repeat for the **Data Cloud Admin** permission set.

> **⚠️ Important:** Both permission sets are required for implementation. Without the Personalization Admin permission set, users cannot access the Personalization app. Without the Data Cloud Admin permission set, users cannot configure data streams, data graphs, or identity resolution.

### Creating Scoped Permission Sets for Day-to-Day Users

Once your implementation is live, not everyone needs full admin access. Create scoped permission sets for day-to-day users based on their role:

| Role | Suggested Access |
|---|---|
| **Campaign Manager** | Create and manage personalization decisions, experiments, and response templates. No access to data model configuration. |
| **Analyst / Viewer** | View-only access to personalization analytics, pipeline intelligence dashboards, and attribution reports. |
| **Content Author** | Access to the Web Personalization Manager for creating and publishing web experiences. Limited access to underlying data configuration. |

To create a scoped permission set:

1. Navigate to **Setup** → **Users** → **Permission Sets**.
2. Click **New**.
3. Select the **Personalization** permission set license.
4. Name the permission set descriptively (e.g., "Personalization Campaign Manager").
5. Configure the specific permissions appropriate for the role.
6. Save and assign to the relevant users.

> **💡 Tip:** Start with the Personalization Admin permission set for your implementation team. Once you're in production, create scoped permission sets that follow the principle of least privilege — give each user only the access they need for their specific role.

---

## 3. Personalization Datakit Deployment

The Personalization datakit deploys foundational Data Model Objects (DMOs) that the Personalization engine requires. This step must be completed before you can create personalization points, decisions, or recommenders.

### Steps to Deploy the Datakit

1. In Salesforce Setup, search for **Personalization** in the Quick Find box.
2. Navigate to the **Personalization Setup** page.
3. You will see a list of deployment steps. Complete the **first two steps** to deploy the foundational personalization datakit:
   - **Step 1:** Deploy the Personalization data model objects into your target data space.
   - **Step 2:** Verify that the deployment completed successfully and that personalization DMOs are available in your data space.

> **⚠️ Important:** These first two steps are mandatory. Without deploying the datakit, the personalization DMOs will not be available in your data space, and you won't be able to configure personalization features.

### Deploy Pipeline Intelligence Calculated Insights (Optional)

The Personalization Setup page also includes steps for deploying **Pipeline Intelligence** and **Attribution** analytics. These are optional for initial implementation but recommended for measuring personalization performance.

**Pipeline Intelligence** provides operational metrics on the personalization request pipeline:

- Total Personalization Requests
- Total Unique Personalization Points Evaluated
- Average Number of Unique Individuals per Day used in personalization decisioning
- Breakdown of the count of times different decisions are returned for a given personalization point

To deploy Pipeline Intelligence:

1. On the **Personalization Setup** page, locate the Pipeline Intelligence deployment step.
2. Click to deploy the Pipeline Intelligence calculated insights (CIs).
3. After deployment, navigate to **Data Cloud Setup** → **Calculated Insights**.
4. Locate the newly deployed Pipeline Intelligence CIs.
5. **Schedule** the CIs to start collecting data. They will not gather data until scheduled.

> **📝 Note:** Pipeline Intelligence and Attribution are analytics features — they are not required for building and deploying personalization experiences. You can always come back and enable them later once your core implementation is running.

---

## 4. Data Space Creation

A **Data Space** is a logical partition within Data Cloud that organizes your data for profile unification, calculated insights, and personalization. You can connect Personalization to any data space, including the default one provided with Data Cloud.

### When Do You Need an Additional Data Space?

- **Single brand / single region:** The default data space is sufficient. Skip to the next section.
- **Multiple brands, regions, or departments:** Create additional data spaces to segregate data and services. This requires the **Data Spaces add-on license**.

### Steps to Create a Data Space

1. Navigate to **Data Cloud Setup**.
2. Under **Data Management**, click **Data Spaces**.
3. Click **New** and provide a unique name for the data space (e.g., "North America Retail").
4. Enter a unique **data space prefix** — this must start with a letter and include up to three alphanumeric characters (e.g., "NAR").
5. Add an optional description about the purpose of the data space.
6. Click **Save**.

> **🚨 Warning:** After you save the data space, you **cannot change its prefix**. The prefix becomes part of the API name used to differentiate objects that exist in multiple data spaces. Choose carefully.

> **💡 Tip:** Until you create additional data spaces, all Data Cloud objects are mapped to the default data space. If you're just starting out with a single website, the default data space works perfectly.

---

## 5. Implementation Blueprint Guidance

Before writing any code or configuring personalization features, take time to plan. An **implementation blueprint** defines your target use cases, data requirements, and rollout schedule. It doesn't need to be a fancy document — a structured spreadsheet or shared doc works fine.

### What to Define in Your Blueprint

#### 5.1. Identify the Target Website

- Many organizations have multiple websites in their portfolio.
- **Start with one site** before expanding to additional websites.
- For multi-site implementations, there are considerations around SDK and sitemap configuration that are covered in the [Web Data Capturing](data-capturing-modeling/web-data-capturing.md) section.

#### 5.2. Prioritized List of Use Cases

Create a clear, prioritized list of the personalization experiences you want to deliver. Examples include:

- Product recommendations on the homepage
- Email capture pop-ups for unknown visitors
- Personalized banners based on segment membership
- Category-specific recommendations on product listing pages
- Cart abandonment recovery messaging

#### 5.3. Map Data Requirements Per Use Case

For each use case, identify the three categories of data you'll need:

| Data Category | What It Covers | Example |
|---|---|---|
| **Profile Data** | User engagement and behavioral data needed for the recommender to learn and for targeting rules | Product clicks, add-to-carts, purchases, page views. For recommendations, consider supplementing online transaction data with offline/in-store purchases and loading historical data for initial model training. |
| **Item Data** | Item metadata stored in a Data Cloud DMO for constructing an Item Data Graph | Product name, image URL, price, stock level, category. This data typically comes from a catalog/product feed that needs ongoing synchronization. |
| **Additional Data** | Data needed for targeting logic and content zone/template rendering | Segment memberships, profile attributes for targeting rules, content zone definitions in the sitemap, page type definitions |

**Example — Product Recommendations on the Homepage:**

| Requirement | Details |
|---|---|
| **Profile Data** | Track product browse, add-to-cart, and purchase events in the sitemap. Consider importing historical offline transactions for initial model training. |
| **Item Data** | Product metadata (name, image, price, URL, stock) must be available in a Data Cloud DMO via a catalog feed integration. The feed should sync on an ongoing basis to reflect price changes, new products, and stock updates. |
| **Additional Data** | Define a homepage page type in the sitemap. Create a content zone for the recommendations placement. Build a Handlebars template to render the recommendation response. |

**Example — Email Capture Pop-Up:**

| Requirement | Details |
|---|---|
| **Profile Data** | This use case actually *captures* profile data (email address) for identity resolution and cross-channel personalization. |
| **Item Data** | None needed — this is a Manual Content personalization type. |
| **Additional Data** | Ensure the web schema includes a Contact Point Email object. Configure the sitemap to capture and send email addresses back to Data Cloud. Target the pop-up at individuals where the contact point email is blank (available on the profile data graph). |

> **💡 Tip:** The email capture pop-up example illustrates why simpler use cases should come first. No item data integration is needed, making it a quick win you can deploy early while you build out the product catalog feed for recommendation use cases.

#### 5.4. Plan Identity Resolution Identifiers

A well-defined Identity Resolution (IR) strategy unlocks deeper personalization and cross-channel consistency. When planning your web implementation, think about where on your site users provide identifying information:

- **Login pages** — userId, email
- **Purchase checkout** — email, phone number, shipping address
- **Email capture forms** — email address
- **Newsletter sign-ups** — email address
- **Account creation** — email, phone, name

Make sure your sitemap is configured to capture these data points so that when you set up your IR ruleset, the underlying data is available for profile reconciliation. See [DLO-DMO Mapping & Identity Resolution](data-capturing-modeling/dlo-dmo-mapping-ir.md) for detailed configuration steps.

#### 5.5. Define a Rollout Schedule

Different use cases have different data and integration dependencies. Approach your implementation with an **agile mindset** — deploy simple use cases early while more complex data integrations are still in progress.

**Recommended rollout progression:**

| Phase | Use Case Type | Data Dependencies | Example |
|---|---|---|---|
| **Phase 1 — Quick Wins** | Manual Content (pop-ups, infobars, banners) | Minimal — basic sitemap with page types and content zones | Email capture pop-up, promotional infobar, welcome banner |
| **Phase 2 — Targeted Content** | Manual Content with targeting rules | Profile data graph with segment memberships and/or calculated insights | Segment-specific banners, returning visitor messaging |
| **Phase 3 — Recommendations** | ML-powered recommendations | Item data graph + catalog feed integration + engagement history for model training | Homepage product recommendations, category-specific recommendations |
| **Phase 4 — Advanced** | Experimentation, cross-channel, batch | Full data foundation + multiple data integrations | A/B testing decisioning strategies, email personalization, Agentforce integration |

> **⚠️ Important:** Avoid the common misconception that your Data Cloud implementation must be 100% complete before executing any personalization use cases. Different use cases have different data requirements. Start realizing value early by deploying simple use cases with minimal data dependencies (like pop-ups and infobars) while you continue building out the full data foundation.

---

## Summary Checklist

Use this checklist to confirm you've completed all setup steps before moving on:

- [ ] **Licenses verified** — Data Cloud and Personalization licenses are provisioned
- [ ] **Permission sets assigned** — Personalization Admin and Data Cloud Admin assigned to implementation team members
- [ ] **Personalization datakit deployed** — First two steps on the Personalization Setup page completed
- [ ] **Data space configured** — Default data space confirmed (or additional data space created if needed)
- [ ] **Pipeline Intelligence CIs deployed** *(optional)* — Deployed and scheduled from the Personalization Setup page
- [ ] **Implementation blueprint created** — Target website identified, use cases listed, data requirements mapped, IR identifiers planned, rollout schedule defined

---

## What's Next?

With your org set up and your blueprint in hand, you're ready to start capturing data. Head to the next section to install the Salesforce Interactions SDK and begin streaming real-time behavioral data into Data Cloud.

**[Next: Data Capturing & Modeling →](data-capturing-modeling/overview.md)**

---

## Additional Resources

- [Salesforce Help: Personalization Setup](https://help.salesforce.com/s/articleView?id=mktg.persnl_setup.htm)
- [Salesforce Help: Assign Permission Sets](https://help.salesforce.com/s/articleView?id=sf.perm_sets_assigning.htm)
- [Salesforce Help: Create Data Spaces](https://help.salesforce.com/s/articleView?id=sf.c360_a_create_data_space.htm)
- [Salesforce Help: Pipeline Intelligence](https://help.salesforce.com/s/articleView?id=mktg.persnl_pipeline_intelligence.htm)
- [Salesforce Help: Personalization and Data Cloud Overview](https://help.salesforce.com/s/articleView?id=mktg.persnl_basics.htm)
