# 快速开始

安装渲染器和 Element Plus：

```bash
pnpm add @a2ui/element-plus element-plus vue
```

在页面中创建 runtime，并把用户系统已有实时通道收到的消息文本交给渲染器。

```vue
<script setup lang="ts">
import { A2Surface, useA2UI } from '@a2ui/element-plus';

const { runtime, pushMessage } = useA2UI();

function receiveA2UIMessage(text: string) {
  pushMessage(text);
}
</script>

<template>
  <A2Surface :runtime="runtime" surface-id="main" />
</template>
```

用户应用负责网络、鉴权、重连和业务 action 接口。A2UI 包只负责接收消息文本并更新 UI。
