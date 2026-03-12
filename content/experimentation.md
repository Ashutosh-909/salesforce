# Experimentation Setup

Learn how to set up and analyze A/B tests on your personalization points using Salesforce Personalization's built-in experimentation framework.

---

## What is Experimentation?

Experimentation in Salesforce Personalization allows you to test different decisioning strategies against each other on a personalization point. Instead of committing to a single decision configuration, you can create an experiment that splits traffic across multiple **cohorts** — each with its own decision setup — and measure which one performs best against a defined metric.

Use experimentation to answer questions like:

- Does a rules-based recommender outperform an objective-based recommender for this product page?
- Does a targeted banner with a promotional message drive more add-to-cart actions than a generic hero image?
- What traffic allocation between two recommendation strategies yields the highest conversion rate?

Experimentation gives you data-driven confidence before rolling out a decisioning strategy to 100% of your audience.

> **📝 Note:** Experimentation is a feature of Salesforce Personalization built on Data Cloud. It works alongside decisions on personalization points — you do not need a separate tool or license to run experiments.

---

## Prerequisites

Before creating an experiment, make sure the following are in place:

1. **An active personalization point** — The experiment is configured directly on a personalization point. You must have at least one personalization point created with a response template and profile data graph assigned. See [Personalization Points](web-implementation/personalization-points.md) for setup steps.

2. **Engagement signals configured** — Engagement signals are named event definitions built against Data Cloud engagement DMOs (Data Model Objects). They represent meaningful user actions such as a product view, add to cart, or purchase. At least one engagement signal must exist to define experiment metrics.

3. **Engagement signal metrics defined** — Every engagement signal automatically generates a default count metric. You can also create additional metrics (such as sum or compound/ratio metrics) from the engagement signal's related objects tab. These metrics are what you select as primary and secondary metrics on your experiment.

4. **Engagement signals built on the correct profile data graph** — The engagement DMOs referenced by your signals must exist on the profile data graph selected on the personalization point where you are creating the experiment. If a metric's underlying signal references an engagement DMO that is not on the profile data graph, it will not appear for selection.

> **⚠️ Important:** If you do not see any metrics available when creating an experiment, verify that your engagement signals are built against engagement DMOs that are included in the profile data graph assigned to the personalization point.

---

## Creating an Experiment

Follow these steps to create an experiment on a personalization point.

### Step 1: Navigate to the Personalization Point

1. Open the **Personalization** application in Salesforce Setup.
2. Navigate to the **Personalization Points** tab.
3. Click into the personalization point where you want to add an experiment.
4. Go to the **Related** tab of the personalization point detail page.

> **📝 Note:** Only one experiment can be active on a personalization point at a time. If an experiment already exists, you must archive or delete it before creating a new one.

### Step 2: Define Metrics

1. Click **New Experiment**.
2. **Primary Metric** — Select the engagement signal metric that determines the winning cohort. This is the metric that Personalization uses to evaluate which cohort performs best. For example, select a "Purchase Count" metric if you want to optimize for the number of purchases.
3. **Secondary Metrics** — Optionally add additional metrics to track alongside the primary metric. Secondary metrics are displayed in the experiment analytics screen but are not used to determine the winner. For example, you might track "Add to Cart Count" or "Click-Through Rate" as secondary metrics while the primary metric is "Revenue."

> **💡 Tip:** Any metrics defined on engagement signals where the underlying engagement DMO is on the profile data graph of the personalization point are available for selection. If you need a metric that doesn't exist yet, navigate to the **Engagement Signals** tab, open the relevant signal, and create a new metric from its **Related** tab.

### Step 3: Configure Targeting Rules (Optional)

If you want the experiment to apply only to a specific subset of individuals, add targeting rules. The targeting rules available on experiments are the same as those available on decisions:

- **Profile data graph attributes** — Any direct or related attribute on the profile data graph (e.g., loyalty tier, geographic region, account type)
- **Segment memberships** — Target individuals who belong to (or do not belong to) specific Data Cloud segments
- **Calculated insights** — Use CI values for numeric thresholds or ranges (e.g., lifetime purchase value > $500)
- **Contextual rules** — Rules based on context data sent in the personalization request (e.g., current page URL, device type)

If no targeting rules are defined, all individuals who visit a page where the personalization point is requested will be eligible for the experiment.

> **💡 Tip:** Up to 50 conditions can be added to targeting rules on an experiment, the same limit as decisions.

### Step 4: Create Cohorts

Cohorts represent the different decisioning strategies you want to test. Each cohort functions like a mini-decision with its own configuration.

1. **Add cohorts** — Create at least two cohorts (e.g., "Cohort A" and "Cohort B").
2. **Traffic allocation** — Assign a percentage of traffic to each cohort. The allocations across all cohorts must total 100%. For example:
   - Cohort A: 50%
   - Cohort B: 50%
