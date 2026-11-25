# Genisom L2 Charging Dock and Tasks

[SDK API Reference](./07-sdk-api-reference.md) | [Recharge and Undocking Tasks](./09-control-ownership-tasks-and-peripherals.md#recharge-and-undock-tasks)

## Tasks and Machine States

```cpp
std::error_code StartRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StartUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchRemoteState(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchIdleState(int timeout_ms = 0, WriteHandler handler = ...);
```

The task APIs require an available charging dock, a map, and configuration on the robot. Use `OnTaskStateData()` as the primary source of task status and `RobotState::machine_status` for additional context.
