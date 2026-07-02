import type { JsonValue } from './types';

const pointerTokenPattern = /~1|~0/g;

export function parseJsonPointer(path: string): string[] {
  if (path === '') return [];
  if (!path.startsWith('/')) {
    throw new Error(`JSON Pointer must be empty or start with "/": ${path}`);
  }

  return path
    .slice(1)
    .split('/')
    .map((token) => token.replace(pointerTokenPattern, (match) => (match === '~1' ? '/' : '~')));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneJson<T extends JsonValue>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => cloneJson(item)) as T;
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneJson(item as JsonValue)])) as T;
  }
  return value;
}

function createContainer(nextToken: string | undefined): JsonValue {
  return nextToken !== undefined && /^\d+$/.test(nextToken) ? [] : {};
}

export function getByJsonPointer(root: JsonValue, path: string): JsonValue | undefined {
  let current: unknown = root;
  for (const token of parseJsonPointer(path)) {
    if (Array.isArray(current)) {
      const index = Number(token);
      current = Number.isInteger(index) ? current[index] : undefined;
    } else if (isRecord(current)) {
      current = current[token];
    } else {
      return undefined;
    }
  }
  return current as JsonValue | undefined;
}

export function setByJsonPointer(root: JsonValue, path: string, value: JsonValue): JsonValue {
  const tokens = parseJsonPointer(path);
  if (tokens.length === 0) return cloneJson(value);

  const nextRoot = cloneJson(root);
  let current: JsonValue = nextRoot;

  tokens.forEach((token, index) => {
    const isLast = index === tokens.length - 1;
    if (Array.isArray(current)) {
      const arrayIndex = token === '-' ? current.length : Number(token);
      if (!Number.isInteger(arrayIndex) || arrayIndex < 0) {
        throw new Error(`Invalid array index in JSON Pointer: ${token}`);
      }
      if (isLast) {
        current[arrayIndex] = cloneJson(value);
        return;
      }
      if (current[arrayIndex] === undefined || current[arrayIndex] === null) {
        current[arrayIndex] = createContainer(tokens[index + 1]);
      }
      current = current[arrayIndex] as JsonValue;
      return;
    }

    if (!isRecord(current)) {
      throw new Error(`Cannot set JSON Pointer through non-object value at "${token}"`);
    }

    if (isLast) {
      current[token] = cloneJson(value);
      return;
    }
    if (current[token] === undefined || current[token] === null) {
      current[token] = createContainer(tokens[index + 1]);
    }
    current = current[token] as JsonValue;
  });

  return nextRoot;
}

export function removeByJsonPointer(root: JsonValue, path: string): JsonValue {
  const tokens = parseJsonPointer(path);
  if (tokens.length === 0) return {};

  const nextRoot = cloneJson(root);
  let current: JsonValue = nextRoot;

  for (let index = 0; index < tokens.length - 1; index += 1) {
    const token = tokens[index];
    if (Array.isArray(current)) {
      current = current[Number(token)] as JsonValue;
    } else if (isRecord(current)) {
      current = current[token] as JsonValue;
    } else {
      return nextRoot;
    }
  }

  const lastToken = tokens[tokens.length - 1];
  if (Array.isArray(current)) {
    const arrayIndex = Number(lastToken);
    if (Number.isInteger(arrayIndex)) current.splice(arrayIndex, 1);
  } else if (isRecord(current)) {
    delete current[lastToken];
  }

  return nextRoot;
}
