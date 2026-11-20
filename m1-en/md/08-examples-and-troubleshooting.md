# Genisom M1 Examples and Troubleshooting

[Return Document Overview](../index.md) | [M1 SDK Quick start](./04-sdk-quickstart.md) | [Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md) | [M1 SDK Interface reference](./06-sdk-api-reference.md)

## Example Program Directory

Example in SDK It's a bag. `example/` Directory, written with all C++:

| Documentation | Main elements |
| --- | --- |
| `quick_start.cpp` | Read-only check for connection, version and front frame robot state |
| `data.cpp` | Connect robots and read data |
| `control.cpp` | Integrated control, status reading, light patches, stoppages and stoppages |
| `async.cpp` | Step-up connection, step-over commands and echoes |
| `sync.cpp` | Synchronize connection, sync commands and return value checks |
| `manual_reconnect.cpp` | Manually disconnected and reconnected |
| `auto_reconnect.cpp` | Automatic reconnection and connectivity changes |
| `take_control.cpp` | Control incidents, applications and releases |
| `camera_bitrate.cpp` | Set pre- and post-cam number rate |
| `recharge.cpp` | Start and stop recharge and undocking tasks |
| `led.cpp` | LED Automatic mode, manual mode and light |
| `dock_pairing.cpp` | Scan, select, connect, query and uncharged stakes |

## Run an Engagement

