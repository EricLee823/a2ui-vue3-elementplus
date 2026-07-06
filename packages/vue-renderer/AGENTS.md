# Vue Renderer 说明

`vue-renderer` 提供 Vue rendering primitives，但不依赖 Element Plus。

允许：

- Vue APIs,
- runtime-core,
- message-parser,
- component registry,
- render context.

不允许：

- importing Element Plus；
- hardcoding 属于 UI adapters 的 Basic Catalog visual behavior；
- owning SSE/WebSocket transport。

registry API 是 public。修改以下内容时要谨慎：

- `components`
- `propsMapper`
- `eventsMapper`
- `dependencies`
- `A2ComponentContext`
