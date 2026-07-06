<script setup lang="ts">
import { watch } from 'vue';
import type { A2CustomComponents } from '@a2ui-vue3-elementplus/vue-renderer';
import A2Surface from './A2Surface.vue';
import { useA2UI } from './useA2UI';

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

const { pushMessage } = useA2UI({
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
    :surface-id="surfaceId"
    :components="components"
    @action="emit('action', $event)"
    @error="emit('error', $event)"
  />
</template>
