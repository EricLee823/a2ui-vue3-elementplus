import type { A2RuntimeMessage } from '@a2ui/runtime-core';

export type SchedulerStrategy = 'balanced' | 'fifo';
export type SchedulerDispatch = (message: A2RuntimeMessage) => unknown | Promise<unknown>;

export interface SchedulerOptions {
  strategy?: SchedulerStrategy;
  dispatch?: SchedulerDispatch;
}

export interface Scheduler {
  enqueue(message: A2RuntimeMessage): number;
  flush(): Promise<unknown[]>;
  pause(): void;
  resume(options?: { flush?: boolean }): Promise<unknown[]> | void;
  clear(): void;
  size(): number;
  isPaused(): boolean;
  peek(): A2RuntimeMessage[];
}
