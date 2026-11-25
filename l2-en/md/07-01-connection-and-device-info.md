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

The `ConnectionConfig` fields are listed below.

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
| `block` | Set to `true` to wait synchronously. |

### Disconnect

```cpp
std::error_code Disconnect(
    bool block = false,
    DisConnectHandler handler = [](const std::error_code&) {});
```

Close the connection and release internal communication resources. Calling `Disconnect()` does not trigger automatic reconnection.

### Connection State

```cpp
bool IsConnected() const;
ConnectionState GetConnectionState() const;
```

`ConnectionState` includes `DISCONNECTING`, `DISCONNECTED`, `CONNECTING`, `HANDSHAKING`, `CONNECTED`, and `RECONNECTING`.

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
