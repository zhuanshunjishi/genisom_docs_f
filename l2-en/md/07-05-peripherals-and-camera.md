# Genisom L2 Peripherals and Cameras

[SDK API Reference](./07-sdk-api-reference.md) | [Genisom L2 SDK Control Workflow](./09-control-ownership-tasks-and-peripherals.md)

## Lighting APIs

Fill lights provide illumination. [Status LEDs](#led-control) indicate device states, warnings, tasks, or user events and have their own control mode.

```cpp
std::error_code FrontLight(
    bool on, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
std::error_code AutoModeLight(
    bool on, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

| API | Purpose | Device Acknowledgment | `RobotState` Field |
| --- | --- | --- | --- |
| `FrontLight()` | Turn the front fill light on or off | `OnFrontLight(bool on)` | `front_fill_light` |
| `AutoModeLight()` | Enable or disable automatic fill lighting | `OnAutoModeLight(bool on)` | `auto_mode_light` |

For both functions, set `on` to `true` to enable the feature or `false` to disable it. Turning the front fill light on or off manually disables automatic fill lighting. Read the current state from [RobotState reports](./08-callbacks-data-types-and-status-reference.md#robotstate).

The Genisom L2 series does not support `BackLight()` (rear fill light). Calling it returns `Errc::UnsupportedDeviceOperation` without sending the command.

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

<a id="peripheral-power"></a>

## Peripheral Power Control

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

`PowerCtrlCfg` contains the power channel `power` and the on/off setting `enable`. `SetPeriphPower()` controls the protocol power channel. `GetPeriphPower()` queries the channel state. `OnSetPeriphPower()` and `OnGetPeriphPower()` report the respective results.

### Power Safety

- Before calling either API, verify which protocol channels correspond to the M12 connector's 24 V output and the M14 connector's VBAT output on the current system. See [Interface Functions and Specifications](./03-hardware-interfaces-and-system-architecture.md#interface-functions-and-specifications).
- The M12 connector's 24 V output and the M14 connector's VBAT output each have a total power limit of 100 W. Verify the actual VBAT voltage before connecting a peripheral.
- Check the peripheral's rated voltage, polarity, and startup current, and inspect the cable insulation before enabling power.
- Let the peripheral save its data and shut down normally before disabling the channel.
- After a successful acknowledgment, verify power at the peripheral by checking its state or measuring voltage.
- Do not substitute software switching for fuses, emergency stops, or hardware isolation.

## LED Control

Genisom L2 series models pass the SDK capability check for all three status LED APIs. The available LED groups depend on the device configuration. [API Support by Model](./07-sdk-api-reference.md#api-support-by-model)

### APIs and Acknowledgments

#### SetLedAutoMode

```cpp
std::error_code SetLedAutoMode(
    bool auto_mode, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Set `auto_mode` to `true` for automatic mode or `false` for manual mode. Read `ack.auto_mode` in `OnSetLedAutoMode(const LedAutoModeAck& ack)` to confirm the mode acknowledged by the device.

#### GetLedAutoMode

```cpp
std::error_code GetLedAutoMode(
    int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

`OnGetLedAutoMode(const LedAutoModeAck& ack)` reports the current mode. `ack.auto_mode` is `true` for automatic mode and `false` for manual mode.

#### SetLedCommand

```cpp
std::error_code SetLedCommand(
    const LedCommand& cmd, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

The SDK immediately returns `std::errc::invalid_argument` if `cmd.id` is `LedId::UNKNOWN` or `cmd.effect` is `LedEffect::UNKNOWN`. `OnSetLedCommand(const LedCommandAck& ack)` reports the device's acknowledgment of the group, effect, color, and period.

Register an [`IControlCallback`](./08-callbacks-data-types-and-status-reference.md#icontrolcallback) with `SetControlCallback()` before issuing commands. With `timeout_ms == 0`, check the function return value for submission and `WriteHandler` for the asynchronous send result. With `timeout_ms > 0`, the SDK waits for sending to complete or time out and returns that result. Check the control acknowledgment for the device result and observe the LEDs to verify the displayed effect.

### LED Groups, Effects, and Parameters

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

| `LedCommand` Field | Description |
| --- | --- |
| `id` | Status LED group |
| `effect` | Lighting effect |
| `color` | RGBA color with `r`, `g`, `b`, and `a` each ranging from 0 to 255 |
| `duration_ms` | Period or blink interval in ms. Use `0` for `OFF` and `ON` in typical cases. For breathing or blinking effects, set the intended period or interval, such as 300 ms. |

| `LedId` | Meaning |
| --- | --- |
| `ALL` | All LEDs |
| `FRONT` | Front LEDs |
| `BACK` | Rear status LED group |

| `LedEffect` | Protocol Value | Meaning |
| --- | --- | --- |
| `OFF` | `off` | Off |
| `ON` | `on` | Steady on |
| `BREATH` | `breath` | Pulsing |
| `BLINK` | `blink` | Blinking |
| `BLINK_TRANSIENT` | `blink_transient` | Brief blinking |

### Automatic and Manual Modes

| Mode | How to Use It |
| --- | --- |
| Manual | Call `SetLedAutoMode(false)` and wait for `OnSetLedAutoMode()` to report `ack.auto_mode == false` before calling `SetLedCommand()`. The application manages the LED state. The device stops switching effects based on its operating state. |
| Automatic | Call `SetLedAutoMode(true)` and wait for `OnSetLedAutoMode()` to report `ack.auto_mode == true`. The device manages effects according to states and events. `SetLedCommand()` submits a user event. |

The table shows the official guide's reference priority order in automatic mode. The device decides whether an effect appears, how long it stays visible, and when a higher-priority event preempts it.

| Priority (Highest First) | Event |
| --- | --- |
| 1 | System fault or emergency stop |
| 2 | Warning |
| 3 | Low battery |
| 4 | User LED event |
| 5 | Task execution state |
| 6 | Normal operation |

### Usage Examples

To test a custom effect, call `SetLedAutoMode(false)` and wait for the manual-mode acknowledgment before sending the LED command. This example makes all status LEDs blink orange at a 300 ms interval.

```cpp
const LedCommand manual_effect{LedId::ALL, LedEffect::BLINK, {255, 128, 0, 255}, 300};
client.SetLedCommand(manual_effect);
```

After manual testing, call `SetLedAutoMode(true)` and confirm the acknowledgment to restore device status indications. In automatic mode, this command requests a brief blue blink. The device decides whether to display it.

```cpp
const LedCommand user_event{LedId::ALL, LedEffect::BLINK_TRANSIENT, {0, 0, 255, 255}, 500};
client.SetLedCommand(user_event);
```

To clear a user LED event in automatic mode, send an `OFF` command for all status LEDs. The device continues to handle other states and events in automatic mode.

```cpp
const LedCommand clear_event{LedId::ALL, LedEffect::OFF, {0, 0, 0, 255}, 0};
client.SetLedCommand(clear_event);
```

During integration, query the current mode with `GetLedAutoMode()`, check the device acknowledgments, and observe the LEDs. [SDK Example](./10-examples-and-troubleshooting.md#led-cpp) · [Official LED Guide](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/en/sdk_led_control_en.md)
