# M1 operation and maintenance

[Back to the documentation overview](../index.md) | [Product introduction and specifications](./01-product-introduction-and-specifications.md) | [System components, hardware interfaces, and mechanical design](./03-system-components-and-hardware-interfaces.md)

## Before use

### Standard package contents

![Standard M1 package contents](../assets/product/m1-package-contents.png)

After unpacking, verify that the package contains the robot, G20 remote controller, two batteries, power cable, charging dock, aviation connector cable kit, flight case, operating manual, packing list, certificate of conformity, and maintenance tools and accessories. If you find visible damage, missing items, or bent connectors, leave the equipment powered off and do not charge it.

### Operating environment

- Complete operator training and read the operating manual and warnings before use.
- Operating temperature: −20 °C to 55 °C.
- Charge at 0 °C to 50 °C in a dry, ventilated area away from flammable materials.
- Clear people, cables, and obstacles before operating the robot.
- When operating on stairs, slopes, or raised platforms, stay clear of the route and avoid standing directly above or below the robot.
- Keep the robot in sight during operation. Maintain at least 2 m of clearance when it is stationary and at least 3 m when it moves or performs a task.
- Do not power on or operate the robot in explosive, corrosive, or dusty environments.
- IP67 protection has limits for prolonged submersion. Keep the connector covers, battery compartments, and housing intact and dry.

### Pre-start checks

1. Inspect the body, bumpers, leg links, and wheel assemblies for cracks, deformation, loose parts, or excessive wear.
2. Inspect the battery housing, terminals, and latches for swelling, leaks, damage, excessive heat, or debris.
3. Remove protective films and obstructions from the LiDAR, cameras, and ultrasonic sensors.
4. Check that each battery housing is flush with the robot and that its pull strap does not swing freely.
5. Make sure the physical emergency stop is released.
6. Lay the robot flat with its belly on the ground and its legs resting naturally on either side.
7. Verify that the remote controller is charged and near the robot.

## Startup and basic operation

### Battery installation and startup

The M1 has two removable batteries. It can run on one or both batteries and supports hot-swapping.

#### Install the batteries

1. Make sure the battery connector and compartment are free of dust, moisture, and debris.
2. Align the connector and slide the battery in along the guides.
3. Push the battery all the way in, release the pull strap, and listen for the latch to click.
4. Verify that the battery housing is flush with the body and that the pull strap does not swing freely.

#### Power on the robot

1. Briefly press the battery button to wake the battery and check its charge.
2. Hold the button for about 3 seconds to power on the battery and start the robot.
3. The status light flashes white during startup and stays solid white when startup is complete.
4. The robot enters general motion mode after startup.

Either battery can wake the other. Do not use a battery that is deformed, leaking, overheating, or has damaged terminals. Do not disassemble, strike, crush, puncture, or short-circuit the batteries.

### G20 remote controller

![G20 remote controller layout](../assets/product/m1-remote-controller-diagram.png)

#### Connect and start

1. Place the controller near the robot and clear people and obstacles from the surrounding area.
2. Power on the robot and wait for it to finish starting up.
3. Hold the controller's power button for about 3 seconds. The controller and robot are paired at the factory and connect automatically after startup.
4. `GenisDog` App, enter the control interface and confirm the equipment connection and state of health.

#### Keys and Interfaces

| Number | Keys or Interfaces | Number | Keys or Interfaces |
| ---: | --- | ---: | --- |
| ① | 2.4 G / 5.8 G antenna | ⑬ | Squeeze button |
| ② | Undefined | ⑭ | Remote control power beacons |
| ③ | Back to key | ⑮ | Facing frequency indicators |
| ④ | Left swing. | ⑯ | B2 Keys |
| ⑤ | H key | ⑰ | SIM Cartons |
| ⑥ | L1 Keys | ⑱ | B1 Keys |
| ⑦ | L2 Keys | ⑲ | Wave |
| ⑧ | The microphone. | ⑳ | Lighting button |
| ⑨ | R2 Keys | ㉑ | Hanging rope. |
| ⑩ | R1 Keys | ㉒ | Type-C Interface |
| ⑪ | Power Key | ㉓ | USB Interface |
| ⑫ | Right swing. | ㉔ | Shoot / Video button |

#### Common Operations

| Action | Functions |
| --- | --- |
| Back to key | Back to Previous Page |
| Left swing. | Control the movement of robots around and around. |
| Right swing. | Control the in-situ bends, right-and-right probes and downsides. |
| `H` + Right Rock Up and Down | Align your heights. |
| `H` + Right swing around | Turning over at execution level |
| `L1` + `R1` | Switch the tail of the machine. |
| `L2` + `R2` | Toggle knee joints. |
| Squeeze button | Stop Current Motion |
| Lighting button | Cyclical Switching Light Group |
| Shoot key point press | Take a picture. |
| Hold the capture button for 3 seconds | Start recording |
| Press the filming button again during the video | Stop Video |

### Motion Mode

**Stationary mode:** The robot stays in place while you adjust body rotation, pitch, and height.

**Motion mode:** The robot can travel over complex terrain and perform stunts supported by its configuration.

**Cruise mode:** After mapping the area, the robot can follow waypoints and perform tasks on the map.

Motion mode typically provides low, medium, and high speed settings. At higher speeds, combinations such as sideways movement and turning in place may be limited.

### Status lights

![Locations of the M1 status lights](../assets/product/m1-status-light-locations.png)

