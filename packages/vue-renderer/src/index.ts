export { default as A2Surface } from './components/A2Surface.vue';
export { default as A2Component } from './components/A2Component.vue';
export { default as A2RealtimeRenderer } from './components/A2RealtimeRenderer.vue';
export { default as RenderUnknown } from './components/RenderUnknown.vue';
export { A2UIVuePlugin, createA2UIVuePlugin } from './plugin';
export { createComponentRegistry } from './registry/createComponentRegistry';
export {
  A2_REGISTRY_KEY,
  A2_RUNTIME_KEY,
  injectA2Registry,
  injectA2Runtime,
  provideA2UIContext
} from './context/injectionKeys';
export { createRenderContext, provideA2RenderContext, useA2RenderContext } from './context/renderContext';
export { useA2UI } from './useA2UI';
export type {
  A2ComponentContext,
  A2ComponentRegistration,
  A2ComponentRegistry,
  A2CustomComponents,
  RegisterConflictStrategy
} from './registry/types';
export type { A2UIInstance, UseA2UIOptions } from './useA2UI';
