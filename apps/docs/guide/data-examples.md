# 数据示例

仓库提供 JSONL fixtures，可回放到 `pushMessage(event.data)` 中。

## Fixtures

- `fixtures/jsonl/hello-world.jsonl`
- `fixtures/jsonl/basic-form.jsonl`
- `fixtures/jsonl/custom-component.jsonl`
- `fixtures/jsonl/multi-surface.jsonl`
- `fixtures/jsonl/data-model-updates.jsonl`
- `fixtures/jsonl/user-mock.jsonl`

## 基础表单

```jsonl
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json","sendDataModel":true}}
{"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/","value":{"profile":{"name":"Ada Lovelace","email":"ada@example.com","role":["admin"],"active":true}}}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[{"id":"root","component":"Card","child":"form"},{"id":"form","component":"Column","children":["title","name","email","role","active","submit"]},{"id":"title","component":"Text","text":"Profile Form","variant":"h2"},{"id":"name","component":"TextField","label":"Name","value":{"path":"/profile/name"},"textFieldType":"shortText"},{"id":"email","component":"TextField","label":"Email","value":{"path":"/profile/email"},"textFieldType":"shortText"},{"id":"role","component":"ChoicePicker","options":[{"label":"Admin","value":"admin"},{"label":"Editor","value":"editor"},{"label":"Viewer","value":"viewer"}],"selections":{"path":"/profile/role"},"maxAllowedSelections":1},{"id":"active","component":"CheckBox","label":"Active","value":{"path":"/profile/active"}},{"id":"submit","component":"Button","child":"submit-text","variant":"primary","action":{"event":{"name":"profile.save","context":{"source":"basic-form"}}}},{"id":"submit-text","component":"Text","text":"Save profile"}]}}
```

## 数据更新

```json
{"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/counter","value":2}}
```

`updateDataModel` 既可用于初始状态，也可用于增量更新。runtime 只更新受影响的 surface state，renderer 会刷新已订阅的 components。
