# GenisomAI L1 SDK Documentation

![L1 product photo taken at the Jiuquan Satellite Launch Center in 2025](./assets/images/2025-jiuquan-launch-center-product-03.jpg)

## About this guide

This guide covers the L1, L1-W, L1 EDU, and L1-W EDU. It includes product specifications, accessories, robot operation, networking, system architecture, SDK communication, hardware interfaces, building and debugging SDK examples, and accessing the onboard camera stream.

Before using the robot for the first time, review the models and safety requirements. Then learn how to power the robot on and off, connect the remote controller, join the network, and log in over SSH. Before developing with the SDK, verify the robot model, firmware version, control mode, and test-site safety conditions.

## Start here

- **First use:** Review the [product specifications](./md/01-product-specifications.md) and the [robot, controller, and app operation guide](./md/05-device-controller-and-app-guide.md).
- **HighLevel development:** Read the [system architecture](./md/03-system-architecture.md) and the [SDK service interfaces](./md/06-sdk-service-interfaces.md). Follow the [SDK development guide](./md/08-sdk-development-guide.md) to build the SDK, then test with the [official examples](./md/09-official-examples.md).
- **Hardware integration:** Review the [hardware interfaces](./md/04-hardware-interfaces.md) for power and communication requirements and the [dimensions and mounting reference](./md/03-system-architecture.md#dimensions) for installation.
- **Video development:** Connect to the robot network and consult the [onboard camera stream guide](./md/07-onboard-camera-stream.md) to choose a playback or frame capture method.

## Documentation contents

1. [Product specifications](./md/01-product-specifications.md)  
   Compare product photos, mechanical design, mobility, battery life, computing power, sensors, SDK support, and navigation capabilities across models.
2. [Accessories](./md/02-accessories.md)  
   Find photos, specifications, compatibility, and usage notes for the video transmission kit, charging dock, charging contacts, flight case, batteries, controllers, and Roamer X Pro.
3. [System architecture](./md/03-system-architecture.md)  
   Learn how the robot, Remote, SDK, and host computer interact. Covers UDP communication, heartbeat handling, project layout, static libraries, L1 dimensions, payload design, and downloadable models for L1, L1-W, and L1 EDU.
4. [Hardware interfaces](./md/04-hardware-interfaces.md)  
   Review expansion ports, power, networking, USB, and serial communication.
5. [Robot, controller, and app operation](./md/05-device-controller-and-app-guide.md)  
   Learn safety checks, power and charging procedures, tail-light indicators, controller and app operation, Wi-Fi, and SSH login.
6. [SDK service interfaces](./md/06-sdk-service-interfaces.md)  
   See how the five services fit together and review default UDP channels and call order. The individual references cover [control commands](./md/06-01-control-commands.md), [real-time sensor data](./md/06-02-real-time-sensor-data.md), [heartbeat](./md/06-03-heartbeat.md), [Wi-Fi hotspot configuration](./md/06-04-wifi-hotspot-configuration.md), and [fault information](./md/06-05-fault-information.md).
7. [Onboard camera stream](./md/07-onboard-camera-stream.md)  
   Find the RTSP addresses and learn how to view the onboard camera with FFplay, GStreamer, VLC, and OpenCV.
8. [SDK development guide](./md/08-sdk-development-guide.md)  
   Prepare a Linux environment, build the SDK, run the demos, create your own project, and troubleshoot.
9. [Official examples](./md/09-official-examples.md)  
   Download and build the Remote and SDK examples, use the keyboard controls, switch control ownership, inspect status, and troubleshoot.

> Before connecting a program that can move the robot, clear people and obstacles from the area and have a reliable way to trigger an emergency stop or switch to damping mode.
