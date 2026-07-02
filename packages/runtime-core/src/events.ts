import type { RuntimeEventHandler, RuntimeEventName } from './types';

export interface EventBus {
  subscribe<T = unknown>(event: RuntimeEventName, handler: RuntimeEventHandler<T>): () => void;
  emit<T = unknown>(event: RuntimeEventName, payload: T): void;
}

export function createEventBus(): EventBus {
  const handlers = new Map<RuntimeEventName, Set<RuntimeEventHandler>>();

  return {
    subscribe(event, handler) {
      const eventHandlers = handlers.get(event) ?? new Set<RuntimeEventHandler>();
      eventHandlers.add(handler as RuntimeEventHandler);
      handlers.set(event, eventHandlers);

      return () => {
        eventHandlers.delete(handler as RuntimeEventHandler);
        if (eventHandlers.size === 0) handlers.delete(event);
      };
    },
    emit(event, payload) {
      handlers.get(event)?.forEach((handler) => handler(payload));
    }
  };
}
