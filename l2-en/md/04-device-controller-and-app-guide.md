# Genisom L2 Operation and Safety

[Back to Documentation Overview](../index.md) | [First Use of Genisom L2](./11-first-use.md) | [Accessories and Components](./02-accessories.md) | [RoamerX Pro User Guide](./05-roamerx-pro-guide.md) | [Genisom L2 Maintenance, Storage, and Troubleshooting](./12-maintenance.md)

<a id="使用前检查"></a>

## Pre-Use Checks

- A robot battery level above 50% is recommended. Make sure the remote controller has sufficient charge.
- Check that the cameras, fill lights, and any installed LiDAR sensors are clean and unobstructed.
- Verify that the joints move freely, with no unusual noise, sticking, looseness, or cable interference.
- Confirm that the battery is locked in place and that the expansion compartment cover and protective caps for unused ports are in place.
- Check that the area is well lit and the ground is level. Verify that the narrowest passage, overhead clearance, and obstacle heights are within the robot's traversal limits.
- Verify that the remote controller's emergency stop is available. On the Genisom L2-W Ultra, confirm that the physical emergency stop has been reset.

::: warning Abnormal Operation and Overheating
Stop using the robot immediately if a joint is loose, the robot cannot stand normally, or it makes noticeably unusual sounds. Wait until the robot has stopped moving and is stable, then power it off and contact after-sales support for service.

At low battery levels, the robot may suddenly collapse because it cannot produce enough power. Check the remaining charge before starting a task. Extended continuous operation can overheat the joint motors. Schedule breaks to stop operation and let the joint motors cool. To prevent burns, avoid touching the metal surfaces of the joint motors.
:::

### Safe Distances and Operator Requirements

- The operator must be an adult who has read and understood the entire product manual. Keep the robot in sight during operation. Operators must stay at least 2 m from the robot, and bystanders at least 3 m away. Keep the travel path clear of people and pets for 5 m ahead of the robot.
- Never place children or pets on the robot, even when it is stationary. Keep children and pets away from the robot while it is operating.
- The remote controller has a communication range of about 100 m in open areas and about 20 m in areas with obstructions such as trees or walls. Shorten the operating distance as conditions require to avoid losing the connection.
- When the robot travels on stairs or slopes, stay clear of its path and any stairs, landings, or ramps below it. Slow down and avoid sharp turns on slopes or uneven ground. Avoid turning directly on steeper slopes.

## Operating Environment

The robot operates at temperatures from -20 to 55 °C. The recommended operating altitude is below 2,000 m. Avoid severe weather such as dense fog, thunderstorms, sandstorms, and strong winds, as well as smooth surfaces such as glass or ice.

Do not operate in areas with strong electromagnetic interference or strong interference from Wi-Fi or other 2.4 GHz signals. Operation is also prohibited near cliff edges, on unguarded elevated platforms, in areas with closely spaced steps, on wet or slippery surfaces, in areas with flammable or explosive materials, near rivers, lakes, swimming pools, or other bodies of water, and in environments with complex dust conditions.

The robot body has an IP66 rating for protection against dust and low-pressure water jets from any direction. Before operating in rain or splashing water, check that the body is undamaged, the expansion port covers are in place, and both the battery and its compartment are dry. Never immerse the robot or use it in standing water that rises above the underside of the body. Wipe the robot dry after use. Make sure the battery compartment and ports are dry before opening covers, charging, or continuing operation.

## Install the Battery

