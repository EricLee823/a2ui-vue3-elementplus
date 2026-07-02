# Docs Instructions

Docs must describe the current public APIs and package boundaries.

When updating docs:

- keep English and Chinese pages consistent when both exist,
- prefer examples that match `fixtures/jsonl`,
- use A2UI v0.9 messages: `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`,
- use JSON Pointer paths,
- do not document `.agent/` or `.agents/` as Codex instruction directories.

For docs-only validation, run:

```bash
pnpm docs:build
```
