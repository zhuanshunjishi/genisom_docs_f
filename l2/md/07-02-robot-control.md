# L2 机器人控制

[SDK 接口参考](./07-sdk-api-reference.md) | [通用参数和返回值](./07-sdk-api-reference.md#通用参数和返回值)

## 控制权

### TakeControl

```cpp
std::error_code TakeControl(
    int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

申请机器人普通控制权。异步发送结果由 `WriteHandler` 报告，同步等待结果由函数返回值报告。收到 `OnTakeControlAck()` 且 `error_code == 0` 时，才确认取得控制权。

### ReleaseControl

```cpp
std::error_code ReleaseControl(
    int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

主动释放当前持有的控制权。程序退出前先停止运动，再调用此接口。切换到 App 或长时间不再发送控制命令时也应主动释放。通过 `OnReleaseControlAck()` 确认释放结果。

控制权的申请、接管和恢复流程见 [L2 SDK 控制流程](./09-control-ownership-tasks-and-peripherals.md#控制权模型)。

## 安全控制

### SoftEmergencyStop

```cpp
std::error_code SoftEmergencyStop(
    bool on, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

`on == true` 触发软件急停，`on == false` 解除。软件急停不受普通控制权限制。现场应保留独立于 SDK 的急停手段。操作前确认遥控器急停可用，使用 L2-W Ultra 时还应确认机身硬急停可用。详见[设备操作与安全指南](./04-device-controller-and-app-guide.md#软件急停)。

应答通过 `IControlCallback::OnSoftEmergencyStop(bool on)` 返回。通过 `RobotState::software_emergency_status` 确认当前状态。

## 姿态控制

| 接口 | 功能 | L2 系列说明 |
| --- | --- | --- |
| `StandUp()` | 站立 | 支持 |
| `BalanceStandUp()` | 原地平衡站立 | 支持 |
| `LieDown()` | 卧倒 | 支持 |
| `Stair()` | 登阶姿态 | 支持 |
| `Crawl()` | 匍匐姿态 | 支持 |
| `CrawlWalk()` | 匍匐行走 | 支持 |
| `Climb()` | 爬高台姿态 | 不支持 |
| `Gait()` | 精细步态 | 仅轮足设备类型支持 |
| `PosControl()` | 位置控制姿态 | 支持 |
| `Locked()` | 锁定当前姿态 | 支持 |
| `Slim()` | 窄道姿态 | 不支持 |
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
    PosControlCmd cmd, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

发送机身目标位姿。先调用 `PosControl()`，并通过 `RobotState::motion_status` 确认进入 `MOTION_STATUS_POS_CONTROL` 后，再发送目标。

```cpp
struct PosControlCmd {
    float x;
    float y;
    float z;
    float roll;
    float pitch;
    float yaw;
};
```

`x`、`y`、`z` 为目标位置，单位为 m。`roll`、`pitch`、`yaw` 分别为目标横滚角、俯仰角和偏航角，单位为 rad。

异步发送结果通过 `WriteHandler` 获取。发送成功只表示命令已发出。公共参数和返回值见 [SDK 接口参考](./07-sdk-api-reference.md#通用参数和返回值)。

### 机身控制

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Turn()`](#turn) | `direction` | 原地向左或向右旋转机身 |
| [`ControlHead()`](#controlhead) | `left_right`、`up_down` | 左右探头和俯仰 |
| [`HighLowStance()`](#highlowstance) | `stance` | 调整站姿高度 |
| [`SetSpeed()`](#setspeed) | `speed_level` | 设置移动速度档位 |

使用 `Turn()`、`ControlHead()` 或 `HighLowStance()` 前，先调用 `BalanceStandUp()`，并确认 `RobotState::motion_status` 为 `MOTION_STATUS_BALANCE_STAND`。

#### Turn

```cpp
std::error_code Turn(
    int direction, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

`direction` 取 `0` 时恢复，取 `1` 时原地左旋转，取 `2` 时原地右旋转。超出范围时返回 `std::errc::invalid_argument`。

#### ControlHead

```cpp
std::error_code ControlHead(
    float left_right, float up_down, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

| 参数 | 范围 | 说明 |
| --- | --- | --- |
| `left_right` | `[-1.0, 1.0]` rad/s | 正数向左探头，负数向右探头 |
| `up_down` | `[-1.0, 1.0]` rad/s | 正数抬头，负数低头 |

参数超出范围时返回 `std::errc::invalid_argument`。

#### HighLowStance

```cpp
std::error_code HighLowStance(
    int stance, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

`stance` 取 `0` 时恢复站姿，取 `1` 时切换到高站姿，取 `2` 时切换到低站姿。

#### SetSpeed

```cpp
std::error_code SetSpeed(
    int speed_level, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

`speed_level` 取 `1`、`2`、`3`，分别对应低速、中速和高速。档位决定通用运动模式下 `Move()` 的实际速度上限，默认档位为低速。超出范围时返回 `std::errc::invalid_argument`。

机器人收到设置命令后通过 `IControlCallback::OnSpeed(int speed_level)` 应答。当前档位可通过 `RobotState::speed_level` 读取。

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
