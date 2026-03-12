Overview
This guide details the implementation of Salesforce Personalization (SP), focusing on
web-based applications. It outlines a comprehensive process, beginning with foundational data
setup in Data Cloud, including real-time data ingestion via the Web SDK, data modeling, identity
resolution, and the creation of Profile and Item Data Graphs. The document then transitions to
building personalization elements like Recommenders (both rules-based and objective-driven),
Response Templates, Personalization Points, and Decisions/Experiments. Finally, it explains
how to deploy and manage personalized experiences on a website using the Web
Personalization Manager and how to measure performance through Attribution Models and
Experiment Analytics.

NOTE: While we will aim to try and keep this document updated, please be aware that our
official documentation site contains the most up to date information.

Key Sections Include:

● Preparing for your SP Implementation:
○ Understanding the Implementation Lego Blocks
○ Implementation Personas
○ Defining an Implementation Blueprint
● Setting Up the Data Cloud Foundation
○ Real-Time Data Ingestion Options
○ The Anatomy of the Data Cloud Web SDK
○ Creating a Website Connector & Deploying the SDK
○ Sitemaps & Web Schemas
○ Data Stream Deployment & DMO Mapping
○ Configuring Identity Resolution
○ Profile Data Graphs
○ Item Data Graphs
○ Understanding Data Graph Update / Refresh Cycles
● Personalization Building Blocks
○ Personalization Setup Page
○ Personalization Types
■ Manual Content
■ Recommendations
○ Recommenders
■ Rules-Based Recommenders
■ Objective Based Recommenders
● Engagement Signals
● Engagement Signal Metrics
○ Response Templates
○ Personalization Points, Decisions, & Experiments
■ Personalization Points
■ Personalization Decisions
■ Experiments
○ Run-Time Decision Flow
● Delivering a Personalized Experience on Your Website
○ Web Templates
○ Engagement Destinations
○ Web Personalization Manager
■ Adding a Personalization Experience
■ Defining Engagement Data Tracking
■ Previewing the Web Personalization Experience
● Measuring Personalization Usage & Performance
○ Attribution Model Creation
○ Reviewing Attribution Analytics
○ Experiment Analytics
○ Pipeline Intelligence Dashboard
Preparing for your SP Implementation
Before starting your implementation, there are a number of steps you can take to help ensure
that your implementation is set up for success. By understanding implementation levers
available to you, defining clear use case goals, and outlining data requirements, you will
increase your chances for a smooth implementation process. This section covers off on some of
the key pre-implementation steps to consider.

Understanding the Implementation Lego Blocks
To plan for any implementation, it is important that the team members involved understand the
roles of Data Cloud & Salesforce Personalization. While this doc will deep-dive into the various
concepts you will encounter throughout an implementation, fostering a shared understanding
within the implementation team around the relationship between Data Cloud and Salesforce
Personalization is critical.

Data Cloud Overview
Data Cloud acts as the foundation for any implementation. Just like how you can’t build a house
on a bad foundation, you can’t execute meaningful personalization without good data. Any
personalization use case that you are looking to execute will be built directly on top of Data
Cloud and utilize data available in DC. A high-level overview of the key parts of the DC
ecosystem that you will encounter in your Salesforce Personalization implementation are
detailed below. Each of these areas will be covered in more detail later on in this document.

Data Ingestion & Modeling

Good personalization requires a deep understanding of both a person and the business context.
Since personalization is built directly on top of Data Cloud, this means that any data point that
you are looking to use to inform personalization decisioning must be referenceable in Data
Cloud.

● Ingestion / Integration Mechanisms Available:
○ Data Cloud provides a robust variety of options for data ingestion including a
variety of Salesforce Connectors for systems like Commerce Cloud & CRM, over
290 3rd party connectors and a zero-copy framework to reference data stored in
systems like Redshift, Databricks, BigQuery, & Snowflake.
■ See developer documentation for more detailed integration guidance
○ For most SP implementations, the initial focus will likely revolve around web
personalization with goals to then eventually expand into additional channels like
mobile, email, in-store, etc. For web data ingestion, Data Cloud provides a
framework to track and ingest behavior on a website in real-time via a website
connector and the DC Web SDK (Server-Server event tracking is also available if
desired).
● Data Modeling:
○ Once data is available in DC it can be modeled into Data Model Objects (DMOs)
within a data cloud dataspace
○ These DMOs are the basis for understanding a person in the context of a
customer’s business and are the direct fuel for personalization
Identity Resolution

Ingesting data from different systems will usually result in different understandings of an
individual being available (e.g. different identifiers are used to identify a person in various
systems). Being able to unify these different views of a person into a single unified individual
provides personalization with a more complete picture when it comes time to execute a
personalized decision. Data Cloud’s robust IR framework allows customers to configure RT and
NRT IR rulesets to help ensure that the understanding of an individual is comprehensive. A
thoughtfully constructed IR strategy ensures that personalization decisioning is informed and
consistent across touchpoints. For web implementations, it’s best to plan your IR strategy in a
manner that accounts for a high degree of anonymous individuals and considers identifiers that
are available on your web properties.

IR Documentation available here

Calculated Insights & Segmentation

With data modeled and IR configured, customers can begin to analyze their data and build out
segments of individuals based on desired use case needs. While segments and calculated
Insights (CIs) are not necessarily required for a personalization implementation, they can be
used in a variety of different ways. Quick notes on each are follows:

● Segments: Segments allow customers to group individuals together based on various
conditions. Segments can be used by personalization for decision targeting. (Doc link)
● Calculated Insights: Calculated insights provides customers with a flexible mechanism
to analyze their data and define and calculate multidimensional metrics. (Doc link).
Calculated insights can be used for personalization targeting, recommendations filters,
and recommendation decision strategy construction.
Data Graphs

During your Salesforce Personalization implementation, you will become intimately familiar with
Data Graphs. Almost every part of the Salesforce Personalization ecosystem relies on either a
Profile Data Graph, Item Data Graph, or combination of the two (Doc Link). At the highest level,
a data graph brings together structured data from your Data Model Objects (DMOs). It combines
this data to create easy-to-use views of your information. The two critical types of data graphs
you will leverage are as follows:

● Real-Time Profile Data Graph: This is the understanding of a person that will be
referenced at run-time by personalization in order to execute decision eligibility
evaluation against any targeting rules configured and then also used as the input to any
ML based decisions that are made. A Real-time profile data graph combines the unified
understanding of an individual with engagement data, segment memberships, and CIs.
The RTDG is effectively the heartbeat of personalization.
● Item Data Graph: A data graph built against a DMO of type “other” is referred to as an
Item Data Graph and is meant to represent pieces of business context like products,
articles, blogs, events, etc. Anything that is modeled as an item data graph is
recommendable by Salesforce Personalization’s decision service.
Data Cloud Role Summary

While Data Cloud provides an extremely broad array of capabilities (including many more that
are not directly referenced above), its role in a personalization implementation can be best
summarized as the engine for data ingestion, modeling, manipulation, and analysis.
Personalization is dependent on the data cloud foundation in order to deliver relevant,
individualized decisions.

Salesforce Personalization Overview
With the data foundation in place, we can now look to understand the various personalization
services that you will encounter (Doc link). Salesforce Personalization services can really be
bucketed into three categories: Decisioning Services, Analytics & Attribution, & Agentic Actions.
Each of these areas will be covered in more detail later in this document, but a high-level
overview is included below.

Decisioning Services

Salesforce Personalization provides customers with a number of tools designed to help them
craft, target, and test different decisioning strategies. To execute desired use cases, customers
will encounter the following Personalization Concepts:

● Personalization Points & Decisions:
○ A personalization point represents a "point" in an experience that’s eligible for a
personalization decision. A personalization point has a type and response
template that defines the kind of personalization that you can configure on a
decision and which personalized content that decision returns.
○ A personalization decision determines who’s eligible to receive a personalization
response using optional targeting rules. Decisions also determine what content to
return, for example, a set of product recommendations or a banner image. A
personalization point can contain multiple personalization decisions targeted at
different sets of individuals. You can prioritize decisions so that if a person
qualifies for more than one, Personalization returns only one decision.
○ Pertinent documentation here
● Experimentation
○ In addition to configuring decisions on personalization points, a business user
might want to test different decisioning strategies against each other. To do this,
they can configure an experiment on a personalization point, define key metrics
for testing, and build out different decisioning cohorts with customizable traffic
allocations.
○ Pertinent documentation here
Analytics & Attribution

Delivering a personalized experience is only half the battle. Being able to track and understand
personalization performance is critical. Personalization’s analytics and attribution framework
provides customers with the ability to define attribution models, understand personalization
usage, and track personalization effectiveness. The two key elements of this framework are the
following:

● Pipeline Intelligence: Pipeline intelligence provides insights derived from activity
associated with the Personalization request process. Pipeline intelligence analytics give
details on how the Personalization app is performing using technical, operational
performance metrics associated with inbound and outbound Personalization service
requests. These metrics include the number of decision requests, number of
personalization points, number of personalization decisions, and number of unique
individuals targeted to highlight pipeline performance and health.
● Attribution Service: Attribution intelligence provides insights on more complex metrics,
like how visitor engagement with specific personalization points affect your business.
Using preconfigured or custom attribution models, you can see where revenue and
product orders can be directly attributed to using a specific personalization point or other
personalized content. By identifying which personalized experiences contribute most to
business success, you can improve how you provide personalized content to enhance
customer satisfaction and reinforce business goals.
● Analytics documentation
Agent Actions

Personalization agent actions extend personalization decisioning services into the Agentforce
ecosystem to unlock smarter and more personalized agentic experiences. Actions available for
use include the following:

● Get Recommendations: Allows an agent to request a personalized decision that is
configured in Salesforce Personalization and inject individualized, ML powered
relevance to the agentic conversation.
● Get Context: Personalization’s context curation service ensures that your agent is
always armed with the relevant data needed to address your customer’s question.
This document will focus more on the non-agentic implementation process.

Salesforce Role Summary

Salesforce Personalization allows customers to leverage the rich data available in Data Cloud to
execute intelligent, targeted, machine learning driven experiences across channels and
touchpoints.

