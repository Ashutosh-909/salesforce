# DLO-DMO Mapping & Identity Resolution

This section dives deeper into how data flows from Data Lake Objects (DLOs) into Data Model Objects (DMOs), explains a progressive mapping strategy that simplifies the process, and walks you through configuring Identity Resolution (IR) to unify anonymous and known profiles into a single view of each customer.

> **📝 Note:** Acronyms used in this section — **DLO** = Data Lake Object, **DMO** = Data Model Object, **IR** = Identity Resolution, **SDK** = Software Development Kit, **DC** = Data Cloud, **RT** = Real-Time, **NRT** = Near Real-Time.

---

## 1. Understanding DLOs and DMOs

When data arrives in Data Cloud — whether from the Web SDK, Mobile SDK, or any other connector — it first lands in **Data Lake Objects (DLOs)**. DLOs are raw staging tables that mirror the structure of the incoming data. They are not directly usable by Personalization.

To make the data useful, you map DLO fields to **Data Model Objects (DMOs)**. DMOs are the structured, canonical representation of your data within a data space. They follow Salesforce's standard data model and are the direct fuel for:

- **Identity Resolution** — matching identifiers across DLOs to unify profiles
- **Data Graphs** — pre-calculated views used by the Personalization decisioning engine
- **Segments and Calculated Insights** — audience groupings and computed metrics
- **Personalization decisions** — targeting rules, recommender inputs, and decision responses

### How They Relate

```
Website / Mobile App
        │
        ▼
  Events (via SDK)
        │
        ▼
  Data Lake Objects (DLOs)         ← Raw staging tables
        │                            (one per schema event type)
        ▼
  Data Model Objects (DMOs)        ← Structured, canonical objects
        │                            (Product Browse Engagement,
        │                             Shopping Cart Engagement,
        │                             Individual, Contact Point Email, etc.)
        ▼
  Identity Resolution → Unified Individual
        │
        ▼
  Data Graphs → Personalization
```

### Why Mapping Matters

If a DLO field is not mapped to a DMO field, the data exists in the data lake but is **invisible** to Personalization. Mapping errors — such as mapping to the wrong DMO or missing required fields — can result in:

- Events appearing in Data Cloud but not being usable for personalization
- Engagement data not associating with the correct individual
- Identity Resolution failing to match profiles

> **⚠️ Important:** Take time to get your mappings right. Correcting mapping errors after data has been flowing can require remapping data streams and potentially reprocessing historical data.

---

## 2. Progressive Mapping Strategy

The standard approach of mapping all DLO fields at once can be overwhelming, especially when your web schema covers many event types. A **progressive mapping strategy** simplifies the process by handling **one event type at a time**.

### How It Works

1. **Split your schema file.** Break your full web connector schema into separate JSON files, one per event type. Each behavioral event type should have a separate schema file.
2. **Upload the first event type.** Add the first behavioral event type schema file to the web connector schema configuration.
3. **Create or update the data stream.** Create a new behavioral event data stream (or add the event type to an existing data stream).
4. **Map all required fields.** Complete the DLO-to-DMO mapping for this single event type.
5. **Validate in Data Explorer.** Confirm events are landing correctly and data appears in the target DMO.
6. **Repeat.** Add the next event type schema file and repeat the process.

### Benefits

- **Focus:** You deal with one schema object and one DMO at a time
- **Auto-mapping:** You can take advantage of Data Cloud's automated mapping capabilities more effectively
- **Validation:** You can verify each mapping independently before moving on
- **Reduced errors:** Smaller scope means fewer opportunities for mapping mistakes

### Leveraging Auto-Mapping

Data Cloud can automatically map DLO fields to DMO fields when the web schema field's `masterLabel` value exactly matches the DMO field label. To take advantage of this:

- When defining custom fields in your schema, use `masterLabel` values that match the target DMO field labels exactly
- Check auto-mapped fields after each data stream creation — some may map automatically, saving manual effort

> **💡 Tip:** The progressive approach also makes debugging easier. If an event type isn't landing correctly in Data Cloud, you only need to troubleshoot one schema object and one set of mappings rather than the entire schema.

---

## 3. Identity Resolution

Identity Resolution (IR) is the process of matching different identifiers — across sessions, devices, and channels — to create a single, unified view of each customer. It's a critical step for Personalization because:

- **Anonymous → Known conversion:** When a visitor who was browsing anonymously logs in or provides an email, IR connects their anonymous browsing history with their known profile
- **Cross-channel consistency:** IR ensures that a customer who browses on mobile, purchases on desktop, and contacts support via email is recognized as the same person
- **Richer personalization inputs:** A unified profile gives the decisioning engine access to the full breadth of a customer's interactions, leading to more relevant recommendations and targeting

### Why IR Matters for Personalization

Without IR, each `deviceId` is treated as a separate individual. A single person browsing on their phone and laptop would appear as two anonymous visitors, each with a thin engagement history. With IR, their interactions are unified, giving the Personalization engine a richer signal to work with.

### 3.1. Plan Your Identifiers

Before configuring IR, identify the data points available on your website or app that can be used to recognize individuals. Common identifiers include:

| Identifier | Source | IR Match Type |
|---|---|---|
| `deviceId` | Auto-generated by the SDK for each browser/device | Exact match |
| Email address | Login, checkout, email capture forms, newsletter sign-up | Exact normalized |
| Phone number | Checkout forms, account profile, SMS opt-in | Exact normalized |
| `userId` / Login ID | Authentication system | Exact match |
| Loyalty card number | Loyalty program registration | Exact match |
| Customer ID | CRM system, imported via connector | Exact match |

