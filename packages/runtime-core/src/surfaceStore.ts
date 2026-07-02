import { getByJsonPointer, removeByJsonPointer, setByJsonPointer } from './jsonPointer';
import type {
  A2Component,
  ComponentInput,
  CreateSurfacePayload,
  JsonValue,
  SurfaceSnapshot,
  UpdateComponentsPayload,
  UpdateDataModelPayload,
  DeleteSurfacePayload
} from './types';

export interface SurfaceStore {
  createSurface(payload?: CreateSurfacePayload): SurfaceSnapshot;
  updateComponents(payload: UpdateComponentsPayload): SurfaceSnapshot;
  updateDataModel(payload: UpdateDataModelPayload): SurfaceSnapshot;
  deleteSurface(payload?: DeleteSurfacePayload | string): boolean;
  getSurface(surfaceId: string): SurfaceSnapshot | undefined;
  listSurfaces(): SurfaceSnapshot[];
  getDataModelValue(surfaceId: string, path: string): JsonValue | undefined;
  removeDataModelValue(surfaceId: string, path: string): SurfaceSnapshot;
  reset(): void;
}

interface SurfaceRecord {
  id: string;
  rootId: string;
  catalogId?: string;
  sendDataModel?: boolean;
  components: Map<string, A2Component>;
  dataModel: JsonValue;
}

const defaultSurfaceId = 'main';
const defaultRootId = 'root';

function normalizeComponents(input: ComponentInput | undefined): Map<string, A2Component> {
  const components = new Map<string, A2Component>();
  if (!input) return components;

  const values = Array.isArray(input) ? input : Object.values(input);
  values.forEach((component) => {
    components.set(component.id, { ...component });
  });
  return components;
}

function snapshot(surface: SurfaceRecord): SurfaceSnapshot {
  return {
    id: surface.id,
    surfaceId: surface.id,
    rootId: surface.rootId,
    catalogId: surface.catalogId,
    sendDataModel: surface.sendDataModel,
    components: Object.fromEntries(Array.from(surface.components.entries()).map(([id, component]) => [id, { ...component }])),
    dataModel: surface.dataModel
  };
}

function surfaceIdFrom(payload?: { surfaceId?: string; id?: string }): string {
  return payload?.surfaceId ?? payload?.id ?? defaultSurfaceId;
}

function normalizeDataPath(path?: string): string {
  return !path || path === '/' ? '' : path;
}

export function createSurfaceStore(): SurfaceStore {
  const surfaces = new Map<string, SurfaceRecord>();

  function requireSurface(surfaceId: string): SurfaceRecord {
    const surface = surfaces.get(surfaceId);
    if (!surface) throw new Error(`Surface not found: ${surfaceId}`);
    return surface;
  }

  return {
    createSurface(payload = {}) {
      const id = surfaceIdFrom(payload);
      const surface: SurfaceRecord = {
        id,
        rootId: payload.rootId ?? defaultRootId,
        catalogId: payload.catalogId,
        sendDataModel: payload.sendDataModel,
        components: normalizeComponents(payload.components),
        dataModel: payload.dataModel ?? {}
      };
      surfaces.set(id, surface);
      return snapshot(surface);
    },

    updateComponents(payload) {
      const surface = requireSurface(surfaceIdFrom(payload));
      const nextComponents = normalizeComponents(payload.components);
      if (payload.replace) {
        surface.components = nextComponents;
      } else {
        nextComponents.forEach((component, id) => surface.components.set(id, component));
      }
      return snapshot(surface);
    },

    updateDataModel(payload) {
      const surface = requireSurface(surfaceIdFrom(payload));
      surface.dataModel = setByJsonPointer(surface.dataModel, normalizeDataPath(payload.path), payload.value);
      return snapshot(surface);
    },

    deleteSurface(payload) {
      const surfaceId = surfaceIdFrom(typeof payload === 'string' ? { surfaceId: payload } : payload);
      return surfaces.delete(surfaceId);
    },

    getSurface(surfaceId) {
      const surface = surfaces.get(surfaceId);
      return surface ? snapshot(surface) : undefined;
    },

    listSurfaces() {
      return Array.from(surfaces.values()).map(snapshot);
    },

    getDataModelValue(surfaceId, path) {
      return getByJsonPointer(requireSurface(surfaceId).dataModel, normalizeDataPath(path));
    },

    removeDataModelValue(surfaceId, path) {
      const surface = requireSurface(surfaceId);
      surface.dataModel = removeByJsonPointer(surface.dataModel, normalizeDataPath(path));
      return snapshot(surface);
    },

    reset() {
      surfaces.clear();
    }
  };
}
