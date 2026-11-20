# L2 SDK 接口参考

[返回文档总览](../index.md) | [SDK 快速开始](./06-sdk-quickstart.md) | [回调、数据类型与状态](./08-callbacks-data-types-and-status-reference.md) | [控制权、任务与外设控制](./09-control-ownership-tasks-and-peripherals.md)

## 核心类

SDK 核心类为 `robot_sdk::SDKClient`，声明在 `include/robot_sdk/sdk_client.hpp`。公开接口统一使用 `std::error_code` 报告发送、超时、连接和能力检查结果。

![SDK 命令发送流程](../assets/sdk/sdk-send-command.svg)

## L2 系列设备类型

| 产品或设备形态 | `DeviceType` | 本文缩写 |
| --- | --- | --- |
| L2 点足版 | `L2F` | L2 |
| L2-W 轮足版 | `L2` | L2-W |
| L2-W Ultra | `L2_ULTRA` | L2-W Ultra |
| 点足环视设备枚举 | `L2F_ULTRA` | L2F Ultra |

## 接口能力表

`✓` 表示 SDK 不会因设备类型拒绝接口。`—` 表示 SDK 返回 `Errc::UnsupportedDeviceOperation`，并且不发送命令。

### 连接、信息与基础控制

| API | L2 | L2-W | L2-W Ultra | L2F Ultra |
| --- | :---: | :---: | :---: | :---: |
| `SDKClient()` / `~SDKClient()` | ✓ | ✓ | ✓ | ✓ |
| `Connect()` / `Disconnect()` | ✓ | ✓ | ✓ | ✓ |
| `IsConnected()` / `GetConnectionState()` | ✓ | ✓ | ✓ | ✓ |
| `SetControlCallback()` / `SetDataCallback()` | ✓ | ✓ | ✓ | ✓ |
| `Version()` / `ProtocolVersion()` / `SystemVersion()` | ✓ | ✓ | ✓ | ✓ |
| `GetDeviceInfo()` | ✓ | ✓ | ✓ | ✓ |
| `SoftEmergencyStop()` | ✓ | ✓ | ✓ | ✓ |
| `StandUp()` / `BalanceStandUp()` / `LieDown()` | ✓ | ✓ | ✓ | ✓ |
| `Stair()` / `Crawl()` / `CrawlWalk()` / `Climb()` | ✓ | ✓ | ✓ | ✓ |
| `PosControl()` / `Locked()` / `SetSpeed()` | ✓ | ✓ | ✓ | ✓ |
| `Gait()` | — | ✓ | ✓ | — |
| `Slim()` / `DSB()` / `SkWalk()` / `Sand()` | — | — | — | — |
| `ReverseHeadTail()` | — | — | — | — |

### 运动、灯光和数据

| API | L2 | L2-W | L2-W Ultra | L2F Ultra |
| --- | :---: | :---: | :---: | :---: |
| `Move()` / `PosMove()` | ✓ | ✓ | ✓ | ✓ |
| `Turn()` / `ControlHead()` / `HighLowStance()` | ✓ | ✓ | ✓ | ✓ |
| `FrontLight()` / `AutoModeLight()` | ✓ | ✓ | ✓ | ✓ |
| `BackLight()` / `ObstacleAvoidance()` | — | — | — | — |
| `SetImuConfig()` / `SetLuxConfig()` | ✓ | ✓ | ✓ | ✓ |
| `SetMcConfig()` / `SetSpeedReportConfig()` | ✓ | ✓ | ✓ | ✓ |
| `SetJointStateConfig()` | ✓ | ✓ | ✓ | ✓ |
| `UpdateCameraBitrate()` | ✓ | ✓ | ✓ | ✓ |

### 控制权、任务和外设

