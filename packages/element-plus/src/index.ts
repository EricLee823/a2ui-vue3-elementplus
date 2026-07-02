import './styles/index.scss';

export { A2ElementPlusPlugin, createA2ElementPlusPlugin } from './plugin';
export { createElementPlusCatalog } from './registerElementPlusCatalog';
export { A2Surface, A2RealtimeRenderer, useA2UI as useBaseA2UI } from '@a2ui/vue-renderer';
export { useA2UI } from './useA2UI';
export type { A2ElementPlusPluginOptions } from './plugin';
export type {
  A2ComponentContext,
  A2ComponentRegistration,
  A2CustomComponents,
  RegisterConflictStrategy
} from '@a2ui/vue-renderer';

export { A2ElementPlusPlugin as default } from './plugin';
