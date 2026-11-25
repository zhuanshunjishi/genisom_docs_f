# Genisom L2 Data Reporting

[SDK API Reference](./07-sdk-api-reference.md) | [Callbacks, Data Types, and Status](./08-callbacks-data-types-and-status-reference.md)

## Callback Registration

```cpp
void SetControlCallback(std::shared_ptr<IControlCallback> control_callback);
void SetDataCallback(std::shared_ptr<IDataCallback> data_callback);
```

| Function | Parameter and Purpose |
| --- | --- |
| `SetControlCallback()` | Pass an `IControlCallback` implementation as `control_callback` to receive command acknowledgments and device responses. |
| `SetDataCallback()` | Pass an `IDataCallback` implementation as `data_callback` to receive sensor samples, state updates, faults, and events. |

Register both before `Connect()` to receive early reports. Pass `nullptr` to unregister the corresponding callback. See [Callbacks, Data Types, and Status](./08-callbacks-data-types-and-status-reference.md).

## Data Reporting Configuration

| Function | Purpose | Parameters | Configuration ACK | Data Callback |
| --- | --- | --- | --- | --- |
| `SetImuConfig(freq)` | Configure acceleration, angular velocity, and orientation reports | `freq` sets the rate from `0` to `100` Hz. `0` disables reporting. | `OnImuConfig()` | `OnImuData()` |
| `SetLuxConfig(on)` | Configure ambient illuminance reports | `on` enables reporting at 1 Hz when `true`. | `OnLuxConfig()` | `OnLuxData()` |
| `SetMcConfig(on)` | Configure motion-control reports with pose and velocity | `on` enables reporting at 50 Hz when `true`. | `OnMcConfig()` | `OnMcData()` |
| `SetSpeedReportConfig(on, frequency)` | Configure body velocity reports | `on` enables reporting when `true`. `frequency` is the report rate, `1` to `50` Hz. | `OnSpeedReportConfig()` | `OnSpeedData()` |
| `SetJointStateConfig(on)` | Configure reports of joint names, positions, velocities, and torques | `on` enables reporting when `true`. | `OnJointStateConfig()` | `OnJointStateData()` |

For each `on` switch, pass `false` to disable the corresponding stream. Configuration ACKs confirm the settings. Samples arrive through the data callbacks. See [Common Parameters and Return Values](./07-sdk-api-reference.md#common-parameters-and-return-values) for `timeout_ms` and `handler`.
