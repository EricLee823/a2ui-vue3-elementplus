# Custom Components

Applications can register Vue components for domain-specific `component` values while A2UI still controls placement, props, and data binding.

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

Then stream a component that uses the registered component name.

```json
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[{"id":"root","component":"Column","children":["conversion-card"]},{"id":"conversion-card","component":"MetricCard","title":"Checkout conversion","value":{"path":"/metrics/conversion"},"status":"healthy"}]}}
```

The custom component example lives in `examples/custom-component`.
