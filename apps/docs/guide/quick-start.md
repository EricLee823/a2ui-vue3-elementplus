# 快速开始

在 Vue 3 应用中安装渲染器 package 和 Element Plus。

```bash
pnpm add @a2ui-vue3-elementplus/element-plus element-plus vue
```

创建 A2UI 实例并渲染主 surface。

```vue
<script setup lang="ts">
import { A2Surface, useA2UI } from '@a2ui-vue3-elementplus/element-plus';

const { pushMessage } = useA2UI();

function receiveA2UIMessage(text: string) {
  pushMessage(text);
}
</script>

<template>
  <A2Surface surface-id="main" />
</template>
```

应用负责网络、鉴权、重试和业务 actions。A2UI 接收消息文本并更新 surfaces。
