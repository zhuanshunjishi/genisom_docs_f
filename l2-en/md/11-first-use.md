# Genisom L2 First Use

[Documentation Overview](../index.md) | [Accessories and Components](./02-accessories.md) | [Genisom L2 Operation and Safety](./04-device-controller-and-app-guide.md)

This page covers unpacking, battery installation, power-on, network setup, and first-time activation in GenisDog for L2, L2-W, and L2-W Ultra. The screenshots come from the product user manual V1.3 (32080071-A1). Use the button labels in the current app.

## Unpack and Position the Robot

1. Set the box on level ground and open it. Use two people if possible. Confirm the robot is off, support its body with both hands, and lift it out slowly while keeping it level.
2. Set the robot down in a natural prone position on a flat, clean surface free of sharp protrusions. Tuck all four legs in symmetrically. Avoid placing the robot upside down, on its side, or with its weight loading the legs in an unnatural direction.
3. Leave at least 1 m of clearance around the robot for startup. Keep people and objects clear of its path. Check accessories and equipment condition against [Package Contents](./02-accessories.md#package-contents) and [Arrival Inspection](./02-accessories.md#arrival-inspection).

![Unpacking Genisom L2, with red markings showing which joints to avoid while carrying the robot](../assets/first-use/l2-unpacking.png)

::: warning Carrying and Pinch Points
Support the body while carrying the robot. Do not lift it by the legs, wheels, cameras, LiDAR, or connectors. Keep hands and clothing clear of the hip and knee joints. If you need to adjust a leg, move it only slightly in the joint's normal direction of travel. Never force a joint against its travel limit.
:::

![Left, pinch points at the hips and knees. Right, the robot in its natural prone position.](../assets/first-use/l2-safe-placement.png)

## Install the Battery

1. Make sure the robot is off and in its natural prone position.
2. Hold the battery pull strap and insert the battery in the direction marked on the battery and battery compartment.
3. Push the battery all the way in until you hear the latch click. Check that the battery sits flush with the robot body and that the pull strap is secure.

![Genisom L2 battery installation location, with the battery on the side of the robot highlighted in red](../assets/first-use/l2-battery-installation.png)

## Power On

1. Confirm the robot is in its natural prone position with at least 1 m of clearance around the body. Keep people and objects out of its path. Before first operation, read [Pre-Use Checks](./04-device-controller-and-app-guide.md#pre-use-checks) and [Emergency Stop](./04-device-controller-and-app-guide.md#emergency-stop).
2. Briefly press the battery power button once to check that the charge is sufficient. A charge above 50% is recommended for first use. If the battery is low, follow the [off-robot charging steps](./04-device-controller-and-app-guide.md#charging-the-battery-outside-the-robot) before continuing.
3. Press and hold the battery power button for 5 seconds. The power indicator lights up when you release the button.
4. Wait for the robot's status indicator to turn solid white, indicating that startup is complete.

![Power button and battery level indicators on the battery panel](../assets/product/l2-battery-panel.png)

## Install GenisDog

- **Genisom L2 and Genisom L2-W** come with a screenless remote controller. Scan the QR code with an Android phone or open the [GenisDog download page](https://p1iscu6mj28.feishu.cn/drive/folder/VlZffrW1il5Capdvy7yc4Sg7nqg?from=from_copylink). Install the app and use it on your phone to connect the robot to a network and activate it.
- **Genisom L2-W Ultra** comes with a G12 remote controller with a display and GenisDog preinstalled. Set up the network and activate the robot directly on the controller.
- Before first activation, have the name and password of an internet-connected Wi-Fi network or a working data SIM card ready.

![QR code for downloading GenisDog for Android](../assets/first-use/genisdog-download-qr.png)

## Connect via Bluetooth

1. Make sure the robot is on. Turn on Bluetooth on your phone or remote controller with a display and stay near the robot while connecting.
2. Open GenisDog, read and accept the privacy policy, and tap **Go to Connect (去连接)** to scan for nearby devices.
3. Select your robot from the list, such as `L2_123456`, and tap **Connect (连接)**.

![Privacy policy displayed when GenisDog first opens](../assets/first-use/genisdog-privacy.png)

![GenisDog Bluetooth device list for selecting your Genisom L2](../assets/first-use/genisdog-bluetooth.png)

## Choose a Connection Method

### Wi-Fi Setup

To connect the robot to the internet for activation or an update, select **Wi-Fi Connection (Wi-Fi 连接)**. Select the router's Wi-Fi network from the list, enter the password, and tap **Next (下一步)**. Wait for the robot to connect.

![GenisDog Wi-Fi setup screen with network selection and password entry](../assets/first-use/genisdog-wifi-setup.png)

### Direct AP Connection

For close-range control, select **Direct AP Connection (AP 直连)**. Choose the robot's hotspot from the list, enter its password, and tap **Connect (连接)**. If the robot has no internet connection through a data SIM card, follow the prompts to complete Wi-Fi setup before first activation.

![GenisDog direct AP connection screen with robot hotspot selection and password entry](../assets/first-use/genisdog-ap-connect.png)

## Activate the Robot for the First Time

1. Once connected, the app checks activation status automatically. For an already activated robot, go directly to the main control screen.
2. When activating for the first time, make sure the robot is connected to the internet over Wi-Fi or through a data SIM card. Follow the app prompts to synchronize the robot's clock with your phone or remote controller with a display.
3. The robot restarts automatically after synchronization. Wait for it to power on, then reconnect as prompted in the app.
4. Tap **Confirm Activation (确认激活)**. When **Activation Complete (激活完成)** appears, go to the main control screen.

![GenisDog activation completion screen with a button to open the home screen](../assets/first-use/genisdog-activation-complete.png)

For Bluetooth, Wi-Fi, or activation issues, see [Device Troubleshooting](./12-maintenance.md#device-troubleshooting). During regular operation, you can [switch connection methods](./04-device-controller-and-app-guide.md#switching-connection-methods) in the app.
