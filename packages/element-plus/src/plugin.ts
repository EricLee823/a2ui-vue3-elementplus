import type { App } from 'vue';
import { createComponentRegistry } from '@a2ui-vue3-elementplus/vue-renderer';
import type { A2CustomComponents, RegisterConflictStrategy } from '@a2ui-vue3-elementplus/vue-renderer';
import A2RealtimeRenderer from './A2RealtimeRenderer.vue';
import A2Surface from './A2Surface.vue';
import { createElementPlusCatalog } from './registerElementPlusCatalog';
import { A2_REGISTRY_KEY } from './contextKeys';

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
      app.provide(A2_REGISTRY_KEY, registry);
      app.component('A2Surface', A2Surface);
      app.component('A2RealtimeRenderer', A2RealtimeRenderer);
    }
  };
}

export const A2ElementPlusPlugin = createA2ElementPlusPlugin();
