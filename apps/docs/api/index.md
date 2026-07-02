# API Reference

This page is a placeholder for generated and hand-written API notes.

## `useA2UI()`

Creates an A2UI runtime for Vue.

```ts
const { runtime, pushMessage, pushJson, pushChunk } = useA2UI({
  components: {
    UserPicker
  }
});
```

## `pushMessage(message)`

Accepts one complete A2UI v0.9 JSON message string from an application-owned realtime channel.

## `pushJson(message)`

Accepts an already parsed A2UI message object.

## `pushChunk(chunk)`

Accepts JSONL or streaming text chunks and buffers incomplete lines internally.

## `A2Surface`

Renders one surface from the runtime.

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```

## `components`

Registers application components for custom A2UI `component` names.
