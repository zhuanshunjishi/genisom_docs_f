# L2 外设与相机

[SDK 接口参考](./07-sdk-api-reference.md) | [控制权、任务与外设控制](./09-control-ownership-tasks-and-peripherals.md)

## 灯光接口

```cpp
std::error_code FrontLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code AutoModeLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
```

L2 系列支持前补光灯和自动补光模式。`BackLight()` 与 `ObstacleAvoidance()` 会被 SDK 能力检查拒绝。

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
