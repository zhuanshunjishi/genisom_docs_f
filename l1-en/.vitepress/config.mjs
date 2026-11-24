import { defineConfig } from 'vitepress'
import { englishConfig } from '../../.vitepress/english.mjs'
import chineseConfig from '../../l1/.vitepress/config.mjs'

export default defineConfig(englishConfig(
  chineseConfig,
  'l1',
  'User guides, SDK development, and interface reference for the Genisom L1 series.',
  {
    '产品与配件': 'Products and Accessories',
    '产品规格对比': 'Product Specifications',
    '配件列表': 'Accessories',
    '上手与操作': 'Getting Started',
    '设备操作、遥控器与 App': 'Robot, Controller, and App Operation',
    'SDK 开发': 'SDK Development',
    '硬件、软件与结构架构': 'System Architecture',
    'SDK 开发与运行指南': 'SDK Development Guide',
    '官方示例使用说明': 'Official Examples',
    '本体相机视频流': 'Onboard Camera Stream',
    '接口参考': 'Interface Reference',
    '二次开发硬件接口': 'Hardware Interfaces',
    'SDK 软件服务接口': 'SDK Service Interfaces',
    '控制指令': 'Control Commands',
    '传感器实时上报': 'Real-time Sensor Data',
    '心跳检测': 'Heartbeat',
    'WiFi 热点配置': 'Wi-Fi Hotspot Configuration',
    '故障信息查询': 'Fault Information',
  },
))
