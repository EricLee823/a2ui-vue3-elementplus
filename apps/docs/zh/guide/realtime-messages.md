# 实时消息

A2UI 与传输层无关。你可以使用 SSE、WebSocket、fetch streaming 或已有实时客户端，然后把每条完整 JSON 消息传入 `pushMessage`。

## SSE

```ts
import { useA2UI } from '@a2ui/element-plus';

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

## 消息形态

```json
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"}}
```

完整示例见 `fixtures/jsonl`。
