import { markRaw } from 'vue';
import type {
  A2ComponentRegistration,
  A2ComponentRegistry,
  A2CustomComponent,
  A2CustomComponents,
  RegisterConflictStrategy
} from './types';

function isRegistration(value: A2CustomComponent): value is A2ComponentRegistration {
  return typeof value === 'object' && value !== null && 'component' in value;
}

function normalizeRegistration(type: string, input: A2CustomComponent): A2ComponentRegistration {
  if (isRegistration(input)) {
    return {
      ...input,
      type: input.type ?? type,
      component: markRaw(input.component)
    };
  }

  return {
    type,
    component: markRaw(input)
  };
}

export function createComponentRegistry(initial?: A2CustomComponents): A2ComponentRegistry {
  const components = new Map<string, A2ComponentRegistration>();

  const registry: A2ComponentRegistry = {
    register(item, strategy = 'override') {
      if (components.has(item.type)) {
        if (strategy === 'skip') {
          return;
        }
        if (strategy === 'error') {
          throw new Error(`A2UI component "${item.type}" has already been registered.`);
        }
      }

      components.set(item.type, {
        ...item,
        component: markRaw(item.component)
      });
    },

    registerMany(items, strategy = 'override') {
      if (Array.isArray(items)) {
        for (const item of items) {
          registry.register(item, strategy);
        }
        return;
      }

      for (const [type, item] of Object.entries(items)) {
        registry.register(normalizeRegistration(type, item), strategy);
      }
    },

    resolve(type) {
      return components.get(type);
    },

    has(type) {
      return components.has(type);
    },

    entries() {
      return Array.from(components.values());
    }
  };

  if (initial) {
    registry.registerMany(initial);
  }

  return registry;
}
