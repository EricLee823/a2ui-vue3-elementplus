import { hasInjectionContext, inject, provide } from 'vue';
import type { A2ComponentRegistry } from '../registry/types';

export const A2_RUNTIME_KEY = 'a2uiRuntime';
export const A2_REGISTRY_KEY = 'a2uiRegistry';

export function provideA2UIContext(options: { runtime: any; registry: A2ComponentRegistry }): void {
  if (!hasInjectionContext()) {
    return;
  }

  provide(A2_RUNTIME_KEY, options.runtime);
  provide(A2_REGISTRY_KEY, options.registry);
}

export function injectA2Runtime(): any | undefined {
  if (!hasInjectionContext()) {
    return undefined;
  }

  return inject<any>(A2_RUNTIME_KEY, undefined);
}

export function injectA2Registry(): A2ComponentRegistry | undefined {
  if (!hasInjectionContext()) {
    return undefined;
  }

  return inject<A2ComponentRegistry | undefined>(A2_REGISTRY_KEY, undefined);
}
