# Robot control

[Overview of interfaces](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Control ownership {#control-ownership}

### TakeControl

```cpp
std::error_code TakeControl(
    int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Apply for normal control of robots. The return value indicates only whether the application order was issued and whether control was actually obtained. `OnTakeControlAck()` It's... `error_code` Yes.

### ReleaseControl

```cpp
std::error_code ReleaseControl(
    int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Active release of control. A call is recommended when the program exits or no longer controls the robot.

For the process of application, taking over and restoration of control, see [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md#control-ownership-mechanism).

## Security control

### SoftEmergencyStop

```cpp
std::error_code SoftEmergencyStop(
    bool on, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

`on == true` triggers the stop, `on == false` cancels the stop. The stop is not subject to ordinary control, but cannot be a substitute for a physical emergency stop.

Answers are returned by `IControlCallback::OnSoftEmergencyStop(bool on)` and the status is also read from `RobotState::software_emergency_status`.

## Posture control

The following interfaces are only public parameters `timeout_ms` and `handler`:

| Functions | Prototype | Functions |
| --- | --- | --- |
| `StandUp` | `std::error_code StandUp(int timeout_ms = 0, WriteHandler handler = ...)` | Stand |
| `Walk` | `std::error_code Walk(int timeout_ms = 0, WriteHandler handler = ...)` | Switch to moveable walking postures |
| `BalanceStandUp` | `std::error_code BalanceStandUp(int timeout_ms = 0, WriteHandler handler = ...)` | Balance Standing |
| `LieDown` | `std::error_code LieDown(int timeout_ms = 0, WriteHandler handler = ...)` | Lie down |
| `Stair` | `std::error_code Stair(int timeout_ms = 0, WriteHandler handler = ...)` | Step-up |
| `Crawl` | `std::error_code Crawl(int timeout_ms = 0, WriteHandler handler = ...)` | Shit. |
| `CrawlWalk` | `std::error_code CrawlWalk(int timeout_ms = 0, WriteHandler handler = ...)` | Walk on your face. |
| `Climb` | `std::error_code Climb(int timeout_ms = 0, WriteHandler handler = ...)` | Climb the tower. |
| `Gait` | `std::error_code Gait(int timeout_ms = 0, WriteHandler handler = ...)` | A fine step. |
| `Slim` | `std::error_code Slim(int timeout_ms = 0, WriteHandler handler = ...)` | Skinny across the narrow. |
| `PosControl` | `std::error_code PosControl(int timeout_ms = 0, WriteHandler handler = ...)` | Toggle position control. |
| `SkWalk` | `std::error_code SkWalk(int timeout_ms = 0, WriteHandler handler = ...)` | Walk on your knees. |
| `Sand` | `std::error_code Sand(int timeout_ms = 0, WriteHandler handler = ...)` | Sand Posture |
| `ReverseHeadTail` | `std::error_code ReverseHeadTail(int timeout_ms = 0, WriteHandler handler = ...)` | Turn the tail. |
| `Locked` | `std::error_code Locked(int timeout_ms = 0, WriteHandler handler = ...)` | Lock joint position |

![M1 SDK Motion status](../diagrams/SDK-Motion-States.svg)

After standing, `RobotState::motion_status` usually becomes `MOTION_STATUS_WALK`, which means that the robot is standing and moving. `Locked()` will maintain the current joint position, and other posturing orders will be unlocked.

`Walk()` provided from v0.2.3. Upon receipt `IControlCallback::OnWalk()`, confirm by `RobotState::motion_status` whether the posture has been switched to `MOTION_STATUS_WALK`.

## Movement control

### Move

```cpp
std::error_code Move(
    float left_right, float forward_back, float yaw,
    int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Sends the ratio of smoothing and rotation speeds in a general motion state.

| Parameter | Scope | Description |
| --- | --- | --- |
| `left_right` | `[-1.0, 1.0]` | Left and right square, positive left, negative right |
| `forward_back` | `[-1.0, 1.0]` | Move ratio back and forth, positive forward, negative back |
| `yaw` | `[-1.0, 1.0]` | Rotation ratio, positive left, negative right |

The actual speed is determined by the current speed slot of `SetSpeed()`. The robotic side usually maintains only the latest `Move()` instruction approximately 1 s, which is proposed to be sent in the 10 to 20 Hz cycles.

### MoveVelocity

```cpp
std::error_code MoveVelocity(
    float x, float y, float yaw, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

The speed at which the body coordinates are sent by physical unit. `x` Back and forth, heading forward, `y` It's horizontal speed, heading left, both of them. m/s. `yaw` Angular velocity around the vertical axis, in units rad/s, following the right-hand rule.

The speed is limited by the current `SetSpeed()` slot, and the continuous movement recommends that it be sent in 10 to 20 Hz cycles. The parameter is NN or infinity and returns `std::errc::invalid_argument`. Sending results can be checked through `WriteHandler` and the interface has no specific control.

### PosMove

```cpp
std::error_code PosMove(
    PosControlCmd cmd, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Sends the target position at a bit control position. Call `PosControl()` before using it.

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

`x/y/z` in m, `roll/pitch/yaw` in rad.

### Turn

```cpp
std::error_code Turn(
    int direction, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Controls the body right and left scrolling in in situ mode: `0` Restore, `1` Left flip, `2` Right flip. Other values return `std::errc::invalid_argument`.

### ControlHead

```cpp
std::error_code ControlHead(
    float left_right, float up_down, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Controls the right and right probes in in situ mode and heads up. Both parameters range `[-1.0, 1.0]`: positive numbers are left, upward and negative are right and lower.

### HighLowStance

```cpp
std::error_code HighLowStance(
    int stance, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Adjusting body position: `0` Restoration, `1` High position, `2` Low position.

### SetSpeed

```cpp
std::error_code SetSpeed(
    int speed_level, int timeout_ms = 0,
    WriteHandler handler = [](const std::error_code&, std::size_t) {});
```

Sets the speed slot of `Move()`: `1` low, `2` medium, `3` high. Other values return the parameter error. The higher the speed slot, the smaller the group range of moving and rotating horizontally.
