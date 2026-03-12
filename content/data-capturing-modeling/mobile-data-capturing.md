# Mobile Data Capturing

This section covers how to capture real-time user interactions from your native mobile app (iOS and Android) and send them to Data Cloud. The overall flow mirrors the web data capturing process — create a connector, upload a schema, integrate the SDK, and deploy data streams — but adapted for the mobile context.

> **📝 Note:** Acronyms used in this section — **SDK** = Software Development Kit, **DLO** = Data Lake Object, **DMO** = Data Model Object, **DC** = Data Cloud, **SPM** = Swift Package Manager.

> **🔍 Needs Validation:** Mobile SDK features and APIs evolve rapidly. The content in this section is authored based on the web SDK patterns documented in the core implementation guide and general Salesforce Mobile SDK conventions. Verify all code examples and configuration steps against the [latest official Salesforce Mobile SDK documentation](https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/personalize-mobile-experiences.html) before implementing in production.

---

## Overview

Mobile data capturing follows a similar pattern to web data capturing:

1. Create a Mobile App Connector
2. Upload a Mobile Event Schema
3. Integrate the SDK (iOS or Android)
4. Configure Mobile Event Tracking
5. Deploy Mobile Data Streams

---

## 1. Create a Mobile App Connector

A mobile app connector links your native mobile application to Data Cloud, similar to how a website connector links a website.

### Steps

1. Navigate to **Data Cloud Setup**.
2. Under **CONFIGURATION**, click **Websites & Mobile Apps**.
3. Click **New**.
4. Provide a **Connector Name** (e.g., "NTO iOS App" or "NTO Mobile").
5. From the **Connector Type** dropdown, select **Mobile App**.
6. Click **Save**.

> **💡 Tip:** If you have both an iOS and Android app with shared user experiences and data requirements, you can use a single mobile connector for both platforms. If the apps serve significantly different purposes or brands, consider separate connectors.

---

## 2. Upload Mobile Event Schema

Just like the web connector, your mobile app connector needs an event schema defining the structure of the events your mobile app will track.

### Steps

1. Download the recommended mobile event schema file from the connector setup page, or prepare a custom schema file tailored to your app's event structure.
2. On the mobile app connector setup page, scroll to the **Schema** section.
3. Click **Upload Schema** and select your schema file.
4. Confirm that all events and their associated fields are populated correctly.
5. Click **Save**.

The recommended mobile schema covers event types similar to the web schema:

| Event Category | Typical Events |
|---|---|
| **Engagement Events** | Product browse, add to cart, purchase, content view, search |
| **Profile Events** | Contact point email, contact point phone, identity, party identification |

> **⚠️ Important:** Schema updates are additive only — you can add new events and fields but cannot remove existing ones. Plan your schema carefully, considering all the events your app will track across current and near-future use cases.

---

## 3. iOS SDK Integration

The Salesforce Interactions Mobile SDK for iOS allows you to capture user interactions from your iOS app and send them to Data Cloud in real time.

> **🔍 Needs Validation:** The iOS SDK code examples below are based on documented patterns and may require adjustment based on the latest SDK version. Consult the [official iOS SDK documentation](https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/personalize-mobile-experiences.html) for the most current API signatures and initialization patterns.

### Installation

You can install the Salesforce Interactions Mobile SDK via **CocoaPods** or **Swift Package Manager (SPM)**.

#### CocoaPods

Add the SDK to your `Podfile`:

```ruby
pod 'SalesforceInteractionsMobile'
```

Then run:

```bash
pod install
```

#### Swift Package Manager

1. Open your Xcode project.
2. Navigate to **File** → **Add Package Dependencies**.
3. Enter the Salesforce Interactions Mobile SDK repository URL.
4. Select the appropriate version and add the package to your target.

### Initialization

Initialize the SDK early in your app's lifecycle — typically in your `AppDelegate` or `App` struct:

```swift
import SalesforceInteractionsMobile

// In your AppDelegate or App initialization
SalesforceInteractions.initialize(
    connectorId: "YOUR_CONNECTOR_ID",
    consents: [
        Consent(
            provider: "YourConsentProvider",
            purpose: "Tracking",
            status: .optIn
        )
    ]
)
```

> **⚠️ Important:** Replace `YOUR_CONNECTOR_ID` with the actual connector ID from your mobile app connector setup page in Data Cloud.

### Sending Events

Send engagement events when users perform actions in your app:

```swift
// Track a product view
SalesforceInteractions.sendEvent(
    interaction: Interaction(
        name: "product_view",
        eventType: "catalogEngagement",
        attributes: [
            "id": productId,
            "name": productName,
            "category": productCategory
        ]
    )
)

// Track an add-to-cart action
SalesforceInteractions.sendEvent(
    interaction: Interaction(
        name: "add_to_cart",
        eventType: "cartEngagement",
        attributes: [
            "catalogObjectId": productId,
            "price": price,
            "quantity": quantity
        ]
    )
)
```

Send profile events to capture user identifying information:

```swift
// Capture user email (profile event)
SalesforceInteractions.sendEvent(
    user: UserAttributes(
        eventType: "contactPointEmail",
        attributes: [
            "email": userEmail
        ]
    )
)
```

---

## 4. Android SDK Integration

The Salesforce Interactions Mobile SDK for Android captures user interactions from your Android app.

> **🔍 Needs Validation:** The Android SDK code examples below are based on documented patterns and may require adjustment based on the latest SDK version. Consult the [official Android SDK documentation](https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/personalize-mobile-experiences.html) for the most current API signatures.

