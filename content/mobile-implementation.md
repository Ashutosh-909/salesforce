# Mobile App Implementation

In this section, you'll learn how to deliver personalized experiences inside a native mobile app using Salesforce Personalization. Mobile personalization follows the same underlying data flow as web personalization — the Mobile SDK ingests behavioral data into Data Cloud in real time, identity resolution unifies the user's profile, and the Decisioning API returns personalized content. The key difference is in how you integrate the SDK and render responses: instead of JavaScript and HTML, you'll work with native platform tools (Swift/Kotlin) and native UI frameworks (SwiftUI, UIKit, Jetpack Compose, or XML layouts).

> **⚠️ Important:** Before starting mobile implementation, make sure you've completed the foundational setup covered in earlier sections:
>
> - [Setup & Permissions](setup-permissions.md) — Licenses, permission sets, and datakit deployment
> - [Data Capturing & Modeling](data-capturing-modeling/overview.md) — Data space creation, connectors, schema, DLO-to-DMO mapping, identity resolution, and data graphs
>
> Mobile personalization reuses the same personalization points, decisions, recommenders, and response templates you configure for web — the only differences are in how data is ingested and how responses are rendered.

---

## Prerequisites

Before you begin, confirm the following:

1. **Salesforce Personalization and Data Cloud licenses** are active in your org
2. **A Data Space** is created and configured (see [Setup & Permissions](setup-permissions.md))
3. **A Mobile App Connector** is created (covered below in Step 1)
4. **Personalization points and decisions** are configured in the Personalization app (see [Web Implementation](web-implementation/overview.md) — the same points are reusable for mobile)
5. **A Profile Data Graph** is set up and includes the engagement objects you'll track from mobile (see [Data Graphs](data-capturing-modeling/data-graphs.md))

---

## 1. Mobile SDK Setup Recap

Mobile data capturing is covered in detail in [Mobile Data Capturing](data-capturing-modeling/mobile-data-capturing.md). Here's a quick recap of the setup steps:

| Step | What to Do |
|------|------------|
| **Create a Mobile App Connector** | In Data Cloud Setup → Websites & Mobile Apps → New → select **Mobile App** as the Connector Type |
| **Upload the Mobile Event Schema** | Download the recommended mobile event schema JSON and upload it to the connector |
| **Install the Mobile SDK** | Add the Salesforce Interactions SDK via CocoaPods/SPM (iOS) or Gradle (Android) |
| **Initialize the SDK** | Call the SDK's initialization method with your org's tenant-specific endpoint and data space configuration |
| **Send behavioral events** | Use the SDK's event-tracking API to send page views, product interactions, cart events, and profile data |
| **Deploy Mobile Data Streams** | Create data streams in Data Cloud Setup, select the mobile connector, choose events, and deploy |
| **Map DLOs to DMOs** | Map the mobile event DLO fields to the corresponding DMOs — the mapping is identical to web events |

> **💡 Tip:** The mobile event schema follows the same structure as the web event schema. The DLO-to-DMO mapping tables are identical for both web and mobile connectors. If you've already mapped web events, the mobile mapping process will be familiar.

---

## 2. Requesting Personalization in Mobile

Mobile apps request personalized content by calling the **Decisioning API**. This is the same API that powers web personalization — the difference is that on the web, the SDK's `SalesforceInteractions.Personalization.fetch()` method wraps the API call for you, while on mobile you interact with the API more directly through the Mobile SDK.

### How the Decisioning Flow Works

The run-time decision flow is the same regardless of channel:

1. **Personalization Request** — Your app sends a request containing an individual ID and one or more personalization point names. Optional context data (e.g., anchor item IDs, category) can be included for recommendation filtering.
2. **Augmenting Phase** — Personalization retrieves the individual's Profile Data Graph from Data Cloud. If no profile exists, the individual is treated as a first-time anonymous visitor.
3. **Qualifying Phase** — For each personalization point, Personalization evaluates which decision or experiment cohort the individual qualifies for (experiments are highest priority).
4. **Personalizing Phase** — The qualifying decision is generated. For manual content, string values are returned. For recommendations, the recommender generates 1:1 personalized items using the real-time profile.
5. **Decision Response** — The response is returned to the app and logged in Data Cloud for analytics and attribution.

