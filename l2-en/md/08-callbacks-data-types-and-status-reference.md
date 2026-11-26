# Genisom L2 Callbacks, Data Types, and Status

[Documentation Overview](../index.md) | [SDK API Reference](./07-sdk-api-reference.md) | [Genisom L2 SDK Control Workflow](./09-control-ownership-tasks-and-peripherals.md)

## Callback Model

The SDK provides two callback base classes.

| Base Class | Purpose | Registration API |
| --- | --- | --- |
| `IDataCallback` | Robot state, sensor data, faults, control ownership events, and task status | `SetDataCallback()` |
| `IControlCallback` | Acknowledgments for control, configuration, and task commands | `SetControlCallback()` |

We recommend registering callbacks before calling `Connect()` and using `std::shared_ptr` to keep callback objects alive.

## Callback Thread Requirements

Callbacks run on the SDK's I/O thread.

1. **Keep callbacks lightweight.** Copy and validate data, update simple state, or enqueue messages. Run file I/O, database operations, and complex calculations on an application worker thread.
2. **Run synchronous SDK calls on an application worker thread.** This includes `Connect(..., true)`, `Disconnect(true)`, and commands with `timeout_ms > 0`. These calls depend on the SDK I/O thread processing more events. Calling them from a callback blocks that thread and can cause a timeout.
3. **Protect shared data.** Callbacks run concurrently with application threads. Use atomic variables, mutexes, or thread-safe queues to prevent data races, and avoid long waits for locks.
4. **Handle exceptions inside the callback.** Do not let exceptions escape the callback boundary.

## IDataCallback

```cpp
class IDataCallback {
public:
    virtual void OnImuData(const ImuData& data) {}
    virtual void OnLuxData(const LuxData& data) {}
    virtual void OnMcData(const MotionData& data) {}
    virtual void OnSpeedData(const SpeedData& data) {}
    virtual void OnJointStateData(const JointStateData& data) {}
    virtual void OnRobotStateData(const RobotState& data) {}
    virtual void OnFaultData(const FaultDatas& data) {}
    virtual void OnControlLost(const ControlLostInfo& info) {}
    virtual void OnControlAvailable(const ControlAvailableInfo& info) {}
    virtual void OnTaskStateData(const TaskStateInfo& info) {}
    virtual void OnDockScanResult(const DockScanResult& result) {}
    virtual void OnDockConnectionResult(const DockConnectionResult& result) {}
};
```

| Callback | Trigger |
| --- | --- |
| `OnRobotStateData()` | The robot reports its state automatically at about 1 Hz. |
| `OnFaultData()` | A fault occurs or changes. |
| `OnImuData()` | After `SetImuConfig()`, at the configured rate |
| `OnLuxData()` | After `SetLuxConfig(true)`, at about 1 Hz |
| `OnMcData()` | After `SetMcConfig(true)`, at about 50 Hz |
| `OnSpeedData()` | After `SetSpeedReportConfig()`, at the configured rate |
| `OnJointStateData()` | After `SetJointStateConfig(true)` |
| `OnControlLost()` | The SDK loses control. |
| `OnControlAvailable()` | Control is available to request again. |
| `OnTaskStateData()` | Task status changes. |
| `OnDockScanResult()` | Reports charging docks discovered during a scan |
| `OnDockConnectionResult()` | Reports the final result of connecting to or disconnecting from a charging dock |

## IControlCallback

Control callbacks acknowledge that the robot has received a command. The table lists the main categories.

