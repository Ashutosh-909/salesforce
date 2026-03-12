# Request Personalization Through the Sitemap

> Source: https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/request-personalization-through-sitemap.html

The Personalization property of the `SalesforceInteractions` object enables you to interact with the Decisioning API and request for one or more personalizations for personalization points on your Sitemap.

To fetch personalized data, call the `fetch` method on the `Personalization` property. The `fetch` method accepts an array of personalization point names as parameters.

## Configuring the Data Space

If you have more than one data space, you must define a data space you'd like to use in the `fetch` method within the `SalesforceInteractions.init` function. If you don't define a data space, the `fetch` method uses the `default` dataspace.

```javascript
SalesforceInteractions.init({
  consents: [],
  personalization: {
    dataspace: "personalizationDemo",
  },
});
```

## Fetching Personalized Data

```javascript
SalesforceInteractions.Personalization.fetch(["home_recommendations", "home_hero"]).then(
  (personalizationResponse) => {
    // Custom logic to render personalization on the website
    console.log("Personalization Response", personalizationResponse);
  },
);
```

The `fetch` method returns a Promise. After the Promise is resolved, the arrow function `(personalizationResponse) => { ... }` is executed. Within the arrow function, you can implement your own custom logic to render the fetched personalized data on your website.

## Example Response

The `personalizationResponse` object represents the response received from the Decisioning API. For successful personalizations, the response object contains personalized data for the personalization points specified in the request.

```json
"personalizations": [
   {
      "personalizationId": "96c4a971-71f5-4779-a82d-2c72dfa964fe",
      "requestId": "c73e348d-3336-4ed4-90f5-c3ed63280e10",
      "individualId": "ba8f56683e2ca01c",
      "dataSpace": "default",
      "personalizationPointId": "9ppSG00000004I9YAI",
      "personalizationPointName": "home_recommendations",
      "dmoName": "ssot__GoodsProduct__dlm",
      "data": [
            {
               "ssot__IsSellable__c": "Y",
               "ssot__BrandId__c": "NTO",
               "ssot__Id__c": "6010042",
               "ssot__DataSourceId__c": "nto_product_data",
               "ImageUrl__c": "https://www.northerntrailoutfitters.com/dw/image/v2/BDPX_PRD/on/demandware.static/-/Sites-nto-alpine-nutrition/default/dwf19b5e9c/images/hi-res/go-brew.jpg",
               "personalizationContentId": "96c4a971-71f5-4779-a82d-2c72dfa964fe:0",
               "PurchaseUrl__c": "https://www.northerntrailoutfitters.com/default/gobrew-connected-coffee-machine-6010042.html",
               "ssot__PrimaryProductCategory__c": "Coffee Machines",
               "ssot__Name__c": "GoBrew Connected Coffee Machine",
               "ssot__ProductSKU__c": "6010042",
               "GoodsProductSales__cio": "[{TotalSoldUnits__c=43.0, ProductId__c=6010042}]"
            }
      ]
   }
]
```
