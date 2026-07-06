# Packages 说明

这些规则适用于 `packages/` 下的每个 package。

## 边界

- 保持 package dependencies 方向明确、关系清楚。
- 不要从 app、example、fixture 或 docs code 中 import。
- Public APIs 必须从每个 package 的 `src/index.ts` 导出。
- 除非有明确 release 原因，否则保持 package versions 对齐。

## 包角色

```txt
protocol-v09
  仅包含 types 和 helpers。

message-parser
  仅负责 JSON、JSONL 和 chunk parsing。

runtime-core
  与框架无关的 state machine 和 JSON Pointer data updates。

scheduler
  Queueing、priority、batching 和 coalescing。

vue-renderer
  Vue renderer、render context 和 component registry。

element-plus
  Element Plus adapter 和 public facade。
```

## 验证

小变更运行 package-local tests。修改 public APIs 或 cross-package contracts 时，运行根目录 `pnpm test` 和 `pnpm build`。