3. **Configure each cohort** — The configuration options mirror those of a personalization decision and are determined by the response template on the personalization point:
   - For **Manual Content** personalization points: Enter the personalization attribute values (text fields) for each cohort.
   - For **Recommendations** personalization points: Select a recommender for each cohort. You might test a rules-based recommender in one cohort against an objective-based recommender in another.

> **⚠️ Important:** Recommenders available for selection on a cohort must be configured with the same profile data graph defined on the personalization point and must return items of the DMO type specified on the response template.

### Step 5: Add a Control Cohort (Optional)

A control cohort allows you to measure the baseline performance — what happens when no personalization is applied. This is valuable for measuring true personalization lift.

- When you add a control cohort, you can configure it to **fall through** to be evaluated against any other decisions configured on the personalization point.
- This means individuals in the control cohort are not shown "nothing" — instead, they receive whatever the next qualifying decision would return (or no response if no other decisions exist).

For example, if your personalization point has three decisions and you add an experiment with a control cohort that falls through, control cohort individuals will be evaluated against the existing decisions by priority, just as they would if the experiment did not exist.

### Step 6: Activate the Experiment

1. Review all cohort configurations, traffic allocations, and metrics.
2. Save and activate the experiment.
3. The experiment begins as soon as it is active — traffic will be randomly split across cohorts based on the defined allocations.

---

## Experiment Behavior at Runtime

Understanding how experiments interact with the personalization decisioning pipeline is critical for planning your testing strategy.

### Experiments Are Highest Priority

When a personalization request is made against a personalization point, the decisioning pipeline evaluates the experiment **first**, before any decisions configured on the same point. An experiment is treated as the highest-priority item on a personalization point by default.

The evaluation flow works as follows:

1. A personalization request arrives with an individual ID and one or more personalization point IDs.
2. The **augmenting phase** retrieves the individual's profile data graph from Data Cloud.
3. The **qualifying phase** checks if the individual meets the experiment's targeting rules (if any).
4. If the individual qualifies, they are randomly assigned to a cohort based on traffic allocation percentages.
5. The **personalizing phase** generates the decision response based on the assigned cohort's configuration.
6. If the individual does not qualify for the experiment (due to targeting rules), evaluation falls through to the configured decisions by priority.

### Traffic Impact on Existing Decisions

> **🚨 Warning:** If you apply an experiment with no targeting rules to a personalization point that has multiple decisions configured, analytics for those underlying decisions will show a dip. This is expected — traffic is being routed through the experiment instead of the decisions. Plan your experiment timing and communicate this to stakeholders.

### Random Assignment

Cohort assignment is random and based on the traffic allocation percentages you define. Personalization handles the randomization — you do not need to implement any client-side logic for assignment.

---

## Viewing Experiment Analytics

Once an experiment is active and receiving traffic, you can monitor its performance through the built-in analytics dashboard.

### Accessing Analytics

1. Navigate to the **Experiments** tab in the Personalization application.
2. Find your experiment in the list view and click into the detail page.
3. Open the **Analytics** tab.

### What You'll See

The experiment analytics dashboard displays:

- **Primary metric performance** for each cohort — This is the metric that determines the winning cohort. You can compare cohort performance side by side.
- **Secondary metric performance** — Additional metrics you configured are displayed for supplementary analysis.
- **Traffic distribution** — Verify that traffic is being allocated according to your defined percentages.
- **Cohort-level breakdowns** — See how each cohort is performing in terms of the defined engagement signal metrics.

### Data Processing Delay

> **⚠️ Important:** Experiments require up to **24 hours** from the time they are activated to begin processing data and displaying analytics. Do not expect to see results immediately after activation. Plan your experiment duration accordingly — short experiments (less than a few days) may not produce statistically meaningful results.

---

## Experiment Lifecycle Management

### Experiment Duration

Experiments will **stop processing data after 90 days**. If you need to run an experiment for longer than 90 days, you will need to archive the current experiment and create a new one.

### Ending an Experiment

When you are ready to conclude an experiment, you have two options:

#### Option 1: Archive the Experiment

- Archiving removes the experiment from the personalization point's **Related** tab but **retains all records and data**.
- You can access archived experiments from the **Experiments** tab in the Personalization application.
- Archived experiment data remains available for review and reporting.
- Archiving frees up the personalization point to accept a new experiment.

#### Option 2: Delete the Experiment

- Deleting the experiment **removes it completely**, including all underlying objects and data.
- This action is **irreversible**.
- Use this option only when you no longer need any data or records associated with the experiment.