Implementation Personas
Before starting your implementation, it is important to ensure that you have the proper resources
available to contribute. A breakdown of the implementation resources that you should consider,
along with details around the tasks that they might handle, are detailed in this section.

Salesforce Administrator

Though not listed in the graphic above, the Salesforce Admin has a relatively straightforward
role in a SP implementation. Their primary role is centered around user creation and permission
set management:

● User Creation:
○ Ensuring the partner or implementation resources have a user profile in
Salesforce
● Permission Set Management (Link):
○ In order to implement Salesforce Personalization, implementation resources will
need the necessary permission sets added to their profiles
○ The critical perm sets that are required are the Personalization Admin perm set
(custom perm set based on the Personalization permission set license) and the
Data Cloud Admin perm sets
○ Admins can also create variations of perm sets for individuals that use SP on a
day to day basis to restrict actions based on role
● Datakit Deployment (Link):
○ Deploy the foundational personalization datakit from the personalization setup
page to ensure personalization objects are available in your target dataspace
Project Manager

This role can look different based on the organizational structure of the company. For a web
implementation, the project manager or “personalization lead” would likely take the shape of a
Web Manager or Website lead. The primary responsibilities of this individual include:

● Use case definition (critical for planning the implementation)
● Day to day personalization management & use case execution
● Implementation timeline definition & use case rollout schedule
Solution Architect

This individual is responsible for translating the desired use cases into an implementation
blueprint that outlines the key data requirements that will unlock near-term business value while
also setting up the customer for longer term success. We’ll talk a bit more about an
implementation blueprint in the next section, but this individual should have a strong
understanding of Data Cloud concepts and how they relate to personalization execution. Key
Data Cloud areas that they should be comfortable in include:

● Data Integration / Ingestion
● Data Mapping / Modeling
● Identity Resolution
● Data Graph Construction
The solution architect will work closely with the implementation engineer to ensure all necessary
data is available for executing key personalization use cases.

Implementation Engineer

For a web implementation, this individual will likely be a web developer. Their role is to work off
of the implementation blueprint provided by the solution architect and define the sitemap that
will capture real-time interaction data from the customer’s website to power personalization use
cases. The implementation engineer will also work to define personalization templates that are
used to render personalization decisions on the website. This individual should be proficient in
Javascript, HTML, CSS, & Handlebars. Additionally, they should be comfortable defining a Data
Cloud web schema and managing object mappings for the data streams that get created via the
Data Cloud web connector.

Defining an Implementation Blueprint
An implementation blueprint is an important tool when it comes to planning out your Data Cloud
/ Salesforce Personalization implementation. By clearly defining the desired target use cases
ahead of the implementation, you are better able to identify key data and integration
requirements, define an implementation roll-out that delivers progressive value, and define an
approach that allows for work to happen in parallel as different steps are completed.

An implementation blueprint does not need to be a fancy document. The key things that you are
looking to define in an implementation blueprint are as follows:

● Website Identification:
○ Many customers have multiple websites in their portfolio
○ Typically, we recommend picking 1 site to start with before expanding the
implementation out to additional websites
○ For multi-site implementations, there are a number of considerations that might
factor in how you ultimately want to implement the SDK and sitemap. Additional
detail on this topic is covered later on in this document
● Prioritized List of Use Cases:
○ A clear list of desired use cases will help guide an implementation.
● Use Case Data/Integration Requirements:
○ For each use case, it is good to try and map out the data points that you will need
in order to execute the use case. For example, let’s look at the following use
cases:
Profile Data Item Data Additional Data
Use Case: Maximize Revenue Product Recommendations on the Homepage
In order to execute this use
case, we need to understand
product engagement data in
order for the
recommendations model to
learn. In our sitemap, we
would need to make sure that
we are tracking behaviors like
product clicks, add to carts,
and purchases. Additionally,
we might want to consider
supplementing online
transaction data with offline
transactions (eg. in-store
purchases). We typically want
to bring in some amount of
historical transaction data for
initial training and then have
offline transactions loaded on
a recurring basis.
In order to actually
recommend products, we
need a reference of item
metadata available in a Data
Cloud DMO so that we can
construct an Item Data Graph
for use in a personalization
recommender. While Data
Cloud is not meant to replace
your Product Inventory
Management system (PIM),
getting this product metadata
data into Data Cloud might
require a catalog feed. This
catalog feed would likely
need to be loaded/synced on
an ongoing basis to update
things like stock levels, price
changes, new products, etc.
This type of data integration
should be factored into your
implementation planning.
In this scenario, the product
recommendations bar will be
targeted to all customers. If
we wanted to layer in
targeting logic to determine
“who” should be able to
qualify for this experience, we
would need to make sure that
the data we need to apply our
targeting rules is available in
Data Cloud (likely on the
profile data graph).
Furthermore, since we want
to target this use case to the
homepage, we need to make
sure that we are defining
page types in our sitemap
and likely also defining a
content zone and template in
the sitemap for use in
personalization experience
targeting / rendering.
Use Case: Email Capture Pop-Up
For this use case, we are
actually looking to capture a
piece of profile data that we
could use for identity
resolution purposes and also
as a means to build out our
set of known individuals for
cross-channel personalization
use cases.
To ensure we have a spot to
capture the email address,
we likely want to make sure
that our web schema has a
contact point email object and
that our sitemap is configured
in a manner that allows for
email address to be captured
and sent back to Data Cloud.
No item data is needed in this
use case. The simplistic
nature of this use case
makes it a great candidate for
early execution in an
implementation. While you
are working to setup the
integration to bring in item
data for recommendations
use cases, you can be
capturing user engagement
data on the site and building
out a bigger list of known
individuals to enable deeper
personalization when
recommendations are ready
to go.
For this use case, we want to
target the pop-up at
individuals where the contact
point email value is blank. We
need to make sure that this
data point is available on the
profile data graph for
targeting purposes.
● Identity Resolution Data Requirements:
○ Having a defined identity resolution strategy will help unlock deeper
personalization and enable cross-channel consistency
○ When setting up your web implementation, think about the different areas on your
site where someone might provide identifying information (login, purchase, email
capture, newsletter sign-up, etc.). Make sure that you are instrumenting your
sitemap to capture these data points so that when you configure your IR strategy
the underlying data is available for profile reconciliation
● Use case rollout schedule:
○ As you can see from the simple use cases outlined above, different use cases
have different data and integration dependencies
○ It’s expected that a customer’s use case list will have a range of data
requirements. Ideally, by defining the use cases and mapping out the data
requirements, we can enable an implementation process that lets the customer
progressively push use cases live as data requirements are met
○ A customer’s highest priority use case might require more data, but it shouldn’t
prevent them from starting to realize value from simpler use cases that they can
get out the door more quickly
Ultimately, we want to avoid falling victim to the implementation misconception that I need my
DC implementation completely done before executing personalization use cases. Instead,
customers should approach an implementation with a more agile mindset. Different
personalization use cases have different data requirements. To start realizing value from your
DC implementation early, look to execute simple personalization use cases with minimal data
dependencies early on in the implementation cycle (eg. pop-ups, infobars, manual content).

Setting Up the Data Cloud Foundation
With your implementation blueprint complete and your resources ready to go, it’s time to start
setting up the Data Cloud foundation that will unify and integrate the various data points you
need in order to execute cross-channel personalized experiences. This part of the document
walks through the various components of the Data Cloud foundation that are critical to a
successful web implementation.

Real-Time Data Ingestion Options
As outlined in the Data Ingestion & Modeling part of the Data Cloud Overview section, there are
a wide variety of options to bring data into Data Cloud. For a web implementation, the two most
likely options for RT data ingestion are the Data Cloud Web SDK or Data Cloud Server-Server
API first ingestion approach. The server-server approach is used when the customer prefers to
not add an SDK to their site. In this document we will focus on the scenario where the Data
Cloud Web SDK is implemented on the website.

The Anatomy of the Data Cloud Web SDK
While not necessarily required in order to execute an implementation, it might be helpful to
understand the components of the DC Web SDK. The graphic below outlines the various key
elements of the SDK with a high-level view of how they interact with the website, Data Cloud,
and Salesforce Personalization. Overviews of each part of the SDK are provided below the
graphic.

The four key components of the DC SDK are as follows:

● Base SDK: The base SDK defines data structures and basic functionality for data
collection. This core functionality includes utilizing the Salesforce Interactions unified
event data model.
● Sitemap: Customer driven configuration required to capture structured events from the
website (eg: page view, add to cart, purchase, button click).
● DC Module: Converts structured events produced by the sitemap to flattened DC
events, enriches them with additional contextual information and sends them to the DC
backend
● Salesforce Personalization Module: Finds eligible Personalization Experiences,
requests personalization decisions, and renders personalization responses on the page
As we continue through this document, we’ll walk through key components of a sitemap, how
customers should think about sitemap event translation for event mapping in Data Cloud, and
then how Salesforce Personalization is able to request and render personalized experiences on
the site.

Creating a Website Connector & Deploying the SDK
The first step in data ingestion revolves around creating a website connector in Data Cloud (doc
link). While the creation of the connector itself is easy, there are a couple of key things to
consider:

● Website Connector to Website Domain Cardinality:
○ For the most straightforward implementation, keep your website connectors 1:
with a website domain
○ While you can write a sitemap that works across different websites (effectively by
having a different part of the sitemap initialized based on the site domain) and
deploy the same connector across multiple sites, this can lead to a more complex
sitemap, a higher degree of risk when executing sitemap changes, and nuanced
data mapping considerations
○ Furthermore, multiple website connectors can be deployed to the same data
space. This allows you to keep website schemas / sitemaps discrete while also
being able to understand cross-website engagement in a single data space if
desired.
A simple guide around making this decision is available in the figure below:

Once you’ve aligned on your website connector strategy and created your connector, you can
take the connector specific script tag at the bottom of the connector page and deploy it to the
header of your website. You will now be able to start building out your sitemap and web schema.

Sitemaps & Web Schemas
In order to start capturing data you will need to construct your sitemap and web schema. Based
on the implementation blueprint created earlier on in this process, you should have a decent
idea of the types of data points that you need to capture from the site in order to deliver against

