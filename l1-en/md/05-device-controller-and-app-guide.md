# Robot, controller, and app operation

[Back to Home](../index.md)

## Safety

### Pre-test checks

- Test on a flat, non-slip surface in an open area. Clear people, cables, and fragile objects from the area.
- Check that the legs, tires or foot pads, battery, expansion equipment, and cables are secure.
- Make sure the battery is sufficiently charged and the operator knows how to trigger an emergency stop and switch to damping mode using the controller.
- Limit the first test to reading the robot state, standing up, lying down, and making small movements.
- If the software stops responding, have someone on site take over using physical controls.

`CMD_EMERGENCY_STOP` triggers a software emergency stop. Keep the remote controller available for on-site takeover during tests.

### Motion and stunt risks

- Keep people clear and use appropriate safeguards when testing jumps, backflips, two-legged stances, or similar actions.
- High-performance mode and stunt commands increase joint loads. Prolonged use may accelerate wear.
- Stay within normal limits for payload, slope, and stair height. Published maximum values describe the robot's capability limits.
- Stop operation and disconnect power immediately if you notice unusual noise, odor, smoke, loss of control, a flashing red light, or excessive joint temperature.

### Tail-light indicators

| Tail light | Meaning | Action |
| --- | --- | --- |
| Solid blue | Startup complete | Connect and check the robot state |
| Flashing blue | Starting up | Wait for startup to finish before sending motion commands |
| Solid white | High-performance mode | Maintain a safe distance and operate with care |
| Solid green | Tracking mode active | Verify the target and confirm the area is safe |
| Solid yellow | Battery below 20% | End high-load operations and prepare to charge |
| Flashing yellow | Battery below 5% | Stop movement immediately and charge |
| Solid red | Joint temperature too high | Shut down, allow the robot to cool, and check the load |
| Flashing red | System fault | Stop using the robot and contact support |

![Tail-light indicators](../assets/images/tail-light-status.png)

### Battery and charging

- Do not disassemble the battery or connect directly to its individual cells.
- Use only official batteries, charging docks, and power adapters.
- Do not clean the adapter with alcohol or any other flammable solvent.
- If battery fluid gets into your eyes, do not rub them. Immediately rinse with clean water and seek medical care.
- If you notice an unusual odor, smoke, deformation, or abnormal heat during charging, unplug the adapter immediately and stop using it.
- Charge the battery for no more than 24 hours. Do not burn, heat, crush, or cut the battery.

### Operating environment and connectors

- The operating temperature is 0–40 °C and the ingress protection rating is IP54. Keep the robot out of standing water and do not immerse it.
- Verify voltage, polarity, and total power before connecting a payload. Power off the robot before plugging or unplugging connectors.
- Keep loose cables clear of moving legs and wheel hubs.

## Power on, charge, and power off

### Power button location

Insert the battery into the compartment on the side of the robot. The power button is in the center of the battery panel. The four LEDs below it show the remaining charge.

![Power button, battery compartment, and charge indicators](../assets/images/power-battery-panel.png)

### First startup

1. Unpack the robot and place it on a flat, non-slip surface in an open area.
2. Check that there are no people, cables, or obstacles near the legs.
3. Insert the battery fully into the compartment and verify that it is seated.
4. Briefly press the battery power button once.
5. Then press and hold the power button for 5 seconds.
6. Release the button and wait about 20 seconds.
7. A solid blue tail light indicates startup is complete. While it flashes blue, wait before sending motion commands.

### Battery charge indicator

| Charge level | LED status |
| --- | --- |
| 0–14% | LED1 flashes |
| 15–24% | LED1 stays on |
| 25–49% | LED1 and LED2 stay on |
| 50–74% | LED1 through LED3 stay on |
| 75–100% | LED1 through LED4 stay on |

While charging, the LED for the current range flashes. All four LEDs stay on when charging is complete.

### Charging

1. Make sure the robot has stopped moving, then remove the battery.
2. Connect the charging cable to the port on the bottom of the charging dock.
3. Verify that the connection is secure, then plug the power adapter into 100–240 V AC mains.
4. Place the battery in the charging dock. Charging starts when the indicator lights up.
5. When charging is complete, disconnect mains power before removing the battery.

