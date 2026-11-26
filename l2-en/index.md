# Genisom L2 SDK Documentation

![Genisom L2 series robots](./assets/product/l2-series-cover.jpg)

## About This Documentation

This documentation covers device operation, application development, and on-site integration for Genisom L2, Genisom L2-W, and Genisom L2-W Ultra. RoamerX Pro is available only on the L2-W Ultra.

Applications use `robot_sdk::SDKClient` to connect to the robot, request control ownership, and send control commands. Callbacks deliver robot state, sensor data, fault reports, and task status.

## Documentation Contents

| Chapter | Topics | When to Read |
| --- | --- | --- |
| [1. Product Introduction and Specifications](./md/01-product-introduction-and-specifications.md) | Foot configurations, dimensions, motion capabilities, runtime, perception, communications, and expansion options for all three variants | When choosing a model or learning about the product |
| [2. Accessories and Components](./md/02-accessories.md) | Robot, battery, battery charging base, adapter, remote controller, UWB beacon, and included accessories | When unpacking or checking accessories |
| [3. First Use](./md/11-first-use.md) | Unpacking, positioning, installing the battery, powering on, setting up the network in GenisDog, and activating the robot | When setting up the robot for the first time |
| [4. Hardware Interfaces and System Architecture](./md/03-hardware-interfaces-and-system-architecture.md) | Payload mounting envelope, [exterior model downloads](./md/03-hardware-interfaces-and-system-architecture.md#exterior-model-downloads), expansion compartment location, power, Gigabit Ethernet, UART, RS485, SBUS, PPS, USB, SIM card slot, and aviation connector breakout cables | Before connecting to a network or installing a payload |
| [5. Operation and Safety](./md/04-device-controller-and-app-guide.md) | Safety checks, powering on and off, remote controllers, emergency stop, app operation, and charging | Before operating the robot |
| [6. Maintenance, Storage, and Troubleshooting](./md/12-maintenance.md) | Cleaning, routine checks, storage, and device troubleshooting | When servicing, storing, or troubleshooting the robot |
| [7. RoamerX Pro User Guide](./md/05-roamerx-pro-guide.md) | Network setup, mapping, route networks, cruise tasks, autonomous recharging, and cruise history for Genisom L2-W Ultra | When deploying Autonomous Navigation on Genisom L2-W Ultra |
| [8. Genisom L2 System and SDK Version Compatibility](./md/sdk-version-compatibility.md) | Version matrix for RK3588, app, SDK, and S100 | When checking component versions or choosing an SDK |
| [9. SDK Quickstart](./md/06-sdk-quickstart.md) | Ubuntu setup, SDK layout, network and port configuration, building, connecting, running examples, and creating a project | When building and running the SDK for the first time |
| [10. Genisom L2 SDK Control Workflow](./md/09-control-ownership-tasks-and-peripherals.md) | Requesting and releasing control, switching between remote and idle states, shutdown, and exception handling | Before writing an SDK application that controls the robot |
| [11. SDK API Reference](./md/07-sdk-api-reference.md) | Capability matrix, common parameters and return values, and APIs for connection, robot control, data reporting, [charging dock pairing and tasks](./md/07-04-dock-and-tasks.md), and [peripheral and camera APIs](./md/07-05-peripherals-and-camera.md) | When looking up an API by function |
| [12. Data Access: Camera Nodes and Topic Configuration](./md/camera-topic-configuration.md) | Camera image formats, resolutions, and topic paths | When accessing front stereo or surround camera images |
| [13. Callbacks, Data Types, and Status](./md/08-callbacks-data-types-and-status-reference.md) | Data and control acknowledgment callbacks, robot and task status, faults, and key data structures | When processing reported data and command acknowledgments |
| [14. Examples and Troubleshooting](./md/10-examples-and-troubleshooting.md) | Included SDK examples, recommended test order, and troubleshooting for networking and runtime libraries | When running the examples or troubleshooting integration |

## Recommended Reading Order

For first-time use, read the following in order.

1. [Product Introduction and Specifications](./md/01-product-introduction-and-specifications.md)
2. [Accessories and Components](./md/02-accessories.md)
3. [First Use](./md/11-first-use.md) for powering on, configuring the network in GenisDog, and activating the robot.
4. [Operation and Safety](./md/04-device-controller-and-app-guide.md) for the remote controller and emergency stop.

For SDK development, read the following in order.

1. [Hardware Interfaces and System Architecture](./md/03-hardware-interfaces-and-system-architecture.md)
2. [Genisom L2 System and SDK Version Compatibility](./md/sdk-version-compatibility.md)
3. [SDK Quickstart](./md/06-sdk-quickstart.md)
4. [Genisom L2 SDK Control Workflow](./md/09-control-ownership-tasks-and-peripherals.md)
5. [SDK API Reference](./md/07-sdk-api-reference.md)
6. [Callbacks, Data Types, and Status](./md/08-callbacks-data-types-and-status-reference.md)

To deploy RoamerX Pro Autonomous Navigation on the L2-W Ultra, read the following in order.

1. [Operation and Safety](./md/04-device-controller-and-app-guide.md)
2. [RoamerX Pro User Guide](./md/05-roamerx-pro-guide.md)
3. If you start recharging or undocking through the SDK, see [Recharge and Undock Tasks](./md/07-04-dock-and-tasks.md#recharge-and-undock-tasks).

If you have trouble powering on the robot, using the remote controller, or connecting to the network, see [Device Troubleshooting](./md/12-maintenance.md#device-troubleshooting).

## Development Environment

| Item | Configuration |
| --- | --- |
| Programming language | C++17 |
| Recommended OS | Ubuntu 22.04 |
| Compiler | GCC 11.4 |
| CMake | 3.8 or later |
| Boost | 1.74 |

## Prerequisites

- Before connecting to a physical robot, place it on level ground in an open area and keep people clear of its travel path.
- During initial testing, read the robot state before testing stand-up, lie-down, and low-speed movement.
- A successful result for a motion command confirms only that the command passed the send or acknowledgment check. Use callbacks to verify the robot's actual motion state.
- Control applications should handle disconnections, loss of control ownership, emergency stops, and fault callbacks.
- A software emergency stop cannot replace a physical emergency stop or an emergency stop on a remote controller that personnel can operate on site.
