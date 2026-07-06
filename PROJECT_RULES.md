# 项目规则

根目录只保留项目规则入口，完整规则统一维护在 docs：

- [项目规则](./apps/docs/guide/project-rules.md)
- [架构设计](./apps/docs/guide/architecture.md)

更新规则时：

1. 修改 `apps/docs/guide/project-rules.md` 和 `apps/docs/zh/guide/project-rules.md`；
2. 如果 agent 行为需要变化，同步更新相关 `AGENTS.md`；
3. 如果行为发生变化，新增或更新 `apps/docs`、`fixtures/jsonl` 或 tests；
4. 在 commit 或 PR summary 中说明原因。

规则生命周期词汇：

```txt
proposed -> trial -> adopted -> revised -> deprecated
```
