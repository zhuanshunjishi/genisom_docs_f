# SDK Development Guide

[Back to Home](../index.md) | [System Architecture](./03-system-architecture.md) | [SDK service interfaces](./06-sdk-service-interfaces.md)

## Quick Setup

Run the following steps in a Linux terminal. The SDK provides static libraries for `x86_64` and `aarch64`. Use the library that matches the runtime CPU architecture.

Before you start, place the robot on a flat surface in an open area and make sure you can stop it at any time. After the robot boots, connect the Linux device running the SDK to the robot’s network.

### 1. Installation of Compilation Tools

```bash
sudo apt update
sudo apt install -y build-essential cmake
```

### 2. Enter SDK Root Directory

Replace the path with the location of the SDK on your Linux device.

```bash
cd /path/to/genisom_L1_sdk-main
pwd
ls CMakeLists.txt include/zsibot_sdk example lib
```

Verify that the output lists `CMakeLists.txt` and the `include`, `example`, and `lib` directories.

### 3. Confirm Processor Structure

```bash
uname -m
```

| Output | Corresponds to the static library |
| --- | --- |
| `x86_64` | `lib/x86_64/libzsibot.a` |
| `aarch64` | `lib/aarch64/libzsibot.a` |

### 4. Compiled SDK Demo

```bash
mkdir -p build
cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
cmake --build .
cd ..
```

Check that two Demos have been generated:

```bash
ls -l build/example/remote_control
ls -l build/example/sdk_control
```

### 5. Check the Network Connection to the Robot

By default, the SDK sends data to the robot at `192.168.234.1` on `8081/UDP` and receives state data on local port `8080/UDP`.

```bash
ip addr
ping -c 4 192.168.234.1
```

If `ping` fails, check that the Linux device is connected to the robot’s network and that its IP address is on a subnet that can reach the robot. Run the demo once `ping` succeeds.

### 6. Run Remote Demo

```bash
./build/example/remote_control
```

The demo uses `ROLE_REMOTE`. After it starts, use the following keys.

| Button | Action |
| --- | --- |
| `i` | Print device, battery, mode, and motion status |
| `2` | Stand |
| `w` / `s` | Forward / Back |
| `a` / `d` | Move Left / Right |
| `q` / `e` | Turn left / right |
| `c` | Stop moving |
| `1` | Lie down |
| `0` | Trigger the software emergency stop and lie down |

For the first test, press `i` to check the robot state. Test standing, a short move in one direction, stopping, and lying down in that order. Press `c` immediately after each direction test. Keep people clear of the robot when testing motion keys.

### 7. Run SDK Demo

Press `Ctrl+C` to close `remote_control` and then execute:

```bash
./build/example/sdk_control
```

`sdk_control` uses `ROLE_SDK`. Request SDK control ownership before testing motion.

1. Press `k` to send the SDK control request.
2. Press `i` to check the reported function mode and confirm that control has switched to the SDK.
3. Press `2` to stand up. Test motion in one direction only, then press `c` to stop.
4. Press `1` to make the robot lie down.
5. Press `r` to request that control return to the remote controller. Verify the reported function mode again.
6. Press `Ctrl+C` to exit the program.

Constructing `ZsibotExecutor(Role::ROLE_SDK)` sets the communication role only. Request control and confirm ownership before sending motion commands.

### 8. Restore Terminal

Both demos disable canonical terminal input mode and character echo. After exit, if the terminal does not show input content, execute:

```bash
stty sane
reset
```

## Development of Routes

| Development objectives | Use interface | Run Location | Suggested starting point |
| --- | --- | --- | --- |
| Status reading, attitude switching, continuous movement and task control | HighLevel `ZsibotExecutor` | Linux x86_64 or aarch64 develop host | Run the official HighLevel example first |

## Build Description

### Build Requirements

The current project is based on the root directory `CMakeLists.txt`:

| Item | Request |
| --- | --- |
| Operating systems | Linux |
| CMake | 3.10 or more |
| C++ Standard | C++20 |
| Thread Library | POSIX Threads, search automatically by CMake |
| Support structure | `x86_64`, `aarch64` |

