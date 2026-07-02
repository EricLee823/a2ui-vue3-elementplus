<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { A2Surface, useA2UI } from '@a2ui/element-plus';
import basicFormMessages from '../../../fixtures/jsonl/basic-form.jsonl?raw';

const { runtime, pushMessage } = useA2UI();
const connected = ref(false);
const lastMessage = ref('Waiting for A2UI messages');
const lines = basicFormMessages.split(/\r?\n/).filter(Boolean);

function handleRealtimeMessage(event: Pick<MessageEvent, 'data'>) {
  pushMessage(event.data);
  lastMessage.value = event.data;
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
        <h1>Basic form</h1>
      </div>
      <el-tag :type="connected ? 'success' : 'warning'" effect="plain">
        {{ connected ? 'Messages pushed' : 'Idle' }}
      </el-tag>
    </header>

    <section class="surface-wrap">
      <A2Surface :runtime="runtime" surface-id="main" />
    </section>

    <footer class="message-log">
      <span>Latest message</span>
      <code>{{ lastMessage }}</code>
    </footer>
  </main>
</template>
