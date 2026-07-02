# 项目规则

项目规则用于保证包易接入、边界清晰、可持续演进。

## 核心规则

- 主包只消费实时消息文本，不负责建立 SSE 或 WebSocket。
- runtime 包不依赖 Vue 或 Element Plus。
- Vue renderer 不依赖具体 UI 组件库。
- Element Plus 行为只放在 `@a2ui/element-plus`。
- 自定义组件注入是公共 API。
- 标准示例使用 A2UI v0.9 的 `createSurface`、`updateComponents`、`updateDataModel`、`deleteSurface`。
- 数据绑定示例使用 JSON Pointer。
- 公共 API 变化必须同步文档和示例。
- Codex 默认优先使用中文回答，除非用户明确要求其他语言。

## 可进化规则系统

规则放在三个位置：

```txt
AGENTS.md
  Codex 指令文件。根目录和子目录文件定义持久 agent 规则。

PROJECT_RULES.md
  面向人类贡献者的项目规则。

.codex/rules/*.rules
  Codex 命令执行策略规则，仅在项目 .codex 层被信任时加载。
```

不要把 `.agent/` 或 `.agents/` 当成 Codex 指令目录，除非用户显式配置了 fallback 文件名。

规则生命周期：

```txt
proposed -> trial -> adopted -> revised -> deprecated
```
