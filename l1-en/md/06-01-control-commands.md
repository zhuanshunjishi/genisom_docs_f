# Control Command Interface

[Return to Software Service Interface](./06-sdk-service-interfaces.md) | [Sensor reporting interface in real time](./06-02-real-time-sensor-data.md)

## Interface Description

The control command interface is marked in red in the diagram. Use it to send discrete actions and continuous motion input. `ZsibotExecutor` manages UDP send port `8081` for the application.

Before sending motion commands, confirm that the robot is connected and in the correct control mode, then request SDK control.

## Communications Parameters

| Parameter | Default |
| --- | --- |
| Robot IP | `192.168.234.1` |
| SDK Send port | `8081` |
| Transfer protocol | UDP |
| Message Format | JSON |

## Create SDK Executor

| Field | Contents |
| --- | --- |
| Function Name | `ZsibotExecutor` |
| Function Prototype | `ZsibotExecutor(Role role = Role::ROLE_REMOTE, const std::string &send_ip = "192.168.234.1", uint32_t send_port = 8081, uint32_t recv_port = 8080)` |
| Function Overview | Create the SDK executor and start the send, receive, and heartbeat threads |
| Parameter | `role`: communication role; `send_ip`: Robot IP;  `send_port`: sending port; `recv_port`: Receiving port |
| Return value | None. If construction fails, the SDK may throw an exception. |
| Notes | When using SDK control instructions, it is recommended to enter `Role::ROLE_SDK` and then send `CMD_SDK_CONTROL_RIGHT` requesting control |

The destructor stops the communication thread and releases network resources. Before exiting, stop the robot, send `CMD_REMOTE_CONTROL_RIGHT`, and check `GetFunctionMode()` to confirm remote control has been restored.

| Field | Contents |
| --- | --- |
| Function Name | `~ZsibotExecutor` |
| Function Prototype | `~ZsibotExecutor()` |
| Function Overview | Stop communication threads and release network resources |
| Parameter | None |
| Return value | None |
| Notes | Stop the robot and confirm that remote control has been restored before destroying the executor. |

## Send a Discrete Command

| Field | Contents |
| --- | --- |
| Function Name | `SetCmd` |
| Function Prototype | `void SetCmd(CmdCode cmd_code)` |
| Function Overview | Send commands for standing, lying down, emergency stop, mode changes, and stunts. |
| Parameter | `cmd_code`: `CmdCode` Enumeration values |
| Return value | None. Commands accepted by robots need to read feedback confirmation |
| Notes | `CMD_SDK_CONTROL_RIGHT` For application of SDK control; jumps, forward jumps, back flips, etc. require entry into laboratory mode and confirmation of current type support |

### Common Commands

| Command | Role |
| --- | --- |
| `CMD_EMERGENCY_STOP` | Trigger software emergency stop or enter damping mode |
| `CMD_SIT_DOWN` | Lie down |
| `CMD_STAND_UP` | Stand |
| `CMD_MOVE_MODE` | Enter mobile mode |
| `CMD_BALANCE_STAND_MODE` | Enter balance standing mode |
| `CMD_LOCK_MODE` | Access to lock mode |
| `CMD_SDK_CONTROL_RIGHT` | Request SDK control ownership |
| `CMD_REMOTE_CONTROL_RIGHT` | Request remote control ownership |
| `CMD_GENERAL_SDK_CONTROL_RIGHT` | Request General SDK control ownership |

### Control and Application

| Control order | Meaning of control | Apply scene |
| --- | --- | --- |
| `CMD_REMOTE_CONTROL_RIGHT` | Control of remote controls | Remote operation |
| `CMD_SDK_CONTROL_RIGHT` | Secondary development of navigation control | Responds to lower speed commands, such as 0.05 m/s during return-to-dock maneuvers |
| `CMD_GENERAL_SDK_CONTROL_RIGHT` | Universal secondary development navigation control | Respond to larger speed commands (e.g. 3 m/s, climbing stairs etc.) |

> **Choosing an SDK mode:** SDK mode (`CMD_SDK_CONTROL_RIGHT`) and General SDK mode (`CMD_GENERAL_SDK_CONTROL_RIGHT`) use different gaits. SDK mode accepts lower speeds for mapping and returning to charge. General SDK mode supports higher speeds for running and climbing stairs. Choose the mode for the task and verify the mode feedback before testing motion.

After requesting control, use `GetFunctionMode()` to verify the transition. The communication `Role` and control ownership are separate.

### CmdCode Related Definitions

