# Genisom M1 Examples and Troubleshooting

[Return Document Overview](../index.md) | [M1 SDK Quick start](./04-sdk-quickstart.md) | [Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md) | [Genisom M1 SDK API Reference](./06-sdk-api-reference.md)

## Example Program Directory

The SDK’s `example/` directory contains these C++ examples.

| Documentation | Main elements |
| --- | --- |
| `quick_start.cpp` | Read-only check of the connection, version, and first robot state message |
| `data.cpp` | Connect robots and read data |
| `control.cpp` | Integrated control, status readings, fill lights, obstacle stop, and emergency stop |
| `async.cpp` | Asynchronous connection, commands, and callbacks |
| `sync.cpp` | Synchronous connection, commands, and return-value checks |
| `manual_reconnect.cpp` | Manually disconnected and reconnected |
| `auto_reconnect.cpp` | Automatic reconnection and connectivity changes |
| `take_control.cpp` | Control ownership events, requests, and release |
| `camera_bitrate.cpp` | Set the bitrate of the front and rear cameras |
| `recharge.cpp` | Start and stop recharge and undocking tasks |
| `led.cpp` | Automatic and manual LED modes and lighting effects |
| `dock_pairing.cpp` | Scan for, select, connect to, query, and disconnect from charging docks |

## Running the Examples {#run-an-engagement}

