import type { App } from 'vue';
import A2RealtimeRenderer from './components/A2RealtimeRenderer.vue';
import A2Surface from './components/A2Surface.vue';
import { createComponentRegistry } from './registry/createComponentRegistry';
import type { A2CustomComponents, RegisterConflictStrategy } from './registry/types';

export interface A2UIVuePluginOptions {
  components?: A2CustomComponents;
  conflict?: RegisterConflictStrategy;
}

export function createA2UIVuePlugin(options: A2UIVuePluginOptions = {}) {
  const registry = createComponentRegistry();
  if (options.components) {
    registry.registerMany(options.components, options.conflict);
  }

  return {
    install(app: App) {
      app.provide('a2uiRegistry', registry);
      app.component('A2Surface', A2Surface);
      app.component('A2RealtimeRenderer', A2RealtimeRenderer);
    }
  };
}

export const A2UIVuePlugin = createA2UIVuePlugin();
