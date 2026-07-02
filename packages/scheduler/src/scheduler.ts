import type { A2RuntimeMessage } from '@a2ui/runtime-core';
import type { Scheduler, SchedulerDispatch, SchedulerOptions, SchedulerStrategy } from './types';

interface QueueItem {
  message: A2RuntimeMessage;
  sequence: number;
}

const defaultDispatch: SchedulerDispatch = () => undefined;

function messageType(message: A2RuntimeMessage): string | undefined {
  if ('createSurface' in message) return 'createSurface';
  if ('updateComponents' in message) return 'updateComponents';
  if ('updateDataModel' in message) return 'updateDataModel';
  if ('deleteSurface' in message) return 'deleteSurface';
  return message.type ?? message.kind ?? message.action;
}

function payloadOf(message: A2RuntimeMessage): Record<string, unknown> {
  if ('createSurface' in message) return message.createSurface as Record<string, unknown>;
  if ('updateComponents' in message) return message.updateComponents as Record<string, unknown>;
  if ('updateDataModel' in message) return message.updateDataModel as Record<string, unknown>;
  if ('deleteSurface' in message) return message.deleteSurface as Record<string, unknown>;
  return ((message.payload ?? message) as Record<string, unknown>);
}

function updateDataModelMergeKey(message: A2RuntimeMessage): string | undefined {
  if (messageType(message) !== 'updateDataModel') return undefined;
  const payload = payloadOf(message);
  const surfaceId = String(payload.surfaceId ?? payload.id ?? 'main');
  const path = String(payload.path ?? '');
  return `${surfaceId}\u0000${path}`;
}

function sortQueue(queue: QueueItem[], strategy: SchedulerStrategy): QueueItem[] {
  if (strategy === 'fifo') return [...queue].sort((a, b) => a.sequence - b.sequence);

  const priority = (message: A2RuntimeMessage): number => {
    switch (messageType(message)) {
      case 'deleteSurface':
        return 0;
      case 'createSurface':
        return 1;
      case 'updateComponents':
        return 2;
      case 'updateDataModel':
        return 3;
      default:
        return 4;
    }
  };

  return [...queue].sort((a, b) => priority(a.message) - priority(b.message) || a.sequence - b.sequence);
}

export function createScheduler(options: SchedulerOptions = {}): Scheduler {
  const strategy = options.strategy ?? 'balanced';
  const dispatch = options.dispatch ?? defaultDispatch;
  const queue: QueueItem[] = [];
  const dataModelIndexes = new Map<string, number>();
  let sequence = 0;
  let paused = false;

  function rebuildMergeIndex(): void {
    dataModelIndexes.clear();
    queue.forEach((item, index) => {
      const key = updateDataModelMergeKey(item.message);
      if (key) dataModelIndexes.set(key, index);
    });
  }

  async function flush(): Promise<unknown[]> {
    if (paused || queue.length === 0) return [];

    const batch = sortQueue(queue.splice(0), strategy);
    dataModelIndexes.clear();
    const results: unknown[] = [];
    for (const item of batch) {
      results.push(await dispatch(item.message));
    }
    return results;
  }

  return {
    enqueue(message) {
      const mergeKey = updateDataModelMergeKey(message);
      if (mergeKey) {
        const existingIndex = dataModelIndexes.get(mergeKey);
        if (existingIndex !== undefined) {
          queue[existingIndex] = { ...queue[existingIndex], message };
          return queue.length;
        }
      }

      queue.push({ message, sequence: sequence++ });
      if (mergeKey) dataModelIndexes.set(mergeKey, queue.length - 1);
      return queue.length;
    },

    flush,

    pause() {
      paused = true;
    },

    resume(options = {}) {
      paused = false;
      if (options.flush) return flush();
      return undefined;
    },

    clear() {
      queue.splice(0);
      rebuildMergeIndex();
    },

    size() {
      return queue.length;
    },

    isPaused() {
      return paused;
    },

    peek() {
      return sortQueue(queue, strategy).map((item) => item.message);
    }
  };
}
