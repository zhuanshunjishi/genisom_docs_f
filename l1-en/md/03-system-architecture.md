# System architecture

[Back to Home](../index.md) | [Hardware interface](./04-hardware-interfaces.md) | [SDK service interfaces](./06-sdk-service-interfaces.md) | [SDK Guidance for development and operation](./08-sdk-development-guide.md) | [Main camera stream](./07-onboard-camera-stream.md)

## System architecture

L1 The whole machine consists of hardware equipment, hardware control and data preprocessing, applications and systems interface, Robot Interface and cloud management.

![ L1 Full system architecture](../assets/images/system-architecture-v15.jpg)

This chart displays the functional layers of the whole machine, which do not represent SDK lists of open interfaces.

## Structure and installation

<a id="dimensions"></a>

### L1 Size and installation reference

![ L1 Body size and installation hole (mm)](../assets/images/dimensions/zsl-1-dimensions.png)

<a id="payload-model-downloads"></a>

### Load Design Reference and Model Download

#### L1

| Information | Use | Download |
| --- | --- | --- |
| L1 Load capacity design reference | View load reference values, coordinates and test conditions for different load core positions | [Download PDF](../assets/downloads/zsl-1-payload-design-reference.pdf) |
| L1 Appearance model | For visual size viewing, top layout and spatial reference | <a href="../assets/downloads/zsl-1-exterior-model.stp" download> Download STP Model </a> |
| L1 URDF Model | It's used to see robot poles, joints and collision geometry. | <a href="../assets/downloads/zsl-1-urdf.rar" download> Download URDF </a> |

#### L1 -W

| Information | Use | Download |
| --- | --- | --- |
| L1-W Appearance model | For visual size viewing, top layout and spatial reference | <a href="../assets/downloads/l1-w-exterior-model.zip" download> Download STP Model </a> |
| L1-W URDF Model | It's used to see robot poles, joints and collision geometry. | <a href="../assets/downloads/l1-w-urdf.rar" download> Download URDF </a> |

#### L1  EDU

| Information | Use | Download |
| --- | --- | --- |
| L1 EDU Appearance model | For visual size viewing, top layout and spatial reference | <a href="../assets/downloads/l1-edu-exterior-model.step" download> Download STEP Model </a> |

## SDK and control

### SDK Capacity

L1 SDK Provide a unified HighLevel C++ interface through `zsibot::ZsibotExecutor`.

Key competencies include:

- Send discrete commands and continuous remotes
- Application for different types of control
- Read batteries, devices, modes, IMU, mileage meters, joints and malfunctions
- HighLevel communication with robots via JSON over UDP
- Send, receive and heartbeat through a stand-alone thread
- Support `x86_64` and `aarch64` Linux platform

### Type of control

| Control ownership | Meaning | Apply scene |
| --- | --- | --- |
| Remote | Control of remote controls | Remote operation |
| SDK | Secondary development of navigation control | Respond to smaller speed commands (e. g. 0.05 m/s, refill etc.) |
| General SDK | Universal secondary development navigation control | Respond to larger speed commands (e.g. 3 m/s, climbing stairs etc.) |

`Role` Means program connection SDK The communication identity used at the time, control, indicates which type of control source the robot is currently receiving, and the two are not the same concepts. `ROLE_SDK` It doesn't mean you've got it. SDK right of control; the procedure still requires the delivery of the corresponding control order and is based on `GetFunctionMode()` The feedback confirms the transition result.

![L1 SDK Scheduling of requests for control](../diagrams/sdk-control-sequence.svg)

## Communications and connectivity

### HighLevel communications structure

![L1 HighLevel communications structure](../diagrams/highlevel-communication.svg)

Commencing the communication thread when you construct `ZsibotExecutor`, the public getter reads the last state from the internal status cache. Stops the communication and waits for the end of the line while the object is deconstructed.

### JSON over UDP

HighLevel is used by default JSON over UDP:

| Direction | Default Target |
| --- | --- |
| SDK Send to the robot | `192.168.234.1:8081/UDP` |
| Robot to SDK return state | Computer development `8080/UDP` |

The body camera uses a separate RTSP channel, with the default drop address `rtsp://user:Abcd%232027%21@192.168.234.1:8554/test`, which contains the user name and password by which the URL code is coded. See [Main camera stream](./07-onboard-camera-stream.md) for the play and frame method.

JSON It's about organizing commands, roles, remote controls, and status fields. UDP Responsible for low-delayed network transmissions. UDP There is no assurance that each package will arrive, so that state feedback, overtime and connection checks should be used to process the lost package or the missing link.

![L1 UDP Communication direction and port](../diagrams/udp-communication.svg)

### Heartbeat and connection status

Heart beats are SDK periodic online signals that are used to maintain communication identity and to determine whether the connection is still valid.

`IsConnected()` Returns `true` require:

1. SDK At least one robot data package was received.
2. SDK Internal heartbeat count does not exceed the connection timeout threshold

Therefore, `ping` success is not the same as SDK a two-way communication has been established.

## Project Directory and Static Library

SDK See source code and examples [Genisom L1 SDK GitHub repository](https://github.com/zsibot/genisom_L1_sdk/tree/main).

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
