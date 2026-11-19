# SDK service interfaces

[Back to Home](../index.md) | [Hardware, software and architecture](./03-system-architecture.md) | [SDK Guidance for development and operation](./08-sdk-development-guide.md)

## Interface description

The Zsibot SDK communicates with the robot over UDP. It provides motion commands, sensor status, connection checks, Wi-Fi configuration, and fault reports.

SDK For source code, version description and example program see GitHub: [zsibot/genisom_l1_sdk](https://github.com/zsibot/genisom_l1_sdk).

According to the interface function, this part is divided into five separate documents. The five documents correspond to the control command port, the sensor ' s real-time reporting port, the heart beat detection port, the WiFi hotspot configuration port and the failure information query port in the red box.

The five services share the same UDP send and receive ports. Access the services through `ZsibotExecutor` and leave socket and port management to the SDK.

## Five interface documents

| Interface Document | Main elements | Main SDK Entry |
| --- | --- | --- |
| [Control command interface](./06-01-control-commands.md) | Send discrete action commands and continuous motion input, request SDK control | `SetCmd()`, `SetRemote()`, `ZsibotExecutor` |
| [Real-time sensor data interface](./06-02-real-time-sensor-data.md) | Read battery level, orientation, velocity, odometry, motor data, and joint states | `GetPower()`, `GetQuaternion()`, `GetLeg*Joint()` |
| [Heartbeat interface](./06-03-heartbeat.md) | Maintain the heartbeat and check the connection | `IsConnected()` |
| [Wi-Fi hotspot configuration interface](./06-04-wifi-hotspot-configuration.md) | Change the Wi-Fi name and password and read the asynchronous result | `SetWifi()`, `GetWifiResutlf()`, `IsRecvWifiResult()` |
| [Fault Information Query Interface](./06-05-fault-information.md) | Read the list of bugs last reported by the robot. | `GetFaultInfo()` |

## Default Network Configuration

| Parameter | Default |
| --- | --- |
| Robot IP | `192.168.234.1` |
| SDK Send port | `8081` |
| SDK Receiving port | `8080` |
| Transfer protocol | UDP |
| Message Format | JSON |
| Heart beating cycle | 50 ms |
| Connection timeout judgement | SDK Internal heartbeat time exceeds 5 s, or is considered unconnected when no robotic data have been received |

If you need to modify IP or the port, the parameter should be entered during the construction of `ZsibotExecutor`. The application layer does not normally need to create UDP socket itself, nor does it need to repeat the heartbeat.

## Recommended call order

1. Create `ZsibotExecutor`.
2. Wait for `IsConnected()` to return `true`. See the [heartbeat interface](./06-03-heartbeat.md).
3. Call `CMD_SDK_CONTROL_RIGHT` in [Control command interface](./06-01-control-commands.md) to request control.
4. Read the functional mode in [Sensor reporting interface in real time](./06-02-real-time-sensor-data.md); confirm `GetFunctionMode() == FunctionMode::FM_SDK`; control mode is used only to determine standing, grounding, moving, etc.
5. Read [Fault Information Query Interface](./06-05-fault-information.md) Confirm that there are no current failures that need to be addressed.
6. Send `SetCmd()` or `SetRemote()` as required.
7. Continuous reading of sensors, connectivity and malfunctioning information during operation.
8. When the net is broken, the heart beat is timed out, the failure level is raised or the procedure is abnormal, the dispatch of the motion instruction is stopped and the safety is achieved.

## Minimal process example

```cpp
#include "zsibot_sdk/zsibot_api.h"
#include <chrono>
#include <thread>

using namespace zsibot;

int main()
{
    ZsibotExecutor robot(Role::ROLE_SDK);

    const auto connect_deadline = std::chrono::steady_clock::now()
                                + std::chrono::seconds(5);
    while (!robot.IsConnected()
           && std::chrono::steady_clock::now() < connect_deadline) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    if (!robot.IsConnected()) {
        return 1;
    }

    robot.SetCmd(CmdCode::CMD_SDK_CONTROL_RIGHT);

    const auto control_deadline = std::chrono::steady_clock::now()
                                + std::chrono::seconds(5);
    while (robot.GetFunctionMode() != FunctionMode::FM_SDK
           && std::chrono::steady_clock::now() < control_deadline) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    if (robot.GetFunctionMode() != FunctionMode::FM_SDK) {
        return 2;
    }

    robot.SetCmd(CmdCode::CMD_REMOTE_CONTROL_RIGHT);
    const auto remote_deadline = std::chrono::steady_clock::now()
                               + std::chrono::seconds(5);
    while (robot.GetFunctionMode() != FunctionMode::FM_REMOTE
           && std::chrono::steady_clock::now() < remote_deadline) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    return robot.GetFunctionMode() == FunctionMode::FM_REMOTE ? 0 : 3;
}
```

## Usage notes

- The five services share one set of UDP ports.
- The sending port `8081` and the receiving port `8080` are centrally managed by the SDK implementer.
- `IsConnected()` confirms that the link is active. Verify control ownership separately and keep the remote controller available for on-site takeover.
- The status-reading function obtains the latest cache data and should check the state of connection and the validity of the data before using it.
- WiFi configuration leads to changes in network connection, and the program should be reconnected.
- The failure information should be continuously checked for start-up, pre-motion and running.
