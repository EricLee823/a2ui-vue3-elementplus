# 文档说明

文档必须描述当前 public APIs 和 package boundaries。

更新文档时：

- 当前默认语言页和 `zh/` 页都是中文内容；同名页面需要保持一致；
- 如果后续改为双语文档，默认语言页使用英文，`zh/` 页使用中文；
- 优先使用与 `fixtures/jsonl` 匹配的示例；
- 使用 A2UI v0.9 messages: `createSurface`、`updateComponents`、`updateDataModel`、`deleteSurface`；
- 使用 JSON Pointer paths；
- 不要把 `.agent/` 或 `.agents/` 写作文档中的 Codex instruction directories。

docs-only 验证请运行：

```bash
pnpm docs:build
```
