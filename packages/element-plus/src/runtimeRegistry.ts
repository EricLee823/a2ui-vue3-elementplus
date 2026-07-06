import type { A2ComponentRegistry } from '@a2ui-vue3-elementplus/vue-renderer';

const A2_ELEMENT_PLUS_REGISTRY_KEY = Symbol.for('a2ui.element-plus.registry');

function canStoreRegistry(runtime: unknown): runtime is object {
  return (typeof runtime === 'object' && runtime !== null) || typeof runtime === 'function';
}

export function setRuntimeElementPlusRegistry(runtime: unknown, registry: A2ComponentRegistry): void {
  if (!canStoreRegistry(runtime)) {
    return;
  }

  Object.defineProperty(runtime, A2_ELEMENT_PLUS_REGISTRY_KEY, {
    configurable: true,
    enumerable: false,
    value: registry,
    writable: true
  });
}

export function getRuntimeElementPlusRegistry(runtime: unknown): A2ComponentRegistry | undefined {
  if (!canStoreRegistry(runtime)) {
    return undefined;
  }

  return (runtime as Record<symbol, unknown>)[A2_ELEMENT_PLUS_REGISTRY_KEY] as A2ComponentRegistry | undefined;
}
