import { defineConfig } from 'vitepress'
import { englishConfig } from '../../.vitepress/english.mjs'
import chineseConfig from '../../m1/.vitepress/config.mjs'

export default defineConfig(englishConfig(
  chineseConfig,
  'm1',
  'User guides, SDK development, and API reference for the Genisom M1 series.',
  {
    '产品与设备': 'Product and Operation',
    '产品介绍与规格': 'Product Introduction and Specifications',
    '设备使用与维护': 'Operation and Maintenance',
    '系统组成、硬件接口与结构设计资料': 'System Components, Hardware Interfaces, and Mechanical Design',
    'SDK 开发': 'SDK Development',
    'M1 系统与 SDK 版本兼容性': 'Genisom M1 System and SDK Version Compatibility',
    '快速开始': 'Quickstart',
    'M1 SDK 控制流程': 'Genisom M1 SDK Control Workflow',
    '接口参考': 'API Reference',
    '连接与设备信息': 'Connection and Device Information',
    '机器人控制': 'Robot Control',
    '数据上报': 'Data Reporting',
    '充电桩与任务': 'Dock and Tasks',
    '外设与相机': 'Peripherals and Cameras',
    '数据读取': 'Data Access',
    '视频流读取': 'Reading Video Streams',
    '传感器数据读取': 'Reading Sensor Data',
    '回调、数据类型与状态参考': 'Callbacks, Data Types, and Status Reference',
    '示例程序与故障排查': 'Examples and Troubleshooting',
  },
))
