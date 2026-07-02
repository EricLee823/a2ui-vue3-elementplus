import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'A2UI Vue3 Element Plus',
  description: 'Vue 3 and Element Plus renderer for A2UI v0.9 realtime messages.',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'API Reference', link: '/api/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Quick Start', link: '/guide/quick-start' },
          { text: 'Realtime Messages', link: '/guide/realtime-messages' },
          { text: 'Data Examples', link: '/guide/data-examples' },
          { text: 'Custom Components', link: '/guide/custom-components' },
        ],
      },
      {
        text: 'Reference',
        items: [{ text: 'API Reference', link: '/api/' }],
      },
    ],
    search: {
      provider: 'local',
    },
  },
});
