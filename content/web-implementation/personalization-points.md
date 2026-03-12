# Personalization Points

A **personalization point** maps to a part of an experience that is eligible for a decision. It is the value included in a personalization decision request — alongside an individual ID — when a request is made to the Personalization decisioning pipeline.

Examples of personalization points include:
- Homepage hero banner
- Homepage recommendations bar
- Product Detail Page (PDP) recommendations bar
- Pop-up overlay
- Sidebar article suggestions

---

## Creating a Personalization Point

Navigate to the **Personalization** app → **Personalization Points** → **New Personalization Point**.

### Configuration Options

| Field | Description |
|---|---|
| **Name** | A unique, descriptive name for the point (e.g., `home_hero`, `pdp_recommendations`) |
| **Data Space** | Everything in Data Cloud is data-space scoped. The selected data space determines which profile data graphs and response templates are available. |
| **Data Graph** | The profile data graph to use for this point. This impacts: (1) which recommenders are available on decisions, (2) which data points are available for targeting rules. |
| **Personalization Type** | Either **Manual Content** or **Recommendations** (see [Personalization Types](personalization-types.md)) |
| **Response Template** | Defines the shape of the decision response. Only templates matching the selected data space and personalization type are shown. (See [Response Templates](response-templates.md)) |
| **Source** | Non-editable field that indicates where the point was created from. For points created via the email builder in Marketing Cloud Growth or Advanced, the source reads "CMS Content". |
| **Authentication** | Optional. Mark a point as requiring authentication. Requests against this point must use Personalization's authenticated decisioning API with proper credentials. |

### Step-by-Step

1. Click **New Personalization Point**
2. Enter a **name** — use a machine-friendly format like `home_recommendations`
3. Select the **data space**
4. Select the **profile data graph** — this connects the point to the real-time profile data used for targeting and recommender input
5. Choose the **personalization type** — Manual Content or Recommendations
6. Select the **response template** — the template determines what configuration options appear on decisions and what data is returned in responses
7. Optionally enable **authentication** if this point should only be accessed via authenticated API calls
8. Save

> **⚠️ Important:** After creating a personalization point, you must configure at least one **decision** or **experiment** on it before it can return a response when requested. A point with no decisions or experiments returns a blank response.

---

## How the Profile Data Graph Affects the Point

The profile data graph you select has cascading effects on the entire personalization point:

### Recommender Availability
Only recommenders configured with the **same profile DG** and returning the **same DMO** as the response template are selectable on decisions.

### Targeting Rules
Any data point from the selected profile data graph is available for use in decision targeting logic:
- Direct attributes on the Unified Individual
- Related object attributes (engagements, contact points)
- Calculated Insights
- Segment memberships

### Request Behavior
When a personalization request includes multiple personalization points, Personalization assumes that **all points in the request use the same profile DG**. If one point uses a different DG than a point listed earlier in the request, it will be skipped.

> **📝 Note:** This means you should plan your personalization points so that points requested together share the same profile data graph.

---

## Reusability Across Channels

A personalization point is **reusable across channels**. Any channel that can call the Personalization decisioning API can request a decision for any personalization point. This includes:

- **Web** — via the Salesforce Interactions SDK (`SalesforceInteractions.Personalization.fetch()`)
- **Mobile** — via the Mobile SDK or direct API call
- **Email** — via Marketing Cloud Growth / Advanced email builder
- **Server-side** — via direct REST API calls
- **Agentforce** — via Invocable Actions in Flow

Channel-specific experience wrappers and templates (like web templates or mobile UI components) control **when** requests are made, **where** decision responses are rendered, and **how** content is displayed. But the underlying personalization point, decisions, and recommenders are shared.

> **💡 Tip:** Design your personalization points around the **type of experience** (hero banner, recommendations bar, popup), not the specific channel. This maximizes reusability and reduces configuration overhead.

---

## Decision Credits

Each decision that Personalization makes consumes **1 decision credit**:

- A request with **1 personalization point** = 1 decision credit
- A request with **2 personalization points** = 2 decision credits
- A blank response (individual doesn't qualify for any decision) still counts as a decision credit

Plan your personalization point strategy with decision credit consumption in mind.

---

## What Happens Next

Once a personalization point is created, configure one of the following:

- **[Decisions](decisions.md)** — Define who gets what content, with targeting rules and priority
- **[Experiments](experiments.md)** — A/B test different decisioning strategies on this point

---

**Next:** [Decisions](decisions.md) — Learn how to configure targeting rules and priority to determine who receives which personalized content.
