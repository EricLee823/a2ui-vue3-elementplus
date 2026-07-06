# Runtime Core 说明

`runtime-core` 必须保持 framework-independent。

不要 import：

- `vue`
- `element-plus`
- browser UI components
- DOM-only rendering APIs

runtime 负责：

- surface creation/deletion；
- component maps；
- data model updates；
- JSON Pointer helpers；
- action payload generation；
- runtime events/subscriptions。

优先使用按 component id 索引的 flat maps。不要在这里引入 deep reactive UI trees。
