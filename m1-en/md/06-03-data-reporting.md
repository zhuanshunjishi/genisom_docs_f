# Data Reporting

[Overview of interfaces](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Callback Settings

Call `SetControlCallback()` to register control acknowledgments and `SetDataCallback()` to register data callbacks. See [Genisom M1 callback registration](./07-callbacks-data-types-and-status-reference.md#callback-registration-example) for callback objects, threading rules, and a registration example.

## Data Reporting Configuration

The robot reports `RobotState` and faults by default. Use the following methods to enable or configure sensor and high-frequency status reporting.

| Function | Prototype | Callback | Description |
| --- | --- | --- | --- |
| `SetImuConfig` | `std::error_code SetImuConfig(int freq, int timeout_ms = 0, WriteHandler handler = ...)` | `OnImuData` | `freq` sets the reporting frequency. Use `0` to disable reporting. |
| `SetLuxConfig` | `std::error_code SetLuxConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | `OnLuxData` | Ambient light level at a fixed 1 Hz when enabled |
| `SetMcConfig` | `std::error_code SetMcConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | `OnMcData` | Motion data at a fixed 50 Hz when enabled |
| `SetSpeedReportConfig` | `std::error_code SetSpeedReportConfig(bool on, uint32_t frequency, int timeout_ms = 0, WriteHandler handler = ...)` | `OnSpeedData` | Speed reporting at 1 to 50 Hz |
| `SetJointStateConfig` | `std::error_code SetJointStateConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | `OnJointStateData` | Enable or disable joint state reporting |

Check the corresponding configuration acknowledgment in `IControlCallback` for the applied setting.
