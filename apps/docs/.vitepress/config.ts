import { defineConfig } from 'vitepress';

const enGuide = [
  { text: 'Quick Start', link: '/guide/quick-start' },
  { text: 'Architecture', link: '/guide/architecture' },
  { text: 'Realtime Messages', link: '/guide/realtime-messages' },
  { text: 'Data Examples', link: '/guide/data-examples' },
  { text: 'Custom Components', link: '/guide/custom-components' },
  { text: 'Project Rules', link: '/guide/project-rules' }
];

const zhGuide = [
  { text: '快速开始', link: '/zh/guide/quick-start' },
  { text: '架构设计', link: '/zh/guide/architecture' },
  { text: '实时消息', link: '/zh/guide/realtime-messages' },
  { text: '数据示例', link: '/zh/guide/data-examples' },
  { text: '自定义组件', link: '/zh/guide/custom-components' },
  { text: '项目规则', link: '/zh/guide/project-rules' }
];

export default defineConfig({
  lang: 'en-US',
  title: 'A2UI Vue3 Element Plus',
  description: 'Render A2UI v0.9 realtime messages in Vue 3 applications using Element Plus.',

  locales: {
    root: {
      label: 'English',
      lang: 'en-US'
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'A2UI Vue3 Element Plus',
      description: '在 Vue 3 应用中使用 Element Plus 渲染 A2UI v0.9 实时消息。',
      themeConfig: {
        nav: [
          { text: '指南', items: zhGuide },
          { text: 'API', link: '/zh/api/' }
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '指南',
              items: zhGuide
            }
          ],
          '/zh/api/': [
            {
              text: 'API',
              items: [{ text: 'API 参考', link: '/zh/api/' }]
            }
          ]
        },
        outline: {
          label: '本页目录'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部'
      }
    }
  },

  themeConfig: {
    nav: [
      { text: 'Guide', items: enGuide },
      { text: 'API', link: '/api/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: enGuide
        }
      ],
      '/api/': [
        {
          text: 'API',
          items: [{ text: 'API Reference', link: '/api/' }]
        }
      ]
    },
    outline: {
      label: 'On this page'
    },
    search: {
      provider: 'local'
    }
  }
});