> **📝 Note:** Each personalization point in a request consumes one decision credit. A request with three personalization points consumes three credits.

### Making a Personalization Request (iOS — Swift)

> **🔍 Needs Validation:** The following code examples are based on the Salesforce Interactions Mobile SDK patterns. Verify method signatures and class names against the latest [Salesforce Interactions Mobile SDK documentation](https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/mobile-sdk-overview.html).

```swift
import SalesforceInteractions

// Request personalization for one or more personalization points
SalesforceInteractions.shared.personalization.fetch(
    personalizationPoints: ["home_recommendations", "home_hero"]
) { result in
    switch result {
    case .success(let response):
        // response.personalizations contains an array of decision responses
        for personalization in response.personalizations {
            print("Point: \(personalization.personalizationPointName)")
            print("Data: \(personalization.data)")
        }
    case .failure(let error):
        print("Personalization request failed: \(error.localizedDescription)")
    }
}
```

### Making a Personalization Request (Android — Kotlin)

```kotlin
import com.salesforce.interactions.SalesforceInteractions

// Request personalization for one or more personalization points
SalesforceInteractions.personalization.fetch(
    personalizationPoints = listOf("home_recommendations", "home_hero")
) { result ->
    result.onSuccess { response ->
        // response.personalizations contains a list of decision responses
        response.personalizations.forEach { personalization ->
            Log.d("Personalization", "Point: ${personalization.personalizationPointName}")
            Log.d("Personalization", "Data: ${personalization.data}")
        }
    }
    result.onFailure { error ->
        Log.e("Personalization", "Request failed: ${error.message}")
    }
}
```

### Personalization Response Structure

The response follows the same JSON structure as web personalization. Each personalization point returns a single decision response:

```json
{
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
          "ssot__Name__c": "GoBrew Connected Coffee Machine",
          "ssot__ProductSKU__c": "6010042",
          "ImageUrl__c": "https://www.northerntrailoutfitters.com/.../go-brew.jpg",
          "PurchaseUrl__c": "https://www.northerntrailoutfitters.com/.../gobrew-connected-coffee-machine-6010042.html",
          "ssot__PrimaryProductCategory__c": "Coffee Machines",
          "UnitPrice__c": "299.99",
          "personalizationContentId": "96c4a971-71f5-4779-a82d-2c72dfa964fe:0"
        }
      ]
    }
  ]
}
```

**Key fields in each personalization response:**

| Field | Description |
|-------|-------------|
| `personalizationId` | Unique ID for this decision — use this when tracking engagement |
| `requestId` | ID of the overall request (shared across all points in a single request) |
| `individualId` | The resolved identity of the individual |
| `personalizationPointName` | The name of the personalization point that was requested |
| `dmoName` | The DMO type of the returned items (e.g., `ssot__GoodsProduct__dlm`) |
| `data` | Array of recommended items or manual content attribute values |
| `personalizationContentId` | Unique ID for each item — use this when tracking item-level clicks |

> **⚠️ Important:** Personalization assumes that all personalization points in a single request use the same Profile Data Graph. If one point uses a different DG than another in the same request, it will be skipped. Group your requests by data graph when calling multiple points.

---

## 3. Rendering Personalization Responses

Unlike web personalization — which uses Handlebars templates to convert JSON into HTML — mobile apps render personalization responses using **native UI components**. You parse the JSON response and map the fields to your app's views.

### iOS — SwiftUI Example

```swift
import SwiftUI

struct RecommendationCard: View {
    let name: String
    let category: String
    let imageUrl: String
    let price: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            AsyncImage(url: URL(string: imageUrl)) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                ProgressView()
            }
            .frame(height: 200)
            .clipped()

            Text(name)
                .font(.headline)
            Text(category)
                .font(.subheadline)
                .foregroundColor(.secondary)
            Text("$\(price)")
                .font(.title3)
                .fontWeight(.bold)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 4)
    }
}

// Usage: Map personalization response data to UI
struct RecommendationsView: View {
    let personalizations: [PersonalizationData]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                ForEach(personalizations, id: \.personalizationContentId) { item in
                    RecommendationCard(
                        name: item.data["ssot__Name__c"] ?? "",
                        category: item.data["ssot__PrimaryProductCategory__c"] ?? "",
                        imageUrl: item.data["ImageUrl__c"] ?? "",
                        price: item.data["UnitPrice__c"] ?? ""
                    )
                }
            }
            .padding()
        }
    }
}
```