JavaScript
your use cases. A high-level overview of the sitemap & schema relationship is detailed in the
diagram below and this section covers the nuances of the relationship in detail.

Sitemap

A sitemap is a configuration-driven integration layer that executes within the Data Cloud SDK
and provides customers with a mechanism to capture customer engagement in the context of
their business. Key components of a sitemap include:

Consent Management:
Not all website visitors and customers consent to cookie tracking. To support consent
management, the SDK is designed to send events only if a customer has consented to tracking.
When consent is revoked, the Web SDK captures this preference and then immediately stops
emitting events. (docs)

SalesforceInteractions.init({
consents: [{
provider: 'ExampleProvider',
purpose: 'Tracking',
status: 'Opt In'
}]
})
Page Types:
A sitemap is made up of many page type configs (docs). 1 page type config can apply to
multiple pages and page types organize sitemap code structure & logic to help define where an
event originated. From a personalization standpoint, page types allow users to easily configure

JavaScript
multi-page personalization experiences (eg: show Recs on all Product pages). The key
properties of a page type event construction in the sitemap are as follows:

● Name: name of the Page Type (Home, Product Display Page, Cart, Article, etc.)
● isMatch: a boolean function that should return TRUE (or a Promise that resolves to
TRUE) when the page opened in the browser matches the page type. This function can
rely on the Data Layer, page URL, meta tags or any other information available on the
page
● interaction: object that describes an engagement event that will be sent to Data cloud
alongside the name of the pageType viewed. Inside the interaction object there are:
○ name: describes the action being performed. For page visits, this action is
typically a VIEW action (as opposed to button clicks which might be form
submissions, add to carts, etc.)
○ eventType : The identifier that is used to map the event to an object defined on
the web schema (discussed in the next section). It’s strongly recommended to
explicitly define the eventType attribute for each page type.
{
name: "home",
isMatch: () => {
return window.location.pathname === '/'
},
interaction: {
name: "home view",
eventType: "websiteEngagement",
}
}
Content Zones:
Content Zones define pre-configured areas of the website at the global or page type level that
are eligible for personalization.When a customer is looking to apply personalization to the
website via the web personalization manager (WPM), they can choose to replace a content
zone that the developer defined in the sitemap. Key parts of a content zone definition include:

● Name : The name of the content zone. This name is displayed in the UI of Web
Personalization Manager, when a web manager is selecting a location for a personalized
experience render
● Selector : The CSS selector that defines a target element on the page. Content of this
element will be replaced with the personalized experience.
Note: Salesforce Personalization only supports content zones with both “name” and “selector”
defined.

JavaScript
{
name: "home",
isMatch: () => {
return window.location.pathname === '/'
},
interaction: {
name: "home view",
eventType: "websiteEngagement",
},
content Zones: [
{
name: "hero_banner",
selector: "div#hero"
},
{
name: "recommendations",
selector: "div#main.recs"
}
]
}
Engagement & Identity Events
Each event sent from the sitemap can include two different types of information: “Engagement
Data” and “Profile Data”. Quick definitions of each kind of data are as follows:

● Engagement Data: Contains information about a specific event performed by the user
on the page. For example: page view, button click, add to cart, form submit, etc.
● Profile Data: Includes information about a specific user. For example, the user’s email
address, number of loyalty points, first name, etc. (think profile attribute data)
Sitemap Event Translation
Since a single event can include information that should be mapped to different DMOs, the Data
Cloud SDK allows you to specify different event types for different types of data within one
sitemap event. When defining event types in the sitemap, be sure to consider the following:

● Engagement Data: “eventType” should be defined under the “interaction” object
● Profile Data: “eventType” should be defined under the “user.attributes” object
When the sitemap goes to send the event to DC, the DC module actually splits the sitemap
event into multiple events based on these event types to allow for mapping to different DMOs to

JavaScript
JavaScript
occur. For example, let’s look at the following sitemap event and subsequent DC event
translation:

SalesforceInteractions.sendEvent({
interaction: {
eventType: 'userEngagement',
name: 'button_click'
},
user: {
attributes: {
eventType: 'contactPointEmail',
email: 'joe.smith@domain.com'
}
}
})
The DC module of the SDK would take this event and translate it to the following set of events
before it gets sent to DC:

[
{
"eventType": "contactPointEmail",
"email": "joe.smith@domain.com",
"category": "Profile",
...
},
{
"eventType": "userEngagement",
"interactionName": "button_click",
"category": "Engagement",
...
}
]
In addition to sending the fields defined on the sitemap event, the Data Cloud SDK
autopopulates a set of values on every event like dateTime, deviceId, eventId, etc. A full list of
these auto-populated values is available in the documentation here.

Web Schema

With your sitemap configured, events sending to DC and an understanding of how sitemap
events are translated into the Data Cloud, you’ll need to ensure that a web schema is
configured with all the necessary objects. A web schema is a JSON document that defines a
collection of event definitions used in Data Cloud (doc link). In order for any of the events
emitted by the sitemap to successfully land in DC and be available in Data Lake Objects (DLOs)
for mapping, a corresponding schema object needs to exist. For every event type defined in
your sitemap, you need a matching schema object. For any attribute or data point on the event,
a corresponding attribute needs to exist on the related schema object.

While building your sitemap, it’s helpful to construct your schema in parallel to validate events
are properly registering in DC. If you are sending events from your sitemap and not seeing data
appear in DC as expected, it is likely due to missing attributes on the schema event definition. A
screenshot of an example schema is provided below:

After finalizing your sitemap and web schema, you are able to deploy your web data streams in
DC. It’s important to note that you don’t need to wait to deploy the data streams until you’re
done sitemapping. Deploying the data streams can help with event validation via data explorer.
Just keep in mind that as you add schema objects, you’ll need to update the data streams in
order to view events in DC.

Data Stream Deployment & DMO Mapping
With your web connector set up and sitemap/schema done, the next step is to deploy the web
data streams associated with the website (done via the data streams tab in Data Cloud).

When you go to deploy the datastreams, it’s important to understand the following:

● Data Stream Components of a Web Connector: Once you select your website
connector and click next, you will see a list of all of the event definitions that you have
defined in the web connector schema. Select all of the events to enable DMO mapping.
If you are defining event definitions while sitemapping (to progressively validate events
landing correctly in DC), you will need to come back to this data stream page to select
the newly added event definitions as you go
Data Space Selection: Select the data space that you want to deploy your website
connector data streams to. Once deployed, data streams can be shared to additional
data spaces. Sharing data streams to additional data spaces does not duplicate credit
consumption associated with data ingestion. The data is simply ingested once and then
shared to different data spaces.
Partial vs Incremental Updates: It is critically important that your web data streams
leverage partial refresh mode. Incremental mode overwrites / clears any values that are
not included on the event and should not be used for web implementations. Partial mode
is the default setting.
Filters: Filters allow you to add in optional criteria to filter out certain events from flowing
to a data space.
Once deployed you can map these data streams to DMOs in a data space (doc link) to act as
the foundational elements for personalization. Key considerations while mapping data streams
to DMOs are as follows:

● Data Streams Created: Your web schema determines what data streams are deployed
for your website. A unique data stream is deployed for each profile type event definition
and then one behavioral datastream is deployed for all engagement event definitions.
● Schema Object to DMO Cardinality: While the all event data object in the data stream
can be mapped to multiple DMOs, all other schema objects must be 1:1 mapped to
DMOs. Mapping a schema object to multiple DMOs can cause data to be overwritten. It
is possible to map one field from a DLO object to multiple fields on a single DMO.
● Common Mappings: Some common mappings for standard fields are outlined in the
table below
Schema Field DMO Field
All Event Data DLO Object
dateTime Created Date
deviceId Individual Id
(For identity data streams, deviceId can also
be mapped to partyId)
eventId DMO Engagement Object Primary Key
Engagement DLO Objects
eventType Engagement Channel Type
interactionName Engagement Channel Action
sourceChannel Engagement Channel
personalizationID Personalization
A quick graphic depicting the essential web data streams is below.

Taking a Progressive Approach to Data Stream Mapping

To simplify the data stream mapping process, you can leverage a progressive approach to data
stream mapping. In this approach, you effectively deal with one event type and one DMO at a
time. This approach allows you to focus on a single schema object at a time and more easily
take advantage of some of the automated mapping capabilities in Data Cloud. To do this
approach, simply follow these steps:

● Split your entire Web Connector Schema file into separate files. Break it down by Event
Type. Each Behavioural Event Type should have a separate Schema File.
● Add the first Behavioural Event Type Schema File to the Web Connector Schema config
● Create a new Behavioural Event Data Stream (or add an Event Type to an existing Data
Stream)
● Complete all required mapping for this Event Type
● Repeat the process for all other Event Types
To take advantage of the automated mapping capabilities that can help accelerate the mapping
process ensure that it’s important to understand how the automated mapping process works.
Web Schema (Web Data Steam) fields with “masterLabel” having the exact match with the
labels of the DMO fields will be automatically mapped, saving you a lot of time as you won’t
have to manually map fields one by one.

Considerations for Multiple Web Connectors

If you are conducting an implementation that has multiple website connectors, you must decide
if you want to either mix all the website data and business context data into a single data space
or separate it out by a factor like brand, region, or department. A quick pro-con list of
considerations are below.

Multiple Websites In Single Data Space Single Website in Single Data Space
Pros:
● Unlocks personalization, activation,
and analytics capabilities based on
cross-brand / region / department data
○ Ex. The ability to perform IR
across a set of brands that
typically operate in silos could
yield new insights /
opportunities to grow customer
relationships / LTV across the
entire portfolio
Pros:
● If the brands are quite different in
terms of products, content, purpose, a
separate data space allows for clean
separation of data making it
potentially easier to manage data
analytics and personalization (for
example more easily avoid
recommending products from one
brand on another’s website)
● If teams are unique across brands
and operate relatively independently
from each other, a separate data
space allows a customer to restrict
these team members access to only
the brands that they are responsible
for (same for concept applies for
different geos of the same brand)
Cons:
● Puts the onus on the business teams
to ensure that the right data is being
used for personalization / activation
● For companies with brands that
typically act / manage day to day
operations independently, this could
lead to challenges around
management of segments,
personalization recommenders, etc.
Teams have more ability to cause
problems for each other if operating in
the same data space
Cons:
● Additional data spaces cost extra
money
Understanding Standard vs Custom Interaction Events
When reviewing sitemapping documentation, and for those familiar with Marketing Cloud
Personalization (MCP) sitemapping, you might see some standard interaction structures
referenced for various events like “View Catalog Object”, “Purchase”, and “Add to Cart”.
Sitemap events with standard Interaction Names are transformed to DC events using
pre-configured patterns. For these events the value of the “Event Type” field is automatically
derived based on the Interaction Name and users can’t override these derived values (eg:
events with “View Catalog Object” interaction name will always have an event type of “catalog”).
These standard transformations are due in large part to MCP having a pre-defined set of item
actions that a customer could use. In the below example, you can see how a view catalog object
event against two different kinds of items would get sent to a single schema object.

