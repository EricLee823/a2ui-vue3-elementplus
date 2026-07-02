# Project Rules

The project rules are designed to keep the package easy to integrate and safe to evolve.

## Core Rules

- The main package consumes message text; it does not own SSE or WebSocket connections.
- Runtime packages stay framework-free.
- Vue renderer stays UI-library agnostic.
- Element Plus behavior stays in `@a2ui/element-plus`.
- Custom component injection is public API.
- Canonical examples use A2UI v0.9 `createSurface`, `updateComponents`, `updateDataModel`, and `deleteSurface`.
- Data binding examples use JSON Pointer.
- Public API changes must update docs and examples.
- Codex should answer the user in Chinese first unless the user asks for another language.

## Living Rules

Rules live in two places:

```txt
AGENTS.md
  Codex instruction files. Root and nested files define durable agent guidance.

PROJECT_RULES.md
  Human-readable project rules.

.codex/rules/*.rules
  Codex command execution policy rules, loaded only when the project .codex layer is trusted.
```

Do not use `.agent/` or `.agents/` as Codex instruction directories unless the user has explicitly configured fallback filenames.