### iOS — UIKit Example

```swift
import UIKit

class RecommendationCell: UICollectionViewCell {
    let imageView = UIImageView()
    let nameLabel = UILabel()
    let categoryLabel = UILabel()
    let priceLabel = UILabel()

    func configure(with item: [String: Any]) {
        nameLabel.text = item["ssot__Name__c"] as? String
        categoryLabel.text = item["ssot__PrimaryProductCategory__c"] as? String
        priceLabel.text = "$\(item["UnitPrice__c"] as? String ?? "")"

        if let urlString = item["ImageUrl__c"] as? String,
           let url = URL(string: urlString) {
            // Load image asynchronously (use your preferred image loading library)
            loadImage(from: url)
        }
    }

    private func loadImage(from url: URL) {
        URLSession.shared.dataTask(with: url) { [weak self] data, _, _ in
            guard let data = data, let image = UIImage(data: data) else { return }
            DispatchQueue.main.async {
                self?.imageView.image = image
            }
        }.resume()
    }
}
```

### Android — Jetpack Compose Example

```kotlin
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage

@Composable
fun RecommendationCard(
    name: String,
    category: String,
    imageUrl: String,
    price: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.width(200.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column {
            AsyncImage(
                model = imageUrl,
                contentDescription = name,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
            )
            Column(modifier = Modifier.padding(12.dp)) {
                Text(text = name, style = MaterialTheme.typography.titleSmall)
                Text(text = category, style = MaterialTheme.typography.bodySmall)
                Text(text = "$$price", style = MaterialTheme.typography.titleMedium)
            }
        }
    }
}

@Composable
fun RecommendationsRow(items: List<Map<String, String>>) {
    LazyRow(
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(horizontal = 16.dp)
    ) {
        items(items) { item ->
            RecommendationCard(
                name = item["ssot__Name__c"] ?: "",
                category = item["ssot__PrimaryProductCategory__c"] ?: "",
                imageUrl = item["ImageUrl__c"] ?: "",
                price = item["UnitPrice__c"] ?: ""
            )
        }
    }
}
```

### Android — XML Layout Example

```xml
<!-- res/layout/item_recommendation.xml -->
<com.google.android.material.card.MaterialCardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="200dp"
    android:layout_height="wrap_content"
    app:cardElevation="4dp"
    app:cardCornerRadius="12dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <ImageView
            android:id="@+id/productImage"
            android:layout_width="match_parent"
            android:layout_height="150dp"
            android:scaleType="centerCrop" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="12dp">

            <TextView
                android:id="@+id/productName"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textAppearance="?attr/textAppearanceTitleSmall" />

            <TextView
                android:id="@+id/productCategory"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textAppearance="?attr/textAppearanceBodySmall" />

            <TextView
                android:id="@+id/productPrice"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textAppearance="?attr/textAppearanceTitleMedium" />
        </LinearLayout>
    </LinearLayout>
</com.google.android.material.card.MaterialCardView>
```

```kotlin
// Bind data in your RecyclerView.Adapter
class RecommendationViewHolder(view: View) : RecyclerView.ViewHolder(view) {
    private val productImage: ImageView = view.findViewById(R.id.productImage)
    private val productName: TextView = view.findViewById(R.id.productName)
    private val productCategory: TextView = view.findViewById(R.id.productCategory)
    private val productPrice: TextView = view.findViewById(R.id.productPrice)

    fun bind(item: Map<String, String>) {
        productName.text = item["ssot__Name__c"]
        productCategory.text = item["ssot__PrimaryProductCategory__c"]
        productPrice.text = "$${item["UnitPrice__c"]}"

        // Use Glide, Coil, or Picasso to load the image
        Glide.with(itemView.context)
            .load(item["ImageUrl__c"])
            .into(productImage)
    }
}
```

