# Heartbeat Interface

[SDK service interfaces](./06-sdk-service-interfaces.md) | [Control command interface](./06-01-control-commands.md)

## Interface Description

The heartbeat interface checks whether the SDK can still communicate with the robot. The SDK maintains the heartbeat on an internal thread. The application does not need to bind a separate port.

The SDK sends UDP heartbeats on port `8081` and receives robot state on port `8080`. Applications check the connection with `IsConnected()`.

## Communication Parameters

| Parameter | Default |
| --- | --- |
| Robot IP | `192.168.234.1` |
| SDK Send port | `8081` |
| SDK receive port | `8080` |
| Heartbeat interval | 50 ms |
| Connection timeout | The connection is invalid if the SDK heartbeat timer exceeds 5 s or no robot data has arrived |
| Transport | UDP |

## How It Works

When you create a `ZsibotExecutor`, the SDK starts the send, receive, and heartbeat threads.

1. The heartbeat thread sends a heartbeat to the robot at the default interval.
2. The receive thread receives robot state and responses.
3. The SDK maintains the connection state using its heartbeat timer and incoming state data.
4. The application queries the current connection state using `IsConnected()`.

Let the SDK send heartbeats. Avoid creating a separate heartbeat thread for the same port.

## Check the Connection State

| Field | Contents |
| --- | --- |
| Function name | `IsConnected` |
| Signature | `bool IsConnected() const` |
| Purpose | Checks that the SDK has received robot data and that the connection is still valid |
| Parameter | None |
| Return value | `true` means the SDK has received robot data and the heartbeat timer has not exceeded 5 s. `false` means the connection has not been established or has timed out. |
| Notes | `true` confirms that the communication link is valid. Verify motion control ownership separately before sending motion commands. |

## Connection Criteria

| Conditions | Description |
| --- | --- |
| Robot data received | The SDK has received at least one message from the robot |
| Heartbeat valid | The SDK heartbeat timer is within 5 s |
| `IsConnected()` returns `true` | Both conditions are met |

Example:

```cpp
ZsibotExecutor robot(Role::ROLE_SDK);

while (!robot.IsConnected()) {
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
}
```

## Handling a Disconnect

If communication drops or `IsConnected()` returns `false`, take these steps.

1. Stop sending motion commands and continuous motion inputs.
2. Record the time of disconnect and current motion state.
3. Wait for reconnection or enter the application's safe state.
4. After reconnecting, verify the model, control mode, fault state, and control ownership again.

## Connection State and Control Ownership

Network reachability, heartbeat status, and motion control ownership describe different aspects of the connection.

| State | Meaning |
| --- | --- |
| `IsConnected() == true` | The SDK is receiving robot data and the communication link is valid |
| `GetFunctionMode()` | The current source of control, such as Remote, SDK, or General SDK |
| `GetControlMode()` | The current motion control mode, such as standing, moving, or locked |
| `CMD_SDK_CONTROL_RIGHT` | Requests SDK motion control |

Verify control ownership and site safety before sending high-risk motion commands. During on-site testing, keep the controller's software emergency stop or damping switch available.

## Implementation Notes

- Leave the UDP ports used by the SDK bound to the SDK.
- Use `ping` to check IP reachability and `IsConnected()` to verify that the SDK has received valid state data.
- After changing Wi-Fi settings or the robot's IP address, handle reconnection if `IsConnected()` temporarily returns `false`.
- Stop sending motion commands if the network drops, the heartbeat times out, fault severity increases, or the program behaves unexpectedly.
