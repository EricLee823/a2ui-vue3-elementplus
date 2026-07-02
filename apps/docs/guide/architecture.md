# Architecture

The renderer is designed around one low-cost integration path:

```ts
pushMessage(event.data);
```

The application owns realtime transport, auth, reconnects, and business APIs. The A2UI packages own parsing, runtime state, incremental rendering, component mapping, and action events.

## Package Layers

```txt
protocol-v09
  A2UI v0.9/v0.9.1 types.

message-parser
  JSON and JSONL message parsing.

runtime-core
  Surface store, data model updates, JSON Pointer, and action payloads.

scheduler
  Message queue, priority, and update coalescing.

vue-renderer
  A2Surface, render context, component registry, and useA2UI.

element-plus
  Public facade and Element Plus adapter.
```

## Runtime Flow

```txt
Application realtime client
  -> pushMessage / pushJson / pushChunk
  -> parse message
  -> apply runtime command
  -> update surface store
  -> render selected surface
  -> resolve Element Plus or custom component
```

## Extension Points

Custom components are registered through `useA2UI`.

```ts
useA2UI({
  components: {
    UserPicker: {
      component: UserPicker,
      propsMapper: (node, ctx) => ({
        modelValue: ctx.resolveValue(node.value),
        options: ctx.resolveValue(node.options)
      })
    }
  }
});
```

For the full architecture notes, see the repository root `ARCHITECTURE.md`.
