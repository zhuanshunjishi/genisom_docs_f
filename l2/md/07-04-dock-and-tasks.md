# L2 充电桩与任务

[SDK 接口参考](./07-sdk-api-reference.md) | [回充与离桩任务流程](./09-control-ownership-tasks-and-peripherals.md#回充与离桩任务)

## 任务与机器状态

```cpp
std::error_code StartRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopRechargeTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StartUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code StopUnDockTask(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchRemoteState(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code SwitchIdleState(int timeout_ms = 0, WriteHandler handler = ...);
```

任务接口需要可用充电桩、地图和机器人端配置。任务执行状态以 `OnTaskStateData()` 为主，`RobotState::machine_status` 为辅。
