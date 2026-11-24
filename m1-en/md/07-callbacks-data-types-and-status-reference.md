# Genisom M1 Callbacks, Data Types, and Status Reference

[Return Document Overview](../index.md) | [SDK Control of processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md) | [M1 SDK Interface reference](./06-sdk-api-reference.md) | [Example program and failure check](./08-examples-and-troubleshooting.md)

## Callback Model

The Genisom M1 SDK uses two callback interfaces.

| Callback Interface | Receive content | Registration Functions |
| --- | --- | --- |
| `IDataCallback` | Sensor data, robot state, faults, control ownership events, task state, and charging dock reports | `SetDataCallback()` |
| `IControlCallback` | The robot's response to the command. | `SetControlCallback()` |

See [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md#three-levels-of-call-results) for the relationship between the sending result, the command response and the action status.

## Callback Threading Rules

Callbacks run on the SDK I/O thread. Limit callback work to quick data copies, validation, state updates, and queuing messages.

- Do not carry out long calculations.
- Do not execute file writing, database operation or network request.
- Avoid synchronous SDK calls from callbacks.
- Protect shared data with atomic variables, mutexes, or thread-safe queues.
- Keep exceptions from escaping the callback.
- Run time-consuming tasks on the application’s own worker threads.

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
    virtual ~IDataCallback() = default;
};
```

| Callback | Trigger Method | Data |
| --- | --- | --- |
| `OnImuData` | Reports IMU data at the configured rate when enabled | `ImuData` |
| `OnLuxData` | Reports ambient light at a fixed 1 Hz when enabled | `LuxData` |
| `OnMcData` | Reports motion data at a fixed 50 Hz when enabled | `MotionData` |
| `OnSpeedData` | Reports speed at the configured rate when enabled | `SpeedData` |
| `OnJointStateData` | Reports joint states when enabled | `JointStateData` |
| `OnRobotStateData` | Reports automatically, typically at 1 Hz | `RobotState` |
| `OnFaultData` | Reports current faults automatically | `FaultDatas` |
| `OnTaskStateData` | Reports changes in task state automatically | `TaskStateInfo` |
| `OnDockScanResult` | Reports charging docks found during scanning | `DockScanResult` |
| `OnDockConnectionResult` | Reports the final result of connecting to or disconnecting from the charging dock | `DockConnectionResult` |

### Control Ownership Events {#control-ownership-events}

| Callback | Meaning | Recommended action |
| --- | --- | --- |
| `OnControlLost` | The SDK lost control ownership | Immediately stop sending normal control commands. |
| `OnControlAvailable` | Control is available to request again | Call `TakeControl()` from an application worker thread. |

`OnControlAvailable()` signals that the SDK can request control ownership. Use `OnTakeControlAck()` to confirm whether the request was granted.

## IControlCallback

```cpp
class IControlCallback {
public:
    virtual void OnSoftEmergencyStop(bool on) {}
    virtual void OnStandUp() {}
    virtual void OnBalanceStandUp() {}
    virtual void OnLieDown() {}
    virtual void OnStair() {}
    virtual void OnCrawl() {}
    virtual void OnCrawlWalk() {}
    virtual void OnClimb() {}
    virtual void OnSlim() {}
    virtual void OnGait() {}
    virtual void OnWalk() {}
    virtual void OnPosControl() {}
    virtual void OnSkWalk() {}
    virtual void OnSand() {}
    virtual void OnReverseHeadTail() {}
    virtual void OnSpeed(int speed_level) {}
    virtual void OnLocked() {}
    virtual void OnFrontLight(bool on) {}
    virtual void OnBackLight(bool on) {}
    virtual void OnAutoModeLight(bool on) {}
    virtual void OnObstacleAvoidance(bool on) {}
    virtual void OnLuxConfig(bool on) {}
    virtual void OnImuConfig(int freq) {}
    virtual void OnMcConfig(bool on) {}
    virtual void OnSpeedReportConfig(bool on, uint32_t frequency) {}
    virtual void OnJointStateConfig(bool on) {}
    virtual void OnDockScanConfig(bool on) {}
    virtual void OnTakeControlAck(const TakeControlAck& ack) {}
    virtual void OnReleaseControlAck(const ReleaseControlAck& ack) {}
    virtual void OnUpdateCameraBitrateAck(const CameraBitrateAck& ack) {}
    virtual void OnDockConnectionAck(const DockConnectionAck& ack) {}
    virtual void OnDockInfo(const DockInfo& info) {}
    virtual void OnSwitchRemote() {}
    virtual void OnSwitchIdle() {}
    virtual void OnStartRechargeTask() {}
    virtual void OnStopRechargeTask() {}
    virtual void OnStartUnDockTask() {}
    virtual void OnStopUnDockTask() {}
    virtual void OnSetPeriphPower(const PowerCtrlAck& ack) {}
    virtual void OnGetPeriphPower(const PowerCtrlAck& ack) {}
    virtual void OnSetLedAutoMode(const LedAutoModeAck& ack) {}
    virtual void OnGetLedAutoMode(const LedAutoModeAck& ack) {}
    virtual void OnSetLedCommand(const LedCommandAck& ack) {}
    virtual ~IControlCallback() = default;
};
```

### Acknowledgment Callback Categories

| Classification | Callback | Description |
| --- | --- | --- |
| Posture Command | `OnStandUp()`, `OnWalk()`, `OnLieDown()`, etc. | The robot received the command. Check state data to determine when the motion completes. |
| Speed and light. | `OnSpeed()`, `OnFrontLight()`, etc. | Returns settings confirmed by robot |
| Data Configuration | `OnImuConfig()`, `OnMcConfig()`, etc. | Return effective configuration |
| Control ownership | `OnTakeControlAck()`, `OnReleaseControlAck()` | Check `error_code` to determine whether the robot granted or released control. |
| Camera | `OnUpdateCameraBitrateAck()` | Returns the camera’s applied bitrate |
| charging dock | `OnDockScanConfig()`, `OnDockConnectionAck()`, `OnDockInfo()` | Report whether scanning is enabled, whether the connect or disconnect request was accepted, and charging dock details, respectively. |
| Status and tasks | `OnSwitchRemote()`, `OnStartRechargeTask()`, etc. | Acknowledges the command. Track task progress via `OnTaskStateData()`. |
| Power and LED | `OnSetPeriphPower()`, `OnSetLedCommand()`, etc. | Return device confirmed channel or light effect |

`Move()`,  `MoveVelocity()`,  `Turn()`,  `ControlHead()`,  `HighLowStance()` and `PosMove()` have no dedicated control acknowledgment callback. Check the send result through `WriteHandler`.

## Base Type

### TransportProtocol

| Enumeration values | Integer Value | Description |
| --- | ---: | --- |
| `WebSocket` | 0 | WebSocket Transfer, use port `8081` |
| `Udp` | 1 | UDP Transfer, use port `8082`; `SDKClient` Default value |

### DeviceInfo and DeviceType

```cpp
struct DeviceInfo {
    DeviceType device_type = DeviceType::UNKNOWN;
    std::string sn;
};
```

| `DeviceType` | Integer Value | Type of product |
| --- | ---: | --- |
| `UNKNOWN` | 0 | No equipment information identified or not yet obtained |
| `M1` | 1 | M1 wheeled |
| `M1F` | 2 | M1 point-foot |
| `M1_PRO` | 3 | M1 wheeled Pro |
| `M1F_PRO` | 4 | M1 point-foot Pro |
| `M1_ULTRA` | 5 | M1 wheeled Ultra |
| `M1F_ULTRA` | 6 | M1 point-foot Ultra |

`device_type` A handshake from a connection, `sn` is the robot's serial number. The type may be `UNKNOWN` before the connection is successful or after it is disconnected, and the serial number may be empty.

## Sensor Data Structure

### ImuData

```cpp
struct ImuData {
    float acc_x, acc_y, acc_z;
    float gyro_x, gyro_y, gyro_z;
    float quat_x, quat_y, quat_z, quat_w;
};
```

Acceleration is in m/s² and angular velocity is in rad/s. The quaternion fields are ordered `x, y, z, w`.

### LuxData

```cpp
struct LuxData {
    float lux;
};
```

`lux` For the light, in units of lux.

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

| Field | Contents | Units |
| --- | --- | --- |
| `quat` | Orientation quaternion in the world frame `[w, x, y, z]` | — |
| `v_world` | Velocity in the world frame `[x, y, z]` | m/s |
| `position` | Position in the world frame `[x, y, z]` | m |
| `omega_world` | Angular velocity in the world frame | rad/s |
| `v_body` | Velocity in the body frame | m/s |
| `omega_body` | Angular velocity in the body frame | rad/s |
| `time_stamp` | Data Timestamp | ns |

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

| Field | Meaning | Units |
| --- | --- | --- |
| `SpeedData::x` | Back and forth speed | m/s |
| `SpeedData::y` | Left-and-right smooth speed | m/s |
| `SpeedData::yaw` | Rotation angle speed | rad/s |
| `JointStateData::positions` | Joint Position | rad |
| `JointStateData::velocities` | Joint speed | rad/s |
| `JointStateData::efforts` | Joint torque | N·m |

The four arrays in `JointStateData` align by index with `names`.

## RobotState

```cpp
struct RobotState {
    double head_angle;
    FillLightStatus front_fill_light;
    FillLightStatus back_fill_light;
    bool auto_mode_light;
    bool obstacle_avoidance;
    bool charging_pile_connected;
    SpeedLevel speed_level;
    EmergencyStatus software_emergency_status;
    EmergencyStatus hardware_emergency_status;
    HeadDirection head_direction;
    MotionStatus motion_status;
    MachineStatus machine_status;
    BatteryData battery;
    Speed speed;
    float mile_data;
    std::unordered_map<std::string, double> joint_temps;
    CtrlSource control_source;
};
```

| Field | Meaning |
| --- | --- |
| `head_angle` | Head angle. |
| `front_fill_light` / `back_fill_light` | State of the front and rear fill lights |
| `auto_mode_light` | Whether automatic fill lighting is enabled |
| `obstacle_avoidance` | Whether obstacle stopping is enabled |
| `charging_pile_connected` | Whether the charging dock is connected |
| `speed_level` | Current speed setting |
| `software_emergency_status` | Software emergency stop state |
| `hardware_emergency_status` | Physical emergency stop state |
| `head_direction` | Which end of the robot is treated as the front |
| `motion_status` | Current body posture or motion state |
| `machine_status` | Current robot task or operating state |
| `battery` | Data for both batteries |
| `speed` | Actual velocity. Forward and lateral velocity are in m/s, and angular velocity is in rad/s |
| `mile_data` | Total distance traveled, in m |
| `joint_temps` | Map of joint names to temperature, in °C |
| `control_source` | Current control source |

Use `motion_status` for body posture and `machine_status` for the robot's current task or operating state.

`RobotState::speed` It is structured as follows:

```cpp
struct Speed {
    double line;         // Back and forth speed, m/s
    double translation;  // Left and right smooth speed, m/s
    double angle;        // Rotation angle speed, rad/s
};
```

## Battery Data

Get by `OnRobotStateData()` `RobotState::battery`.

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

At the end of the field, `1` and `2` means batteries 1 and batteries 2, respectively. The amount is a percentage, the unit of voltage is V, the unit of temperature is °C and the unit of current is A.

### PowerSupplyStatus

| Enumeration values | Integer Value | Meaning |
| --- | ---: | --- |
| `UNKNOWN` | 0 | Unknown |
| `CHARGING` | 1 | Charging |
| `DISCHARGING` | 2 | Discharging |
| `FULL` | 4 | Fully charged |

## Fault Data

Fetches the list of current malfunctions by `OnFaultData()`.

```cpp
struct FaultData {
    FaultCode code;
    FaultLevel level;
    std::string message;
};

