# Peripherals and Cameras

[Overview of interfaces](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Lights and Sensor Switches.

```cpp
std::error_code FrontLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code BackLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code AutoModeLight(bool on, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code ObstacleAvoidance(bool on, int timeout_ms = 0, WriteHandler handler = ...);
```

| Functions | Functions |
| --- | --- |
| `FrontLight` | Lighting before switch. |
| `BackLight` | Lighting after switch |
| `AutoModeLight` | Switch automatic patch mode |
| `ObstacleAvoidance` | Switch disabled. |

Four Functions `on` Parameters are: `true` Turn it on. `false` Close. Current status passes. `RobotState` It's... `front_fill_light`,  `back_fill_light`,  `auto_mode_light` and `obstacle_avoidance` Get in.

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

The actual effective value of the device is returned by `OnUpdateCameraBitrateAck()`. The modification of the code rate should be followed by simultaneous observation of RTSP video streams and network loads.

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

`power` May be set to `M1_12V`, `M1_24V` or `M1_48V`, `enable` to `true` for electricity, `false` for power outages. Response is by `OnSetPeriphPower()` returning.

### GetPeriphPower

```cpp
std::error_code GetPeriphPower(
    const PowerCtrlCfg& cfg, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Query for the specified power channel state. `cfg.power`, the result is passed `OnGetPeriphPower()` Go back. `ack.enable` is the current actual status.

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

The state LED is not the same set of interfaces as the rear and back-up light. The back and back-up light is used `FrontLight()`, `BackLight()` and `AutoModeLight()`.

### Auto and Manual Mode

| Mode | Behaviour and call order |
| --- | --- |
| Manual | Call `SetLedAutoMode(false)`, wait `OnSetLedAutoMode()` confirm `auto_mode == false` and then use `SetLedCommand()` to set a custom light. |
| Auto | Call `SetLedAutoMode(true)`, wait for confirmation of response `auto_mode == true`. `SetLedCommand()` At this time, the submission is a user-light event, and the device will determine the performance according to its own strategy. The failure, emergency stoppage, alarm or low power alert may overwhelm the user-light. |

The current mode can be consulted by `GetLedAutoMode()` and read in `OnGetLedAutoMode()`. On-site contact, please observe the light effect actually displayed by the device. [Official LED Guide](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/en/sdk_led_control_en.md)
