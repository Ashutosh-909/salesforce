# Web Data Capturing

This section walks you through the end-to-end process of capturing real-time user interactions from your website and sending them to Data Cloud. By the end, you'll have a working website connector, a deployed SDK, a sitemap capturing structured events, and data streams mapping those events to Data Model Objects (DMOs).

> **📝 Note:** Acronyms used in this section — **SDK** = Software Development Kit, **DLO** = Data Lake Object, **DMO** = Data Model Object, **CDN** = Content Delivery Network, **DC** = Data Cloud.

---

## Overview

Capturing web data involves seven sequential steps:

1. Create a Website Connector
2. Upload your Event Schema
3. Install the Interactions SDK on your website
4. Build a Sitemap
5. Configure the Web Schema
6. Deploy Website Data Streams
7. Map DLOs to DMOs

Each step is covered in detail below.

---

## 1. Create a Website Connector

A website connector links your website to Data Cloud, controlling the scope of data ingestion. Each connector is tied to a specific website domain.

### Steps

1. Navigate to **Data Cloud Setup**.
2. Under **CONFIGURATION**, click **Websites & Mobile Apps**.
3. Click **New**.
4. Provide a **Connector Name** (e.g., "NTO Main Website").
5. From the **Connector Type** dropdown, select **Website**.
6. Click **Save**.

> **💡 Tip:** Keep your website connectors **1:1 with a website domain**. While you *can* write a single sitemap that works across multiple websites, this leads to a more complex sitemap, higher risk when making changes, and nuanced data mapping considerations. If you have multiple websites, create a separate connector for each.

### Multi-Website Considerations

If you have multiple websites, you need to decide how to organize them:

| Approach | When to Use | Pros | Cons |
|---|---|---|---|
| **Multiple websites in a single data space** | When you want cross-brand/cross-region analytics and personalization | Unlocks cross-brand Identity Resolution, analytics, and personalization. Enables unified customer view across portfolio. | Business teams must ensure the right data is used for each brand's personalization. Teams can affect each other within a shared data space. |
| **One website per data space** | When brands operate independently with distinct products and teams | Clean data separation. Team access can be scoped to their brand. Easier to manage analytics and personalization independently. | Requires the Data Spaces add-on license (additional cost). Limits cross-brand insights. |

> **📝 Note:** Multiple website connectors can be deployed to the **same data space**. This allows you to keep website schemas and sitemaps separate while still analyzing cross-website engagement within a single data space.

---

## 2. Upload Your Event Schema

The event schema is a JSON file that defines the structure of the event data your website will track. It tells Data Cloud what types of events to expect and what fields each event contains.

The SDK provides a **recommended schema file** covering common events:

- **Engagement Events** — Cart interactions, catalog (product browse) interactions, order interactions, consent events
- **Profile Events** — Contact point email, contact point phone, identity, party identification

### Steps

