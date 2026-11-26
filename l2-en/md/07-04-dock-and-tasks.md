# Genisom L2 Charging Dock and Tasks

[SDK API Reference](./07-sdk-api-reference.md) | [Charging Dock Pairing](#charging-dock-pairing) | [Recharge and Undock Tasks](#recharge-and-undock-tasks)

## Charging Dock Pairing

### Pairing with the App

1. Install the optional charging dock.
2. Tap the settings icon on the GenisDog home screen and open **Charging Dock** (充电桩).
3. Follow the app prompts to pair the robot with the charging dock over Bluetooth.

![Charging dock entry in GenisDog settings](../assets/operation/genisdog-connection-settings.png)

To use RoamerX Pro for autonomous recharging on Genisom L2-W Ultra, [configure a charging point on the map](./05-roamerx-pro-guide.md#configure-a-charging-point) after pairing.

### Pairing with the SDK

Confirm the robot system supports Bluetooth pairing through the SDK and power on the charging dock. Register `IDataCallback` and `IControlCallback` before connecting to the robot.

| API | Callbacks |
| --- | --- |
| `SetDockScanConfig(bool on, int timeout_ms = 0, WriteHandler handler = ...)` | `OnDockScanConfig()` confirms the scan setting. `OnDockScanResult()` reports discovered docks. |
| `ConnectDock(const DockConnectConfig& config, int timeout_ms = 0, WriteHandler handler = ...)` | `OnDockConnectionAck()` reports acceptance. `OnDockConnectionResult()` reports the final outcome. |
| `GetDockInfo(int timeout_ms = 0, WriteHandler handler = ...)` | `OnDockInfo()` reports charging dock information. |
| `DisconnectDock(int timeout_ms = 0, WriteHandler handler = ...)` | `OnDockConnectionAck()` reports acceptance. `OnDockConnectionResult()` reports the final outcome. |

1. Call `SetDockScanConfig(true)` and wait for `OnDockScanConfig(true)`. Select a dock with `connectable` set to `true` in `OnDockScanResult()` and save its `address`. Update the device list by address as scan results arrive.
2. Call `SetDockScanConfig(false)` and wait for the acknowledgment. Set `DockConnectConfig::address` to the selected address and call `ConnectDock()`.
3. Check `accepted` in `OnDockConnectionAck()`. Once the robot accepts the request, wait for `OnDockConnectionResult()` and check `success` for the final outcome. If either stage fails, log the `error_code` from the corresponding callback.
4. Call `GetDockInfo()` and check `dock_connected`, `has_contact`, and `charging_active` in `OnDockInfo()` for Bluetooth connection, physical contact, and charging, respectively.
5. To end the Bluetooth connection, call `DisconnectDock()` and check the acknowledgment and final result. You can call `GetDockInfo()` again to confirm that `dock_connected` is `false`.

Run only one connect or disconnect operation at a time. For an asynchronous call, the return value reports request submission and `WriteHandler` reports the send result. Use `OnDockConnectionResult()` to determine the pairing outcome.

For the commands to run, see the [`dock_pairing` example](./10-examples-and-troubleshooting.md#charging-dock-pairing-example). For callback categories, see the [Callback Reference](./08-callbacks-data-types-and-status-reference.md).

## Tasks and Machine States

```cpp
std::error_code StartRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StartUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchRemoteState(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchIdleState(int timeout_ms = 0, WriteHandler handler = ...);
```

The task APIs require an available charging dock, a map, and configuration on the robot. Use `OnTaskStateData()` as the primary source of task status and `RobotState::machine_status` for additional context. For state transitions, see [Remote and Idle States](./09-control-ownership-tasks-and-peripherals.md#remote-and-idle-states).

## Recharge and Undock Tasks

| API | Function |
| --- | --- |
| `StartRechargeTask()` | Start autonomous recharging |
| `StopRechargeTask()` | Stop the recharge task |
| `StartUnDockTask()` | Start autonomous undocking |
| `StopUnDockTask()` | Stop the undock task |

### Send, Acknowledgment, and Execution Results

| Stage | How to Check | What It Confirms |
| --- | --- | --- |
| Send | Return value or `WriteHandler` | Whether the command was sent |
| Acknowledgment | `OnStartRechargeTask()` or the corresponding callback | Whether the robot acknowledged the command |
| Execution | `OnTaskStateData()` | Whether the task is starting, running, successful, failed, or stopped |

```cpp
void OnTaskStateData(const TaskStateInfo& info) override {
    if (info.task_type == TaskType::RECHARGING) {
        if (info.task_status == TaskStatus::FAILURE) {
            // Log info.error_code and enter the application's safety handling routine
        }
    }
}
```

### Checking Recharge Progress

After starting a recharge task, check the following.

- `task_type == TaskType::RECHARGING`.
- Whether `task_status` changes to `STARTING` or `RUNNING`.
- `RobotState::machine_status == MachineStatus::RECHARGE`.
- Whether `RobotState::charging_pile_connected` becomes `true` after docking.
- Whether the battery status changes to `PowerSupplyStatus::CHARGING`.

A successful return from the API does not confirm that the robot has reached the charging dock or started charging.

### Checking Undock Progress

After starting an undock task, check the following.

- `task_type == TaskType::UNDOCK`.
- Whether `task_status` progresses through `STARTING` and `RUNNING` and reaches `SUCCESS`.
- `RobotState::machine_status == MachineStatus::UNDOCK`.
- Whether the dock connection status clears once the robot has undocked.

### Task Prerequisites and Operating Conditions

- Verify that the charging dock has power, Bluetooth pairing is active, and the map's charging point is valid.
- Align the charging point's orientation with the physical charging dock.
- Keep the cameras and LiDAR clear of obstructions.
- Do not send regular motion commands such as `Move()` during a recharge or undock task.
- If a task fails, record `phase`, `error_code`, the machine state, and the battery state.
