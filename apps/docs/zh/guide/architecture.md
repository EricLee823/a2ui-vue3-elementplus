# 架构设计

渲染器围绕一个低成本接入路径设计：

```ts
pushMessage(event.data);
```

用户应用负责实时通道、鉴权、重连和业务接口。A2UI 包负责消息解析、运行时状态、增量渲染、组件映射和 action 事件。

## 包分层

```txt
protocol-v09
  A2UI v0.9/v0.9.1 类型。

message-parser
  JSON 和 JSONL 消息解析。

runtime-core
  surface store、dataModel 更新、JSON Pointer 和 action payload。

scheduler
  消息队列、优先级和更新合并。

vue-renderer
  A2Surface、渲染上下文、组件注册表和 useA2UI。

element-plus
  对外 facade 和 Element Plus 适配层。
```

## 实时渲染链路

```txt
用户应用实时客户端
  -> pushMessage / pushJson / pushChunk
  -> 解析消息
  -> 应用 runtime command
  -> 更新 surface store
  -> 渲染指定 surface
  -> 解析 Element Plus 或自定义组件
```

## 扩展点

自定义组件通过 `useA2UI` 注册。

```ts
useA2UI({
  components: {
    UserPicker: {
      component: UserPicker,
      propsMapper: (node, ctx) => ({
        modelValue: ctx.resolveValue(node.value),
        options: ctx.resolveValue(node.options)
      })
    }
  }
});
```

完整架构说明见仓库根目录 `ARCHITECTURE.md`。
