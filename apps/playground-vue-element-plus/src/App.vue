<script setup lang="ts">
import { computed, ref } from 'vue';
import { A2Surface, useA2UI } from '@a2ui/element-plus';
import helloWorld from '../../../fixtures/jsonl/hello-world.jsonl?raw';
import basicForm from '../../../fixtures/jsonl/basic-form.jsonl?raw';
import customComponent from '../../../fixtures/jsonl/custom-component.jsonl?raw';
import multiSurface from '../../../fixtures/jsonl/multi-surface.jsonl?raw';
import dataModelUpdates from '../../../fixtures/jsonl/data-model-updates.jsonl?raw';

const fixtures = {
  'Hello World': helloWorld,
  'Basic Form': basicForm,
  'Custom Component': customComponent,
  'Multi Surface': multiSurface,
  'Data Updates': dataModelUpdates
};

const selectedFixture = ref<keyof typeof fixtures>('Basic Form');
const source = ref(fixtures[selectedFixture.value]);
const logs = ref<string[]>([]);
const cursor = ref(0);

const { runtime, pushMessage, pushChunk } = useA2UI({
  components: {
    MetricCard: {
      propsMapper: (node, ctx) => ({
        title: node.title,
        value: ctx.resolveValue(node.value),
        tone: node.tone
      }),
      component: {
        props: ['title', 'value', 'tone'],
        template: '<div class="metric-card" :data-tone="tone"><span>{{ title }}</span><strong>{{ value }}</strong></div>'
      }
    }
  },
  onAction(action) {
    logs.value.unshift(JSON.stringify(action, null, 2));
  },
  onError(error) {
    logs.value.unshift(`ERROR: ${String(error)}`);
  }
});

const lines = computed(() => source.value.split(/\r?\n/).filter((line) => line.trim().length > 0));

function loadFixture() {
  source.value = fixtures[selectedFixture.value];
  reset();
}

function reset() {
  runtime.reset?.();
  cursor.value = 0;
  logs.value = [];
}

function playAll() {
  reset();
  pushChunk(source.value);
  cursor.value = lines.value.length;
}

function step() {
  const line = lines.value[cursor.value];
  if (!line) {
    return;
  }
  pushMessage(line);
  cursor.value += 1;
}
</script>

<template>
  <main class="playground">
    <section class="toolbar">
      <h1>A2UI Playground</h1>
      <div class="toolbar__actions">
        <select v-model="selectedFixture" @change="loadFixture">
          <option v-for="(_, name) in fixtures" :key="name" :value="name">{{ name }}</option>
        </select>
        <button type="button" @click="step">Step</button>
        <button type="button" @click="playAll">Play All</button>
        <button type="button" @click="reset">Reset</button>
      </div>
    </section>

    <section class="workspace">
      <div class="editor-pane">
        <textarea v-model="source" spellcheck="false" />
      </div>

      <div class="render-pane">
        <A2Surface :runtime="runtime" surface-id="main" />
        <A2Surface :runtime="runtime" surface-id="dialog" />
      </div>

      <aside class="inspect-pane">
        <h2>Action Log</h2>
        <pre v-for="(log, index) in logs" :key="index">{{ log }}</pre>
      </aside>
    </section>
  </main>
</template>