> **💡 Tip:** Map out every location on your website or app where a user provides identifying information — login pages, checkout flows, email capture pop-ups, newsletter sign-ups, account creation forms. Make sure your sitemap captures these data points so they're available for IR.

### 3.2. Create an IR Ruleset

An IR ruleset defines the rules Data Cloud uses to match identifiers and unify profiles.

#### Steps

1. In Data Cloud, navigate to **Identity Resolution**.
2. Click **New Ruleset**.
3. **Select the target DMO** — typically the Individual object.
4. **Add match rules** for each identifier you want to use. For each rule, configure:
   - **Match field:** The DMO field to match on (e.g., Email Address on Contact Point Email)
   - **Match type:** The matching logic to apply (see below)
5. **Order your rules** by specificity — most precise rules first.
6. **Save** the ruleset.

#### Match Types

| Match Type | Description | Real-Time Support | Best For |
|---|---|---|---|
| **Exact Match** | Values must be identical (case-sensitive) | Yes | DeviceId, userId, loyalty numbers |
| **Exact Normalized** | Values are normalized before comparison (lowercased, whitespace trimmed) | Yes (email and phone only) | Email addresses, phone numbers |
| **Fuzzy** | Approximate matching using algorithms | No (batch only) | Names, addresses (not recommended as primary strategy for RT personalization) |

> **⚠️ Important:** For real-time personalization, focus on **Exact Match** and **Exact Normalized** match types. Fuzzy matching only runs during batch processing in the Lakehouse and will not unify profiles in real time. The RT layer treats fuzzy rules as exact match rules.

### 3.3. Real-Time IR Considerations

There is **no explicit setting** that makes an IR strategy "real-time." For IR to run in real time:

1. The Unified Individual object created by the IR ruleset must be **selected as the root of a Real-Time Profile Data Graph**
2. Data must be ingested via a real-time mechanism (Web SDK, Mobile SDK, Ingestion API, or Server-Server API)

When these conditions are met, Data Cloud applies IR logic in real time as events arrive — matching incoming identifiers against existing profiles and either linking to an existing Unified Individual or creating a new one.

### 3.4. Deploy the IR Ruleset

Once your ruleset is configured, deploy it:

1. Review all match rules for accuracy.
2. Click **Deploy** (or **Activate**, depending on your Data Cloud version).
3. After deployment, a corresponding **Unified Individual** DMO becomes available.

> **🚨 Warning:** Deploying an IR ruleset is a significant action. Once deployed, it begins matching and unifying profiles. While the ruleset can be modified after deployment, changes affect how future data is processed. Plan your IR strategy carefully before deploying.

The Unified Individual object will serve as the **root DMO** for your Profile Data Graph, which is covered in the next section: [Data Graphs](data-graphs.md).

---

## 4. Mapping Best Practices

Here are consolidated best practices for both DLO-DMO mapping and IR configuration:

### Mapping

1. **Use Partial refresh mode** for all web and mobile data streams — never Incremental.
2. **Map `eventType` to the target DMO** for every behavioral event data stream. This is required for Data Cloud to route events correctly.
3. **Map the `deviceId` field to the Individual field** on every engagement DMO. This is how events are associated with a specific person.
4. **Map `eventId` to the DMO's primary key field.** Each event needs a unique identifier.
5. **Check for auto-mapped fields** after creating each data stream. Fields where the schema `masterLabel` matches the DMO field label may already be mapped.
6. **Validate events in Data Explorer** after each mapping. Confirm that events are landing in the expected DMOs with the correct field values.

### Identity Resolution

1. **Start with `deviceId` + email** as your minimum IR strategy. These two identifiers cover the most common anonymous-to-known conversion scenario.
2. **Add additional identifiers progressively** — phone number, userId, loyalty number — as you instrument more capture points in your sitemap.
3. **Use Exact Match for system-generated IDs** (deviceId, userId) and **Exact Normalized for human-entered values** (email, phone).
4. **Avoid overly aggressive fuzzy matching** for web implementations. Fuzzy matching runs only in batch and can create false unifications if configured too broadly.
5. **Test IR by checking unified profiles** in Data Explorer after deploying your ruleset. Verify that profiles are being correctly unified by searching for known test users.

---

## Summary Checklist

- [ ] **DLO-to-DMO mappings complete** — All event types mapped to correct DMOs using the progressive approach
- [ ] **Mappings validated** — Events confirmed in Data Explorer for each mapped event type
- [ ] **IR identifiers planned** — All capture points on the website/app identified (login, checkout, email forms, etc.)
- [ ] **IR ruleset configured** — Match rules created for each identifier with appropriate match types
- [ ] **IR ruleset deployed** — Unified Individual DMO is available for use as the root of a Profile Data Graph
- [ ] **RT IR verified** — Exact match and exact normalized rules in place for real-time profile unification

---

## What's Next?

With your data mapped to DMOs and Identity Resolution unifying customer profiles, you're ready to build Data Graphs — the pre-calculated views that the Personalization decisioning engine uses at run-time.

**[← Previous: Mobile Data Capturing](mobile-data-capturing.md)** | **[Next: Data Graphs →](data-graphs.md)**

---

## Additional Resources

- [Salesforce Help: Identity Resolution](https://help.salesforce.com/s/articleView?id=sf.c360_a_identity_resolution.htm)
- [Salesforce Help: Data Mapping](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_mapping.htm)
- [Salesforce Help: Data Model Objects](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_model_objects.htm)