1. [Download the recommended schema file](https://cdn.c360a.salesforce.com/cdp/schemas/250/web-connector-schema.json) or prepare your own custom schema file.
2. On the website connector setup page, scroll to the **Schema** section.
3. Click **Upload Schema** and select your schema file.
4. Confirm that all events and their associated fields are populated correctly.
5. Click **Save**.

### Updating Your Schema Later

You can update your schema at any point by clicking **Update Schema** on the connector page.

> **⚠️ Important:** Schema updates are **additive only**. You can add new events and fields, but you must retain all previous events and fields. You cannot remove existing schema definitions.

To view the full schema you uploaded, click **View Full Schema** on the connector page.

### See Also

- Download: [Recommended Web Connector Schema (JSON)](https://cdn.c360a.salesforce.com/cdp/schemas/250/web-connector-schema.json)

---

## 3. Install the Interactions SDK on Your Website

With your connector created and schema uploaded, you can now install the Salesforce Interactions SDK on your website.

### Steps

1. On the website connector setup page, scroll down to the **Integration Guide** section.
2. Copy the **Content Delivery Network (CDN) URL** — this is a connector-specific script URL.
3. Add the script to the `<head>` section of your website using a `<script>` tag:

```html
<script src="https://cdn.c360a.salesforce.com/beacon/YOUR_CONNECTOR_ID/scripts/c360a.js"></script>
```

4. Initialize the SDK using the `SalesforceInteractions.init` method:

```javascript
SalesforceInteractions.init({
  consents: [{
    provider: 'YourConsentProvider',
    purpose: 'Tracking',
    status: 'Opt In'
  }]
});
```

> **⚠️ Important:** Replace the CDN URL above with your actual connector-specific URL from the Integration Guide section. The URL shown here is a placeholder.

### See Also

- [Salesforce Interactions SDK: Capture Web Interactions](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_salesforce_interactions_web_sdk.htm)
- [Salesforce Interactions SDK: Initialization](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_initialization.htm)
- [Salesforce Interactions SDK: Consent](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_consent.htm)

---

## 4. Build a Sitemap

The sitemap is a JavaScript file that defines the **data capture logic** across different pages of your website. It tells the SDK what events to capture, what data to include in each event, and where personalization content zones exist on each page.

### Creating Your Sitemap

1. Install the [Salesforce Interactions SDK Launcher Chrome Extension](https://chromewebstore.google.com/detail/salesforce-interactions-s/mhmpepeohaddbhkhecaldflljggicedf).
2. Enable and access the **Sitemap Editor** on your website through the extension.
3. Use the Sitemap Editor to instrument your website's sitemap.
4. Create a JavaScript file named `sitemap.js`.
5. Copy the sitemap code you created and paste it into this file.
6. On the website connector setup page, navigate to the **Sitemap** section.
7. Click **Upload** and upload the `sitemap.js` file.
8. Review the sitemap for errors, and click **Save**.

### Key Sitemap Components

A sitemap is made up of several key building blocks. Let's walk through each one.

#### 4.1. Consent Management

Not all website visitors consent to cookie tracking. The SDK only sends events if a customer has consented. When consent is revoked, the SDK captures this preference and immediately stops emitting events.

```javascript
SalesforceInteractions.init({
  consents: [{
    provider: 'ExampleProvider',
    purpose: 'Tracking',
    status: 'Opt In'
  }]
});
```

You can configure multiple consent entries in the `consents` array if your site uses multiple consent providers or purposes. For more details, see the [Consent documentation](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_consent.htm).

#### 4.2. Page Types

A sitemap is made up of **page type configurations**. One page type config can apply to multiple pages. Page types organize your sitemap's code structure and help define where an event originated. From a personalization standpoint, page types allow business users to easily configure multi-page personalization experiences (e.g., "show recommendations on all Product Display Pages").

Each page type has three key properties:

| Property | Description |
|---|---|
| `name` | The name of the page type (e.g., "Home", "Product Display Page", "Cart", "Article") |
| `isMatch` | A boolean function that returns `true` when the current browser page matches this page type. Can use the data layer, page URL, meta tags, or any other page information. |
| `interaction` | An object describing the engagement event to send to Data Cloud. Contains `name` (the action being performed) and `eventType` (the identifier used to map the event to a schema object). |

**Example — Homepage page type:**

```javascript
{
  name: "home",
  isMatch: () => {
    return window.location.pathname === '/';
  },
  interaction: {
    name: "home view",
    eventType: "websiteEngagement",
  }
}
```

> **⚠️ Important:** Always explicitly define the `eventType` attribute for each page type. The `eventType` is the identifier used to map the event to a corresponding object defined on your web schema. Without it, Data Cloud won't know how to categorize the event.

#### 4.3. Content Zones

Content Zones define pre-configured areas of the website — at the global or page type level — that are eligible for personalization. When a business user applies personalization via the Web Personalization Manager (WPM), they can select one of these content zones as the render target.

Each content zone requires:

| Property | Description |
|---|---|
| `name` | A descriptive name for the content zone, displayed in the WPM UI when selecting a render location |
| `selector` | A CSS selector targeting a specific DOM element on the page. The content of this element will be replaced with the personalized experience. |

> **📝 Note:** Salesforce Personalization only supports content zones where **both** `name` and `selector` are defined.

**Example — Page type with content zones:**

```javascript
{
  name: "home",
  isMatch: () => {
    return window.location.pathname === '/';
  },
  interaction: {
    name: "home view",
    eventType: "websiteEngagement",
  },
  contentZones: [
    {
      name: "hero_banner",
      selector: "div#hero"
    },
    {
      name: "recommendations",
      selector: "div#main.recs"
    }
  ]
}
```

> **💡 Tip:** Define content zones for every area of your website where you might want to display personalized content. Having these "personalization hotspots" pre-defined in the sitemap ensures that personalization experiences target consistent, stable parts of the website.

#### 4.4. Engagement Events vs. Profile Events

Each event sent from the sitemap can include two different types of information:

| Type | What It Contains | Example |
|---|---|---|
| **Engagement Data** | Information about a specific action performed by the user | Page view, button click, add to cart, form submit, purchase |
| **Profile Data** | Information about the user themselves | Email address, first name, loyalty points, phone number |

#### 4.5. Event Type Splitting

Since a single sitemap event can include information that should be mapped to **different DMOs**, the Data Cloud SDK allows you to specify different event types for different data types within one event:

- **Engagement data:** Define `eventType` under the `interaction` object
- **Profile data:** Define `eventType` under the `user.attributes` object

The DC module automatically **splits** the sitemap event into multiple events based on these event types before sending to Data Cloud.

**Example — A single sitemap event with both engagement and profile data:**

```javascript
SalesforceInteractions.sendEvent({
  interaction: {
    eventType: 'userEngagement',
    name: 'button_click'
  },
  user: {
    attributes: {
      eventType: 'contactPointEmail',
      email: 'joe.smith@domain.com'
    }
  }
});
```

**Data Cloud receives two separate events:**

```json
[
  {
    "eventType": "contactPointEmail",
    "email": "joe.smith@domain.com",
    "category": "Profile"
  },
  {
    "eventType": "userEngagement",
    "interactionName": "button_click",
    "category": "Engagement"
  }
]
```

In addition to the fields you define on the sitemap event, the Data Cloud SDK **automatically populates** a set of values on every event — including `dateTime`, `deviceId`, `eventId`, and others. A full list of auto-populated values is available in the [SDK documentation](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_salesforce_interactions_web_sdk.htm).

#### 4.6. Standard vs. Custom Interaction Names

When reviewing sitemap documentation, you may encounter standard interaction structures for events like "View Catalog Object", "Purchase", and "Add to Cart".

**Standard Interaction Names:** Events with standard interaction names are transformed to DC events using pre-configured patterns. The `eventType` value is automatically derived based on the interaction name and **cannot be overridden**. For example, events with the "View Catalog Object" interaction name always have an `eventType` of `"catalog"`.

**Custom Interaction Names:** If your website includes different types of objects (e.g., Products *and* Articles) that users interact with in different ways (e.g., "View Product" vs. "Download Article"), use **custom interaction names and event types**. This gives you flexibility during data mapping — allowing you to map engagement with different object types to different DMOs.

**Example — Why custom names matter:**

| Approach | Product Browse → DMO | Article View → DMO |
|---|---|---|
| Standard (`View Catalog Object` for both) | Both go to the same DMO | Both go to the same DMO |
| Custom (`productBrowse` + `articleBrowse`) | Maps to Product Browse Engagement DMO | Maps to Article Engagement DMO |

> **💡 Tip:** Use custom interaction names and event types when your website has multiple types of content objects. This gives you maximum control over how each type of engagement is mapped in Data Cloud.

#### 4.7. Sitemapping Best Practices

Follow these tips for a smoother implementation:

1. **Build your sitemap first**, test it on the website, capture all emitted events, and build a schema based on the captured data.
2. **Understand SDK event translation.** Standard events (with standard interaction names) use pre-defined `eventType` values and pre-configured transformation logic. Custom events behave differently.
   - [Translation of standard events](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_salesforce_interactions_web_sdk.htm)
   - [Translation of custom events](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_salesforce_interactions_web_sdk.htm)
3. **Extend events with additional properties.** You can add custom properties to any event based on your business requirements.
4. **Use different `eventType` values** for engagement with different object types (e.g., Products vs. Articles) to enable separate DMO mapping.
5. **Validate events are landing in DC.** If events are not ingested, confirm that the flat DC events sent by the SDK include all mandatory fields defined in the web schema and that data types match.
6. **Map `eventType` to the target DMO.** For behavioral event data streams, you **must** map the `eventType` field of each event type group to the target DMO.

---

## 5. Web Schema Configuration

A web schema is a JSON document that defines a collection of event definitions used in Data Cloud. For any event emitted by the sitemap to successfully land in Data Cloud and be available in Data Lake Objects (DLOs) for mapping, a **corresponding schema object must exist**.

### Key Rules

- For every `eventType` defined in your sitemap, you need a **matching schema object** in the schema JSON.
- For every attribute or data point on an event, a **corresponding attribute** must exist on the related schema object.
- If you are sending events from your sitemap but not seeing data appear in Data Cloud, it is likely due to **missing attributes on the schema event definition**.

### Building Schema Alongside Your Sitemap

While building your sitemap, it's helpful to construct your schema in parallel so you can validate that events are properly registering in Data Cloud. You can deploy data streams early to help with event validation via Data Explorer — you don't need to wait until sitemapping is completely done.

> **💡 Tip:** As you add schema objects, you'll need to update the data streams to view the new events in Data Cloud. Deploy data streams progressively as you build out your sitemap.

---

## 6. Deploy Website Data Streams

With your web connector set up and sitemap/schema ready, create the data streams that will flow events from your website into Data Cloud.

### Steps

1. In Data Cloud, navigate to the **Data Streams** tab and click **New**.
2. Under **Connected Sources**, click **Website** and then click **Next**.
3. From the **Website** dropdown, select the website connector you configured.
4. Select the events you'd like to capture from your website and click **Next**.
5. Review and verify the events and their associated fields.
6. Click **Next**.
7. If you have more than one data space, select the target data space from the **Data Space** dropdown.
8. For every profile event, set the **Refresh Mode** to **Partial** using the dropdown.
9. Click **Deploy**.

### Key Considerations

| Setting | Details |
|---|---|
| **Data Stream Components** | When you select your website connector and click Next, you see all event definitions from your web schema. Select all events you want to map to DMOs. If you add new schema definitions later, return to this page to include them. |
| **Data Space Selection** | Choose the data space where you want these data streams to reside. Data streams can be shared to additional data spaces later — sharing does not duplicate consumption. |
| **Partial vs. Incremental Refresh** | **Always use Partial refresh mode** for web data streams. Incremental mode overwrites/clears any values not included on the event and should not be used for web implementations. Partial mode is the default. |
| **Filters** | Optional criteria to filter out certain events from flowing to a data space. |

> **🚨 Warning:** Using **Incremental** refresh mode for web data streams will cause values to be overwritten or cleared on each event. Always use **Partial** mode for web implementations.

> **📝 Note:** A single data stream with the category **Engagement** consolidates all behavioral/engagement events, while each profile event gets its own data stream with the category **Profile**.

---

## 7. Map DLOs to DMOs

Data ingested by all data streams is written to **Data Lake Objects (DLOs)**. After creating your data streams, map the DLO fields to the corresponding **Data Model Objects (DMOs)**.

### How to Start Mapping

1. Navigate to the **Data Stream** detail page for your newly created data stream.
2. Click **Start Data Mapping**.
3. You'll see a field mapping canvas displaying your DLOs and target DMOs.
4. Click the name of a DLO field and connect it to the desired DMO field.

### Key Mapping Considerations

- **Schema Object to DMO Cardinality:** The `All Event Data` object in the data stream can be mapped to multiple DMOs. All other schema objects must be **1:1** mapped to DMOs. Mapping a schema object to multiple DMOs can cause data to be overwritten.
- **Single Field to Multiple DMO Fields:** It is possible to map one DLO field to multiple fields on a **single** DMO (e.g., `dateTime` → `Created Date` and `Engagement Date Time`).
- **Auto-Mapping:** Web schema fields with a `masterLabel` that exactly matches a DMO field label will be **automatically mapped**, saving significant manual effort.

> **💡 Tip:** See [DLO-DMO Mapping & Identity Resolution](dlo-dmo-mapping-ir.md) for a progressive mapping strategy that simplifies this process by handling one event type at a time.

### Common Field Mappings

These fields appear across most schema objects and follow standard mapping patterns:

| Schema Field (DLO) | DMO Field | Notes |
|---|---|---|
| `dateTime` | Created Date | Maps to Created Date on all engagement and profile DMOs |
| `deviceId` | Individual ID | The device-level identifier used to associate events with an individual. For identity data streams, also maps to Party ID. |
| `eventId` | DMO Primary Key | Unique event identifier → engagement object primary key (e.g., Product Browse Engagement ID) |
| `eventType` | Engagement Channel Type | Identifies the type of engagement event |
| `interactionName` | Engagement Channel Action | The action performed (e.g., "product_view", "add_to_cart") |
| `personalizationID` | Personalization | Links the event back to a personalization decision for attribution |

### Behavioral Events Data Mapping

Map fields from your website connector's behavioral events DLO to the DMO. The table below shows the full recommended mapping:

| DLO Section | DLO Field | Target DMO | DMO Field |
|---|---|---|---|
| **All Event Data** | `dateTime` | Product Browse Engagement | Created Date |
| | | Product Browse Engagement | Engagement Date Time |
| | | Shopping Cart Engagement | Created Date |
| | | Shopping Cart Engagement | Engagement Date Time |
| | | Shopping Cart Product Engagement | Created Date |
| | | Product Order Engagement | Created Date |
| | | Product Order Engagement | Engagement Date Time |
| | `deviceId` | Product Browse Engagement | Individual |
| | | Shopping Cart Engagement | Individual |
| | | Shopping Cart Product Engagement | Individual |
| | | Product Order Engagement | Individual |
| | `eventId` (PK) | Product Browse Engagement | Product Browse Engagement ID (PK) |
| | | Shopping Cart Engagement | Shopping Cart Engagement ID (PK) |
| | | Shopping Cart Product Engagement | Shopping Cart Engagement ID (PK) |
| | | Product Order Engagement | Product Order Engagement ID (PK) |
| **Cart** | `eventType` | Shopping Cart Engagement | Engagement Type |
| | `interactionName` | Shopping Cart Engagement | Engagement Channel Action |
| **Cart Item** | `catalogObjectId` | Shopping Cart Product Engagement | Product |
| | `catalogObjectType` | Shopping Cart Product Engagement | Product Category |
| | `currency` | Shopping Cart Product Engagement | Currency |
| | `price` | Shopping Cart Product Engagement | Product Price |
| | `quantity` | Shopping Cart Product Engagement | Product Quantity |
| | `eventType` | Shopping Cart Product Engagement | Engagement Type |
| **Catalog** | `id` | Product Browse Engagement | Product |
| | `interactionName` | Product Browse Engagement | Engagement Channel Action |
| | `productSku` | Product Browse Engagement | Product SKU |
| | `personalizationId` | Product Browse Engagement | Personalization |
| | `personalizationContentId` | Product Browse Engagement | Personalization Content |
| | `eventType` | Product Browse Engagement | Engagement Type |
| **Order** | `eventType` | Product Order Engagement | Engagement Type |
| | `interactionName` | Product Order Engagement | Engagement Channel Action |
| | `orderId` | Product Order Engagement | Correlation ID |
| | `orderTotalValue` | Product Order Engagement | Adjusted Total Product Amount |
| | `orderTotalValue` | Product Order Engagement | Total Product Amount |

> **📝 Note:** The **Consent Log** and **Order Item** DLO sections are **not mapped** in the standard recommended mapping.

### Contact Point Email Data Mapping

| DLO Field | DMO Field |
|---|---|
| `dateTime` | Created Date |
| `deviceId` (PK) | Contact Point Email ID (PK), Party |
| `email` | Email Address |

### Contact Point Phone Data Mapping

| DLO Field | DMO Field |
|---|---|
| `dateTime` | Created Date |
| `deviceId` (PK) | Contact Point Phone ID (PK), Party |
| `phoneNumber` | Telephone Number |

### Identity Data Mapping

| DLO Field | DMO Field |
|---|---|
| `dateTime` | Created Date |
| `deviceId` (PK) | Individual ID (PK) |
| `firstName` | First Name |
| `isAnonymous` | Is Anonymous |
| `lastName` | Last Name |
| `userName` | External Record ID |

### Party Identification Data Mapping

| DLO Field | DMO Field |
|---|---|
| `dateTime` | Created Date |
| `deviceId` (PK) | Party, Party Identification ID (PK) |
| `IDName` | Identification Name |
| `IDType` | Party Identification Type |
| `userId` | Identification Number |

> **📝 Note:** Don't map fields in your website connector's **Contact Point Address** DLO to a DMO.

---

## Summary Checklist

Use this checklist to confirm you've completed all web data capturing steps:

- [ ] **Website connector created** — One connector per website domain
- [ ] **Event schema uploaded** — Recommended schema or custom schema covering your use cases
- [ ] **Interactions SDK installed** — CDN script added to `<head>`, SDK initialized with consent config
- [ ] **Sitemap built and uploaded** — Page types, content zones, engagement events, and profile events defined
- [ ] **Web schema configured** — Schema objects match every `eventType` in your sitemap
- [ ] **Data streams deployed** — All event definitions selected, Partial refresh mode set
- [ ] **DLO-to-DMO mapping complete** — All behavioral and profile data streams mapped to the correct DMOs

---

## What's Next?

If you also need to capture data from a mobile app, continue to [Mobile Data Capturing](mobile-data-capturing.md). Otherwise, proceed to [DLO-DMO Mapping & Identity Resolution](dlo-dmo-mapping-ir.md) for a deeper dive into mapping strategies and identity resolution configuration.

**[← Previous: Data Capturing & Modeling Overview](overview.md)** | **[Next: Mobile Data Capturing →](mobile-data-capturing.md)**

---

## Additional Resources

- [Salesforce Help: Data Mapping](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_mapping.htm)
- [Salesforce Help: Data Streams](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_streams.htm)
- [Salesforce Interactions SDK: Sitemap](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_sitemap.htm)
- [Salesforce Interactions SDK: Capture Web Interactions](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_salesforce_interactions_web_sdk.htm)
- [Salesforce Interactions SDK: Consent](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_consent.htm)
- [Download: Recommended Web Connector Schema (JSON)](https://cdn.c360a.salesforce.com/cdp/schemas/250/web-connector-schema.json)
