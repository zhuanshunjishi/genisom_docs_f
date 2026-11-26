# L2 回调、数据类型与状态

[返回文档总览](../index.md) | [SDK 接口参考](./07-sdk-api-reference.md) | [L2 SDK 控制流程](./09-control-ownership-tasks-and-peripherals.md)

## 回调模型

SDK 提供两个回调基类：

| 基类 | 用途 | 注册接口 |
| --- | --- | --- |
| `IDataCallback` | 机器人状态、传感器、故障、控制权事件和任务状态 | `SetDataCallback()` |
| `IControlCallback` | 控制命令、配置命令和任务命令应答 | `SetControlCallback()` |

建议在 `Connect()` 前注册回调，并使用 `std::shared_ptr` 保持对象生命周期。

## 回调线程要求

回调运行在 SDK 内部线程。回调函数中只进行：

- 数据复制和范围检查。
- 原子变量或轻量状态更新。
- 向线程安全队列投递消息。

::: warning 回调线程限制
不要在回调中执行同步 SDK 命令、文件读写、数据库写入、长时间锁等待或复杂计算。
:::

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

| 回调 | 触发方式 |
| --- | --- |
| `OnRobotStateData()` | 主动上报，约 1 Hz |
| `OnFaultData()` | 故障发生或更新时上报 |
| `OnImuData()` | 调用 `SetImuConfig()` 后按配置频率上报 |
| `OnLuxData()` | 调用 `SetLuxConfig(true)` 后约 1 Hz |
| `OnMcData()` | 调用 `SetMcConfig(true)` 后约 50 Hz |
| `OnSpeedData()` | 调用 `SetSpeedReportConfig()` 后按配置频率上报 |
| `OnJointStateData()` | 调用 `SetJointStateConfig(true)` 后上报 |
| `OnControlLost()` | SDK 失去控制权 |
| `OnControlAvailable()` | 控制权重新可申请 |
| `OnTaskStateData()` | 任务状态改变 |
| `OnDockScanResult()` | 扫描期间上报发现的充电桩 |
| `OnDockConnectionResult()` | 充电桩连接或断开操作完成时上报终态 |

## IControlCallback

控制应答回调用于确认机器人已收到命令。主要分组如下：

