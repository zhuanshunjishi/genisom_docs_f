# L2 SDK 快速开始

[返回文档总览](../index.md) | [硬件接口与系统架构](./03-hardware-interfaces-and-system-architecture.md) | [SDK 接口参考](./07-sdk-api-reference.md)

## 开发环境

| 项目 | 配置 |
| --- | --- |
| 操作系统 | Ubuntu 22.04 |
| 编译器 | GCC 11.4 |
| CMake | 3.8 及以上 |
| Boost | 1.74 |
| C++ 标准 | C++17 |

## SDK 目录

以下目录指包含 `include`、`lib` 和 `example` 的 SDK 根目录：

```text
genisom_robot_sdk-main/
├── include/robot_sdk/
│   ├── sdk_client.hpp
│   ├── sdk_callback.hpp
│   ├── sdk_connection.hpp
│   ├── sdk_error.hpp
│   └── sdk_type.hpp
├── lib/
│   ├── x86_64/
│   └── aarch64/
├── example/
├── docs/
├── README.md
└── README_zh.md
```

| 文件或目录 | 作用 |
| --- | --- |
| `sdk_client.hpp` | `SDKClient` 和公开控制接口 |
| `sdk_callback.hpp` | 数据回调与控制应答回调 |
| `sdk_connection.hpp` | 连接状态和自动重连配置 |
| `sdk_error.hpp` | SDK 专用错误码 |
| `sdk_type.hpp` | 枚举、状态和数据结构 |
| `lib/x86_64` | x86_64 Linux 动态库 |
| `lib/aarch64` | ARM64 Linux 动态库 |
| `example` | 可编译的 C++ 示例 |

## 开发主机选择

SDK 可以在以下 Linux 环境运行：

- x86_64 Ubuntu 22.04 电脑，使用 `lib/x86_64`。
- ARM64 Ubuntu 22.04 主机，使用 `lib/aarch64`。
- 机器人内部 ARM64 Linux 环境，前提是系统允许安装编译工具并运行用户程序。

开发阶段建议使用独立 Ubuntu 主机，便于调试、保存日志和恢复程序。部署到机器人本机前，先在独立主机完成只读状态、急停、控制权和断连测试。

## 安装编译工具

```bash
sudo apt update
sudo apt install -y build-essential cmake libboost-all-dev
```

确认版本和架构：

```bash
gcc --version
cmake --version
uname -m
```

`uname -m` 输出 `x86_64` 时使用 x86_64 库，输出 `aarch64` 时使用 ARM64 库。

## 连接机器人

可以通过机器人 Wi-Fi 或扩展仓千兆以太网连接。先让开发主机和机器人处于同一网络，再确认机器人当前 IP。

| 项目 | 配置 |
| --- | --- |
| SDK 客户端 | `robot_sdk::SDKClient` |
| 默认传输协议 | UDP |
| UDP 端口 | `8082` |
| WebSocket 端口 | `8081` |

```bash
ip addr
ping <机器人IP>
```

SDK 默认使用 UDP `8082`。WebSocket 模式使用 `8081`，只有显式构造 `TransportProtocol::WebSocket` 时才使用该端口。App 可以连接或查看视频，不代表 SDK 端口已经可用；SDK 连接还需要对应端口可达并完成握手。

## 编译示例

```bash
cd genisom_robot_sdk-main/example
mkdir -p build
cd build
cmake ..
cmake --build . -j6
```

生成的程序包括：

```text
data
control
async
sync
manual_reconnect
auto_reconnect
take_control
camera_bitrate
recharge
led
```

## 配置运行库

如果启动程序时报错 `librobot_sdk.so` 找不到，设置动态库路径：

```bash
# x86_64
export LD_LIBRARY_PATH=/path/to/genisom_robot_sdk-main/lib/x86_64:$LD_LIBRARY_PATH

# ARM64
export LD_LIBRARY_PATH=/path/to/genisom_robot_sdk-main/lib/aarch64:$LD_LIBRARY_PATH
```

可以将对应命令写入应用启动脚本。不要把两个架构的库目录同时加入搜索路径。

## 第一次运行