> **💡 Tip:** Unlike web personalization, mobile apps don't need Handlebars templates or flicker defense. You have full control over the UI rendering using native components. Parse the JSON `data` array from the personalization response and map each field to your views.

---

## 4. Tracking Engagement

Tracking engagement (impressions and clicks) is essential for personalization analytics, attribution, and recommender model training. Without engagement tracking, Salesforce Personalization cannot measure the effectiveness of your decisions or improve recommendation quality over time.

### What to Track

| Event | When to Send | Required Data |
|-------|-------------|---------------|
| **Impression** | When a personalized element is displayed on screen (visible in the viewport) | `personalizationId`, `personalizationContentId` |
| **Click / Tap** | When the user taps on a personalized element (e.g., taps a recommended product) | `personalizationId`, `personalizationContentId` |
| **Dismiss** | When the user explicitly dismisses a personalized element (e.g., swipes away a card) | `personalizationId` |

> **⚠️ Important:** Use the `personalizationId` and `personalizationContentId` values from the decision response when sending engagement events. These IDs link the engagement back to the specific decision and item, enabling accurate attribution analytics and Pipeline Intelligence dashboards.

### Sending Engagement Events (iOS — Swift)

> **🔍 Needs Validation:** Verify the exact method signatures for mobile engagement tracking against the latest [Salesforce Interactions Mobile SDK documentation](https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/mobile-sdk-overview.html).

```swift
// Track an impression when a recommendation becomes visible
SalesforceInteractions.shared.sendEvent(
    interaction: .init(
        eventType: "engagement",
        interactionName: "View Product Recommendation",
        personalizationId: personalization.personalizationId,
        personalizationContentId: item.personalizationContentId
    )
)

// Track a click/tap when the user taps a recommended item
SalesforceInteractions.shared.sendEvent(
    interaction: .init(
        eventType: "engagement",
        interactionName: "Click Product Recommendation",
        personalizationId: personalization.personalizationId,
        personalizationContentId: item.personalizationContentId
    )
)
```

### Sending Engagement Events (Android — Kotlin)

```kotlin
// Track an impression when a recommendation becomes visible
SalesforceInteractions.sendEvent(
    interaction = Interaction(
        eventType = "engagement",
        interactionName = "View Product Recommendation",
        personalizationId = personalization.personalizationId,
        personalizationContentId = item.personalizationContentId
    )
)

// Track a click/tap when the user taps a recommended item
SalesforceInteractions.sendEvent(
    interaction = Interaction(
        eventType = "engagement",
        interactionName = "Click Product Recommendation",
        personalizationId = personalization.personalizationId,
        personalizationContentId = item.personalizationContentId
    )
)
```

### Impression Tracking Best Practices

On mobile, determining when content is "visible" requires viewport-awareness logic:

- **iOS:** Use `onAppear` (SwiftUI) or implement `UICollectionViewDelegate`'s `willDisplay` / `didEndDisplaying` methods (UIKit) to detect when a recommendation card enters the viewport.
- **Android:** Use `LazyListState` visibility checks (Compose) or `RecyclerView.OnChildAttachStateChangeListener` (Views) to detect item visibility.
- **Fire once per session:** Track each impression only once per user session to avoid inflating metrics. Use a local set to deduplicate by `personalizationContentId`.

```swift
// SwiftUI — track impression when a card appears
RecommendationCard(item: item)
    .onAppear {
        trackImpressionIfNeeded(for: item)
    }
```

```kotlin
// Jetpack Compose — track impression when a card appears
LaunchedEffect(item.personalizationContentId) {
    trackImpressionIfNeeded(item)
}
```

---

## 5. Mobile-Specific Considerations

### 5A. Offline Handling

Mobile apps must gracefully handle scenarios where the device is offline or has intermittent connectivity.

**Recommendations:**

- **Cache the last successful personalization response** locally (using UserDefaults/SharedPreferences or a local database). When offline, display cached recommendations with a "last updated" indicator.
- **Queue behavioral events** when the device is offline and send them in batch when connectivity is restored. The Salesforce Interactions Mobile SDK handles event queuing automatically.
- **Set appropriate timeouts** on personalization fetch requests to avoid blocking the UI. Fallback to cached content or a default experience after the timeout.

