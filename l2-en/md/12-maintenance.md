# Genisom L2 Routine Maintenance, Storage, and Troubleshooting

[Documentation Overview](../index.md) | [Genisom L2 Operation and Safety](./04-device-controller-and-app-guide.md)

## Routine Maintenance

Power off the robot before cleaning or servicing it. Unplug the battery charging base before cleaning it. Do not rinse the equipment with water or clean it with corrosive solvents such as alcohol or disinfectants.

- Wipe the body, fill light, and charging contacts with a soft, dry cloth.
- Clean the stereo and fisheye camera lenses with a lens cloth or an air blower. Gently wipe the LiDAR in one direction with a lens cloth to avoid scratching its optical window.
- Clean joint gaps with a soft brush. Do not spray liquids or oils onto the joints. Contact after-sales support for maintenance if a joint makes an unusual noise.

![Routine cleaning locations, with cameras, the fill light, and LiDAR marked in red](../assets/operation/l2-sensor-cleaning.png)

| Interval | Checks and Maintenance |
| --- | --- |
| Before each use | Check the body and leg linkages, joints, foot pads or tires, fasteners, wire harnesses, and connector covers. Check that the battery is free of swelling and leaks, the terminals are clean, and the battery is fully latched. Check video transmission. Test from within 10 m to verify a stable remote control signal and prompt response. Check that the robot moves smoothly and makes no unusual noises. Recharge the battery if it is below 20%. |
| Weekly | Clean the body, the areas around the sensors, and gaps around the joints. Remove debris wrapped around the tires. Check joint movement, screws, and cables for binding, unusual noise, looseness, or wear. |
| Monthly | Remove dust from internal gaps and inspect the tires and leg-to-body connections. Inspect the battery case and bottom terminals. Follow the user manual to discharge the battery to 30% and then recharge it to 60%. |

- Replace the Genisom L2 foot pads promptly if they become worn or damaged, or if the feet make noticeably more noise when they strike the ground. For wheeled-legged models, replace the tires promptly if they come off, become heavily worn, or lose their tread.
- After the robot travels through water, power it off and wipe the body dry. You can dry the bearing areas with a hair dryer on its low-temperature setting. Check that the robot is dry before resuming operation.

## Storage

Before storage, clean the surfaces of the robot, remote controller, battery, and battery charging base. Keep liquids out of connectors and vents. Check that all components are undamaged and work correctly.

If you plan to leave the robot unused for more than 30 days, power it off, remove the battery, and place the robot in its dedicated packaging box, keeping it in its natural prone position. Charge the battery to 50%–60% and keep the terminals away from metal objects. Turn off the remote controller and put it in its protective case. Store the charger separately. Store the equipment in a dry, well-ventilated place at -20 to 60 °C, away from strong magnetic fields and sources of heavy vibration. Do not stack heavy objects on the box.

- For 1 to 3 months of storage, check the equipment for damage and check the battery level monthly. If the battery drops below 40%, charge it to 50%–60%. Charge it at least once every 3 months during storage.
- For more than 3 months of storage, discharge the battery to 30% and recharge it to 60% every month. Every 2 months, power on and run the robot for 5 to 10 minutes. Check that the remote controller and charger work every 3 months.
- Monitor the storage temperature and humidity, and replace spent desiccant promptly. Record the storage start date, the date of each inspection, and any maintenance performed.
- After moving the equipment out of storage into a significantly different temperature, allow it to reach ambient temperature before powering on to avoid condensation.

## Device Troubleshooting

| Problem | Checks and Resolution |
| --- | --- |
| Robot fails to start or shuts down immediately after startup | Briefly press the battery power button to check the charge. With the robot off, reinstall the battery and check that it sits flush with the body and the pull strap is secure. Wipe the metal contacts on the battery and robot with a dry cloth. |
| Remote controller does not respond | Verify that the robot started normally and check the emergency stop status. Resolve the fault that triggered the emergency stop before releasing it. If the emergency stop is released and control still fails, restart the robot. |
| App cannot find the robot | Confirm the robot is on and Bluetooth is enabled on the phone or remote controller with a display. Move closer and scan again. If the robot is still missing from the list, restart it and retry. |
| Bluetooth connection fails | Move closer to the robot. In the device list, make sure you selected your robot and its name starts with `L2`. If it still fails to connect, restart the robot and retry. |
| Wi-Fi password is incorrect or the connection fails | Re-enter the correct password. If the connection still fails, try a different network or retry later. |
| Activation fails or times out | Verify that the robot has internet access. Set up the network again and retry activation. |
| Voice features are unavailable on Genisom L2-W Ultra | Enable voice features in Settings. |

If the issue persists, save relevant data and record the symptoms before contacting after-sales support. For SDK integration issues, see [Examples and Troubleshooting](./10-examples-and-troubleshooting.md).
