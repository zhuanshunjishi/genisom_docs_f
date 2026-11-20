# Real-Time Sensor Data Interface

[Return to Software Service Interface](./06-sdk-service-interfaces.md) | [Control command interface](./06-01-control-commands.md)

## Interface Description

The sensor's real-time reporting interface is used to receive the robotic inherently state, corresponding to the "sensor's real-time reporting port" in the red box. UDP Receiving Port `8080` Align SDK It's a state report. SDK The last data is deciphered and cached during the receiving thread, and the application reads the cache through a query function.

Check your state before reading it. `IsConnected()`. The status-reading function does not usually initiate new network requests on its own initiative, and data are up to date depending on the robot reporting cycle and application reading time.

## Communications Parameters

| Parameter | Default |
| --- | --- |
| Robot IP | `192.168.234.1` |
| SDK Receiving port | `8080` |
| Transfer protocol | UDP |
| Message Format | JSON |

## Type of Reporting Message

| Message Type | Corresponding | Common SDK functions |
| --- | --- | --- |
| `dog_state` | Basic information on electricity, temperature, equipment name, WiFi SSID, serial number, model, etc. | `GetPower()`, `GetTemperature()`, `GetSn()`, `GetDevName()`, `GetWifiSsid()`, `GetModel()` |
| `version` | Transport and Task Versions | `GetVersion()` |
| `speed_set` | Current speed level | `GetSpeedLevel()` |
| `feedback` | Functional mode, control mode, motor mode, motor type and electric temperature | `GetFunctionMode()`, `GetControlMode()`, `GetMotionMode()`, `GetMotionType()`, `GetMotorTemp()` |
| `imu_info` | Four dollars, RPY, aerodynamic acceleration and aerodynamic agular velocity | `GetQuaternion()`, `GetRPY()`, `GetBodyAcc()`, `GetBodyGyro()` |
| `odom_info` | Location, world speed and airframe speed | `GetPosition()`, `GetWorldVelocity()`, `GetBodyVelocity()` |
| `leg_joint_info` | 4 Angle, angular velocity and force rectangles of legs | `GetLeg*Joint()`, `GetLeg*JointVel()`, `GetLeg*JointTorque()` |
| `dev_info` | Battery voltage, current, temperature, electricity and error codes | `GetBatteryInfo()` |

## Access to Basic Information

| Functions | Function Prototype | Return Contents |
| --- | --- | --- |
| `GetPower` | `uint32_t GetPower() const` | % electricity |
| `GetTemperature` | `float32_t GetTemperature() const` | Temperature of equipment, °C |
| `GetSn` | `std::string GetSn() const` | Device Serial Number |
| `GetDevName` | `std::string GetDevName() const` | Device Name |
| `GetWifiSsid` | `std::string GetWifiSsid() const` | Current WiFi SSID |
| `GetVersion` | `VersionInfo GetVersion() const` | Transport and Task Versions |
| `GetModel` | `Model GetModel() const` | Enum value for the current robot model |

### Relevant Data Type

#### VersionInfo

| Field | Type | Description |
| --- | --- | --- |
| `mc_version` | `string` | Transport Version |
| `dog_task_version` | `string` | Task Version |

#### Model

| Enumeration values | Value | Description |
| --- | --- | --- |
| `MODEL_XG` | `0` | Puppets. |
| `MODEL_XGW` | `1` | Puppets turn their feet. |
| `MODEL_XGWHSPD` | `2` | The dog's high-speed. |

## Retrieving Speed and Mode

| Functions | Function Prototype | Return Contents |
| --- | --- | --- |
| `GetSpeed` | `SpeedInfo GetSpeed() const` | Back and forth, angle, left and right, head angle. |
| `GetSpeedLevel` | `SpeedLevel GetSpeedLevel() const` | Slow, normal or fast |
| `GetFunctionMode` | `FunctionMode GetFunctionMode() const` | Remote control, tracking, SDK or universal SDK mode |
| `GetControlMode` | `ControlMode GetControlMode() const` | Stand, get down, lock, move, balance standing, etc. |
| `GetMotionMode` | `MotionMode GetMotionMode() const` | Whether to perform, rest or prohibit stunting |
| `GetMotionType` | `MotionType GetMotionType() const` | Current stunt action type |

### Relevant Data Type

#### SpeedInfo

| Field | Type | Description |
| --- | --- | --- |
| `speed` | `float32_t` | Back and forth speed |
| `angle_speed` | `float32_t` | Angular Speed |
| `shift_speed` | `float32_t` | Left and right speed |
| `angle` | `float32_t` | Head angle. |

#### SpeedLevel

| Enumeration values | Value | Description |
| --- | --- | --- |
| `SL_NULL` | `0` | Invalid value |
| `SL_SLOW` | `1` | Slow down. |
| `SL_NORMAL` | `2` | Normal speed |
| `SL_FAST` | `3` | Fast |

#### FunctionMode

| Enumeration values | Value | Description |
| --- | --- | --- |
| `FM_NULL` | `0` | Invalid value |
| `FM_REMOTE` | `1` | Remote Mode |
| `FM_TRACE` | `2` | Tracking Mode |
| `FM_SDK` | `3` | SDK Mode |
| `FM_GENERAL_SDK` | `4` | Universal SDK Mode |

