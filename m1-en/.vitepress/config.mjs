import { defineConfig } from 'vitepress'
import { englishConfig } from '../../.vitepress/english.mjs'
import chineseConfig from '../../m1/.vitepress/config.mjs'

export default defineConfig(englishConfig(
  chineseConfig,
  'm1',
  'User guides, SDK development, and API reference for the Genisom M1 series.',
  {
    '产品与设备': 'Product and operation',
    '产品介绍与规格': 'Product introduction and specifications',
    '设备使用与维护': 'Operation and maintenance',
    '系统组成、硬件接口与结构设计资料': 'System components, hardware interfaces, and mechanical design',
    'SDK 开发': 'SDK development',
    'M1 系统与 SDK 版本兼容性': 'M1 system and SDK version compatibility',
    '快速开始': 'Quickstart',
    '控制流程与任务机制': 'Control flow and task handling',
    '接口参考': 'API reference',
    '连接与设备信息': 'Connection and device information',
    '机器人控制': 'Robot control',
    '数据上报': 'Data reporting',
    '充电桩与任务': 'Dock and tasks',
    '外设与相机': 'Peripherals and cameras',
    '数据读取': 'Data access',
    '视频流读取': 'Reading video streams',
    '传感器数据读取': 'Reading Sensor Data',
    '回调、数据类型与状态参考': 'Callbacks, data types, and status reference',
    '示例程序与故障排查': 'Examples and troubleshooting',
  },
))
