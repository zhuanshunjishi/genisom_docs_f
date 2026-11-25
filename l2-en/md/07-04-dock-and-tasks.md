# Genisom L2 Charging Dock and Tasks

[SDK API Reference](./07-sdk-api-reference.md) | [Charging Dock Pairing](#charging-dock-pairing) | [Recharge and Undock Tasks](#recharge-and-undock-tasks)

## Charging Dock Pairing

1. Install the optional charging dock.
2. Tap the settings icon on the GenisDog home screen and open **Charging Dock** (充电桩).
3. Follow the app prompts to pair the robot with the charging dock over Bluetooth.

![Charging dock entry in GenisDog settings](../assets/operation/genisdog-connection-settings.png)

To use RoamerX Pro for autonomous recharging on Genisom L2-W Ultra, [configure a charging point on the map](./05-roamerx-pro-guide.md#configure-a-charging-point) after pairing.

### SDK Pairing (v0.2.3)

| Function | Purpose | Callback |
| --- | --- | --- |
| `SetDockScanConfig(on)` | Start Bluetooth scanning with `true` or stop it with `false`. | `OnDockScanConfig()` reports the setting. `OnDockScanResult()` reports discovered docks. |
| `ConnectDock(config)` | Connect the robot to the dock selected by `DockConnectConfig::address`. Use the Bluetooth address of a connectable dock from `OnDockScanResult()`. | `OnDockConnectionAck()` reports whether the request was accepted. `OnDockConnectionResult()` reports the final outcome. |
| `DisconnectDock()` | Disconnect the robot from the currently connected dock. | `OnDockConnectionAck()` reports whether the request was accepted. `OnDockConnectionResult()` reports the final outcome. |
| `GetDockInfo()` | Query dock identity, connection, physical contact, and charging state. | `OnDockInfo()` returns the reported state. |

Stop scanning before connecting. Wait for the final result of a connect or disconnect request before sending another. Consult [the dock callback fields](./08-callbacks-data-types-and-status-reference.md#dock-callback-data) for the different meanings of Bluetooth connection, physical contact, and active charging.

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

| Function | Purpose | Result |
| --- | --- | --- |
| `SwitchRemoteState()` | Request remote-control mode for manual or SDK operation. | `OnSwitchRemote()` acknowledges the request. Check `RobotState::machine_status` for `REMOTE`. |
| `SwitchIdleState()` | Request that the robot enter its idle operating state. | `OnSwitchIdle()` acknowledges the request. Check `RobotState::machine_status` for `IDLE`. |

## Recharge and Undock Tasks

| API | Function |
| --- | --- |
| Function | Purpose | Acknowledgment |
| --- | --- | --- |
| `StartRechargeTask()` | Request autonomous return to the dock and charging. | `OnStartRechargeTask()` |
| `StopRechargeTask()` | Request that the current return-to-dock task stop. | `OnStopRechargeTask()` |
| `StartUnDockTask()` | Request that the robot leave the dock autonomously. | `OnStartUnDockTask()` |
| `StopUnDockTask()` | Request that the current undocking task stop. | `OnStopUnDockTask()` |

For all four functions, use `OnTaskStateData()` to check the actual task state.

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
