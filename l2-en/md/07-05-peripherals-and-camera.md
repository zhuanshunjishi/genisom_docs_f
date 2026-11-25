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

### Automatic and Manual Modes

```cpp
std::error_code SetLedAutoMode(
    bool auto_mode, int timeout_ms = 0, WriteHandler handler = ...);
std::error_code GetLedAutoMode(
    int timeout_ms = 0, WriteHandler handler = ...);
```

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

`LedCommand` specifies the LED group, lighting effect, RGBA color, and duration.

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
