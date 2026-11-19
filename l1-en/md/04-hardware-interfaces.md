# Hardware interfaces

[Documentation overview](../index.md) | [System architecture](./03-system-architecture.md) | [SDK service interfaces](./06-sdk-service-interfaces.md)

## Scope

This page describes the external interfaces for integrating hardware with the robot and lists the published power specifications.

See [system architecture](./03-system-architecture.md) and the [SDK service interfaces](./06-sdk-service-interfaces.md) for software communication and control.

See [L1 dimensions and mounting](./03-system-architecture.md#dimensions) and [payload design and model downloads](./03-system-architecture.md#payload-model-downloads) for mechanical design information.

## Expansion interfaces

The expansion area on top of the robot provides Ethernet, USB, power, and serial interfaces for connecting a development computer, embedded computer, camera, sensor, or remote-control receiver.

| Interface | Quantity | Primary use or specification |
| --- | ---: | --- |
| Gigabit RJ45 Ethernet | 1 | Networking, remote monitoring, and data transfer |
| USB Type-A | 2 | Connect USB peripherals |
| 12 V power | 1 | Maximum total output power: 36 W |
| BAT 43.2 V power | 1 | Maximum total output power: 100 W |
| SBUS | 1 | Connect SBUS devices |
| UART | 1 | Asynchronous serial communication |

![Locations of the expansion ports](../assets/images/expansion-ports.png)

## Power interfaces

### 12 V output

The 12 V connector supplies power to expansion computers, sensors, and communication equipment. Its total output power must stay at or below 36 W.

### BAT 43.2 V output

The BAT connector supplies a nominal 43.2 V. Its total output power must stay at or below 100 W.

## Ethernet

The Gigabit RJ45 Ethernet port supports networking, remote monitoring, and data transfer.

## USB

The robot has two USB Type-A ports for peripherals.

## Serial interfaces

### SBUS

The robot provides one SBUS port.

### UART

The robot provides one standard UART port for asynchronous serial communication. Use the connector specification for your model to verify the pinout, signal levels, and communication settings before wiring.