using FaultDatas = std::vector<FaultData>;
```

### FaultCode and FaultLevel

Starting with SDK v0.2.3, `FaultCode` uses `int` as its underlying type and holds the protocol fault code reported by the robot. When logging a warning, you can record the numeric code, `FaultData::level`, and `message`. An actuator overcurrent, for example, has the `message` `Actuator/OverCurrent`. `OnFaultData()` can report multiple faults at once. An empty list indicates that the reported faults have cleared.

| `FaultCode` | Integer Value | Meaning |
| --- | ---: | --- |
| `Unknown` | 0 | Unknown malfunction |
| `SystemClockSanityError` | 1001 | System Time Jump |
| `SystemKeyNodeLifecycleError` | 1002 | Unattainability of key nodes or abnormal life cycle state |
| `SystemOptNodeLifecycleError` | 1003 | Unattainability of optional nodes or abnormal life cycle state |
| `MotionStateFallError` | 1004 | We've detected a fall in the robot. |
| `IMUConnectError` | 1101 | IMU Connection error |
| `IMUDataNotUpdated` | 1102 | IMU Data update timed out |
| `IMUCrcError` | 1103 | IMU Data CRC Validation failed |
| `ActuatorOffline` | 1201 | Executor Offline |
| `ActuatorDisabled` | 1202 | Executor disabled |
| `ActuatorTimeout` | 1203 | Executor Control Timeout |
| `ActuatorEncoderError` | 1204 | Executor Encoder Error |
| `ActuatorOverVoltage` | 1205 | Executor Overpressure |
| `ActuatorUndervolt` | 1206 | Executor under pressure |
| `ActuatorOverCurrent` | 1207 | Executor Overflow |
| `ActuatorOverSpeed` | 1208 | Executor Speed |
| `ActuatorOverheat` | 1209 | Executor Overheat |
| `ActuatorOverTempWarn` | 1210 | The drive detected a temperature alarm. |
| `ActuatorOverTempProtect` | 1211 | Driver triggers temperature protection |
| `ActuatorDCOverVoltage` | 1212 | High-speed motion causes a straight-way carrier overpressure. |
| `PowerControlOffline` | 1301 | Power control panel offline |
| `PowerControlPowerLow` | 1302 | Battery power is less than 20% and not less than 10%, which can be reported off by robotic configuration |
| `PowerControlPowerEmpty` | 1303 | Battery power is below 10% |
| `CANBroken` | 1401 | CAN Console communication failure |
| `SystemMcBoard…` | 1501–1516 | Control boards I/O, memory, CPU Usage, temperature and frequency diagnosis |
| `SystemAlgBoard…` | 1517–1532 | Calculator plate I/O, memory, CPU Usage, temperature and frequency diagnosis |

The code-by-code values for the card diagnosis, the protocol name and the default level are shown in [Official failure code reference](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/en/sdk_type_en.md#faultcode).

| `FaultLevel` | Integer Value | Meaning |
| --- | ---: | --- |
| `Unknown` | 0 | Unknown level |
| `FatalError` | 1 | Fatal Error |
| `Error` | 2 | Error |
| `Warn` | 3 | Warning |

## Key State Enums

### MotionStatus

| Enumeration values | Integer Value | Meaning |
| --- | ---: | --- |
| `MOTION_STATUS_UNKNOWN` | 0 | Unknown |
| `MOTION_STATUS_STAND_UP` | 1 | Standing |
| `MOTION_STATUS_WALK` | 2 | Mobile standing state |
| `MOTION_STATUS_BALANCE_STAND` | 3 | Balance Standing |
| `MOTION_STATUS_LIE_DOWN` | 4 | Lie down |
| `MOTION_STATUS_CRAWL` | 5 | Crawling posture |
| `MOTION_STATUS_CRAWL_WALK` | 6 | Moving while crawling |
| `MOTION_STATUS_LOCKED` | 7 | Lock |
| `MOTION_STATUS_CLIMB` | 8 | Climbing a raised platform |
| `MOTION_STATUS_STAIR` | 9 | Stair climbing |
| `MOTION_STATUS_SLIM` | 10 | Narrow-passage posture |
| `MOTION_STATUS_GAIT` | 11 | Precision gait |
| `MOTION_STATUS_POS_CONTROL` | 13 | Position control |
| `MOTION_STATUS_SK_WALK` | 14 | Walking with matching knee posture |
| `MOTION_STATUS_SAND` | 15 | Posture for sandy terrain |

### MachineStatus

| Enumeration values | Integer Value | Meaning |
| --- | ---: | --- |
| `UNKNOWN` | 0 | Unknown |
| `IDLE` | 1 | Idle |
| `REMOTE` | 2 | Remote control |
| `OTA` | 3 | OTA Upgrade |
| `RECHARGE` | 4 | Returning to charge |
| `MAPPING` | 5 | Mapping |
| `NAVIGATION` | 6 | Navigation |
| `SAFETY` | 7 | Safety protection |
| `SELFTEST` | 8 | Self-check |
| `SOFT_SHUTDOWN` | 9 | Soft Shutdown |
| `SILENCE` | 10 | Quiet standby |
| `FOLLOW` | 11 | Follow |
| `TRACK` | 12 | Track |
| `UNDOCK` | 13 | Undocking |
| `DOCK_CALIBRATION` | 14 | Charging dock calibration |
| `ESTOP` | 15 | Emergency stop |
| `FALL` | 16 | Fallen |
| `LOCAL_REMOTE` | 17 | Local remote control |
| `LOW_LEVEL` | 18 | Low-level control |

### Other State Enums

| Type | Enumeration values | Integer Value | Meaning |
| --- | --- | ---: | --- |
| `FillLightStatus` | `FILL_LIGHT_STATUS_UNKNOWN` | 0 | Unknown |
| `FillLightStatus` | `FILL_LIGHT_STATUS_ON` | 1 | Lights on. |
| `FillLightStatus` | `FILL_LIGHT_STATUS_OFF` | 2 | Lights off. |
| `SpeedLevel` | `SPEED_LEVEL_UNKNOWN` | 0 | Unknown slot |
| `SpeedLevel` | `SPEED_LEVEL_SLOW` | 1 | Low Speed |
| `SpeedLevel` | `SPEED_LEVEL_MEDIUM` | 2 | Medium Speed |
| `SpeedLevel` | `SPEED_LEVEL_HIGH` | 3 | High-speed |
| `EmergencyStatus` | `EMERGENCY_STATUS_UNKNOWN` | 0 | Unknown |
| `EmergencyStatus` | `EMERGENCY_STATUS_RECOVER` | 1 | Emergency stop cleared |
| `EmergencyStatus` | `EMERGENCY_STATUS_STOP` | 2 | Emergency stop triggered |
| `HeadDirection` | `HEAD_DIRECTION_UNKNOWN` | 0 | Unknown direction |
| `HeadDirection` | `HEAD_DIRECTION_HEAD` | 1 | Head ahead. |
| `HeadDirection` | `HEAD_DIRECTION_TAIL` | 2 | End to Front |
| `CtrlSource` | `CTRL_SOURCE_UNKNOWN` | 0 | Unknown control source |
| `CtrlSource` | `CTRL_SOURCE_APP` | 1 | App Control |
| `CtrlSource` | `CTRL_SOURCE_SDK` | 2 | SDK Control |
| `CtrlSource` | `CTRL_SOURCE_OTHER` | 3 | Control of other sources |

## Task State {#task-state}

```cpp
struct TaskStateInfo {
    TaskType task_type;
    TaskStatus task_status;
    std::string phase;
    uint32_t error_code;
};
```

| Field | Meaning |
| --- | --- |
| `task_type` | Task Type |
| `task_status` | Task state |
| `phase` | Optional sub-phase of task, possibly empty |
| `error_code` | `0` for success, not `0` for failure |

Recharge progresses through `recharge_preparing` (preparing), `recharge_docking` (aligning and docking), `recharge_charging` (charging), and `recharge_completed` (fully charged and still docked). Undocking progresses through `undock_preparing` (preparing), `undock_undocking` (undocking), and `undock_completed` (undocked). Use `phase` to show progress and `task_status` to determine the task outcome.

| Type | Enumeration values | Integer Value |
| --- | --- | ---: |
| `TaskType` | `UNKNOWN` | 0 |
| `TaskType` | `SCAN_QR` | 1 |
| `TaskType` | `MAPPING` | 2 |
| `TaskType` | `NAV` | 3 |
| `TaskType` | `RECHARGING` | 4 |
| `TaskType` | `UNDOCK` | 5 |
| `TaskType` | `UWB_FOLLOW` | 6 |
| `TaskType` | `VISUAL_TRACK` | 7 |
| `TaskStatus` | `UNKNOWN` | 0 |
| `TaskStatus` | `STARTING` | 1 |
| `TaskStatus` | `RUNNING` | 2 |
| `TaskStatus` | `SUCCESS` | 3 |
| `TaskStatus` | `FAILURE` | 4 |
| `TaskStatus` | `STOPPED` | 5 |

`OnTaskStateData()` reports task state changes. See [Docking and Undocking Tasks](./05-sdk-control-flow-and-task-handling.md#docking-and-undocking-tasks) for how to interpret the states.

### Docking and Undocking Error Codes {#docking-and-undocking-error-codes}

When `task_status == TaskStatus::FAILURE`, look up `TaskStateInfo::error_code` for the reported `task_type`. Recharge (`RECHARGING`) codes range from `0x11000` to `0x11FFF`. Undock (`UNDOCK`) codes range from `0x16000` to `0x16FFF`. Preserve the original code and record `phase` if present. See the [SDK API reference](./06-sdk-api-reference.md#common-parameters-and-return-values) for the `std::error_code` returned by API calls.

| Recharge Error Code | Enum | Meaning |
| --- | --- | --- |
| `0x11000` | `ARC_UNKNOWN` | Unknown recharge error |
| `0x11001` | `ARC_CALIBRATION_FILE_INVALID` | Invalid camera calibration file |
| `0x11002` | `ARC_LOCALIZATION_CHECK_FAILED` | The perception module failed its check |
| `0x11003` | `ARC_NAV_ALIGNMENT_CHECK_FAILED` | The alignment module failed its check |
| `0x11004` | `ARC_DOCK_START_TASK_FAILED` | Reserved code. The current workflow does not report it |
| `0x11005` | `ARC_STAND_UP_FAILED` | The robot failed to stand up |
| `0x11006` | `ARC_LOCALIZATION_START_FAILED` | Could not start the perception module |
| `0x11007` | `ARC_NAV_ALIGNMENT_START_FAILED` | Could not start the alignment task |
| `0x11008` | `ARC_NAV_ALIGNMENT_FAILED` | Alignment failed while docking |
| `0x11009` | `ARC_DOCK_CONTACT_FAILED` | Could not confirm contact with the charging dock |
| `0x1100A` | `ARC_DOCK_CHARGING_START_FAILED` | The charging dock failed to start charging |
| `0x1100B` | `ARC_CHARGING_STATE_LOST` | Stopped receiving charging status |
| `0x1100C` | `ARC_CHARGING_DOCK_FAULT` | The dock reported a fault during charging |
| `0x1100D` | `ARC_CHARGING_STATE_INVALID` | Received invalid charging status |
| `0x1100E` | `ARC_CHARGING_BATTERY_STATE_LOST` | Stopped receiving battery status |
| `0x1100F` | `ARC_DOCK_COMMAND_ACK_FAILED` | Charging dock command acknowledgment failed |
| `0x11010` | `ARC_LOCALIZATION_RUNTIME_IMAGE_INVALID` | Received an invalid image during perception |
| `0x11011` | `ARC_LOCALIZATION_RUNTIME_TARGET_TAG_TIMEOUT` | Timed out waiting for the target AprilTag |
| `0x11012` | `ARC_LOCALIZATION_RUNTIME_TAG_POSE_FAILED` | Could not calculate the AprilTag pose |
| `0x11013` | `ARC_LOCALIZATION_RUNTIME_DOCK_POSE_FAILED` | Could not calculate the charging dock pose |
| `0x11014` | `ARC_LOCALIZATION_RUNTIME_UNKNOWN` | Unknown error during perception |
| `0x11015` | `ARC_LOCALIZATION_RUNTIME_DUPLICATE_TARGET_TAG` | Detected a duplicate target AprilTag |
| `0x11016` | `ARC_NAV_ALIGNMENT_STOP_FAILED` | Could not stop alignment while retrying contact |

| Undocking Error Code | Enum | Meaning |
| --- | --- | --- |
| `0x16000` | `UNDOCK_UNKNOWN` | Unknown undocking error |
| `0x16001` | `UNDOCK_STAND_UP_FAILED` | The robot failed to stand up before undocking |
| `0x16002` | `UNDOCK_STOP_CHARGING_FAILED` | Could not stop charging |
| `0x16003` | `UNDOCK_LOCALIZATION_START_FAILED` | Could not start perception for undocking |
| `0x16004` | `UNDOCK_NAV_ALIGNMENT_START_FAILED` | Could not start the undocking alignment task |
| `0x16005` | `UNDOCK_NAV_ALIGNMENT_FAILED` | Alignment failed while undocking |
| `0x16006` | `UNDOCK_CALIBRATION_FILE_INVALID` | Invalid camera calibration file |
| `0x16007` | `UNDOCK_FILL_LIGHT_FAILED` | Could not operate the fill light |
| `0x16008` | `UNDOCK_LOCALIZATION_QR_NOT_DETECT` | QR code not detected |
| `0x16009` | `UNDOCK_LOCALIZATION_CHECK_FAILED` | The perception module failed its communication check |
| `0x1600A` | `UNDOCK_NAV_ALIGNMENT_CHECK_FAILED` | The alignment module failed its communication check |
| `0x1600B` | `UNDOCK_LOCALIZATION_RUNTIME_IMAGE_INVALID` | Received an invalid image during undocking perception |
| `0x1600C` | `UNDOCK_LOCALIZATION_RUNTIME_TAG_POSE_FAILED` | Could not calculate the AprilTag pose |
| `0x1600D` | `UNDOCK_LOCALIZATION_RUNTIME_DOCK_POSE_FAILED` | Could not calculate the charging dock pose |
| `0x1600E` | `UNDOCK_LOCALIZATION_RUNTIME_UNKNOWN` | Unknown error during undocking perception |
| `0x1600F` | `UNDOCK_LOCALIZATION_RUNTIME_DUPLICATE_TARGET_TAG` | Detected a duplicate target AprilTag |
| `0x16010` | `UNDOCK_DETECT_OBSTACLE_FAILED` | Undocking failed because an obstacle was detected |

See [GitHub Business Error Sheet](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_recharge_errorcode_zh.md).

## Dock Data {#dock-data}

| Type | Field | Use |
| --- | --- | --- |
| `DockScanDevice` | `name`, `address`, `rssi`, `connectable`, `service_uuids` | Scanning equipment name, BLE address, signal strength, connectable tags and list of services |
| `DockScanResult` | `code`, `accepted`, `scan_active`, `devices`, `updated_at_ms` | Scan status and equipment list, reported by `OnDockScanResult()` |
| `DockConnectConfig` | `address` | Address of target charging stake BLE MAC |
| `DockConnectionAck` | `code`, `accepted`, `error_code`, `error_message` | The result of the request to connect or disconnect from the request is returned by `OnDockConnectionAck()` |
| `DockConnectionResult` | `code`, `success`, `error_code` | Final result of connection or disconnect, reported by `OnDockConnectionResult()` |
| `DockInfo` | `code`, `ble_address`, `name`, `dock_sn`, `dock_version`, `error_code`, `error_message` | Query results, identification of charging dock and error information |
| `DockInfo` | `dock_connected`, `has_contact`, `charging_active` | BLE connection, mechanical contact, and whether charging is active |
| `DockInfo` | `light_switch_status`, `fill_light_brightness`, `auto_fill_light_enabled` | Fill light switch state, brightness, and automatic fill light mode |

`OnDockInfo()` can run in response to a query or when the charging dock state changes. See the [SDK header](https://github.com/zsibot/genisom_robot_sdk/blob/main/include/robot_sdk/sdk_type.hpp) for field types and [Dock Pairing](./05-sdk-control-flow-and-task-handling.md#dock-pairing) for the call sequence.

## Peripheral and LED Enums {#external-with-led-counts}

| Type | Enumeration values | Integer Value | Meaning |
| --- | --- | ---: | --- |
| `PeripheralPower` | `UNKNOWN` | 0 | Unknown power channel |
| `PeripheralPower` | `M1_48V` | 1 | 48 V power channel |
| `PeripheralPower` | `M1_24V` | 2 | 24 V power channel |
| `PeripheralPower` | `M1_12V` | 3 | 12 V power channel |
| `LedId` | `UNKNOWN` | 0 | Unknown Light Group |
| `LedId` | `ALL` | 1 | All status LED |
| `LedId` | `FRONT` | 2 | Front state LED |
| `LedId` | `BACK` | 3 | Back state LED |
| `LedEffect` | `UNKNOWN` | 0 | Unknown light effect |
| `LedEffect` | `OFF` | 1 | Close |
| `LedEffect` | `ON` | 2 | Chang-Lang |
| `LedEffect` | `BREATH` | 3 | Breathe. |
| `LedEffect` | `BLINK` | 4 | Flash |
| `LedEffect` | `BLINK_TRANSIENT` | 5 | Swinging transiently. |

`LedColor` It's... `r/g/b/a` It's all the way through. 0 to 255. `LedCommand` and `LedCommandAck` Organisation `id`,  `effect`,  `color`,  `duration_ms`;of which `duration_ms`, in ms, for the light cycle or scintillation interval.

## Structure of Command and Response

| Type | Main fields | Description |
| --- | --- | --- |
| `CameraBitrateCmd` / `CameraBitrateAck` | `camera_name`, `camera_bps` | Camera name and bitrate in bit/s |
| `PowerCtrlCfg` / `PowerCtrlAck` | `power`, `enable` | Power channel and switch status |
| `PosControlCmd` | `x/y/z`, `roll/pitch/yaw` | Position in m and orientation angles in rad |
| `LedAutoModeAck` | `auto_mode` | `true` for automatic mode, `false` for manual mode |

## Structure of Control Response

```cpp
struct ControlLostInfo {};
struct ControlAvailableInfo {};

struct TakeControlAck {
    uint32_t error_code;
    std::string reason;
};

struct ReleaseControlAck {
    uint32_t error_code;
    std::string reason;
};
```

`TakeControlAck::error_code == 0` indicates that the control application was successful. The complete control transition process is in [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md#control-ownership-mechanism).

## Callback Registration Example {#callback-registration-example}

```cpp
SDKClient client;

auto data_cb = std::make_shared<MyDataCallback>();
auto control_cb = std::make_shared<MyControlCallback>();

client.SetDataCallback(data_cb);
client.SetControlCallback(control_cb);
```
