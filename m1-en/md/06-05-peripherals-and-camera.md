# Peripherals and Cameras

[Overview of interfaces](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Lights and Sensor Switches {#lights-and-sensor-switches}

The front and rear fill lights provide illumination. The [status LEDs](#led-effects) indicate faults, emergency stops, task status, and custom events.

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

| Function | Behavior | Device Acknowledgment | `RobotState` Field |
| --- | --- | --- | --- |
| `FrontLight()` | Turn the front fill light on or off | `OnFrontLight(bool on)` | `front_fill_light` |
| `BackLight()` | Turn the rear fill light on or off | `OnBackLight(bool on)` | `back_fill_light` |
| `AutoModeLight()` | Enable or disable automatic fill lighting | `OnAutoModeLight(bool on)` | `auto_mode_light` |
| `ObstacleAvoidance()` | Enable or disable obstacle stop | `OnObstacleAvoidance(bool on)` | `obstacle_avoidance` |

For all four functions, pass `true` to enable the feature or `false` to disable it. Setting a fill light manually through `FrontLight()` or `BackLight()` disables automatic fill lighting. Call `AutoModeLight(true)` to restore it.

`BackLight()` returns `Errc::UnsupportedDeviceOperation` on `DeviceType::M1_AIR` and `DeviceType::M1F_AIR`. Check the [official API capability matrix](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/en/sdk_api_capability_en.md) for other variants.

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

Status LEDs can indicate device state, warnings, task progress, or application events. The available light groups depend on the robot variant and hardware configuration.

### APIs and Acknowledgments

#### SetLedAutoMode

```cpp
std::error_code SetLedAutoMode(
    bool auto_mode, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Pass `true` to request automatic mode or `false` to request manual mode. Read `ack.auto_mode` in `OnSetLedAutoMode(const LedAutoModeAck& ack)` to confirm the mode reported by the robot.

#### GetLedAutoMode

```cpp
std::error_code GetLedAutoMode(
    int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Query the current status LED mode. Read `ack.auto_mode` in `OnGetLedAutoMode(const LedAutoModeAck& ack)`.

#### SetLedCommand

```cpp
std::error_code SetLedCommand(
    const LedCommand& cmd, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Send an LED group, effect, color, and period. The SDK returns `std::errc::invalid_argument` if `cmd.id == LedId::UNKNOWN` or `cmd.effect == LedEffect::UNKNOWN`. The device reports `id`, `effect`, `color`, and `duration_ms` in `OnSetLedCommand(const LedCommandAck& ack)`.

All three APIs accept `timeout_ms` and `handler`. With `timeout_ms == 0`, the call returns the submission result immediately. `WriteHandler` reports the send result when it becomes available. With a positive timeout, the call waits for the send to finish or time out and returns a `std::error_code`. Read the device response through the corresponding `IControlCallback` acknowledgment, then verify the displayed effect on the robot.

### LED Groups, Effects, and Parameters

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

| `LedCommand` Field | Value and Purpose |
| --- | --- |
| `id` | `LedId::ALL` selects all status LEDs, `LedId::FRONT` selects the front group, and `LedId::BACK` selects the rear group |
| `effect` | An enum value from the `LedEffect` table below |
| `color` | `LedColor` in `{r, g, b, a}` order, with each channel ranging from 0 to 255 |
| `duration_ms` | The effect period or blink interval in ms. Use `0` for the off or steady-on effect in typical cases. Set an interval such as `300` or `1000` for breathing and blinking effects |

| `LedEffect` | Protocol Value | Displayed Effect |
| --- | --- | --- |
| `OFF` | `off` | Off |
| `ON` | `on` | Steady on |
| `BREATH` | `breath` | Gradual brightening and dimming |
| `BLINK` | `blink` | Repeated blinking |
| `BLINK_TRANSIENT` | `blink_transient` | Transient blinking |

### Automatic and Manual Modes {#auto-and-manual-mode}

| Mode | Device Behavior | Switching Sequence |
| --- | --- | --- |
| Manual | The application controls the status LEDs directly and tracks their state. Use this mode for debugging or custom effects | Call `SetLedAutoMode(false)`. Send the effect after `OnSetLedAutoMode()` reports `ack.auto_mode == false` |
| Automatic | The robot manages the status LEDs. `SetLedCommand()` submits a user lighting event | Call `SetLedAutoMode(true)`. Submit an event after `OnSetLedAutoMode()` reports `ack.auto_mode == true` |

The device's policy determines whether a user effect displays, how long it lasts, and whether a higher-priority indication interrupts it. The SDK guide gives this reference order for automatic mode, with 1 as the highest priority.

| Priority | Scenario |
| --- | --- |
| 1 | System fault or emergency stop |
| 2 | Warning |
| 3 | Low battery |
| 4 | User event |
| 5 | Running task |
| 6 | Normal operation |

### Usage Examples

Before sending LED commands, register a control callback with `SetControlCallback()` and connect to the robot. To check the current mode, call `GetLedAutoMode()` and read the response in `OnGetLedAutoMode()`.

**Manual effect.** Call `SetLedAutoMode(false)`. After the robot confirms manual mode, set all status LEDs to blink orange at a 400 ms interval.

```cpp
const LedCommand manual_blink{
    LedId::ALL, LedEffect::BLINK, {255, 160, 0, 255}, 400};
client.SetLedCommand(manual_blink);
```

**User event in automatic mode.** Call `SetLedAutoMode(true)`. After the robot confirms automatic mode, request a transient blue blink on the front status LEDs.

```cpp
const LedCommand blue_event{
    LedId::FRONT, LedEffect::BLINK_TRANSIENT, {0, 96, 255, 255}, 600};
client.SetLedCommand(blue_event);
```

To clear the user event while remaining in automatic mode, send `OFF` to all groups. Other status indications continue to follow the device's priorities.

```cpp
const LedCommand clear_event{LedId::ALL, LedEffect::OFF, {0, 0, 0, 0}, 0};
client.SetLedCommand(clear_event);
```

During integration, check the mode and effect parameters in the acknowledgments, then verify what the robot displays. See the [official LED control guide](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/en/sdk_led_control_en.md) for the full sequence.
