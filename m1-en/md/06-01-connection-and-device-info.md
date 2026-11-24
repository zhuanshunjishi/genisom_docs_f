# Connection and Device Information

[Overview of interfaces](./06-sdk-api-reference.md) | [Common parameters and return values](./06-sdk-api-reference.md#common-parameters-and-return-values)

## Construct & Connect

### SDKClient

```cpp
SDKClient(
    ErrorHandler error_callback = [](const std::error_code&) {},
    ConnectionConfig connection_config = ConnectionConfig(),
    TransportProtocol type = TransportProtocol::Udp);
```

Create an SDK client. The `type` parameter accepts `TransportProtocol::Udp` and `TransportProtocol::WebSocket`. The default is UDP.

`ConnectionConfig` defines the connection and reconnection settings.

| Field | Description |
| --- | --- |
| `connect_timeout_ms` | Connection and handshake timeout, default 5000 ms, minimum 500 ms |
| `auto_reconnect` | Enables automatic reconnection. The default is `false`. |
| `reconnect_interval_ms` | Auto-reconnection interval, default 1000 ms, minimum 500 ms |

### Connect

```cpp
std::error_code Connect(
    std::string ip, std::string port, bool block = false,
    ConnectHandler handler = [](const std::error_code&) {});
```

Establish the transport connection and complete the protocol handshake. The connection is ready once the handshake succeeds.

Starting with SDK v0.2.3, you can retry `Connect()` on the same `SDKClient` instance if the first attempt fails due to a transport error, handshake failure, protocol mismatch, or denial of control. For asynchronous connections, wait for the failure result before retrying from the application thread.

| Parameter | Description |
| --- | --- |
| `ip` | Robot address, e.g. `192.168.234.1` or `192.168.168.168` |
| `port` | UDP typically uses `8082`. WebSocket uses `8081`. |
| `block` | `false` connects asynchronously. `true` blocks until the connection attempt completes. |
| `handler` | Callback for the asynchronous connection result |

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

Disconnect explicitly. In UDP mode, the SDK sends a disconnect notification before releasing the connection resources.

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
| `HANDSHAKING` | 3 | Handshake in progress |
| `CONNECTED` | 4 | Connected |
| `RECONNECTING` | 5 | Reconnecting |

## Version and Device Information

| Functions | Prototype | Description |
| --- | --- | --- |
| `Version` | `const std::string& Version() const` | SDK Version |
| `ProtocolVersion` | `const std::string& ProtocolVersion() const` | Communication protocol version |
| `SystemVersion` | `const std::string& SystemVersion() const` | Robot system version received during the handshake |
| `GetDeviceInfo` | `DeviceInfo GetDeviceInfo() const` | Robot model and serial number cached during the handshake |

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

Before connection succeeds or after disconnection, `device_type` may be `DeviceType::UNKNOWN` and `sn` may be empty.

## Genisom M1 Type Judgement

The SDK obtains `DeviceType` during the handshake. After startup, call `GetDeviceInfo()` and enable features supported by the reported model. See [M1 callbacks, data types, and status reference](./07-callbacks-data-types-and-status-reference.md#deviceinfo-and-devicetype).

When calling an operation the current model does not support, SDK returns `Errc::UnsupportedDeviceOperation`, and the protocol command will not be sent.

Recharging, undocking, peripheral power, and status LEDs depend on the robot hardware and system configuration. See the [official model capability matrix](https://github.com/zsibot/genisom_robot_sdk/blob/main/docs/en/sdk_api_capability_en.md) for API support by model.

The complete combination of interfaces can be found in [Genisom M1 Examples and Troubleshooting](./08-examples-and-troubleshooting.md).
