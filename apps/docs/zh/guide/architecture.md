# 架构设计

本仓库为 Vue 3 应用实现一个基于 Element Plus 的 A2UI v0.9/v0.9.1 实时消息文本渲染器。

核心集成路径保持很窄：

```ts
pushMessage(event.data);
```

应用负责 realtime transport、auth、retries 和 business APIs。A2UI packages 负责 message parsing、runtime state、incremental rendering、component mapping 和 action events。

## 设计原则

1. 传输层留在主包之外。默认包不强制引入 SSE/WebSocket、鉴权模型、重连策略或 action endpoint。
2. Runtime 与框架无关。A2UI 消息先更新 surfaces、components 和 data models，然后才进入 Vue 渲染。
3. 渲染由适配器驱动。A2UI component 名称通过 registry 映射到 Vue 组件，Element Plus 只是默认适配器。
4. 自定义组件是一等能力。业务组件应能通过 registry 注入，而不需要 fork 渲染器。
5. 实时渲染保持增量化。`updateDataModel` 应只影响相关 bindings 和 surfaces。
6. docs、fixtures、playground 和 tests 都是产品行为的可审阅证据。

## 包分层

```txt
packages/protocol-v09
  A2UI v0.9/v0.9.1 message 和 component 类型。

packages/message-parser
  单条 JSON message、JSONL 和 chunk parsing。

packages/runtime-core
  与传输无关的 surface store、data model updates、JSON Pointer helpers 和 action payloads。

packages/scheduler
  Message queue、batching、priority、pause/resume 和 update coalescing。

packages/vue-renderer
  Vue components、render context、component registry 和 useA2UI()。

packages/element-plus
  Public facade，以及 Basic Catalog 到 Element Plus 组件的 adapter。

fixtures/jsonl
  tests、docs 和 playground 可复用的 A2UI message streams。

apps/playground-vue-element-plus
  面向作者的 JSONL 回放和 runtime 检查 surface。

apps/docs
  在线 API 和指南文档。
```

## Runtime 流程

```txt
用户自有 SSE/WebSocket/fetch stream
  -> pushMessage(text) / pushJson(object) / pushChunk(text)
  -> message-parser
  -> runtime-core.applyMessage()
  -> SurfaceStore
  -> Vue render context
  -> component registry
  -> Element Plus 或自定义 Vue component
```

主包必须让这条流程保持低成本：

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

## Surface 模型

surface 是一个由 `surfaceId` 选择的独立 UI 区域。

```json
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"}}
```

渲染器只渲染被请求的 surface：

```vue
<A2Surface :runtime="runtime" surface-id="main" />
<A2Surface :runtime="runtime" surface-id="dialog" />
```

默认 `surfaceId` 是 `main`，默认 root component id 是 `root`。

## Message 模型

主要支持的 messages 是：

```txt
createSurface
updateComponents
updateDataModel
deleteSurface
```

Components 按 id 存储，并通过 `child` 或 `children` 引用：

```json
{
  "id": "root",
  "component": "Column",
  "children": ["title", "submit"]
}
```

数据绑定使用 JSON Pointer：

```json
{
  "id": "name",
  "component": "TextField",
  "label": "Name",
  "value": { "path": "/profile/name" }
}
```

## 自定义组件扩展

自定义组件通过 Vue renderer registry 注册，并由 Element Plus facade 暴露。

```ts
const { runtime, pushMessage } = useA2UI({
  components: {
    UserPicker: {
      component: UserPicker,
      dependencies: (node) => [node.value?.path, node.options?.path],
      propsMapper: (node, ctx) => ({
        modelValue: ctx.resolveValue(node.value),
        options: ctx.resolveValue(node.options)
      }),
      eventsMapper: (node, ctx) => ({
        'onUpdate:modelValue': (value) => ctx.setValue(node.value?.path, value)
      })
    }
  }
});
```

简单组件可以直接注册；带数据绑定的组件应提供 mapper functions。

## 性能策略

当前 MVP 重点是正确的包边界和低成本集成。长期性能模型是：

```txt
扁平的 surface component map
  + JSON Pointer data updates
  + data path dependency declarations
  + scheduler coalescing
  + Vue component-level subscriptions
```

性能规则：

- 不要让整个 surface 成为深层 reactive tree。
- 不要为了每条消息重建所有 components。
- 合并具有相同 `surfaceId + path` 的重复 `updateDataModel` 消息。
- 当自定义组件绑定到 data paths 时，让它们声明 `dependencies`。
- 保持 Element Plus wrappers 轻薄，并且只承担 adapter 职责。

## 演进方向

近期重点：

- 强化 A2UI v0.9 schema validation；
- 增加有针对性的 renderer tests；
- 改进 data-path subscriptions；
- 增加 CI 和 docs deployment。

后续可以演进：

- 拆分可选 transports；
- 增加更多 UI adapters；
- 增加自动生成的 API reference；
- 增加 versioned documentation；
- 增加 benchmark fixtures。
