# SDK Service Interfaces

[Back to Home](../index.md) | [System Architecture](./03-system-architecture.md) | [SDK Development Guide](./08-sdk-development-guide.md)

## Interface Description

The Zsibot SDK communicates with the robot over UDP. It provides motion commands, sensor status, connection checks, Wi-Fi configuration, and fault reports.

The [Genisom L1 SDK repository](https://github.com/zsibot/genisom_l1_sdk) contains the SDK source code, release notes, and examples.

Each of the five interface pages covers a service shown in the red box in the architecture diagram. The services handle control commands, real-time sensor reports, heartbeats, Wi-Fi hotspot configuration, and fault information.

The five services share one UDP send port and one UDP receive port. Access all five through `ZsibotExecutor` and let the SDK manage the sockets and port bindings.

## Five Interface Documents

| Interface Document | Main elements | Main SDK Entry |
| --- | --- | --- |
| [Control command interface](./06-01-control-commands.md) | Send discrete action commands and continuous motion input, request SDK control | `SetCmd()`, `SetRemote()`, `ZsibotExecutor` |
| [Real-time sensor data interface](./06-02-real-time-sensor-data.md) | Read battery level, orientation, velocity, odometry, motor data, and joint states | `GetPower()`, `GetQuaternion()`, `GetLeg*Joint()` |
| [Heartbeat interface](./06-03-heartbeat.md) | Maintain the heartbeat and check the connection | `IsConnected()` |
| [Wi-Fi hotspot configuration interface](./06-04-wifi-hotspot-configuration.md) | Change the Wi-Fi name and password and read the asynchronous result | `SetWifi()`, `GetWifiResutlf()`, `IsRecvWifiResult()` |
| [Fault Information Query Interface](./06-05-fault-information.md) | Read the latest list of faults reported by the robot. | `GetFaultInfo()` |

## Default Network Configuration

| Parameter | Default |
| --- | --- |
| Robot IP | `192.168.234.1` |
| SDK Send port | `8081` |
| SDK Receiving port | `8080` |
| Transfer protocol | UDP |
| Message Format | JSON |
| Heartbeat interval | 50 ms |
| Connection timeout | The connection is invalid if the SDK heartbeat timer exceeds 5 s or the SDK has received no data from the robot |

To use a different IP address or port, pass it to the `ZsibotExecutor` constructor. The SDK normally handles UDP socket creation and heartbeats.

## Recommended Call Order

1. Create `ZsibotExecutor`.
2. Wait for `IsConnected()` to return `true`. See the [heartbeat interface](./06-03-heartbeat.md).
3. Send `CMD_SDK_CONTROL_RIGHT` to request SDK control ownership. See [Control Command Interface](./06-01-control-commands.md).
4. Check that `GetFunctionMode() == FunctionMode::FM_SDK`. Use control mode only to check the robot’s posture or motion state, such as standing, lying down, or moving. See [Real-Time Sensor Data Interface](./06-02-real-time-sensor-data.md).
5. Read the [fault information](./06-05-fault-information.md) and confirm there are no faults that require attention.
6. Call `SetCmd()` or `SetRemote()` as needed.
7. Keep checking sensor data, the connection, and fault reports during operation.
8. Stop sending motion commands and enter a safe state if the connection drops, the heartbeat times out, fault severity increases, or the program behaves unexpectedly.

## Minimal Process Example

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

## Usage Notes

- The five services share one set of UDP ports.
- The sending port `8081` and the receiving port `8080` are managed by the SDK executor.
- `IsConnected()` confirms that the link is active. Verify control ownership separately and keep the remote controller available for on-site takeover.
- Status getters read the latest cached data. Check the connection and data validity before using the readings.
- Handle reconnection when a Wi-Fi configuration change alters the network connection.
- Check for faults at startup, before moving, and throughout operation.
