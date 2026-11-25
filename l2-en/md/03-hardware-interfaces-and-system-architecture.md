# Genisom L2 Hardware Interfaces and System Architecture

[Documentation Overview](../index.md) | [Product Introduction and Specifications](./01-product-introduction-and-specifications.md) | [SDK Quickstart](./06-sdk-quickstart.md)

## System Components

The Genisom L2 development setup consists of the robot, its expansion compartment, a network connection, an Ubuntu development host, and the Robot SDK. The application runs on the development host, connects to the robot over Wi-Fi or Ethernet, and uses `robot_sdk::SDKClient` to send commands, read state, and handle callbacks.

```text
Ubuntu development host
  └─ Genisom L2 application
      └─ Robot SDK
          └─ Wi-Fi or Gigabit Ethernet
              └─ Genisom L2 robot control service
```

## Payload Mounting Space

The payload mounts within the rails on the robot's back. The available space is 210 × 192 × 300 mm, and the recommended maximum payload weight is 16 kg. The rail mounting holes have M4 threads with an effective thread depth of 6 mm.

![Payload mounting space and connector locations](../assets/product/l2-payload-diagram.png)

Plan the payload's center of gravity, mounting position, power supply, connections, and cable routing, then consult after-sales support before installation. Check the operating voltage, current, and startup peaks before connecting a peripheral. Fit protective caps to unused aviation connectors.

## Exterior Model Downloads {#exterior-model-downloads}

Download the STP exterior model for your robot. Open it in CAD software that supports STEP to view the exterior dimensions, lay out the payload, and check assembly clearance.

| Resource | Use | Download |
| --- | --- | --- |
| Genisom L2 exterior model | Check exterior dimensions and payload clearance for Genisom L2 | <a href="../assets/downloads/l2-exterior-model.stp" download>Download STP Model</a> |
| Genisom L2-W Ultra exterior model | Check exterior dimensions and payload clearance for Genisom L2-W Ultra | <a href="../assets/downloads/l2-w-ultra-exterior-model.stp" download>Download STP Model</a> |

## Expansion Compartment and Connector Locations

The expansion compartment is on the side of the robot. Use the supplied 3 mm hex driver to remove the two M4 screws in sequence, then remove the cover. After wiring, refit the cover and tighten both screws in sequence.

![Expansion compartment on the side of the robot](../assets/product/l2-expansion-location.png)

## Interface Functions and Specifications

![Connector layout in the expansion compartment](../assets/product/l2-expansion-ports.png)

| No. | Connector | Interface | Quantity | Description |
| ---: | --- | --- | ---: | --- |
| 1, 4 | USB port | Type-C | 2 | Supplies 5 V, 1 A. Connects USB devices such as external storage, cameras, and sensors. |
| 2 | M14 18PIN | PPS | 1 | For GNSS and base station synchronization, multi-device coordination, synchronized payload triggering, SLAM map time alignment, and time-aligned log analysis. |
| 2 | M14 18PIN | Ethernet | 1 | Supports 1000 Mbps for high-speed data transfer, network access, remote monitoring, and payload communication. |
| 2 | M14 18PIN | Power | 1 | `VBAT` output, with a total power limit of 100 W. |
| 2 | M14 18PIN | RS485 | 1 | Differential serial bus for industrial PLCs, external sensors, and actuators. The user manual specifies a transmission distance of up to 1200 m. |
| 3 | M12 17PIN | SBUS | 1 | Connects a remote control receiver or another device that supports SBUS. |
| 3 | M12 17PIN | UART | 1 | Connects embedded systems, communication equipment, or other devices that support UART. |
| 3 | M12 17PIN | Ethernet | 1 | Supports 1000 Mbps for high-speed data transfer, network access, remote monitoring, and payload communication. |
| 3 | M12 17PIN | Power | 1 | 24 V output, with a total power limit of 100 W. |
| 5 | SIM card slot | 4G/5G | 1 | For cellular communication. Supports SIM cards from China Mobile, China Unicom, and China Telecom only. |
| Top | RTK connector | RTK | 2 | Connects RTK antennas or positioning modules on the Genisom L2-W Ultra. |

## Wiring Requirements

- Measure the actual voltage and check the polarity before connecting a payload. Include the device's startup current, continuous power draw, and peak power draw in the power budget.
- Do not connect or disconnect aviation connectors while powered. Do not wire the M12 24 V output and the M14 `VBAT` output in parallel.
- When connecting payload equipment to the two Gigabit Ethernet interfaces, avoid conflicts with the robot's existing network addresses.
- Match the UART logic levels, serial settings, and message format to the external device.
- Before connecting an external SBUS controller, establish control ownership priorities and how to trigger an emergency stop. Prevent multiple controllers from sending motion commands at the same time.
- Use twisted-pair wiring for RS485 where possible. Verify bus termination, signal levels, and device addresses.

