import type { App } from 'vue';
import { A2RealtimeRenderer, A2Surface, createComponentRegistry } from '@a2ui/vue-renderer';
import type { A2CustomComponents, RegisterConflictStrategy } from '@a2ui/vue-renderer';
import { createElementPlusCatalog } from './registerElementPlusCatalog';

export interface A2ElementPlusPluginOptions {
  components?: A2CustomComponents;
  conflict?: RegisterConflictStrategy;
}

export function createA2ElementPlusPlugin(options: A2ElementPlusPluginOptions = {}) {
  const registry = createComponentRegistry(createElementPlusCatalog());
  if (options.components) {
    registry.registerMany(options.components, options.conflict ?? 'override');
  }

  return {
    install(app: App) {
      app.provide('a2uiRegistry', registry);
      app.component('A2Surface', A2Surface);
      app.component('A2RealtimeRenderer', A2RealtimeRenderer);
    }
  };
}

export const A2ElementPlusPlugin = createA2ElementPlusPlugin();