![Battery LEDs, adapter status, and charging sequence](../assets/images/charging-guide.png)

### Shutdown

1. Use the controller or the program to stop movement and bring the robot to a stable prone position.
2. Confirm that the legs have stopped moving before approaching the robot.
3. Briefly press the battery power button once, then hold it for 5 seconds to shut down. Wait for the tail light and battery indicators to go out.
4. Remove the battery before long-term storage or transport.

## Remote controller with display

The controller has physical joysticks, directional and function buttons, and a touchscreen app. Use it for on-site takeover, basic motion tests, state checks, and video. Before developing with the SDK, verify that the robot can power on, connect, stand up, and lie down using the controller.

![Buttons and power switch on the remote controller](../assets/images/screen-controller.png)

### Power on and open the control app

1. Hold the power or screen-lock button at the top of the controller until it starts.
2. Open `Dog Controller` from the home screen.
3. Leave the joysticks and motion buttons alone while the app shows **Disconnected** in the upper-right corner.

![Remote control application entrance and home page](../assets/images/controller-app-entry.png)

### Connect to the robot {#connect-to-the-robot}

1. Verify that the robot is powered on and its tail light is solid blue.
2. Tap **Disconnected** in the upper-right corner of the app home page.
3. Select the robot's hotspot on the WLAN page and enter the password. For the first connection, see the [default hotspot name and password](#connect-to-robot-wi-fi).
4. Return to the app. A connected status or hotspot name in the upper-right corner confirms the connection.

![Click "Unconnected" on the top right corner and select robot hotspots on the WLAN page](../assets/images/controller-wifi-connect.png)

![Controller connected](../assets/images/controller-connected.png)

### Basic control

Tap **Control** in the lower-right corner of the home page to open the control screen. After connecting, you can do the following.

- Use the on-screen motion buttons or physical buttons to switch to damping, standing, prone, locked, or stationary mode.
- Use the physical or virtual joysticks to move, turn, and adjust the robot's posture.
- Start at low speed. Verify the movement direction before switching to medium or high speed.
- Press the red **Emergency Stop** button to stop movement immediately if something goes wrong. Identify and correct the cause before resuming high-speed movement.

![Remote control base interface](../assets/images/controller-control-screen.png)

### Standard and high-performance modes

- **Standard mode** provides stable movement and standard actions for routine operation and pre-development checks.
- **High-performance mode** increases motion performance and unlocks additional stunts on supported models. Use it in controlled research or demonstration settings.

## Connect to the robot over Wi-Fi {#connect-to-robot-wi-fi}

### 1. Join the hotspot in Ubuntu

The default Wi-Fi network name is typically `XG01-XXXXXX`, where `XXXXXX` is the last six characters of the device serial number (SN). Find the serial number on the label underneath the robot. The default password is `12345678`.

Select the robot's hotspot from the development computer's Wi-Fi networks and enter the password.

![Select Robot in Ubuntu Wi-Fi](../assets/images/wifi-network.png)

### 2. Check the development computer's IPv4 address

After connecting to the hotspot, perform the following commands at the terminal to view the IPv4 address of the wireless card:

```bash
ip addr
```

![View IPv4 addresses for developing computers](../assets/images/ip-address.png)

### 3. Check connectivity to the robot

The robot's default Wi-Fi address is `192.168.234.1`. Run the following command in the terminal.

```bash
ping -c 4 192.168.234.1
```

![Ping, robot works.](../assets/images/ping-success.png)

A successful `ping` verifies IP reachability. Use `IsConnected()` to verify that the SDK connection has received UDP state data.

## SSH login

Use SSH to access the robot's Linux system from the development computer for status checks and troubleshooting. You can also run the HighLevel examples directly on an external Ubuntu computer.

![SSH connection from the development computer over the robot's Wi-Fi](../assets/images/ssh-via-wifi.png)

```bash
ssh firefly@192.168.234.1
```

Enter `yes` when prompted on the first connection. If the robot still uses the factory account, the password is typically `firefly`.

To exit the remote shell, run the following command.

```bash
exit
```

![Successful SSH login](../assets/images/ssh-login.png)
