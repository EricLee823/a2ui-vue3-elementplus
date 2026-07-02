# 数据示例

仓库提供 JSONL fixtures，可直接用于 `pushMessage(event.data)`、测试、文档和 playground。

## Fixtures

- `fixtures/jsonl/hello-world.jsonl`
- `fixtures/jsonl/basic-form.jsonl`
- `fixtures/jsonl/custom-component.jsonl`
- `fixtures/jsonl/multi-surface.jsonl`
- `fixtures/jsonl/data-model-updates.jsonl`

## 基础表单

```jsonl
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json","sendDataModel":true}}
{"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/","value":{"profile":{"name":"Ada Lovelace","email":"ada@example.com","role":["admin"],"active":true}}}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[{"id":"root","component":"Card","child":"form"},{"id":"form","component":"Column","children":["title","name","email","submit"]},{"id":"title","component":"Text","text":"Profile Form","variant":"h2"},{"id":"name","component":"TextField","label":"Name","value":{"path":"/profile/name"}},{"id":"email","component":"TextField","label":"Email","value":{"path":"/profile/email"}},{"id":"submit","component":"Button","child":"submit-text","variant":"primary","action":{"event":{"name":"profile.save"}}},{"id":"submit-text","component":"Text","text":"Save profile"}]}}
```

## 局部数据更新

```json
{"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/counter","value":2}}
```

`updateDataModel` 既可以设置初始数据，也可以做增量更新。
