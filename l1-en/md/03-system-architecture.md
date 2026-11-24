# System Architecture

[Back to Home](../index.md) | [Hardware interface](./04-hardware-interfaces.md) | [SDK service interfaces](./06-sdk-service-interfaces.md) | [SDK Development Guide](./08-sdk-development-guide.md) | [Onboard Camera Stream](./07-onboard-camera-stream.md)

## System Architecture

The Genisom L1 system includes hardware, hardware control and data preprocessing, application and system interfaces, the robot interface, and cloud management.

![ L1 Full system architecture](../assets/images/system-architecture-v15.jpg)

The diagram shows the robot’s functional layers. See the SDK reference for publicly available interfaces.

## Structure and Installation

<a id="dimensions"></a>

### Genisom L1 Size and Installation Reference

![ L1 Body size and installation hole (mm)](../assets/images/dimensions/zsl-1-dimensions.png)

<a id="payload-model-downloads"></a>

### Load Design Reference and Model Download

#### Genisom L1

| Information | Use | Download |
| --- | --- | --- |
| L1 payload capacity reference | View load reference values, coordinates and test conditions for different load core positions | [Download PDF](../assets/downloads/zsl-1-payload-design-reference.pdf) |
| L1 exterior model | Check the external dimensions, payload layout, and mounting space | <a href="../assets/downloads/zsl-1-exterior-model.stp" download> Download STP Model </a> |
| L1 URDF Model | Inspect robot links, joints, and collision geometry. | <a href="../assets/downloads/zsl-1-urdf.rar" download> Download URDF </a> |

#### Genisom L1-W

| Information | Use | Download |
| --- | --- | --- |
| L1-W exterior model | Check the external dimensions, payload layout, and mounting space | <a href="../assets/downloads/l1-w-exterior-model.zip" download> Download STP Model </a> |
| L1-W URDF Model | Inspect robot links, joints, and collision geometry. | <a href="../assets/downloads/l1-w-urdf.rar" download> Download URDF </a> |

#### Genisom L1 EDU

| Information | Use | Download |
| --- | --- | --- |
| L1 EDU exterior model | Check the external dimensions, payload layout, and mounting space | <a href="../assets/downloads/l1-edu-exterior-model.step" download> Download STEP Model </a> |

## SDK and Control

### SDK Capacity

The Genisom L1 SDK exposes a unified HighLevel C++ interface through `zsibot::ZsibotExecutor`.

The SDK supports these operations.

- Send discrete commands and continuous motion input
- Request different types of control ownership
- Read battery, device, mode, IMU, odometry, joint, and fault data
- HighLevel communication with robots via JSON over UDP
- Use dedicated threads for sending, receiving, and maintaining the heartbeat
- Run on `x86_64` and `aarch64` Linux

### Type of Control

| Control ownership | Meaning | Apply scene |
| --- | --- | --- |
| Remote | Control of remote controls | Remote operation |
| SDK | Secondary development of navigation control | Responds to lower speed commands, such as 0.05 m/s during return-to-dock maneuvers |
| General SDK | Universal secondary development navigation control | Respond to larger speed commands (e.g. 3 m/s, climbing stairs etc.) |

`Role` identifies how the program connects to the SDK. Control ownership indicates which control source the robot currently accepts. After constructing the executor with `ROLE_SDK`, send the appropriate control request and confirm the switch with `GetFunctionMode()`.

![L1 SDK Scheduling of requests for control](../diagrams/sdk-control-sequence.svg)

## Communications and Connectivity

### HighLevel Communications Structure

![L1 HighLevel communications structure](../diagrams/highlevel-communication.svg)

Constructing `ZsibotExecutor` starts the communication threads. Public getters return the latest cached state. The destructor stops communication and waits for the threads to exit.

### JSON Over UDP

HighLevel uses JSON over UDP by default.

| Direction | Default Target |
| --- | --- |
| SDK to robot | `192.168.234.1:8081/UDP` |
| Robot state reports to SDK | Development computer `8080/UDP` |

The onboard camera uses a separate RTSP channel. The default stream URL is `rtsp://user:Abcd%232027%21@192.168.234.1:8554/test`, which includes the username and URL-encoded password. See [Onboard Camera Stream](./07-onboard-camera-stream.md) for playback and frame capture.

JSON structures commands, communication roles, remote control inputs, and state fields. UDP provides low-latency transport, and packets can be lost. Use state feedback, timeouts, and connection checks to handle packet loss and disconnections.

![L1 UDP Communication direction and port](../diagrams/udp-communication.svg)

### Heartbeat and Connection Status

The SDK sends periodic heartbeats to maintain its communication role and check whether the connection is still valid.

`IsConnected()` returns `true` when both conditions are met.

1. The SDK has received at least one packet from the robot.
2. The SDK’s heartbeat timer is within the connection timeout.

A successful `ping` confirms IP reachability only. Check `IsConnected()` for the SDK connection.

## Project Directory and Static Library

Find the source code and examples in the [Genisom L1 SDK GitHub repository](https://github.com/zsibot/genisom_L1_sdk/tree/main).

```text
genisom_l1_sdk/
├── CMakeLists.txt
├── docs/
├── example/
├── include/zsibot_sdk/
│   ├── zsibot_api.h
│   ├── zsibot_define.h
│   ├── zsibot_exception.h
│   └── lowlevel/
│       └── lowlevel.h
└── lib/
    ├── x86_64/libzsibot.a
    └── aarch64/libzsibot.a
```

`libzsibot.a` is the pre-compiled static library. The API versions are the same, but contain x86-64 and ARM64 machine commands, respectively, and cannot be used in combination.
