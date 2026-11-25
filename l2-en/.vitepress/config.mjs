import { defineConfig } from 'vitepress'
import { englishConfig } from '../../.vitepress/english.mjs'
import chineseConfig from '../../l2/.vitepress/config.mjs'

export default defineConfig(englishConfig(
  chineseConfig,
  'l2',
  'User guides, SDK development, and API reference for the Genisom L2 series.',
  {
    '产品与设备': 'Product and Operation',
    '产品介绍与规格': 'Product Introduction and Specifications',
    '配件与设备组成': 'Accessories and Components',
    '首次使用': 'First Use',
    '硬件接口与系统架构': 'Hardware Interfaces and System Architecture',
    'L2 设备操作与安全使用': 'Operation and Safety',
    'L2 日常维护、存放与故障排查': 'Maintenance, Storage, and Troubleshooting',
    '智航 Pro 软件使用': 'RoamerX Pro User Guide',
    'SDK 开发': 'SDK Development',
    '快速开始': 'Quickstart',
    '控制权、任务与外设控制': 'Control Ownership, Tasks, and Peripheral Control',
    '接口参考': 'API Reference',
    '连接与设备信息': 'Connection and Device Information',
    '机器人控制': 'Robot Control',
    '数据上报': 'Data Reporting',
    '充电桩与任务': 'Charging Dock and Tasks',
    '外设与相机': 'Peripherals and Cameras',
    '数据读取': 'Data Access',
    '相机节点与 Topic 配置': 'Camera Nodes and Topic Configuration',
    '回调、数据类型与状态': 'Callbacks, Data Types, and Status',
    '示例程序与故障排查': 'Examples and Troubleshooting',
  },
))
