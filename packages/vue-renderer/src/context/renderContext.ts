import { computed, h, inject, provide, type InjectionKey, type Ref, type VNodeChild } from 'vue';
import A2Component from '../components/A2Component.vue';
import { createComponentRegistry } from '../registry/createComponentRegistry';
import type { A2ComponentContext, A2ComponentRegistry, A2CustomComponents } from '../registry/types';

export interface A2RenderContext {
  runtime: any;
  registry: A2ComponentRegistry;
  runtimeVersion?: Readonly<Ref<number>>;
  onAction?: (action: unknown) => void;
  onError?: (error: unknown) => void;
}

export const A2_RENDER_CONTEXT_KEY: InjectionKey<A2RenderContext> = Symbol('A2RenderContext');

export function provideA2RenderContext(ctx: A2RenderContext): void {
  provide(A2_RENDER_CONTEXT_KEY, ctx);
}

export function useA2RenderContext(): A2RenderContext {
  const ctx = inject(A2_RENDER_CONTEXT_KEY);
  if (!ctx) {
    throw new Error('A2 render context is not available.');
  }
  return ctx;
}

export function createRenderContext(options: {
  runtime: any;
  registry?: A2ComponentRegistry;
  components?: A2CustomComponents;
  runtimeVersion?: Readonly<Ref<number>>;
  onAction?: (action: unknown) => void;
  onError?: (error: unknown) => void;
}): A2RenderContext {
  const registry = options.registry ?? createComponentRegistry();
  if (options.components) {
    registry.registerMany(options.components);
  }

  return {
    runtime: options.runtime,
    registry,
    runtimeVersion: options.runtimeVersion,
    onAction: options.onAction,
    onError: options.onError
  };
}

export function createComponentContext(ctx: A2RenderContext, surfaceId: string, node: Record<string, unknown>): A2ComponentContext {
  const componentId = String(node.id ?? '');

  return {
    surfaceId,
    componentId,
    node,
    getValue(path) {
      if (!path) {
        return undefined;
      }
      return ctx.runtime?.getData?.(surfaceId, path);
    },
    setValue(path, value) {
      if (!path) {
        return;
      }
      ctx.runtime?.setData?.(surfaceId, path, value, {
        source: 'client',
        componentId
      });
    },
    resolveValue(input) {
      if (input && typeof input === 'object' && 'path' in (input as Record<string, unknown>)) {
        return ctx.runtime?.getData?.(surfaceId, String((input as Record<string, unknown>).path));
      }
      return input;
    },
    emitAction(name, context) {
      const payload = ctx.runtime?.createActionPayload?.({
        surfaceId,
        componentId,
        name,
        context
      }) ?? {
        type: 'event',
        version: 'v0.9',
        surfaceId,
        componentId,
        name,
        context
      };
      ctx.onAction?.(payload);
      ctx.runtime?.emit?.('action', payload);
    },
    renderChild(componentId) {
      if (!componentId) {
        return null;
      }
      return h(A2Component, {
        surfaceId,
        componentId,
        runtimeVersion: ctx.runtimeVersion?.value
      });
    },
    renderChildren(componentIds) {
      if (!componentIds) {
        return null;
      }

      if (Array.isArray(componentIds)) {
        return componentIds.map((id) =>
          h(A2Component, {
            key: id,
            surfaceId,
            componentId: id,
            runtimeVersion: ctx.runtimeVersion?.value
          })
        );
      }

      const path = componentIds.path;
      const templateId = componentIds.componentId;
      const items = path ? ctx.runtime?.getData?.(surfaceId, path) : undefined;
      if (!Array.isArray(items) || !templateId) {
        return null;
      }

      return items.map((_item, index) =>
        h(A2Component, {
          key: `${templateId}:${index}`,
          surfaceId,
          componentId: templateId,
          runtimeVersion: ctx.runtimeVersion?.value,
          scopePath: `${path}/${index}`
        })
      );
    }
  };
}

export function useRuntimeVersion(runtime: any) {
  return computed(() => runtime?.version?.value ?? runtime?.version ?? 0);
}
