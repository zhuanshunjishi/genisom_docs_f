# Peripherals and Cameras

[Overview of interfaces](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Lights and Sensor Switches {#lights-and-sensor-switches}

```cpp
std::error_code FrontLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code BackLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code AutoModeLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code ObstacleAvoidance(bool on, int timeout_ms = 0, WriteHandler handler = ...);
```

| Function | Behavior |
| --- | --- |
| `FrontLight` | Enable or disable the front fill light |
| `BackLight` | Enable or disable the rear fill light |
| `AutoModeLight` | Enable or disable automatic fill lighting |
| `ObstacleAvoidance` | Enable or disable obstacle stop |

For all four functions, set `on` to `true` to enable the feature or `false` to disable it. Read the current setting from `RobotState` fields `front_fill_light`, `back_fill_light`, `auto_mode_light`, and `obstacle_avoidance`.

## Camera Bitrate {#camera-bitrate}

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

| Field | Request |
| --- | --- |
| `camera_name` | `camera_front` or `camera_back` |
| `camera_bps` | 50000 to 100000000 bit/s |

`OnUpdateCameraBitrateAck()` returns the bitrate applied by the device. After changing it, monitor the RTSP stream and network load together.

## External Power Supply

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

Set `power` to `M1_12V`, `M1_24V`, or `M1_48V`. Set `enable` to `true` to turn on the output or `false` to turn it off. `OnSetPeriphPower()` reports the acknowledgment.

### GetPeriphPower

```cpp
std::error_code GetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Select the channel with `cfg.power`. The result arrives through `OnGetPeriphPower()`, where `ack.enable` reports the current output state.

## LED Effects {#led-effects}

```cpp
std::error_code SetLedAutoMode(
    bool auto_mode, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetLedAutoMode(
    int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SetLedCommand(
    const LedCommand& cmd, int timeout_ms = 0, WriteHandler handler = ...);
```

| Interface | Functions |
| --- | --- |
| `SetLedAutoMode` | Settings LED Automatic or manual mode |
| `GetLedAutoMode` | Query LED Current mode |
| `SetLedCommand` | Set up light groups, light effects, colours and light cycles |

```cpp
struct LedCommand {
    LedId id;
    LedEffect effect;
    LedColor color;
    uint32_t duration_ms;
};
```

`duration_ms` is the period of light or scintillation, in milliseconds. `OFF`, `ON` usually pass `0`; the values required for breathing and scintillation transmission.

Example:

```cpp
LedCommand cmd{LedId::ALL, LedEffect::BLINK, {255, 128, 0, 255}, 300};
client.SetLedCommand(cmd);
```

`LedId::UNKNOWN` or `LedEffect::UNKNOWN` returns `std::errc::invalid_argument`. Settings and queries are retrieved through the corresponding `IControlCallback` callback.

Status LEDs have separate controls. Use `FrontLight()`, `BackLight()`, and `AutoModeLight()` for the front and rear fill lights.

### Auto and Manual Mode

| Mode | Behaviour and call order |
| --- | --- |
| Manual | Call `SetLedAutoMode(false)`, wait `OnSetLedAutoMode()` confirm `auto_mode == false` and then use `SetLedCommand()` to set a custom light. |
| Auto | Call `SetLedAutoMode(true)`, wait for confirmation of response `auto_mode == true`. `SetLedCommand()` At this time, the submission is a user-light event, and the device will determine the performance according to its own strategy. Faults, emergency stops, warnings, or low-battery alerts can override custom lighting effects. |

Call `GetLedAutoMode()` and read the current mode in `OnGetLedAutoMode()`. During on-site commissioning, verify the lighting effect on the robot. [Official LED Guide](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/en/sdk_led_control_en.md)
