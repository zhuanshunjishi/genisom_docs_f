import { defineConfig } from 'vitepress'
import { englishConfig } from '../../.vitepress/english.mjs'
import chineseConfig from '../../l1/.vitepress/config.mjs'

export default defineConfig(englishConfig(
  chineseConfig,
  'l1',
  'User guides, SDK development, and interface reference for the Genisom L1 series.',
  {
    '产品与配件': 'Products and accessories',
    '产品规格对比': 'Product specifications',
    '配件列表': 'Accessories',
    '上手与操作': 'Getting started',
    '设备操作、遥控器与 App': 'Robot, controller, and app operation',
    'SDK 开发': 'SDK development',
    '硬件、软件与结构架构': 'System architecture',
    'SDK 开发与运行指南': 'SDK development guide',
    '官方示例使用说明': 'Official examples',
    '本体相机视频流': 'Onboard camera stream',
    '接口参考': 'Interface reference',
    '二次开发硬件接口': 'Hardware interfaces',
    'SDK 软件服务接口': 'SDK service interfaces',
    '控制指令': 'Control commands',
    '传感器实时上报': 'Real-time sensor data',
    '心跳检测': 'Heartbeat',
    'WiFi 热点配置': 'Wi-Fi hotspot configuration',
    '故障信息查询': 'Fault information',
  },
))
