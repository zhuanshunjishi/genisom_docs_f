# 外设与相机

[接口概览](./06-sdk-api-reference.md) | [通用参数和返回值](./06-sdk-api-reference.md#通用参数和返回值)

## 灯光与感知开关

前后补光灯用于照明。[状态 LED](#led-灯效)用于提示故障、急停、任务状态和自定义事件。

```cpp
std::error_code FrontLight(
    bool on, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
std::error_code BackLight(
    bool on, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
std::error_code AutoModeLight(
    bool on, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
std::error_code ObstacleAvoidance(bool on, int timeout_ms = 0, WriteHandler handler = ...);
```

| 函数 | 功能 | 设备应答 | `RobotState` 字段 |
| --- | --- | --- | --- |
| `FrontLight()` | 开关前补光灯 | `OnFrontLight(bool on)` | `front_fill_light` |
| `BackLight()` | 开关后补光灯 | `OnBackLight(bool on)` | `back_fill_light` |
| `AutoModeLight()` | 开关自动补光模式 | `OnAutoModeLight(bool on)` | `auto_mode_light` |
| `ObstacleAvoidance()` | 开关停障功能 | `OnObstacleAvoidance(bool on)` | `obstacle_avoidance` |

四个函数的 `on` 参数均为 `true` 开启、`false` 关闭。通过 `FrontLight()` 或 `BackLight()` 手动设置补光灯时，设备会退出自动补光模式。需要恢复时调用 `AutoModeLight(true)`。

`BackLight()` 在 `DeviceType::M1_AIR` 和 `DeviceType::M1F_AIR` 上返回 `Errc::UnsupportedDeviceOperation`。其他型号的支持情况见[官方接口能力表](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_api_capability_zh.md)。

## 相机码率

### UpdateCameraBitrate

```cpp
std::error_code UpdateCameraBitrate(
    CameraBitrateCmd cmd, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

```cpp
struct CameraBitrateCmd {
    std::string camera_name;
    uint32_t camera_bps;
};
```

| 字段 | 要求 |
| --- | --- |
| `camera_name` | `camera_front` 或 `camera_back` |
| `camera_bps` | 50000 至 100000000 bit/s |

设备实际生效值通过 `OnUpdateCameraBitrateAck()` 返回。修改码率后应同时观察 RTSP 视频流和网络负载。

## 外设电源

### SetPeriphPower

```cpp
std::error_code SetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

```cpp
struct PowerCtrlCfg {
    PeripheralPower power;
    bool enable;
};
```

`power` 可设置为 `M1_12V`、`M1_24V` 或 `M1_48V`，`enable` 为 `true` 上电、`false` 断电。应答通过 `OnSetPeriphPower()` 返回。

### GetPeriphPower

```cpp
std::error_code GetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

查询指定电源通道状态。查询时主要填写 `cfg.power`，结果通过 `OnGetPeriphPower()` 返回，`ack.enable` 表示当前实际状态。

## LED 灯效

状态 LED 可指示设备状态、告警、任务进度或应用事件。前后灯组的实际可用性取决于机型和硬件配置。

### 接口与应答

#### SetLedAutoMode

```cpp
std::error_code SetLedAutoMode(
    bool auto_mode, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

`auto_mode` 为 `true` 时请求切换到自动模式，为 `false` 时请求切换到手动模式。用 `OnSetLedAutoMode(const LedAutoModeAck& ack)` 中的 `ack.auto_mode` 确认设备返回的模式。

#### GetLedAutoMode

```cpp
std::error_code GetLedAutoMode(
    int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

查询状态 LED 的当前模式。通过 `OnGetLedAutoMode(const LedAutoModeAck& ack)` 读取 `ack.auto_mode`。

#### SetLedCommand

```cpp
std::error_code SetLedCommand(
    const LedCommand& cmd, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

下发灯组、灯效、颜色和周期。若 `cmd.id == LedId::UNKNOWN` 或 `cmd.effect == LedEffect::UNKNOWN`，SDK 返回 `std::errc::invalid_argument`。设备应答通过 `OnSetLedCommand(const LedCommandAck& ack)` 返回，包含 `id`、`effect`、`color`、`duration_ms`。

三项接口共用 `timeout_ms` 和 `handler`。传入 `0` 时异步发送，函数立即返回提交结果，实际发送结果由 `WriteHandler` 报告。传入大于 `0` 的值时，函数等待发送结束或超时，并返回 `std::error_code`。以 `IControlCallback` 的对应应答确认设备返回的信息，并在实机上确认最终显示效果。

### 灯组、灯效与参数

```cpp
struct LedColor {
    uint8_t r;
    uint8_t g;
    uint8_t b;
    uint8_t a;
};

struct LedCommand {
    LedId id;
    LedEffect effect;
    LedColor color;
    uint32_t duration_ms;
};
```

| `LedCommand` 字段 | 取值与用途 |
| --- | --- |
| `id` | `LedId::ALL` 选择全部状态灯，`LedId::FRONT` 选择前部，`LedId::BACK` 选择后部 |
| `effect` | 从下表选择 `LedEffect` 枚举值 |
| `color` | `LedColor` 按 `{r, g, b, a}` 填写颜色，各通道为 0 至 255 |
| `duration_ms` | 灯效周期或闪烁间隔，单位为 ms。关闭或常亮通常填 `0`，呼吸和闪烁填所需周期，例如 `300` 或 `1000` |

| `LedEffect` | 协议值 | 显示效果 |
| --- | --- | --- |
| `OFF` | `off` | 关闭 |
| `ON` | `on` | 常亮 |
| `BREATH` | `breath` | 呼吸 |
| `BLINK` | `blink` | 闪烁 |
| `BLINK_TRANSIENT` | `blink_transient` | 瞬时闪烁 |

### 自动与手动模式

| 模式 | 设备行为 | 切换顺序 |
| --- | --- | --- |
| 手动 | 应用直接控制状态 LED，并维护灯态。适用于调试和自定义灯效 | 调用 `SetLedAutoMode(false)`，收到 `OnSetLedAutoMode()` 且确认 `ack.auto_mode == false` 后，再下发灯效 |
| 自动 | 设备管理状态 LED，`SetLedCommand()` 提交用户灯效事件 | 调用 `SetLedAutoMode(true)`，收到 `OnSetLedAutoMode()` 且确认 `ack.auto_mode == true` 后，即可提交用户事件 |

设备侧策略决定用户灯效是否显示、显示多久，以及何时被更高优先级的提示打断。SDK 指南给出的自动模式参考优先级如下，数字越小优先级越高。

| 优先级 | 场景 |
| --- | --- |
| 1 | 系统故障或急停 |
| 2 | 告警 |
| 3 | 低电量 |
| 4 | 用户事件 |
| 5 | 任务执行状态 |
| 6 | 正常运行 |

### 调用示例

在调用灯效接口前，通过 `SetControlCallback()` 注册控制回调并连接机器人。需要核对当前模式时，调用 `GetLedAutoMode()` 并读取 `OnGetLedAutoMode()`。

**手动灯效**。调用 `SetLedAutoMode(false)`，确认设备返回手动模式后，将全部状态 LED 设置为橙色闪烁，间隔为 400 ms。

```cpp
const LedCommand manual_blink{
    LedId::ALL, LedEffect::BLINK, {255, 160, 0, 255}, 400};
client.SetLedCommand(manual_blink);
```

**自动模式下的用户事件**。调用 `SetLedAutoMode(true)`，确认设备返回自动模式后，向前部状态 LED 提交蓝色瞬时闪烁事件。

```cpp
const LedCommand blue_event{
    LedId::FRONT, LedEffect::BLINK_TRANSIENT, {0, 96, 255, 255}, 600};
client.SetLedCommand(blue_event);
```

清除自动模式下的用户事件时，向全部灯组发送 `OFF`。其他状态提示仍按设备侧优先级显示。

```cpp
const LedCommand clear_event{LedId::ALL, LedEffect::OFF, {0, 0, 0, 0}, 0};
client.SetLedCommand(clear_event);
```

现场联调时，先核对回调中的模式和灯效参数，再观察设备的实际显示。完整流程见[官方 LED 控制指南](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_led_control_zh.md)。