| API | L2 | L2-W | L2-W Ultra | L2F Ultra |
| --- | :---: | :---: | :---: | :---: |
| `TakeControl()` / `ReleaseControl()` | ✓ | ✓ | ✓ | ✓ |
| `StartRechargeTask()` / `StopRechargeTask()` | ✓ | ✓ | ✓ | ✓ |
| `StartUnDockTask()` / `StopUnDockTask()` | ✓ | ✓ | ✓ | ✓ |
| `SwitchRemoteState()` / `SwitchIdleState()` | ✓ | ✓ | ✓ | ✓ |
| `SetPeriphPower()` / `GetPeriphPower()` | ✓ | ✓ | ✓ | ✓ |
| `SetLedAutoMode()` / `GetLedAutoMode()` | ✓ | ✓ | ✓ | ✓ |
| `SetLedCommand()` | ✓ | ✓ | ✓ | ✓ |

能力允许不代表每次调用都会成功。连接、控制权、急停、机器人状态、参数范围和外设安装情况仍会影响执行结果。

## 通用参数和返回值

```cpp
using WriteHandler =
    std::function<void(const std::error_code&, std::size_t)>;
```

| 参数 | 说明 |
| --- | --- |
| `timeout_ms == 0` | 异步发送，结果由 `WriteHandler` 返回 |
| `timeout_ms > 0` | 同步等待，结果由函数返回值报告 |
| `handler` | 异步发送结果回调 |

常见错误：

| 错误 | 含义 |
| --- | --- |
| `std::errc::invalid_argument` | 参数超出范围或参数组合无效 |
| `std::errc::not_connected` | 连接未建立 |
| `std::errc::timed_out` | 同步等待超时 |
| `std::errc::operation_in_progress` | 相同操作正在执行 |
| `Errc::ShakeHandFailed` | 握手失败 |
| `Errc::ProtocolMismatch` | 通信协议版本不匹配 |
| `Errc::ControlledDenial` | 当前不能获得控制权 |
| `Errc::ConnectFailed` | 连接失败 |
| `Errc::UnsupportedDeviceOperation` | 当前设备类型不支持该接口 |

## 构造与连接

### SDKClient

```cpp
SDKClient(
    ErrorHandler error_callback = [](const std::error_code&) {},
    ConnectionConfig connection_config = ConnectionConfig(),
    TransportProtocol type = TransportProtocol::Udp);
```

`ConnectionConfig`：

| 字段 | 默认值 | 说明 |
| --- | ---: | --- |
| `connect_timeout_ms` | 5000 ms | 连接和握手超时，最小 500 ms |
| `auto_reconnect` | `false` | 是否自动重连 |
| `reconnect_interval_ms` | 1000 ms | 自动重连间隔，最小 500 ms |

### Connect

```cpp
std::error_code Connect(
    std::string ip, std::string port, bool block = false,
    ConnectHandler handler = [](const std::error_code&) {});
```

连接传输通道并完成协议握手。

| 参数 | 说明 |
| --- | --- |
| `ip` | 机器人 IP 地址 |
| `port` | UDP 使用 `8082`，WebSocket 使用 `8081` |
| `block` | `true` 时同步等待 |

### Disconnect

```cpp
std::error_code Disconnect(
    bool block = false,
    DisConnectHandler handler = [](const std::error_code&) {});
```

主动断开连接并释放内部通信资源。主动断开不会触发自动重连。

### 连接状态

```cpp
bool IsConnected() const;
ConnectionState GetConnectionState() const;
```

`ConnectionState` 包括 `DISCONNECTING`、`DISCONNECTED`、`CONNECTING`、`HANDSHAKING`、`CONNECTED` 和 `RECONNECTING`。

## 回调注册

```cpp
void SetControlCallback(std::shared_ptr<IControlCallback> callback);
void SetDataCallback(std::shared_ptr<IDataCallback> callback);
```

建议在 `Connect()` 前注册回调，并让回调对象的生命周期长于连接。详细接口见 [L2 回调、数据类型与状态](./08-callbacks-data-types-and-status-reference.md)。

## 安全控制

### SoftEmergencyStop

```cpp
std::error_code SoftEmergencyStop(
    bool on, int timeout_ms = 0, WriteHandler handler = ...);
```

