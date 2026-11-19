# Control command interface

[Return to Software Service Interface](./06-sdk-service-interfaces.md) | [Sensor reporting interface in real time](./06-02-real-time-sensor-data.md)

## Interface description

Control command interfaces are used to send discrete action commands and continuous motion input to robots, corresponding to the " Control Command Port " in the red box. SDK Use UDP Send Port `8081`, application passed `ZsibotExecutor` Call interface, no need to create yourself UDP socket.

Before moving control, you should confirm that the robot is connected, that the current mode of control is correct, and apply for SDK control.

## Communications parameters

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
| Function Overview | Create SDK Executor and start the delivery, reception and heartbeat communication threads |
| Parameter | `role` _: communication role; `send_ip`: Robot IP;  `send_port`: sending port; `recv_port`: Receiving port |
| Return value | No, it's possible to throw when construction fails SDK Unusual |
| Notes | When using SDK control instructions, it is recommended to enter `Role::ROLE_SDK` and then send `CMD_SDK_CONTROL_RIGHT` requesting control |

The operator's analysis will stop the communication thread and release the network resources. Before the program is withdrawn, the robot should stop moving, send `CMD_REMOTE_CONTROL_RIGHT` and confirm that remote control has been restored according to `GetFunctionMode()`.

| Field | Contents |
| --- | --- |
| Function Name | `~ZsibotExecutor` |
| Function Prototype | `~ZsibotExecutor()` |
| Function Overview | Stop communication lines and release network resources |
| Parameter | None |
| Return value | None |
| Notes | The program should cease movement before withdrawal and confirm that remote control has been restored before destruction of the implementer |

## Send a discrete command

| Field | Contents |
| --- | --- |
| Function Name | `SetCmd` |
| Function Prototype | `void SetCmd(CmdCode cmd_code)` |
| Function Overview | Send commands for stand-ups, ground-ups, stop-ups, pattern switching, stunting, etc. |
| Parameter | `cmd_code`: `CmdCode` Enumeration values |
| Return value | None. Commands accepted by robots need to read feedback confirmation |
| Notes | `CMD_SDK_CONTROL_RIGHT` For application of SDK control; jumps, forward jumps, back flips, etc. require entry into laboratory mode and confirmation of current type support |

### Common commands

| Command | Role |
| --- | --- |
| `CMD_EMERGENCY_STOP` | Trigger software emergency stop or enter damping mode |
| `CMD_SIT_DOWN` | Get down! |
| `CMD_STAND_UP` | Stand |
| `CMD_MOVE_MODE` | Enter mobile mode |
| `CMD_BALANCE_STAND_MODE` | Enter balance station mode |
| `CMD_LOCK_MODE` | Access to lock mode |
| `CMD_SDK_CONTROL_RIGHT` | Request SDK Right of control |
| `CMD_REMOTE_CONTROL_RIGHT` | Request for remote control |
| `CMD_GENERAL_SDK_CONTROL_RIGHT` | Request for general use SDK Right of control |

### Control and application

| Control order | Meaning of control | Apply scene |
| --- | --- | --- |
| `CMD_REMOTE_CONTROL_RIGHT` | Control of remote controls | Remote operation |
| `CMD_SDK_CONTROL_RIGHT` | Secondary development of navigation control | Respond to smaller speed commands (e. g. 0.05 m/s, refill etc.) |
| `CMD_GENERAL_SDK_CONTROL_RIGHT` | Universal secondary development navigation control | Respond to larger speed commands (e.g. 3 m/s, climbing stairs etc.) |

> **Choosing an SDK mode:** SDK mode (`CMD_SDK_CONTROL_RIGHT`) and General SDK mode (`CMD_GENERAL_SDK_CONTROL_RIGHT`) use different gaits. SDK mode accepts lower speeds for mapping and returning to charge. General SDK mode supports higher speeds for running and climbing stairs. Choose the mode for the task and verify the mode feedback before testing motion.

After requesting control, use `GetFunctionMode()` to verify the transition. The communication `Role` and control ownership are separate.

### CmdCode related definitions

