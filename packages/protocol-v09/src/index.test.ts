import { describe, expect, it } from 'vitest';
import {
  A2UI_PROTOCOL_V09,
  createSurface,
  deleteSurface,
  updateComponents,
  updateDataModel,
  type A2ComponentNode
} from './index';

describe('@a2ui/protocol-v09', () => {
  const root: A2ComponentNode = {
    id: 'root',
    component: 'Column',
    children: ['title']
  };

  it('creates a v0.9 createSurface message', () => {
    expect(
      createSurface({
        surfaceId: 'main',
        catalogId: 'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json',
        sendDataModel: true
      })
    ).toEqual({
      version: 'v0.9',
      createSurface: {
        surfaceId: 'main',
        catalogId: 'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json',
        sendDataModel: true
      }
    });
  });

  it('allows explicit v0.9 messages', () => {
    expect(deleteSurface({ surfaceId: 'main' }, A2UI_PROTOCOL_V09)).toEqual({
      version: 'v0.9',
      deleteSurface: { surfaceId: 'main' }
    });
  });

  it('creates component and data-model updates', () => {
    expect(updateComponents({ surfaceId: 'main', components: [root] })).toEqual({
      version: 'v0.9',
      updateComponents: { surfaceId: 'main', components: [root] }
    });
    expect(updateDataModel({ surfaceId: 'main', path: '/name', value: 'Ada' })).toEqual({
      version: 'v0.9',
      updateDataModel: { surfaceId: 'main', path: '/name', value: 'Ada' }
    });
  });
});