| Enumeration values | Hexadecimal | Description |
| --- | --- | --- |
| `CMD_NULL` | `0x00` | Empty command |
| `CMD_EMERGENCY_STOP` | `0x5A` | Emergency stop. |
| `CMD_STAND_UP` | `0x7A` | Stand |
| `CMD_SIT_DOWN` | `0x6A` | Lie down |
| `CMD_MOVE_MODE` | `0x8A` | Move Mode |
| `CMD_BALANCE_STAND_MODE` | `0x9A` | Balance Standing Mode |
| `CMD_LOCK_MODE` | `0x9B` | Lock Mode |
| `CMD_SLOW_SPEED` | `0xAE` | Slow down. |
| `CMD_NORMAL_SPEED` | `0xAF` | Normal speed |
| `CMD_FAST_SPEED` | `0xB0` | Fast |
| `CMD_JUMP` | `0x01` | Jump. |
| `CMD_FORWARD_JUMP` | `0x02` | Jump forward |
| `CMD_BACK_FLIP` | `0x03` | Backflip |
| `CMD_GREET` | `0x04` | Say hello. |
| `CMD_TWO_LEG_STAND` | `0x05` | Stand on two legs |
| `CMD_CRAWL_FORWARD` | `0x09` | Crawl forward |
| `CMD_CLIMBING_HIGH_PLATFORM` | `0x0A` | Climb onto a raised platform |
| `CMD_HAND_STAND` | `0x0B` | Perform a two-leg handstand |
| `CMD_UNLOAD_SQUAT` | `0x0C` | Crouch to unload |
| `CMD_ENTER_LAB_MODE` | `0xC1` | Access to laboratory mode |
| `CMD_EXIT_LAB_MODE` | `0xC2` | Exit Laboratory Mode |
| `CMD_REMOTE_CONTROL_RIGHT` | `0xAA` | Request remote control. |
| `CMD_SDK_CONTROL_RIGHT` | `0xB3` | Request SDK Control |
| `CMD_GENERAL_SDK_CONTROL_RIGHT` | `0xB5` | Request universal SDK control |

> Note: Call `CMD_ENTER_LAB_MODE` before executing jumps, forward jumps, backflips, greeting gestures, two-leg stands, or unloading crouches.
> Wheeled-legged models (`MODEL_XGW` / `MODEL_XGWHSPD`) cannot jump, jump forward, greet, backflip, or stand on two legs.

## Set Continuous Movement Input

| Field | Contents |
| --- | --- |
| Function Name | `SetRemote` |
| Function Prototype | `void SetRemote(const std::array<float32_t, 4> &joy_stick, const std::array<float32_t, 14> &button)` |
| Function Overview | Send continuous movement input and key-button status |
| Parameters | `joy_stick` contains four joystick values in this order: forward/backward, left/right, rotation, and head angle. `button` contains 14 button values. |
| Return value | None |
| Notes | Joystick values with an absolute value greater than 1 are automatically normalized to `[-1, 1]`. Send `0` for all joystick axes to stop motion. |

Head angle control is available only when the reported control mode is Balance Standing Mode (`CM_BALANCE_STAND_MODE`). In this mode, the third `joy_stick` value controls head yaw, and the fourth controls head pitch.

The keyboard example reads direction input from `w`, `s`, `a`, `d`, `q`, and `e`. After 200 ms without any of these inputs, it sends zero for every joystick axis. Pressing `c` also sends all-zero joystick input immediately. This timeout belongs to the keyboard example. Implement your own timeout that resets motion inputs to zero when writing a separate application.

Example:

```cpp
#include "zsibot_sdk/zsibot_api.h"
#include <array>
#include <chrono>
#include <thread>

using namespace zsibot;

int main()
{
    ZsibotExecutor robot(Role::ROLE_SDK);

    // Only status feedback confirmed entry SDK mode after sending the movement input.
    if (!robot.IsConnected()
        || robot.GetFunctionMode() != FunctionMode::FM_SDK) {
        return 1;
    }

    // Forward!
    robot.SetRemote({0.5f, 0.0f, 0.0f, 0.0f},
                    std::array<float32_t, 14>{0.0f});

    // Stop continuous exercise
    robot.SetRemote({0.0f, 0.0f, 0.0f, 0.0f},
                    std::array<float32_t, 14>{0.0f});

    robot.SetCmd(CmdCode::CMD_REMOTE_CONTROL_RIGHT);
    const auto deadline = std::chrono::steady_clock::now()
                        + std::chrono::seconds(5);
    while (robot.GetFunctionMode() != FunctionMode::FM_REMOTE
           && std::chrono::steady_clock::now() < deadline) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    return robot.GetFunctionMode() == FunctionMode::FM_REMOTE ? 0 : 2;
}
```

## Recommended Call Order

1. Create `ZsibotExecutor`.
2. Wait for `IsConnected()` to return `true`.
3. Send `CMD_SDK_CONTROL_RIGHT` to request control.
4. Verify `GetFunctionMode() == FunctionMode::FM_SDK`. Use `GetControlMode()` to check whether the robot is standing, lying down, or moving.
5. Call `SetCmd()` or `SetRemote()` as needed.
6. Keep checking the connection state and fault reports during operation.
7. Stop motion, send `CMD_REMOTE_CONTROL_RIGHT`, and confirm `GetFunctionMode() == FunctionMode::FM_REMOTE` before destroying the executor.

## Safety Precautions

- `SetCmd()` returns before the action result is available. Check robot feedback to verify that the action completed.
- Check control ownership separately from `IsConnected()`.
- Before sending a motion command, clear people, cables, and obstacles. Keep the controller's software emergency stop or damping switch available.
- Stop sending motion commands and enter a safe state if the network drops, the heartbeat times out, fault severity increases, or the program behaves unexpectedly.