### Installation

Add the SDK dependency to your module-level `build.gradle` file:

```kotlin
dependencies {
    implementation("com.salesforce.interactions:mobile-sdk:LATEST_VERSION")
}
```

Sync your Gradle project after adding the dependency.

### Initialization

Initialize the SDK in your `Application` class:

```kotlin
import com.salesforce.interactions.SalesforceInteractions

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        SalesforceInteractions.initialize(
            context = this,
            connectorId = "YOUR_CONNECTOR_ID",
            consents = listOf(
                Consent(
                    provider = "YourConsentProvider",
                    purpose = "Tracking",
                    status = ConsentStatus.OPT_IN
                )
            )
        )
    }
}
```

### Sending Events

Send engagement events when users perform actions:

```kotlin
// Track a product view
SalesforceInteractions.sendEvent(
    interaction = Interaction(
        name = "product_view",
        eventType = "catalogEngagement",
        attributes = mapOf(
            "id" to productId,
            "name" to productName,
            "category" to productCategory
        )
    )
)

// Track an add-to-cart action
SalesforceInteractions.sendEvent(
    interaction = Interaction(
        name = "add_to_cart",
        eventType = "cartEngagement",
        attributes = mapOf(
            "catalogObjectId" to productId,
            "price" to price,
            "quantity" to quantity
        )
    )
)
```

Send profile events to capture user identity data:

```kotlin
// Capture user email (profile event)
SalesforceInteractions.sendEvent(
    userAttributes = UserAttributes(
        eventType = "contactPointEmail",
        attributes = mapOf(
            "email" to userEmail
        )
    )
)
```

---

## 5. Mobile Event Tracking Patterns

While mobile apps don't use a "sitemap" file like the web SDK, the same data structuring concepts apply. You need to think about:

### Screen Types (Equivalent to Web Page Types)

Map your app's screen types to event categories, just as you would map page types in a web sitemap:

| Screen Type | Equivalent Web Page Type | Event Examples |
|---|---|---|
| Home Screen | Home | App open, featured content view |
| Product Detail Screen | Product Display Page | Product view, add to cart, add to wishlist |
| Category/Browse Screen | Category Page | Category browse, search, filter |
| Cart Screen | Cart Page | Cart view, quantity change, remove item |
| Checkout/Order Screen | Order Confirmation | Purchase complete, payment method |
| Profile/Account Screen | Account Page | Login, profile update, email capture |
| Article/Content Screen | Article Page | Article view, share, bookmark |

### Engagement vs. Profile Events

The same distinction from web data capturing applies:

- **Engagement events:** Use `eventType` on the `interaction` object — product views, cart actions, purchases, screen views
- **Profile events:** Use `eventType` on the `user.attributes` object — email capture, phone number, login credentials

### Event Type Splitting

The mobile SDK performs the same event type splitting as the web SDK. A single event containing both engagement and profile data is automatically split into separate events before being sent to Data Cloud.

---

## 6. Deploy Mobile Data Streams

Deploying mobile data streams follows the same process as web data streams.

### Steps

1. In Data Cloud, navigate to the **Data Streams** tab and click **New**.
2. Under **Connected Sources**, select **Mobile App** and click **Next**.
3. From the **Mobile App** dropdown, select the mobile app connector you configured.
4. Select the events you'd like to capture and click **Next**.
5. Review and verify the events and their associated fields.
6. Click **Next**.
7. Select the target **Data Space** if you have more than one.
8. Set the **Refresh Mode** to **Partial** for each profile event.
9. Click **Deploy**.

> **🚨 Warning:** Always use **Partial** refresh mode for mobile data streams, just as with web data streams. Incremental mode will overwrite or clear values not included in each event.

After deployment, map the mobile data stream DLO fields to DMOs using the same approach described in [Web Data Capturing — Map DLOs to DMOs](web-data-capturing.md#7-map-dlos-to-dmos). The mapping patterns (behavioral events, contact point email, contact point phone, identity, party identification) are identical.

> **💡 Tip:** If your mobile connector uses the same recommended schema as your web connector, the DLO-to-DMO mappings will follow the same patterns. You can reference the mapping tables in [Web Data Capturing](web-data-capturing.md) as a guide.

---

## Summary Checklist

- [ ] **Mobile app connector created** — Connector type set to "Mobile App"
- [ ] **Mobile event schema uploaded** — Schema covering all engagement and profile events your app will track
- [ ] **iOS SDK integrated** *(if applicable)* — SDK installed via CocoaPods or SPM, initialized with consent config, events sending correctly
- [ ] **Android SDK integrated** *(if applicable)* — SDK added via Gradle, initialized in Application class, events sending correctly
- [ ] **Mobile event tracking patterns defined** — Screen types mapped to event categories, engagement vs. profile events structured correctly
- [ ] **Mobile data streams deployed** — All event definitions selected, Partial refresh mode set, DLOs mapped to DMOs

---

## What's Next?

With web and/or mobile data flowing into Data Cloud, it's time to structure that data and unify customer identities. Head to the next section to learn about DLO-to-DMO mapping strategies and Identity Resolution configuration.

**[← Previous: Web Data Capturing](web-data-capturing.md)** | **[Next: DLO-DMO Mapping & Identity Resolution →](dlo-dmo-mapping-ir.md)**

---

## Additional Resources

- [Salesforce Personalization: Personalize Mobile Experiences](https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/personalize-mobile-experiences.html)
- [Salesforce Help: Data Mapping](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_mapping.htm)
- [Salesforce Help: Data Streams](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_streams.htm)