```swift
// iOS — Simple caching strategy
func fetchPersonalization() {
    SalesforceInteractions.shared.personalization.fetch(
        personalizationPoints: ["home_recommendations"]
    ) { [weak self] result in
        switch result {
        case .success(let response):
            self?.cache.store(response)  // Cache for offline use
            self?.renderRecommendations(response)
        case .failure:
            if let cached = self?.cache.loadLastResponse() {
                self?.renderRecommendations(cached)  // Use cached data
            } else {
                self?.showDefaultContent()  // Fallback
            }
        }
    }
}
```

```kotlin
// Android — Simple caching strategy
fun fetchPersonalization() {
    SalesforceInteractions.personalization.fetch(
        personalizationPoints = listOf("home_recommendations")
    ) { result ->
        result.onSuccess { response ->
            cache.store(response)  // Cache for offline use
            renderRecommendations(response)
        }
        result.onFailure {
            val cached = cache.loadLastResponse()
            if (cached != null) {
                renderRecommendations(cached)  // Use cached data
            } else {
                showDefaultContent()  // Fallback
            }
        }
    }
}
```

> **💡 Tip:** The SDK's event queue ensures that behavioral events captured while offline are not lost. They are automatically replayed when the device reconnects, keeping the user's real-time profile up to date.

### 5B. Deep Linking

When personalized content includes links to products or articles (via fields like `PurchaseUrl__c`), you should handle these with **deep links** rather than opening a web browser:

- **Map `PurchaseUrl__c` (or similar URL fields) to in-app screens.** Parse the URL to extract product IDs, category paths, or article slugs, then navigate to the corresponding native screen.
- **Use Universal Links (iOS) and App Links (Android)** to handle cases where the URL might be shared externally and needs to route back into the app.
- **Track deep link engagement** by sending interaction events when users navigate through personalized deep links.

```swift
// iOS — Navigate to a product detail screen from a recommendation
func handleRecommendationTap(item: [String: String]) {
    // Track the tap engagement
    trackClick(for: item)

    // Extract product SKU and navigate natively
    if let sku = item["ssot__ProductSKU__c"] {
        let productDetail = ProductDetailView(sku: sku)
        navigationController?.pushViewController(productDetail, animated: true)
    }
}
```

```kotlin
// Android — Navigate to a product detail screen from a recommendation
fun handleRecommendationTap(item: Map<String, String>) {
    // Track the tap engagement
    trackClick(item)

    // Extract product SKU and navigate natively
    val sku = item["ssot__ProductSKU__c"]
    if (sku != null) {
        val intent = Intent(context, ProductDetailActivity::class.java).apply {
            putExtra("product_sku", sku)
        }
        context.startActivity(intent)
    }
}
```

### 5C. Push Notification Personalization Triggers

Push notifications can serve as a trigger to request and display personalized content when the user opens the app:

1. **Trigger a personalization request on notification open.** When a push notification deep links into the app, immediately fetch personalized content for the landing screen.
2. **Include context data in the push payload.** If the notification is about a specific product category or campaign, pass that context to the personalization fetch request so recommendations are relevant to the notification content.
3. **Send a notification-open event** via the SDK so that the interaction is captured in Data Cloud and available in the user's profile for future decisioning.

```swift
// iOS — Handle push notification and fetch contextual personalization
func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
) {
    let userInfo = response.notification.request.content.userInfo

    // Send notification open event
    SalesforceInteractions.shared.sendEvent(
        interaction: .init(
            eventType: "engagement",
            interactionName: "Push Notification Open"
        )
    )

    // Fetch personalization for the landing screen
    SalesforceInteractions.shared.personalization.fetch(
        personalizationPoints: ["notification_landing_recs"]
    ) { result in
        // Handle response and render personalized content
    }

    completionHandler()
}
```

```kotlin
// Android — Handle push notification and fetch contextual personalization
class NotificationHandler : FirebaseMessagingService() {
    fun handleNotificationOpen(data: Map<String, String>) {
        // Send notification open event
        SalesforceInteractions.sendEvent(
            interaction = Interaction(
                eventType = "engagement",
                interactionName = "Push Notification Open"
            )
        )

        // Fetch personalization for the landing screen
        SalesforceInteractions.personalization.fetch(
            personalizationPoints = listOf("notification_landing_recs")
        ) { result ->
            // Handle response and render personalized content
        }
    }
}
```

