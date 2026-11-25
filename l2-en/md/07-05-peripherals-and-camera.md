# Genisom L2 Peripherals and Cameras

[SDK API Reference](./07-sdk-api-reference.md) | [Control Ownership, Tasks, and Peripheral Control](./09-control-ownership-tasks-and-peripherals.md)

## Lighting APIs

```cpp
std::error_code FrontLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code AutoModeLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
```

The Genisom L2 series supports a front fill light and an automatic fill light mode. The SDK capability check rejects `BackLight()` and `ObstacleAvoidance()`.

## Camera Bitrate

### UpdateCameraBitrate

```cpp
std::error_code UpdateCameraBitrate(
    CameraBitrateCmd cmd, int timeout_ms = 0, WriteHandler handler = ...);
```

| Field | Allowed Values |
| --- | --- |
| `camera_name` | `camera_front` or `camera_back` |
| `camera_bps` | 50000 to 100000000 bit/s |

`OnUpdateCameraBitrateAck()` reports the bitrate applied by the device.

See [Camera Nodes and Topic Configuration](./camera-topic-configuration.md) for image formats, resolutions, and topic paths.

## Peripheral Power

```cpp
std::error_code SetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0, WriteHandler handler = ...);
```

`PowerCtrlCfg` contains the power channel `power` and the on/off setting `enable`. Before calling either API, verify which protocol channels correspond to the M12 24 V output and the M14 VBAT output on the current system. See [Interface Functions and Specifications](./03-hardware-interfaces-and-system-architecture.md#interface-functions-and-specifications). The acknowledgment callbacks are `OnSetPeriphPower()` and `OnGetPeriphPower()`, respectively.

## LED Control

```cpp
std::error_code SetLedAutoMode(bool auto_mode, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetLedAutoMode(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SetLedCommand(const LedCommand& cmd, int timeout_ms = 0, WriteHandler handler = ...);
```

`LedCommand` specifies the LED group, lighting effect, RGBA color, and duration. Effects include off, steady on, breathing, flashing, and a momentary flash.
