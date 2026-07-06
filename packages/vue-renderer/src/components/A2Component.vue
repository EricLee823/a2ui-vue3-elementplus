<script lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onErrorCaptured, ref } from 'vue';
import RenderUnknown from './RenderUnknown.vue';
import { createComponentContext, useA2RenderContext } from '../context/renderContext';

export default defineComponent({
  name: 'A2Component',
  props: {
    surfaceId: {
      type: String,
      required: true
    },
    componentId: {
      type: String,
      required: true
    },
    runtimeVersion: Number,
    scopePath: String
  },
  setup(props) {
    const ctx = useA2RenderContext();
    const tick = ref(0);
    const unsubscribe = ctx.runtimeVersion
      ? undefined
      : ctx.runtime?.subscribe?.(() => {
          tick.value += 1;
        });

    function trackRuntimeChanges() {
      tick.value;
      props.runtimeVersion;
      ctx.runtimeVersion?.value;
    }

    const node = computed<Record<string, unknown> | undefined>(() => {
      trackRuntimeChanges();
      return ctx.runtime?.getComponent?.(props.surfaceId, props.componentId);
    });

    onBeforeUnmount(() => {
      unsubscribe?.();
    });

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
      trackRuntimeChanges();
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

    return () => vnode.value;
  }
});
</script>
