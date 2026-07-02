# API 参考

此页记录当前公共 API，后续可以接入 TypeDoc 自动生成更完整的参考文档。

## `useA2UI()`

创建 A2UI runtime，并返回实时消息入口。

```ts
const { runtime, pushMessage, pushJson, pushChunk } = useA2UI({
  components: {
    UserPicker
  }
});
```

## `pushMessage(message)`

接收一条完整的 A2UI v0.9 JSON 字符串。

## `pushJson(message)`

接收已经解析好的 A2UI 消息对象。

## `pushChunk(chunk)`

接收 JSONL 或流式文本片段，内部会缓存未完成的行。

## `A2Surface`

渲染 runtime 中的一个 surface。

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```

## `components`

注册业务自定义组件，用于扩展 A2UI `component` 名称。
