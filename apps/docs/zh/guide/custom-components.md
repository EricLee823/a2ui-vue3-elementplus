# 自定义组件

应用可以为领域专属的 `component` 值注册 Vue components，同时仍由 A2UI 控制位置、props 和数据绑定。

```ts
import { useA2UI } from '@a2ui-vue3-elementplus/element-plus';
import MetricCard from './MetricCard.vue';

const { pushMessage } = useA2UI({
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

`MetricCard.vue` 可以只是普通的 Vue component。

```vue
<script setup lang="ts">
defineProps<{
  title?: string;
  value?: number;
  status?: string;
}>();
</script>

<template>
  <article class="metric-card">
    <strong>{{ title }}</strong>
    <span>{{ value }}</span>
    <em>{{ status }}</em>
  </article>
</template>
```

然后推送使用该已注册 component name 的 component。

```json
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[{"id":"root","component":"Column","children":["conversion-card"]},{"id":"conversion-card","component":"MetricCard","title":"Checkout conversion","value":{"path":"/metrics/conversion"},"status":"healthy"}]}}
```
