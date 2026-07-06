import { hasInjectionContext, inject, provide } from 'vue';
import {
  createComponentRegistry,
  useA2UI as useBaseA2UI,
  type A2ComponentRegistry,
  type UseA2UIOptions
} from '@a2ui-vue3-elementplus/vue-renderer';
import { createElementPlusCatalog } from './registerElementPlusCatalog';
import { setRuntimeElementPlusRegistry } from './runtimeRegistry';
import { A2_REGISTRY_KEY, A2_RUNTIME_KEY } from './contextKeys';

export function useA2UI(options: UseA2UIOptions = {}) {
  const injectedRegistry = hasInjectionContext()
    ? inject<A2ComponentRegistry | undefined>(A2_REGISTRY_KEY, undefined)
    : undefined;
  const registry = options.registry ?? injectedRegistry ?? createComponentRegistry();
  registry.registerMany(createElementPlusCatalog(), 'skip');
  if (options.components) {
    registry.registerMany(options.components);
  }

  const { components: _components, registry: _registry, ...baseOptions } = options;
  const instance = useBaseA2UI({
    ...baseOptions,
    registry
  });

  setRuntimeElementPlusRegistry(instance.runtime, instance.registry);
  if (hasInjectionContext()) {
    provide(A2_RUNTIME_KEY, instance.runtime);
    provide(A2_REGISTRY_KEY, instance.registry);
  }

  return instance;
}
