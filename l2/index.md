# 智身钢镚 L2 SDK 开发文档

![智身钢镚 L2 系列机器人](./L2.jpg)

## 文档说明

本文档面向钢镚 L2 系列机器人的设备操作、应用开发和现场联调，覆盖 L2、L2-W、L2-W Ultra，以及 L2 智航 Pro 软件。

应用程序通过 `robot_sdk::SDKClient` 连接机器人、申请控制权、发送控制命令，并通过回调接收机器人状态、传感器数据、故障信息和任务状态。

## 文档目录

| 章节 | 主要内容 | 阅读建议 |
| --- | --- | --- |
| [1. L2 产品介绍与规格](./md/01-product-introduction-and-specifications.md) | 三个产品版本的足端形态、尺寸、运动能力、续航、感知、通信和扩展能力 | 选型或初次了解产品时阅读 |
| [2. L2 配件与设备组成](./md/02-accessories.md) | 机器人本体、电池、充电座、适配器、遥控器、UWB 信标和随箱附件 | 开箱验收或确认配件时阅读 |
| [3. L2 硬件接口与系统架构](./md/03-hardware-interfaces-and-system-architecture.md) | 上装安装范围、扩展仓位置、供电、千兆以太网、UART、SBUS、PPS、USB、SIM 卡槽和航插线序 | 接入网络或安装上装设备前阅读 |
| [4. L2 设备操作、遥控器与 App](./md/04-device-controller-and-app-guide.md) | 开关机、充电、遥控器按键、运动模式、急停、指示灯和日常维护 | 首次操作设备前阅读 |
| [5. L2 智航 Pro 软件使用](./md/05-roamerx-pro-guide.md) | 网络配置、建图、地图编辑、路网、巡航路径、任务执行、自主回充和巡航记录 | 配置建图、巡航与自主回充时阅读 |
| [6. L2 SDK 快速开始](./md/06-sdk-quickstart.md) | Ubuntu 环境、SDK 目录、网络与端口配置、编译、连接、运行示例和自建工程 | 第一次编译和运行 SDK 时阅读 |
| [7. L2 控制权、任务与外设控制](./md/09-control-ownership-tasks-and-peripherals.md) | 控制权切换、回充与离桩任务、机器状态、外设供电和 LED 控制 | 编写控制、回充或外设程序前阅读 |
| [8. L2 SDK 接口参考](./md/07-sdk-api-reference.md) | 接口能力表、通用参数与返回值，以及连接、机器人控制、数据上报、充电桩和外设接口 | 编码时按功能查询 |
| [9. L2 回调、数据类型与状态](./md/08-callbacks-data-types-and-status-reference.md) | 数据回调、控制应答回调、机器人状态、任务状态、故障信息和主要数据结构 | 处理上报数据和命令应答时查询 |
| [10. L2 示例程序与故障排查](./md/10-examples-and-troubleshooting.md) | SDK 自带示例、推荐测试顺序、网络和运行库排查方法 | 运行示例或联调排障时阅读 |

## 推荐阅读顺序

首次使用设备：

1. [L2 产品介绍与规格](./md/01-product-introduction-and-specifications.md)
2. [L2 配件与设备组成](./md/02-accessories.md)
3. [L2 设备操作、遥控器与 App](./md/04-device-controller-and-app-guide.md)

进行 SDK 开发：

1. [L2 硬件接口与系统架构](./md/03-hardware-interfaces-and-system-architecture.md)
2. [L2 SDK 快速开始](./md/06-sdk-quickstart.md)
3. [L2 控制权、任务与外设控制](./md/09-control-ownership-tasks-and-peripherals.md)
4. [L2 SDK 接口参考](./md/07-sdk-api-reference.md)
5. [L2 回调、数据类型与状态](./md/08-callbacks-data-types-and-status-reference.md)

部署自主导航：

1. [L2 设备操作、遥控器与 App](./md/04-device-controller-and-app-guide.md)
2. [L2 智航 Pro 软件使用](./md/05-roamerx-pro-guide.md)
3. [L2 控制权、任务与外设控制](./md/09-control-ownership-tasks-and-peripherals.md)

## 开发环境

| 项目 | 配置 |
| --- | --- |
| 编程语言 | C++17 |
| 推荐系统 | Ubuntu 22.04 |
| 编译器 | GCC 11.4 |
| CMake | 3.8 及以上 |
| Boost | 1.74 |

## 使用前提

- 连接实体设备前，确保机器人处于平整、空旷区域，人员远离运动路径。
- 首次调试先读取状态，再测试站立、卧倒和低速移动。
- 运动命令发送成功只表示命令通过发送或应答检查，实际动作状态应通过回调确认。
- 控制程序应处理断连、控制权丢失、急停和故障回调。
- 软件急停不能代替现场可直接操作的硬急停或遥控器急停。
