---
title: A2UI Vue3 Element Plus
---

# A2UI Vue3 Element Plus

Render A2UI v0.9 realtime message text in Vue 3 applications using Element Plus.

```ts
import { useA2UI } from '@a2ui/element-plus';

const { runtime, pushMessage } = useA2UI();

eventSource.addEventListener('message', (event) => {
  pushMessage(event.data);
});
```

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```

## Start here

- [Quick Start](/guide/quick-start)
- [Realtime Messages](/guide/realtime-messages)
- [Data Examples](/guide/data-examples)
- [Custom Components](/guide/custom-components)
- [API Reference](/api/)
