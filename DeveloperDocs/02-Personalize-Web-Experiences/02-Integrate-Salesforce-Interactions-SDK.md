# Integrate the Salesforce Interactions SDK

> Source: https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/integrate-salesforce-interactions-sdk.html

To integrate the Salesforce Interactions SDK with your website and enable personalization capabilities:

1. Create a data space
2. Create a website connector
3. Upload your event schema
4. Install the Interactions SDK on your website
5. Create and upload a sitemap
6. Create a website data stream
7. Map website connector object fields

## Create a Data Space

You can connect Personalization to any data space, including the default data space that's provided when you install Data Cloud. Until you create additional data spaces, all Data Cloud objects are mapped to the default data space.

To segregate your brand, region, or department data and services, create additional data spaces. To create more data spaces, you need the Data Spaces add-on license.

### Steps

1. Go to Data Cloud Setup.
2. Under Data Management, click **Data Spaces**.
3. Click **New**, and give the data space a unique name.
4. Enter a unique data space prefix, starting with a letter and including up to three alphanumeric characters.

> **Note:** After you save the data space, you can't change its prefix because it becomes part of the API name used to differentiate objects that exist in multiple data spaces.

5. Add an optional description about the purpose of the data space.
6. Click **Save**.

### See Also

- [Salesforce Help: Manage Data Spaces](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_spaces.htm)
- [Salesforce Help: Create a Data Space](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_spaces_create.htm)

## Create a Website Connector

To capture website data and control the scope of data ingestion, connect your website to Data Cloud by creating a website connector.

1. Go to Data Cloud Setup.
2. Under CONFIGURATION, click **Websites & Mobile Apps**.
3. Click **New**.
4. Provide a Connector Name.
5. From the Connector Type dropdown, select **Website** and click **Save**.

## Upload Your Event Schema

With Interactions SDK, you can track various types of interactions on your website, with each interaction capturing a specific set of data. When setting up a website connector to send this data to Data Cloud, you must upload a schema file in JSON format that outlines the structure of the event data you're tracking.

The SDK provides a recommended schema file that covers common events such as adding items to a cart or viewing an item in a product catalog. This recommended schema includes mappings for:

- **Engagement Events**
  - Cart Interaction Mapping
  - Catalog Interaction Mapping
  - Order Interaction Mapping
  - Consent Event Mapping
- **Profile Events**
  - Contact Point Email Mapping
  - Contact Point Phone Mapping
  - Identity Mapping
  - Party Identification Mapping

### Steps

