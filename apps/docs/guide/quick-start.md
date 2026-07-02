# Quick Start

Install the renderer package and Element Plus in a Vue 3 app.

```bash
pnpm add @a2ui/element-plus element-plus vue
```

Create a runtime and render the primary surface.

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

The application owns networking, authentication, retries, and business actions. A2UI receives message text and updates surfaces.
