import type { Component, VNodeChild } from 'vue';

export type RegisterConflictStrategy = 'override' | 'skip' | 'error';

export interface A2ComponentContext {
  surfaceId: string;
  componentId: string;
  node: Record<string, unknown>;
  getValue(path?: string): unknown;
  setValue(path: string | undefined, value: unknown): void;
  resolveValue(input: unknown): unknown;
  emitAction(name: string, context?: Record<string, unknown>): void;
  renderChild(componentId?: string): VNodeChild;
  renderChildren(componentIds?: string[] | { path?: string; componentId?: string }): VNodeChild;
}

export interface A2ComponentRegistration {
  type: string;
  component: Component;
  propsMapper?: (node: Record<string, unknown>, ctx: A2ComponentContext) => Record<string, unknown>;
  eventsMapper?: (node: Record<string, unknown>, ctx: A2ComponentContext) => Record<string, Function>;
  dependencies?: (node: Record<string, unknown>) => Array<string | undefined>;
}

export type A2CustomComponent =
  | Component
  | Omit<A2ComponentRegistration, 'type'>
  | A2ComponentRegistration;

export type A2CustomComponents = Record<string, A2CustomComponent>;

export interface A2ComponentRegistry {
  register(item: A2ComponentRegistration, strategy?: RegisterConflictStrategy): void;
  registerMany(items: A2CustomComponents | A2ComponentRegistration[], strategy?: RegisterConflictStrategy): void;
  resolve(type: string): A2ComponentRegistration | undefined;
  has(type: string): boolean;
  entries(): A2ComponentRegistration[];
}
