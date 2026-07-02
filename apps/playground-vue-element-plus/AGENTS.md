# Playground Instructions

This app is an author-facing playground for validating renderer behavior.

Keep it fixture-driven and implementation-focused:

- use JSONL fixtures from `fixtures/jsonl` when possible,
- make it easy to paste or replay raw A2UI v0.9 message text,
- expose runtime/action/debug state that helps package authors test changes,
- do not turn the playground into a marketing landing page,
- do not make the renderer own SSE/WebSocket setup here unless the UI clearly labels it as simulated application code.

When playground behavior changes because public APIs changed, update docs and examples in the same change.
