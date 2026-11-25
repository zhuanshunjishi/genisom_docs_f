# 充电桩与任务

[接口概览](./06-sdk-api-reference.md) | [通用参数和返回值](./06-sdk-api-reference.md#通用参数和返回值) | [远程和空闲状态切换](./05-sdk-control-flow-and-task-handling.md#远程和空闲状态切换)

## 充电桩配对

### 充电桩配对流程

SDK v0.2.3 支持扫描、连接、查询和断开 BLE 充电桩。确认机器人系统支持配对后，先注册数据回调和控制回调，再从应用线程执行以下流程。

1. 调用 `SetDockScanConfig(true)`，等待 `OnDockScanConfig(true)` 确认开始扫描。
2. 通过 `OnDockScanResult()` 接收扫描上报，按地址更新设备列表，选出 `connectable` 为 `true` 的充电桩并保存其地址。
3. 调用 `SetDockScanConfig(false)`，收到关闭扫描确认后，将选中的地址填入 `DockConnectConfig::address` 并调用 `ConnectDock()`。
4. 检查 `OnDockConnectionAck()` 的 `accepted`。请求受理后，等待 `OnDockConnectionResult()` 并检查 `success` 和 `error_code`。
5. 配对成功后调用 `GetDockInfo()`，通过 `OnDockInfo()` 查看 `dock_connected`、`has_contact` 和 `charging_active`。

需要解除连接时，调用 `DisconnectDock()` 并等待受理应答和最终结果。

一次只发起一个连接或断开操作。函数返回值和 `WriteHandler` 用于检查调用与发送结果，`OnDockConnectionResult()` 用于确认配对操作的最终结果。

字段说明见[充电桩数据](./07-callbacks-data-types-and-status-reference.md#充电桩数据)，完整调用示例见[充电桩配对示例](./08-examples-and-troubleshooting.md#充电桩配对示例)。

### 配对接口

`timeout_ms` 和 `handler` 遵循[通用参数规则](./06-sdk-api-reference.md#通用参数和返回值)。

| 函数原型 | 协议类型 | 应答与结果 |
| --- | --- | --- |
| `std::error_code SetDockScanConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | 1008（`target=302`） | `OnDockScanConfig()` 确认开启或停止扫描，`OnDockScanResult()` 上报发现的设备（1018） |
| `std::error_code ConnectDock(const DockConnectConfig& config, int timeout_ms = 0, WriteHandler handler = ...)` | 1022 | 通过 `config.address` 指定充电桩。检查 `OnDockConnectionAck()` 的受理结果和 `OnDockConnectionResult()` 的最终结果（1024） |
| `std::error_code GetDockInfo(int timeout_ms = 0, WriteHandler handler = ...)` | 1023 | `OnDockInfo()` 返回充电桩信息以及连接、接触和充电状态 |
| `std::error_code DisconnectDock(int timeout_ms = 0, WriteHandler handler = ...)` | 1022 | 断开当前充电桩，使用与连接操作相同的应答和结果回调 |

## 充电与离桩任务

### 任务接口 {#任务和机器状态}

```cpp
std::error_code StartRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StartUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
```

| 函数 | 功能 |
| --- | --- |
| `StartRechargeTask()` | 启动自主回充任务 |
| `StopRechargeTask()` | 停止自主回充任务 |
| `StartUnDockTask()` | 启动自主离桩任务 |
| `StopUnDockTask()` | 停止自主离桩任务 |

任务命令需要依次检查调用结果、命令应答和任务执行状态。返回值或 `WriteHandler` 用于检查调用与发送结果。`IControlCallback` 中的 `OnStartRechargeTask()` 等应答表示机器人已处理启动或停止请求。通过 `OnTaskStateData()` 跟踪任务运行和最终结果。

```cpp
void OnTaskStateData(const TaskStateInfo& info) override {
    if (info.task_type == TaskType::RECHARGING) {
        // 根据 info.task_status 和 info.error_code 处理任务状态
    }
}
```

### 回充任务状态

调用 `StartRechargeTask()` 后，回充任务可能上报：

- `STARTING`：任务开始；
- `RUNNING`：任务执行中；
- `FAILURE`：任务启动或执行失败，此时读取 `TaskStateInfo::error_code`。

回充任务不会自然进入 `SUCCESS`。需要结束回充任务时调用 `StopRechargeTask()`，并等待 `TaskType::RECHARGING` 的状态变为 `STOPPED`。判断任务是否已经进入执行状态时，可结合 `OnStartRechargeTask()`、`TaskStateInfo` 和 `MachineStatus::RECHARGE`。

### 离桩任务状态

调用 `StartUnDockTask()` 后，离桩任务可能按 `STARTING -> RUNNING -> SUCCESS` 流转；执行失败时进入 `FAILURE`。`TaskType::UNDOCK` 和 `TaskStatus::SUCCESS` 表示离桩任务完成。

需要中途停止离桩任务时调用 `StopUnDockTask()`，并等待 `TaskType::UNDOCK` 的状态变为 `STOPPED`。

任务状态结构见 [M1 回调、数据类型与状态参考](./07-callbacks-data-types-and-status-reference.md#任务状态)。

参见[回充、离桩与充电桩标定的使用条件和故障排查](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_recharge_undock_calibration_conditions_zh.md)。