The root `CMakeLists.txt` sets `CMAKE_CXX_STANDARD 20`. Use the same compiler standard in your project.

The root project selects the prebuilt static library based on `CMAKE_SYSTEM_PROCESSOR`. Set `ZSIBOT_ARCH` at configure time when cross-compiling or specifying a target architecture manually.

```bash
cd build
cmake -DZSIBOT_ARCH=x86_64 ..
cmake --build .
cd ..
```

For ARM64, use `aarch64` as the value.

### Optional Installations

To make the SDK available to other projects from the system directories, run the install target.

```bash
sudo cmake --build build --target install
```

Default installation location:

| Contents | Path |
| --- | --- |
| Header File | `/usr/local/include/zsibot_sdk/` |
| Static Library | `/usr/local/lib/libzsibot.a` |

## Demo Description

See [Official Examples](./09-official-examples.md) for the full procedures, key bindings, and steps for switching control ownership.

| Example: | Construct Identity | Main uses | Control ownership requirement |
| --- | --- | --- | --- |
| `remote_control.cpp` | Default `ROLE_REMOTE` | Keyboard Remote Control and HighLevel Status Read | Remote Control Process |
| `sdk_control.cpp` | `ROLE_SDK` | Algorithms program and automated control process validation | Send SDK control orders and confirm mode feedback |

Both examples use non-blocking terminal input. They send continuous motion input through `SetRemote()` and discrete commands through `SetCmd()`. See [System Architecture](./03-system-architecture.md) for control ownership and [Control Command Interface](./06-01-control-commands.md) for commands and state confirmation. The demos validate the interfaces. Applications must check the connection, confirm control ownership, stop motion on timeout, and handle unexpected exits safely.

## Create Your Own HighLevel Project

The minimal example in [SDK Service Interfaces](./06-sdk-service-interfaces.md) shows how to start the program, wait for a connection, and read robot state. Use the following CMake configuration to include the SDK in your project.

### CMake Integration

If the SDK and application are in separate directories, add the SDK root as a CMake subproject.

```cmake
cmake_minimum_required(VERSION 3.10)
project(robot_app LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Threads REQUIRED)

set(ZSIBOT_SDK_ROOT "/absolute/path/to/genisom_l1_sdk-main"
    CACHE PATH "Zsibot SDK root")

add_subdirectory(
    "${ZSIBOT_SDK_ROOT}"
    "${CMAKE_BINARY_DIR}/zsibot_sdk"
)

add_executable(robot_app main.cpp)
target_link_libraries(robot_app PRIVATE zsibot_sdk Threads::Threads)
```

Build application:

```bash
mkdir -p build
cd build
cmake ..
cmake --build .
```

## Debugging and Troubleshooting

### Common Problems

| The phenomenon | Check Contents | Processing |
| --- | --- | --- |
| Not found `CMakeLists.txt` | Current Directory | Go back. SDK Reconfigure after root directory |
| Not found `libzsibot.a` | SDK Package integrity, `uname -m`, `ZSIBOT_ARCH` | Use static libraries consistent with target structures |
| A C++ standard-related error occurred | Compilers and engineering standards | Use a compiler that supports C+ +20 and maintains `CMAKE_CXX_STANDARD 20` |
| `ping` Success but `IsConnected()` is `false` | UDP Two-way communications, receiving ports, firewalls, robotic state | Continue to check 8080 / UDP Receiving and 8081 / UDP Transmission links |
| `sdk_control` Connectable, but no motion order. | Control and functional model | Request SDK Control and confirmation `GetFunctionMode()` Feedback |
| Do not show input at terminal after program exit | Terminal Revisiting Status | Implementation `stty sane`, if necessary `reset` |
| Windows Link Static Library failed | Platform format | The current static library only supports Linux x86_64 and aarch64 |
| SSH Normal but example cannot be connected | SSH Different channel with SDK UDP | Individual inspection SDK IP, port, status reception and firewall |

[Back to Home](../index.md)