#### ControlMode

| Enumeration values | Value | Description |
| --- | --- | --- |
| `CM_NULL` | `0` | Invalid value |
| `CM_STAND_UP` | `1` | Stand |
| `CM_SIT_DOWN` | `2` | Get down! |
| `CM_LOCK_MODE` | `3` | Lock Mode |
| `CM_EMERGENCY_STOP` | `4` | Emergency stop. |
| `CM_MOVE_MODE` | `5` | Move Mode |
| `CM_BALANCE_STAND_MODE` | `6` | Balance Standing Mode |
| `CM_INIT` | `7` | Initialize |

#### MotionMode

| Enumeration values | Value | Description |
| --- | --- | --- |
| `MM_NULL` | `0` | Invalid value |
| `MM_RUNNING` | `1` | Under implementation (in the course of stunting) |
| `MM_REST` | `2` | Rest (no stunting) |
| `MM_FORBID` | `3` | Ban (not in laboratory mode) |

#### MotionType

| Enumeration values | Value | Description |
| --- | --- | --- |
| `MT_NULL` | `0` | Invalid value |
| `MT_JUMP` | `1` | Jump. |
| `MT_FORWARD_JUMP` | `2` | Jump! |
| `MT_BACK_FLIP` | `3` | Backwards. |
| `MT_GREET` | `4` | Wave! |
| `MT_TWO_LEG_STAND` | `5` | Stand on your legs. |
| `MT_FORBID` | `6` | Ban (unopened violent mode) |
| `MT_UNKNOWN` | `7` | Unknown (no stunting) |
| `MT_UNLOADING_SQUAT` | `8` | Unload the cargo and get down. |

## Accessing IMU and Attitude Data

| Functions | Type and content of return |
| --- | --- |
| `GetQuaternion()` | `std::array<float32_t, 4>`, four dollars `[w, x, y, z]` |
| `GetRPY()` | `std::array<float32_t, 3>` Rolling, leaning, deviating, in radians |
| `GetBodyAcc()` | `std::array<float32_t, 3>`, acceleration in the robot body frame, in m/s² |
| `GetBodyGyro()` | `std::array<float32_t, 3>`, angular velocity of the body coordinates, units rad/s |

## Retrieving Mileage Data

| Functions | Type and content of return |
| --- | --- |
| `GetPosition()` | `std::array<float32_t, 3>`, coordinates of the world, unit m |
| `GetWorldVelocity()` | `std::array<float32_t, 3>`, velocity of the world coordinates, units m/s |
| `GetBodyVelocity()` | `std::array<float32_t, 3>`, velocity of body coordinates, units m/s |

## Access to Electrical and Joint Data

| Data | Functions |
| --- | --- |
| Electric temperature | `GetMotorTemp()`, return 16 electric temperature |
| Helium outreach joint angle / Angular speed / Strength rectangular | `GetLegAbadJoint()` / `GetLegAbadJointVel()` / `GetLegAbadJointTorque()` |
| hip angle / Angular speed / Strength rectangular | `GetLegHipJoint()` / `GetLegHipJointVel()` / `GetLegHipJointTorque()` |
| Knee joint angle / corner speed / force rectangles | `GetLegKneeJoint()` / `GetLegKneeJointVel()` / `GetLegKneeJointTorque()` |
| Foot joint angle / Angular speed / Force rectangles | `GetLegFootJoint()` / `GetLegFootJointVel()` / `GetLegFootJointTorque()` |

Each joint function returns `std::array<float32_t, 4>` with an array order of:

```text
[Left front leg, right front leg, left back leg, right back leg]
```

The joint name of each leg is `abad`, `hip`, `knee`, `foot`. The angle is rad, the angular velocity is rad/s and the force trajectory is N.m.

## Get Battery Information

| Field | Contents |
| --- | --- |
| Function Name | `GetBatteryInfo` |
| Function Prototype | `BatteryInfo GetBatteryInfo() const` |
| Function Overview | Read battery detail status |
| Parameter | None |
| Return value | `current`: current; `error`: battery code error; `power`: percentage of electricity; `temp`: temperature; `volt`: voltage |
| Notes | Unit and specific security thresholds based on `BatteryInfo` definitions and actual hardware specifications |

### BatteryInfo Structure

| Field | Type | Description |
| --- | --- | --- |
| `current` | `float32_t` | & Electricity |
| `error` | `int32_t` | Error Code |
| `power` | `int32_t` | % electricity |
| `temp` | `float32_t` | Temperature (°C) |
| `volt` | `float32_t` | & Voltage |

## Use of Caution

- Status data are the most recently reported caches and do not guarantee that each call triggers a new network reception.
- When using attitude, velocity and joint data to participate in control, the state of connection, data time and data should be checked for reasonable range.
- The type of machine may differ from the sensor, rotor and load, and the application should be read `GetModel()` before the corresponding function is activated.
- Information on electrical temperature, battery state and failure shall be continuously checked before and during operation.
