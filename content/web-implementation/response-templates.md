# Response Templates

A **response template** defines the configuration options available to marketers when building a personalization decision and ensures that all decision responses for a given personalization point return data in a **consistent format**.

Think of a response template as the contract between what a business user configures and what the front-end receives at run-time.

---

## How Response Templates Work

Each response template is associated with one of the two [personalization types](personalization-types.md):

- **Manual Content** — Template defines string entry fields
- **Recommendations** — Template defines string entry fields *plus* specifies which DMO fields to return

Once created, a response template is selected on a [personalization point](personalization-points.md). It then applies automatically to all decisions and experiment cohorts under that point.

> **🚨 Warning:** Once a response template is created, it is **not currently editable**. Plan your template fields carefully before creation. Additive edits are under roadmap consideration.

---

## Manual Content Response Templates

Manual Content response templates are straightforward. A business user defines a set of **personalization attributes** — string entry text fields — on the template. These attributes then appear on the personalization decision as input fields.

### How It Works — Step by Step

1. Navigate to the **Personalization** app → **Response Templates**
2. Click **New Response Template**
3. Select **Manual Content** as the personalization type
4. Define your **personalization attributes** — each attribute becomes a string entry field on the decision

### Example

Suppose you create a Manual Content response template for a **hero banner** with these attributes:

| Attribute Name | Purpose |
|---|---|
| `Header` | The main headline text |
| `Subheader` | Secondary text below the headline |
| `BackgroundImageUrl` | URL of the background image |
| `CallToActionText` | Button label (e.g., "Shop Now") |
| `CallToActionUrl` | URL the button links to |

When a business user creates a decision on a personalization point using this template, they see five text fields where they type in the values. Those values are returned in the decision response at run-time.

### Decision Response Example

```json
{
  "personalizations": [
    {
      "personalizationId": "a1b2c3d4-...",
      "personalizationPointName": "home_hero",
      "attributes": {
        "Header": "Spring Collection Is Here",
        "Subheader": "Discover the latest outdoor gear",
        "BackgroundImageUrl": "https://example.com/images/spring-hero.jpg",
        "CallToActionText": "Shop Now",
        "CallToActionUrl": "/collections/spring"
      },
      "data": []
    }
  ]
}
```

> **💡 Tip:** Manual Content templates are excellent for early implementation. Since they don't require recommenders or item DMOs, you can ship personalized banners, infobars, and pop-ups quickly.

---

## Recommendations Response Templates

Recommendations response templates have an additional step compared to Manual Content. In addition to defining personalization attributes, you must:

1. **Select a DMO** — The Data Model Object that this template is built for
2. **Choose which DMO fields** to return in the decision response

### How It Works — Step by Step

1. Navigate to the **Personalization** app → **Response Templates**
2. Click **New Response Template**
3. Select **Recommendations** as the personalization type
4. Define any **personalization attributes** (e.g., `introText` = "Recommended For You")
5. Go to the **Item Attributes** tab
6. Select the **Data Model Object** (e.g., Goods Product, Knowledge Article Version)
7. Move fields from **Available DMO Fields** to **Selected DMO Fields**
8. Save the template

### Item Attributes Tab — What Each Column Means

| Component | Description |
|---|---|
| **Data Model Object** | The DMO the template is built for. When this template is selected on a personalization point, only recommenders built against an item DG rooted on this DMO will be available. |
| **Available DMO Fields** | All mapped fields on the DMO. Select the ones you want returned in the decision response. |
| **Selected DMO Fields** | Fields that will be included in the response. The primary key is selected by default. |

> **⚠️ Important:** Only DMOs that have an **item data graph** built on top of them are available for selection. Recommenders require item data graphs for creation.

> **⚠️ Important:** For a DMO field to actually appear in a decision response, it must be **both** selected on the response template **and** included as an attribute on the item data graph. If a field is selected here but not on the DG, it won't be returned.

### Example

For a **Goods Product** recommendations template, you might select:

| Selected DMO Field | Purpose |
|---|---|
| `ssot__Id__c` | Product ID (selected by default) |
| `ssot__Name__c` | Product name |
| `ImageUrl__c` | Product image URL |
| `UnitPrice__c` | Product price |
| `PurchaseUrl__c` | Link to the product detail page |
| `ssot__PrimaryProductCategory__c` | Product category |

### Decision Response Example

```json
{
  "personalizations": [
    {
      "personalizationId": "96c4a971-...",
      "personalizationPointName": "home_recommendations",
      "attributes": {
        "introText": "Recommended For You"
      },
      "data": [
        {
          "ssot__Id__c": "6010042",
          "ssot__Name__c": "GoBrew Connected Coffee Machine",
          "ImageUrl__c": "https://example.com/images/go-brew.jpg",
          "UnitPrice__c": "299.99",
          "PurchaseUrl__c": "/products/gobrew-6010042",
          "ssot__PrimaryProductCategory__c": "Coffee Machines",
          "personalizationContentId": "96c4a971-...:0"
        },
        {
          "ssot__Id__c": "6010089",
          "ssot__Name__c": "Alpine Pro Hiking Boots",
          "ImageUrl__c": "https://example.com/images/alpine-boots.jpg",
          "UnitPrice__c": "189.99",
          "PurchaseUrl__c": "/products/alpine-boots-6010089",
          "ssot__PrimaryProductCategory__c": "Footwear",
          "personalizationContentId": "96c4a971-...:1"
        }
      ]
    }
  ]
}
```

> **📝 Note:** Each item in the `data` array includes a `personalizationContentId`. This value connects engagement tracking (views, clicks) back to a specific recommended item in the personalization log for attribution analytics.

---

## Choosing Which Fields to Expose

When selecting DMO fields for a Recommendations template, think carefully about what data your front-end needs to render the experience:

**Include:**
- Item name, image URL, description — for rendering
- Price, category, rating — for display
- ID, purchase URL — for navigation and tracking

**Avoid:**
- Internal cost, margin, or profit data — sensitive information exposed to the client
- System fields not needed for rendering — keeps the response payload lean

---

## Applying a Response Template to a Personalization Point

Once your response templates are created, you apply them when creating a [personalization point](personalization-points.md):

1. On the personalization point creation modal, select the **personalization type** (Manual Content or Recommendations)
2. The list of available response templates is filtered to show only templates matching the selected data space and personalization type
3. Select the appropriate response template
4. The template is automatically applied to all decisions and experiment cohorts on that point

---

**Next:** [Personalization Points](personalization-points.md) — Learn how to create the decision endpoints that map to parts of your experience.
