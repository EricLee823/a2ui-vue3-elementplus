# Project Rules

These are the repository-level rules for building and evolving this package family.

The short version:

```txt
Keep user integration simple.
Keep internal boundaries explicit.
Keep realtime rendering incremental.
Keep rules living and reviewable.
```

## Core Rules

### R-001 Own Message Text, Not Transport

The main renderer packages must not own SSE, WebSocket, auth, reconnects, or business action APIs.

Allowed:

```ts
pushMessage(event.data);
```

Avoid in the main facade:

```ts
createSseConnection({ url, token, reconnect });
```

Optional transport packages may exist later, but they must not become the default path.

### R-002 Preserve Package Boundaries

Runtime packages must not depend on Vue or Element Plus.

```txt
protocol-v09 -> no runtime dependency
message-parser -> no Vue dependency
runtime-core -> no Vue or Element Plus dependency
vue-renderer -> no Element Plus dependency
element-plus -> adapter/facade only
```

### R-003 Prefer Flat State Over Deep Reactive Trees

Surfaces should store components in maps keyed by id. Rendering should resolve by component id and data path, not by recursively mutating a deep UI tree.

### R-004 Custom Components Are Product Surface

Custom component injection is a supported API, not an escape hatch. Changes to registry types, mappers, or render context are public API changes.

### R-005 Fixtures Are Canonical Examples

If behavior is important, add or update a fixture under `fixtures/jsonl`.

Fixtures should be reusable by:

- tests,
- docs,
- examples,
- playground.

### R-006 Docs Move With APIs

Any public API change must update the matching docs page and, when relevant, the README.

Public API means anything exported from:

```txt
@a2ui/element-plus
@a2ui/vue-renderer
@a2ui/runtime-core
@a2ui/message-parser
@a2ui/protocol-v09
@a2ui/scheduler
```

### R-007 Verify Before Commit

Run the relevant checks before committing.

Minimum for cross-package changes:

```bash
pnpm test
pnpm build
```

Targeted checks are acceptable for small docs-only changes, but note the reason in the final summary or PR.

### R-008 Do Not Commit Generated Local State

Do not commit:

```txt
node_modules
dist
.turbo
.vite
.codegraph
apps/docs/.vitepress/cache
apps/docs/.vitepress/dist
```

### R-009 Rule Changes Need a Reason

Rules may evolve, but each meaningful rule change must record:

- why the old rule was insufficient,
- what changed,
- how the new rule will be validated,
- whether existing code needs migration.

Use `AGENTS.md` files for durable Codex guidance. Use `.codex/rules/*.rules` only for Codex command execution policy, not architecture guidance.

### R-010 Communicate In The User's Preferred Language

When working in this repository, Codex should answer the user in Chinese first unless the user asks for another language. Keep code symbols, package names, command names, and protocol keywords in their original form.

## Rule Lifecycle

Rules can be in one of these states:

```txt
proposed -> trial -> adopted -> revised -> deprecated
```

- proposed: useful idea, not yet enforced.
- trial: used in one or two iterations.
- adopted: default rule for contributors and agents.
- revised: changed because reality taught us something.
- deprecated: kept for history, no longer applied.

## When Rules Conflict

Use this priority order:

1. User request for the current task.
2. Safety and data preservation.
3. Public API compatibility.
4. Package boundary rules.
5. Performance and maintainability.
6. Local style preferences.

If a task intentionally violates a rule, record the reason.
