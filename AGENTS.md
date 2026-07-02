# AGENTS.md

This is the repository-level Codex instruction file. Codex discovers `AGENTS.md` files from the repository root down to the current working directory. More specific nested `AGENTS.md` files override or extend this file for their subtree.

Do not use `.agent/` or `.agents/` for Codex instructions. Those directories are not part of Codex instruction discovery unless a user has explicitly configured fallback filenames. Command execution policy rules belong under `.codex/rules/*.rules` when the project `.codex` layer is trusted.

## Mission

This repository renders A2UI v0.9/v0.9.1 realtime message text in Vue 3 applications using Element Plus.

Keep the user-facing integration small:

```ts
pushMessage(event.data);
```

The application owns realtime transport, auth, reconnects, and business APIs. These packages own message parsing, runtime state, incremental rendering, component mapping, and action events.

## Communication

Use Chinese as the first-priority language when communicating with the user. Keep code, package names, public API names, and protocol keywords in their original form.

## Read First

Before broad changes, read:

1. `ARCHITECTURE.md`
2. `PROJECT_RULES.md`
3. the closest nested `AGENTS.md` for the files you edit

## Core Rules

- Preserve package boundaries.
- Runtime packages must not depend on Vue, Element Plus, or DOM UI APIs.
- `packages/vue-renderer` must not import Element Plus.
- `packages/element-plus` is the public facade and Element Plus adapter.
- Do not add required SSE/WebSocket URL configuration to the main facade.
- Treat custom component injection as public API.
- Canonical fixtures must use A2UI v0.9 shape: `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`.
- Data binding examples must use JSON Pointer paths such as `/profile/name`.
- Public API changes must update docs and at least one example or fixture when relevant.
- Do not commit generated or local state: `node_modules`, `dist`, `.turbo`, `.vite`, `.codegraph`, VitePress cache/dist.

## Verification

For cross-package code changes, run:

```bash
pnpm test
pnpm build
```

For docs-only changes, run:

```bash
pnpm docs:build
```

If a check cannot run, report the reason.

## Rule Evolution

Rules are allowed to evolve, but changes must be explicit and reviewable.

When changing a durable rule:

1. update the relevant `AGENTS.md`,
2. update `PROJECT_RULES.md` if humans need the same rule,
3. add or update docs/examples/tests if behavior changed,
4. explain the reason in the commit or PR summary.

Use this lifecycle vocabulary in docs or PRs when helpful:

```txt
proposed -> trial -> adopted -> revised -> deprecated
```

## CodeGraph

If `.codegraph/` exists and you need to understand or locate code, use CodeGraph before grep/find or broad file reads:

```bash
codegraph explore "<symbol names or question>"
```

Use direct file reads for known files.

## Current Public Entry

```ts
import { A2Surface, useA2UI } from '@a2ui/element-plus';

const { runtime, pushMessage } = useA2UI();
pushMessage(event.data);
```

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```
