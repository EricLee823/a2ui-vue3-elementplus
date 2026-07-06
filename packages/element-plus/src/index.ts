import './styles/index.scss';

export { A2ElementPlusPlugin, createA2ElementPlusPlugin } from './plugin';
export { createElementPlusCatalog } from './registerElementPlusCatalog';
export { default as A2Surface } from './A2Surface.vue';
export { default as A2RealtimeRenderer } from './A2RealtimeRenderer.vue';
export { useA2UI as useBaseA2UI } from '@a2ui-vue3-elementplus/vue-renderer';
export { useA2UI } from './useA2UI';
export type { A2ElementPlusPluginOptions } from './plugin';
export type {
  A2ComponentContext,
  A2ComponentRegistration,
  A2CustomComponents,
  RegisterConflictStrategy
} from '@a2ui-vue3-elementplus/vue-renderer';

export { A2ElementPlusPlugin as default } from './plugin';