For instructions on inserting the battery and confirming it is locked in place, see [Install the Battery](./11-first-use.md#install-the-battery).

<a id="电量指示"></a>

### Battery Level Indicators

![Battery panel and battery level indicators](../assets/product/l2-battery-panel.png)

| LEDs | Battery Level or Status |
| --- | --- |
| All 4 solid | 75%–100% |
| First 3 solid | 50%–75% |
| First 2 solid | 25%–50% |
| LED 1 solid | 0%–25% |
| LED 1 flashing | 0% |
| All 4 light in sequence | Charging. All 4 stay on when fully charged. |

## Power On and Off

### Power On

See [Power On](./11-first-use.md#power-on) for the power button sequence and how to tell when startup is complete.

### Power Off

::: warning Before Powering Off
Never remove the battery or force the robot to shut down while it is moving. This can cause it to fall or damage the joint motors.
:::

1. Stop sending movement commands.
2. Use the remote controller or app to put the robot in the prone position in damping mode.
3. Wait for the robot to stabilize.
4. Press and hold the battery power button for 5 seconds and verify that the power indicator turns off.

<a id="遥控器"></a>

## Remote Controllers

The Genisom L2 and Genisom L2-W come with a screenless remote controller. The Genisom L2-W Ultra comes with a G12 remote controller with display.

<a id="无屏遥控器"></a>

### Screenless Remote Controller

![Parts and buttons on the screenless remote controller](../assets/product/l2-screenless-remote-diagram.png)

| Applicable Mode | Function | Control |
| --- | --- | --- |
| Movement mode | Move forward, backward, left, or right | Move the left joystick up, down, left, or right |
| Movement mode | Turn left or right | Move the right joystick left or right |
| Stationary mode | Tilt the body to the left or right | Move the right joystick left or right |
| Stationary mode | Pitch the body forward or backward | Push the right joystick up to pitch forward or down to pitch backward |
| Stationary mode | Rotate left or right in place | Press left or right on the directional pad |
| Stationary mode | Raise or lower the body | Press up or down on the directional pad |
| All modes | Stand up | Briefly press `Y` |
| All modes | Enter damping mode | Briefly press `A` |
| All modes | Enter crawl posture | Briefly press `X` |
| All modes | Turn the fill light on or off | Briefly press `B` |
| Movement mode | Jump upward | `LB + Y` |
| Movement mode | Jump forward | `LB + B` |
| All modes | Trigger or release the emergency stop | Briefly press `LB + RB` together |
| Stationary mode, movement mode | Switch between stationary and movement modes | Briefly press `START` |
| Stair mode | Toggle the stair-climbing posture | `LB + START` |
| Sand mode (wheeled-legged only) | Toggle the sand posture | `RB + START` |
| Movement mode | Cycle through low, medium, and high speed | Briefly press `BACK`. The controller vibrates 1, 2, or 3 times for low, medium, or high speed, respectively. |

Open the remote controller's battery compartment, install two AA (No. 5) batteries, and verify that they are seated securely.

::: warning Using the Screenless Remote Controller
- Keep the `D/X` selector in the `X` position. If the selector is moved accidentally, return it to `X` and restart the robot. Avoid pressing `MODE` or `VIB` unnecessarily, as this can affect button functions.
- After the remote controller disconnects or powers off, the robot may continue moving briefly or take time to stop. Keep a safe distance and watch the surroundings.
- Use upward and forward jumps only on the Genisom L2 or Genisom L2-W with no payload. Never jump while carrying a payload.
:::

### Remote Controller with Display

![Parts of the remote controller with display](../assets/product/l2-screen-remote-diagram.png)

| No. | Part | No. | Part |
| ---: | --- | ---: | --- |
| 1 | 2.4 GHz/5.8 GHz antenna | 11 | Control wheel G |
| 2 | C button | 12 | Three-position switch E |
| 3 | Left joystick | 13 | PPM output port |
| 4 | A button | 14 | Update port |
| 5 | Power button | 15 | Control wheel H |
| 6 | B button | 16 | Three-position switch F |
| 7 | Right joystick | 17 | Carrying handle |
| 8 | D button | 18 | Speaker |
| 9 | Touchscreen | 19 | Type-C charging port |
| 10 | Microphone | 20 | SIM card slot |

| Control | Function | Applicable Mode |
| --- | --- | --- |
| Move the left joystick | Move forward, backward, left, or right | Movement mode |
| Move the right joystick | Turn in place | Movement mode |
| Move both joysticks together | Steer while moving | Movement mode |
| Move the right joystick left or right | Tilt the body to the left or right | Stationary mode |
| Move the right joystick up or down | Pitch the body forward or backward | Stationary mode |
| Briefly press `C + D` together | Software emergency stop | All modes |
| Briefly press `A` | Turn the fill light on or off | All modes |
| Hold the power button for 3 seconds | Turn the remote controller on or off | All modes |

Fully charge the remote controller with display before first use. Connect it to power using the supplied Type-C data cable and original adapter. The charge indicators pulse while charging. The number of lit LEDs indicates the current charge. The indicators stay solid when charging is complete.

## Motion Modes

On the GenisDog home screen, tap the current mode at the top and select the desired mode from the list. To change modes and speed with the screenless controller, see [Screenless Remote Controller](#screenless-remote-controller).

![Mode selector at the top of the GenisDog home screen and the list of modes](../assets/operation/genisdog-motion-mode.png)

| Mode | Use |
| --- | --- |
| Stationary mode (原地模式) | Rotate or pitch the body, or adjust its height while staying in place |
| Movement mode (运动模式) | Move over level ground and typical uneven terrain |
| Stair mode (登阶模式) | Travel on stairs and over multiple steps |
| Follow mode (跟随模式) | Follow a moving target using UWB positioning signals |

In movement mode, tap the current speed level on the left side of the home screen and adjust it with the slider that opens.

![Speed level selector on the left side of the GenisDog home screen](../assets/operation/genisdog-speed-control.png)

![Expanded speed adjustment slider in GenisDog](../assets/operation/genisdog-speed-adjustment.png)

The following are the maximum speeds at each level with no payload.

| Speed Level | Maximum Speed | Scenario |
| --- | ---: | --- |
| Low | 1.0 m/s | Indoor use and practice for new operators |
| Medium | 2.0 m/s | Typical outdoor operation |
| High | Point-foot 3.0 m/s, wheeled-legged 3.7 m/s | Level, open areas clear of people |

When operating at high speed, choose an open area with no foot traffic to prevent collisions.

<a id="急停"></a>

## Emergency Stop

::: warning Releasing the Emergency Stop
Trigger the emergency stop immediately if the legs move erratically, the robot shakes violently, or similar abnormal behavior occurs. Resolve the fault and make sure nobody is near the joints before releasing the emergency stop.
:::

### Physical Emergency Stop

The Genisom L2-W Ultra has a physical emergency stop button on its body. Press it to stop motion immediately and bring the robot to a prone position. To reset the button, turn it in the direction of the arrow.

![Location of the physical emergency stop button on the robot](../assets/product/l2-hard-emergency-stop.png)

### Remote Controller Emergency Stop

The Genisom L2 and Genisom L2-W have no physical emergency stop on the body. Use the screenless remote controller to trigger an emergency stop on site.

- On the Genisom L2 and Genisom L2-W, briefly press `LB + RB` together on the screenless remote controller to trigger the emergency stop. Resolve the fault and make sure nobody is near the joints. Then briefly press `LB + RB` together again to release it.
- On the Genisom L2-W Ultra, briefly press `C + D` together on the remote controller with display to trigger the emergency stop.

![LB and RB emergency stop buttons on the screenless remote controller](../assets/product/l2-screenless-remote-emergency-stop.png)

![C and D software emergency stop buttons on the remote controller with display](../assets/product/l2-screen-remote-emergency-stop.png)

### SDK Software Emergency Stop {#软件急停}

Call [`SoftEmergencyStop(true)`](./07-02-robot-control.md#softemergencystop) to trigger a software emergency stop through the SDK. During on-site operation, verify that the emergency stop on the remote controller is available for your model. For the Genisom L2-W Ultra, also verify that the physical emergency stop is available.

## Status Indicator

| Color and Pattern | Status |
| --- | --- |
| Slow flashing white | Starting up |
| Solid white | Manual control or operating |
| Pulsing white | Standby |
| Slow flashing green | Localizing or returning automatically |
| Solid green | Running an automatic task |
| Fast flashing yellow | Warning |
| Solid yellow | Low battery |
| Fast flashing red | Fault |
| Solid red | Emergency stop |
| Solid blue | Updating |
| Pulsing | Charging on the optional charging dock |

![Location of the robot's status indicator](../assets/product/l2-status-light-location.png)

The Genisom L2-W Ultra has a separate indicator on its physical emergency stop button. The light is off when the physical emergency stop is not triggered and solid red while it is triggered.

## Connect the App

For instructions and screenshots covering GenisDog installation, Bluetooth, network setup, and first-time activation, see [First Use of Genisom L2](./11-first-use.md#install-genisdog).

<a id="切换连接方式"></a>

### Switching Connection Methods

On the app home screen, tap the **Settings** (设置) icon and open **Connection** (连接) or **Network Setup** (配网).

![Connection and network setup in GenisDog settings](../assets/operation/genisdog-connection-settings.png)

- To switch from Wi-Fi to AP, follow the prompts to disconnect from Wi-Fi, then connect to the robot's hotspot.
- To switch from AP to Wi-Fi, select Wi-Fi network setup and follow the prompts to enter the network information. The app switches automatically once the connection succeeds.

Keep the phone or remote controller with display close to the robot during network setup or switching to maintain the Bluetooth connection. For routine control, use the selected connection method. You can disconnect Bluetooth after setup and continue to control the robot. Keep the robot online for operations that require an internet connection, such as firmware updates. Button labels may vary by app version. Follow the labels on your screen.

### Take Photos and Record Videos

On the control screen, tap the camera icon on the right to take a photo or tap the video icon to record.

![Video and photo controls on the right side of the GenisDog control screen](../assets/operation/genisdog-photo-video.png)

To view your photos and videos, open **Album** (相册) in **Settings** (设置).

![Album in GenisDog settings](../assets/operation/genisdog-album.png)

### UWB Pairing and Follow Mode

1. Select **Follow Mode** (跟随模式) on the control screen.

   ![Follow Mode in the GenisDog mode selector](../assets/operation/genisdog-follow-mode.png)

2. If the app shows that UWB is disconnected, tap **Go to Pairing** (前往配对) and follow the prompts.

   ![Go to Pairing button displayed when UWB is disconnected](../assets/operation/genisdog-uwb-pairing-prompt.png)

3. Keep the UWB beacon within 3 m of the robot and tap **Start Pairing** (开始配对). Enable follow mode after pairing completes.

   ![UWB pairing screen with the 3 m distance requirement and Start Pairing button](../assets/operation/genisdog-uwb-pairing.png)

This feature is unavailable when the robot's battery level is below 20%. In follow mode, keep the robot in sight, watch its path, and be ready to trigger an emergency stop.

## Charging

### Battery and Power Safety

- Use an original battery that matches the device. Never disassemble the battery pack or draw power directly from its electrodes. Send used batteries to a qualified recycling provider.
- Use the adapter indoors only. Keep the battery charging base away from heat sources. If the power cord is damaged, stop using it. Replace it with the designated power cord or a dedicated component supplied by the manufacturer or its service department.
- If leaked electrolyte gets into your eyes, do not rub them. Rinse immediately with plenty of clean water and seek medical attention as soon as possible after rinsing.

<a id="电池离机充电"></a>

### Charging the Battery Outside the Robot

::: warning Charging Conditions and Equipment
Charge in a dry, well-ventilated area at 0 to 40 °C. Use an undamaged original battery charging base, adapter, and power cord. Never cover the charging base or battery or charge near flammable materials. Limit charging to 24 hours.

Avoid touching the adapter while it is hot during charging. If the battery gives off an unusual odor, smokes, deforms, or shows other signs of a malfunction, immediately disconnect charging power, stop using the battery, and contact after-sales support.
:::

1. Connect the power adapter to the battery charging base, then connect it to a 110 to 240 V AC power source.
2. Put the robot in the prone position in damping mode. Press and hold the battery power button for 5 seconds to turn it off.
3. Hold the battery pull strap and remove the battery.
4. Insert the battery into the charging base. The charge indicators light in sequence during charging. All 4 stay on when the battery is fully charged.
5. Once the battery is fully charged, disconnect AC power before removing it.

### Autonomous Recharging

With the optional charging dock installed, the Genisom L2-W Ultra can [use RoamerX Pro to configure a charging point and start autonomous recharging](./05-roamerx-pro-guide.md#autonomous-recharging-and-undocking). When starting a recharge through the SDK, check the charging point, dock connection status, and task status callbacks together to determine whether the task has completed. See [SDK Recharge and Undock Tasks](./09-control-ownership-tasks-and-peripherals.md#recharge-and-undock-tasks).

<a id="日常维护"></a>
<a id="存放"></a>
<a id="设备故障排查"></a>

See [Genisom L2 Maintenance, Storage, and Troubleshooting](./12-maintenance.md) for maintenance and troubleshooting.
