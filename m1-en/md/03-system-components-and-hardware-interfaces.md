# Genisom M1 System Components, Hardware Interfaces, and Mechanical Design

[Documentation overview](../index.md) | [Operation and maintenance](./02-operation-and-maintenance.md) | [M1 SDK quickstart](./04-sdk-quickstart.md)

## System Components

The M1 includes a motion control host, navigation host, network switch, sensors, an expansion compartment, and external controllers.

### Hardware Architecture

The diagram shows how the main controller, compute board, sensors, power modules, and external interfaces connect.

![M1 hardware architecture](../assets/product/m1-hardware-architecture.png)

### Network Architecture and Components

![M1 SDK Network architecture](../diagrams/SDK-Network.svg)

| Component | Responsibilities | Wired IP | Wireless IP |
| --- | --- | --- | --- |
| Motion control host | Motion control, system status, and SDK communication | `192.168.168.168` | `192.168.234.1` (Wi-Fi AP) |
| Navigation host | Mapping, localization, navigation, and obstacle avoidance | `192.168.168.100` | `192.168.168.100` |
| Network switch | Connects the motion control host, navigation host, and external Ethernet ports |  |  |
| External Ethernet port | Provides wired network access | Assigned by the LAN |  |
| SDK development computer | Runs your C++ program | Same network as the robot | Connects to the robot's Wi-Fi AP |