| Color | Pattern | Robot state |
| --- | --- | --- |
| White | Slow flash | Starting up |
| White | Solid | Manual control or operating |
| White | Pulsing | Standby |
| Green | Slow flash | Localizing or returning automatically |
| Green | Solid | Running an autonomous task |
| Yellow | Fast flash | Warning |
| Yellow | Solid | Low battery |
| Red | Fast flash | Fault |
| Red | Solid | Software emergency stop |
| Blue | Solid | Updating |
| Any color | Pulsing | Charging |

If the status light shows red or yellow, stop movement and check the app for emergency stop, faults, and battery level. After clearing the emergency stop or resolving the fault, confirm that the status light returns to normal.

### Safe operation

- Medium and high speed settings limit combined actions such as sideways movement and turning in place. Do not bypass these restrictions.
- The robot can reach 6 m/s. Keep it well away from people when operating at high speed.
- When climbing onto a raised platform, operate without a payload, verify that the battery indicator shows at least two bars, and maintain more than 2 m of clearance from nearby people.

## Safety and protection

### Physical emergency stop

Press the red physical emergency stop button on the robot's back if it goes out of control, develops a serious fault, or someone enters the danger area. The red light stays on and the robot slowly lies down and remains still. Once you have identified the cause and verified that the area is safe, turn the button clockwise to release it.

### Software emergency stop

Press the controller's software emergency stop button to stop the current action. The app shows a notification. Once the area is safe, clear the software emergency stop in the app. Keep the physical emergency stop available even when using the app or remote controller's stop function.

### Overheating protection

If a joint, the main controller, or the battery overheats, the robot stops moving, lies down automatically, and remains still. Check the affected component and temperature in the app. Once the temperature returns to normal, check the robot state and fault notifications.

### Low-battery protection

A low-battery warning appears when both batteries fall below 20%. When both fall below 10%, the robot automatically lies down and stops responding to motion commands. Replace or recharge the batteries before using it again.

### Fall protection

After a fall, the robot may try to stand up. Keep at least 2 m clear for recovery. Trigger the physical emergency stop before attempting to drag a fallen robot.

## Battery replacement, shutdown, and charging

### Hot-swapping a battery

1. Confirm that the robot is stable and nobody is within reach of the legs.
2. With both batteries supplying power, remove the one you want to replace.
3. Insert a charged battery into the empty compartment and confirm the latch is locked.
4. Check both battery statuses and the charge readings in the app.

### Shutdown

1. Use the controller app to make the robot lie flat.
2. Confirm that the legs are resting on the ground and the robot is stable.
3. Hold the power button on the side of the battery for 3 seconds until its indicator turns off.
4. Before removing the batteries, verify that the robot is fully powered off.

Do not disconnect the only powered battery while the robot is standing.

### Dual-battery charging dock

| Parameter | Value |
| --- | --- |
| Input voltage | AC 220 V |
| Output voltage | DC 63 V |
| Maximum charge current | 10 A |
| Charging bays | 2 |
| Charging environment | 0 °C to 50 °C, dry, ventilated, flat, hard surface |

1. Stop and power off the robot before removing the batteries.
2. Place the batteries and charging equipment on a flat, hard surface in a dry, ventilated area at 0 °C to 50 °C. Keep them off flammable surfaces such as carpets and sofas.
3. Keep flammable materials such as paper, cloth, and alcohol at least 1 m away. Keep the batteries and charging equipment away from open flames and heat sources.
4. Connect the dock to 220 V AC power and turn on its power switch.
5. Align the battery with the connector in the charging bay, insert it, and verify that the charging indicators work normally.
6. Charge one or both batteries for no more than 2 hours. Never exceed 6 hours of charging under any circumstances.
7. When all charger indicators are solid, disconnect the charger from the batteries within 30 minutes and switch off the dock.

Use only the original charger and dock. Do not use third-party chargers or nonstandard power supplies, and avoid leaving batteries plugged in to overcharge.

### Responding to faults

- If water enters the robot, turn it off immediately, remove the batteries, and dry the equipment.
- If the equipment smokes or catches fire, use a carbon dioxide or dry powder extinguisher. Do not use a foam extinguisher.
- If a leg swings unexpectedly or movement becomes uncontrolled, trigger the software emergency stop first. Use the physical emergency stop if the software stop is ineffective. Once the robot is still, turn it off, remove the batteries, and leave it powered off until the fault is resolved.

## Daily maintenance

Power off the robot before maintenance. After use, wipe the body, cameras, and LiDAR with a clean, dry, soft cloth. Do not use alcohol, disinfectant, or other corrosive liquids.

| Frequency | Inspection and maintenance |
| --- | --- |
| Before each use, about 5 minutes | Check the body and leg links for deformation and cracks, the joint and foot screws for tightness, and the tires for detachment or severe wear. Inspect the batteries for swelling, leaks, terminal debris, and proper seating. Recharge below 20%. Test joint motion, video transmission, sensors, and the remote control signal within 10 m. |
| Weekly, about 20 minutes | Clean the body, cameras, LiDAR, sensor gaps, and joints. Remove anything tangled around the tires. After water exposure, dry the bearings with cool airflow. Check for sticking joints, unusual noise, loose screws, and cable wear. |
| Monthly, about 30 minutes | Check for firmware updates and follow the prompts. Keep the battery at or above 50% and maintain power throughout the update. Remove dust from gaps in the body and check the fasteners on the tires, legs, and torso. Discharge the batteries to 30%, recharge them to 60%, and inspect their housings and terminals. |

Use original parts when replacing tires, batteries, or other components. If a joint jams, a sensor fails, a battery behaves abnormally, or wiring is damaged, stop using the robot and contact technical support. Leave disassembly to service personnel.
