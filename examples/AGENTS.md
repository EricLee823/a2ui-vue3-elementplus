# Examples Instructions

Examples must demonstrate low-cost user integration.

The primary path is:

```ts
pushMessage(event.data);
```

Examples should not make the renderer own networking. If an example simulates SSE, keep the boundary clear: application code receives text and passes it to A2UI.

Prefer importing fixtures from `fixtures/jsonl` so docs, examples, tests, and playground stay aligned.
