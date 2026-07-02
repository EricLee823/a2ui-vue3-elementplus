<script setup lang="ts">
import { watch } from 'vue';
import A2Surface from './A2Surface.vue';
import { useA2UI } from '../useA2UI';
import type { A2CustomComponents } from '../registry/types';

const props = withDefaults(
  defineProps<{
    message?: string;
    surfaceId?: string;
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

const { runtime, pushMessage } = useA2UI({
  components: props.components,
  onAction: (action) => emit('action', action),
  onError: (error) => emit('error', error)
});

watch(
  () => props.message,
  (message) => {
    if (message) {
      pushMessage(message);
    }
  },
  { immediate: true }
);
</script>

<template>
  <A2Surface
    :runtime="runtime"
    :surface-id="surfaceId"
    :components="components"
    @action="emit('action', $event)"
    @error="emit('error', $event)"
  />
</template>