1. [Download the recommended schema file](https://cdn.c360a.salesforce.com/cdp/schemas/250/web-connector-schema.json) or use your own custom schema file.
2. To upload the schema file, click **Upload Schema** under the Schema block.
3. Confirm that all events and their associated fields are populated correctly.
4. Click **Save**.

After you upload the schema, examine it for accuracy.

1. To change your schema at any point, click **Update Schema**.

> **Important:** You can only add new events and fields. The schema must retain all previous events and fields.

2. To update your schema, click **Yes, Update**.
3. To view the full schema you uploaded, click **View Full Schema**.

### See Also

- Download: [Recommended Web Connector Schema (JSON)](https://cdn.c360a.salesforce.com/cdp/schemas/250/web-connector-schema.json)

## Install the Interactions SDK On Your Website

After you've created a connector for your website and configured your event schema, you can install the Interactions SDK on your website.

1. Scroll down to the Integration Guide section of the website connector setup page.
2. Copy the Content Delivery Network (CDN) URL.
3. Add the script to the `<head>` section of your website's code using a `<script>` tag.
4. Initialize the SDK using the `SalesforceInteractions.init` method, as described in the [Initialization](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_initialization.htm) section of the Salesforce Interactions SDK documentation.

### See Also

- [Capture Web Interactions](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_salesforce_interactions_web_sdk.htm)
- [Initialization](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_initialization.htm)
- [Consent](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_consent.htm)

## Create and Upload a Sitemap

The Web SDK sitemap is a JavaScript file that outlines the data capture logic across different pages of your website, based on which the SDK captures user interactions from your website during site navigation.

### Steps

1. Install the [Salesforce Interactions SDK Launcher Chrome extension](https://chromewebstore.google.com/detail/salesforce-interactions-s/mhmpepeohaddbhkhecaldflljggicedf).
2. Enable and access the Sitemap Editor on your website through the extension.
3. Use the Sitemap Editor to instrument your website's sitemap.
4. Create a JavaScript file named `sitemap.js`.
5. Copy the sitemap code you created and paste it into this file.
6. Navigate to the Sitemap section of the website connector setup page.
7. Click **Upload** and upload the `sitemap.js` file you created.
8. Review the sitemap for errors, and click **Save**.

For more information about Interactions SDK sitemaps, see the [Sitemap](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_sitemap.htm) documentation.

## Create a Website Data Stream

Now that you've set up your website connector and installed and initialized the SDK on your website, create a new data stream for your website connector.

1. In Data Cloud, navigate to the **Data Streams** tab and click **New**.
2. Under Connected Sources, click **Website** and then click **Next**.
3. From the Website dropdown, select the website connector you configured.
4. Select the events that you'd like to capture from your website and click **Next**.

> **Note:** A single data stream with the category `Engagement` consolidates all engagement events, while each profile event is individually categorized into its own data stream with the category `Profile`.

5. Review and verify the events you selected and their associated fields.
6. Click **Next**.
7. If you have more than one data space, select the data space you'd like to use with this data stream from the Data Space dropdown.
8. For every profile event you're capturing, use the Refresh Mode dropdown to select the data refresh mode as either Incremental or Partial.
9. Click **Deploy**.

## Map Website Connector Object Fields

Data ingested by all data streams is written to data lake objects (DLOs). After creating your data streams, associate your DLOs to data model objects (DMOs).

To start data mapping, access the Data Stream detail page for your newly created data stream and click **Start Data Mapping**. Doing so takes you to the field mapping canvas that displays your DLOs and target DMOs. To map one to another, click the name of a DLO and connect it to the desired DMO.

### Behavioral Events Data Mapping

Map fields in your website connector's behavioral events DLO to the DMO.

| DLO Section | DLO Field | DMO | DMO Field |
|---|---|---|---|
| All Event Data | dateTime | Product Browse Engagement | Created Date |
| | | Product Browse Engagement | Engagement Date Time |
| | | Shopping Cart Engagement | Created Date |
| | | Shopping Cart Engagement | Engagement Date Time |
| | | Shopping Cart Product Engagement | Created Date |
| | | Product Order Engagement | Created Date |
| | | Product Order Engagement | Engagement Date Time |
| | deviceId | Product Browse Engagement | Individual |
| | | Shopping Cart Engagement | Individual |
| | | Shopping Cart Product Engagement | Individual |
| | | Product Order Engagement | Individual |
| | eventId (primary key) | Product Browse Engagement | Product Browse Engagement ID (primary key) |
| | | Shopping Cart Engagement | Shopping Cart Engagement ID (primary key) |
| | | Shopping Cart Product Engagement | Shopping Cart Engagement ID (primary key) |
| | | Product Order Engagement | Product Order Engagement ID (primary key) |
| Cart | eventType | Shopping Cart Engagement | Engagement Type |
| | interactionName | Shopping Cart Engagement | Engagement Channel Action |
| Cart Item | catalogObjectId | Shopping Cart Product Engagement | Product |
| | catalogObjectType | Shopping Cart Product Engagement | Product Category |
| | currency | Shopping Cart Product Engagement | Currency |
| | price | Shopping Cart Product Engagement | Product Price |
| | quantity | Shopping Cart Product Engagement | Product Quantity |
| | eventType | Shopping Cart Product Engagement | Engagement Type |
| Catalog | id | Product Browse Engagement | Product |
| | interactionName | Product Browse Engagement | Engagement Channel Action |
| | productSku | Product Browse Engagement | Product SKU |
| | personalizationId | Product Browse Engagement | Personalization |
| | personalizationContentId | Product Browse Engagement | Personalization Content |
| | eventType | Product Browse Engagement | Engagement Type |
| Order | eventType | Product Order Engagement | Engagement Type |
| | interactionName | Product Order Engagement | Engagement Channel Action |
| | orderId | Product Order Engagement | Correlation ID |
| | orderTotalValue | Product Order Engagement | Adjusted Total Product Amount |
| | orderTotalValue | Product Order Engagement | Total Product Amount |
| Consent Log | Not mapped | Not mapped | Not mapped |
| Order Item | Not mapped | Not mapped | Not mapped |

### Contact Point Address Data Mapping

Don't map fields in your website connector's contact point address DLO to the DMO.

### Contact Point Email Data Mapping

| DLO Field | DMO Field |
|---|---|
| dateTime | Created Date |
| deviceId (primary key) | Contact Point Email ID (primary key), Party |
| email | Email Address |

### Contact Point Phone Data Mapping

| DLO Field | DMO Field |
|---|---|
| dateTime | Created Date |
| deviceId (primary key) | Contact Point Phone ID (primary key), Party |
| phoneNumber | Telephone Number |

### Identity Data Mapping

| DLO Field | DMO Field |
|---|---|
| dateTime | Created Date |
| deviceId (primary key) | Individual ID (primary key) |
| firstName | First Name |
| isAnonymous | Is Anonymous |
| lastName | Last Name |
| userName | External Record ID |

### Party Identification Data Mapping

| DLO Field | DMO Field |
|---|---|
| dateTime | Created Date |
| deviceId (primary key) | Party, Party Identification ID (primary key) |
| IDName | Identification Name |
| IDType | Party Identification Type |
| userId | Identification Number |

For more information about data mapping in Data Cloud, see [Data Mapping](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_mapping.htm).
