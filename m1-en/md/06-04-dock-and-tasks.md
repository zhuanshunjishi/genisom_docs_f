# Dock and Tasks

[API overview](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Dock Pairing {#dock-pairing}

The `timeout_ms` and `handler` parameters follow the [common parameter rules](./06-sdk-api-reference.md#common-parameters-and-return-values).

| Function prototype | Protocol type | Acknowledgment and result |
| --- | --- | --- |
| `std::error_code SetDockScanConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | 1008 (`target=302`) | `OnDockScanConfig()` confirms whether scanning started or stopped. `OnDockScanResult()` reports discovered devices (1018). |
| `std::error_code ConnectDock(const DockConnectConfig& config, int timeout_ms = 0, WriteHandler handler = ...)` | 1022 | Select the charging dock with `config.address`. Check `OnDockConnectionAck()` to determine whether the request was accepted and `OnDockConnectionResult()` for the final outcome (1024). |
| `std::error_code GetDockInfo(int timeout_ms = 0, WriteHandler handler = ...)` | 1023 | `OnDockInfo()` returns charging dock information and its connection, contact, and charging states. |
| `std::error_code DisconnectDock(int timeout_ms = 0, WriteHandler handler = ...)` | 1022 | Disconnect the current charging dock. The acknowledgment and result callbacks are the same as for connecting. |

See [Dock Pairing](./05-sdk-control-flow-and-task-handling.md#dock-pairing) for the call sequence and [Dock Data](./07-callbacks-data-types-and-status-reference.md#dock-data) for field definitions.

## Task and Robot States {#task-and-robot-states}

```cpp
std::error_code StartRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StartUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchRemoteState(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchIdleState(int timeout_ms = 0, WriteHandler handler = ...);
```

| Function | Behavior |
| --- | --- |
| `StartRechargeTask` | Start an autonomous recharge task |
| `StopRechargeTask` | Stop the autonomous recharge task |
| `StartUnDockTask` | Start an autonomous undocking task |
| `StopUnDockTask` | Stop the autonomous undocking task |
| `SwitchRemoteState` | Switch to the remote-control state |
| `SwitchIdleState` | Switch to the idle state |

Check the return value or `WriteHandler` for the command send result. `IControlCallback` delivers the device acknowledgment. Use `OnTaskStateData()` to track progress and confirm completion.

See [Docking and Undocking Tasks](./05-sdk-control-flow-and-task-handling.md#docking-and-undocking-tasks) for the complete workflow.
