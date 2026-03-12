# Experiments

An **experiment** lets you A/B test different decisioning strategies on a personalization point. By splitting traffic into cohorts — each receiving a different decision configuration — you can measure which approach best achieves your business objectives.

---

## How Experiments Work

An experiment is configured directly on a [personalization point](personalization-points.md) and is treated as the **highest priority item** on that point. When a request comes in:

1. The individual is evaluated against the experiment first (before any decisions)
2. If the individual qualifies based on targeting rules, they are randomly assigned to a cohort
3. The cohort's decision configuration determines the response

> **⚠️ Important:** Only **one experiment** can be active on a personalization point at a time. If you need to run a new experiment, you must first archive or delete the existing one.

---

## Experiment Components

### Primary & Secondary Metrics

Metrics define how the experiment is measured. They come from **engagement signal metrics** where the underlying engagement DMO exists on the selected profile data graph.

| Metric Type | Purpose |
|---|---|
| **Primary Metric** | Determines the **winning cohort**. Only one primary metric per experiment. |
| **Secondary Metrics** | Displayed in the experiment analytics screen for additional insight. Add as many as needed. |

**Example:** For a product recommendations experiment:
- **Primary Metric:** Purchase conversion rate (compound metric = purchases ÷ product browses)
- **Secondary Metric:** Revenue per visitor, click-through rate

### Targeting Rules

Optionally restrict the experiment to a subset of individuals. The available targeting rules are the same as those on [decisions](decisions.md):

- Profile DG attributes (direct and related)
- Calculated Insights
- Segment memberships
- Contextual rules

If no targeting rules are applied, **all individuals** are eligible for the experiment.

### Cohorts

Cohorts represent the possible decision configurations that an individual could receive. Each cohort has:

| Property | Description |
|---|---|
| **Name** | A descriptive label (e.g., "ML Recommendations", "Top Sellers", "Control") |
| **Traffic Allocation** | Percentage of eligible traffic routed to this cohort. All cohort allocations must sum to 100%. |
| **Decision Configuration** | The same configuration options as a standard decision — personalization attributes and/or recommender selection, depending on the personalization type. |

### Control Cohort

You can optionally designate a cohort as the **control cohort**. The control cohort can be configured to **fall through** to be evaluated against any other decisions configured on the personalization point. This is useful for comparing a new personalization experience against whatever the individual would have received without the experiment.

---

## Creating an Experiment — Step by Step

1. Navigate to the **Personalization** app → **Personalization Points**
2. Open the personalization point where you want to run the experiment
3. In the **Experiments** section, click **New Experiment**
4. Select the **primary metric** (e.g., purchase count, click-through rate)
5. Optionally add **secondary metrics**
6. Optionally configure **targeting rules** to limit the experiment audience
7. Add **cohorts**:
   - Give each cohort a name
   - Set the **traffic allocation** percentage
   - Configure the cohort's decision settings (personalization attributes and/or recommender)
8. Optionally designate one cohort as the **control cohort**
9. Save and activate the experiment

---

## Runtime Behavior

When an experiment is active on a personalization point:

```
Individual requests personalization point
│
├── Experiment active? → YES
│   │
│   ├── Individual qualifies (targeting rules)? → YES
│   │   └── Randomly assign to a cohort based on traffic allocation
│   │       └── Return the cohort's decision response ✓
│   │
│   └── Individual does NOT qualify → Skip experiment
│       └── Evaluate standard decisions by priority ↓
│
└── No experiment → Evaluate standard decisions by priority
```

> **🚨 Warning:** Since experiments are the highest-priority item on a point, applying an experiment with **no targeting rules** will route **all traffic** through the experiment. Expect a **dip in analytics** for any underlying decisions during the experiment period, as traffic is diverted away from them.

---

## Viewing Experiment Analytics

1. Navigate to the **Personalization** app → **Experiments** tab
2. Click on the experiment to open its detail page
3. Go to the **Analytics** tab
4. Review cohort performance against the primary and secondary metrics

> **📝 Note:** Experiment data is processed with a **24-hour delay**. Results will not appear immediately after the experiment starts.

### What You'll See

- **Cohort comparison** — Side-by-side performance of each cohort
- **Primary metric results** — The metric that determines the winner
- **Secondary metric results** — Additional context metrics
- **Statistical significance** — Confidence level of the results

---

## Experiment Lifecycle

### Duration

Experiments stop processing data after **90 days**. Plan your experiment duration accordingly — ensure you have enough traffic and time to reach statistical significance within this window.

### Managing Completed Experiments

When you're done with an experiment, you have two options:

| Action | What Happens |
|---|---|
| **Archive** | Removes the experiment from the personalization point's Related tab but retains all records and data. You can access archived experiment data from the Experiments tab. The experiment can no longer be used on a personalization point. |
| **Delete** | Permanently deletes the experiment and all its underlying objects. This action is irreversible. |

### Starting a New Experiment

To create a new experiment on a personalization point that already has one:

1. **Archive** the existing experiment (preserves data), or
2. **Delete** the existing experiment (removes data)
3. Create the new experiment

---

## Best Practices

1. **Define your hypothesis first** — Before creating an experiment, clearly state what you're testing and what outcome you expect
2. **Use meaningful metrics** — Choose a primary metric directly tied to business value (revenue, conversion rate) rather than vanity metrics (page views)
3. **Run long enough** — Give the experiment enough time to collect statistically significant results. Avoid drawing conclusions from the first few hours of data
4. **Include a control cohort** — Comparing against a control gives you a true measure of personalization lift
5. **Limit concurrent changes** — Don't modify decisions or recommenders on the same point while an experiment is running — it invalidates the results
6. **Document your learnings** — When archiving an experiment, note what you learned so future experiments build on previous insights

---

**Next:** [Web Templates (Transformers)](web-templates.md) — Learn how to convert JSON decision responses into rendered HTML using Handlebars templates.
