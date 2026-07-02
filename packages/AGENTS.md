# Packages Instructions

These rules apply to every package under `packages/`.

## Boundaries

- Keep package dependencies directional and explicit.
- Do not import from app, example, fixture, or docs code.
- Public APIs must be exported from each package `src/index.ts`.
- Keep package versions aligned unless there is an explicit release reason to diverge.

## Package Roles

```txt
protocol-v09
  Types and helpers only.

message-parser
  JSON, JSONL, and chunk parsing only.

runtime-core
  Framework-free state machine and JSON Pointer data updates.

scheduler
  Queueing, priority, batching, and coalescing.

vue-renderer
  Vue renderer, render context, and component registry.

element-plus
  Element Plus adapter and public facade.
```

## Verification

Run package-local tests for small changes. Run root `pnpm test` and `pnpm build` when changing public APIs or cross-package contracts.
