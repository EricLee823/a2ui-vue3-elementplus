import { createEventBus } from './events';
import { createSurfaceStore, type SurfaceStore } from './surfaceStore';
import type {
  A2ActionPayload,
  A2RuntimeMessage,
  CreateSurfacePayload,
  DeleteSurfacePayload,
  RuntimeEventHandler,
  RuntimeEventMap,
  RuntimeEventName,
  UpdateComponentsPayload,
  UpdateDataModelPayload
} from './types';

export interface A2Runtime {
  store: SurfaceStore;
  createSurface(payload?: CreateSurfacePayload): ReturnType<SurfaceStore['createSurface']>;
  updateComponents(payload: UpdateComponentsPayload): ReturnType<SurfaceStore['updateComponents']>;
  updateDataModel(payload: UpdateDataModelPayload): ReturnType<SurfaceStore['updateDataModel']>;
  deleteSurface(payload?: DeleteSurfacePayload | string): boolean;
  applyMessage(message: A2RuntimeMessage): unknown;
  getSurface(surfaceId?: string): ReturnType<SurfaceStore['getSurface']>;
  getComponent(surfaceId: string | undefined, componentId: string): Record<string, unknown> | undefined;
  getData(surfaceId: string | undefined, path: string): unknown;
  setData(surfaceId: string | undefined, path: string | undefined, value: unknown, meta?: Record<string, unknown>): unknown;
  reset(): void;
  createActionPayload<TPayload = unknown>(input: {
    surfaceId: string;
    componentId: string;
    action?: string;
    name?: string;
    payload?: TPayload;
    context?: TPayload;
  }): A2ActionPayload<TPayload>;
  emitAction<TPayload = unknown>(input: {
    surfaceId: string;
    componentId: string;
    action?: string;
    name?: string;
    payload?: TPayload;
    context?: TPayload;
  }): A2ActionPayload<TPayload>;
  onAction(handler: RuntimeEventHandler<RuntimeEventMap['action']>): () => void;
  onError(handler: RuntimeEventHandler<unknown>): () => void;
  subscribe(handler: RuntimeEventHandler<RuntimeEventMap['messageApplied']>): () => void;
  subscribe<K extends keyof RuntimeEventMap>(event: K, handler: RuntimeEventHandler<RuntimeEventMap[K]>): () => void;
  subscribe<T = unknown>(event: RuntimeEventName, handler: RuntimeEventHandler<T>): () => void;
  emit<T = unknown>(event: RuntimeEventName, payload: T): void;
}

function messageType(message: A2RuntimeMessage): string | undefined {
  if ('createSurface' in message) return 'createSurface';
  if ('updateComponents' in message) return 'updateComponents';
  if ('updateDataModel' in message) return 'updateDataModel';
  if ('deleteSurface' in message) return 'deleteSurface';
  return message.type ?? message.kind ?? message.action;
}

function payloadOf<T>(message: A2RuntimeMessage): T {
  if ('createSurface' in message) return message.createSurface as T;
  if ('updateComponents' in message) return message.updateComponents as T;
  if ('updateDataModel' in message) return message.updateDataModel as T;
  if ('deleteSurface' in message) return message.deleteSurface as T;
  return ((message.payload ?? message) as T);
}

function surfaceIdFrom(payload?: DeleteSurfacePayload | string): string {
  if (typeof payload === 'string') return payload;
  return payload?.surfaceId ?? payload?.id ?? 'main';
}

export function createA2Runtime(options: { store?: SurfaceStore; now?: () => number } = {}): A2Runtime {
  const store = options.store ?? createSurfaceStore();
  const events = createEventBus();
  const now = options.now ?? Date.now;

  const runtime: A2Runtime = {
    store,

    createSurface(payload) {
      const result = store.createSurface(payload);
      events.emit('surfaceCreated', result);
      return result;
    },

    updateComponents(payload) {
      const result = store.updateComponents(payload);
      events.emit('componentsUpdated', result);
      return result;
    },

    updateDataModel(payload) {
      const result = store.updateDataModel(payload);
      events.emit('dataModelUpdated', {
        surfaceId: payload.surfaceId ?? payload.id ?? 'default',
        path: payload.path,
        value: payload.value,
        surface: result
      });
      return result;
    },

    deleteSurface(payload) {
      const surfaceId = surfaceIdFrom(payload);
      const deleted = store.deleteSurface(surfaceId);
      if (deleted) events.emit('surfaceDeleted', { surfaceId });
      return deleted;
    },

    applyMessage(message) {
      try {
        const result = applyMessage(runtime, message);
        events.emit('messageApplied', { message, result });
        return result;
      } catch (error) {
        events.emit('error', error);
        throw error;
      }
    },

    getSurface(surfaceId = 'main') {
      return store.getSurface(surfaceId);
    },

    getComponent(surfaceId = 'main', componentId) {
      return store.getSurface(surfaceId)?.components[componentId];
    },

    getData(surfaceId = 'main', path) {
      return store.getDataModelValue(surfaceId, path);
    },

    setData(surfaceId = 'main', path, value) {
      if (!path) {
        return undefined;
      }
      const result = runtime.updateDataModel({
        surfaceId,
        path,
        value: value as any
      });
      return result.dataModel;
    },

    reset() {
      store.reset();
      events.emit('reset', undefined);
    },

    createActionPayload(input) {
      const surface = store.getSurface(input.surfaceId);
      const name = input.name ?? input.action ?? 'action';
      return {
        type: 'event',
        version: 'v0.9',
        surfaceId: input.surfaceId,
        componentId: input.componentId,
        name,
        context: input.context ?? input.payload,
        dataModel: surface?.sendDataModel ? surface.dataModel : undefined,
        timestamp: new Date(now()).toISOString()
      };
    },

    emitAction(input) {
      const payload = runtime.createActionPayload(input);
      events.emit('action', payload);
      return payload;
    },

    onAction(handler) {
      return events.subscribe('action', handler);
    },

    onError(handler) {
      return events.subscribe('error', handler);
    },

    subscribe(eventOrHandler: any, handler?: any) {
      if (typeof eventOrHandler === 'function') {
        const offMessage = events.subscribe('messageApplied', eventOrHandler);
        const offCreated = events.subscribe('surfaceCreated', eventOrHandler);
        const offComponents = events.subscribe('componentsUpdated', eventOrHandler);
        const offData = events.subscribe('dataModelUpdated', eventOrHandler);
        const offDeleted = events.subscribe('surfaceDeleted', eventOrHandler);
        const offReset = events.subscribe('reset', eventOrHandler);
        return () => {
          offMessage();
          offCreated();
          offComponents();
          offData();
          offDeleted();
          offReset();
        };
      }
      return events.subscribe(eventOrHandler, handler);
    },
    emit: events.emit
  };

  return runtime;
}

export function applyMessage(runtime: Pick<A2Runtime, 'createSurface' | 'updateComponents' | 'updateDataModel' | 'deleteSurface'>, message: A2RuntimeMessage): unknown {
  switch (messageType(message)) {
    case 'createSurface':
      return runtime.createSurface(payloadOf<CreateSurfacePayload>(message));
    case 'updateComponents':
      return runtime.updateComponents(payloadOf<UpdateComponentsPayload>(message));
    case 'updateDataModel':
      return runtime.updateDataModel(payloadOf<UpdateDataModelPayload>(message));
    case 'deleteSurface':
      return runtime.deleteSurface(payloadOf<DeleteSurfacePayload>(message));
    default:
      throw new Error(`Unsupported runtime message type: ${messageType(message) ?? 'unknown'}`);
  }
}
