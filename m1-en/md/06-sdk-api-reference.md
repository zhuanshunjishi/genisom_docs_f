# Genisom M1 SDK API Reference

[Return Document Overview](../index.md) | [SDK Control of processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md) | [Retrospect, data type and status reference](./07-callbacks-data-types-and-status-reference.md) | [Example program and failure check](./08-examples-and-troubleshooting.md)

## Overview of Interfaces

The core class in the Genisom M1 SDK is `robot_sdk::SDKClient`, declared in `robot_sdk/sdk_client.hpp`. Control commands typically return `std::error_code`. Check the send result and the robot’s execution result separately. See [Control Flow and Task Handling](./05-sdk-control-flow-and-task-handling.md) for how connection, control ownership, and task state interact.

| Interface Chapter | Main elements | Common interfaces |
| --- | --- | --- |
| [Connect to Device Information](./06-01-connection-and-device-info.md) | Client construction, connection and reconnection, version queries, and model capabilities | `SDKClient`, `Connect()`, `GetConnectionState()`, `GetDeviceInfo()` |
| [Robotic control](./06-02-robot-control.md) | Control ownership, software emergency stop, and posture and motion commands | `TakeControl()`, `SoftEmergencyStop()`, `StandUp()`, `Move()` |
| [Data reporting](./06-03-data-reporting.md) | Register callbacks and configure sensor and high-frequency status reporting | `SetControlCallback()`, `SetDataCallback()`, `SetImuConfig()` |
| [Dock and Tasks](./06-04-dock-and-tasks.md) | Scan for and pair charging docks, run recharge and undocking tasks, and switch the robot’s operating state | `SetDockScanConfig()`, `ConnectDock()`, `StartRechargeTask()`, `StartUnDockTask()` |
| [External and Camera](./06-05-peripherals-and-camera.md) | Fill lights, obstacle stop, camera bitrate, peripheral power, and status LEDs | `FrontLight()`, `UpdateCameraBitrate()`, `SetPeriphPower()`, `SetLedCommand()` |

## Common Parameters and Return Values {#common-parameters-and-return-values}

Except for `Connect()`, `Disconnect()`, status query and version query interfaces, command interfaces usually contain the following common parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `timeout_ms` | `int` | `0` sends asynchronously. A value greater than `0` sets a synchronous wait in milliseconds. |
| `handler` | `WriteHandler` | Callback that receives the send result in asynchronous mode |

```cpp
using WriteHandler =
    std::function<void(const std::error_code&, std::size_t)>;
```

Return value:

- In asynchronous mode, the function returns immediately. The callback `handler` receives the send result.
- In synchronous mode, the function blocks until the call completes or times out. The returned `std::error_code` reports the result.
- Check the corresponding control acknowledgment, status callback, or `RobotState` to determine whether the robot executed the command.

Common error:

| Error | Integer Value | Meaning |
| --- | ---: | --- |
| `robot_sdk::Errc::Success` | 0 | Success |
| `robot_sdk::Errc::ShakeHandFailed` | 10000 | The handshake failed. |
| `robot_sdk::Errc::ProtocolMismatch` | 10001 | The protocol version does not match |
| `robot_sdk::Errc::ControlledDenial` | 10002 | Control denied |
| `robot_sdk::Errc::ConnectFailed` | 10003 | Connection failed |
| `robot_sdk::Errc::UnsupportedDeviceOperation` | 10004 | The current model does not support this operation |
| `robot_sdk::Errc::UnknownError` | 19999 | Unclassified SDK error |
| `std::errc::invalid_argument` | — | Parameter out of range or invalid parameter combination |
| `std::errc::not_connected` | — | Connection not yet established |
| `std::errc::timed_out` | — | Timed out |
| `std::errc::operation_canceled` | — | Operation cancelled |
| `std::errc::operation_in_progress` | — | The same operation is ongoing. |

### Interpreting and Logging SDK Errors {#judgment-and-record-sdk-error}

Compare the result directly with a `robot_sdk::Errc` enum value. You can also check `Errc::UnsupportedDeviceOperation` using the standard error condition `std::errc::operation_not_supported`.

```cpp
// ec returns std::error_code for the SDK interface.
if (ec) {
    std::cerr << ec.category().name() << " [" << ec.value()
              << "] " << ec.message() << '\n';
    if (ec == robot_sdk::Errc::UnsupportedDeviceOperation) {
        // Disable the feature for the current model.
    }
}
```

SDK-specific errors use the `Robot` category. If recharging or undocking fails, see [task error codes](./07-callbacks-data-types-and-status-reference.md#docking-and-undocking-error-codes). For more detail, see the [official SDK error code reference (Chinese)](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_error_zh.md).
