# 自定义组件

业务应用可以为自定义 `component` 名称注册 Vue 组件。A2UI 仍然控制布局、props 映射和数据绑定。

```ts
import { useA2UI } from '@a2ui/element-plus';
import MetricCard from './MetricCard.vue';

const { runtime, pushMessage } = useA2UI({
  components: {
    MetricCard: {
      component: MetricCard,
      propsMapper: (node, ctx) => ({
        title: node.title,
        value: ctx.resolveValue(node.value),
        status: node.status
      }),
      dependencies: (node) => [
        node.value && typeof node.value === 'object' && 'path' in node.value
          ? String(node.value.path)
          : undefined
      ]
    }
  }
});
```

服务端可以推送使用该组件名的节点：

```json
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[{"id":"root","component":"Column","children":["conversion-card"]},{"id":"conversion-card","component":"MetricCard","title":"Checkout conversion","value":{"path":"/metrics/conversion"},"status":"healthy"}]}}
```

完整示例见 `examples/custom-component`。
