# A2UI Vue3 Element Plus Renderer

这是一个 monorepo，用于在 Vue 3 应用中通过 Element Plus 渲染 A2UI v0.9/v0.9.1 实时消息文本。

包边界有意保持很窄：应用负责 SSE、WebSocket、鉴权、重连和业务请求；渲染器接收 A2UI 消息文本并更新 UI。

```ts
import { A2Surface, useA2UI } from '@a2ui-vue3-elementplus/element-plus';

const { runtime, pushMessage } = useA2UI();

eventSource.addEventListener('a2ui', (event) => {
  pushMessage(event.data);
});
```

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```

## 工作区

- `packages/protocol-v09`: A2UI v0.9 协议类型。
- `packages/message-parser`: JSON 和 JSONL 消息解析。
- `packages/runtime-core`: 与传输无关的 surface runtime。
- `packages/scheduler`: 消息批处理与合并。
- `packages/vue-renderer`: Vue 渲染器和组件注册表。
- `packages/element-plus`: Element Plus catalog 适配器和公共 facade。
- `fixtures`: 测试、文档和 playground 共用的 JSONL 数据。
- `apps/docs`: 在线 API 文档。
- `apps/playground-vue-element-plus`: 作者侧 playground。

## 项目思路

根目录只保留仓库入口、agent 入口和发布说明。长期文档统一放在 VitePress docs：

- [架构设计](./apps/docs/guide/architecture.md): 包边界、实时消息流、渲染模型和扩展点。
- [项目规则](./apps/docs/guide/project-rules.md): 必须遵守的工程规则及其演进流程。
- [API 参考](./apps/docs/api/index.md): public API 入口。
- [发布流程](./RELEASE.md): Changesets 和 npm 发布步骤。
- [Agent 指南](./AGENTS.md): 在本仓库工作的 coding agent 入口说明。
- [项目规则入口](./PROJECT_RULES.md): 根目录保留的短索引。
