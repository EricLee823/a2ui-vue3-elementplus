# API 参考

公共入口来自 `@a2ui-vue3-elementplus/element-plus`：

```ts
import { A2Surface, useA2UI } from '@a2ui-vue3-elementplus/element-plus';
```

## `useA2UI()`

创建 A2UI runtime，注册 Element Plus catalog，并返回消息推送函数。

```ts
const { runtime, registry, pushMessage, pushJson, pushChunk } = useA2UI({
  components: {
    UserPicker: {
      component: UserPicker,
      propsMapper: (node, ctx) => ({
        modelValue: ctx.resolveValue(node.value)
      }),
      eventsMapper: (node, ctx) => ({
        'onUpdate:modelValue': (value) => ctx.setValue(node.value?.path, value)
      })
    }
  }
});
```

`runtime` 可传给 `A2Surface`，`registry` 可用于检查或扩展 component mapping。

## `pushMessage(message)`

接收一条来自应用自有实时通道的完整 A2UI v0.9 JSON message string。

## `pushJson(message)`

接收已经解析好的 A2UI message object。

## `pushChunk(chunk)`

接收 JSONL 或 streaming text chunks，并在内部缓存尚未完成的行。

## `A2Surface`

渲染 runtime 中的一个 surface。

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```

如果 `A2Surface` 与 `useA2UI()` 位于同一 Vue provide/inject 上下文，也可以省略 `runtime`：

```vue
<A2Surface surface-id="main" />
```

默认 `surface-id` 是 `main`。

## `components`

为自定义 A2UI `component` 名称注册应用组件。简单组件可以直接传入；需要数据绑定或 action 的组件应提供 `propsMapper`、`eventsMapper` 和可选的 `dependencies`。
