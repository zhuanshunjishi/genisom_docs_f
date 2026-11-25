# Genisom L2 Robot Control

[SDK API Reference](./07-sdk-api-reference.md) | [Control Ownership, Tasks, and Peripheral Control](./09-control-ownership-tasks-and-peripherals.md)

## Control Ownership

```cpp
std::error_code TakeControl(int timeout_ms = 0, WriteHandler handler = ...);
std::error_code ReleaseControl(int timeout_ms = 0, WriteHandler handler = ...);
```

Check the send result from `TakeControl()` for transmission errors. Control ownership is confirmed only when `OnTakeControlAck()` reports `error_code == 0`.

## Safety Control

### SoftEmergencyStop

```cpp
std::error_code SoftEmergencyStop(
    bool on, int timeout_ms = 0, WriteHandler handler = ...);
```

Use `on == true` to activate the software emergency stop or pass `false` to clear it. `OnSoftEmergencyStop()` reports the acknowledgment. Read `RobotState::software_emergency_status` for the current state.

## Posture Control

| API | Function | Genisom L2 Series Support |
| --- | --- | --- |
| `StandUp()` | Stand up | Supported |
| `BalanceStandUp()` | Stand in a balanced posture in place | Supported |
| `LieDown()` | Lie down | Supported |
| `Stair()` | Switch to a stair-climbing posture | Supported |
| `Crawl()` | Switch to a crawling posture | Supported |
| `CrawlWalk()` | Move while crawling | Supported |
| `Climb()` | Switch to a posture for climbing onto a raised platform | Unsupported |
| `Gait()` | Switch to a precision gait | Wheeled-legged device types only |
| `PosControl()` | Switch to the position-control posture | Supported |
| `Locked()` | Lock the current posture | Supported |
| `Slim()` | Switch to a posture for narrow passages | Unsupported |
| `DSB()` | Switch to a posture for crossing rodent barriers | Unsupported |
| `SkWalk()` | Switch to the same-knee posture | Unsupported |
| `Sand()` | Switch to a posture for sandy terrain | Unsupported |
| `ReverseHeadTail()` | Reverse the front and rear directions | Unsupported |

These APIs use the common `timeout_ms` and `WriteHandler` parameters. Check `RobotState::motion_status` to confirm when the posture change is complete.

## Motion Control

### Move

```cpp
std::error_code Move(
    float left_right, float forward_back, float yaw,
    int timeout_ms = 0, WriteHandler handler = ...);
```

| Parameter | Range | Description |
| --- | --- | --- |
| `left_right` | `[-1.0, 1.0]` | Positive values move left and negative values move right. |
| `forward_back` | `[-1.0, 1.0]` | Positive values move forward and negative values move backward. |
| `yaw` | `[-1.0, 1.0]` | Positive values turn left and negative values turn right. |

For continuous movement, send the command at 10 to 20 Hz. To stop, send `Move(0, 0, 0)` explicitly. Stopping the application loop alone is insufficient.

### PosMove

```cpp
std::error_code PosMove(
    PosControlCmd cmd, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Send a target body pose. Call `PosControl()` first and verify that `RobotState::motion_status` has reached `MOTION_STATUS_POS_CONTROL` before sending the target.

```cpp
struct PosControlCmd {
    float x;
    float y;
    float z;
    float roll;
    float pitch;
    float yaw;
};
```

`x`, `y`, and `z` specify the target position in m. `roll`, `pitch`, and `yaw` specify the target roll, pitch, and yaw angles, respectively, in rad.

`WriteHandler` reports the asynchronous send result. A successful result confirms transmission only. See [Common Parameters and Return Values](./07-sdk-api-reference.md#common-parameters-and-return-values).

### Body Control

| API | Parameters | Description |
| --- | --- | --- |
| [`Turn()`](#turn) | `direction` | Rotate the body left or right in place. |
| [`ControlHead()`](#controlhead) | `left_right`, `up_down` | Lean the head left or right and raise or lower it. |
| [`HighLowStance()`](#highlowstance) | `stance` | Adjust the standing height. |
| [`SetSpeed()`](#setspeed) | `speed_level` | Set the movement speed level. |

Before using `Turn()`, `ControlHead()`, or `HighLowStance()`, call `BalanceStandUp()` and verify that `RobotState::motion_status` is `MOTION_STATUS_BALANCE_STAND`.

#### Turn

```cpp
std::error_code Turn(
    int direction, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Set `direction` to `0` to return to the neutral position, `1` to rotate left in place, or `2` to rotate right in place. Other values return `std::errc::invalid_argument`.

#### ControlHead

```cpp
std::error_code ControlHead(
    float left_right, float up_down, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

| Parameter | Range | Description |
| --- | --- | --- |
| `left_right` | `[-1.0, 1.0]` rad/s | Positive values lean the head left and negative values lean it right. |
| `up_down` | `[-1.0, 1.0]` rad/s | Positive values raise the head and negative values lower it. |

Out-of-range values return `std::errc::invalid_argument`.

#### HighLowStance

```cpp
std::error_code HighLowStance(
    int stance, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Set `stance` to `0` to restore the default stance, `1` for a high stance, or `2` for a low stance.

#### SetSpeed

```cpp
std::error_code SetSpeed(
    int speed_level, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Set `speed_level` to `1`, `2`, or `3` for low, medium, or high speed, respectively. This setting determines the actual speed limit for `Move()` in general motion mode. The default is low speed. Other values return `std::errc::invalid_argument`.

When the robot receives the command, it acknowledges it through `IControlCallback::OnSpeed(int speed_level)`. Read `RobotState::speed_level` for the current speed level.

## Minimal Safe Control Example

::: warning Before Running on a Physical Robot
Add data callbacks, emergency stop checks, fault checks, posture completion checks, and signal handling for shutdown before running this example on a physical robot.
:::

```cpp
#include <atomic>
#include <chrono>
#include <iostream>
#include <memory>
#include <thread>
#include "robot_sdk/sdk_client.hpp"

using namespace robot_sdk;

class ControlCallback final : public IControlCallback {
public:
    void OnTakeControlAck(const TakeControlAck& ack) override {
        has_control.store(ack.error_code == 0);
        control_reply.store(true);
    }

    std::atomic_bool control_reply{false};
    std::atomic_bool has_control{false};
};

int main(int argc, char** argv) {
    if (argc != 2) return 1;

    SDKClient client;
    auto control_cb = std::make_shared<ControlCallback>();
    client.SetControlCallback(control_cb);

    auto ec = client.Connect(argv[1], "8082", true);
    if (ec) {
        std::cerr << ec.message() << '\n';
        return 1;
    }

    client.TakeControl();
    for (int i = 0; i < 40 && !control_cb->control_reply; ++i) {
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
    }
    if (!control_cb->has_control) {
        std::cerr << "control unavailable\n";
        client.Disconnect(true);
        return 1;
    }

    ec = client.StandUp(2000);
    if (!ec) {
        for (int i = 0; i < 20; ++i) {
            client.Move(0.0f, 0.15f, 0.0f);
            std::this_thread::sleep_for(std::chrono::milliseconds(50));
        }
        client.Move(0.0f, 0.0f, 0.0f);
    }

    client.ReleaseControl(1000);
    client.Disconnect(true);
    return ec ? 1 : 0;
}
```
