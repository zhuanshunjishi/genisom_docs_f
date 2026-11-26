# Genisom L2 Examples and Troubleshooting

[Documentation Overview](../index.md) | [SDK Quickstart](./06-sdk-quickstart.md) | [SDK API Reference](./07-sdk-api-reference.md) | [Genisom L2 SDK Control Workflow](./09-control-ownership-tasks-and-peripherals.md)

## Example Programs

The SDK's `example/` directory contains the following programs.

| File | Purpose |
| --- | --- |
| `data.cpp` | Connection, device information, state, sensor data, and fault callbacks |
| `control.cpp` | Posture, motion, lights, and data configuration |
| `async.cpp` | Asynchronous connections, sends, and callbacks |
| `sync.cpp` | Synchronous connections and commands |
| `manual_reconnect.cpp` | Explicit disconnection and manual reconnection |
| `auto_reconnect.cpp` | Automatic reconnection and connection state handling |
| `take_control.cpp` | Requesting, losing, and releasing control ownership |
| `camera_bitrate.cpp` | Camera bitrate settings |
| `recharge.cpp` | Recharge and undock tasks |
| `led.cpp` | Automatic and manual LED modes and effects |
| [`dock_pairing.cpp`](#charging-dock-pairing-example) | Scan for, select, connect to, query, and disconnect from a Bluetooth charging dock |

## Building the Examples

```bash
cd genisom_robot_sdk-main/example
mkdir -p build
cd build
cmake ..
cmake --build . -j6
```

The typical command format is shown below. Replace `<program-name>` with the program name and `<robot-ip>` with the robot's IP address.

```bash
./<program-name> <robot-ip> 8082
```

## Recommended Test Sequence

1. `data` for a read-only check of the connection, versions, state, and faults.
2. `sync` for synchronous commands and timeout handling.
3. `async` for asynchronous callbacks and object lifetimes.
4. `take_control` for requesting, losing, and releasing control.
5. `control` to test supported posture and motion APIs one at a time at low speed.
6. `camera_bitrate` to verify the camera configuration acknowledgment.
7. `led` to verify automatic and manual lighting effects.
8. `recharge` once the charging dock, map, and operating area are ready.

## Running the Examples

### data.cpp

Start with this example during initial integration.

```bash
./data <robot-ip> 8082
```

Check the following.

- Whether `Connect()` succeeds.
- Whether the connection reaches `CONNECTED`.
- Whether `GetDeviceInfo()` returns the correct device type and serial number.
- Whether `Version()` and `SystemVersion()` return valid version information.
- Whether `OnRobotStateData()` continues to fire.
- Whether `OnFaultData()` reports any faults.

### control.cpp

The `control.cpp` example covers a range of general-purpose SDK APIs. When running the example, test only the APIs the [support matrix](./07-sdk-api-reference.md#api-support-by-model) lists for your model.

The operations below are unsupported on the applicable models. If your SDK provides a method for one of these operations, calling it on an unsupported model returns `Errc::UnsupportedDeviceOperation`.

- `Climb()`, `Slim()`, `DSB()`, `SkWalk()`, `Sand()`, and `ReverseHeadTail()`.
- `BackLight()`.
- `Gait()` on point-foot models.

On the first run, disable continuous motion and jumping operations. Test only the software emergency stop, stand-up, lie-down, front fill light, and low-speed motion.

### async.cpp

Use asynchronous mode for long-running applications.

```cpp
client.StandUp(0, [](const std::error_code& ec, std::size_t) {
    if (ec) {
        std::cerr << "send failed: " << ec.message() << '\n';
    }
});
```

The application must manage callback object lifetimes, thread shutdown, synchronization of shared state, and how to stop after disconnection.

### sync.cpp

Synchronous mode suits startup and single-step tests.

```cpp
auto ec = client.StandUp(2000);
if (ec) {
    std::cerr << ec.message() << '\n';
}
```

Do not call synchronous APIs from an SDK callback. Doing so can block the internal communication thread.

### Reconnection Examples

#### manual_reconnect.cpp

Disconnect, wait for the state to become `DISCONNECTED`, then reconnect. Read device information again, check the emergency stop and faults, and request control again.

#### auto_reconnect.cpp

```cpp
ConnectionConfig config;
config.connect_timeout_ms = 5000;
config.auto_reconnect = true;
config.reconnect_interval_ms = 1000;
```

Automatic reconnection restores the connection. After reconnecting, verify control ownership, task state, emergency stop state, faults, and the last target velocity. Do not automatically resume motion from before the disconnection.

### take_control.cpp

Handle the following callbacks.

- `OnControlLost()` — Stop sending regular control commands immediately.
- `OnControlAvailable()` — Notify a worker thread that it can request control.
- `OnTakeControlAck()` — Treat the request as successful only if `error_code == 0`.
- `OnReleaseControlAck()` — Confirm the release result.

### camera_bitrate.cpp

`CameraBitrateCmd` uses `camera_front` or `camera_back`. The bitrate range is 50000 to 100000000 bit/s. `OnUpdateCameraBitrateAck()` reports the value the device actually applies.

### recharge.cpp

Before running the example, confirm that the charging dock, Bluetooth pairing, the map's charging point, and the docking orientation are configured. Check the task at three stages.

1. Check the return value or send callback.
2. Check the command acknowledgment, such as `OnStartRechargeTask()`.
3. Check `OnTaskStateData()`, the machine state, and the charging dock connection state.

Do not send regular motion commands while the robot is recharging or undocking.

### led.cpp

To test a manual effect, call `SetLedAutoMode(false)` and wait for `OnSetLedAutoMode()` to confirm manual mode before sending `SetLedCommand()`. After testing, switch back to automatic mode and use the same callback to confirm that the robot manages the status LEDs again. See [LED Control](./07-05-peripherals-and-camera.md#led-control) for the APIs and call sequence.

### Charging Dock Pairing Example

Confirm that the robot system supports [Bluetooth pairing through the SDK](./07-04-dock-and-tasks.md#pairing-with-the-sdk). Build and run `dock_pairing` from the SDK root directory. Replace the example IP and port with the robot's UDP address and port.

```bash
cd example
mkdir -p build
cd build
cmake ..
cmake --build . --target dock_pairing
./dock_pairing 192.168.234.1 8082
```

| Key | Action |
| --- | --- |
| `1` | Start scanning |
| `3` | Show the latest scan results |
| `4` | Select a charging dock by number |
| `2` | Stop scanning |
| `5` | Connect to the selected charging dock |
| `6` | Query the charging dock state |
| `7` | Disconnect from the charging dock |

To pair and query the dock, press `1 → 3 → 4 → 2 → 5 → 6` in order. After pressing `5`, wait for a successful final result before pressing `6`. If you know the dock's Bluetooth MAC address, pass it as the third argument to select the dock directly. Press `h` for help or `q` to quit. See the [official example source](https://github.com/zsibot/genisom_robot_sdk/blob/main/example/dock_pairing.cpp).

## Common Issues

### Connect Fails

Check the following in order.

1. Confirm the robot has finished powering on.
2. Confirm the development host and robot are on the same network.
3. Check whether `ping <robot-ip>` succeeds.
4. Verify that the UDP port is `8082`.
5. Verify that the SDK and robot system can complete the handshake and return version information.
6. Review `ErrorHandler` output and the returned `std::error_code`.
7. Check whether the firewall is blocking UDP traffic.

### Ping Succeeds but the Handshake Fails

A successful `ping` confirms IP reachability. Check the following.

- Verify that the robot IP is the control service address.
- Check whether `GetConnectionState()` stays at `CONNECTING` or `HANDSHAKING`.
- Check whether `ProtocolVersion()` matches the robot protocol.
- Verify that a UDP client is not using the WebSocket port.
- Check whether the robot is updating, shutting down, or running a self-test.

### The Connection Succeeds but Control Has No Effect

- Check `RobotState::control_source`.
- Call `TakeControl()` and wait for `OnTakeControlAck()`.
- Confirm that `ack.error_code == 0`.
- Check the software and physical emergency stops.
- Check whether `machine_status` indicates navigation, recharging, updating, or a safety state.
- Verify that the current device type supports the API.

### The API Returns UnsupportedDeviceOperation

The SDK checks whether the device supports the operation. Stop retrying the call and hide the feature based on `GetDeviceInfo().device_type`. Do not change enum values, force a type cast, or bypass the SDK to send the command.

### No Sensor Data Arrives

- Register `IDataCallback` before calling `Connect()`.
- Keep the callback's `shared_ptr` alive.
- Call the corresponding `Set...Config()` method to enable reporting.
- Check the configuration acknowledgment callback.
- Avoid blocking or throwing exceptions from a callback.
- Check that the connection is still `CONNECTED`.

The robot reports `RobotState` and fault data automatically. Configure reporting to receive high-frequency IMU, motion, velocity, and joint state data.

### The Program Cannot Find librobot_sdk.so

```bash
uname -m
find ../lib -name 'librobot_sdk.so*'
ldd ./data
```

Set the search path for the correct architecture.

```bash
export LD_LIBRARY_PATH=/path/to/genisom_robot_sdk-main/lib/x86_64:$LD_LIBRARY_PATH
```

On ARM64, use `lib/aarch64`. An `Exec format error` or failure to load usually indicates an architecture mismatch in the program or shared library.

### The Motion Command Sends Successfully but the State Does Not Change

A successful send only indicates that the command passed the SDK checks and entered the communication flow. Check the following.

- Whether the corresponding `IControlCallback` acknowledgment arrived.
- Whether `motion_status` reached the target state.
- Whether the client has control ownership.
- Whether an emergency stop, a fault, or a task state blocks the action.
- Whether the parameters are within the valid range.

### The Recharge Task Does Not Run

- Check the charging dock's power and [Bluetooth pairing](./07-04-dock-and-tasks.md#charging-dock-pairing).
- Check the charging point and orientation on the map.
- Check `charging_pile_connected`, `machine_status`, and `TaskStateInfo`.
- Clear the docking area and ensure the LiDAR and cameras are unobstructed.
- Record `phase` and `error_code`.

## Application Shutdown

On receipt of `SIGINT` or `SIGTERM`, shut down in the following order.

1. Stop the motion loop and send `Move(0, 0, 0)`.
2. Stop any running recharge or undock tasks.
3. Restore automatic LED mode.
4. Call `ReleaseControl()`.
5. Call `Disconnect(true)`.
6. Stop the application worker threads.
7. Destroy the callback objects and `SDKClient`.
