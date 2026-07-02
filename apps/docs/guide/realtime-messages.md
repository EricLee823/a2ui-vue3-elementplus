# Realtime Messages

A2UI is transport independent. Use SSE, WebSocket, fetch streaming, or any existing realtime client, then pass each complete JSON or JSONL message into `pushMessage`.

## Server-sent events

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

## Message shape

```json
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"}}
```

Fixtures in `fixtures/jsonl` provide end-to-end samples for docs, tests, and playgrounds.
