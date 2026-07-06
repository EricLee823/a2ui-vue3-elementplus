# 实时消息

A2UI 与传输层无关。你可以使用 SSE、WebSocket、fetch streaming 或任何已有 realtime client，然后把每条完整 JSON 或 JSONL message 传给 `pushMessage`。

## SSE

```ts
import { useA2UI } from '@a2ui-vue3-elementplus/element-plus';

const { pushMessage } = useA2UI();
const source = new EventSource('/api/a2ui');

source.addEventListener('message', (event) => {
  pushMessage(event.data);
});
```

## WebSocket

```ts
const socket = new WebSocket('wss://example.com/a2ui');

socket.addEventListener('message', (event) => {
  if (typeof event.data === 'string') {
    pushMessage(event.data);
  }
});
```

## 消息形状

```json
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"}}
```

`fixtures/jsonl` 中的 fixtures 提供可用于 docs、tests 和 playgrounds 的端到端示例。
