# Genisom M1 SDK Quickstart

[Return Document Overview](../index.md) | [System composition, hardware interfaces and structural design information](./03-system-components-and-hardware-interfaces.md) | [SDK Control of processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md) | [Genisom M1 SDK API Reference](./06-sdk-api-reference.md)

::: tip Before starting
See [M1 System compatibility with SDK version](./sdk-version-compatibility.md), select the corresponding SDK according to the robot's system version.
:::

## Development Environment

The main operating environments are Ubuntu 22.04, GCC 11.4, CMake 3.8+ and Boost 1.74.

## SDK Contents

Find the SDK source code, release notes, and examples in the [Genisom Robot SDK repository](https://github.com/zsibot/genisom_robot_sdk).

The SDK package contains these files and directories.

```text
genisom_robot_sdk-main/
├── include/robot_sdk/     C++ headers
├── lib/x86_64/            Prebuilt x86_64 library
├── lib/aarch64/           Prebuilt ARM64 library
├── example/               C++ examples
├── docs/                  SDK documentation
├── README.md              English overview
└── README_zh.md           Chinese overview
```

The following table lists the main headers and libraries.

| Documentation | Role |
| --- | --- |
| `include/robot_sdk/sdk_client.hpp` | The `SDKClient` class and its public API |
| `include/robot_sdk/sdk_callback.hpp` | Callbacks for data reports and control acknowledgments |
| `include/robot_sdk/sdk_connection.hpp` | Connection state and settings |
| `include/robot_sdk/sdk_error.hpp` | SDK Error code |
| `include/robot_sdk/sdk_type.hpp` | Enumeration, structure and data type |
| `lib/x86_64/librobot_sdk.so*` | x86_64 Linux Dynamic Library and its version files |
| `lib/aarch64/librobot_sdk.so*` | ARM64 Linux Dynamic Library and its versions |
| `example/` | Examples of compiled and run operations |

## Choose a Development Computer

Build the SDK in a Linux environment. Supported setups include the following.

- Ubuntu 22.04 desktops or notebooks;
- Ubuntu 22.04 virtual machine;
- The robot’s onboard ARM64 Linux system, provided the build tools and dependencies are installed.

Build on an Ubuntu 22.04 development computer, then copy the executable and the `.so` files for the matching architecture to the runtime environment. An x86_64 executable cannot run directly on ARM64, and an ARM64 executable cannot run directly on x86_64.

## Connect to the Robot {#connect-to-the-robot}

### Wi-Fi Connection

Connect the development computer to the robot's `M1-xxxxxxx` hotspot using the factory password `12345678`.

The robot’s Wi-Fi AP address is `192.168.234.1`. The default SDK UDP port is `8082`.

```bash
ip addr
ping -c 4 192.168.234.1
```

Use `ping` to verify IP reachability. Check the return value of `Connect()` or call `IsConnected()` to verify the SDK connection.

### Wired Connection

For a wired connection, the motion control host is usually at `192.168.168.168`. The SDK still uses UDP port `8082`. If the local network assigns a different address, use the actual device address.

## Build Official Examples {#build-official-examples}

Example directory for entering SDK:

```bash
cd genisom_robot_sdk-main/example
mkdir -p build
cd build
cmake ..
make -j6
```

After building, run the read-only `quick_start` example to verify the connection, handshake, and receipt of the first robot state message.

```bash
./quick_start 192.168.234.1 8082
```

Runs a cable connection:

```bash
./quick_start 192.168.168.168 8082
```

On success, the example prints `[OK] Connected`, `[OK] First robot state received`, and `[OK] Disconnected cleanly`. If your SDK version does not include `quick_start`, run its `data` example. You can also use `data` to verify sensor and reporting settings. See [Genisom M1 Examples and Troubleshooting](./08-examples-and-troubleshooting.md).

## First Connection Program

```cpp
#include <iostream>
#include "robot_sdk/sdk_client.hpp"

using namespace robot_sdk;

int main() {
    SDKClient client([](const std::error_code& ec) {
        if (ec) {
            std::cerr << "SDK error: " << ec.message() << std::endl;
        }
    });

    auto ec = client.Connect("192.168.234.1", "8082", true);
    if (ec) {
        std::cerr << "Connect failed: " << ec.message() << std::endl;
        return 1;
    }

    std::cout << "SDK version: " << client.Version() << std::endl;
    std::cout << "System version: " << client.SystemVersion() << std::endl;

    client.Disconnect(true);
    return 0;
}
```

`Connect(..., true)` is synchronized to wait for the connection and protocol handshake to be completed. Only when the handshake is successful will `IsConnected()` return `true`.

The distinction between synchronization and the state of call, command response and action completion is found in [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md).

## Custom CMake Project

```cmake
cmake_minimum_required(VERSION 3.8)
project(m1_demo LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Threads REQUIRED)

set(SDK_ROOT "/path/to/genisom_robot_sdk-main" CACHE PATH "Robot SDK root")
set(SDK_LIB_DIR "${SDK_ROOT}/lib/${CMAKE_SYSTEM_PROCESSOR}")

add_library(robot_sdk SHARED IMPORTED)
set_target_properties(robot_sdk PROPERTIES
    IMPORTED_LOCATION "${SDK_LIB_DIR}/librobot_sdk.so"
    INTERFACE_INCLUDE_DIRECTORIES "${SDK_ROOT}/include")

add_executable(m1_demo main.cpp)
target_link_libraries(m1_demo PRIVATE robot_sdk Threads::Threads)
set_target_properties(m1_demo PROPERTIES
    BUILD_RPATH "${SDK_LIB_DIR}")
```

Example: Select `lib/x86_64` or `lib/aarch64` according to the target structure. Configure and compile in the project directory:

```bash
mkdir -p build
cd build
cmake .. -DSDK_ROOT=/path/to/genisom_robot_sdk-main
cmake --build .
```

The SDK dynamic library of the corresponding architecture is provided with the program when deployed. See [Dynamic Library Checking](./08-examples-and-troubleshooting.md#librobot-sdk-so-not-found-at-startup) when the library is not found when running.

## Next

- Read [M1 SDK Control processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md) before starting to write the control program.
- When searching for prototypes and parameters for functions, use [Genisom M1 SDK API Reference](./06-sdk-api-reference.md).
- Use [M1 callbacks, data types, and status reference](./07-callbacks-data-types-and-status-reference.md) for callbacks, data structures, and state enums.
- Use [Genisom M1 Examples and Troubleshooting](./08-examples-and-troubleshooting.md) when aligning specific functions.