### 5D. Identity Management in Mobile

Mobile apps have a unique advantage over websites when it comes to identity resolution: users are often logged in, providing a known identity for personalization.

- **Pass the user's login credentials** (email, user ID, or CRM contact ID) as identity attributes when the user authenticates in the app. This links the mobile profile to the unified individual across channels.
- **Handle anonymous-to-known transitions.** When a user browses the app without logging in and then signs in, the SDK associates the anonymous device ID with the authenticated identity. Identity resolution merges the anonymous profile into the known individual's record.
- **Use the same identity identifiers as your web implementation** to ensure cross-channel profile unification. If your web sitemap sends `email` and `userId`, send the same fields from mobile.

```swift
// iOS — Send identity event on user login
func onUserLogin(email: String, userId: String, firstName: String, lastName: String) {
    SalesforceInteractions.shared.sendEvent(
        interaction: .init(
            eventType: "identity",
            identity: .init(
                email: email,
                userId: userId,
                firstName: firstName,
                lastName: lastName
            )
        )
    )
}
```

```kotlin
// Android — Send identity event on user login
fun onUserLogin(email: String, userId: String, firstName: String, lastName: String) {
    SalesforceInteractions.sendEvent(
        interaction = Interaction(
            eventType = "identity",
            identity = Identity(
                email = email,
                userId = userId,
                firstName = firstName,
                lastName = lastName
            )
        )
    )
}
```

> **💡 Tip:** Mobile provides more reliable identity data than web since users tend to stay logged in. Use this advantage to deliver more precisely targeted personalization by ensuring identity events are sent promptly at login.

### 5E. Data Space Configuration for Mobile

If your org uses multiple data spaces, configure the data space when initializing the Mobile SDK — just as you would with the Web SDK:

```swift
// iOS — Configure data space during initialization
SalesforceInteractions.shared.initialize(
    configuration: .init(
        consents: [],
        personalization: .init(
            dataspace: "personalizationDemo"
        )
    )
)
```

```kotlin
// Android — Configure data space during initialization
SalesforceInteractions.initialize(
    configuration = Configuration(
        consents = emptyList(),
        personalization = PersonalizationConfig(
            dataspace = "personalizationDemo"
        )
    )
)
```

> **📝 Note:** If you don't specify a data space, the SDK uses the `default` data space. All personalization points in a single request must belong to the same data space.

---

## Mobile vs. Web: Key Differences Summary

| Aspect | Web | Mobile |
|--------|-----|--------|
| **SDK Installation** | CDN `<script>` tag in HTML `<head>` | CocoaPods/SPM (iOS) or Gradle (Android) dependency |
| **Sitemap** | JavaScript sitemap with page types, `isMatch` logic, content zones | Native code event tracking — no content zones needed |
| **Personalization Rendering** | Handlebars templates convert JSON → HTML | Native UI components (SwiftUI, UIKit, Compose, XML) |
| **Flicker Defense** | Required — prevents FOUC while personalization loads | Not needed — native apps control render timing |
| **Content Zones** | CSS selectors target DOM elements for injection | Not applicable — you control the full native layout |
| **Engagement Tracking** | WPM configures tracking destinations automatically | Manual — send `personalizationId` and `personalizationContentId` via SDK events |
| **Web Personalization Manager** | WYSIWYG overlay for business users to add experiences | Not available — mobile experiences are configured via the Personalization app + code |
| **Offline Handling** | Limited — web typically requires connectivity | SDK queues events; app can cache responses for offline display |
| **Identity** | Anonymous-heavy (cookie-based `deviceId`) | Often authenticated (logged-in users provide known identity) |

---

## What's Next?

With mobile personalization set up, explore these related topics:

- **[Personalization API](personalization-api.md)** — Learn the full Decisioning API request/response format for server-side and headless personalization
- **[Experimentation](experimentation.md)** — Set up A/B tests on your personalization points to optimize mobile experiences
- **[Batch Personalization](batch-personalization.md)** — Generate personalized recommendations at scale for push notifications and other batch-processed channels
