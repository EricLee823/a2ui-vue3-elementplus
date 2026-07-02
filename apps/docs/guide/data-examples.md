# Data Examples

The repository ships JSONL fixtures that can be replayed into `pushMessage(event.data)`.

## Fixtures

- `fixtures/jsonl/hello-world.jsonl`
- `fixtures/jsonl/basic-form.jsonl`
- `fixtures/jsonl/custom-component.jsonl`
- `fixtures/jsonl/multi-surface.jsonl`
- `fixtures/jsonl/data-model-updates.jsonl`

## Basic form

```jsonl
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json","sendDataModel":true}}
{"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/","value":{"profile":{"name":"Ada Lovelace","email":"ada@example.com","role":["admin"],"active":true}}}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[{"id":"root","component":"Card","child":"form"},{"id":"form","component":"Column","children":["title","name","email","submit"]},{"id":"title","component":"Text","text":"Profile Form","variant":"h2"},{"id":"name","component":"TextField","label":"Name","value":{"path":"/profile/name"}},{"id":"email","component":"TextField","label":"Email","value":{"path":"/profile/email"}},{"id":"submit","component":"Button","child":"submit-text","variant":"primary","action":{"event":{"name":"profile.save"}}},{"id":"submit-text","component":"Text","text":"Save profile"}]}}
```

## Data updates

```json
{"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/counter","value":2}}
```

Use `updateDataModel` for both initial state and incremental updates. The runtime updates only the affected surface state, and the renderer refreshes subscribed components.
