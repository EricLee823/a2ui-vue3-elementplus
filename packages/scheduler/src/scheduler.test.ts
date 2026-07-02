import { describe, expect, it, vi } from 'vitest';
import { createScheduler } from './index';

describe('@a2ui/scheduler', () => {
  it('queues and flushes messages through the dispatcher', async () => {
    const dispatch = vi.fn((message) => message.type);
    const scheduler = createScheduler({ dispatch });

    scheduler.enqueue({ type: 'createSurface', payload: { surfaceId: 'main' } });
    scheduler.enqueue({ type: 'updateComponents', payload: { surfaceId: 'main', components: [] } });

    await expect(scheduler.flush()).resolves.toEqual(['createSurface', 'updateComponents']);
    expect(scheduler.size()).toBe(0);
  });

  it('pauses and resumes flushing', async () => {
    const dispatch = vi.fn();
    const scheduler = createScheduler({ dispatch });

    scheduler.enqueue({ type: 'createSurface', payload: { surfaceId: 'main' } });
    scheduler.pause();

    await expect(scheduler.flush()).resolves.toEqual([]);
    expect(scheduler.size()).toBe(1);

    await scheduler.resume({ flush: true });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(scheduler.isPaused()).toBe(false);
  });

  it('merges updateDataModel messages with the same surface and path', () => {
    const scheduler = createScheduler();

    scheduler.enqueue({ type: 'updateDataModel', payload: { surfaceId: 'main', path: '/name', value: 'A' } });
    scheduler.enqueue({ type: 'updateDataModel', payload: { surfaceId: 'main', path: '/name', value: 'B' } });
    scheduler.enqueue({ type: 'updateDataModel', payload: { surfaceId: 'main', path: '/age', value: 1 } });

    expect(scheduler.size()).toBe(2);
    expect(scheduler.peek()).toEqual([
      { type: 'updateDataModel', payload: { surfaceId: 'main', path: '/name', value: 'B' } },
      { type: 'updateDataModel', payload: { surfaceId: 'main', path: '/age', value: 1 } }
    ]);
  });
});
