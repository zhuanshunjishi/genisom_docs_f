# L2 外设与相机

[SDK 接口参考](./07-sdk-api-reference.md) | [L2 SDK 控制流程](./09-control-ownership-tasks-and-peripherals.md)

## 灯光接口

补光灯用于照明。[状态 LED](#led-控制)用于显示设备状态、告警、任务或用户事件，具有独立的控制模式。

```cpp
std::error_code FrontLight(
    bool on, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
std::error_code AutoModeLight(
    bool on, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

| 接口 | 功能 | 设备应答 | `RobotState` 字段 |
| --- | --- | --- | --- |
| `FrontLight()` | 开关前补光灯 | `OnFrontLight(bool on)` | `front_fill_light` |
| `AutoModeLight()` | 开关自动补光模式 | `OnAutoModeLight(bool on)` | `auto_mode_light` |

两个函数的 `on` 参数均为 `true` 时开启，`false` 时关闭。手动开关前补光灯会关闭自动补光模式。通过 [RobotState 状态上报](./08-callbacks-data-types-and-status-reference.md#robotstate)读取当前状态。

L2 系列不支持 `BackLight()`（后补光灯）。调用该接口时，SDK 返回 `Errc::UnsupportedDeviceOperation`，不发送命令。

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

图像格式、分辨率和 Topic 路径见[相机节点与 Topic 配置](./camera-topic-configuration.md)。

<a id="外设电源"></a>

## 外设供电控制

```cpp
struct PowerCtrlCfg {
    PeripheralPower power;
    bool enable;
};

std::error_code SetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0, WriteHandler handler = ...);
```

`PowerCtrlCfg` 包含电源通道 `power` 和开关 `enable`。`SetPeriphPower()` 控制协议电源通道，`GetPeriphPower()` 查询通道状态。实际结果分别由 `OnSetPeriphPower()` 和 `OnGetPeriphPower()` 返回。

### 供电安全

- 调用接口前，必须确认当前系统中的协议通道与 M12 的 24 V 输出、M14 的 VBAT 输出的对应关系，见[接口功能与参数](./03-hardware-interfaces-and-system-architecture.md#接口功能与参数)。
- M12 的 24 V 输出与 M14 的 VBAT 输出各自的总功率均不超过 100 W。外设接入前确认 VBAT 的实际输出电压。
- 上电前检查外设额定电压、极性、启动电流和线束绝缘。
- 关闭通道前先让外设完成数据保存和正常停止。
- 应答成功后仍应通过外设状态或电压检测确认实际供电。
- 不得用软件开关代替保险、急停或硬件隔离。

## LED 控制

L2 系列通过三个状态 LED 接口的 SDK 机型能力检查。可点亮的灯组取决于设备的实际配置。[接口能力表](./07-sdk-api-reference.md#接口能力表)

### 接口与应答

#### SetLedAutoMode

```cpp
std::error_code SetLedAutoMode(
    bool auto_mode, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

`auto_mode` 为 `true` 时启用自动模式，为 `false` 时切换到手动模式。从 `OnSetLedAutoMode(const LedAutoModeAck& ack)` 的 `ack.auto_mode` 字段确认设备应答的模式。

#### GetLedAutoMode

```cpp
std::error_code GetLedAutoMode(
    int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

`OnGetLedAutoMode(const LedAutoModeAck& ack)` 返回查询结果。`ack.auto_mode` 为 `true` 表示自动模式，为 `false` 表示手动模式。

#### SetLedCommand

```cpp
std::error_code SetLedCommand(
    const LedCommand& cmd, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

当 `cmd.id` 为 `LedId::UNKNOWN` 或 `cmd.effect` 为 `LedEffect::UNKNOWN` 时，SDK 直接返回 `std::errc::invalid_argument`。通过 `OnSetLedCommand(const LedCommandAck& ack)` 读取设备对分组、灯效、颜色和周期的应答。

调用前使用 `SetControlCallback()` 注册 [`IControlCallback`](./08-callbacks-data-types-and-status-reference.md#icontrolcallback)。`timeout_ms == 0` 时异步发送，先检查函数返回值是否成功提交请求，再从 `WriteHandler` 获取发送结果。`timeout_ms > 0` 时同步等待发送完成或超时，结果由函数返回值报告。设备结果以控制应答为准，实际灯效通过现场观察确认。

### 灯组、灯效与参数

```cpp
struct LedColor {
    uint8_t r, g, b, a;
};

struct LedCommand {
    LedId id;
    LedEffect effect;
    LedColor color;
    uint32_t duration_ms;
};
```

| `LedCommand` 字段 | 说明 |
| --- | --- |
| `id` | 状态 LED 分组 |
| `effect` | 灯效 |
| `color` | RGBA 颜色，`r`、`g`、`b`、`a` 各通道范围为 0 至 255 |
| `duration_ms` | 周期或闪烁间隔，单位为 ms。`OFF` 和 `ON` 通常填 `0`。呼吸和闪烁灯效填写所需周期或间隔，例如 300 ms。 |

| `LedId` | 含义 |
| --- | --- |
| `ALL` | 全部 LED |
| `FRONT` | 前部 LED |
| `BACK` | 后部状态 LED 分组 |

| `LedEffect` | 协议值 | 含义 |
| --- | --- | --- |
| `OFF` | `off` | 关闭 |
| `ON` | `on` | 常亮 |
| `BREATH` | `breath` | 呼吸 |
| `BLINK` | `blink` | 闪烁 |
| `BLINK_TRANSIENT` | `blink_transient` | 瞬时闪烁 |

### 自动与手动模式

| 模式 | 使用方式 |
| --- | --- |
| 手动 | 调用 `SetLedAutoMode(false)` 后，等待 `OnSetLedAutoMode()` 确认 `ack.auto_mode == false`，再调用 `SetLedCommand()`。应用负责管理灯态，设备停止按运行状态自动切换灯效。 |
| 自动 | 调用 `SetLedAutoMode(true)` 后，等待 `OnSetLedAutoMode()` 确认 `ack.auto_mode == true`。设备根据当前状态和事件管理灯效，`SetLedCommand()` 提交用户事件。 |

下表是官方指南给出的自动模式参考优先级。实际显示、持续时间和中断行为由设备端决定，较高优先级的事件可覆盖较低优先级的灯效。

| 优先级（从高到低） | 事件 |
| --- | --- |
| 1 | 系统故障或急停 |
| 2 | 告警 |
| 3 | 低电量 |
| 4 | 用户灯效事件 |
| 5 | 任务执行状态 |
| 6 | 正常运行状态 |

### 调用示例

调试自定义灯效时，先调用 `SetLedAutoMode(false)` 并等待手动模式应答，再发送灯效。以下示例为全部状态 LED 设置橙色闪烁，间隔为 300 ms。

```cpp
const LedCommand manual_effect{LedId::ALL, LedEffect::BLINK, {255, 128, 0, 255}, 300};
client.SetLedCommand(manual_effect);
```

手动测试结束后，调用 `SetLedAutoMode(true)` 并确认应答，恢复设备状态提示。自动模式下可用以下命令请求蓝色瞬时闪烁，设备端决定是否显示。

```cpp
const LedCommand user_event{LedId::ALL, LedEffect::BLINK_TRANSIENT, {0, 0, 255, 255}, 500};
client.SetLedCommand(user_event);
```

需要结束自动模式下的用户灯效事件时，提交全部状态 LED 的 `OFF` 命令。设备仍按自动模式处理其他状态和事件。

```cpp
const LedCommand clear_event{LedId::ALL, LedEffect::OFF, {0, 0, 0, 255}, 0};
client.SetLedCommand(clear_event);
```

联调时可先用 `GetLedAutoMode()` 查询模式，再核对设备应答和实际显示。[SDK 示例](./10-examples-and-troubleshooting.md#led-cpp) · [官方 LED 指南](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_led_control_zh.md)
