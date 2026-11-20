# Genisom M1 System and SDK Version Compatibility

[Return Document Overview](../index.md) | [M1 SDK Quick start](./04-sdk-quickstart.md)

Check the Genisom M1 system version and select the recommended SDK from the table below. See the [official compatibility table (Chinese)](https://github.com/zsibot/genisom_robot_sdk/blob/main/README_zh.md#sdk-与机器人系统版本兼容性) for details.

| Genisom M1 System Version | Recommended SDK |
| --- | --- |
| `v0.0.5` to `v0.1.0-B` | `v0.0.3` |
| `v0.1.0-C` to `v0.2.4` | `v0.1.1` |
| `v0.3.0` | `v0.2.0` |
| `v0.3.1` to `v0.3.3` | `v0.2.2` |
| `v0.3.4` | `v0.2.3` |

With Genisom M1 system `v0.3.0` and SDK `v0.2.1`, basic control and status reading work, but the `UpdateCameraBitrate()` protocol definition is incompatible. To use the camera bitrate API, use SDK `v0.2.0` as shown above, or upgrade the robot system to `v0.3.1` and select the corresponding compatible SDK.
