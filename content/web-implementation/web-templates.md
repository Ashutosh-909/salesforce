# Web Templates (Transformers)

**Web templates** — also called **transformers** — convert personalization data received as JSON from the Decisioning API into **dynamic HTML** that renders on your website. Salesforce Personalization currently supports [Handlebars](https://handlebarsjs.com/)-based transformers.

Templates are configured by developers, stored in the sitemap, and then accessible by business users when they apply personalization experiences via the [Web Personalization Manager](web-personalization-manager.md).

> **📝 Note:** Templates are helpful for handling common use cases (recommendation carousels, hero banners, overlays), but they are **not required**. Business users can also use the WPM to perform simple string substitution directly on website elements without a template.

---

## Handlebars Transformer Structure

Every transformer follows this structure:

```javascript
{
    name: 'YourTransformerName',       // A unique name for your transformer
    transformerType: 'Handlebars',     // Specifies that this is a Handlebars transformer
    lastModifiedDate: 0,               // Optional timestamp for tracking updates
    substitutionDefinitions: {
        // Key-value pairs mapping template variables to decision response fields
    },
    transformerTypeDetails: {
        html: `<!-- Your Handlebars template goes here -->`
    }
}
```

### Field Reference

| Field | Description |
|---|---|
| `name` | The unique name of the transformer. Business users see this name in the WPM. |
| `transformerType` | Must be `'Handlebars'`. |
| `lastModifiedDate` | Optional. A timestamp used to track updates. Commonly set to `new Date().getTime()` or `0`. |
| `substitutionDefinitions` | Key-value pairs that define placeholders in the template. Each key is a variable name; its `defaultValue` maps to a field in the Decisioning API response. |
| `transformerTypeDetails` | Contains the `html` property with the Handlebars template string. Uses Handlebars helpers like `{{#each}}` and `{{subVar}}`. |

---

## Substitution Definitions

Substitution definitions map user-friendly variable names to fields in the Decisioning API response. Each definition has a `defaultValue` that uses bracket notation to reference response fields.

### Mapping Syntax

| Pattern | Maps To |
|---|---|
| `[attributes].[fieldName]` | A field in the `attributes` object of the response (personalization attributes from the response template) |
| `[data]` | The `data` array containing recommended items |
| `[ssot__Name__c]` | A specific field on each item in the `data` array |

### Example

Given this Decisioning API response:

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
          "personalizationContentId": "96c4a971-...:0"
        }
      ]
    }
  ]
}
```

Define substitution definitions:

```javascript
substitutionDefinitions: {
    introText: { defaultValue: '[attributes].[introText]' },
    recs: { defaultValue: '[data]' },
    name: { defaultValue: '[ssot__Name__c]' },
    image: { defaultValue: '[ImageUrl__c]' }
}
```

- `introText` → maps to the `introText` attribute
- `recs` → maps to the `data` array (list of recommended items)
- `name` → maps to each item's `ssot__Name__c` field
- `image` → maps to each item's `ImageUrl__c` field

---

## Writing the Handlebars Template

The `transformerTypeDetails.html` property contains your Handlebars template. Use the `{{subVar}}` helper to reference substitution definitions:

```html
<div>
    <h1>{{subVar 'introText'}}</h1>
    {{#each (subVar 'recs')}}
        <img src="{{subVar 'image'}}">
        <h2>{{subVar 'name'}}</h2>
    {{/each}}
</div>
```

### Key Handlebars Helpers

| Helper | Usage | Description |
|---|---|---|
| `{{subVar 'varName'}}` | Anywhere | Outputs the value of a substitution definition |
| `{{#each (subVar 'arrayVar')}}` | Loops | Iterates over an array substitution (like `data`) |
| `{{#if (subVar 'varName')}}` | Conditionals | Renders content only if the value is truthy |

> **⚠️ Important:** The fields used in `substitutionDefinitions` must match the actual field names in your Decisioning API response. Always verify your field names against a real response before deploying a template.

---

## Example Transformers

The examples below demonstrate common template patterns. Adapt the `substitutionDefinitions` field names to match your own Decisioning API response.

### SimpleRecs — Product Recommendations Carousel

A responsive carousel displaying recommended products with image, name, and price.

```javascript
{
  name: "SimpleRecs",
  transformerType: "Handlebars",
  lastModifiedDate: new Date().getTime() - (1000 * 60 * 60 * 36),
  substitutionDefinitions: {
      recs: { defaultValue: '[data]' },
      image: { defaultValue: '[ImageURL__c]' },
      name: { defaultValue: '[ssot__Name__c]' },
      price: { defaultValue: '[UnitPrice__c]' }
  },
  transformerTypeDetails: {
    html: `
        <style>
            .sfdcep-recs-carousel {
                width: 100%;
                max-width: 1440px !important;
                margin: 0px auto;
                display: flex;
                justify-content: space-evenly;
                flex-flow: row wrap;
                padding: 20px 0px !important;
            }
            .sfdcep-recs-item {
                margin: 0 !important;
                width: 25%;
                min-width: 250px;
                color: #393939;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 15px;
            }
            .sfdcep-recs-item-img { text-align: center; }
            .sfdcep-recs-item-img img {
                width: 90%;
                max-height: 320px;
                max-width: 320px;
            }
            .sfdcep-recs-item-name { padding-top: 10px; }
            .sfdcep-recs-item-name a {
                color: #393939;
                text-decoration: none;
                font-weight: 600;
            }
            .sfdcep-recs-item-price { padding-top: 10px; }
            .sfdcep-recs-item-rating {
                color: #097fb3;
                letter-spacing: 3px;
                padding-top: 10px;
            }
        </style>
        <div class="sfdcep-recs-carousel">
            {{#each (subVar 'recs')}}
            <div class="sfdcep-recs-item">
                <div class="sfdcep-recs-item-img">
                    {{#if (subVar 'image')}}
                        <img src="{{subVar 'image'}}" />
                    {{else}}
                        <img src="https://placehold.co/320x320/white/blue?text=*" />
                    {{/if}}
                </div>
                <div class="sfdcep-recs-item-name">
                    <a href="#">{{subVar 'name'}}</a>
                </div>
                <div class="sfdcep-recs-item-price">
                    {{#if (subVar 'price')}}
                        $ {{subVar 'price'}}
                    {{else}}
                        Out-of-stock
                    {{/if}}
                </div>
                <div class="sfdcep-recs-item-rating"> ★★★★★ </div>
            </div>
            {{/each}}
        </div>
    `
  }
}
```

### SimpleHero — Hero Banner with CTA

A full-width hero banner with background image, heading, subheading, and call-to-action button. Ideal for Manual Content personalization.

```javascript
{
  name: "SimpleHero",
  transformerType: "Handlebars",
  lastModifiedDate: new Date().getTime() - (1000 * 60 * 60 * 36),
  substitutionDefinitions: {
      BackgroundImageUrl: { defaultValue: '[attributes].[BackgroundImageUrl]' },
      Header: { defaultValue: '[attributes].[Header]' },
      Subheader: { defaultValue: '[attributes].[Subheader]' },
      CallToActionUrl: { defaultValue: '[attributes].[CallToActionUrl]' },
      CallToActionText: { defaultValue: '[attributes].[CallToActionText]' }
  },
  transformerTypeDetails: {
      html: `
          <style>
              .sfdcep-banner {
                  margin: 0px auto; width: 100%; min-height: 600px;
                  display: flex; flex-flow: column wrap; justify-content: center;
                  font-family: Arial, Helvetica, sans-serif;
              }
              .sfdcep-banner-header {
                  font-size: 32px; padding-bottom: 40px; font-weight: 600;
                  color: #DDDDDD; text-align: center;
              }
              .sfdcep-banner-subheader {
                  font-size: 20px; font-weight: 400; color: #DDDDDD;
                  text-align: center; padding-bottom: 40px;
              }
              .sfdcep-banner-cta { text-align: center; }
              .sfdcep-banner-cta a {
                  padding: 10px 20px; display: inline-block;
                  background-color: #097fb3; border-radius: 20px;
                  color: #DDDDDD; text-decoration: none;
                  font-weight: 400; font-size: 18px;
              }
          </style>
          <div class="sfdcep-banner"
               style="background: url('{{subVar 'BackgroundImageUrl'}}') no-repeat top left;">
              <div class="sfdcep-banner-header">{{subVar 'Header'}}</div>
              <div class="sfdcep-banner-subheader">{{subVar 'Subheader'}}</div>
              <div class="sfdcep-banner-cta">
                  <a href="{{subVar 'CallToActionUrl'}}">{{subVar 'CallToActionText'}}</a>
              </div>
          </div>
      `
  }
}
```

### SimpleOverlay — Pop-Up Overlay with CTA

A full-screen overlay with a centered modal containing a background image, heading, subheading, and CTA. Clicking anywhere outside the modal dismisses it.

```javascript
{
  name: "SimpleOverlay",
  transformerType: "Handlebars",
  lastModifiedDate: new Date().getTime() - (1000 * 60 * 60 * 36),
  substitutionDefinitions: {
      BackgroundImageUrl: { defaultValue: '[attributes].[BackgroundImageUrl]' },
      Header: { defaultValue: '[attributes].[Header]' },
      Subheader: { defaultValue: '[attributes].[Subheader]' },
      CallToActionUrl: { defaultValue: '[attributes].[CallToActionUrl]' },
      CallToActionText: { defaultValue: '[attributes].[CallToActionText]' }
  },
  transformerTypeDetails: {
      html: `
          <style>
              .sfdcep-overlay {
                  background-color: rgba(0,0,0,0.7);
                  position: fixed; top: 0; bottom: 0; left: 0; right: 0;
                  z-index: 256;
              }
              .sfdcep-overlay-banner {
                  margin: 0px auto; margin-top: 256px;
                  width: 500px; height: 500px; background-color: white;
                  display: flex; flex-flow: column wrap; justify-content: center;
                  font-family: Arial, Helvetica, sans-serif;
              }
              .sfdcep-overlay-header {
                  font-size: 32px; padding-bottom: 40px; font-weight: 600;
                  color: #333333; text-align: center;
              }
              .sfdcep-overlay-subheader {
                  font-size: 20px; font-weight: 400; color: #666666;
                  text-align: center; padding-bottom: 40px;
              }
              .sfdcep-overlay-cta { text-align: center; }
              .sfdcep-overlay-cta a {
                  padding: 10px 20px; display: inline-block;
                  background-color: #097fb3; border-radius: 20px;
                  color: #FFFFFF; text-decoration: none;
                  font-weight: 400; font-size: 18px;
              }
          </style>
          <div class="sfdcep-overlay"
               onclick="document.body.removeChild(document.querySelector('.sfdcep-overlay'))">
              <div class="sfdcep-overlay-banner"
                   style="background: url('{{subVar 'BackgroundImageUrl'}}') no-repeat top left;">
                  <div class="sfdcep-overlay-header">{{subVar 'Header'}}</div>
                  <div class="sfdcep-overlay-subheader">{{subVar 'Subheader'}}</div>
                  <div class="sfdcep-overlay-cta">
                      <a href="{{subVar 'CallToActionUrl'}}">
                          {{subVar 'CallToActionText'}}
                      </a>
                  </div>
              </div>
          </div>
      `
  }
}
```

---

## Registering Templates in the Sitemap

Templates are registered during Personalization module initialization, **before** `SalesforceInteractions.init` is called:

```javascript
SalesforceInteractions.Personalization.Config.initialize({
    additionalTransformers: [SimpleRecs, SimpleHero, SimpleOverlay],
    // ... other config options
});

SalesforceInteractions.init({
    consents: [],
    // ...
});
```

> **⚠️ Important:** The `SalesforceInteractions.Personalization.Config.initialize` call must happen **before** `SalesforceInteractions.init`. This ensures templates are available when the Personalization module starts processing experiences.

---

## Content Zone Handlers for Modern Frameworks

Traditional DOM manipulation by the SDK can conflict with the virtual DOM or rendering strategies of modern frameworks (React, Vue, Angular). Instead of using Handlebars transformers, use **content zone handlers** to deliver personalized content through your framework's own rendering methods.

### Registering a Content Zone Handler

```javascript
SalesforceInteractions.Personalization.Config.ContentZoneHandler.set(
    "home_banner",  // Unique name for the content zone handler
    {
        label: "Home Banner",         // Friendly name shown in WPM
        path: "#home-banner-element", // CSS selector for WPM highlighting
        onReady: (content, metadata) => {
            // Called when personalized content is ready
            // Use your framework's state management to render
        },
        onRevert: (metadata) => {
            // Called when preview is cancelled in WPM
            // Revert to original, non-personalized content
        }
    }
);
```

### ContentZoneHandler Properties

| Property | Required | Description |
|---|---|---|
| `onReady` | Yes | Called when personalized content is ready for rendering. Receives the content and metadata as parameters. |
| `onRevert` | No (recommended) | Called when a WPM preview is cancelled. Should revert to original content. |
| `label` | No | User-friendly name displayed in WPM. Defaults to the handler name. |
| `path` | No | CSS selector for WPM to visually highlight the content zone. |
| `onHighlight` | No | Custom highlight logic for WPM. Use only when `path` doesn't work (e.g., Shadow DOM). |

> **⚠️ Important:** Don't define both `path` and `onHighlight` at the same time.

### React Example

```jsx
import React, { useEffect, useState } from "react";

export const PersonalizationContentHandler = ({
    children,
    contentZoneName,
    contentZoneLabel
}) => {
    const [personalizedContent, setPersonalizedContent] = useState(undefined);
    const [elementId, setElementId] = useState(undefined);

    useEffect(() => {
        setElementId(`__sf_personalization_contentzonehandler_${contentZoneName}`);

        window.SalesforceInteractions.Personalization.Config.ContentZoneHandler.set(
            contentZoneName,
            {
                label: contentZoneLabel,
                path: `#${elementId}`,
                onReady: (content) => {
                    setPersonalizedContent(content);
                },
                onRevert: () => {
                    setPersonalizedContent(undefined);
                },
            }
        );

        return () => {
            window.SalesforceInteractions.Personalization.Config.ContentZoneHandler.set(
                contentZoneName,
                { onReady: () => {} }
            );
        };
    });

    if (personalizedContent) {
        return (
            <div
                id={elementId}
                dangerouslySetInnerHTML={{ __html: personalizedContent }}
            />
        );
    } else {
        return <div id={elementId}>{children}</div>;
    }
};
```

### Usage in Your React App

```jsx
<PersonalizationContentHandler
    contentZoneName="ProductRecs"
    contentZoneLabel="Product Recs"
>
    <h1>Non-personalized content</h1>
    <p>This content will be replaced with personalized content</p>
</PersonalizationContentHandler>
```

When personalized content is available, the component renders it. Otherwise, the original children are displayed.

---

## Engagement Configurations

Engagement configurations allow business users to determine **where** personalization decision engagement data should be sent in Data Cloud. They are defined in the sitemap and appear for selection in the second tab of the WPM.

For example:
- Product recommendation engagement → routes to the **Product Browse** engagement DMO
- Article recommendation engagement → routes to the **Article Browse** engagement DMO

This separation ensures engagement data lands in the correct DMO for accurate attribution tracking and analytics.

For details on configuring engagement tracking, see [Web Personalization Manager](web-personalization-manager.md).

---

**Next:** [Web Personalization Manager](web-personalization-manager.md) — Learn how to use the WYSIWYG tool to apply personalization experiences to your website.
