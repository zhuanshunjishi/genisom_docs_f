# Dock and Tasks

[Overview of interfaces](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Dock Pairing {#dock-pairing}

The following interfaces are provided by SDK v0.2.3, `timeout_ms` and `handler` comply [General parameter rules](./06-sdk-api-reference.md#common-parameters-and-return-values).

| Function Prototype | Type of agreement | Response and results |
| --- | --- | --- |
| `std::error_code SetDockScanConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | 1008 (`target=302`) | `OnDockScanConfig()` Confirm opening or stopping scanning, `OnDockScanResult()` report equipment found (1018) |
| `std::error_code ConnectDock(const DockConnectConfig& config, int timeout_ms = 0, WriteHandler handler = ...)` | 1022 | Adopt `config.address` designated recharging dock. Examination `OnDockConnectionAck()` of admissibility results and `OnDockConnectionResult()` final results (1024) |
| `std::error_code GetDockInfo(int timeout_ms = 0, WriteHandler handler = ...)` | 1023 | `OnDockInfo()` Return charger information and connection, exposure and charge state |
| `std::error_code DisconnectDock(int timeout_ms = 0, WriteHandler handler = ...)` | 1022 | Disconnect the current charge stake, use the same response and result as the connection |

For the order of call see [Charge pillar pairing process](./05-sdk-control-flow-and-task-handling.md#dock-pairing) and the description of the field is [Dock data](./07-callbacks-data-types-and-status-reference.md#dock-data).

## Task and Robot States {#task-and-robot-states}

```cpp
std::error_code StartRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StartUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchRemoteState(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchIdleState(int timeout_ms = 0, WriteHandler handler = ...);
```

| Functions | Functions |
| --- | --- |
| `StartRechargeTask` | Start an autonomous recharge task |
| `StopRechargeTask` | Stop Autoback Task |
| `StartUnDockTask` | Commencing the self-deposition mission. |
| `StopUnDockTask` | Stop the auto-departure. |
| `SwitchRemoteState` | Switch to Remote Control |
| `SwitchIdleState` | Switch to Free Status |

The command sent results are obtained by the return value or `WriteHandler`; the command answer is obtained by `IControlCallback`; the task execution process and final state is obtained by `OnTaskStateData()`. Do not " send the order " as " the task has been completed ".

Full processing processes for charging, ioning and state switching are presented in [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md#docking-and-undocking-tasks).
