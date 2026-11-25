# L2 外设与相机

[SDK 接口参考](./07-sdk-api-reference.md) | [L2 SDK 控制流程](./09-control-ownership-tasks-and-peripherals.md)

## 灯光接口

```cpp
std::error_code FrontLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code AutoModeLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
```

| 函数 | 功能 | `RobotState` 字段 |
| --- | --- | --- |
| `FrontLight()` | 开关前补光灯 | `front_fill_light` |
| `AutoModeLight()` | 开关自动补光模式 | `auto_mode_light` |

两个函数的 `on` 参数均为 `true` 时开启，`false` 时关闭。手动开关前补光灯会关闭自动补光模式。通过 [RobotState 状态上报](./08-callbacks-data-types-and-status-reference.md#robotstate)读取当前状态。

L2 系列不支持 `BackLight()`（后补光灯）。调用该接口时，SDK 返回 `Errc::UnsupportedDeviceOperation`，不发送命令。

## 相机码率

### UpdateCameraBitrate

```cpp
std::error_code UpdateCameraBitrate(
    CameraBitrateCmd cmd, int timeout_ms = 0, WriteHandler handler = ...);
```

`UpdateCameraBitrate()` 修改所选相机视频流的编码码率。把目标配置传入 `cmd`。

| `CameraBitrateCmd` 字段 | 用途与取值 |
| --- | --- |
| `camera_name` | 选择前相机（`camera_front`）或后相机（`camera_back`）。 |
| `camera_bps` | 请求的目标码率，范围为 50000 至 100000000 bit/s。 |

`OnUpdateCameraBitrateAck()` 返回 `CameraBitrateAck`。其中 `camera_name` 标识视频流，`camera_bps` 为设备实际生效的码率。

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

| 函数 | 用途与结果 |
| --- | --- |
| `SetPeriphPower(cfg)` | 开关指定的协议电源通道。`OnSetPeriphPower()` 通过 `PowerCtrlAck` 回传通道和设置状态。 |
| `GetPeriphPower(cfg)` | 查询指定通道。`OnGetPeriphPower()` 通过 `PowerCtrlAck` 返回通道当前上报的状态。 |

| `PowerCtrlCfg` / `PowerCtrlAck` 字段 | 用途 |
| --- | --- |
| `power` | 要设置或查询的协议通道。SDK 头文件定义了 L2 通道 `PeripheralPower::L2_24V` 和 `PeripheralPower::L2_AVIA`。开关电源前先确认当前系统中的实体接口映射。 |
| `enable` | `true` 表示供电，`false` 表示关闭。设置时填写该字段。查询只用 `cfg.power` 选择通道，从 `ack.enable` 读取上报状态。 |

### 供电安全

- 调用接口前，必须确认当前系统中的协议通道与 M12 的 24 V 输出、M14 的 VBAT 输出的对应关系，见[接口功能与参数](./03-hardware-interfaces-and-system-architecture.md#接口功能与参数)。
- M12 的 24 V 输出与 M14 的 VBAT 输出各自的总功率均不超过 100 W。外设接入前确认 VBAT 的实际输出电压。
- 上电前检查外设额定电压、极性、启动电流和线束绝缘。
- 关闭通道前先让外设完成数据保存和正常停止。
- 应答成功后仍应通过外设状态或电压检测确认实际供电。
- 不得用软件开关代替保险、急停或硬件隔离。

## LED 控制

### 自动与手动模式

```cpp
std::error_code SetLedAutoMode(
    bool auto_mode, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetLedAutoMode(
    int timeout_ms = 0, WriteHandler handler = ...);
```

`SetLedAutoMode(auto_mode)` 切换 LED 灯效控制方式，`true` 选择自动模式，`false` 选择手动模式。`GetLedAutoMode()` 查询当前模式。`OnSetLedAutoMode()` 和 `OnGetLedAutoMode()` 通过 `LedAutoModeAck::auto_mode` 返回模式。

自动模式由机器人根据运行、告警、低电和急停状态管理灯效。手动模式允许应用调用 `SetLedCommand()`。

### SetLedCommand

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

std::error_code SetLedCommand(
    const LedCommand& cmd, int timeout_ms = 0, WriteHandler handler = ...);
```

`SetLedCommand(cmd)` 在手动模式下设置灯效。通过 `OnSetLedCommand()` 中的 `LedCommandAck` 读取设备回传的配置。

| `LedCommand` / `LedCommandAck` 字段 | 用途 |
| --- | --- |
| `id` | 要控制的 LED 分组。 |
| `effect` | 为该分组设置的灯效。 |
| `color` | `LedColor` 中的红色（`r`）、绿色（`g`）、蓝色（`b`）和亮度/Alpha（`a`）分量。各分量范围为 0 至 255。 |
| `duration_ms` | 灯效周期或闪烁间隔，取决于灯效，单位为 ms。 |

| `LedId` | 含义 |
| --- | --- |
| `ALL` | 全部 LED |
| `FRONT` | 前部 LED |
| `BACK` | 后部 LED |

| `LedEffect` | 含义 |
| --- | --- |
| `OFF` | 关闭 |
| `ON` | 常亮 |
| `BREATH` | 呼吸 |
| `BLINK` | 闪烁 |
| `BLINK_TRANSIENT` | 瞬时闪烁 |

```cpp
LedCommand cmd{
    LedId::ALL,
    LedEffect::BLINK,
    {255, 128, 0, 255},
    300
};
client.SetLedCommand(cmd, 1000);
```

在手动灯效结束后恢复自动模式，避免覆盖急停、低电和故障指示。
