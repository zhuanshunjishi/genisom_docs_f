# Genisom L2 SDK Quickstart

[Documentation Overview](../index.md) | [Hardware Interfaces and System Architecture](./03-hardware-interfaces-and-system-architecture.md) | [SDK API Reference](./07-sdk-api-reference.md)

::: tip Before You Start
Use the robot's RK3588 version to choose an SDK from the [Genisom L2 System and SDK Version Compatibility](./sdk-version-compatibility.md) page.
:::

## Development Environment

| Item | Configuration |
| --- | --- |
| Operating system | Ubuntu 22.04 |
| Compiler | GCC 11.4 |
| CMake | 3.8 or later |
| Boost | 1.74 |
| C++ standard | C++17 |

## SDK Directory Layout

The SDK root contains `include`, `lib`, and `example`.

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

| File or Directory | Purpose |
| --- | --- |
| `sdk_client.hpp` | `SDKClient` and public control interfaces |
| `sdk_callback.hpp` | Data callbacks and control acknowledgment callbacks |
| `sdk_connection.hpp` | Connection states and automatic reconnection settings |
| `sdk_error.hpp` | SDK-specific error codes |
| `sdk_type.hpp` | Enumerations, states, and data structures |
| `lib/x86_64` | Shared library for x86_64 Linux |
| `lib/aarch64` | Shared library for ARM64 Linux |
| `example` | Buildable C++ examples |

## Choosing a Development Host

The SDK can run in the following Linux environments.

- An x86_64 computer running Ubuntu 22.04 with the library in `lib/x86_64`.
- An ARM64 host running Ubuntu 22.04 with the library in `lib/aarch64`.
- The robot's onboard ARM64 Linux environment, provided the system permits you to install build tools and run user programs.

Use a separate Ubuntu host during development so you can debug, retain logs, and recover your application. Before deploying to the robot, use the separate host to test read-only state access, emergency stop, control ownership, and disconnection.

## Installing Build Tools

```bash
sudo apt update
sudo apt install -y build-essential cmake libboost-all-dev
```

Check the tool versions and host architecture.

```bash
gcc --version
cmake --version
uname -m
```

Use the x86_64 library if `uname -m` returns `x86_64` and the ARM64 library if it returns `aarch64`.

## Connecting to the Robot

Connect over the robot's Wi-Fi or the Gigabit Ethernet port in the expansion compartment. Put the development host and robot on the same network and confirm the robot's current IP address.

| Item | Configuration |
| --- | --- |
| SDK client | `robot_sdk::SDKClient` |
| Default transport | UDP |
| UDP port | `8082` |
| WebSocket port | `8081` |

```bash
ip addr
ping <robot-ip>
```

Replace `<robot-ip>` with the robot's IP address. UDP is the default transport and uses port `8082`. For WebSocket, construct `SDKClient` with `TransportProtocol::WebSocket` and pass port `8081` to `Connect()`. Even if the app connects or displays video, the SDK connection requires the corresponding port on the robot to be reachable and the handshake to complete.

## Building the Examples

```bash
cd genisom_robot_sdk-main/example
mkdir -p build
cd build
cmake ..
cmake --build . -j6
```

The build produces the following executables.

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
dock_pairing
```

See the [Charging Dock Pairing Example](./10-examples-and-troubleshooting.md#charging-dock-pairing-example) for instructions on running `dock_pairing`.

## Configuring the Runtime Library

If the program cannot find `librobot_sdk.so` at startup, set the shared library search path.

```bash
# x86_64
export LD_LIBRARY_PATH=/path/to/genisom_robot_sdk-main/lib/x86_64:$LD_LIBRARY_PATH

# ARM64
export LD_LIBRARY_PATH=/path/to/genisom_robot_sdk-main/lib/aarch64:$LD_LIBRARY_PATH
```

You can add the command for your architecture to the application startup script. Add only the directory for that architecture to the search path.

## First Run

::: tip First Run
Start with the read-only example before running any motion-control code.
:::

```bash
cd genisom_robot_sdk-main/example/build
./data <robot-ip> 8082
```

Verify the following.

1. The connection state reaches `CONNECTED`.
2. `GetDeviceInfo()` returns the correct L2 series device type and serial number.
3. `SystemVersion()` returns a nonempty robot system version.
4. `OnRobotStateData()` continues to receive state data.
5. `OnFaultData()` reports no fatal faults.

## Minimal Connection Program

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

## Creating a CMake Project

Use the following directory layout.

```text
l2_demo/
├── CMakeLists.txt
└── main.cpp
```

Add the following to `CMakeLists.txt`.

```cmake
cmake_minimum_required(VERSION 3.8)
project(l2_demo LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(ROBOT_SDK_ROOT "/path/to/genisom_robot_sdk-main")
set(ROBOT_SDK_ARCH "x86_64") # Use aarch64 on an ARM64 host

add_executable(l2_demo main.cpp)
target_include_directories(l2_demo PRIVATE
    "${ROBOT_SDK_ROOT}/include")
target_link_directories(l2_demo PRIVATE
    "${ROBOT_SDK_ROOT}/lib/${ROBOT_SDK_ARCH}")
target_link_libraries(l2_demo PRIVATE robot_sdk pthread)

set_target_properties(l2_demo PROPERTIES
    BUILD_RPATH "${ROBOT_SDK_ROOT}/lib/${ROBOT_SDK_ARCH}")
```

Build and run the project.

```bash
mkdir -p build
cd build
cmake ..
cmake --build . -j6
./l2_demo <robot-ip>
```

## Synchronous and Asynchronous Calls

::: warning Callback Thread
Do not call synchronous interfaces from an SDK callback thread. Limit callbacks to copying data or updating small amounts of state. Perform file writes, database operations, and complex calculations on application worker threads.
:::

Command interfaces usually include `timeout_ms` and `WriteHandler`.

- `timeout_ms == 0` sends the command asynchronously and delivers the send result through `WriteHandler`.
- `timeout_ms > 0` waits synchronously and returns the result as a `std::error_code`.

```cpp
// Asynchronous
client.StandUp(0, [](const std::error_code& ec, std::size_t) {
    if (ec) {
        std::cerr << ec.message() << '\n';
    }
});

// Synchronous, with a maximum wait of 2 seconds
auto ec = client.StandUp(2000);
```

## Recommended Control Sequence

1. Create an `SDKClient`.
2. Register `IDataCallback` and `IControlCallback`.
3. Call `Connect()` and confirm the handshake succeeds.
4. Read the device type, system version, emergency stop state, faults, and battery level.
5. Request control ownership and confirm success through `OnTakeControlAck()`.
6. Start with low-speed tests of standing up and issuing zero-velocity commands.
7. Send motion commands periodically and explicitly command zero velocity when stopping.
8. Release control ownership and disconnect before exiting.

## Next Steps

- [SDK API Reference](./07-sdk-api-reference.md) for functions and supported capabilities.
- [Callbacks, Data Types, and Status](./08-callbacks-data-types-and-status-reference.md) for data and callbacks.
- [Genisom L2 SDK Control Workflow](./09-control-ownership-tasks-and-peripherals.md) for control ownership, machine states, and shutdown.
- [Genisom L2 Charging Dock and Tasks](./07-04-dock-and-tasks.md) for pairing, recharging, and undocking.
- [Genisom L2 Peripherals and Cameras](./07-05-peripherals-and-camera.md) for peripheral power, LEDs, and cameras.
- [Examples and Troubleshooting](./10-examples-and-troubleshooting.md) for sample programs and diagnostics.
