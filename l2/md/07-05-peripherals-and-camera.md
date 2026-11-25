# L2 外设与相机

[SDK 接口参考](./07-sdk-api-reference.md) | [L2 SDK 控制流程](./09-control-ownership-tasks-and-peripherals.md)

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

### 自动与手动模式

```cpp
std::error_code SetLedAutoMode(
    bool auto_mode, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetLedAutoMode(
    int timeout_ms = 0, WriteHandler handler = ...);
```

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

`LedCommand` 包含 LED 分组、灯效、RGBA 颜色和持续时间。

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