| Enumeration values | Hexadecimal | Description |
| --- | --- | --- |
| `CMD_NULL` | `0x00` | Empty command |
| `CMD_EMERGENCY_STOP` | `0x5A` | Emergency stop. |
| `CMD_STAND_UP` | `0x7A` | Stand |
| `CMD_SIT_DOWN` | `0x6A` | Get down! |
| `CMD_MOVE_MODE` | `0x8A` | Move Mode |
| `CMD_BALANCE_STAND_MODE` | `0x9A` | Balance Standing Mode |
| `CMD_LOCK_MODE` | `0x9B` | Lock Mode |
| `CMD_SLOW_SPEED` | `0xAE` | Slow down. |
| `CMD_NORMAL_SPEED` | `0xAF` | Normal speed |
| `CMD_FAST_SPEED` | `0xB0` | Fast |
| `CMD_JUMP` | `0x01` | Jump. |
| `CMD_FORWARD_JUMP` | `0x02` | Jump! |
| `CMD_BACK_FLIP` | `0x03` | Backwards. |
| `CMD_GREET` | `0x04` | Say hello. |
| `CMD_TWO_LEG_STAND` | `0x05` | Stand on your legs. |
| `CMD_CRAWL_FORWARD` | `0x09` | Scratch forward. |
| `CMD_CLIMBING_HIGH_PLATFORM` | `0x0A` | Climb the tower. |
| `CMD_HAND_STAND` | `0x0B` | Keep your legs upside down. |
| `CMD_UNLOAD_SQUAT` | `0x0C` | Unload the cargo and get down. |
| `CMD_ENTER_LAB_MODE` | `0xC1` | Access to laboratory mode |
| `CMD_EXIT_LAB_MODE` | `0xC2` | Exit Laboratory Mode |
| `CMD_REMOTE_CONTROL_RIGHT` | `0xAA` | Request remote control. |
| `CMD_SDK_CONTROL_RIGHT` | `0xB3` | Request SDK Control |
| `CMD_GENERAL_SDK_CONTROL_RIGHT` | `0xB5` | Request universal SDK control |

> Note: Jumping, front jumps, back flips, greeting, standing on both legs, unloading and crouching require a first call `CMD_ENTER_LAB_MODE` to enter laboratory mode.
> The footer type (`MODEL_XGW` / `MODEL_XGWHSPD`) does not use jumps, forward jumps, greetings, rear flips, standing legs.

## Set continuous movement input

| Field | Contents |
| --- | --- |
| Function Name | `SetRemote` |
| Function Prototype | `void SetRemote(const std::array<float32_t, 4> &joy_stick, const std::array<float32_t, 14> &button)` |
| Function Overview | Send continuous movement input and key-button status |
| Parameter | `joy_stick` :  4 (a) A roller value in order of front- and back-to-back, rotation, left-to-hand, head angle; `button` :  14 A button value |
| Return value | None |
| Notes | The swing pole is definitely more than 1 It's automatically integrated. `[-1, 1]`. Send all when you stop moving 0 Rolling pole value |

A companion keyboard example continues to be received `w`,  `s`,  `a`,  `d`,  `q`,  `e` orientation input;continuing 200 ms when these keys are not detected, the example will judge that all should be stopped and sent 0 Click the value. Press it. `c` I'll send them all right away. 0 The swing bar value, but not the only way to stop moving. This rule is the keyboard input processing logic of the illustrative program; when self-developing the program, the time-to-zero mechanism still needs to be pursued proactively.

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

## Recommended call order

1. Create `ZsibotExecutor`.
2. Wait for `IsConnected()` to return `true`.
3. Send `CMD_SDK_CONTROL_RIGHT` to request control.
4. Verify `GetFunctionMode() == FunctionMode::FM_SDK`. Use `GetControlMode()` to check whether the robot is standing, lying down, or moving.
5. Call `SetCmd()` or `SetRemote()` as needed.
6. Keep checking the connection state and fault reports during operation.
7. Stop motion, send `CMD_REMOTE_CONTROL_RIGHT`, and confirm `GetFunctionMode() == FunctionMode::FM_REMOTE` before destroying the executor.

## Safety precautions

- `SetCmd()` returns before the action result is available. Check robot feedback to verify that the action completed.
- Check control ownership separately from `IsConnected()`.
- Before sending a motion command, clear people, cables, and obstacles. Keep the controller's software emergency stop or damping switch available.
- Stop sending motion commands and enter a safe state if the network drops, the heartbeat times out, fault severity increases, or the program behaves unexpectedly.
