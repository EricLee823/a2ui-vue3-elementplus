<script setup lang="ts">
import { computed, inject } from 'vue';
import { A2Surface as BaseA2Surface, createComponentRegistry } from '@a2ui-vue3-elementplus/vue-renderer';
import type { A2ComponentRegistry, A2CustomComponents } from '@a2ui-vue3-elementplus/vue-renderer';
import { createElementPlusCatalog } from './registerElementPlusCatalog';
import { getRuntimeElementPlusRegistry } from './runtimeRegistry';
import { A2_REGISTRY_KEY, A2_RUNTIME_KEY } from './contextKeys';

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

const injectedRegistry = inject<A2ComponentRegistry | undefined>(A2_REGISTRY_KEY, undefined);
const injectedRuntime = inject<any>(A2_RUNTIME_KEY, undefined);
const fallbackRegistry = createComponentRegistry(createElementPlusCatalog());
const resolvedRuntime = computed(() => props.runtime ?? injectedRuntime);

const resolvedRegistry = computed(
  () => props.registry ?? getRuntimeElementPlusRegistry(resolvedRuntime.value) ?? (injectedRegistry ? undefined : fallbackRegistry)
);
</script>

<template>
  <BaseA2Surface
    :runtime="resolvedRuntime"
    :surface-id="surfaceId"
    :registry="resolvedRegistry"
    :components="components"
    @action="emit('action', $event)"
    @error="emit('error', $event)"
  />
</template>
