import { useA2UI as useBaseA2UI, type UseA2UIOptions } from '@a2ui/vue-renderer';
import { createElementPlusCatalog } from './registerElementPlusCatalog';

export function useA2UI(options: UseA2UIOptions = {}) {
  const components = {
    ...createElementPlusCatalog(),
    ...options.components
  };

  return useBaseA2UI({
    ...options,
    components
  });
}