| 类别 | 回调 |
| --- | --- |
| 安全与姿态 | `OnSoftEmergencyStop()`、`OnStandUp()`、`OnWalk()`、`OnBalanceStandUp()`、`OnLieDown()`、`OnStair()`、`OnCrawl()`、`OnCrawlWalk()`、`OnClimb()`、`OnGait()`、`OnPosControl()`、`OnLocked()` |
| 速度和灯光 | `OnSpeed()`、`OnFrontLight()`、`OnAutoModeLight()` |
| 数据配置 | `OnLuxConfig()`、`OnImuConfig()`、`OnMcConfig()`、`OnSpeedReportConfig()`、`OnJointStateConfig()` |
| 控制权 | `OnTakeControlAck()`、`OnReleaseControlAck()` |
| 相机 | `OnUpdateCameraBitrateAck()` |
| 状态切换 | `OnSwitchRemote()`、`OnSwitchIdle()` |
| [充电桩配对](./07-04-dock-and-tasks.md#通过-sdk-配对) | `OnDockScanConfig(bool on)`、`OnDockConnectionAck(const DockConnectionAck& ack)`、`OnDockInfo(const DockInfo& info)` |
| 充电任务 | `OnStartRechargeTask()`、`OnStopRechargeTask()`、`OnStartUnDockTask()`、`OnStopUnDockTask()` |
| 外设电源 | `OnSetPeriphPower()`、`OnGetPeriphPower()` |
| LED | `OnSetLedAutoMode()`、`OnGetLedAutoMode()`、`OnSetLedCommand()` |

头文件还定义了若干与不开放接口对应的应答函数。调用不开放接口时，SDK 在本地返回 `Errc::UnsupportedDeviceOperation`，不会收到机器人应答。

## DeviceInfo

```cpp
struct DeviceInfo {
    DeviceType device_type = DeviceType::UNKNOWN;
    std::string sn;
};
```

| 产品或设备形态 | `DeviceType` |
| --- | --- |
| L2 | `L2F` |
| L2-W | `L2` |
| L2-W Ultra | `L2_ULTRA` |

连接成功前、断开后或握手未返回类型时，`device_type` 为 `UNKNOWN`。

## 传感器与运动数据

### ImuData

```cpp
struct ImuData {
    float acc_x, acc_y, acc_z;
    float gyro_x, gyro_y, gyro_z;
    float quat_x, quat_y, quat_z, quat_w;
};
```

包含三轴加速度、三轴角速度和四元数。记录日志时同时保存接收时间，并在应用层检查四元数是否有效。

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

| 字段 | 含义 |
| --- | --- |
| `quat` | 姿态四元数，顺序为 w、x、y、z |
| `v_world` | 世界坐标系线速度，m/s |
| `position` | 世界坐标系位置，m |
| `omega_world` | 世界坐标系角速度，rad/s |
| `v_body` | 机体坐标系线速度，m/s |
| `omega_body` | 机体坐标系角速度，rad/s |
| `time_stamp` | 纳秒时间戳 |

### SpeedData 与 JointStateData

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

处理关节数据前检查四个数组长度是否一致。不要假设固定关节数量，应按 `names` 建立名称到索引的映射。

## RobotState

`RobotState` 是应用最常用的综合状态：

| 字段 | 含义 |
| --- | --- |
| `head_angle` | 头部角度 |
| `front_fill_light` | 前补光灯状态 |
| `auto_mode_light` | 自动补光模式 |
| `charging_pile_connected` | 是否连接充电桩 |
| `speed_level` | 当前速度档位 |
| `software_emergency_status` | 软件急停状态 |
| `hardware_emergency_status` | 硬急停状态 |
| `motion_status` | 当前运动姿态 |
| `machine_status` | 当前机器业务状态 |
| `battery` | 电池状态 |
| `speed` | 当前速度 |
| `mile_data` | 累计里程 |
| `joint_temps` | 关节名称到温度的映射 |
| `control_source` | 当前控制来源 |

结构体中还包含通用状态字段。应用只应使用当前设备实际上报且业务需要的字段，不应把未变化字段当作硬件故障。

### 电池状态

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

电源状态包括 `UNKNOWN`、`CHARGING`、`DISCHARGING` 和 `FULL`。处理电量时先检查对应的 `present`，并结合电压、电流和充电桩连接状态判断。

### 运动状态

常用 `MotionStatus`：

| 枚举 | 含义 |
| --- | --- |
| `MOTION_STATUS_UNKNOWN` | 未知 |
| `MOTION_STATUS_STAND_UP` | 站立过程 |
| `MOTION_STATUS_WALK` | 站立完成，可移动 |
| `MOTION_STATUS_BALANCE_STAND` | 平衡站立 |
| `MOTION_STATUS_LIE_DOWN` | 卧倒 |
| `MOTION_STATUS_CRAWL` | 匍匐 |
| `MOTION_STATUS_CRAWL_WALK` | 匍匐行走 |
| `MOTION_STATUS_LOCKED` | 锁定 |
| `MOTION_STATUS_CLIMB` | 爬高台 |
| `MOTION_STATUS_STAIR` | 登阶 |
| `MOTION_STATUS_GAIT` | 精细步态，轮足设备类型可用 |
| `MOTION_STATUS_POS_CONTROL` | 位置控制 |

枚举中可能存在当前设备不开放的状态值，应用不应通过强制写入状态来绕过接口能力检查。

### 机器状态

| `MachineStatus` | 含义 |
| --- | --- |
| `UNKNOWN` | 未知 |
| `IDLE` | 空闲 |
| `REMOTE` | 远程控制 |
| `OTA` | 系统升级 |
| `RECHARGE` | 回充或充电任务 |
| `MAPPING` | 建图 |
| `NAVIGATION` | 导航 |
| `SAFETY` | 安全状态 |
| `SELFTEST` | 自检 |
| `SOFT_SHUTDOWN` | 软件关机 |
| `SILENCE` | 静默待机 |
| `FOLLOW` | 跟随 |
| `TRACK` | 目标跟踪 |
| `UNDOCK` | 离桩 |
| `DOCK_CALIBRATION` | 充电桩标定 |
| `ESTOP` | 急停 |
| `FALL` | 摔倒 |
| `LOCAL_REMOTE` | 本地遥控 |
| `LOW_LEVEL` | 低层控制状态 |

### 控制来源与急停

| 类型 | 枚举 | 含义 |
| --- | --- | --- |
| `CtrlSource` | `CTRL_SOURCE_UNKNOWN` | 未知 |
| `CtrlSource` | `CTRL_SOURCE_APP` | App 控制 |
| `CtrlSource` | `CTRL_SOURCE_SDK` | SDK 控制 |
| `CtrlSource` | `CTRL_SOURCE_OTHER` | 其他控制来源 |
| `EmergencyStatus` | `EMERGENCY_STATUS_UNKNOWN` | 未知 |
| `EmergencyStatus` | `EMERGENCY_STATUS_RECOVER` | 急停解除 |
| `EmergencyStatus` | `EMERGENCY_STATUS_STOP` | 急停触发 |

## 任务状态

```cpp
struct TaskStateInfo {
    TaskType task_type;
    TaskStatus task_status;
    std::string phase;
    uint32_t error_code;
};
```

| 类型 | 枚举 |
| --- | --- |
| `TaskType` | `SCAN_QR`、`MAPPING`、`NAV`、`RECHARGING`、`UNDOCK`、`UWB_FOLLOW`、`VISUAL_TRACK` |
| `TaskStatus` | `STARTING`、`RUNNING`、`SUCCESS`、`FAILURE`、`STOPPED` |

任务判断应同时检查 `task_type`、`task_status` 和 `error_code`。命令应答只表示收到命令，不表示任务完成。

## 故障信息

```cpp
struct FaultData {
    FaultCode code;
    FaultLevel level;
    std::string message;
};
using FaultDatas = std::vector<FaultData>;
```

故障级别包括 `FatalError`、`Error` 和 `Warn`。故障码覆盖执行器禁用、编码器错误、执行器离线、过压、过温、欠压、电池低电、CAN 通信异常、遥控保活失败、系统状态异常和 IMU 异常。

收到致命故障或错误级故障时，应用应停止发送运动命令、发送零速度并提示现场人员处理。

## 回调实现示例

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
