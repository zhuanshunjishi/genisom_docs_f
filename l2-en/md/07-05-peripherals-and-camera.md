# Genisom L2 Peripherals and Cameras

[SDK API Reference](./07-sdk-api-reference.md) | [Genisom L2 SDK Control Workflow](./09-control-ownership-tasks-and-peripherals.md)

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

`UpdateCameraBitrate()` changes the encoding bitrate of the selected camera stream. Pass the requested settings in `cmd`.

| `CameraBitrateCmd` Field | Purpose and Allowed Values |
| --- | --- |
| `camera_name` | Select the front camera (`camera_front`) or rear camera (`camera_back`). |
| `camera_bps` | Requested bitrate, 50000 to 100000000 bit/s. |

`OnUpdateCameraBitrateAck()` returns a `CameraBitrateAck`. Its `camera_name` identifies the stream and `camera_bps` gives the bitrate applied by the device.

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

| Function | Purpose and Result |
| --- | --- |
| `SetPeriphPower(cfg)` | Set the selected protocol power channel to the requested state. `OnSetPeriphPower()` echoes the channel and state in `PowerCtrlAck`. |
| `GetPeriphPower(cfg)` | Query the selected channel. `OnGetPeriphPower()` returns its current reported state in `PowerCtrlAck`. |

| `PowerCtrlCfg` / `PowerCtrlAck` Field | Purpose |
| --- | --- |
| `power` | Protocol channel to set or query. The SDK header defines `PeripheralPower::L2_24V` and `PeripheralPower::L2_AVIA` for Genisom L2. Confirm the connector mapping on the installed system before switching power. |
| `enable` | `true` means on and `false` means off. Set it when writing. For a query, only `cfg.power` selects the channel. Read `ack.enable` for the reported state. |

### Power Safety

- Before calling either API, verify which protocol channels correspond to the M12 connector's 24 V output and the M14 connector's VBAT output on the current system. See [Interface Functions and Specifications](./03-hardware-interfaces-and-system-architecture.md#interface-functions-and-specifications).
- The M12 connector's 24 V output and the M14 connector's VBAT output each have a total power limit of 100 W. Verify the actual VBAT voltage before connecting a peripheral.
- Check the peripheral's rated voltage, polarity, and startup current, and inspect the cable insulation before enabling power.
- Let the peripheral save its data and shut down normally before disabling the channel.
- After a successful acknowledgment, verify power at the peripheral by checking its state or measuring voltage.
- Do not substitute software switching for fuses, emergency stops, or hardware isolation.

## LED Control

### Automatic and Manual Modes

```cpp
std::error_code SetLedAutoMode(
    bool auto_mode, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetLedAutoMode(
    int timeout_ms = 0, WriteHandler handler = ...);
```

`SetLedAutoMode(auto_mode)` selects how the LED effects are controlled. Pass `true` for automatic mode or `false` for manual mode. `GetLedAutoMode()` queries the current mode. `OnSetLedAutoMode()` and `OnGetLedAutoMode()` return a `LedAutoModeAck` with the mode in `auto_mode`.

In automatic mode, the robot sets the LED effects according to its operating, warning, low-battery, and emergency stop states. In manual mode, the application can call `SetLedCommand()`.

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

`SetLedCommand(cmd)` applies an LED effect in manual mode. Read the returned settings from `LedCommandAck` in `OnSetLedCommand()`.

| `LedCommand` / `LedCommandAck` Field | Purpose |
| --- | --- |
| `id` | LED group to control. |
| `effect` | Lighting pattern for that group. |
| `color` | `LedColor` with red (`r`), green (`g`), blue (`b`), and brightness/alpha (`a`). Each component ranges from 0 to 255. |
| `duration_ms` | Effect period or blink interval in ms, depending on the effect. |

| `LedId` | Meaning |
| --- | --- |
| `ALL` | All LEDs |
| `FRONT` | Front LEDs |
| `BACK` | Rear LEDs |

| `LedEffect` | Meaning |
| --- | --- |
| `OFF` | Off |
| `ON` | Steady on |
| `BREATH` | Pulsing |
| `BLINK` | Blinking |
| `BLINK_TRANSIENT` | Brief blinking |

```cpp
LedCommand cmd{
    LedId::ALL,
    LedEffect::BLINK,
    {255, 128, 0, 255},
    300
};
client.SetLedCommand(cmd, 1000);
```

Restore automatic mode when the manual effect ends so that emergency stop, low-battery, and fault indicators can display normally.
