export const A2UI_PROTOCOL_V09 = 'v0.9' as const;
export const A2UI_PROTOCOL_V091 = 'v0.9.1' as const;

export type A2UIProtocolVersion = typeof A2UI_PROTOCOL_V09 | typeof A2UI_PROTOCOL_V091 | '0.9' | '0.9.1';

export type A2Primitive = string | number | boolean | null;
export type A2JsonValue = A2Primitive | A2JsonValue[] | { [key: string]: A2JsonValue };
export type A2Record = Record<string, A2JsonValue>;

export type A2ComponentId = string;
export type A2SurfaceId = string;
export type A2CatalogId = string;

export interface A2DataBinding {
  path: string;
}

export interface A2ActionEvent {
  name: string;
  context?: Record<string, unknown>;
}

export interface A2Action {
  event?: A2ActionEvent;
  [key: string]: unknown;
}

export type A2BasicComponentType =
  | 'Text'
  | 'Image'
  | 'Icon'
  | 'Video'
  | 'AudioPlayer'
  | 'Row'
  | 'Column'
  | 'List'
  | 'Card'
  | 'Tabs'
  | 'Divider'
  | 'Modal'
  | 'Button'
  | 'CheckBox'
  | 'TextField'
  | 'DateTimeInput'
  | 'ChoicePicker'
  | 'Slider';

export type A2ComponentType = A2BasicComponentType | (string & {});

export interface A2ChildTemplate {
  path?: string;
  componentId?: string;
  [key: string]: unknown;
}

export interface A2ComponentNode {
  id: A2ComponentId;
  component: A2ComponentType;
  child?: A2ComponentId;
  children?: A2ComponentId[] | A2ChildTemplate;
  action?: A2Action;
  [key: string]: unknown;
}

export interface A2CreateSurfacePayload {
  surfaceId: A2SurfaceId;
  catalogId?: A2CatalogId;
  theme?: Record<string, unknown>;
  sendDataModel?: boolean;
  rootId?: A2ComponentId;
}

export interface A2UpdateComponentsPayload {
  surfaceId: A2SurfaceId;
  components: A2ComponentNode[];
  replace?: boolean;
}

export interface A2UpdateDataModelPayload {
  surfaceId: A2SurfaceId;
  path?: string;
  value: unknown;
}

export interface A2DeleteSurfacePayload {
  surfaceId: A2SurfaceId;
}

export interface A2MessageBase {
  version?: A2UIProtocolVersion;
  a2ui?: A2UIProtocolVersion;
}

export interface CreateSurfaceMessage extends A2MessageBase {
  createSurface: A2CreateSurfacePayload;
}

export interface UpdateComponentsMessage extends A2MessageBase {
  updateComponents: A2UpdateComponentsPayload;
}

export interface UpdateDataModelMessage extends A2MessageBase {
  updateDataModel: A2UpdateDataModelPayload;
}

export interface DeleteSurfaceMessage extends A2MessageBase {
  deleteSurface: A2DeleteSurfacePayload;
}

export type A2UIMessage =
  | CreateSurfaceMessage
  | UpdateComponentsMessage
  | UpdateDataModelMessage
  | DeleteSurfaceMessage;

export function createSurface(payload: A2CreateSurfacePayload, version: A2UIProtocolVersion = A2UI_PROTOCOL_V09): CreateSurfaceMessage {
  return {
    version,
    createSurface: payload
  };
}

export function updateComponents(
  payload: A2UpdateComponentsPayload,
  version: A2UIProtocolVersion = A2UI_PROTOCOL_V09
): UpdateComponentsMessage {
  return {
    version,
    updateComponents: payload
  };
}

export function updateDataModel(
  payload: A2UpdateDataModelPayload,
  version: A2UIProtocolVersion = A2UI_PROTOCOL_V09
): UpdateDataModelMessage {
  return {
    version,
    updateDataModel: payload
  };
}

export function deleteSurface(payload: A2DeleteSurfacePayload, version: A2UIProtocolVersion = A2UI_PROTOCOL_V09): DeleteSurfaceMessage {
  return {
    version,
    deleteSurface: payload
  };
}