Since all events with the same “Event Type” can only be mapped to a single DMO, if a website
includes different types of objects (eg: Products and Articles) that a user can interact with in
different ways (eg: View Product, Download Article) it’s recommended to use custom Interaction
Names and Event Types, to be flexible when doing the data mapping. For example this
approach allows to map engagement with different objects to different DMOs (eg: map
engagement with Products to “Product Browse Engagement” DMO, and map engagement with
Articles to “Article Engagement” DMO). An example of events using custom interaction names
with their DC translated events is included below.

Some additional example event translations for standard interaction names are available below:

View Catalog Object

Add to Cart

Purchase

Sitemapping Best Practices
When building out your sitemap and web schema, here are some tips and tricks to help facilitate
a smoother implementation process:

● Build your Sitemap first, test it on the website, capture all emitted events and build a
Schema based on this info
● Understand how sitemap Interaction Events are transformed to DC events in the SDK.
Keep in mind that some of the standard events (that use standard interaction names)
use predefined “Event Type” values and pre-configured transformation logic that might
be different from other generic events
○ Translation of standard events
○ Translation of custom events
● Don’t forget that you can extend your events with additional properties based on the
business requirements
● Use different “Event Types” for engagement with different object types (eg: Products vs
Articles)
● If events are not ingested, make sure that flat DC Events sent by the SDK include all
mandatory fields defined in the Web Schema and that data types match the fields in the
Web Schema
● For behavioural events Data Stream you MUST map “eventType” field of a specific
“Event Type” group to the target DMO
Configuring Identity Resolution
Prior to building out your profile data graph which acts as the unified understanding of a person,
it’s important to build out an identity resolution strategy (doc link). Ingestion data from multiple
sources means that multiple identifiers will be present for any single person. To ensure that you
have a consistent view of your customer, your IR strategy should be designed around the
identifiers that you know will be available in DC. As part of your implementation blueprint, you
ideally identified these attributes and also outlined where on your website they might be
available to ensure that they are captured.

When creating your IR strategy in Data Cloud, it’s best to configure it in a manner that supports
RT matching. Some key considerations are as follows:

● Data Cloud supports real-time identity resolution capabilities for either exact match or
exact normalized matching (email & Phone number only) IR logic.
● For match conditions that have fuzzy logic, the RT layer will attempt to treat these as
exact match logic & fuzzy matching will occur during batch processing in the Lakehouse
● There is no setting that makes an IR strategy “RT”
● For IR to run in real-time, the unified individual object created must be selected as the
root of a RT Profile Data Graph
● This ensures that when data is captured in the RT layer that IR logic is applied in RT
Once your IR rule-set is created and deployed, a corresponding Unified Individual object will
become available. This object will act as the root DMO for our profile data graph which is
described in the next section.

Profile Data Graphs
A data graph brings together structured data from your Data Model Objects (DMOs). It
combines this data to create easy-to-use views of your information (doc link). There are two
kinds of profile data graphs available for creation: Standard and Real-Time. Real-time data
graphs require Data Cloud’s sub-second real-time sku and should be used for web
implementations. Real-time personalization requires real-time profile data graphs, as the
real-time profile is referenced for real-time decisioning at run-time. Real-time data graphs are
eligible to receive updates in real-time when data is ingested into Data Cloud’s real-time layer
via mechanisms like the web SDK, server-server approach, or ingestion API. A breakdown of
data updates and DG refresh cycles is provided in the next section.

When creating a new data graph, there are some important decisions to make on one of the
initial modal screens (doc link). Before jumping into these settings, however, it’s good to
understand the various locations that a DG can exist:

An overview of each component of the above diagram are as follows:

● Lakehouse: All profiles are stored in the Lakehouse. All non real-time data flows into the
lakehouse and is then synced with the RT profile DG (nuances on data syncing is
covered in a later section)
● Pre-Fetch Cache: The pre-fetch cache is effectively a “warm layer” in between the
Lakehouse and hot-store (real-time layer). The pre-fetch cache allows profiles to be
pre-loaded from Lakehouse based on configurable lookback and record count settings.
By pre-loading profiles into the pre-fetch cache, it enables faster profile access at
run-time to support low latency personalization and enable first page personalization use
cases. Profiles get loaded into pre-fetch when an engagement event against an
engagement object defined on the profile data graph definition receives an update that
falls within the cache lookback window. This means that profiles can get loaded into
pre-fetch due to updates from any data source (not just real-time). The number of
profiles in the pre-fetch cache can exceed the max number of profiles configured on the
Data Graph properties. A nightly job trims the number of profiles in the cache down to
this number.
● Hot-Store: When an event is registered against an individual via the real-time pipeline, a
profile is promoted from pre-fetch (or lakehouse if not already in pre-fetch) to the
hot-store. While in the hot-store, a profile is locked from receiving updates from the
lakehouse until they are out of session. Session duration is a configurable field on the
data Graph
With an understanding of the various layers, we can now examine the configuration options
available to customers. The initial set of key decisions you must make when creating a profile
data graph happen on one of the initial modal screens:

1. Cache Duration: Using record caching keeps records of recently active users in the
real-time layer, allowing instant personalization from the first page of your website. If an
individual is not in DC’s pre-fetch cache, the request for the profile will fall back to the
lakehouse data store and likely result in the individual being treated as a new
anonymous user on initial page load due to increased profile retrieval latency. Cache
duration determines how long ago an individual must have been updated to be
considered “active” and be eligible to get pulled into the pre-fetch cache layer.
2. Max # of Records: The max number of records determines how many profiles should
be held in the pre-fetch layer. This number is respected on initial cache load when a DG
is created. The number of cached profiles can exceed this number throughout the day
and then the cache is trimmed down to the max value in a nightly process based on the
oldest engagement activity timestamp.
3. Session End: Session end determines how long someone should be considered active
in the hot-store. While a profile is in the hot-store, updates from the lakehouse version of
the profile are blocked. Once they are out of the hot-store, they are once again eligible to
receive updates from the lakehouse.
4. Disable Record Caching: It is critical that this setting is disabled for real-time web
personalization. If this setting is on, every personalization request will effectively treat the
individual as if they are anonymous since the profile request will get routed to the
lakehouse. This setting is on by default.
5. Real-Time Data Ingestion: By enabling this setting, data updates made to DMOs
referenced by the DG via the ingestion API can get pushed to the DG as soon as they
occur.

With our DG settings configured, we are now able to construct our understanding of a profile.
Let’s look at the following example data graph to understand the various elements:

Root DMO : Every profile data graph is rooted on a DMO. For profile data graphs, we
recommend leveraging the unified individual object that was created based on the IR
strategy you made in the previous step. This will ensure that personalization has access
to the unified understanding of an individual when making cross-channel decisions. On
the right side of the screen, you are able to select mapped attributes from the DMO that
you want to appear on the DG definition. If you plan to use data from an object in
personalization, make sure that you have selected the attribute. Attributes from the root
DMO are 1:1 with a value and automatically available for use in personalization decision
targeting, recommender filtering, and merge field personalization in Marketing Cloud on
Core.
a. NOTE: While you can always add additional attributes at a later date, keep in
mind that you are not able to remove an attribute from your DG once you have
added and saved.
Segment Memberships Object: If segments are built against the root DMO of your DG,
you will be able to add the segment memberships object to your DG (if no segments are
built against the root DMO of your DG, you will not see this object as selectable). This
will enable you to leverage segment memberships for both personalization decision
targeting and recommendation filters.
3. Related Objects: Related objects are objects that have a relationship to the root DMO
of your profile DG. Attributes from these objects are 1:N with values and also
automatically available for use in personalization decision targeting and recommendation
filtering. It is critically important to ensure that you are adding engagement objects as
related objects to your profile data graph if you plan to leverage personalization
recommenders. Engagement objects like Product Browse engagement, Shopping Cart
Engagement, Product Order Engagement, Knowledge Article Engagement, etc. allow us
to understand an individual's interactions in the context of a business object and are the
underlying fuel for ML based recommendation strategies.
Calculated Insights: calculated insights written against the root DMO of the DG are
available to add to the DG definition. CIs are excellent for providing flexibility around
personalization targeting and recommendations filters
Selecting Fields: As mentioned above, in order for data from an object to actually be
available on the DG, you need to select the fields from the right-hand pane. Once a field
is selected and the DG is saved, you are not able to remove the field from the DG
definition.
Filters: filters can be applied to DG objects to limit the number of engagement events
stored within a DMO on the DG
For more details on DG limits and considerations, reference the documentation available here.

Understanding Profile Data Graph Update / Refresh Cycles
As noted above, profile location (hot-store vs prefetch) can determine when lakehouse data
updates make it into the data graph definition. The last step in Data Graph creation is picking
the refresh cadence. While there are a number of options available, in order to minimize latency
for lakehouse specific updates, we recommend selecting the 30min refresh cadence (this
should be the default value for RT DGs if you are not presented with a selection modal).

If the profile is active in the hot-store, any updates that occur in the lakehouse will not make it to
the profile DG until it is out of the hot-store and DG refresh occurs. Furthermore, for batch
calculated jobs like segment memberships and calculated insights, a DG refresh needs to occur
AFTER the segment or CI has updated in order for the updated values to be present on the DG
definition. For example, if a segment that is on a 4hr schedule updates and a person falls out of
the segment, a DG refresh will need to occur in order for the segment membership removal to
be reflected on the DG.

