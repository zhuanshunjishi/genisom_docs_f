# Genisom L2 Accessories and Components

[Documentation Overview](../index.md) | [Product Introduction and Specifications](./01-product-introduction-and-specifications.md) | [Genisom L2 Operation and Safety](./04-device-controller-and-app-guide.md)

## Package Contents

Check the contents against the packing list as soon as you unpack the robot. If anything is missing, contact after-sales support within 7 days. Genisom L2 and Genisom L2-W come with a screenless remote controller. Genisom L2-W Ultra comes with a remote controller with a display. Only Genisom L2 comes with nonslip foot pads.

![Genisom L2 series package contents, including each model's remote controller and the two aviation connector breakout cables](../assets/product/l2-product-kit-items.png)

| Item | Quantity | Purpose |
| --- | ---: | --- |
| Quadruped robot body | 1 | Locomotion and computing platform. The battery is listed separately. |
| Battery | 1 | Powers the robot |
| Battery charging base | 1 | Charges the battery outside the robot |
| Power adapter | 1 | Powers the battery charging base |
| Power cord | 1 | Connects the adapter to AC power |
| Screenless remote controller (Genisom L2, Genisom L2-W) | 1 | Manual control and emergency stop |
| Remote controller with display (Genisom L2-W Ultra) | 1 | Manual control and emergency stop |
| Nonslip foot pads | 4 | For Genisom L2 with point feet |
| [M14 and M12 aviation connector breakout cables](./03-hardware-interfaces-and-system-architecture.md#aviation-connector-breakout-cables) | 1 each | Break out Ethernet, power, and signal connections |
| UWB beacon | 1 | Target positioning in follow mode |
| User manual | 1 | Operating instructions |
| Quick start guide | 1 | Common procedures |
| Packing list | 1 | Verifies package contents |
| Certificate of conformity | 1 | Product identification |
| Maintenance tools and accessories | 1 | Basic maintenance and removal and installation of interface covers |

## Robot Body

Genisom L2 and Genisom L2-W have the same body design. Their main difference is the use of point feet or wheeled legs. Key components include payload mounting rails, an upper bumper, handles, upper and lower leg segments, the expansion compartment, the stereo camera, the fill light, the status indicator, and the battery compartment.

![Genisom L2 and Genisom L2-W robot components](../assets/product/l2-parts-diagram.png)

Genisom L2-W Ultra adds fisheye cameras, LiDAR, a microphone, a speaker, and a physical emergency stop. You can remove the rear LiDAR to accommodate different payloads. Contact after-sales support for removal instructions.

![Genisom L2-W Ultra robot components](../assets/product/l2-w-ultra-parts-diagram.png)

::: warning Carrying the Robot
Power off the robot before carrying it. Support the body and avoid lifting it by the legs, wheels, cameras, LiDAR, or expansion connectors. Keep hands and clothing clear of the hip and knee joints.
:::

For first-time unpacking and placement steps and illustrations, see [Unpack and Position the Robot](./11-first-use.md#unpack-and-position-the-robot).

## Battery

| Parameter | Value |
| --- | --- |
| Type | Lithium-ion battery |
| Rated capacity | 14 Ah (705.6 Wh) |
| Weight | 4.5 kg |
| Charging temperature | 0 to 40 °C |
| Discharge temperature | -20 to 60 °C |

## Battery Charging Base and Power Adapter

| Parameter | Value |
| --- | --- |
| Battery charging base model | `HXGCB-01` |
| Rated input of the battery charging base | 58.8 V DC, 10 A |
| Rated output of the battery charging base | 58.8 V DC, 10 A |
| Rated power of the battery charging base | 588 W |
| AC input of the adapter | 110 to 240 V AC |
| Charging time (25 °C) | About 2 h |

For first-time battery installation, see [Install the Battery](./11-first-use.md#install-the-battery). See also [Battery Level Indicators](./04-device-controller-and-app-guide.md#battery-level-indicators), [Charging the Battery Outside the Robot](./04-device-controller-and-app-guide.md#charging-the-battery-outside-the-robot), and [Storage](./12-maintenance.md#storage).

## Remote Controllers

| Remote Controller | Compatible Models | Image |
| --- | --- | --- |
| Screenless remote controller | Genisom L2, Genisom L2-W | ![Screenless remote controller](../assets/product/l2-screenless-remote-diagram.png) |
| G12 remote controller with display | Genisom L2-W Ultra | ![G12 remote controller with display](../assets/product/l2-screen-remote-product.png) |

For remote controller components, buttons, and emergency stop procedures, see [Remote Controllers](./04-device-controller-and-app-guide.md#remote-controllers). For app network setup and activation, see [Install GenisDog](./11-first-use.md#install-genisdog).

## UWB Beacon

The UWB beacon locates the target in follow mode. Before use, check the battery level, pairing status, and where the beacon is worn. Keep the beacon unobstructed during operation. When using UWB following, on-site personnel must watch the robot's path and be ready to trigger an emergency stop.

## Charging Dock

The optional charging dock supports autonomous return-to-dock charging. Before using RoamerX Pro to return a Genisom L2-W Ultra to the dock, install the dock, pair it over Bluetooth, mark the charging point on the map, and calibrate its orientation. See the [Genisom L2 RoamerX Pro Guide](./05-roamerx-pro-guide.md). For SDK docking and undocking prerequisites, see [Genisom L2 Control Ownership, Tasks, and Peripheral Control](./09-control-ownership-tasks-and-peripherals.md).

## Arrival Inspection

- Check the robot, battery, charging equipment, and accessories against the quantities on the packing list.
- Inspect the body enclosure, joints, feet, cameras, LiDAR, and aviation connectors for damage.
- Check the battery for swelling, deformation, leakage, and terminal damage.
- Before powering on for the first time, clear the range of motion of the joints and verify that the physical emergency stop or the remote controller's emergency stop works.
- Keep the original packaging for at least 3 months if possible, for long-distance transport, repair returns, and storage. Power off the robot and remove the battery before transport.