::: tip 首次运行
先运行只读示例，不要直接执行运动控制。
:::

```bash
cd genisom_robot_sdk-main/example/build
./data <机器人IP> 8082
```

检查以下结果：

1. 连接状态进入 `CONNECTED`。
2. `GetDeviceInfo()` 返回正确的 L2 系列设备类型和序列号。
3. `SystemVersion()` 返回非空的机器人系统版本信息。
4. `OnRobotStateData()` 持续收到状态。
5. `OnFaultData()` 没有致命故障。

## 最小连接程序

```cpp
#include <iostream>
#include "robot_sdk/sdk_client.hpp"

int main(int argc, char** argv) {
    if (argc != 2) {
        std::cerr << "usage: connect_demo <robot-ip>\n";
        return 1;
    }

    robot_sdk::SDKClient client;
    const auto ec = client.Connect(argv[1], "8082", true);
    if (ec) {
        std::cerr << "connect failed: " << ec.message() << '\n';
        return 1;
    }

    const auto info = client.GetDeviceInfo();
    std::cout << "device: "
              << robot_sdk::DeviceTypeName(info.device_type) << '\n';
    std::cout << "sn: " << info.sn << '\n';
    std::cout << "sdk: " << client.Version() << '\n';
    std::cout << "system: " << client.SystemVersion() << '\n';

    client.Disconnect(true);
    return 0;
}
```

## 自建 CMake 工程

目录：

```text
l2_demo/
├── CMakeLists.txt
└── main.cpp
```

`CMakeLists.txt`：

```cmake
cmake_minimum_required(VERSION 3.8)
project(l2_demo LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(ROBOT_SDK_ROOT "/path/to/genisom_robot_sdk-main")
set(ROBOT_SDK_ARCH "x86_64") # ARM64 主机改为 aarch64

add_executable(l2_demo main.cpp)
target_include_directories(l2_demo PRIVATE
    "${ROBOT_SDK_ROOT}/include")
target_link_directories(l2_demo PRIVATE
    "${ROBOT_SDK_ROOT}/lib/${ROBOT_SDK_ARCH}")
target_link_libraries(l2_demo PRIVATE robot_sdk pthread)

set_target_properties(l2_demo PROPERTIES
    BUILD_RPATH "${ROBOT_SDK_ROOT}/lib/${ROBOT_SDK_ARCH}")
```

编译：

```bash
mkdir -p build
cd build
cmake ..
cmake --build . -j6
./l2_demo <机器人IP>
```

## 同步与异步调用

::: warning 回调线程
不要在 SDK 回调线程中调用同步接口。回调中只复制数据或更新轻量状态，文件写入、数据库操作和复杂计算放到应用工作线程。
:::

命令接口通常包含 `timeout_ms` 和 `WriteHandler`：

- `timeout_ms == 0`：异步发送，结果通过 `WriteHandler` 返回。
- `timeout_ms > 0`：同步等待，结果通过函数返回的 `std::error_code` 返回。

```cpp
// 异步
client.StandUp(0, [](const std::error_code& ec, std::size_t) {
    if (ec) {
        std::cerr << ec.message() << '\n';
    }
});

// 同步，最多等待 2 秒
auto ec = client.StandUp(2000);
```

## 推荐控制顺序

1. 创建 `SDKClient`。
2. 注册 `IDataCallback` 和 `IControlCallback`。
3. 调用 `Connect()` 并确认握手成功。
4. 读取设备类型、系统版本、急停、故障和电量。
5. 申请控制权，并通过 `OnTakeControlAck()` 确认成功。
6. 先以低速测试站立和零速度命令。
7. 周期发送运动命令，停止时明确发送零速度。
8. 退出前释放控制权并断开连接。

## 下一步

- 全部函数和能力范围：[L2 SDK 接口参考](./07-sdk-api-reference.md)
- 数据和回调：[L2 回调、数据类型与状态](./08-callbacks-data-types-and-status-reference.md)
- 控制权和任务：[L2 控制权、任务与外设控制](./09-control-ownership-tasks-and-peripherals.md)
- 示例与排障：[L2 示例程序与故障排查](./10-examples-and-troubleshooting.md)
