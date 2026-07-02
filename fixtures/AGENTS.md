# Fixtures Instructions

Fixtures are canonical executable examples of A2UI v0.9 message streams.

Use JSONL files under `fixtures/jsonl`.

Canonical messages:

```txt
createSurface
updateComponents
updateDataModel
deleteSurface
```

Use JSON Pointer for data binding paths:

```txt
/profile/name
/items/0/title
```

Do not introduce alternate message shapes unless the fixture is explicitly documenting a compatibility adapter.
