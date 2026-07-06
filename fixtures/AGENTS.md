# Fixtures 说明

Fixtures 是 A2UI v0.9 message streams 的标准可执行示例。

使用 `fixtures/jsonl` 下的 JSONL 文件。

标准 messages：

```txt
createSurface
updateComponents
updateDataModel
deleteSurface
```

数据绑定路径使用 JSON Pointer：

```txt
/profile/name
/items/0/title
```

除非 fixture 明确用于记录 compatibility adapter，否则不要引入替代 message shapes。
