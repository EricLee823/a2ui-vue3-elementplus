export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue | undefined };
export type JsonArray = JsonValue[];

export interface A2Component {
  id: string;
  type?: string;
  component?: string;
  child?: string;
  props?: Record<string, unknown>;
  children?: string[] | Record<string, unknown>;
  slots?: Record<string, string[]>;
  [key: string]: unknown;
}

export type ComponentInput = A2Component[] | Record<string, A2Component>;

export interface SurfaceSnapshot {
  id: string;
  surfaceId: string;
  rootId: string;
  catalogId?: string;
  sendDataModel?: boolean;
  components: Record<string, A2Component>;
  dataModel: JsonValue;
}

export interface CreateSurfacePayload {
  surfaceId?: string;
  id?: string;
  rootId?: string;
  catalogId?: string;
  sendDataModel?: boolean;
  components?: ComponentInput;
  dataModel?: JsonValue;
}

export interface UpdateComponentsPayload {
  surfaceId?: string;
  id?: string;
  components: ComponentInput;
  replace?: boolean;
}

export interface UpdateDataModelPayload {
  surfaceId?: string;
  id?: string;
  path?: string;
  value: JsonValue;
}

export interface DeleteSurfacePayload {
  surfaceId?: string;
  id?: string;
}

export type A2RuntimeMessage =
  | { version?: string; a2ui?: string; createSurface: CreateSurfacePayload }
  | { version?: string; a2ui?: string; updateComponents: UpdateComponentsPayload }
  | { version?: string; a2ui?: string; updateDataModel: UpdateDataModelPayload }
  | { version?: string; a2ui?: string; deleteSurface: DeleteSurfacePayload }
  | { type: 'createSurface'; payload?: CreateSurfacePayload }
  | { type: 'updateComponents'; payload: UpdateComponentsPayload }
  | { type: 'updateDataModel'; payload: UpdateDataModelPayload }
  | { type: 'deleteSurface'; payload?: DeleteSurfacePayload }
  | ({ type?: string; kind?: string; action?: string; payload?: unknown } & Record<string, unknown>);

export interface A2ActionPayload<TPayload = unknown> {
  type: 'event';
  version: string;
  surfaceId: string;
  componentId: string;
  name: string;
  context?: TPayload;
  dataModel?: JsonValue;
  timestamp: string;
}

export type RuntimeEventMap = {
  surfaceCreated: SurfaceSnapshot;
  componentsUpdated: SurfaceSnapshot;
  dataModelUpdated: { surfaceId: string; path: string; value: JsonValue; surface: SurfaceSnapshot };
  surfaceDeleted: { surfaceId: string };
  action: A2ActionPayload;
  messageApplied: { message: A2RuntimeMessage; result: unknown };
};

export type RuntimeEventName = keyof RuntimeEventMap | string;
export type RuntimeEventHandler<T = unknown> = (payload: T) => void;