> **🚨 Warning:** Deleting an experiment permanently removes all associated data, including analytics. If you might need to reference the experiment's results in the future, choose **Archive** instead.

### Creating a New Experiment

To create a new experiment on a personalization point that already has an experiment:

1. Either **archive** or **delete** the existing experiment.
2. Follow the steps in [Creating an Experiment](#creating-an-experiment) above to configure a new one.

Only one experiment can exist on a personalization point at any given time.

---

## Best Practices for Experimentation

### Planning Your Experiment

- **Start with a clear hypothesis** — Define what you expect to learn before creating the experiment. For example: "We believe an objective-based recommender optimizing for revenue will outperform a rules-based top-sellers recommender on the product detail page."
- **Choose meaningful metrics** — Select a primary metric that directly aligns with your business goal. If you're optimizing for revenue, use a revenue-based metric, not a click count.
- **Allow sufficient runtime** — Give your experiment enough time to collect statistically meaningful data. A few days of traffic may not be enough, especially for lower-traffic pages.

### Traffic Allocation

- **Use even splits for initial experiments** — A 50/50 split between two cohorts is the simplest and most statistically sound approach for your first experiment.
- **Use a control cohort when measuring lift** — A control cohort that falls through to existing decisions lets you measure the true incremental impact of your new strategy.
- **Avoid very small allocations** — Allocating less than 10% to a cohort may result in insufficient data to draw conclusions within a reasonable timeframe.

### Managing Impact on Existing Decisions

- **Communicate experiment timing** — When an experiment goes live, it takes priority over all decisions on the personalization point. Inform stakeholders that decision-level analytics may temporarily dip.
- **Use targeting rules for gradual rollout** — If you don't want the experiment to affect all traffic, apply targeting rules to limit the experiment to a specific audience (e.g., a geographic region or customer segment).

### After the Experiment

- **Roll out the winning strategy** — Once you have a statistically significant winner, archive the experiment and update your decisions to reflect the winning cohort's configuration.
- **Document your findings** — Record the experiment hypothesis, configuration, results, and any insights for future reference. This builds institutional knowledge about what works for your audience.

---

## Example: Running a Recommendations A/B Test

Here is an end-to-end example of setting up and running an experiment to test two recommendation strategies on a product detail page.

### Scenario

You have a personalization point called **"PDP Recommendations Bar"** that displays product recommendations on your product detail pages. Currently, it uses a rules-based "Top Sellers" recommender. You want to test whether an objective-based "Maximize Revenue" recommender would perform better.

### Setup

1. **Verify prerequisites:**
   - The personalization point "PDP Recommendations Bar" is active with a recommendations response template and a profile data graph assigned.
   - Engagement signals exist for "Product Browse," "Add to Cart," and "Purchase" — all built against engagement DMOs on the profile data graph.
   - A "Purchase Revenue" metric (sum of net order amount) exists on the "Purchase" engagement signal.

2. **Create the experiment:**
   - Navigate to the "PDP Recommendations Bar" personalization point → Related tab → New Experiment.
   - **Primary Metric:** Purchase Revenue (sum)
   - **Secondary Metrics:** Add to Cart Count, Product Browse Count
   - **Targeting Rules:** None (test across all visitors)

3. **Configure cohorts:**
   - **Cohort A (50%):** Select the existing "Top Sellers" rules-based recommender.
   - **Cohort B (50%):** Select the new "Maximize Revenue" objective-based recommender.
   - **Control (optional):** You could add a 10% control cohort that falls through to existing decisions, adjusting Cohort A and B to 45% each.

4. **Activate** the experiment.

### Monitor

- Wait at least 24 hours for analytics to begin processing.
- Check the **Experiments** tab → detail page → **Analytics** tab for cohort performance comparisons.
- Let the experiment run for at least 2–4 weeks to collect sufficient data.

### Conclude

- Once a statistically meaningful difference appears, archive the experiment.
- If Cohort B ("Maximize Revenue") wins, update the personalization point's primary decision to use the objective-based recommender.
- Document the results and share with stakeholders.

---

## Related Topics

- [Personalization Points](web-implementation/personalization-points.md) — How to create and configure personalization points
- [Decisions](web-implementation/decisions.md) — How to configure decisions on personalization points
- [Recommenders](web-implementation/recommenders.md) — Rules-based and objective-based recommender configuration
- [Experiments (Web Implementation)](web-implementation/experiments.md) — Experiment configuration within the web implementation context
- [Personalization API](personalization-api.md) — How experiments interact with the Decisioning API at runtime

> **📝 Note:** This guide is based on documentation as of March 2026. Salesforce releases updates three times per year — verify experiment features and limits against the latest [Salesforce Personalization documentation](https://help.salesforce.com/s/articleView?id=sf.personalization_experimentation.htm).
