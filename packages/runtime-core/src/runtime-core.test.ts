import { describe, expect, it, vi } from 'vitest';
import { createA2Runtime, createSurfaceStore, getByJsonPointer, removeByJsonPointer, setByJsonPointer } from './index';

describe('@a2ui/runtime-core', () => {
  it('manages multiple surfaces with root as the default root id', () => {
    const store = createSurfaceStore();

    const first = store.createSurface({
      surfaceId: 'one',
      components: [{ id: 'root', type: 'Form' }],
      dataModel: { user: { name: 'Ada' } }
    });
    const second = store.createSurface({ surfaceId: 'two' });

    expect(first.rootId).toBe('root');
    expect(second.rootId).toBe('root');
    expect(store.listSurfaces()).toHaveLength(2);
  });

  it('supports JSON Pointer get set and remove', () => {
    const initial = { user: { roles: ['reader'] } };
    const updated = setByJsonPointer(initial, '/user/roles/1', 'admin');

    expect(getByJsonPointer(updated, '/user/roles/1')).toBe('admin');
    expect(removeByJsonPointer(updated, '/user/roles/0')).toEqual({ user: { roles: ['admin'] } });
    expect(initial).toEqual({ user: { roles: ['reader'] } });
  });

  it('applies messages and emits subscriptions', () => {
    const runtime = createA2Runtime({ now: () => 42 });
    const onDataModelUpdated = vi.fn();
    const onAction = vi.fn();

    runtime.subscribe('dataModelUpdated', onDataModelUpdated);
    runtime.subscribe('action', onAction);

    runtime.applyMessage({ type: 'createSurface', payload: { surfaceId: 'main', dataModel: {} } });
    runtime.applyMessage({ type: 'updateDataModel', payload: { surfaceId: 'main', path: '/count', value: 1 } });
    const action = runtime.emitAction({ surfaceId: 'main', componentId: 'save', name: 'click', context: { ok: true } });

    expect(runtime.store.getDataModelValue('main', '/count')).toBe(1);
    expect(onDataModelUpdated).toHaveBeenCalledTimes(1);
    expect(action).toEqual({
      type: 'event',
      version: 'v0.9',
      surfaceId: 'main',
      componentId: 'save',
      name: 'click',
      context: { ok: true },
      dataModel: undefined,
      timestamp: '1970-01-01T00:00:00.042Z'
    });
    expect(onAction).toHaveBeenCalledWith(action);
  });
});
