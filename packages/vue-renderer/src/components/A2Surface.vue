<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import A2Component from './A2Component.vue';
import { createRenderContext, provideA2RenderContext } from '../context/renderContext';
import type { A2ComponentRegistry, A2CustomComponents } from '../registry/types';

const props = withDefaults(
  defineProps<{
    runtime: any;
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
const injectedRegistry = inject<A2ComponentRegistry | undefined>('a2uiRegistry', undefined);

function subscribeRuntime() {
  unsubscribe?.();
  unsubscribe = props.runtime?.subscribe?.(() => {
    tick.value += 1;
  });
}

watch(() => props.runtime, subscribeRuntime, { immediate: true });

onBeforeUnmount(() => {
  unsubscribe?.();
});

const context = computed(() =>
  createRenderContext({
    runtime: props.runtime,
    registry: props.registry ?? injectedRegistry,
    components: props.components,
    onAction: (action) => emit('action', action),
    onError: (error) => emit('error', error)
  })
);

provideA2RenderContext(context.value);

const rootId = computed(() => {
  tick.value;
  const surface = props.runtime?.getSurface?.(props.surfaceId);
  return surface?.rootId ?? 'root';
});

const exists = computed(() => {
  tick.value;
  return Boolean(props.runtime?.getSurface?.(props.surfaceId));
});
</script>

<template>
  <div v-if="exists" class="a2-surface" :data-a2-surface-id="surfaceId">
    <A2Component :surface-id="surfaceId" :component-id="rootId" />
  </div>
</template>