Data Graph Profile Consumption Pattern Upon Initial Creation
When you initially create your profile DG, you will likely see the following consumption pattern:

● Initial Profile Load into Pre-Fetch: A profile pre-fetch job runs to populate the cache
with all profiles that have had an engagement event associated with an engagement
object on the profile DG in the last 30 days (lookback period for this job is equal to the
cache duration)
● Continued Cache Increase Anonymous From Web Traffic: Assuming a sitemap is
live, it is expected that the number of profiles consumed continue to increase due to
anonymous individuals getting added to the cache (consumption is based on unique
profiles added to the cache over a monthly period)
● Consumption Stabilization: Since the cache has a duration associated with it, it is
expected that the customer will hit a point of equilibrium where profiles added and falling
out of the cache based on activity lookback even out. Customers should not necessarily
view the initial climb of cached profiles as indicative of a perpetual, never ending trend
that puts their monthly consumption target at risk.
Viewing Data in the RT Profile Data Graph
When debugging RT events, it can be helpful to view the data that is currently stored in the
real-time profile data graph. If you navigate to data explorer in data cloud, select the profile data
graph object, and view the JSON, you will see that you can look at the version of the profile in
either the hotstore (RT view) or Lakehouse (NRT view). To debug RT events making it into the
RT profile, make sure that you have real-time View set to “On”.

If you don’t know the unified individual id of the DG you are trying to view, another option to view
the RT DG is to create a DG lookup flow. To create a flow for this, follow these steps:
● Create an auto-triggered flow with the developer name "LookupDataGraph".
○ This flow must have three input parameters with the specified API names:
■ DataGraphAPIName (String)
■ DataspaceAPIName (String)
■ LookupKey (String)
● This flow must have one output parameter with the specified API name:
○ OutputDataGraph (String)
● This flow should have one action, which invokes the "Data Cloud Get Data Graph By
Lookup" invocable action. The three flow input parameters should be passed to their
corresponding IA parameters
○ The action output should be assigned to the OutputDataGraph variable
○ The Lookup Key parameter must be specified using the following format (
represents a value that must be replaced):
.SourceRecordId__c=

To preview the flow for different people, simply enter different id values for the lookup key and
run in debug mode.

Item Data Graphs
The final piece of the Data Cloud implementation puzzle are Item Data Graphs. While the
structure is similar to a profile DG in terms of JSON representation and construction, item data
graphs are used to represent business context data. For example, a customer might build an
item data graph against products, articles, events, etc. Anything that is configured as an item
data graph becomes recommendable via Personalization’s recommendations service.

NOTE: Item data graphs are not required to execute personalization use cases like infobars,
pop-ups, manual content banners, etc. To deliver value early on in an implementation, look to
deploy simple manual content use cases while you continue to build out item data graphs. For
details on manual content personalization, jump to the section here.

Item data graphs should be configured as standard data graphs (not real-time data graphs). To
understand the pieces of an Item data graph, let’s take a look at the following example:

Root DMO: The primary business object. This would likely be goods product, knowledge
articles, offers, etc. When personalizations delivers a recommendation, it returns data
from the root DMO of the item DG. If you want to return product recommendations, you
need to have an item DG built against goods product. Furthermore, only attributes
selected on the right pane of the DG config screen are eligible for use in either
recommendation filters or decision responses. Similar to profile data graphs, once an
attribute is selected and the DG is saved, it cannot be removed. Additional attributes can
be added at a later date if desired.
a. Important Note: Make sure that any attribute necessary for decision rendering
(like image url) is defined on the root DMO of the data graph and selected as a
field. Personalization can only leverage attributes on the root dmo of a data graph
for rendering personalization decisions.
Related Objects: DMO’s with a relationship to the root DMO are available for selection.
Related objects are important for use in recommendation filtering to help determine item
eligibility
3. Calculated Insights: Calculated insights defined on the item DG serve two key
purposes.
a. Use as Rules-Based Recommender Strategy: Any CI defined on an item data
graph can be used in personalization’s recommendation system to power a
rules-based recommendations strategy. The simplest example of this is top
sellers or most viewed strategy. A calculated insight can be easily written against
the root DMO of the item data graph to calculate items that are most viewed or
most purchased. We consider these rules-based strategies since they are
entirely based on a mathematical calculation and don’t leverage any machine
learning.
b. Use in Recommendation Filters: CIs defined on an item DG can also be used
in recommendation filters to restrict what items can show to a given individual

Personalization Building Blocks
With the Data Cloud foundation now in place, you are fully ready to execute any and all
personalization use cases. As noted above, it is very likely that you can execute personalization
use cases BEFORE you’re fully implemented on Data Cloud. Look to deploy use cases
progressively as the necessary data is available in DC. As you can see in the diagram below,
there are a number of concepts / elements that you should familiarize yourself with as you work
to deliver personalized web experiences.

Anatomy of a personalization experience

This section of the document is meant to walk through the various personalization lego blocks
available to you for executing web personalization and provide guidance on how to approach
various common use cases.

Personalization Setup Page
Before diving into the lego blocks, make sure that your system admin has executed the first two
steps on the Personalization setup page. These steps ensure that the personalization data
model objects are deployed in your org/dataspace. The pipeline intelligence and attribution
steps are related to analytics and are not required for implementation. These steps are aslo
discussed later on in the document.

Personalization Types
The best way to start to wrap your head around the elements of a personalized web experience
is to start by getting a sense of the types of personalization that you are able to execute via the
Salesforce Personalization platform. With Salesforce Personalization, there are 2 types of
personalization that you are able to execute on a website: Manual Content &
Recommendations. Quick notes on each type of personalization are as follows:

Manual Content

● The simplest type of personalization that you can execute
● For manual content personalization, a business user is effectively presented with string
entry text fields on a personalization decision where they can type in whatever values
they want (ex. CTA text, header text, image reference URLs, etc.). Whatever values they
type in, are stored on the personalization decision and are returned in the decision
response at run-time for qualified individuals. The fields available on a decision for text
entry are defined by the response template associated with the personalization point
(more on both of those terms later)
● Common manual content use cases include things like simple banners with CTA,
Infobars, Pop-ups, etc.
● Basically, any simple rules-based personalization experience where you want to return
content that isn’t stored in DC can use this approach
● NOTE: since the data returned in a manual content decision is not actually stored in DC
anywhere (just stored on the decision definition) any engagement tracking would happen
at the point / decision level.
Simple infobar manual content personalization decision
Recommendations

● Recommendations lets business users select a recommender that they’ve configured in
a personalization decision. The recommender is built against a profile and item data
graph and will return a set of recommendations based on a combination of the
recommendation strategy and understanding of an individual user.
● Unlike the more static, rules-based nature of manual content personalization,
recommendations are dynamic and can be personalized down to the 1:1 level via
machine learning.
● A key thing to consider is that in order for recommendations to return content in a
decision response, a reference to the item metadata must exist in a Data Cloud DMO.
For example, if we want to return product data that supports the rendering of the
recommendations, we would need a reference to product attributes like name, price,
image url, etc. available in a DC DMO.
Simple product recommendations personalization decision
Recommenders
Recommenders are a powerful tool in your personalization arsenal and can be built against any
item data graph configured in your DC org. Recommenders combine an understanding of a
person and their engagements (via a profile data graph) with an understanding of a piece of
business context (via an Item Data Graph) and play the role of determining “what” items should
be returned in a decision response. There are two primary types of recommender strategies:
rules-based recommenders and objective based recommenders. Each type of recommender is
covered in detail below and additional documentation is available here.

Anatomy of a recommender
Rules-Based Recommenders

Rules-based recommenders leverage data cloud calculated insights to determine what items to
show to a person. We classify CI’s as rules-based since there is no machine learning involved in
determining what items are going to be shown to an end user. Common examples of
rules-based recommenders might include:

● Top Selling Products
● Most Clicked Articles
● Most Recently Published
● Co-Browse
● Co-Buy
Basically, any business requirement that you can express as a measure on a CI that outputs a
date or integer value for sorting and is available on your item data graph can be used to power a
personalization recommendations decision. Keep in mind that when creating calculated insights
to use in a recommender, make sure that at least one of the dimensions on the CI is the PK of
the root DMO of your DG. This will ensure that you can add the CI to your DG definition once it
is created.

Objective Based Recommenders

Objective based recommenders leverage machine learning based on engagement data from the
profile data graph to optimize recommendations at the 1:1 level based on a desired objective.
By focusing configuration on an outcome, our hypothesis is that it will be easier for customers to
successfully configure effective recommenders. Traditionally, personalization platforms provide
customers with a list of algorithms to pick from like collaborative filtering, similar items, etc.
While powerful, this left it up to the business user to try and decipher what the right algorithm is
for each given use case. Flipping the equation to allow the business user to focus on the
outcome ultimately reduces the cognitive load required to execute a use case.

Salesforce Personalization offers two out of the box objective based recommenders (Maximize
Revenue & Maximize Clicks). Maximize Revenue is based off of Goods Product and Maximize
Clicks is based off of knowledge article version DMOs in Data Cloud. While these objectives are
powerful options, we also provide customers with the ability to configure custom objectives.

More details on the components of an objective based recommender are provided in the
subsequent sections.

There are three primary pieces to an objective: engagement signals, an engagement signal
metric, and a direction (maximize / minimize). To understand their relationships, we’ll go from
the bottom up.

Engagement Signals

Simply put, an engagement signal is a named event definition. Configured against a Data Cloud
engagement DMO, an engagement signal represents an occurrence of a row getting added to
that engagement DMO that optionally meets certain characteristics. For example, if I'm looking
at the sales order product engagement DMO in data cloud, I might create an engagement signal
called “Purchase” that increments every time a row is added to the engagement DMO (a new
row in this DMO means a purchase was made). If I was only interested in Nike purchases, I
might create a similar signal, but add a filter condition to only count a purchase if the brand
associated with the item bought is Nike. An example of this kind of signal is detailed in the
diagram below:

These event definitions can be used in a number of different places including:

