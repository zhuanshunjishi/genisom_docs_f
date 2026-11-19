# Connection and device information

[Overview of interfaces](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Construct & Connect

### SDKClient

```cpp
SDKClient(
    ErrorHandler error_callback = [](const std::error_code&) {},
    ConnectionConfig connection_config = ConnectionConfig(),
    TransportProtocol type = TransportProtocol::Udp);
```

Create SDK client. `type` Support `TransportProtocol::Udp` and `TransportProtocol::WebSocket`, used by default UDP.

`ConnectionConfig`...........

| Field | Description |
| --- | --- |
| `connect_timeout_ms` | Connection and handshake timeout, default 5000 ms, minimum 500 ms |
| `auto_reconnect` | Whether or not to open automatic reconnection, default `false` |
| `reconnect_interval_ms` | Auto-reconnection interval, default 1000 ms, minimum 500 ms |

### Connect

```cpp
std::error_code Connect(
    std::string ip, std::string port, bool block = false,
    ConnectHandler handler = [](const std::error_code&) {});
```

Creates a transfer connection and completes the protocol handshake. Only when the handshake is successful is the connection successful.

Starting with SDK v0.2.3, when the first connection fails because the transfer, handshake, protocol mismatch or control is denied, it can be called again on the same `SDKClient` instance `Connect()`. The step connection should wait for the result of this failure to be retried by the application thread.

| Parameter | Description |
| --- | --- |
| `ip` | Robotic address, e.g. `192.168.234.1` or `192.168.168.168` |
| `port` | UDP Usual `8082`,WebSocket `8081` |
| `block` | `false`: walk-through; `true`: blocking pending completion of the connection |
| `handler` | Repeat the result of the staggered connection |

```cpp
SDKClient client;
auto ec = client.Connect("192.168.234.1", "8082", true);
if (ec) {
    std::cerr << "connect failed: " << ec.message() << std::endl;
}
```

### Disconnect

```cpp
std::error_code Disconnect(
    bool block = false,
    DisConnectHandler handler = [](const std::error_code&) {});
```

Active disconnection. UDP Mode SDK sends a disconnection notification before releasing the connection resource.

### IsConnected

```cpp
bool IsConnected() const;
```

returns `true` which indicates that the handshake has been completed and is in `ConnectionState::CONNECTED` status.

### GetConnectionState

```cpp
ConnectionState GetConnectionState() const;
```

Return to current connection status:

| Enumeration values | Integer Value | Meaning |
| --- | ---: | --- |
| `DISCONNECTING` | 0 | Disconnecting |
| `DISCONNECTED` | 1 | Disconnected |
| `CONNECTING` | 2 | Connecting |
| `HANDSHAKING` | 3 | Hold hands. |
| `CONNECTED` | 4 | Connected |
| `RECONNECTING` | 5 | Autoreconnection |

## Version and Device Information

| Functions | Prototype | Description |
| --- | --- | --- |
| `Version` | `const std::string& Version() const` | SDK Version |
| `ProtocolVersion` | `const std::string& ProtocolVersion() const` | Communication protocol version |
| `SystemVersion` | `const std::string& SystemVersion() const` | The robotic version of the handshake. |
| `GetDeviceInfo` | `DeviceInfo GetDeviceInfo() const` | Get the handshake cache type and serial number |

```cpp
struct DeviceInfo {
    DeviceType device_type = DeviceType::UNKNOWN;
    std::string sn;
};
```

Example:

```cpp
auto ec = client.Connect("192.168.234.1", "8082", true);
if (!ec) {
    const auto info = client.GetDeviceInfo();
    std::cout << DeviceTypeName(info.device_type)
              << " / " << info.sn << std::endl;
}
```

Before the connection is successful or after it is disconnected, `device_type` Maybe. `DeviceType::UNKNOWN`,  `sn` Could be empty.

## M1 Type judgement

SDK returns `DeviceType` on handshake. After startup, call `GetDeviceInfo()` and enable the function according to the return model. M1 The relevant numbering values are shown in [M1 callbacks, data types, and status reference](./07-callbacks-data-types-and-status-reference.md#deviceinfo-and-devicetype).

When calling an operation the current model does not support, SDK returns `Errc::UnsupportedDeviceOperation`, and the protocol command will not be sent.

Recharge, de-post, external power supply and state LED depends on the hardware and system configuration of the equipment. The full range of interface support is shown in [Official aircraft capacity matrix](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/en/sdk_api_capability_en.md).

The complete combination of interfaces can be found in [M1 Example procedures and troubleshooting](./08-examples-and-troubleshooting.md).
