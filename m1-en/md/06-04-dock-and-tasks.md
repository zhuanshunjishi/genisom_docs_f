# Dock and Tasks

[API overview](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values) | [Switching Between Remote and Idle States](./05-sdk-control-flow-and-task-handling.md#switching-between-remote-and-idle-states)

## Dock Pairing {#dock-pairing}

### Pairing Procedure

SDK v0.2.3 supports scanning for, connecting to, querying, and disconnecting BLE charging docks. Verify that the robot system supports pairing, then register the data and control callbacks and run the following from the application thread.

1. Call `SetDockScanConfig(true)`. Wait for `OnDockScanConfig(true)` to confirm scanning has started.
2. Use `OnDockScanResult()` to receive scan reports and update the device list by address. Select a dock whose `connectable` is `true` and save its address.
3. Call `SetDockScanConfig(false)`. When scanning has stopped, set `DockConnectConfig::address` to the selected address and call `ConnectDock()`.
4. Check `accepted` in `OnDockConnectionAck()`. If the request was accepted, wait for `OnDockConnectionResult()` and check `success` and `error_code`.
5. After pairing, call `GetDockInfo()` and check `dock_connected`, `has_contact`, and `charging_active` in `OnDockInfo()`.

To disconnect, call `DisconnectDock()` and wait for both the acknowledgment and the final result.

Run one connection or disconnection operation at a time. Check the API return value and `WriteHandler` for the call and send results, then use `OnDockConnectionResult()` for the final pairing result. During autonomous docking or undocking, `OnTaskStateData()` reports progress and the final result.

See [Dock Data](./07-callbacks-data-types-and-status-reference.md#dock-data) for field definitions and the [Dock Pairing Example](./08-examples-and-troubleshooting.md#dock-pairing-example) for a complete example.

### Dock Pairing APIs

The `timeout_ms` and `handler` parameters follow the [common parameter rules](./06-sdk-api-reference.md#common-parameters-and-return-values).

| Function prototype | Protocol type | Acknowledgment and result |
| --- | --- | --- |
| `std::error_code SetDockScanConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | 1008 (`target=302`) | `OnDockScanConfig()` confirms whether scanning started or stopped. `OnDockScanResult()` reports discovered devices (1018). |
| `std::error_code ConnectDock(const DockConnectConfig& config, int timeout_ms = 0, WriteHandler handler = ...)` | 1022 | Select the charging dock with `config.address`. Check `OnDockConnectionAck()` to determine whether the request was accepted and `OnDockConnectionResult()` for the final outcome (1024). |
| `std::error_code GetDockInfo(int timeout_ms = 0, WriteHandler handler = ...)` | 1023 | `OnDockInfo()` returns charging dock information and its connection, contact, and charging states. |
| `std::error_code DisconnectDock(int timeout_ms = 0, WriteHandler handler = ...)` | 1022 | Disconnect the current charging dock. The acknowledgment and result callbacks are the same as for connecting. |

## Docking and Undocking Tasks {#docking-and-undocking-tasks}

### Task APIs {#task-and-robot-states}

```cpp
std::error_code StartRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StartUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
```

| Function | Purpose |
| --- | --- |
| `StartRechargeTask()` | Start autonomous docking for charging |
| `StopRechargeTask()` | Stop the autonomous docking task |
| `StartUnDockTask()` | Start autonomous undocking |
| `StopUnDockTask()` | Stop autonomous undocking |

Check the return value or `WriteHandler` for the command send result. The robot acknowledges the start or stop request through `IControlCallback`, for example through `OnStartRechargeTask()`. Use `OnTaskStateData()` to track task execution and confirm the final result.

```cpp
void OnTaskStateData(const TaskStateInfo& info) override {
    if (info.task_type == TaskType::RECHARGING) {
        // Processing task status according to info.task_status and info.error_code
    }
}
```

### Recharge Task States

After calling `StartRechargeTask()`, the recharge task may report the following states.

- `STARTING`: Task is starting.
- `RUNNING`: Task is running.
- `FAILURE`: Task failed to start or complete. Check `TaskStateInfo::error_code`.

The recharge task does not transition to `SUCCESS` on its own. To end it, call `StopRechargeTask()` and wait for `TaskType::RECHARGING` to reach `STOPPED`. Use `OnStartRechargeTask()`, `TaskStateInfo`, and `MachineStatus::RECHARGE` together to determine whether the task is running.

### Undocking Task States

After `StartUnDockTask()`, the task may progress through `STARTING -> RUNNING -> SUCCESS`. If it fails, it transitions to `FAILURE`. `TaskType::UNDOCK` with `TaskStatus::SUCCESS` confirms that undocking completed.

To stop undocking in progress, call `StopUnDockTask()` and wait for `TaskType::UNDOCK` to reach `STOPPED`.

See [Task APIs](#task-and-robot-states) and the [task state structure](./07-callbacks-data-types-and-status-reference.md#task-state).

See the SDK guide for [recharge, undocking, and dock calibration requirements and troubleshooting](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_recharge_undock_calibration_conditions_zh.md).
