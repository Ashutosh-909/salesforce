# Integrate Salesforce Personalization with Modern Frontend Frameworks

> Source: https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/integrate-personalization-modern-frontend-frameworks.html

Seamlessly integrate Salesforce Personalization into modern frontend frameworks such as React, Vue, Angular, and others using a component-based approach. With this approach, you can create custom components that register themselves as content zones, ensuring robust, reliable delivery and rendering of personalized content.

Traditional DOM manipulation by the SDK can conflict with the virtual DOM or rendering strategies of modern frameworks, causing personalized content to disappear. By creating a custom component that registers itself as a content zone handler, you make sure that personalized content is delivered and rendered using your framework's own methods.

## Key Concepts

- **Web Personalization Manager (WPM):** The UI for previewing and managing personalized content zones.
- **Content Zone Handler:** A registration for a specific area or component in your app that can be personalized. Use the Personalization module's `Config.ContentZoneHandler.set` function to register your handler, providing a unique name and configuration object.

## Register a Content Zone Handler

To enable personalization, register each content zone handler using the `set` function:

```javascript
SalesforceInteractions.Personalization.Config.ContentZoneHandler.set(
  ContentZoneHandlerName: String, // For example, "home_banner"
  ContentZoneHandlerProperties: Object
)
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ContentZoneHandlerName` | String | Yes | Unique, machine-friendly name for the content zone handler (e.g., `home_banner`). |
| `ContentZoneHandlerProperties` | Object | Yes | Configuration object defining how the content zone behaves and is rendered. |

### ContentZoneHandlerProperties Interface

```typescript
interface ContentZoneHandlerProperties {
  onReady: (content: string, metadata: ContentZoneHandlerMetadata) => void;
  onRevert?: (metadata: ContentZoneHandlerMetadata) => void;
  onHighlight?: (highlight: boolean, metadata?: ContentZoneHandlerMetadata) => void;
  path?: string;
  label?: string;
}
```

| Property | Required | Description |
|---|---|---|
| `onReady` | Yes | Called when personalized content is ready for rendering. Receives personalized content from Personalization as an input parameter. |
| `onRevert` | No, but recommended | Used only at design time. Called when a preview is cancelled in WPM. Must revert to rendering the original, non-personalized content. |
| `label` | No | User-friendly name that appears within WPM. Defaults to the handler name. |
| `path` | No | Used only at design time. CSS selector that WPM uses to visually highlight the content zone handler. |
| `onHighlight` | No | Used only at design time. Custom logic for WPM to visually highlight the content zone handler. Use only if you can't use the `path` property (e.g., Shadow DOM). |

> **Important:** Don't define both `path` and `onHighlight` at the same time.

## Example: Personalization Content Handler React Component

```jsx
import React, { useEffect, useState } from "react";

export const PersonalizationContentHandler = ({ children, contentZoneName, contentZoneLabel }) => {
  const [personalizedContent, setPersonalizedContent] = useState(undefined);
  const [elementId, setElementId] = useState(undefined);

  useEffect(() => {
    setElementId(`__sf_personalization_contentzonehandler_${contentZoneName}`);

    window.SalesforceInteractions.Personalization.Config.ContentZoneHandler.set(
      contentZoneName,
      {
        label: contentZoneLabel,
        path: `#${elementId}`,
        onReady: handleReady,
        onRevert: () => {
          setPersonalizedContent(undefined);
        },
      },
    );
    return () => {
      window.SalesforceInteractions.Personalization.Config.ContentZoneHandler.set(contentZoneName, {
        onReady: () => {},
      });
    };
  });

  const handleReady = (content) => {
    setPersonalizedContent(content);
  };

  if (personalizedContent) {
    return <div id={elementId} dangerouslySetInnerHTML={{ __html: personalizedContent }} />;
  } else {
    return <div id={elementId}>{children}</div>;
  }
};
```

### Usage

```jsx
<PersonalizationContentHandler contentZoneName="ProductRecs" contentZoneLabel="Product Recs">
  <h1>Non-personalized content</h1>
  <p>This content will be replaced with Personalized Content</p>
</PersonalizationContentHandler>
```

## Best Practices

- Each content zone handler must have a unique, machine-friendly name.
- Implement `onRevert` for proper WPM preview/cancel support.
- Use `path` for simple highlight scenarios; use `onHighlight` for advanced or Shadow DOM cases.
- The `onReady` callback must render the personalized content. If not set, show the original children.
- Unregister or reset handlers on component unmount if needed.
- The `label` property makes the handler user-friendly in WPM.

## Troubleshooting

- If personalized content disappears, ensure you are not manipulating the DOM outside React.
- If preview cancel in WPM does not work, implement `onRevert`.
- If WPM cannot highlight your zone, check your `path` or implement `onHighlight`.
