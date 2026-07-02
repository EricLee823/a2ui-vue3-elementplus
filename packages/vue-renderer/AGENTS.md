# Vue Renderer Instructions

`vue-renderer` provides Vue rendering primitives without depending on Element Plus.

Allowed:

- Vue APIs,
- runtime-core,
- message-parser,
- component registry,
- render context.

Not allowed:

- importing Element Plus,
- hardcoding Basic Catalog visual behavior that belongs in UI adapters,
- owning SSE/WebSocket transport.

The registry API is public. Be careful with changes to:

- `components`
- `propsMapper`
- `eventsMapper`
- `dependencies`
- `A2ComponentContext`
