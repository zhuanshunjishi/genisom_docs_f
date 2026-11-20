# Genisom M1 SDK API Reference

[Return Document Overview](../index.md) | [SDK Control of processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md) | [Retrospect, data type and status reference](./07-callbacks-data-types-and-status-reference.md) | [Example program and failure check](./08-examples-and-troubleshooting.md)

## Overview of Interfaces

M1 SDK The core category is: `robot_sdk::SDKClient`, header file is `robot_sdk/sdk_client.hpp`. Control orders usually return `std::error_code`. The relationship between connection, control and mission status is described below. [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md).

| Interface Chapter | Main elements | Common interfaces |
| --- | --- | --- |
| [Connect to Device Information](./06-01-connection-and-device-info.md) | Client tectonics, connections and reconnections, version queries and machine-type capabilities | `SDKClient`, `Connect()`, `GetConnectionState()`, `GetDeviceInfo()` |
| [Robotic control](./06-02-robot-control.md) | Control, software stoppage, attitude and motion orders | `TakeControl()`, `SoftEmergencyStop()`, `StandUp()`, `Move()` |
| [Data reporting](./06-03-data-reporting.md) | Registered callback, equipped with sensors and high frequency reporting. | `SetControlCallback()`, `SetDataCallback()`, `SetImuConfig()` |
| [Dock and Tasks](./06-04-dock-and-tasks.md) | Scan for and pair charging docks, run recharge and undocking tasks, and switch the robot’s operating state | `SetDockScanConfig()`, `ConnectDock()`, `StartRechargeTask()`, `StartUnDockTask()` |
| [External and Camera](./06-05-peripherals-and-camera.md) | Lighting light, stop switch, camera code rate, external power supply and status LED | `FrontLight()`, `UpdateCameraBitrate()`, `SetPeriphPower()`, `SetLedCommand()` |

## Common Parameters and Return Values {#common-parameters-and-return-values}

Except for `Connect()`, `Disconnect()`, status query and version query interfaces, command interfaces usually contain the following common parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `timeout_ms` | `int` | `0` denotes a different step; greater than `0` denotes a synchronized wait in milliseconds |
| `handler` | `WriteHandler` | Callback that receives the send result in asynchronous mode |

```cpp
using WriteHandler =
    std::function<void(const std::error_code&, std::size_t)>;
```

Return value:

- In step mode, the function returns immediately and the subsequent result returns by `handler`.
- In Sync mode, the function blocks the result of this call or timeout, which is expressed in the returned `std::error_code`.
- Whether or not the robot actually executes the command depends on the corresponding control response, state correction or `RobotState`.

Common error:

| Error | Integer Value | Meaning |
| --- | ---: | --- |
| `robot_sdk::Errc::Success` | 0 | Success |
| `robot_sdk::Errc::ShakeHandFailed` | 10000 | The handshake failed. |
| `robot_sdk::Errc::ProtocolMismatch` | 10001 | The protocol version does not match |
| `robot_sdk::Errc::ControlledDenial` | 10002 | Control denied |
| `robot_sdk::Errc::ConnectFailed` | 10003 | Connection failed |
| `robot_sdk::Errc::UnsupportedDeviceOperation` | 10004 | The current type does not support this operation |
| `robot_sdk::Errc::UnknownError` | 19999 | Unclassified SDK Errors |
| `std::errc::invalid_argument` | — | Invalid parameter crossing or combination of parameters |
| `std::errc::not_connected` | — | Connection not yet established |
| `std::errc::timed_out` | — | Waiting for timeout |
| `std::errc::operation_canceled` | — | Operation cancelled |
| `std::errc::operation_in_progress` | — | The same operation is ongoing. |

### Judgment and Record SDK Error

The application can be directly compared to `robot_sdk::Errc` count. `Errc::UnsupportedDeviceOperation` It can also be judged by standard error conditions `std::errc::operation_not_supported`.

```cpp
// ec returns std::error_code for the SDK interface.
if (ec) {
    std::cerr << ec.category().name() << " [" << ec.value()
              << "] " << ec.message() << '\n';
    if (ec == robot_sdk::Errc::UnsupportedDeviceOperation) {
        // Disables the function by current type.
    }
}
```

SDK-specific errors use the `Robot` category. If recharging or undocking fails, see [task error codes](./07-callbacks-data-types-and-status-reference.md#docking-and-undocking-error-codes). For more detail, see the [official SDK error code reference (Chinese)](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_error_zh.md).
