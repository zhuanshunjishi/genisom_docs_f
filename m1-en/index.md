# Genisom M1 SDK Documentation

![Genisom M1 during desert terrain testing](./assets/product/m1-desert-terrain-test.jpg)

## About This Documentation

This guide covers operation, application development, and on-site integration for the Genisom M1 robot series. It includes data access, product specifications, device operation, SDK development, and troubleshooting.

The main SDK class is `robot_sdk::SDKClient`. Use it to connect to the robot and send control commands. Register callbacks to receive state data, fault reports, and command acknowledgments.

## Documentation Contents

| Chapter | Topics | When to read |
| --- | --- | --- |
| 1. Data Access | [Reading Video Streams](./md/video-stream-reading.md), [Reading Sensor Data](./md/sensor-data-reading.md) | To view camera feeds or look up ROS 2 topics and RTK fields |
| [2. Product introduction and specifications](./md/01-product-introduction-and-specifications.md) | Design, specifications, sensors, and software capabilities by model | When choosing a model or learning about the product |
| [3. Operation and maintenance](./md/02-operation-and-maintenance.md) | Preparation, power, remote control, motion modes, safety, battery replacement, charging, and maintenance | Before first use |
| [4. System components, hardware interfaces, and mechanical design](./md/03-system-components-and-hardware-interfaces.md) | System components, networking, the expansion compartment, video interfaces, [aviation connector pinouts](./md/03-system-components-and-hardware-interfaces.md#aviation-connector-pinouts), and [mounting space drawings, payload design references, exterior models, and URDF models](./md/03-system-components-and-hardware-interfaces.md#payload-model-downloads) | Before connecting to the network or installing a payload |
| [5. M1 system and SDK version compatibility](./md/sdk-version-compatibility.md) | Recommended SDK versions by robot system version | Before choosing an SDK version |
| [6. M1 SDK quickstart](./md/04-sdk-quickstart.md) | Development environment, SDK layout, connection, building and running examples, and custom projects | Before running the SDK for the first time |
| [7. Control flow and task handling](./md/05-sdk-control-flow-and-task-handling.md) | Call results, synchronous and asynchronous calls, control ownership, dock pairing, docking, and state transitions | Before writing a control application |
| [8. M1 SDK API reference](./md/06-sdk-api-reference.md) | `SDKClient` signatures, parameters, return values, and acknowledgments | While implementing SDK calls |
| [9. Callbacks, data types, and status reference](./md/07-callbacks-data-types-and-status-reference.md) | Callback interfaces, structs, enums, sensor data, and robot states | While processing data and command acknowledgments |
| [10. Examples and troubleshooting](./md/08-examples-and-troubleshooting.md) | Official examples, usage, common issues, and shutdown procedures | During integration, verification, and troubleshooting |

## Development Environment and Communication

| Item | Version or configuration |
| --- | --- |
| Programming language | C++ |
| Build environment | Ubuntu 22.04, GCC 11.4, CMake 3.8+ |
| Dependency | Boost 1.74 |
| Default transport | UDP |
| Default UDP port | `8082` |
| WebSocket port | `8081` |

## Prerequisites

- Verify that the robot model, system version, and SDK version are compatible.
- Test in a clear, safe area with no people near the robot.
- Before commanding motion, establish the connection, complete the handshake, and confirm control ownership.
- Use state data and callbacks to verify that a command's action completed.
- Keep callbacks lightweight. Run time-consuming work on the application's own worker threads.
- Keep the physical emergency stop accessible to on-site personnel even when software emergency stop is available.
