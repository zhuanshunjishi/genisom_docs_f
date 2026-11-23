import { cp } from 'node:fs/promises'
import { join } from 'node:path'
import { defineConfig } from 'vitepress'
import { docsBase } from '../../.vitepress/docs-base.mjs'
import { docsNav } from '../../.vitepress/docs-nav.mjs'

const base = docsBase('l2')

export default defineConfig({
  lang: 'zh-CN',
  title: '智身钢镚 L2 SDK 开发文档',
  description: '智身钢镚 L2 系列的设备使用、SDK 开发和接口参考',
  base,
  async buildEnd({ srcDir, outDir }) {
    await cp(join(srcDir, 'assets', 'downloads'), join(outDir, 'assets', 'downloads'), {
      recursive: true,
    })
  },
  themeConfig: {
    nav: docsNav('l2'),
    sidebar: [
      {
        text: '产品与设备',
        items: [
          { text: '产品介绍与规格', link: '/md/01-product-introduction-and-specifications' },
          { text: '配件与设备组成', link: '/md/02-accessories' },
          { text: '硬件接口与系统架构', link: '/md/03-hardware-interfaces-and-system-architecture' },
          { text: '设备操作、遥控器与 App', link: '/md/04-device-controller-and-app-guide' },
          { text: '智航 Pro 软件使用', link: '/md/05-roamerx-pro-guide' },
        ],
      },
      {
        text: 'SDK 开发',
        items: [
          { text: '快速开始', link: '/md/06-sdk-quickstart' },
          { text: '控制权、任务与外设控制', link: '/md/09-control-ownership-tasks-and-peripherals' },
          {
            text: '接口参考',
            link: '/md/07-sdk-api-reference',
            collapsed: false,
            items: [
              { text: '连接与设备信息', link: '/md/07-01-connection-and-device-info' },
              { text: '机器人控制', link: '/md/07-02-robot-control' },
              { text: '数据上报', link: '/md/07-03-data-reporting' },
              { text: '充电桩与任务', link: '/md/07-04-dock-and-tasks' },
              { text: '外设与相机', link: '/md/07-05-peripherals-and-camera' },
            ],
          },
          {
            text: '数据读取',
            collapsed: false,
            items: [
              { text: '相机节点与 Topic 配置', link: '/md/camera-topic-configuration' },
            ],
          },
          { text: '回调、数据类型与状态', link: '/md/08-callbacks-data-types-and-status-reference' },
          { text: '示例程序与故障排查', link: '/md/10-examples-and-troubleshooting' },
        ],
      },
    ],
    outline: { label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    sidebarMenuLabel: '文档目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
  },
})