The compilation of examples and the first steps in running them are shown in [M1 SDK Quick start](./04-sdk-quickstart.md#build-official-examples).

Most examples use the same parameter format:

```text
<program> <robot-ip> <port>
```

In an interactive example, press `h` to view the keys and `q` to exit. Before exiting, stop the robot and disconnect the SDK.

## Example of First Connection

`quick_start.cpp` connects to the robot, prints version and device information, and waits for the first robot state message before disconnecting and exiting. See [Build Official Examples](./04-sdk-quickstart.md#build-official-examples).

## data.cpp: Read State

Use `data.cpp` to verify the connection and data reports. It registers data and control callbacks, connects asynchronously, and prints the SDK and protocol versions.

Check contents:

1. Does the asynchronous `Connect()` complete and does `GetConnectionState()` return `CONNECTED`?
2. Does `OnRobotStateData()` receive state data? In `OnFaultData()`, check the fault code, severity, and message. An empty list indicates the reported faults have cleared.
3. Can you enable, receive, and disable reports for IMU data, ambient light, motion data, speed, and joint state?
4. Do the configuration acknowledgments report the settings applied by the device?

The example helps verify the SDK connection after confirming network reachability.

## control.cpp: Integrated Control

`control.cpp` Focus on robotic control, including:

- Standing, walking, lying down, locking the joints, and other posture changes. Press `z` for `StandUp()` and `Z` for `Walk()`.
- `Move()`, `MoveVelocity()`, `Turn()`, `ControlHead()` and `HighLowStance()`;
- Switching speed levels
- Front and rear fill lights and automatic fill light mode
- Obstacle stop switch
- Software emergency stop and state display
- `PosMove()` Position target;
- External power source settings and queries;
- Request for control, release and remote/empty switching;
- Status LED Automatic/manual mode and lighting;
- System version, equipment type and serial number read.

This example is used to see the combination of multiple control interfaces, and keyboard input triggers the corresponding command directly.

## async.cpp — Asynchronous Calls {#async-cpp-off-step-call}

In asynchronous mode, the command call returns immediately. `WriteHandler` reports the send result, and `IControlCallback` delivers the robot’s acknowledgment. The example includes an asynchronous connection callback, a data callback, and a command queue.

See [Synchronous and Asynchronous Calls](./05-sdk-control-flow-and-task-handling.md#synchronous-and-asynchronous-calls) for parameters and call patterns.

Asynchronous applications manage the following.

- When the main thread exits
- The lifetime of callback objects
- Stopping and joining worker threads
- Stopping motion after a disconnect
- Synchronizing shared state across threads

## sync.cpp: Synchronize Call

Use synchronous calls during startup, connection tests, or whenever you need the call result before continuing. Watch for timeouts and returned errors in the example. Keep synchronous calls out of data and control callbacks.

## Reconnection Examples {#example}

### manual_reconnect.cpp

The manual reconnection example uses a stand-alone thread to process the reconnection and avoid blocking the main cycle:

1. While connected, the main loop sends zero-velocity `Move()` commands asynchronously.
2. A write callback reporting an error wakes the reconnection thread.
3. The reconnection thread calls `Disconnect(true)` and then `Connect(..., true)` synchronously.
4. If the connection fails, disconnect again, wait 2 s, and retry until the connection succeeds or the application exits.

The example skips device information queries and control requests. If your application needs control ownership, handle the ownership events and acknowledgments separately after reconnecting.

### auto_reconnect.cpp

Automatically reconnect through `ConnectionConfig` configuration, fields and default values are in [Genisom M1 SDK API Reference](./06-01-connection-and-device-info.md#sdkclient).

Automatic reconnection restores the link. After reconnecting, check the control source, robot state, and faults, then follow the control ownership procedure to request control again.

## take_control.cpp: Control

`take_control.cpp` Address changes of control through `OnControlLost()`, `OnControlAvailable()` and `OnTakeControlAck()`.

Run the example to see how the application loses control, determines when it can request control again, checks the acknowledgment, and releases control. See [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md#control-ownership-mechanism) for the sequence of events.

## camera_bitrate.cpp — Camera Bitrate {#camera-bitrate-cpp-camera-code-rate}

This example sets the front and rear camera bitrates and reads the applied values from `OnUpdateCameraBitrateAck()`. See [Genisom M1 SDK API Reference](./06-05-peripherals-and-camera.md#camera-bitrate) for parameters.

## recharge.cpp: Recharge and Undocking

This example starts and stops recharge and undocking tasks and uses task status callbacks to track results. See [Control Flow and Task Handling](./05-sdk-control-flow-and-task-handling.md#docking-and-undocking-tasks).

## led.cpp: LED Control

The example demonstrates the LED automatic/ manual mode, setting the light and querying the current mode. The interface and parameters are [Genisom M1 SDK API Reference](./06-05-peripherals-and-camera.md#led-effects).

## Dock Pairing Example {#dock-pairing-example}

Run the example from `example/build/` and replace the robot address with the address on your local network. The optional third argument specifies the charging dock address.

```bash
./dock_pairing 192.168.234.1 8082
```

Press `1` to start scanning. After the results arrive, press `3` to view them, `4` to select a dock, and `2` to stop scanning. Confirm that scanning has stopped, then press `5` to connect. Wait for the final result before pressing `6` to query the dock’s status. To disconnect, press `7`. Once disconnected, press `q` to exit. See [Dock Pairing](./05-sdk-control-flow-and-task-handling.md#dock-pairing).

## Common Problems

### Connect Returned Failed

Check in the following order:

1. Run `ip addr` to check the development host’s IP address and network adapter status.
2. Check the robot’s address. The Wi-Fi address is usually `192.168.234.1` and the wired address is usually `192.168.168.168`.
3. Check that the UDP port is `8082`.
4. Check that the robot has finished booting.
5. Verify that the SDK library matches the target architecture.
6. View `std::error_code::message()` and the `ErrorHandler` output when constructed.

SDK v0.2.3 fixed an issue where an initial connection failure could leave the client in `CONNECTING` or `HANDSHAKING`. After receiving the failure result and addressing its cause, retry on the same `SDKClient` instance. The release also fixed a UDP handshake issue where receiving could stop after a transient socket error or a packet unrelated to the handshake.

### Ping. SDK Not Connected

A successful `ping` confirms IP reachability. Check the SDK handshake, device state, and the actual UDP port separately.

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
5. Check whether an emergency stop, protection state, active task, or other condition is blocking motion.

### Sensor Data Not Received

The robot reports `RobotState` and faults automatically. Call the corresponding configuration methods to enable IMU, motion, speed, and joint state reports.

- Registered `IDataCallback`;
- Whether corresponding data are reported;
- Whether the callback object is still alive.
- Whether an exception caused the callback to exit.
- Whether a callback performed a blocking operation.

### `librobot_sdk.so` Not Found at Startup {#librobot-sdk-so-not-found-at-startup}

Check the library structure and dynamic library search path:

```bash
uname -m
find ../lib -name 'librobot_sdk.so*'
export LD_LIBRARY_PATH=/path/to/genisom_robot_sdk-main/lib/x86_64:$LD_LIBRARY_PATH
```

On ARM64 devices, use `lib/aarch64`. You can also set the library search path with CMake’s `BUILD_RPATH`.

### The Action Was Sent Successfully but the Action Was Not Completed

Use the return value or `WriteHandler` to check the call result and the control acknowledgment to confirm the robot received the command. To confirm execution, check `RobotState::motion_status` for posture changes and `TaskStateInfo` from `OnTaskStateData()` for task progress and completion.

### Recharge or Undocking Task Fails

Record `task_type`, `task_status`, `phase`, and `error_code` in `OnTaskStateData()`. When the task reports `FAILURE`, look up the code for that task type in [Docking and Undocking Error Codes](./07-callbacks-data-types-and-status-reference.md#docking-and-undocking-error-codes). For on-site troubleshooting, see the [guide to recharging, undocking, and charging dock calibration](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/zh/sdk_recharge_undock_calibration_conditions_zh.md).

### No Video {#there-s-no-video}

Check the camera lenses and any protective film, RTSP ports `8554` and `8555`, network bandwidth, and camera bitrate. `OnUpdateCameraBitrateAck()` reports the applied bitrate.

## Application Exit Processing

Follow this shutdown order.

1. Stop moving and send zero speed.
2. Stop recharge, undocking, or any other running task.
3. Release control.
4. Call `Disconnect(true)`.
5. Wait for the application’s worker threads to exit.
6. Destroy callback object and `SDKClient`.

When the application receives `SIGINT` or `SIGTERM`, safely stop the robot and clean up the connection before ending the process.

## Problem Feedback Template

The following templates can be copied and filled in for submission. Versions and equipment information can be obtained through `Version()`, `ProtocolVersion()`, `SystemVersion()` and `GetDeviceInfo()`.

```text
Genisom M1 model and serial number:
Robot system version:
SDK Versions and protocol versions:
Development host OS and architecture:
Connection (Wi-Fi or wired, UDP or WebSocket, target IP and port):
Minimal steps to reproduce or API call sequence:
Expected results:
Actual result and full error log (error category, code, and message):
Relevant callbacks and state (if applicable):
```
