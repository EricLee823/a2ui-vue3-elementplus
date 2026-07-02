# Runtime Core Instructions

`runtime-core` must remain framework-independent.

Do not import:

- `vue`
- `element-plus`
- browser UI components
- DOM-only rendering APIs

The runtime owns:

- surface creation/deletion,
- component maps,
- data model updates,
- JSON Pointer helpers,
- action payload generation,
- runtime events/subscriptions.

Prefer flat maps keyed by component id. Do not introduce deep reactive UI trees here.
