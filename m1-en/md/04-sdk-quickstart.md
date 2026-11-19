# M1 SDK quickstart

[Return Document Overview](../index.md) | [System composition, hardware interfaces and structural design information](./03-system-components-and-hardware-interfaces.md) | [SDK Control of processes and task mechanisms](./05-sdk-control-flow-and-task-handling.md) | [M1 SDK Interface reference](./06-sdk-api-reference.md)

::: tip Before starting
See [M1 System compatibility with SDK version](./sdk-version-compatibility.md), select the corresponding SDK according to the robot's system version.
:::

## Development environment

The main operating environments are Ubuntu 22.04, GCC 11.4, CMake 3.8+ and Boost 1.74.

## SDK Contents

SDK The source code, publication instructions and example programs can be obtained from GitHub: [zsibot/genisom_robot_sdk](https://github.com/zsibot/genisom_robot_sdk).

SDK The core catalogue of the package is as follows:

```text
genisom_robot_sdk-main/
Ideas - include/robot_sdk/ C++ headers
Ideas-lib/x86_64 / x86_64 Pre-Compilator
├── lib/aarch64 / ARM64 Pre-compilation Library
Ideas - example/ C++ Example
Ideas -docs/ SDK Details
Ideas - README.md English Overview
⁇  README_zh.md Chinese General
```

Correlation of header and library documents:

| Documentation | Role |
| --- | --- |
| `include/robot_sdk/sdk_client.hpp` | `SDKClient` Class and all public calls interfaces |
| `include/robot_sdk/sdk_callback.hpp` | Data reporting and control response switch interface |
| `include/robot_sdk/sdk_connection.hpp` | Connect Status and Connect Configuration |
| `include/robot_sdk/sdk_error.hpp` | SDK Error code |
| `include/robot_sdk/sdk_type.hpp` | Enumeration, structure and data type |
| `lib/x86_64/librobot_sdk.so*` | x86_64 Linux Dynamic Library and its version files |
| `lib/aarch64/librobot_sdk.so*` | ARM64 Linux Dynamic Library and its versions |
| `example/` | Examples of compiled and run operations |

## Choose a development computer

SDK Need Linux environment compilation. Available:

- Ubuntu 22.04 desktops or notebooks;
- Ubuntu 22.04 virtual machine;
- It's inside the robot. ARM64 Linux system, provided that there are compilation tools and development depend on it.

The most convenient way is to use the Ubuntu 22.04 developer to compile the `.so` files of the program and the corresponding structure into the operating environment. The x86_64 program cannot run directly in the ARM64 environment and vice versa.

## Connect to the robot {#connect-to-the-robot}

### Wi-Fi connection

Connect the development computer to the robot's `M1-xxxxxxx` hotspot using the factory password `12345678`.

The robot’s Wi-Fi AP address is `192.168.234.1`. The default SDK UDP port is `8082`.

```bash
ip addr
ping -c 4 192.168.234.1
```

Use `ping` to verify IP reachability. Check the return value of `Connect()` or call `IsConnected()` to verify the SDK connection.

### Wired connection

When connected by cable, the target address is normally `192.168.168.168` for the mainframe, SDK is still in use UDP `8082`. If the site network redistributes the address, the actual address of the device should be used.

## Build official examples {#build-official-examples}

Example directory for entering SDK:

```bash
cd genisom_robot_sdk-main/example
mkdir -p build
cd build
cmake ..
make -j6
```

Run read-only examples `quick_start` after the compilation has been completed, confirming that the connection, handshake and front frame robots are in normal condition:

```bash
./quick_start 192.168.234.1 8082
```

Runs a cable connection:

```bash
./quick_start 192.168.168.168 8082
```

Displays when running properly `[OK] Connected`,  `[OK] First robot state received` and `[OK] Disconnected cleanly`. Old version SDK If not provided `quick_start`, can run the attached version `data`. You need to verify that sensors and profile configurations are also available `data` See. [M1 Example procedures and troubleshooting](./08-examples-and-troubleshooting.md).

## First connection program

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

## Custom CMake project

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
- When searching for prototypes and parameters for functions, use [M1 SDK Interface reference](./06-sdk-api-reference.md).
- Use [M1 callbacks, data types, and status reference](./07-callbacks-data-types-and-status-reference.md) when viewing echoes, structure and status count.
- Use [M1 Example procedures and troubleshooting](./08-examples-and-troubleshooting.md) when aligning specific functions.
