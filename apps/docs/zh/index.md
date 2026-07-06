---
title: A2UI Vue3 Element Plus
---

# A2UI Vue3 Element Plus

在 Vue 3 应用中使用 Element Plus 渲染 A2UI v0.9/v0.9.1 实时消息文本。

```ts
import { A2Surface, useA2UI } from '@a2ui-vue3-elementplus/element-plus';

const { runtime, pushMessage } = useA2UI();

eventSource.addEventListener('message', (event) => {
  pushMessage(event.data);
});
```

```vue
<A2Surface :runtime="runtime" surface-id="main" />
```

## 从这里开始

- [快速开始](/zh/guide/quick-start)
- [架构设计](/zh/guide/architecture)
- [实时消息](/zh/guide/realtime-messages)
- [数据示例](/zh/guide/data-examples)
- [自定义组件](/zh/guide/custom-components)
- [项目规则](/zh/guide/project-rules)
- [API 参考](/zh/api/)
