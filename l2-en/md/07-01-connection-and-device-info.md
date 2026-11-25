# Genisom L2 Connection and Device Information

[SDK API Reference](./07-sdk-api-reference.md) | [SDK Quickstart](./06-sdk-quickstart.md)

## Construction and Connection

### SDKClient

```cpp
SDKClient(
    ErrorHandler error_callback = [](const std::error_code&) {},
    ConnectionConfig connection_config = ConnectionConfig(),
    TransportProtocol type = TransportProtocol::Udp);
```

`SDKClient()` creates a client with transport and reconnection settings. Call `Connect()` to begin the connection. `~SDKClient()` closes the connection, stops the internal I/O threads, and frees client resources.

| Constructor Parameter | Purpose |
| --- | --- |
| `error_callback` | Receives SDK communication errors as a `std::error_code`. The default callback ignores them. |
| `connection_config` | Configures the connect timeout and automatic reconnection. See the fields below. |
| `type` | Selects `TransportProtocol::Udp` (default) or `TransportProtocol::WebSocket`. Match the port passed to `Connect()` to the selected transport. |

| Field | Default | Description |
| --- | ---: | --- |
| `connect_timeout_ms` | 5000 ms | Connection and handshake timeout. The minimum is 500 ms. |
| `auto_reconnect` | `false` | Whether to reconnect automatically |
| `reconnect_interval_ms` | 1000 ms | Automatic reconnect interval. The minimum is 500 ms. |

### Connect

```cpp
std::error_code Connect(
    std::string ip, std::string port, bool block = false,
    ConnectHandler handler = [](const std::error_code&) {});
```

Open the transport connection and complete the protocol handshake.

| Parameter | Description |
| --- | --- |
| `ip` | Robot IP address |
| `port` | Use `8082` for UDP and `8081` for WebSocket. |
| `block` | `true` waits for the handshake to succeed or fail. `false` returns after submitting the request. |
| `handler` | Receives the final connection result in asynchronous mode. An empty error code means the handshake succeeded. |

In synchronous mode, use the return value as the final connection result. In asynchronous mode, use the return value to check request submission and `handler` to check the outcome.

### Disconnect

```cpp
std::error_code Disconnect(
    bool block = false,
    DisConnectHandler handler = [](const std::error_code&) {});
```

Close the connection and release internal communication resources. Calling `Disconnect()` does not trigger automatic reconnection.

| Parameter | Purpose |
| --- | --- |
| `block` | `true` waits for disconnection to finish and returns the result. `false` returns the request submission result. |
| `handler` | Receives the final disconnection result when `block` is `false`. |

### Connection State

```cpp
bool IsConnected() const;
ConnectionState GetConnectionState() const;
```

`IsConnected()` returns `true` once the handshake has completed and the state is `CONNECTED`. Use `GetConnectionState()` to inspect the current stage.

| `ConnectionState` | Meaning |
| --- | --- |
| `DISCONNECTING` | The connection is closing. |
| `DISCONNECTED` | No connection is active. |
| `CONNECTING` | The transport connection is being established. |
| `HANDSHAKING` | The transport is ready and protocol negotiation is in progress. |
| `CONNECTED` | The handshake succeeded and communication is ready. |
| `RECONNECTING` | The SDK is attempting to restore the connection. |

## Version and Device Information

| API | Description |
| --- | --- |
| `Version()` | SDK version, available before connecting |
| `ProtocolVersion()` | SDK communication protocol version, available before connecting |
| `SystemVersion()` | Robot system version, valid after a successful handshake |
| `GetDeviceInfo()` | Device type and serial number, valid after a successful handshake |

```cpp
const auto info = client.GetDeviceInfo();
std::cout << DeviceTypeName(info.device_type) << '\n';
std::cout << info.sn << '\n';
```

`DeviceTypeName()` converts a `DeviceType` value to a readable name for display or logging. See [DeviceInfo](./08-callbacks-data-types-and-status-reference.md#deviceinfo) for what `device_type` and `sn` contain.
