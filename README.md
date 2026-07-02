# A2UI Vue3 Element Plus Renderer

Monorepo for rendering A2UI v0.9/v0.9.1 realtime message text in Vue 3 applications using Element Plus.

The package boundary is intentionally narrow: applications own SSE, WebSocket, auth, reconnects, and business requests. This renderer receives A2UI message text and updates the UI.

```ts
import { useA2UI } from '@a2ui/element-plus';

const { runtime, pushMessage } = useA2UI();

eventSource.addEventListener('a2ui', (event) => {
  pushMessage(event.data);
});
```

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```

## Workspaces

- `packages/protocol-v09`: A2UI v0.9 protocol types.
- `packages/message-parser`: JSON and JSONL message parsing.
- `packages/runtime-core`: Transport-independent surface runtime.
- `packages/scheduler`: Message batching and coalescing.
- `packages/vue-renderer`: Vue renderer and component registry.
- `packages/element-plus`: Element Plus catalog adapter and public facade.
- `fixtures`: JSONL data used by tests, examples, docs, and playground.
- `examples`: Low-cost user integration examples.
- `apps/docs`: Online API docs.
- `apps/playground-vue-element-plus`: Author playground.

## Project Thinking

- [Architecture](./ARCHITECTURE.md): package boundaries, realtime message flow, rendering model, and extension points.
- [Project Rules](./PROJECT_RULES.md): non-negotiable engineering rules and their evolution process.
- [Agent Guide](./AGENTS.md): entrypoint for coding agents working in this repository.
- [Codex Command Rules](./.codex/rules/project.rules): project-local command execution policy examples.
