<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { A2Surface, useA2UI } from '@a2ui/element-plus';
import MetricCard from './components/MetricCard.vue';
import customComponentMessages from '../../../fixtures/jsonl/custom-component.jsonl?raw';

const { runtime, pushMessage } = useA2UI({
  components: {
    MetricCard: {
      component: MetricCard,
      dependencies: (node) => [
        node.value && typeof node.value === 'object' && 'path' in node.value ? String(node.value.path) : undefined
      ],
      propsMapper: (node, ctx) => ({
        title: node.title,
        value: ctx.resolveValue(node.value),
        trend: node.trend,
        status: node.status,
        format: node.format
      })
    }
  }
});
const connected = ref(false);
const lines = customComponentMessages.split(/\r?\n/).filter(Boolean);

function handleRealtimeMessage(event: Pick<MessageEvent, 'data'>) {
  pushMessage(event.data);
}

onMounted(() => {
  connected.value = true;
  for (const line of lines) {
    handleRealtimeMessage({ data: line });
  }
});
</script>

<template>
  <main class="example-shell">
    <header class="example-header">
      <div>
        <p class="eyebrow">A2UI v0.9</p>
        <h1>Custom component</h1>
      </div>
      <el-tag :type="connected ? 'success' : 'warning'" effect="plain">
        {{ connected ? 'Messages pushed' : 'Idle' }}
      </el-tag>
    </header>

    <section class="surface-wrap">
      <A2Surface :runtime="runtime" surface-id="main" />
    </section>
  </main>
</template>