`on == true` 触发软件急停，`false` 解除。应答通过 `OnSoftEmergencyStop()` 返回，状态通过 `RobotState::software_emergency_status` 读取。

## 姿态控制

| 接口 | 功能 | L2 系列说明 |
| --- | --- | --- |
| `StandUp()` | 站立 | 支持 |
| `BalanceStandUp()` | 原地平衡站立 | 支持 |
| `LieDown()` | 卧倒 | 支持 |
| `Stair()` | 登阶姿态 | 支持 |
| `Crawl()` | 匍匐姿态 | 支持 |
| `CrawlWalk()` | 匍匐行走 | 支持 |
| `Climb()` | 爬高台姿态 | 支持 |
| `Gait()` | 精细步态 | 仅轮足设备类型支持 |
| `PosControl()` | 位置控制姿态 | 支持 |
| `Locked()` | 锁定当前姿态 | 支持 |
| `Slim()` | 窄道姿态 | 不支持 |
| `DSB()` | 挡鼠板姿态 | 不支持 |
| `SkWalk()` | 同膝姿态 | 不支持 |
| `Sand()` | 沙地姿态 | 不支持 |
| `ReverseHeadTail()` | 调换头尾 | 不支持 |

这些接口都使用公共的 `timeout_ms` 和 `WriteHandler` 参数。姿态完成情况通过 `RobotState::motion_status` 判断。

## 运动控制

### Move

```cpp
std::error_code Move(
    float left_right, float forward_back, float yaw,
    int timeout_ms = 0, WriteHandler handler = ...);
```

| 参数 | 范围 | 说明 |
| --- | --- | --- |
| `left_right` | `[-1.0, 1.0]` | 正数左移，负数右移 |
| `forward_back` | `[-1.0, 1.0]` | 正数前进，负数后退 |
| `yaw` | `[-1.0, 1.0]` | 正数左转，负数右转 |

连续移动时以 10 至 20 Hz 周期发送。停止时明确发送 `Move(0, 0, 0)`，不要只停止应用循环。

### PosMove

```cpp
std::error_code PosMove(
    PosControlCmd cmd, int timeout_ms = 0, WriteHandler handler = ...);
```

`PosControlCmd` 包含 `x`、`y`、`z`、`roll`、`pitch`、`yaw`。位置单位为 m，角度单位为 rad。调用前先进入 `PosControl()`。

