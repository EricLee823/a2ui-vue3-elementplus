# 项目规则

这些规则用于保证 packages 易于集成，并能安全演进。

简短版本：

```txt
保持用户集成简单。
保持内部边界明确。
保持实时渲染增量化。
保持规则可演进、可审阅。
```

## 核心规则

### R-001 只负责消息文本，不负责传输

主渲染器 packages 不应负责 SSE、WebSocket、鉴权、重连或业务 action APIs。

允许：

```ts
pushMessage(event.data);
```

避免在 main facade 中出现：

```ts
createSseConnection({ url, token, reconnect });
```

以后可以存在可选 transport packages，但它们不能成为默认路径。

### R-002 保持包边界

Runtime packages 不得依赖 Vue、Element Plus 或 DOM UI APIs。

```txt
protocol-v09 -> no runtime dependency
message-parser -> no Vue dependency
runtime-core -> no Vue or Element Plus dependency
vue-renderer -> no Element Plus dependency
element-plus -> adapter/facade only
```

### R-003 优先使用扁平状态

Surfaces 应用按 id 索引的 maps 存储 components。渲染通过 component id 和 data path 解析，而不是递归修改深层 UI tree。

### R-004 自定义组件是产品表面

自定义组件注入是受支持的 API，不是逃生口。对 registry types、mappers 或 render context 的更改都属于 public API changes。

### R-005 Fixtures 是标准示例

重要行为应在 `fixtures/jsonl` 下新增或更新 fixture。Fixtures 应可被 tests、docs 或 playground 复用。

标准 fixtures 涉及 lifecycle messages 时使用 A2UI v0.9 object-key shape：

```txt
createSurface
updateComponents
updateDataModel
deleteSurface
```

数据绑定示例使用 JSON Pointer paths，例如 `/profile/name`。

### R-006 文档随 API 一起变化

任何 public API change 都必须更新对应 docs，并在相关时更新 README、fixtures 或 playground 覆盖点。

Public API 指以下包导出的内容：

```txt
@a2ui-vue3-elementplus/element-plus
@a2ui-vue3-elementplus/vue-renderer
@a2ui-vue3-elementplus/runtime-core
@a2ui-vue3-elementplus/message-parser
@a2ui-vue3-elementplus/protocol-v09
@a2ui-vue3-elementplus/scheduler
```

### R-007 提交前验证

跨包代码变更的最低要求：

```bash
pnpm test
pnpm build
```

Docs-only 变更运行：

```bash
pnpm docs:build
```

如果检查无法运行，请在最终总结或 PR 中说明原因。

### R-008 不提交生成物和本地状态

不要提交：

```txt
node_modules
dist
.turbo
.vite
.codegraph
coverage
*.tsbuildinfo
**/.vitepress/cache
**/.vitepress/dist
```

### R-009 规则变更需要理由

规则可以演进，但有意义的规则变更必须记录：

- 旧规则为什么不够；
- 变更了什么；
- 新规则将如何验证；
- 现有代码是否需要迁移。

使用 `AGENTS.md` 记录 Codex guidance。使用 docs 记录人类贡献者也需要遵守的规则。`.codex/rules/*.rules` 只用于 Codex command execution policy，不用于架构指导。

### R-010 使用用户偏好的语言沟通

在本仓库工作时，除非用户要求其他语言，Codex 应优先用中文回答。代码符号、package names、command names 和 protocol keywords 保持原文。

## 文档归属

根目录只保留仓库入口、agent 入口和发布说明：

```txt
README.md
AGENTS.md
PROJECT_RULES.md
RELEASE.md
```

架构、项目规则、API 和指南统一放在 `apps/docs`。不要新增长期根目录说明文档；如果需要新的长期说明，请新增或更新 docs 页面，并从 `README.md` 链接过去。

`.agent/` 和 `.agents/` 不是默认 Codex instruction directories。即使目录存在，也不要把仓库规则放在那里。

## 规则生命周期

规则可以处于以下状态之一：

```txt
proposed -> trial -> adopted -> revised -> deprecated
```

- proposed: 有用的想法，尚未强制执行。
- trial: 已在一两轮迭代中使用。
- adopted: contributors 和 agents 的默认规则。
- revised: 因现实反馈而调整。
- deprecated: 仅为历史保留，不再应用。

## 当规则冲突时

使用以下优先级顺序：

1. 当前任务中的用户请求。
2. 安全和数据保全。
3. Public API 兼容性。
4. 包边界规则。
5. 性能和可维护性。
6. 本地风格偏好。

如果某个任务有意违反规则，请记录原因。