● Automation Event Triggered Flows:
○ Trigger a flow based on an engagement signal being recorded
○ RT automation event triggered flows are triggered off of engagement signals
defined against engagement objects on a RT Profile Data Graph
● Custom Objective Recommender Definitions:
○ The primary focus of this section, engagement signals act as the foundation for
engagement signal metrics (more on that next) and can be used as additional
training data inputs for the model.
○ For example, in our maximize revenue objective, we have signals added for
product browse, add to cart, and purchase. These events represent data points
that we think are important for the model to consider when trying to execute
against the objective of maximizing the revenue associated with each purchase
● Attribution Modeling:
○ Engagement signals and metrics created against them are the foundation for
attribution modeling and help determine personalization lift and effectiveness
○ For example, I might want to understand either the count of purchases or the
conversion rate a recommendations bar is driving
Detailed documentation on engagement signal configuration is available here. When configuring
an engagement signal for use in a recommender, it is important to make sure that a value is
defined for the item ID. This ensures that the model can understand what item a person is
interacting with when an engagement is logged.

Engagement Signal Metrics

Once an engagement signal is created, a simple count metric for the signal is automatically
created. Additional metrics can be easily configured from the related objects tab of an
engagement signal. For a simple objective based recommender like Maximize Clicks, the
default count metric that is created can be added to a recommender as the primary objective.
This basically tells the recommender “I want to maximize the count of my engagement signal (in
this case article clicks)”. For our maximize revenue example, we actually create a new metric
that looks at a specific attribute on the signal to try and maximize (in this case net order
amount). Any metric you create off an engagement signal is usable as an objective in a
recommender.
In addition to standard metrics, customers can also create compound metrics which allows you
to combine two single metrics using a Divide By function to create a ratio or rate metric. Detailed
documentation on engagement signal metrics and compound metrics is available here.

Directionality

For any metric selected on a custom objective recommender you can choose to tell the model to
try and maximize or minimize its occurrence.

Key Considerations for Objective Based Recommenders

In order for a metric and signal to be selected on a recommender definition, the metric and
signal must both meet the following criteria:

● Metric and signal must be built against an engagement object that is on the profile data
graph that was selected on the first step of the recommender configuration flow
○ This ensures that engagement data related to the metric and signals is actually
available to the recommender for training and at run-time. If the engagement
DMO that the signals and metric were based on did not exist on the profile DG,
the recommender would not be able to train.
● Metric and signal must have an item identifier defined on the signal definition that maps
to the id value of the object being recommended
○ This ensures that the model can understand what item an engagement occurred
against. This contextual data is necessary to ground a models understanding of
engagement and facilitate training
○ For example, if we are recommending products but don’t have a product id for
any of the engagement data, the model will never know how to interpret that
engagement data
○ Furthermore, if you are recommending articles, engagement data against
products without any link to an article would not help the model train
Recommender Filters

With the profile and item data graph defined and a strategy selected, the last piece of the
recommender puzzle is configuring any optional filters required by your use case. Filters on a
recommender let you refine what items are eligible to return in a decision response. When
configuring recommender filters, there are three kinds of filters you can build:

1. Decision Context Filters: Decision context filters let you compare attributes from the
Item Data Graph being recommended against attribute from an anchor item that is
defined on the context object of the request.
a. NOTE: When using the anchor Id field on the context object, the model expects
that the anchor ID value passed in the decision request corresponds to an item
that matches the item type being recommended. For example, if item id 123 is
passed in on the anchorId field of the context object and our recommender is
returning products, it will interpret the anchorId value as a product Id when
evaluating a filter.
b. Example: Only return products that match the brand of the product being viewed

Static Filters: Static filters let you select a data point from the item data graph and do a
direct comparison to either a manually defined value or a dynamic context variable. A
dynamic context variable uses Salesforce Merge Language (SML) to define a value that
will be replaced by a value from the context object on the request. More detailed
documentation on Advanced recommendation filters with dynamic context variables can
be found here.
a. Example (Basic Static Filter): Only return articles where the topic equals
mortgage loans
b. Example (Dynamic Static Filter): Only return articles where the category
matches the {!category} value passed in on the decision request
Profile Data Graph: This filter type lets you compare item attributes to profile data
points.
a. Example: Exclude products that match the id of products from the purchase
engagement object on the profile DG
More detailed filter documentation is available here. When constructing filters, it is important to
consider two things:

● Overly Restrictive Filters: If you add too many filters or create filters that are overly
specific, it can limit the number of items that are able to return in a decision response. If
you experience scenarios where no items are getting returned, review your filters to see
if they are configured in an overly restrictive manner
● Recommender Usage Location: If your recommender is configured with filters that
expect context data, make sure that your recommender is used in a location where this
data is available. For example, if you have a recommender configured with a filter that is
looking for an anchor item in the request but is used on the homepage, it will not return
any results.
Recommender Training & Item Updates

Recommender training for objective based recommenders happens every 24hrs (doc link). The
24hr training cycle is based on when the recommender was initially created (eg. there is no
single nightly training job where all recommenders retrain. Each recommender has an
independent training schedule). In order for a recommender to serve back items in a decision
response, it needs to complete at least one successful training. For objective based
recommenders, there must be a total of 3 engagement rows across the engagement objects
referenced in order for the model to train. To track a recommender's training history, simply open
the recommender detail page in the personalization application and click into the “Refresh
History” tab.

Item Updates

When a recommender trains, Personalization creates an index of all the items in the item DG in
our recommendations service. This index represents our understanding of the recommendable
items and their metadata and is used for both training purposes and run-time decisioning. If
you’re recommending an item that has frequent changes or new items added on a regular basis,
it is important to understand how Personalization manages updates to the index in our
recommendations service.

● New Items:
○ In order to be considered to return in a decision response we need the
following to occur:
■ Calculated Insight Refresh (Rules-Based Recommenders):
The fastest automated refresh window for a batch CI is 1hr. This
means that in order for a new item to be included in a CI’s
output, a CI refresh will need to have occurred after the item
makes it into DC. Depending on when the item lands in DC, this
refresh could happen anywhere between 0 and 60 minutes.
● Customers could also set a Batch CI to "No Schedule"
and use DC APIs to trigger the CI or use Flow to build
custom orchestration and trigger the CI to run as soon as
a new record comes into the Offer DMO.
■ Item DG Refresh: Once a CI runs against the updated DMO, the
version of the CI that is stored on the Item DG needs to be
refreshed in order for personalization’s recommender (that is
built on top of the Item DG) to understand the changes and use it
for decisioning. The current fastest NRT DG refresh schedule is
30mins.
■ Recommender Training Refresh (Objective Based
Recommenders): Personalization recommenders currently train
on a 24hr cadence. In order for a new item to be returned by an
objective based recommender, 1 training must occur after the
item makes it into the index in order to generate the necessary
embeddings for decisioning.
○ Summary: For new items added to a DMO, they will be available to
return in a rules-based decision response as soon as they make it into
the index (dependent on CI / DG refresh cycle). In order for the new
item to return in an objective based recommender, we would need 1
recommender training cycle to occur after the item exists in the index
(up to 24hrs).
● Updates to Existing Items (Incremental Index Updates):
○ Updates to items that already exist in the index are reflected much
quicker.
○ For items that exist in the recommender index, once the change to that
items metadata makes it into the item data graph, we will update our
understanding of the item in the index through an index update job that
runs on a 15min cadence
■ For example, if a products price changes from $50 to $45, as
soon as that metadata change makes it into the item DG, we will
update our index to reflect the new pricepoint
Response Templates
With recommenders configured, we are now able to build out our response templates for use in
personalization point / decision creation. A personalization response template defines the
configuration options available to marketers when they’re building a personalization decision.
The response template also ensures that all decision responses for a given personalization
point return data in the same format (doc link). There are 2-3 primary parts of a response
template (depending on the type of response template you build). This section of the document
breaks down the various components.

Each response template is associated to one of the personalization types defined earlier in this
doc (Manual content & recommendations). Based on the selected personalization type, you will
have 1 or 2 configuration steps. Details on each personalization type are as follows are covered
below.

Manual Content Response Templates

Manual content response templates are generally quite simple and straightforward. A business
user simply defines a set of personalization attributes (string entry text fields) on the response
template and then these attributes become available for someone to configure when building a
personalization decision.

In the above example, we highlight how the personalization attributes defined on a manual
content response template appear on a personalization decision as string entry text fields when
the response template is selected on the associated personalization point. Whatever values a
business user types into those fields on the decision will be returned in a decision response for
qualified individuals.

Manual content use cases are excellent use cases to target for early implementation execution
given their simplicity. Since they do not require a recommender or content DMOs configured in
DC to execute, these use cases can provide quick wins early on in an implementation lifecycle.

Recommendations Response Templates

Recommendation response templates have one additional step. In addition to defining
personalization attributes, a customer must select a DMO that the template will be used for and
then what attributes from that DMO should be returned in a recommendations decision
response.

Let’s break down the components of the item attributes tab of a response template:

Data Model Object: This represents the DMO that the response template is created for.
If I select Knowledge Article Version as the DMO, when this response template is
selected on a personalization point, I will only be able to select recommenders on the
associated decisions that are built against an item DG that is rooted on the Knowledge
Article Version DMO.
a. NOTE: Only DMOs with an item data graph built on top of them are available for
selection. Recommenders require Item Data Graphs for creation (alongside
profile data graphs)
Available DMO Fields: These fields represent attributes on the knowledge article
version object that are mapped. A customer can choose what fields they want returned
in a decision response by selecting one of the fields and moving it over to the selected
DMO fields column. When selecting what fields are eligible to return in a decision
response, think through what fields you are ok exposing to the client. For example, you
might want to avoid selecting margin as a field to expose on your website in a decision
response.
a. NOTE: While all mapped fields appear in this column, in order for the attribute to
actually be returned in a decision response, the mapped field must also be
selected as an attribute on the item data graph
3. Selected DMO Fields: By default the primary key of the DMO is selected. This ensures
that at minimum, a recommendation response can include the id of the item being
recommended. Any additional fields that are selected will be returned in the decision
response (with the above caveat in mind).

It is important to note that once a response template is created (of either type), it is not currently
editable. Additive edits are under roadmap consideration at this time.

Applying a Response Template to a Personalization Point

