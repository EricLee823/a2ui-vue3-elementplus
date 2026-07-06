# Playground 说明

这个 app 是面向作者的 playground，用于验证 renderer behavior。

保持它由 fixtures 驱动，并专注于实现验证：

- 尽可能使用 `fixtures/jsonl` 中的 JSONL fixtures；
- 让粘贴或回放原始 A2UI v0.9 message text 变得容易；
- 暴露 runtime/action/debug state，帮助 package authors 测试变更；
- 不要把 playground 变成营销 landing page；
- 除非 UI 明确标注为模拟应用代码，否则不要让渲染器在这里负责 SSE/WebSocket setup。

当 public APIs 变化导致 playground behavior 改变时，在同一变更中更新 docs，并在需要时更新 fixtures。
