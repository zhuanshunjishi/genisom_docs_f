# L2 连接与设备信息

[SDK 接口参考](./07-sdk-api-reference.md) | [SDK 快速开始](./06-sdk-quickstart.md)

## 构造与连接

### SDKClient

```cpp
SDKClient(
    ErrorHandler error_callback = [](const std::error_code&) {},
    ConnectionConfig connection_config = ConnectionConfig(),
    TransportProtocol type = TransportProtocol::Udp);
```

`ConnectionConfig`：

| 字段 | 默认值 | 说明 |
| --- | ---: | --- |
| `connect_timeout_ms` | 5000 ms | 连接和握手超时，最小 500 ms |
| `auto_reconnect` | `false` | 是否自动重连 |
| `reconnect_interval_ms` | 1000 ms | 自动重连间隔，最小 500 ms |

### Connect

```cpp
std::error_code Connect(
    std::string ip, std::string port, bool block = false,
    ConnectHandler handler = [](const std::error_code&) {});
```

连接传输通道并完成协议握手。

| 参数 | 说明 |
| --- | --- |
| `ip` | 机器人 IP 地址 |
| `port` | UDP 使用 `8082`，WebSocket 使用 `8081` |
| `block` | `true` 时同步等待 |

### Disconnect

```cpp
std::error_code Disconnect(
    bool block = false,
    DisConnectHandler handler = [](const std::error_code&) {});
```

主动断开连接并释放内部通信资源。主动断开不会触发自动重连。

### 连接状态

```cpp
bool IsConnected() const;
ConnectionState GetConnectionState() const;
```

`ConnectionState` 包括 `DISCONNECTING`、`DISCONNECTED`、`CONNECTING`、`HANDSHAKING`、`CONNECTED` 和 `RECONNECTING`。

## 版本和设备信息

| 接口 | 说明 |
| --- | --- |
| `Version()` | SDK 版本，连接前可用 |
| `ProtocolVersion()` | SDK 通信协议版本，连接前可用 |
| `SystemVersion()` | 机器人系统版本，握手成功后有效 |
| `GetDeviceInfo()` | 设备类型和序列号，握手成功后有效 |

```cpp
const auto info = client.GetDeviceInfo();
std::cout << DeviceTypeName(info.device_type) << '\n';
std::cout << info.sn << '\n';
```
