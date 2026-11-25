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

`SDKClient()` 创建客户端并设置传输协议与重连策略。调用 `Connect()` 才开始连接。`~SDKClient()` 断开连接、停止内部 I/O 线程并释放客户端资源。

| 构造参数 | 用途 |
| --- | --- |
| `error_callback` | 接收 SDK 通信错误，参数为 `std::error_code`。默认回调忽略这些错误。 |
| `connection_config` | 设置连接超时与自动重连策略，字段见下表。 |
| `type` | 选择 `TransportProtocol::Udp`（默认）或 `TransportProtocol::WebSocket`。`Connect()` 的端口须与此选择匹配。 |

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
| `block` | `true` 同步等待握手成功或失败。`false` 提交连接请求后返回。 |
| `handler` | 异步模式下接收最终连接结果。错误码为空表示握手成功。 |

同步模式读取返回值判断是否连通。异步模式先用返回值检查请求是否提交，再用 `handler` 判断最终结果。

### Disconnect

```cpp
std::error_code Disconnect(
    bool block = false,
    DisConnectHandler handler = [](const std::error_code&) {});
```

主动断开连接并释放内部通信资源。主动断开不会触发自动重连。

| 参数 | 用途 |
| --- | --- |
| `block` | `true` 同步等待断开并返回结果。`false` 返回断开请求的提交结果。 |
| `handler` | `block` 为 `false` 时接收最终断开结果。 |

### 连接状态

```cpp
bool IsConnected() const;
ConnectionState GetConnectionState() const;
```

`IsConnected()` 在握手成功且状态为 `CONNECTED` 时返回 `true`。`GetConnectionState()` 返回当前连接阶段，便于定位连接进度。

| `ConnectionState` | 含义 |
| --- | --- |
| `DISCONNECTING` | 正在断开连接。 |
| `DISCONNECTED` | 当前未连接。 |
| `CONNECTING` | 正在建立传输通道。 |
| `HANDSHAKING` | 传输通道已就绪，正在进行协议握手。 |
| `CONNECTED` | 握手成功，可以通信。 |
| `RECONNECTING` | SDK 正在尝试恢复连接。 |

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

`DeviceTypeName()` 将 `DeviceType` 枚举转换成便于显示和记录的名称。`device_type` 和 `sn` 的含义见 [DeviceInfo](./08-callbacks-data-types-and-status-reference.md#deviceinfo)。
