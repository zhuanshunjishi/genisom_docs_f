# SDK development guide

[Back to Home](../index.md) | [Hardware, software and architecture](./03-system-architecture.md) | [SDK service interfaces](./06-sdk-service-interfaces.md)

## Quick setup

The following steps are implemented in the Linux terminal. SDK Provides `x86_64` and `aarch64` two static reservoirs, and the processor structure for operating the environment must be consistent with the static reservoir used.

Before you start, put the robot in a flat, open area to make sure you can stop moving at any time. When the robot goes on, the Linux device that runs SDK is connected to the robot network.

### 1. Installation of compilation tools

```bash
sudo apt update
sudo apt install -y build-essential cmake
```

### 2. Enter SDK root directory

Replace the path with SDK actual position on Linux device:

```bash
cd /path/to/genisom_L1_sdk-main
pwd
ls CMakeLists.txt include/zsibot_sdk example lib
```

Terminals should be visible `CMakeLists.txt`, as well as `include`, `example`, `lib` directories.

### 3. Confirm processor structure

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

### 5. Check the network connection to the robot

SDK Default connection robot IP `192.168.234.1`, send data to the robot `8081/UDP` port and receive the data at its own `8080/UDP` port.

```bash
ip addr
ping -c 4 192.168.234.1
```

`ping` When it's not working, check if Linux's device is connected to the robot network, and the machine itself. IP Whether or not to be in a commotionable section with robots. `ping` After success, run Demo again.

### 6. Run Remote Demo

```bash
./build/example/remote_control
```

The Demo uses `ROLE_REMOTE` identity. After the program starts, you can use the following basis keys:

| Button | Action |
| --- | --- |
| `i` | Output equipment, batteries, mode and motion |
| `2` | Stand |
| `w` / `s` | Forward / Back |
| `a` / `d` | Move Left / Right |
| `q` / `e` | Left / Right |
| `c` | Stop moving |
| `1` | Get down! |
| `0` | Squeeze and get down. |

First test recommended by `i` View the state, and then test in turn, stand, move at short distances in a single direction, stop and lie down. Press immediately after each direction test. `c`, do not test motion buttons when people are near robots.

### 7. Run SDK Demo

Press `Ctrl+C` to close `remote_control` and then execute:

```bash
./build/example/sdk_control
```

`sdk_control` Use `ROLE_SDK` Identity. You have to apply first. SDK Control:

1. Press `k` Send SDK Right of control request.
2. Press `i` to see feedback on the functional mode and confirm that control has been switched.
3. Press `2` stand, test only one moving direction and press `c` to stop.
4. Press `1` Get the robot down.
5. Remote control is restored as requested by `r` and the mode feedback is reviewed again.
6. Press `Ctrl+C` to exit the program.

`ZsibotExecutor(Role::ROLE_SDK)` Creates a communications identity only, which does not mean that the program has achieved control of movement.

### 8. Restore terminal

Two Demos close the terminal's specifications and character echoes. After exit, if the terminal does not show input content, execute:

```bash
stty sane
reset
```

## Development of routes

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

Root directory `CMakeLists.txt` Settings `CMAKE_CXX_STANDARD 20`, development works should use the same compilation standards.

Root projects are based on the `CMAKE_SYSTEM_PROCESSOR` automatic selection of pre-compile static libraries. When cross-compile or manually specify target structures, settings can be set at configuration stage `ZSIBOT_ARCH`:

```bash
cd build
cmake -DZSIBOT_ARCH=x86_64 ..
cmake --build .
cd ..
```

Yes. ARM64 Replace parameters in the environment with `aarch64`.

### Optional Installations

Need for other projects to be quoted from the system directory SDK, which may be implemented:

```bash
sudo cmake --build build --target install
```

Default installation location:

| Contents | Path |
| --- | --- |
| Header File | `/usr/local/include/zsibot_sdk/` |
| Static Library | `/usr/local/lib/libzsibot.a` |

## Demo Description

Two examples of full operating steps, key description and control switch process see [Chapter IX: Instructions for the use of official examples](./09-official-examples.md).

| Example: | Construct Identity | Main uses | Right of control requirement |
| --- | --- | --- | --- |
| `remote_control.cpp` | Default `ROLE_REMOTE` | Keyboard Remote Control and HighLevel Status Read | Remote Control Process |
| `sdk_control.cpp` | `ROLE_SDK` | Algorithms program and automated control process validation | Send SDK control orders and confirm mode feedback |

Both examples use non-obstructed terminal input, sending continuous motion through `SetRemote()`, sending discrete orders through `SetCmd()`. The definition of control is in [Hardware, software and architecture](./03-system-architecture.md), the order and status confirmation is in [Control command interface](./06-01-control-commands.md). Demo is used to validate interfaces, and formal applications still need to achieve connection checks, control confirmation, stopovers and abnormal exit protection.

## Create your own HighLevel project

The program entry, connection waiting and status reading is an example of the smallest process in [SDK service interfaces](./06-sdk-service-interfaces.md). Custom projects can be used through the following CMake configuration reference SDK.

### CMake Integration

If SDK are placed separately from the application project, the SDK root directory may be added as a sub-item:

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

## Debugging and troubleshooting

### Common problems

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
