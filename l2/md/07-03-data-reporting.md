# L2 数据上报

[SDK 接口参考](./07-sdk-api-reference.md) | [回调、数据类型与状态](./08-callbacks-data-types-and-status-reference.md)

## 回调注册

```cpp
void SetControlCallback(std::shared_ptr<IControlCallback> callback);
void SetDataCallback(std::shared_ptr<IDataCallback> callback);
```

建议在 `Connect()` 前注册回调。SDK 持有已注册回调对象的 `std::shared_ptr`。详细接口见 [L2 回调、数据类型与状态](./08-callbacks-data-types-and-status-reference.md)。

调用 `SetControlCallback(nullptr)` 取消控制应答回调，调用 `SetDataCallback(nullptr)` 取消数据回调。取消注册后，已经开始执行的回调会继续执行完毕。

## 数据上报配置

| 接口 | 参数 | 数据回调 |
| --- | --- | --- |
| `SetImuConfig(freq)` | `0` 至 `100` Hz，`0` 关闭 | `OnImuData()` |
| `SetLuxConfig(on)` | 开关，开启后 1 Hz | `OnLuxData()` |
| `SetMcConfig(on)` | 开关，开启后 50 Hz | `OnMcData()` |
| `SetSpeedReportConfig(on, frequency)` | `1` 至 `50` Hz | `OnSpeedData()` |
| `SetJointStateConfig(on)` | 开关 | `OnJointStateData()` |

配置应答由 `IControlCallback` 中相应的 `On...Config()` 回调返回。