### 机身控制

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Turn(direction)` | `0` 恢复，`1` 左，`2` 右 | 原地翻滚机身 |
| `ControlHead(left_right, up_down)` | 两个参数均为 `[-1, 1]` | 左右探头和俯仰 |
| `HighLowStance(stance)` | `0` 恢复，`1` 高，`2` 低 | 机身高度 |
| `SetSpeed(level)` | `1` 低，`2` 中，`3` 高 | 设置移动速度档位 |

## 灯光接口

```cpp
std::error_code FrontLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code AutoModeLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
```

L2 系列支持前补光灯和自动补光模式。`BackLight()` 与 `ObstacleAvoidance()` 会被 SDK 能力检查拒绝。

## 数据上报配置

| 接口 | 参数 | 数据回调 |
| --- | --- | --- |
| `SetImuConfig(freq)` | `0` 至 `100` Hz，`0` 关闭 | `OnImuData()` |
| `SetLuxConfig(on)` | 开关，开启后 1 Hz | `OnLuxData()` |
| `SetMcConfig(on)` | 开关，开启后 50 Hz | `OnMcData()` |
| `SetSpeedReportConfig(on, frequency)` | `1` 至 `50` Hz | `OnSpeedData()` |
| `SetJointStateConfig(on)` | 开关 | `OnJointStateData()` |

配置应答由 `IControlCallback` 中相应的 `On...Config()` 回调返回。

## 控制权

```cpp
std::error_code TakeControl(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code ReleaseControl(int timeout_ms = 0, WriteHandler handler = ...);
```

`TakeControl()` 的发送结果不等于获得控制权。只有 `OnTakeControlAck()` 返回的 `error_code == 0` 才表示成功。

## 相机码率

### UpdateCameraBitrate

```cpp
std::error_code UpdateCameraBitrate(
    CameraBitrateCmd cmd, int timeout_ms = 0, WriteHandler handler = ...);
```

| 字段 | 取值 |
| --- | --- |
| `camera_name` | `camera_front` 或 `camera_back` |
| `camera_bps` | 50000 至 100000000 bit/s |

设备生效值通过 `OnUpdateCameraBitrateAck()` 返回。

## 任务与机器状态

```cpp
std::error_code StartRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StartUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchRemoteState(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchIdleState(int timeout_ms = 0, WriteHandler handler = ...);
```

任务接口需要可用充电桩、地图和机器人端配置。任务执行状态以 `OnTaskStateData()` 为主，`RobotState::machine_status` 为辅。

## 外设电源

```cpp
std::error_code SetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0, WriteHandler handler = ...);
```

`PowerCtrlCfg` 包含电源通道 `power` 和开关 `enable`。调用前必须确认当前系统中的协议通道与 24 V、50.4 V 实体接口对应关系。应答分别通过 `OnSetPeriphPower()` 和 `OnGetPeriphPower()` 返回。

## LED 控制

```cpp
std::error_code SetLedAutoMode(bool auto_mode, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetLedAutoMode(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SetLedCommand(const LedCommand& cmd, int timeout_ms = 0, WriteHandler handler = ...);
```

`LedCommand` 包含 LED 分组、灯效、RGBA 颜色和持续时间。灯效包括关闭、常亮、呼吸、闪烁和瞬时闪烁。

## 版本和设备信息

| 接口 | 说明 |
| --- | --- |
| `Version()` | SDK 版本，连接前可用 |
| `ProtocolVersion()` | SDK 通信协议版本，连接前可用 |
| `SystemVersion()` | 机器人系统版本，握手成功后有效 |
| `GetDeviceInfo()` | 设备类型和序列号，握手成功后有效 |

```cpp
const auto info = client.GetDeviceInfo();
std::cout << DeviceTypeName(info.device_type) << '\n';
std::cout << info.sn << '\n';
```

## 最小安全控制示例

::: warning 实体设备运行前
实体设备运行前还应增加数据回调、急停检查、故障检查、姿态完成确认和信号退出处理。
:::

```cpp
#include <atomic>
#include <chrono>
#include <iostream>
#include <memory>
#include <thread>
#include "robot_sdk/sdk_client.hpp"

using namespace robot_sdk;

class ControlCallback final : public IControlCallback {
public:
    void OnTakeControlAck(const TakeControlAck& ack) override {
        has_control.store(ack.error_code == 0);
        control_reply.store(true);
    }

    std::atomic_bool control_reply{false};
    std::atomic_bool has_control{false};
};

int main(int argc, char** argv) {
    if (argc != 2) return 1;

    SDKClient client;
    auto control_cb = std::make_shared<ControlCallback>();
    client.SetControlCallback(control_cb);

    auto ec = client.Connect(argv[1], "8082", true);
    if (ec) {
        std::cerr << ec.message() << '\n';
        return 1;
    }

    client.TakeControl();
    for (int i = 0; i < 40 && !control_cb->control_reply; ++i) {
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
    }
    if (!control_cb->has_control) {
        std::cerr << "control unavailable\n";
        client.Disconnect(true);
        return 1;
    }

    ec = client.StandUp(2000);
    if (!ec) {
        for (int i = 0; i < 20; ++i) {
            client.Move(0.0f, 0.15f, 0.0f);
            std::this_thread::sleep_for(std::chrono::milliseconds(50));
        }
        client.Move(0.0f, 0.0f, 0.0f);
    }

    client.ReleaseControl(1000);
    client.Disconnect(true);
    return ec ? 1 : 0;
}
```
