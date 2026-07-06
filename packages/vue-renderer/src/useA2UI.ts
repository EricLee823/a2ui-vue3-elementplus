import { createA2Runtime } from '@a2ui-vue3-elementplus/runtime-core';
import { createChunkParser, parseJson, parseMessage } from '@a2ui-vue3-elementplus/message-parser';
import { injectA2Registry, provideA2UIContext } from './context/injectionKeys';
import { createComponentRegistry } from './registry/createComponentRegistry';
import type { A2ComponentRegistry, A2CustomComponents } from './registry/types';

export interface UseA2UIOptions {
  runtime?: any;
  components?: A2CustomComponents;
  registry?: A2ComponentRegistry;
  onAction?: (action: unknown) => void;
  onError?: (error: unknown) => void;
}

export interface A2UIInstance {
  runtime: any;
  registry: A2ComponentRegistry;
  pushMessage(text: string): void;
  pushJson(message: unknown): void;
  pushChunk(chunk: string): void;
}

export function useA2UI(options: UseA2UIOptions = {}): A2UIInstance {
  const runtime = options.runtime ?? createA2Runtime();
  const injectedRegistry = injectA2Registry();
  const registry = options.registry ?? injectedRegistry ?? createComponentRegistry(options.components);
  const chunkParser = createChunkParser();

  if ((options.registry || injectedRegistry) && options.components) {
    registry.registerMany(options.components);
  }

  provideA2UIContext({ runtime, registry });

  runtime.onAction?.((action: unknown) => options.onAction?.(action));
  runtime.onError?.((error: unknown) => options.onError?.(error));

  function applyParsed(result: any) {
    if (result?.ok === false) {
      options.onError?.(result.error);
      return;
    }
    runtime.applyMessage(result.value ?? result.message ?? result);
  }

  return {
    runtime,
    registry,
    pushMessage(text) {
      for (const result of parseMessage(text)) {
        applyParsed(result);
      }
    },
    pushJson(message) {
      applyParsed(parseJson(message));
    },
    pushChunk(chunk) {
      const results = chunkParser.push(chunk);
      for (const result of results) {
        applyParsed(result);
      }
    }
  };
}
