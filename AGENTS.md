# AGENTS.md

这是仓库级 Codex 指令文件。Codex 会从仓库根目录到当前工作目录逐级发现 `AGENTS.md` 文件。更具体的嵌套 `AGENTS.md` 会为其子树覆盖或扩展本文件。

`.agent/` 和 `.agents/` 不是默认 Codex 指令发现目录；即使这些目录存在，也不要把仓库规则放在那里。项目本地命令执行策略放在 `.codex/rules/*.rules`，架构和人类协作规则放在 docs。

## 使命

本仓库用于在 Vue 3 应用中通过 Element Plus 渲染 A2UI v0.9/v0.9.1 实时消息文本。

保持面向用户的集成很小：

```ts
pushMessage(event.data);
```

应用负责实时传输、鉴权、重连和业务 APIs。这些 packages 负责消息解析、runtime state、增量渲染、组件映射和 action events。

## 沟通

与用户沟通时优先使用中文。代码、package names、public API names 和 protocol keywords 保持原文。

## 文档入口

根目录文档保持精简：

- `README.md`: 仓库入口、工作区列表和文档导航。
- `PROJECT_RULES.md`: 人类贡献者规则入口，正文链接到 docs。
- `RELEASE.md`: 发布流程。
- `AGENTS.md`: agent 工作入口。
- `apps/docs/guide/architecture.md` 与 `apps/docs/zh/guide/architecture.md`: 架构说明。
- `apps/docs/guide/project-rules.md` 与 `apps/docs/zh/guide/project-rules.md`: 项目规则。

不要新增长期根目录说明文档；优先放入 `apps/docs`，并在 `README.md` 链接。

## 先读

在进行大范围变更前，请阅读：

1. `README.md`
2. `apps/docs/guide/architecture.md`
3. `apps/docs/guide/project-rules.md`
4. 要编辑文件对应的最近一层嵌套 `AGENTS.md`

## 核心规则

- 保持 package boundaries。
- Runtime packages 不得依赖 Vue、Element Plus 或 DOM UI APIs。
- `packages/vue-renderer` 不得 import Element Plus。
- `packages/element-plus` 是 public facade 和 Element Plus adapter。
- 不要给 main facade 增加必需的 SSE/WebSocket URL 配置。
- 将 custom component injection 视为 public API。
- 标准 fixtures 涉及 lifecycle messages 时必须使用 A2UI v0.9 object-key shape: `createSurface`、`updateComponents`、`updateDataModel`、`deleteSurface`。
- Data binding examples 必须使用 JSON Pointer paths，例如 `/profile/name`。
- Public API changes 必须在相关时更新 docs 以及至少一个 fixture 或 playground 覆盖点。
- 不要提交 generated 或 local state: `node_modules`、`dist`、`.turbo`、`.vite`、`.codegraph`、`coverage`、`*.tsbuildinfo`、`apps/docs/.vitepress/cache`、`apps/docs/.vitepress/dist`。

## 验证

对于跨包代码变更，运行：

```bash
pnpm test
pnpm build
```

对于 docs-only 变更，运行：

```bash
pnpm docs:build
```

如果检查无法运行，请报告原因。

## 规则演进

规则允许演进，但变更必须明确且可审阅。

变更持久规则时：

1. 更新相关 `AGENTS.md`；
2. 如果人类贡献者也需要同一规则，更新 `apps/docs/guide/project-rules.md`、`apps/docs/zh/guide/project-rules.md`，必要时更新 `PROJECT_RULES.md` 的入口说明；
3. 如果行为发生变化，新增或更新 `apps/docs`、`fixtures/jsonl` 或 tests；
4. 在 commit 或 PR summary 中解释原因。

必要时在 docs 或 PR 中使用以下生命周期词汇：

```txt
proposed -> trial -> adopted -> revised -> deprecated
```

## CodeGraph

如果 `.codegraph/` 存在，并且你需要理解或定位代码，请先使用 CodeGraph，再使用 grep/find 或大范围文件读取：

```bash
codegraph explore "<symbol names or question>"
```

已知文件可以直接读取。CodeGraph 用于第一轮定位；最终以当前工作树核验。若发现已删除路径或明显 stale 结果，请用当前文件系统复核，并在需要时提醒重建索引。

## 当前公共入口

```ts
import { A2Surface, useA2UI } from '@a2ui-vue3-elementplus/element-plus';

const { runtime, pushMessage } = useA2UI();
pushMessage(event.data);
```

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```
