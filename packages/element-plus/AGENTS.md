# Element Plus Adapter 说明

`element-plus` 是低成本 public facade 和 Element Plus adapter。

它可以依赖：

- `@a2ui-vue3-elementplus/vue-renderer`
- Vue
- Element Plus

它不得负责：

- SSE/WebSocket connection setup；
- authentication；
- reconnect strategy；
- backend action endpoints。

保持 wrappers 轻薄。将 A2UI component props 转换为 Element Plus props，发出 runtime actions，并保留 custom component override behavior。
