<script setup lang="ts">
import { computed, h, onErrorCaptured } from 'vue';
import RenderUnknown from './RenderUnknown.vue';
import { createComponentContext, useA2RenderContext } from '../context/renderContext';

const props = defineProps<{
  surfaceId: string;
  componentId: string;
  scopePath?: string;
}>();

const ctx = useA2RenderContext();

const node = computed<Record<string, unknown> | undefined>(() =>
  ctx.runtime?.getComponent?.(props.surfaceId, props.componentId)
);

const registration = computed(() => {
  const type = node.value?.component;
  return typeof type === 'string' ? ctx.registry.resolve(type) : undefined;
});

onErrorCaptured((error) => {
  ctx.onError?.({
    error,
    surfaceId: props.surfaceId,
    componentId: props.componentId
  });
  return false;
});

const vnode = computed(() => {
  const currentNode = node.value;
  if (!currentNode) {
    return null;
  }

  const currentRegistration = registration.value;
  if (!currentRegistration) {
    return h(RenderUnknown, {
      surfaceId: props.surfaceId,
      componentId: props.componentId,
      componentType: currentNode.component
    });
  }

  const componentCtx = createComponentContext(ctx, props.surfaceId, currentNode);
  const mappedProps = currentRegistration.propsMapper
    ? currentRegistration.propsMapper(currentNode, componentCtx)
    : { node: currentNode, context: componentCtx };
  const mappedEvents = currentRegistration.eventsMapper
    ? currentRegistration.eventsMapper(currentNode, componentCtx)
    : {};

  return h(currentRegistration.component, {
    ...mappedProps,
    ...mappedEvents,
    'data-a2-component-id': props.componentId
  });
});
</script>

<template>
  <component :is="vnode" />
</template>
