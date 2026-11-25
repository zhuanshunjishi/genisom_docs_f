# 智身钢镚 L2 SDK 开发文档

![智身钢镚 L2 系列机器人](./assets/product/l2-series-cover.jpg)

## 文档说明

本文档面向钢镚 L2 系列机器人的设备操作、应用开发和现场联调，覆盖 L2、L2-W 和 L2-W Ultra。智航 Pro 功能仅适用于 L2-W Ultra。

应用程序通过 `robot_sdk::SDKClient` 连接机器人、申请控制权、发送控制命令，并通过回调接收机器人状态、传感器数据、故障信息和任务状态。

## 文档目录

| 章节 | 主要内容 | 阅读建议 |
| --- | --- | --- |
| [1. L2 产品介绍与规格](./md/01-product-introduction-and-specifications.md) | 三个产品版本的足端形态、尺寸、运动能力、续航、感知、通信和扩展能力 | 选型或初次了解产品时阅读 |
| [2. L2 配件与设备组成](./md/02-accessories.md) | 机器人本体、电池、充电座、适配器、遥控器、UWB 信标和随箱附件 | 开箱验收或确认配件时阅读 |
| [3. L2 首次使用](./md/11-first-use.md) | 开箱、摆放、安装电池、开机、GenisDog 配网与首次激活 | 第一次启用设备时阅读 |
| [4. L2 硬件接口与系统架构](./md/03-hardware-interfaces-and-system-architecture.md) | 上装安装范围、[外观模型下载](./md/03-hardware-interfaces-and-system-architecture.md#exterior-model-downloads)、扩展仓位置、供电、千兆以太网、UART、RS485、SBUS、PPS、USB、SIM 卡槽和航插调试线 | 接入网络或安装上装设备前阅读 |
| [5. L2 设备操作与安全使用](./md/04-device-controller-and-app-guide.md) | 安全检查、开关机、遥控器、急停、App 操作和充电 | 操控设备前阅读 |
| [6. L2 日常维护、存放与故障排查](./md/12-maintenance.md) | 清洁保养、定期检查、存放和设备故障排查 | 维护、存放或排查设备异常时阅读 |
| [7. L2 智航 Pro 软件使用](./md/05-roamerx-pro-guide.md) | L2-W Ultra 的网络配置、建图、路网、巡航任务、自主回充和巡航记录 | 部署 L2-W Ultra 自主导航时阅读 |
| [8. L2 SDK 快速开始](./md/06-sdk-quickstart.md) | Ubuntu 环境、SDK 目录、网络与端口配置、编译、连接、运行示例和自建工程 | 第一次编译和运行 SDK 时阅读 |
| [9. L2 SDK 控制流程](./md/09-control-ownership-tasks-and-peripherals.md) | 控制权申请与释放、远程与空闲状态切换、退出和异常处理 | 编写 SDK 控制程序前阅读 |
| [10. L2 SDK 接口参考](./md/07-sdk-api-reference.md) | 接口能力表、通用参数与返回值、连接与控制、数据上报、[充电桩配对与任务](./md/07-04-dock-and-tasks.md)、[外设与相机接口](./md/07-05-peripherals-and-camera.md) | 编码时按功能查询 |
| [11. L2 数据读取 · 相机节点与 Topic 配置](./md/camera-topic-configuration.md) | 相机图像格式、分辨率和 Topic 路径 | 接入前双目或环视相机图像时阅读 |
| [12. L2 回调、数据类型与状态](./md/08-callbacks-data-types-and-status-reference.md) | 数据回调、控制应答回调、机器人状态、任务状态、故障信息和主要数据结构 | 处理上报数据和命令应答时查询 |
| [13. L2 示例程序与故障排查](./md/10-examples-and-troubleshooting.md) | SDK 自带示例、推荐测试顺序、网络和运行库排查方法 | 运行示例或联调排障时阅读 |

## 推荐阅读顺序

首次使用设备：

1. [L2 产品介绍与规格](./md/01-product-introduction-and-specifications.md)
2. [L2 配件与设备组成](./md/02-accessories.md)
3. [L2 首次使用](./md/11-first-use.md)，完成开机、GenisDog 配网与激活。
4. [L2 设备操作与安全使用](./md/04-device-controller-and-app-guide.md)，查看遥控器和急停操作。

进行 SDK 开发：

1. [L2 硬件接口与系统架构](./md/03-hardware-interfaces-and-system-architecture.md)
2. [L2 SDK 快速开始](./md/06-sdk-quickstart.md)
3. [L2 SDK 控制流程](./md/09-control-ownership-tasks-and-peripherals.md)
4. [L2 SDK 接口参考](./md/07-sdk-api-reference.md)
5. [L2 回调、数据类型与状态](./md/08-callbacks-data-types-and-status-reference.md)

为 L2-W Ultra 部署智航 Pro 自主导航：

1. [L2 设备操作与安全使用](./md/04-device-controller-and-app-guide.md)
2. [L2 智航 Pro 软件使用](./md/05-roamerx-pro-guide.md)
3. 通过 SDK 发起回充或离桩时，参阅[回充与离桩任务](./md/07-04-dock-and-tasks.md#回充与离桩任务)。

设备开机、遥控或配网异常时，参阅[设备故障排查](./md/12-maintenance.md#设备故障排查)。

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
