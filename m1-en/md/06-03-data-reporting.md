# Data Reporting

[Overview of interfaces](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Callback Settings

`SetControlCallback()` This is not the first time that I've been able to do this. `SetDataCallback()` Register data back. Call back objects, thread rules, and examples of registrations [M1 callbacks, data types, and status reference](./07-callbacks-data-types-and-status-reference.md#callback-registration-example).

## Data Reporting Configuration

The robot defaults to report voluntarily. `RobotState` The following interfaces are used to open or adjust sensor and high frequency status data:

| Functions | Prototype | Rewind | Description |
| --- | --- | --- | --- |
| `SetImuConfig` | `std::error_code SetImuConfig(int freq, int timeout_ms = 0, WriteHandler handler = ...)` | `OnImuData` | `freq` for reporting frequency, `0` means closed |
| `SetLuxConfig` | `std::error_code SetLuxConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | `OnLuxData` | Light strength, fixed when open 1 Hz |
| `SetMcConfig` | `std::error_code SetMcConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | `OnMcData` | Motion data, fixed after opening 50 Hz |
| `SetSpeedReportConfig` | `std::error_code SetSpeedReportConfig(bool on, uint32_t frequency, int timeout_ms = 0, WriteHandler handler = ...)` | `OnSpeedData` | Speed to report frequency 1 to 50 Hz |
| `SetJointStateConfig` | `std::error_code SetJointStateConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | `OnJointStateData` | The switch is reported. |

The validity of the configuration command is obtained by the corresponding configuration call in `IControlCallback`.