| Category | Callbacks |
| --- | --- |
| Safety and Posture | `OnSoftEmergencyStop()`, `OnStandUp()`, `OnWalk()`, `OnBalanceStandUp()`, `OnLieDown()`, `OnStair()`, `OnCrawl()`, `OnCrawlWalk()`, `OnClimb()`, `OnGait()`, `OnPosControl()`, `OnLocked()` |
| Speed and Lighting | `OnSpeed()`, `OnFrontLight()`, `OnAutoModeLight()` |
| Data Configuration | `OnLuxConfig()`, `OnImuConfig()`, `OnMcConfig()`, `OnSpeedReportConfig()`, `OnJointStateConfig()` |
| Control Ownership | `OnTakeControlAck()`, `OnReleaseControlAck()` |
| Cameras | `OnUpdateCameraBitrateAck()` |
| State Switching | `OnSwitchRemote()`, `OnSwitchIdle()` |
| [Charging Dock Pairing](./07-04-dock-and-tasks.md#pairing-with-the-sdk) | `OnDockScanConfig(bool on)`, `OnDockConnectionAck(const DockConnectionAck& ack)`, `OnDockInfo(const DockInfo& info)` |
| Charging Tasks | `OnStartRechargeTask()`, `OnStopRechargeTask()`, `OnStartUnDockTask()`, `OnStopUnDockTask()` |
| Peripheral Power | `OnSetPeriphPower()`, `OnGetPeriphPower()` |
| LED | `OnSetLedAutoMode()`, `OnGetLedAutoMode()`, `OnSetLedCommand()` |

The header also defines callbacks for some unsupported APIs. Calls to those APIs return `Errc::UnsupportedDeviceOperation` locally without a robot acknowledgment.

## DeviceInfo

```cpp
struct DeviceInfo {
    DeviceType device_type = DeviceType::UNKNOWN;
    std::string sn;
};
```

| Model or Device Configuration | `DeviceType` |
| --- | --- |
| Genisom L2 | `L2F` |
| Genisom L2-W | `L2` |
| Genisom L2-W Ultra | `L2_ULTRA` |

`device_type` is `UNKNOWN` before a successful connection, after disconnection, or when the handshake does not return a device type.

## Sensor and Motion Data

### ImuData

```cpp
struct ImuData {
    float acc_x, acc_y, acc_z;
    float gyro_x, gyro_y, gyro_z;
    float quat_x, quat_y, quat_z, quat_w;
};
```

This structure contains three-axis acceleration, three-axis angular velocity, and a quaternion. When logging IMU data, record the reception time and check quaternion validity in the application.

### MotionData

```cpp
struct MotionData {
    float quat[4];
    float v_world[3];
    float position[3];
    float omega_world[3];
    float v_body[3];
    float omega_body[3];
    uint64_t time_stamp;
};
```

| Field | Meaning |
| --- | --- |
| `quat` | Orientation quaternion in w, x, y, z order |
| `v_world` | Linear velocity in the world frame, in m/s |
| `position` | Position in the world frame, in m |
| `omega_world` | Angular velocity in the world frame, in rad/s |
| `v_body` | Linear velocity in the body frame, in m/s |
| `omega_body` | Angular velocity in the body frame, in rad/s |
| `time_stamp` | Timestamp in nanoseconds |

### SpeedData and JointStateData

```cpp
struct SpeedData {
    float x;
    float y;
    float yaw;
};

struct JointStateData {
    std::vector<std::string> names;
    std::vector<double> positions;
    std::vector<double> velocities;
    std::vector<double> efforts;
};
```

Verify that all four arrays contain the same number of elements before processing joint data. Build a name-to-index map from `names` so the code works with a variable joint count.

## RobotState

`RobotState` is the primary source of overall robot state for applications.

| Field | Meaning |
| --- | --- |
| `head_angle` | Head angle |
| `front_fill_light` | Front fill light status |
| `auto_mode_light` | Automatic fill light mode |
| `charging_pile_connected` | Whether the charging dock is connected |
| `speed_level` | Current speed level |
| `software_emergency_status` | Software emergency stop status |
| `hardware_emergency_status` | Hardware emergency stop status |
| `motion_status` | Current motion posture |
| `machine_status` | Current operating state |
| `battery` | Battery state |
| `speed` | Current speed |
| `mile_data` | Total distance traveled |
| `joint_temps` | Mapping from joint names to temperatures |
| `control_source` | Current source of control |

The structure also includes general-purpose state fields. Use only the fields the current device reports and the application needs. Avoid treating unchanged fields as hardware faults.

### Battery State

```cpp
struct BatteryData {
    float power1, power2;
    bool present1, present2;
    float voltage1, voltage2;
    float temperature1, temperature2;
    float current1, current2;
    PowerSupplyStatus power_supply_status1;
    PowerSupplyStatus power_supply_status2;
};
```

Power supply status values include `UNKNOWN`, `CHARGING`, `DISCHARGING`, and `FULL`. Before interpreting the charge level, check the corresponding `present` field and consider the voltage, current, and charging dock connection status together.

### Motion Status

Common `MotionStatus` values are listed below.

| Enumerator | Meaning |
| --- | --- |
| `MOTION_STATUS_UNKNOWN` | Unknown |
| `MOTION_STATUS_STAND_UP` | Standing up |
| `MOTION_STATUS_WALK` | Standing up is complete and the robot can move. |
| `MOTION_STATUS_BALANCE_STAND` | Balanced standing posture |
| `MOTION_STATUS_LIE_DOWN` | Lying down |
| `MOTION_STATUS_CRAWL` | Crawling posture |
| `MOTION_STATUS_CRAWL_WALK` | Moving while crawling |
| `MOTION_STATUS_LOCKED` | Locked |
| `MOTION_STATUS_CLIMB` | Climbing onto a raised platform |
| `MOTION_STATUS_STAIR` | Stair climbing |
| `MOTION_STATUS_GAIT` | Precision gait, available on wheeled-legged device types |
| `MOTION_STATUS_POS_CONTROL` | Position control |

Some enum values may be unavailable on the current device. Do not bypass SDK capability checks by forcibly writing state values.

### Machine Status

| `MachineStatus` | Meaning |
| --- | --- |
| `UNKNOWN` | Unknown |
| `IDLE` | Idle |
| `REMOTE` | Remote control |
| `OTA` | System update |
| `RECHARGE` | Return to dock or charging task |
| `MAPPING` | Mapping |
| `NAVIGATION` | Navigation |
| `SAFETY` | Safety state |
| `SELFTEST` | Self-test |
| `SOFT_SHUTDOWN` | Software shutdown |
| `SILENCE` | Silent standby |
| `FOLLOW` | Following |
| `TRACK` | Target tracking |
| `UNDOCK` | Undocking |
| `DOCK_CALIBRATION` | Charging dock calibration |
| `ESTOP` | Emergency stop |
| `FALL` | Fallen |
| `LOCAL_REMOTE` | Local remote control |
| `LOW_LEVEL` | Low-level control |

### Control Source and Emergency Stop

| Type | Enumerator | Meaning |
| --- | --- | --- |
| `CtrlSource` | `CTRL_SOURCE_UNKNOWN` | Unknown |
| `CtrlSource` | `CTRL_SOURCE_APP` | App control |
| `CtrlSource` | `CTRL_SOURCE_SDK` | SDK control |
| `CtrlSource` | `CTRL_SOURCE_OTHER` | Other control source |
| `EmergencyStatus` | `EMERGENCY_STATUS_UNKNOWN` | Unknown |
| `EmergencyStatus` | `EMERGENCY_STATUS_RECOVER` | Emergency stop cleared |
| `EmergencyStatus` | `EMERGENCY_STATUS_STOP` | Emergency stop activated |

## Task Status

```cpp
struct TaskStateInfo {
    TaskType task_type;
    TaskStatus task_status;
    std::string phase;
    uint32_t error_code;
};
```

| Type | Enumerators |
| --- | --- |
| `TaskType` | `SCAN_QR`, `MAPPING`, `NAV`, `RECHARGING`, `UNDOCK`, `UWB_FOLLOW`, `VISUAL_TRACK` |
| `TaskStatus` | `STARTING`, `RUNNING`, `SUCCESS`, `FAILURE`, `STOPPED` |

Check `task_type`, `task_status`, and `error_code` together when evaluating a task. A command acknowledgment confirms receipt only. Check task status to confirm completion.

## Fault Information

```cpp
struct FaultData {
    FaultCode code;
    FaultLevel level;
    std::string message;
};
using FaultDatas = std::vector<FaultData>;
```

Fault levels include `FatalError`, `Error`, and `Warn`. Fault codes cover disabled executors, encoder errors, offline executors, overvoltage, overheating, undervoltage, low battery, CAN communication errors, remote controller keepalive failures, system state errors, and IMU faults.

When the application receives a fatal or error-level fault, stop sending motion commands, send a zero-velocity command, and alert on-site personnel to address the fault.

## Callback Implementation Example

```cpp
#include <atomic>
#include <memory>
#include "robot_sdk/sdk_client.hpp"

class DataCallback final : public robot_sdk::IDataCallback {
public:
    void OnRobotStateData(const robot_sdk::RobotState& data) override {
        emergency_.store(
            data.software_emergency_status ==
            robot_sdk::EmergencyStatus::EMERGENCY_STATUS_STOP);
    }

    void OnFaultData(const robot_sdk::FaultDatas& faults) override {
        fault_count_.store(faults.size());
    }

    void OnControlLost(const robot_sdk::ControlLostInfo&) override {
        has_control_.store(false);
    }

    void OnTaskStateData(const robot_sdk::TaskStateInfo& info) override {
        last_task_status_.store(static_cast<int>(info.task_status));
    }

    std::atomic_bool emergency_{false};
    std::atomic_bool has_control_{false};
    std::atomic_size_t fault_count_{0};
    std::atomic_int last_task_status_{0};
};
```
