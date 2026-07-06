<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import A2Component from './A2Component.vue';
import { createRenderContext, provideA2RenderContext } from '../context/renderContext';
import { injectA2Registry, injectA2Runtime } from '../context/injectionKeys';
import type { A2ComponentRegistry, A2CustomComponents } from '../registry/types';

const props = withDefaults(
  defineProps<{
    runtime?: any;
    surfaceId?: string;
    registry?: A2ComponentRegistry;
    components?: A2CustomComponents;
  }>(),
  {
    surfaceId: 'main'
  }
);

const emit = defineEmits<{
  action: [action: unknown];
  error: [error: unknown];
}>();

const tick = ref(0);
let unsubscribe: undefined | (() => void);
const injectedRegistry = injectA2Registry();
const injectedRuntime = injectA2Runtime();
const runtime = computed(() => props.runtime ?? injectedRuntime);

function subscribeRuntime(runtimeValue = runtime.value) {
  unsubscribe?.();
  unsubscribe = runtimeValue?.subscribe?.(() => {
    tick.value += 1;
  });
}

watch(runtime, subscribeRuntime, { immediate: true });

onBeforeUnmount(() => {
  unsubscribe?.();
});

const context = computed(() =>
  createRenderContext({
    runtime: runtime.value,
    registry: props.registry ?? injectedRegistry,
    components: props.components,
    runtimeVersion: tick,
    onAction: (action) => emit('action', action),
    onError: (error) => emit('error', error)
  })
);

provideA2RenderContext(context.value);

const rootId = computed(() => {
  tick.value;
  const surface = runtime.value?.getSurface?.(props.surfaceId);
  return surface?.rootId ?? 'root';
});

const exists = computed(() => {
  tick.value;
  return Boolean(runtime.value?.getSurface?.(props.surfaceId));
});
</script>

<template>
  <div v-if="exists" class="a2-surface" :data-a2-surface-id="surfaceId">
    <A2Component :surface-id="surfaceId" :component-id="rootId" :runtime-version="tick" />
  </div>
</template>