The compilation of examples and the first steps in running them are shown in [M1 SDK Quick start](./04-sdk-quickstart.md#build-official-examples).

Most examples use the same parameter format:

```text
<program> <robot-ip> <port>
```

An interactive example can be pressed `h` to view the button, and `q` to exit. The program should stop moving and then disconnect SDK before exiting.

## Example of First Connection

`quick_start.cpp` Connect the robot to output version and device information, wait for the front frame robot state, and then disconnect and exit. See how you run it. [Fast start.](./04-sdk-quickstart.md#build-official-examples).

## data.cpp: Read State

`data.cpp` Validation of connections and data types for reporting. The program registers data and control backslides, then moves to connect robots, and outputs versions of SDK and protocols.

Check contents:

1. Whether the step `Connect()` is completed, `GetConnectionState()` whether it enters `CONNECTED`.
2. `OnRobotStateData()` Whether or not to receive. After receiving `OnFaultData()` check the failure code, level and message, the empty list indicates that the currently reported failure has been cleared.
3. IMU Whether light power, motion data, speed and joints can be opened, received and closed in sequence.
4. The corresponding configuration answers whether or not to return to the configuration actually used by the device.

It is appropriate to judge whether a network can reach but SDK is actually connected.

## control.cpp: Integrated Control

`control.cpp` Focus on robotic control, including:

- On the other hand, there is a lot of people who are standing, walking, crumbling, locking and other posturing. `z` Corresponding `StandUp()`,  `Z` Corresponding `Walk()`; 
- `Move()`, `MoveVelocity()`, `Turn()`, `ControlHead()` and `HighLowStance()`;
- Speed slot switching;
- (b) Back-to-back and auto-supplied models;
- (a) Cut-off switches;
- (b) The software emergency stop and state display;
- `PosMove()` Position target;
- External power source settings and queries;
- Request for control, release and remote/empty switching;
- Status LED Automatic/manual mode and lighting;
- System version, equipment type and serial number read.

This example is used to see the combination of multiple control interfaces, and keyboard input triggers the corresponding command directly.

## async.cpp: Off-Step Call

The command interface in the step mode returns immediately, the subsequent call results are returned by `WriteHandler`, and the robot answers by `IControlCallback`. Example includes a step-by-step echo, data echo and command queue.

Parameter rules and call structure for synchronisation and staggering are found in [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md#synchronous-and-asynchronous-calls).

The stethoscope needs to be managed by itself:

- (a) The main-line exit condition;
- (a) Reverting the object life cycle;
- Stopping and recycling of work lines;
- (a) Stop actions after the connection has been disconnected;
- Synchronizes the multi-line sharing status.

## sync.cpp: Synchronize Call

Synchronization mode is suitable for the start-up phase, connection testing, and processes that require immediate judgement of the call result. Run the example to focus on the timeout and the return error; do not call for the sync interface in the back of the data or control.

## Example

### manual_reconnect.cpp

The manual reconnection example uses a stand-alone thread to process the reconnection and avoid blocking the main cycle:

1. Main cycle sends zero paces when connections are normal `Move()` Command.
2. Wakes up the reconnecting process when writing a callback back error.
3. Reconnect threads to synchronise calls `Disconnect(true)` and then call `Connect(..., true)`.
4. Disconnect again when connection failed, wait 2 s Try again afterwards until the connection is successfully made or the application exits.

The example does not read equipment information and does not reapply for control. If business proceedings rely on control, they should be treated separately on the basis of the control event and response after a reconnection.

### auto_reconnect.cpp

Automatically reconnect through `ConnectionConfig` configuration, fields and default values are in [M1 SDK Interface reference](./06-01-connection-and-device-info.md#sdkclient).

The automatic reconnection is responsible only for restoring the connection and does not mean that the automatic re-acquisition of control should be applied.

## take_control.cpp: Control

`take_control.cpp` Address changes of control through `OnControlLost()`, `OnControlAvailable()` and `OnTakeControlAck()`.

Operating this example allows you to observe the loss of control, reappliability, response and voluntary release process. See [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md#control-ownership-mechanism) for the sequence of events.

## camera_bitrate.cpp: Camera Code Rate

This example sets the camera number rate before and after, and reads the actual effective value of the device through `OnUpdateCameraBitrateAck()`. See [M1 SDK Interface reference](./06-05-peripherals-and-camera.md#camera-bitrate) for parameters.

## recharge.cpp: Recharge and Undocking

This example starts and stops recharge and undocking tasks and uses task status callbacks to track results. See [Control Flow and Task Handling](./05-sdk-control-flow-and-task-handling.md#docking-and-undocking-tasks).

## led.cpp: LED Control

The example demonstrates the LED automatic/ manual mode, setting the light and querying the current mode. The interface and parameters are [M1 SDK Interface reference](./06-05-peripherals-and-camera.md#led-effects).

## Dock Pairing Example {#dock-pairing-example}

Operates under `example/build/`, replacing a robotic address with an on-site network.

```bash
./dock_pairing 192.168.234.1 8082
```

Press `1` to start the scan, and when the scan results arrive, press `3` to view, press `4` to select the device, and then press `2` to stop the scan. After confirming that the scan has been stopped, press `5` to connect and wait for the final result to press `6` for a query. Press `7` and press `q` to exit when disconnected. See [Charge pillar pairing process](./05-sdk-control-flow-and-task-handling.md#dock-pairing).

## Common Problems

### Connect Returned Failed

Check in the following order:

1. Checks the development of mainframe IP and webcard status: `ip addr`.
2. Checking robotic address: WiFi is usually `192.168.234.1` and cable is usually `192.168.168.168`.
3. CheckUDP port for use `8082`.
4. Check if the robot's ready to go.
5. Checks whether the architecture library used by SDK is correct.
6. View `std::error_code::message()` and the `ErrorHandler` output when constructed.

SDK v0.2.3 fixed an issue where an initial connection failure could leave the client in `CONNECTING` or `HANDSHAKING`. After receiving the failure result and addressing its cause, retry on the same `SDKClient` instance. The release also fixed a UDP handshake issue where receiving could stop after a transient socket error or a packet unrelated to the handshake.

### Ping. SDK Not Connected

`ping` I can only prove it. IP It doesn't mean it's possible. UDP Ports, protocol handshakes and equipment are in good condition.

- `Connect()` Return value;
- `GetConnectionState()`; 
- `ProtocolVersion()`; 
- (b) Ports for the actual use of robots;
- Current SDK matches the robotic system version.

### Connection Successfully but Control Command Is Not Valid

Successful connection does not amount to control.

1. Whether to call `TakeControl()`.
2. Whether or not to receive `OnTakeControlAck()`.
3. `ack.error_code` Whether it is 0.
4. `RobotState::control_source` Whether it is `CTRL_SOURCE_SDK`.
5. Whether it is in a state of emergency, protection, mission or other prohibited movement.

### Sensor Data Not Received

`RobotState` and failure information will be reported on its own initiative, IMU, motion data, speed and joint status will require the corresponding configuration interface first.

- Registered `IDataCallback`;
- Whether corresponding data are reported;
- Whether the subject of the recall is still alive;
- Whether the revert function exits due to abnormalities;
- Whether or not a blocking operation was performed in the echo.

### `librobot_sdk.so` Not Found at Startup {#librobot-sdk-so-not-found-at-startup}

Check the library structure and dynamic library search path:

```bash
uname -m
find ../lib -name 'librobot_sdk.so*'
export LD_LIBRARY_PATH=/path/to/genisom_robot_sdk-main/lib/x86_64:$LD_LIBRARY_PATH
```

ARM64 Equipment should be used `lib/aarch64`. It can also be set in CMake `BUILD_RPATH`.

### The Action Was Sent Successfully but the Action Was Not Completed

Function returns value or `WriteHandler` to judge the result of this call, and the control response is used to determine whether the robot has confirmed the command; neither of them represents an action or mission that has been completed. Attitude completion view `RobotState::motion_status`, task status view `OnTaskStateData()` and `TaskStateInfo`.

### Recharge or Undocking Task Fails

Yes. `OnTaskStateData()` Recording `task_type`,  `task_status`,  `phase` and `error_code` Copy that. `FAILURE`, check by task type [Docking and undocking error codes](./07-callbacks-data-types-and-status-reference.md#docking-and-undocking-error-codes). On-site screening can be consulted. [Recharge, condition of use and failure check for the marking of off-posts and charging stakes](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_recharge_undock_calibration_conditions_zh.md).

### There'S No Video.

Check camera lenses and protective film, RTSP Port `8554` / `8555`, the network bandwidth and the camera number rate. The camera number ratio is set to `OnUpdateCameraBitrateAck()` Returns the value.

## Application Exit Processing

Suggested order of withdrawal:

1. Stop moving and send zero speed.
2. Stop recharge, undocking, or any other running task.
3. Release control.
4. Call `Disconnect(true)`.
5. Waits for the application line to exit.
6. Destroy callback object and `SDKClient`.

Upon receipt `SIGINT` or `SIGTERM`, do not directly close the process, but should first perform security stoppage and connection clean-up.

## Problem Feedback Template

The following templates can be copied and filled in for submission. Versions and equipment information can be obtained through `Version()`, `ProtocolVersion()`, `SystemVersion()` and `GetDeviceInfo()`.

```text
M1 Type and serial number:
Robotic system version:
SDK Versions and protocol versions:
Development of mainframe systems and architecture:
Connections (WiFi / WiFi, UDP / WebSocket, target IP and port):
Minimum recurrence step or call order:
Expected results:
Actual result and complete error log (in error category, code, message):
Reconciliation status (filled when applicable):
```
