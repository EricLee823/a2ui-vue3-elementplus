# Architecture

This repository implements a Vue 3 and Element Plus renderer for A2UI v0.9/v0.9.1 realtime message text.

The central product decision is deliberately narrow:

```txt
Application owns realtime transport, auth, retries, and business APIs.
A2UI packages own message parsing, runtime state, incremental rendering, and UI adaptation.
```

The user should be able to connect an existing SSE, WebSocket, or streaming client with one line:

```ts
pushMessage(event.data);
```

Everything else in this monorepo exists to make that line reliable, extensible, and fast.

## Design Principles

1. Transport stays outside the main package.

   Users usually already have SSE or WebSocket integration in their application system. The default package must not force a second connection layer, auth model, reconnect strategy, or action endpoint.

2. Runtime is framework-independent.

   A2UI messages update surfaces, components, and data models before any Vue code sees them. This keeps the protocol engine reusable and testable.

3. Rendering is adapter-driven.

   A2UI component names map to Vue components through a registry. Element Plus is the default adapter, not the protocol itself.

4. Custom components are first-class.

   Product teams must be able to inject domain components such as `UserPicker`, `MetricCard`, `ApprovalFlow`, or `DepartmentTree` without forking the renderer.

5. Realtime rendering must be incremental.

   A stream of `updateDataModel` messages should update affected bindings and surfaces without rebuilding the entire UI tree.

6. Documentation and fixtures are part of the product.

   Every important behavior should be demonstrable through `fixtures/jsonl`, examples, docs, or tests.

## Package Map

```txt
packages/protocol-v09
  A2UI v0.9/v0.9.1 message and component types.

packages/message-parser
  Single-message JSON parsing and JSONL/chunk parsing.

packages/runtime-core
  Transport-agnostic surface store, data model updates, JSON Pointer helpers, and action payload generation.

packages/scheduler
  Message queue, batching, priority ordering, pause/resume, and data-model update coalescing.

packages/vue-renderer
  Vue components, render context, component registry, and useA2UI().

packages/element-plus
  Public facade package and Basic Catalog to Element Plus component mapping.

fixtures/jsonl
  Reusable A2UI message streams for tests, docs, examples, and playground.

examples
  Low-cost user integration examples.

apps/playground-vue-element-plus
  Author-facing debugging surface for JSONL playback and runtime inspection.

apps/docs
  Online API and guide documentation.
```

## Runtime Flow

```txt
User-owned SSE/WebSocket/fetch stream
  -> pushMessage(text) / pushJson(object) / pushChunk(text)
  -> message-parser
  -> runtime-core.applyMessage()
  -> SurfaceStore
  -> Vue render context
  -> component registry
  -> Element Plus or custom Vue component
```

The main package must keep this flow cheap:

```ts
import { A2Surface, useA2UI } from '@a2ui/element-plus';

const { runtime, pushMessage } = useA2UI();

eventSource.addEventListener('a2ui', (event) => {
  pushMessage(event.data);
});
```

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```

## Surface Model

A surface is an independent UI region selected by `surfaceId`.

```json
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"}}
```

The renderer only renders the requested surface:

```vue
<A2Surface :runtime="runtime" surface-id="main" />
<A2Surface :runtime="runtime" surface-id="dialog" />
```

The default `surfaceId` is `main`, and the default root component id is `root`.

## Message Model

The primary supported messages are:

```txt
createSurface
updateComponents
updateDataModel
deleteSurface
```

Components are stored by id, then referenced by `child` or `children`.

```json
{
  "id": "root",
  "component": "Column",
  "children": ["title", "submit"]
}
```

Data binding uses JSON Pointer:

```json
{
  "id": "name",
  "component": "TextField",
  "label": "Name",
  "value": { "path": "/profile/name" }
}
```

## Custom Component Extension

Custom components are registered through the Vue renderer registry and exposed by the Element Plus facade.

```ts
const { runtime, pushMessage } = useA2UI({
  components: {
    UserPicker: {
      component: UserPicker,
      dependencies: (node) => [node.value?.path, node.options?.path],
      propsMapper: (node, ctx) => ({
        modelValue: ctx.resolveValue(node.value),
        options: ctx.resolveValue(node.options)
      }),
      eventsMapper: (node, ctx) => ({
        'onUpdate:modelValue': (value) => ctx.setValue(node.value?.path, value)
      })
    }
  }
});
```

Simple components can be registered directly, but components with data binding should provide mapper functions.

## Performance Strategy

The current MVP focuses on correct package boundaries and low-cost integration. The long-term performance model is:

```txt
Flat surface component map
  + JSON Pointer data updates
  + data path dependency declarations
  + scheduler coalescing
  + Vue component-level subscriptions
```

Performance rules:

- Do not make the whole surface a deeply reactive tree.
- Do not rebuild all components for every message.
- Coalesce repeated `updateDataModel` messages with the same `surfaceId + path`.
- Let custom components declare `dependencies` when they bind to data paths.
- Keep Element Plus wrappers thin and adapter-specific.

## Design Patterns

- Facade: `@a2ui/element-plus` is the low-cost public entry.
- Adapter: Basic Catalog components map to Element Plus or user components.
- Registry: A2UI component names resolve through a component registry.
- Observer: runtime subscriptions notify renderers of state changes.
- Strategy: scheduler strategies can evolve from balanced to realtime or throughput.
- Command: A2UI messages become runtime commands.
- Factory: `createA2Runtime`, `createScheduler`, and `createComponentRegistry`.

## Evolution Path

The monorepo is designed to grow without breaking the main user path.

Near term:

- strengthen A2UI v0.9 schema validation,
- add targeted renderer tests,
- improve data-path subscriptions,
- add CI and docs deployment.

Later:

- split optional transports,
- add more UI adapters,
- add generated API reference,
- add versioned documentation,
- add benchmark fixtures.
