# Element Plus Adapter Instructions

`element-plus` is the low-cost public facade and Element Plus adapter.

It may depend on:

- `@a2ui/vue-renderer`
- Vue
- Element Plus

It must not own:

- SSE/WebSocket connection setup,
- authentication,
- reconnect strategy,
- backend action endpoints.

Keep wrappers thin. Convert A2UI component props into Element Plus props, emit runtime actions, and preserve custom component override behavior.