With your response templates created, you can now create personalization points that reference
them. On the personalization point creation modal, there is an option to select a personalization
type and then a response template. Once you have selected the personalization type, you will
see the corresponding response templates that match the data space and personalization type
of the personalization point. Once selected on a personalization point, the response template is
automatically applied to all underlying personalization decisions / experiment cohorts.

Personalization Points, Decisions, & Experiments
With the underlying personalization lego blocks complete, it’s time to build out your
personalization points and decisions / experiments. Once these are constructed, we will explore
how they get applied to your website via web experiences that include logic around when the
personalization point should be requested, where the personalization response should be
rendered, and how the response should be displayed.

Personalization Points

A personalization point effectively maps to a part of an experience that is eligible for a decision
and is the value included in a personalization decision request (alongside an individual ID) when
a request is made to personalization for a decision. Examples of these could be homepage hero
banner, home page recommendations bar, Product Display page recommendations bar, popup,
etc. Key elements of a personalization point are as follows:

Data Space: Everything in Data cloud is data space scoped. The data space you select
will impact what profile data graphs and response templates are available for selection.
Data Graph: The profile data graph you select impacts the following elements:
a. Recommenders Available on Decisions: only recommenders that are
configured using the profile DG defined on the personalization point (and that
also return the DMO of the selected response template) are selectable on
decisions
b. Targeting Rules: Any data point from the selected profile data graph is available
for use in decision targeting logic to determine who qualifies for a specific
decision.
Personalization Type: As noted in the section above, a personalization point can be
either Manual Content or Recommendations
4. Response Template: Defines the configuration options available to marketers when
they’re building a personalization decision and ensures that all decision responses for a
given personalization point return data in the same format
Source: non-editable field that indicates where a personalization point was created from.
For personalization points created via the email builder in Marketing Cloud Growth or
Advanced for example, you would see a source of “CMS Content”
Authentication: Optional field that allows you to mark a personalization point as
authentication required. This would subsequently require any personalization requests
against this point to go through personalization’s authenticated decisioning API with
proper credentials (doc link)
Once a personalization point is created, a business user must configure either an experiment or
a decision on the point in order for a personalization point to return a response when a request
is made. The next couple sections cover Decisions and Experiments respectively. Keep in mind
that a personalization point is reusable across channels, as any channel that can be configured
to call the personalization decisioning API can make a request. Channel specific experience
wrappers and templates (that will be discussed in a later section control when requests are
made, where decision responses should be rendered, and how the content should display.

Personalization Decisions

One personalization point can have up to 25 decisions configured against it. A breakdown of the
components of a decision is detailed in the diagram below and subsequent bullets.

● Priority: Each decision has a priority value automatically associated with it. As new
decisions are added to a personalization point, they are automatically the lowest priority
decision. Priority can be adjust from the related object list view and is used in the
scenario where an individual qualifies for multiple decisions based on the rules applied.
In these scenarios, the highest priority decision that the individual qualifies for is used to
formulate a decision response. Personalization does NOT return a decision response for
multiple decisions on a personalization point.
● Targeting Rules: Targeting rules are optional and determine who is eligible to receive a
specific decision. Targeting rules can be written against either any data point that is
defined on the profile DG (direct attributes, related attributes, calculated insights,
segment memberships) or against a set of contextual rules. 50 conditions can be added
to a single decision. If no rules are defined, any individual is eligible to receive the
decision.
● Personalization Attributes: string entry text fields that are defined on the response
template
● Recommender: For decisions on personalization points of type recommendations, a
customer can select a recommender to use to determine what items are returned in a
decision response. Keep in mind that recommenders available for selection must be
configured with the same profile DG that is defined on the personalization point and
return the object that the response template is configured against
Experiments

An experiment can also be configured on a personalization point and is a great way to test out
different decisioning strategies / approaches (detailed documentation). A breakdown of the
components of an experiment is detailed in the diagram below and subsequent bullets.

● Primary & Secondary Metrics: The metrics define how the experiment is measured.
Any metrics that you’ve defined on engagement signals where the underlying
engagement DMO is defined on the selected profile DG of the personalization point are
available for selection. The primary metric is used to determine the winning cohort while
secondary metrics are displayed in the experiment analytics screen.
● Targeting Rules: If you want to target an experiment to a specific subset of individuals,
you can choose to apply targeting logic on the experiment. The targeting rules available
are the same ones that you can configure on decisions.
● Cohorts: Cohorts represent the possible decision configurations that someone could
receive. Each cohort has a defined traffic allocation for random assignment and then the
cohort config options are defined by the response template selected on the
personalization point. The cohort configuration mimics decision configuration.
○ Note: For the optional control cohort, you can choose to have the control cohort
fall through to be evaluated against any other decisions that are configured on
the personalization point
One key thing to consider when creating an experiment is remembering that an experiment is
treated by default as the highest priority item on a personalization point. When a request is
made against a personalization point, we will attempt to evaluate the individual against the
experiment first before proceeding onto the highest priority decision. If you apply an experiment
with no targeting rules to a personalization point with multiple decisions configured, it is

expected that analytics against those underlying decisions will show a dip as traffic is routed
through the experiment instead.

Some additional considerations are as follows:

● Only one experiment can be applied to a personalization point at a time
● To create a new experiment on a personalization point, simply do one of the following:
○ Delete Existing Experiment: Deletes the experiment and its underlying objects
completely
○ Archive Experiment: Archiving the experiment removes it from the experiment
section in the personalization point Related tab but retains all records and data
for the experiment. You can access any data for this experiment, or delete it, from
the Experiment tab, but you can no longer use it on a personalization point.
● Experiments will stop processing data after 90 days
Run-Time Decision Flow

As noted in the personalization point section above, once a personalization point is created and
has at least an experiment or decision applied, it is eligible to return a decision response when
requested via personalization’s decisioning endpoint. The next part of this doc will walk through
how a personalization point is applied to/used on a website, but before diving into the business
user application process, let’s take a quick look at the run-time evaluation process for any
personalization request sent to our decisioning pipeline. To help illustrate the steps, we can look
at the diagram below which features a personalization request that travels through the three
primary stages of the pipeline before returning a personalization response.

Personalization Request: A personalization request sent to the pipeline has two key
components: an individual id, and one or multiple personalization point IDs. Each
personalization point will be evaluated against the individual and 1 decision response will
be returned for each (a blank decision response is valid if a person does not qualify for
any experiments or decisions configured on the personalization point). Outside of the
personalization point and individual ID, context data can be included for use in
recommendations filtering (eg. anchor item ID). The web SDK automatically sends
context data that is required for any contextual rules that might have been configured on
the decisions / experiments. Documentation around personalization request structure is
available here.
2. Augmenting Phase: The augmenting phase is where personalization takes the
individual ID form the request and makes a request to the DC profile API to get back a
corresponding Profile DG. The profile DG returned would be the one that corresponds to
the profile DG configured on the personalization point. If no profile exists, the individual
is treated as a first time anonymous visitor.
a. NOTE: Personalization assumes that all personalization points included in a
single request leverage the same profile DG. If one of the personalization points
uses a different DG than a point listed earlier in the request, it will be skipped.
Qualifying Phase: Based on the profile data retrieved from DC, personalization looks at
each personalization point included in the request and determines what decision or
experiment cohort the individual qualifies for. Keep in mind that experiments are treated
as the highest priority object on a personalization point and personalization will only
evaluate and return a decision for one cohort/decision per personalization point.
4. Personalizing Phase: Once the cohort or decision is selected, the actual decision gets
generated. For manual content personalization points, this is simply taking the text
values entered on the cohort or decision and returning them back to the requesting
application. For recommendations personalization points, the profile DG is passed to the
recommendations service alongside the id of the recommender that’s selected on the
decision/cohort. The recommendations service then generates personalized, 1:1
recommendations based on the RT understanding of the profile.
5. Decision Response/Logging: In both scenarios, personalization returns a decision
response to the requesting application and also logs the decision back in Data Cloud in
the personalization log. This decision logging is critical for unlocking analytics and
attribution (covered later on).
For each decision that personalization makes, 1 decision credit is consumed. If a request has 1
personalization point, that is 1 decision credit. If a request has 2 personalization points, that is 2
decision credits.

Delivering a Personalized Experience on Your Website
With all personalization building blocks completed, it’s time to apply your personalization points
to your website. If we refer back to the diagram shown at the beginning of the personalization
section, we will now focus on the blue box. A personalization experience (in this case a web
experience) takes a personalization point and wraps it in channel specific logic to determine

when a personalization request should be made, where the personalization response should be
rendered, and how the personalization response should look when rendered (template).

Before jumping into the business user experience of the Web Personalization Manager (WPM),
there are two components that are best to setup in advance in your sitemap: templates and
engagement configs. We’ll cover each in more detail in the following sections.

Web Templates

Also referred to as “transformers”, these configurations enable you to convert personalization
data that you receive in a JSON format from the Decisioning API into dynamic HTML.
Personalization currently supports Handlebars-based transformers that use the Handlebars
templating language to convert personalized JSON data, such as product or content
recommendations, so that you can later inject that data into the HTML structure of your website
(documentation link).

Templates are configured by developers, stored in the sitemap, and then accessible by business
users when they are adding personalization points to their website via the WPM. Example
templates for common use cases can be found in the documentation here.

While templates are helpful for handling common use cases, they are not required in order to
execute personalization on your website. In addition to allowing a person to select a template to
handle personalization decision responses, customers can also leverage the WPM to perform
simple string substitution directly on the website. This kind of flexibility is excellent for facilitating

quick website changes or experiments without requiring developer involvement (etc. easily
changing a CTA button, testing a new banner header).

Engagement Configurations

Engagement configurations allow business users to determine where personalization decision
engagement should be sent in Data Cloud. For example, a customer might want to track
product recommendations against the product browse engagement object while article
recommendations engagement should be sent against the article browse engagement object.
Engagement configurations configured in the sitemap show up for selection in the second tab of
the WPM.

Web Personalization Manager
Salesforce Personalization’s Web Personalization Manager (WPM) allows business users to
easily apply personalization points to their websites as web personalization experiences (doc
link).

The web personalization manager is a WYSIWYG tool that acts as an overlay on your website.
By simply adding the URL parameter ?sf_personalization_wpm to your website you will prompt
the authentication process to log in to the Salesforce org that contains your personalization
configurations. Once authenticated you are good to go to add personalization experiences to
your website.

Adding a Personalization Experience

Once the WPM is open and you have selected “New Experience” from the navigation in the top
left, you will be presented with a modal displaying all of the personalization points configured in
the dataspace that is defined in the sitemap. If you don’t see any personalization points listed,
make sure that your sitemap has the proper data space information included. You cannot
currently mix personalization points from multiple dataspaces on a single website.

Once a personalization point is selected, the next step is to define how you want to manage
rendering the decision response. For this decision you have two options:

● Manually Personalization Page Elements: This approach allows a business user to
personalize the site without a developer having precreated a template via string
substitution for existing variables on the page. While this approach provides increased
flexibility for simple use cases like text replacement and simple banner changes, we
recommend leveraging templates for more advanced use cases like recommendations
and pop-up overlays.
● Use a Template Defined in the Sitemap: The templates listed in this section are
defined in the sitemap ahead of time by your sitemap developer (doc link). They contain
pre-determined logic for handling the rendering of different personalization decision
responses.
○ NOTE: When creating templates for business users to select, it’s important that
the template developer coordinate with the business user that is constructing the
response templates to ensure that the templates created align to the shape of the
data returned in a decision response. For example if a product recommendations
response template returns a price value for the products, the template needs to
have a substitution definition and handlebars code included to render this value.
With a template selected to handle the rendering of the personalization decision response, there
are two steps remaining to round out a complete web experience. The remaining configuration
centers around answering the following questions:

● When should a personalization request for the selected personalization point fire?
● Where should the selected template actually render the decision response?
To answer each of these questions, let’s take a look at the screenshot below.

Page Option: Selecting a page option determines when the personalization request
should fire from the personalization module of the DC SDK. Options available to select
include:
a. Page Types: These are defined in the sitemap and can be values like
“Homepage”, “PDP Page”, “Category Page”, “Global”, etc. Selecting a page type
like “PDP Page” would ensure that a personalization request for say similar
articles or products fires on every PDP page. You would not need to manually
configure a personalization point on every page.
b. URL: If you want to target a specific URL pattern that does not map to a page
type defined in the sitemap, you can choose to manually define a URL for
targeting purposes. This can be helpful for targeting personalization experiences
to non-standard web pages
2. Display Method: This selection determines WHERE on the page the selected template
should render the personalization decision response. In this drop-down you also have a
couple of options to choose from
a. Content Zone: If your developer defined content zones in your sitemap, you can
choose to replace one of these predefined areas by selecting a specific content
zone. Content Zones are often mapped in the sitemap since they reference
stable divs on the page that are highly likely to be the target of a personalization
experience.
i. Tip: Defining these personalization hotspots at the outset of your
implementation can help ensure that personalization experiences target
consistent and stable parts of the website
b. Element Selection: If content zones are not defined in the sitemap, you can
leverage the WPM’s selector detector capability to manually choose a div on the
page to act as the anchor and then determine if you want to replace the div or
insert the personalization response before or after the div. By not requiring a
content zone, we are decreasing the reliance on a developer in order to
personalize parts of the site that might not have initially been defined as content
zones.
c. Overlay: For pop-ups, you can also choose for a personalization decision
response to render based on factors like scroll percentage, exit intent, element
click, etc.
i. Tip: pop-ups are a great use case for capturing information like email
address or SMS opt-in to convert anonymous individuals to known and
grow your list size for outbound communications
Defining Engagement Data Tracking

With location and timing of the personalization experience defined, the last step before
previewing the experience is to determine where engagement data should be tracked. While
every personalization decision is logged back in DC in the personalization log, it’s important to
make sure that engagement data with a personalization experience (eg. view and click) is
captured in the appropriate DMO to facilitate attribution tracking and analysis. On the 2nd tab of
the WPM, the business user can define where engagement data should be automatically
passed when someone interacts with a personalization experience.

The engagement destinations available for selection are defined in the sitemap. Custom
engagement destinations can be defined by your sitemap developer. For item
recommendations, we recommend having an engagement destination specific to that item type.
For example, if you are recommending articles and products on your site, define a unique
engagement destination for each.

The stats sent back to the engagement destinations include two key pieces of information:

● Personalization ID: The personalization ID is an individually unique identifier that is
generated for every personalization decision. This value is recorded in the
personalization log and this value needs to be recorded on personalization experience
engagement in order to connect a “view” or a “click” with a specific decision.
● Personalization Content ID: For decisions that include recommended items, the
personalization content ID corresponds to a value in the personalization log that tells
personalization which specific item was interacted with.
Additional fields that can be captured and sent in the engagement event include the
personalization point and decision ID. Having these values available in the engagement DMO
that is available on the profile DG can allow for a degree of frequency capping for a specific
point or decision. For example, a customer could write a rule around only showing a decision or
point to a person if the count of view engagements with that point or decision is less than x over
y time frame.

Previewing the Web Personalization Experience

Before flipping the experience live and pressing save, a business user can easily preview the
personalization experience to validate it renders correctly and that decision targeting logic is
behaving as expected (doc link). To break down the preview process, let’s use the image below.

Individual Id: By default, the individual Id associated with the individual actually in the
WPM tool is applied. This value can be overridden by entering a different individual ID if
you are looking to preview a decision against a specific individual. Previewing a decision
against a specific individual by selecting “current user decision” in number 2 in the above
diagram will evaluate decisions and their rules against the profile DG associated with the
individual ID entered in box 1.
2. Current User Decision: Select this option to preview personalized results generated
using targeting rules for the current user.
3. Decision Selector: Choose any existing decision from the menu to preview the
personalized content and ignore any targeting rules. This approach is great if you want
to simply validate that the experience looks correct when rendering.

Preview Button: after making the above selection, press this button to preview the
experience
Experience State: By default experiences are disabled. Disabled experiences will not
be evaluated if they are saved to the sitemap. Only live experiences trigger
personalization decision evaluation.
Save: When you save a web personalization experience, a Personalization experience
configuration is added to your sitemap automatically. The personalization module of the
web SDK knows how to manage personalization requests associated with this
configuration and no additional sitemap modifications are required.
Additional Considerations

If you ever want to see what personalization experiences exist on a page, simply open up the
WPM on that page and then click Personalization Experiences drop-down in the top left and you
will see a list of experiences live on the page below the “+ New” button.

Measuring Personalization Usage & Performance
With personalization experiences now live on your website, it’s time to understand lift and
impact (attribution / experiment analytics) and monitor overall personalization usage
(intelligence dashboard). This section of the document covers each topic in detail.

Attribution Model Creation

While Personalization provides two product specific attribution models out-of-the-box that
expect a pre-defined set of object mappings, customers can also configure custom attribution
models to determine the effectiveness of personalization points across their channels using
either a first touch or last touch approach (doc link).

While a step by step creation guide is linked at the doc above, some important things to
consider when creating an attribution model are as follows:

● Identity Resolution: While optional, selecting an IR ruleset is beneficial if you are
looking to understand attribution totals based on a unified view of a customer. Since
multiple individual IDs can relate to a single unified individual, selecting an IR strategy
(particularly the one that aligns with the root DMO of your profile DG) will help give you
the best understanding of personalization lift / impact.
● Attribution Stage Definition:
○ Attribution stages define the funnel that will appear in your attribution report.
○ The first stage in the model should represent the first activity that you expect an
individual to take as they move towards some key conversion event.
○ For each attribution stage, you can define an engagement signal that is used to
determine if that stage is “met”. For example, if my second stage is an add to
cart, I would select my add to cart engagement signal to define the stage. It is
likely that the engagement signals you need are already created based on work
you might’ve done for custom objective recommenders or automation event
triggered flows. If new engagement signals / metrics are required, you can simply
build them from the engagement signals tab (doc link)
○ A count of the individuals that move through each stage along with stage
conversion metrics are automatically calculated on the attribution dashboard.
Additional engagement signal metrics for each stage can be selected and would
be included as columns in the tables produced on the attribution report.
○ At least two stages must be configured for an attribution model
● Content Match Logic: As you add stages to your attribution model, you will notice an
option to enable content match logic. When enabled, this logic only qualifies an
individual to the next stage of the funnel if the item interacted with in the subsequent
stage matches the item interacted with in the previous stage.
○ Example: Imagine product view and add to cart are the first two stages in my
funnel. With this setting enabled, if I view product 123, in order for me to progress
to the next stage, I would need to add product 123 to my cart. If i added product
456 to my cart, I would not progress in the funnel
Reviewing Attribution Analytics

Once an attribution model is created and enabled, you will be able to access it from attributions
object list view. Once you’ve selected an attribution model, you can click into the “Analytics” tab
of the model to view personalization point performance based on the attribution model
configuration. Detailed documentation on the pieces of the attribution dashboard are available
here. When reviewing attribution analytics, keep in mind that the attribution data is refreshed on
a 24hr cadence from when the model was published. If your model was published at 1pm ET, it
would refresh at 1pm each day.

Experiment Analytics

While attribution models are great for understanding personalization point / decision lift and
impact, Personalization also provides customers with detailed experiment analytics for any
experiments that they might’ve configured on a personalization point. To access experiment
analytics, simply navigate to the experiments tab in the personalization application, find the
experiment that you want to view, click into the details page, and open the Analytics tab.
Detailed documentation on experimentation analytics is available here. When viewing

experiment analytics, keep in mind that experiments require up to 24 hours from the time they
start to process data and display analytics.

Pipeline Intelligence Dashboard

While attribution and experiment analytics look at specific lift metrics and give you a sense of
personalization performance, the pipeline intelligence dashboard gives you an overview of
general personalization usage (doc link). The dashboard runs on two out-of-the-box calculated
insights (CIs) that can be deployed from the personalization setup page. Once deployed, these
CIs need to be scheduled in order to start collecting data. The dashboard is great tool to
understand key metrics like:

● Total Personalization Requests
● Total Unique Personalization Points Evaluated
● Avg. Number of Unique Individuals / Day used in personalization decisioning
● Breakdown of the count of times different decisions are returned for a given
personalization point