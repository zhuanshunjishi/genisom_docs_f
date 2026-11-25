# Genisom L2 Data Reporting

[SDK API Reference](./07-sdk-api-reference.md) | [Callbacks, Data Types, and Status](./08-callbacks-data-types-and-status-reference.md)

## Callback Registration

```cpp
void SetControlCallback(std::shared_ptr<IControlCallback> callback);
void SetDataCallback(std::shared_ptr<IDataCallback> callback);
```

We recommend registering callbacks before calling `Connect()` and keeping the callback objects alive through disconnection. See [Genisom L2 Callbacks, Data Types, and Status](./08-callbacks-data-types-and-status-reference.md) for callback details.

## Data Reporting Configuration

| API | Parameters | Data Callback |
| --- | --- | --- |
| `SetImuConfig(freq)` | `0` to `100` Hz. Use `0` to disable reporting. | `OnImuData()` |
| `SetLuxConfig(on)` | On/off. Reports at 1 Hz when enabled. | `OnLuxData()` |
| `SetMcConfig(on)` | On/off. Reports at 50 Hz when enabled. | `OnMcData()` |
| `SetSpeedReportConfig(on, frequency)` | `1` to `50` Hz | `OnSpeedData()` |
| `SetJointStateConfig(on)` | On/off | `OnJointStateData()` |

The corresponding `On...Config()` callbacks in `IControlCallback` report configuration acknowledgments.