## Aviation Connector Pinouts

::: warning Connector Orientation and Power-On Checks
The diagrams show the mating face of the board-side connectors on the robot. The mating face of the cable-side connectors is a mirror image. Power off the robot before wiring. When the harness is ready, check every pin for shorts, reversed connections, and proper insulation. Then perform a no-load power-on test.
:::

### M14 18PIN

| Item | Details |
| --- | --- |
| Name | 18PIN aviation connector |
| Board-side connector model | `STA思大 M14A-18PFM-GP17-CS24044` |
| Board-side mating face | ![M14 18PIN aviation connector mating face](../assets/product/l2-m14-connector.png) |

| Pin | Assignment | Pin | Assignment |
| ---: | --- | ---: | --- |
| 1 | Vbat | 10 | RS485_B |
| 2 | Vbat | 11 | RS485_A |
| 3 | GND | 12 | GND |
| 4 | PPS | 13 | GND |
| 5 | UART1_TX | 14 | GND |
| 6 | Ethernet port 1 A+ | 15 | Ethernet port 1 C+ |
| 7 | Ethernet port 1 A- | 16 | Ethernet port 1 C- |
| 8 | Ethernet port 1 B+ | 17 | Ethernet port 1 D+ |
| 9 | Ethernet port 1 B- | 18 | Ethernet port 1 D- |

### M12 17PIN

| Item | Details |
| --- | --- |
| Name | 17PIN aviation connector |
| Board-side connector model | `STA思大 3CS24-M12-P17A-GPFM12-CS24044` |
| Board-side mating face | ![M12 17PIN aviation connector mating face](../assets/product/l2-m12-connector.png) |

| Pin | Assignment | Pin | Assignment |
| ---: | --- | ---: | --- |
| 1 | Ethernet port 2 B+ | 10 | Ethernet port 2 B- |
| 2 | Ethernet port 2 A+ | 11 | Ethernet port 2 D+ |
| 3 | Ethernet port 2 A- | 12 | Ethernet port 2 C+ |
| 4 | UART2_TX | 13 | Ethernet port 2 C- |
| 5 | 24 V | 14 | 24 V |
| 6 | 24 V | 15 | GND |
| 7 | GND | 16 | Ethernet port 2 D- |
| 8 | GND | 17 | `SBUS` |
| 9 | UART2_RX |  |  |

### Aviation Connector Breakout Cables

The kit includes one M14 breakout cable and one M12 breakout cable. Connect end A to the corresponding aviation connector on the robot. End B has three branches, labeled ① Ethernet, ② power, and ③ signal, as shown in the table.

**M14 18PIN Aviation Connector Breakout Cable**

![M14 breakout cable with an 18PIN aviation connector on end A and three branches on end B (① Ethernet, ② power, ③ signal)](../assets/product/l2-m14-debug-cable.png)

**M12 17PIN Aviation Connector Breakout Cable**

![M12 breakout cable with a 17PIN aviation connector on end A and three branches on end B (① Ethernet, ② power, ③ signal)](../assets/product/l2-m12-debug-cable.png)

| End B Branch | M14 Aviation Connector Breakout Cable | M12 Aviation Connector Breakout Cable |
| --- | --- | --- |
| ① Ethernet | T-568B | T-568B |
| ② Power | Red `Vbat`, black `GND` | Red 24 V, black `GND` |
| ③ Signal | Orange `PPS`, blue `UART_TX`, yellow `RS485_B`, purple `RS485_A`, gray `GND` | Yellow `UART_TX`, blue `UART_RX`, purple `SBUS`, gray `GND` |

## Payload Integration Procedure

1. Choose a mounting position based on the payload's dimensions, weight, and center of gravity.
2. Check the peripheral's voltage, continuous power draw, and startup peak. Then choose the M12 24 V, M14 `VBAT`, or USB power supply.
3. Verify the communication interface, signal levels, pinout, and bandwidth.
4. Power off the robot and remove the battery before making and connecting the harness.
5. Check for proper insulation and shorts, then test power-up with no load before attaching the payload for motion testing.
6. Secure cables away from the joints' range of motion and the sensors' fields of view.
7. At low speed, test standing, turning, climbing and descending slopes, and emergency stop.

## Hardware Safety Requirements

- Keep the payload at or below 300 mm in height. The recommended maximum payload weight is 16 kg.
- Fit the expansion interface cover, aviation connector caps, and cable seals securely.
- Do not remove or install the battery, payload, or wiring harness while the robot is moving.
- Determine how to connect power ground and signal ground during system design to prevent circulating currents and communication interference.
- For high-power payloads, evaluate heat dissipation, fusing, and power isolation during a fault separately.
- After each wiring change, complete static tests before enabling motion commands.
