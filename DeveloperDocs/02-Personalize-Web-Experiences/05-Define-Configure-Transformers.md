# Define and Configure Transformers

> Source: https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/define-configure-transformers.html

Transformers enable you to convert personalization data that you receive in a JSON format from the Decisioning API into dynamic HTML. Personalization currently supports [Handlebars](https://handlebarsjs.com/)-based transformers that use the Handlebars templating language to convert personalized JSON data, such as product or content recommendations, so that you can later inject that data into the HTML structure of your website.

## Handlebars Transformer Structure

```javascript
{
    name: 'YourTransformerName',       // A unique name for your transformer
    transformerType: 'Handlebars',     // Specifies that this is a Handlebars transformer
    lastModifiedDate: 0,               // Optional, a timestamp used for tracking updates
    substitutionDefinitions: {
        // Define substitution strings mapped to fields in the Decisioning API response
    },
    transformerTypeDetails: {
        html: `<!-- Your Handlebars template goes here -->`
    }
}
```

| Field | Description |
|---|---|
| `name` | The unique name of the transformer. |
| `transformerType` | Specifies the transformer type. |
| `lastModifiedDate` | Optional. A timestamp used to track updates to the transformer. |
| `substitutionDefinitions` | A set of key-value pairs that define placeholders in the template that are replaced with actual values when the template is rendered. |
| `transformerTypeDetails` | Contains the HTML template and the logic for rendering the content. The template can use Handlebars helpers like `{{#each}}` and `{{subVar}}`. |

## Configure a Handlebars Transformer

### 1. Define the Transformer Object

```javascript
{
    name: 'YourTransformerName',
    transformerType: 'Handlebars',
    lastModifiedDate: 0,
    substitutionDefinitions: {
        // Your substitution definitions
    },
    transformerTypeDetails: {
        html: `<!-- Your Handlebars template goes here -->`
    }
}
```

### 2. Add Substitution Definitions

Substitution definitions are key-value pairs that map user-friendly variable names as placeholders in your transformers to fields in the Decisioning API response.

Example – given a Decisioning API response containing product data:

```javascript
"personalizations": [
   {
      "personalizationId": "96c4a971-71f5-4779-a82d-2c72dfa964fe",
      "personalizationPointName": "home_recommendations",
      "attributes" : {
         "introText" : "Recommended For You",
      },
      "data": [
            {
               "ssot__Id__c": "6010042",
               "ssot__Name__c": "GoBrew Connected Coffee Machine",
               "ssot__Image__c": "https://www.northerntrailoutfitters.com/dw/image/go-brew.jpg",
               "personalizationContentId": "96c4a971-71f5-4779-a82d-2c72dfa964fe:0"
            }
      ]
   }
]
```

Define substitution definitions:

```javascript
substitutionDefinitions: {
  introText: { defaultValue: '[attributes].[introText]' },
  recs: { defaultValue: '[data]' },
  name: { defaultValue: '[ssot__Name__c]' },
  image: { defaultValue: '[ssot__Image__c]' }
}
```

- `introText` is mapped to `[attributes].[introText]` – introductory text.
- `recs` is mapped to `[data]` – a list of recommended items.
- `name` is mapped to `ssot__Name__c` – item names.
- `image` is mapped to `ssot__Image__c` – image URLs.

For each substitution, define a `defaultValue` that maps the substitution string with a field from the Decisioning API response.

### 3. Create the Handlebars Template

Within `transformerTypeDetails`, write the Handlebars HTML that is rendered on the website:

```javascript
{
  name: 'KnowledgeArticlesRecsTransformer',
  transformerType: 'Handlebars',
  lastModifiedDate: 0,
  substitutionDefinitions: {
      introText: { defaultValue: '[attributes].[introText]'},
      recs: { defaultValue: '[data]' },
      name: { defaultValue: '[ssot__Name__c]' },
      image: { defaultValue: '[ssot__URL__c]' }
  },
  transformerTypeDetails: {
      html: `
          <div>
              <h1> {{subVar 'introText'}} </h1>
              {{#each (subVar 'recs')}}
                  <img src="{{subVar 'image' }}">
                  <h2> {{subVar 'name'}} </h2>
              {{/each}}
          </div>
      `
  }
}
```

## Example Transformers

> **Important:** The Decisioning API response fields used in the `substitutionDefinitions` of these transformers are for illustrative purposes only. Ensure that you compare the fields used in these example transformers with the fields in your Decisioning API response and adjust them wherever necessary.

### Simple Recommendations

This transformer generates a carousel of product recommendations.

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
            <div class="sfdcep-recs-item" >
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

### Simple Hero

This transformer generates a hero banner with a call to action.

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
              .sfdcep-banner { margin: 0px auto; width: 100%; min-height: 600px; display: flex; flex-flow: column wrap; justify-content: center; font-family: Arial, Helvetica, sans-serif; }
              .sfdcep-banner-header { font-size: 32px; padding-bottom: 40px; font-weight: 600; color: #DDDDDD; text-align: center; }
              .sfdcep-banner-subheader { font-size: 20px; font-weight: 400; color: #DDDDDD; text-align: center; padding-bottom: 40px; }
              .sfdcep-banner-cta { text-align: center; }
              .sfdcep-banner-cta a { padding: 10px 20px; display: inline-block; background-color: #097fb3; border-radius: 20px; color: #DDDDDD; text-decoration: none; font-weight: 400; font-size: 18px; }
          </style>
          <div class="sfdcep-banner" style="background: url('{{subVar 'BackgroundImageUrl'}}') no-repeat top left;">
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

### Simple Overlay

This transformer generates an overlay banner with a call to action.

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
              .sfdcep-overlay { background-color: rgba(0,0,0,0.7); position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 256; }
              .sfdcep-overlay-banner { margin: 0px auto; margin-top: 256px; width: 500px; height: 500px; background-color: white; display: flex; flex-flow: column wrap; justify-content: center; font-family: Arial, Helvetica, sans-serif; }
              .sfdcep-overlay-header { font-size: 32px; padding-bottom: 40px; font-weight: 600; color: #DDDDDD; text-align: center; }
              .sfdcep-overlay-subheader { font-size: 20px; font-weight: 400; color: #DDDDDD; text-align: center; padding-bottom: 40px; }
              .sfdcep-overlay-cta { text-align: center; }
              .sfdcep-overlay-cta a { padding: 10px 20px; display: inline-block; background-color: #097fb3; border-radius: 20px; color: #DDDDDD; text-decoration: none; font-weight: 400; font-size: 18px; }
          </style>
          <div class="sfdcep-overlay" onclick="document.body.removeChild(document.querySelector('.sfdcep-overlay'))">
              <div class="sfdcep-overlay-banner" style="background: url('{{subVar 'BackgroundImageUrl'}}') no-repeat top left;">
                  <div class="sfdcep-overlay-header">{{subVar 'Header'}}</div>
                  <div class="sfdcep-overlay-subheader">{{subVar 'Subheader'}}</div>
                  <div class="sfdcep-overlay-cta">
                      <a href="{{subVar 'CallToActionUrl'}}">{{subVar 'CallToActionText'}}</a>
                  </div>
              </div>
          </div>
      `
  }
}
```