For the default IP addresses of the front and rear LiDAR units, see [Reading Sensor Data](./sensor-data-reading.md#lidar-imu-and-ultrasonic-sensors).

## Network and Communication Ports

The robot's Wi-Fi hotspot is named `M1-xxxxxxx`. The factory password is `12345678`.

Connect the development computer through the robot's Wi-Fi AP or external Ethernet port. The motion control host uses `192.168.234.1` over Wi-Fi and `192.168.168.168` over Ethernet. The navigation host uses `192.168.168.100` for both wired and wireless access. For connection and test steps, see the [M1 SDK quickstart](./04-sdk-quickstart.md#connect-to-the-robot).

| Device | Port | Protocol/ Use |
| --- | ---: | --- |
| Robot | 8081 | WebSocket for app control |
| Robot | 8082 | Default SDK UDP connection port |
| Robot | 8554 | RTSP video stream |

The SDK constructor defaults to `TransportProtocol::Udp`. For WebSocket, specify the protocol when constructing `SDKClient` and connect to port `8081`.

### SSH Access to the Compute Host

| Model | Compute board | Login IP | Username | Password |
| --- | --- | --- | --- | --- |
| Genisom M1 | NX/S100 | `192.168.168.100` | `robot` | `1` |

## Expansion Compartment

The expansion compartment on the robot's back provides mounting, power, and communication connections for payloads. Its power button independently controls the expansion interfaces.

![M1 expansion compartment interfaces](../assets/product/m1-expansion-interface-diagram.png)

| Number | Interface | Quantity or capacity |
| --- | --- | --- |
| ① | 48 V power | 10 A × 1 |
| ② | 24 V power | 20 A × 1 |
| ③ | 24 V + Ethernet | 24 V / 3 A + 1 Gigabit Ethernet port |
| ④ | 12 V + Ethernet | 12 V / 5 A + 1 Gigabit Ethernet port |
| ⑤ | Serial | RS232 × 1, RS485 × 1, SBUS × 2, PPS × 1 |
| ⑥, ⑦ | USB 3.0 | 5 V / 1 A, 2 ports |
| ⑧ | RTK antenna connector | 1 |
| ⑨ | Expansion compartment power button | Controls power to the expansion interfaces |

### Aviation Connector Pinouts {#aviation-connector-pinouts}

The connector numbers match the expansion compartment diagram above. Before wiring, check the board-side connector model and pin diagram against the connector on the robot.

#### ① 48 V Power and ② 24 V Power

Both ports use the `STA思大-M12-S4S-GPFM16-135-CS24044` board-side connector.

![Board-side pin diagram for the four-pin power connector](../assets/product/connector-pinouts/power-connector.png)

| Pin | ① 48 V / 10 A | ② 24 V / 20 A |
| --- | --- | --- |
| 1 | `GND` | `GND` |
| 2 | 48 V | 24 V |
| 3 | 48 V | 24 V |
| 4 | `GND` | `GND` |

The drawing labels pin 4 as `PIN 4/PE`. The Genisom M1 pinout table lists its signal as `GND`.

#### ③ 24 V + Ethernet and ④ 12 V + Ethernet

Both ports use the `STA思大-M12- P12A-GPFM12` board-side connector.

![Board-side pin diagram for the 12-pin power and Ethernet connector](../assets/product/connector-pinouts/ethernet-connector.png)

| Pin | ③ 24 V + Ethernet | ④ 12 V + Ethernet |
| --- | --- | --- |
| 1 | `GND` | `GND` |
| 2 | 24 V | 12 V |
| 3 | 24 V | 12 V |
| 4 | Ethernet `A+` | Ethernet `A+` |
| 5 | Ethernet `A-` | Ethernet `A-` |
| 6 | Ethernet `B+` | Ethernet `B+` |
| 7 | Ethernet `B-` | Ethernet `B-` |
| 8 | Ethernet `C+` | Ethernet `C+` |
| 9 | Ethernet `C-` | Ethernet `C-` |
| 10 | `GND` | `GND` |
| 11 | Ethernet `D+` | Ethernet `D+` |
| 12 | Ethernet `D-` | Ethernet `D-` |

#### ⑤ Serial

The board-side connector model is `STA思大-M12- P8A-GPFM12`.

![Board-side pin diagram for the eight-pin serial connector](../assets/product/connector-pinouts/serial-connector.png)

| Pin | Signal |
| --- | --- |
| 1 | `PPS` |
| 2 | `SBUS1` |
| 3 | `SBUS2` |
| 4 | `RS485A` |
| 5 | `RS485B` |
| 6 | `RS232_TX` |
| 7 | `RS232_RX` |
| 8 | `GND` |

#### ⑥ and ⑦ USB 3.0

Both ports use the `STA思大-E10B- FT3-PPF` board-side connector. The source pinout table leaves the individual USB 3.0 pin assignments unspecified.

![Board-side USB 3.0 connector drawing](../assets/product/connector-pinouts/usb-connector.png)

### Device Paths for the Aviation Expansion Connector

Device paths for the expansion compartment's serial interface (⑤) vary by hardware revision. Use the path for your robot's revision when connecting a peripheral.

| Interface | V3 Device Path | V4 Device Path |
| --- | --- | --- |
| RS232 | `/dev/ttyTHS3` | `/dev/ttyCH9344USB4` |
| RS485 | `/dev/ttyTHS1` | `/dev/ttyCH9344USB5` |
| SBUS1 | `/dev/ttyACM2` | `/dev/ttyCH9344USB2` |
| SBUS2 | `/dev/ttyACM3` | `/dev/ttyCH9344USB3` |

### Power and Protection

- The combined output of all expansion power connectors must stay at or below 480 W.
- Fit the protective caps to unused aviation connectors to maintain IP67 protection.
- When performing the platform-climbing stunt, remove all payloads and make sure the battery indicator shows at least two bars.

## Payload Design and Model Downloads {#payload-model-downloads}

Use the payload capacity reference and mounting space drawing when designing a payload. Check assembly clearance with the STP exterior model. Download the URDF model for simulation or kinematic modeling.

| Resource | Use | Download |
| --- | --- | --- |
| Genisom M1 payload capacity reference | Check payload design values | [Download PDF](../assets/downloads/m1-payload-design-reference.pdf) |
| Genisom M1 recommended mounting space | Check the recommended space for payload installation | [Download PDF](../assets/downloads/m1-mounting-space-reference.pdf) |
| Genisom M1 exterior model | Check external dimensions and assembly clearance | <a href="../assets/downloads/m1-exterior-model.zip" download>Download STP model (ZIP)</a> |
| Genisom M1 URDF model | Inspect links, joints, and geometry | <a href="../assets/downloads/m1-urdf.zip" download>Download URDF (ZIP)</a> |

## Video Streams

The M1 provides RTSP video streams on ports `8554` and `8555`. Check the device configuration for the stream URLs, front and rear camera assignments, and bitrates. Use `UpdateCameraBitrate()` to adjust the bitrate. See [camera bitrate](./06-05-peripherals-and-camera.md#camera-bitrate).
