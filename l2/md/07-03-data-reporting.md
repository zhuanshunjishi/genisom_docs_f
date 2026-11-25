# L2 数据上报

[SDK 接口参考](./07-sdk-api-reference.md) | [回调、数据类型与状态](./08-callbacks-data-types-and-status-reference.md)

## 回调注册

```cpp
void SetControlCallback(std::shared_ptr<IControlCallback> control_callback);
void SetDataCallback(std::shared_ptr<IDataCallback> data_callback);
```

| 函数 | 参数与用途 |
| --- | --- |
| `SetControlCallback()` | 通过 `control_callback` 注册 `IControlCallback` 实现，接收命令应答和设备返回值。 |
| `SetDataCallback()` | 通过 `data_callback` 注册 `IDataCallback` 实现，接收传感器样本、状态、故障和事件。 |

建议在 `Connect()` 前注册，以便接收连接初期的上报。传入 `nullptr` 可取消对应注册。详见 [回调、数据类型与状态](./08-callbacks-data-types-and-status-reference.md)。

## 数据上报配置

| 函数 | 用途 | 参数 | 配置应答 | 数据回调 |
| --- | --- | --- | --- | --- |
| `SetImuConfig(freq)` | 配置加速度、角速度和姿态上报 | `freq` 为上报频率，支持 `0` 至 `100` Hz。`0` 关闭。 | `OnImuConfig()` | `OnImuData()` |
| `SetLuxConfig(on)` | 配置环境照度上报 | `on` 为 `true` 时以 1 Hz 上报。 | `OnLuxConfig()` | `OnLuxData()` |
| `SetMcConfig(on)` | 配置运控数据上报，包括位姿和速度 | `on` 为 `true` 时以 50 Hz 上报。 | `OnMcConfig()` | `OnMcData()` |
| `SetSpeedReportConfig(on, frequency)` | 配置机身速度上报 | `on` 为 `true` 时开启，`frequency` 为上报频率，支持 `1` 至 `50` Hz。 | `OnSpeedReportConfig()` | `OnSpeedData()` |
| `SetJointStateConfig(on)` | 配置关节名称、位置、速度和力矩上报 | `on` 为 `true` 时开启。 | `OnJointStateConfig()` | `OnJointStateData()` |

`on` 为 `false` 时关闭对应上报。配置应答用于确认设置，样本通过数据回调读取。各函数共有的 `timeout_ms` 和 `handler` 见 [通用参数和返回值](./07-sdk-api-reference.md#通用参数和返回值)。
