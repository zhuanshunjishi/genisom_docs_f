# RoamerX Pro User Guide for Genisom L2

[Back to Documentation Overview](../index.md) | [Genisom L2 Operation and Safety](./04-device-controller-and-app-guide.md) | [Genisom L2 Charging Dock and Tasks](./07-04-dock-and-tasks.md)

## Features

RoamerX Pro is available only on the Genisom L2-W Ultra. It provides visual mapping, localization, map editing, route network planning, cruise tasks, autonomous obstacle avoidance, autonomous recharging, and cruise history.

```text
Network setup
  → Mapping
  → Map and route network editing
  → Cruise route configuration
  → Task dispatch
  → Cruise monitoring
  → Task completion or autonomous recharging
```

## Operating Requirements

| Item | Requirement |
| --- | --- |
| Environment | Structured indoor or outdoor environment on a single level |
| Ground surface | Hard, level surfaces such as concrete, asphalt, carpet, or matte tile |
| Distance covered during mapping | Less than 1 km per map |
| Mapping speed | About 0.6 m/s recommended, no more than 1 m/s |
| Cruise speed | No more than 1 m/s, with 0.6 m/s recommended for Security Patrol |
| Passage width | More than the robot body width plus 60 cm |
| App connection range | A Wi-Fi connection distance within about 10 m is recommended |
| Outdoor illuminance | At least 10,000 lux recommended |
| Light rain | Less than 2.5 mm/h, with no standing water |
| Snow cover | No more than 5 mm deep |

Glass walls, long corridors with few distinguishing features, highly reflective floors, successive steps, and large numbers of people moving around can reduce the reliability of mapping, localization, and obstacle avoidance.

## Network Setup

Before first use, follow [First Use of Genisom L2](./11-first-use.md#install-genisdog) to configure the network in GenisDog and activate the robot.

1. Power on the robot and the remote controller with display.
2. Connect to the robot's hotspot.
3. Open RoamerX Pro and go to **Settings** (设置).
4. Select the Genisom L2 device type.
5. Close and reopen the app.
6. Verify that the home screen shows the video stream, then test forward, backward, left, and right movement at low speed.

![RoamerX Pro network setup and home screen](../assets/navigation/navigation-setup-ui.png)

## App Interface

| Area | Function |
| --- | --- |
| Map display | Shows the mapping trajectory, 2D map, robot position, and cruise trajectory |
| Live video window | Shows video from the front of the robot for a first-person view |
| Control area | Manual movement, emergency stop, pause, and task controls |
| Map module | Map management, route network editing, and path management |

![RoamerX Pro app interface](../assets/navigation/navigation-app-main-ui.png)

## Mapping

### Before Mapping

- Inspect the site, plan a loop, and open any doors the route passes through.
- Remove temporary clutter and minimize pedestrian traffic and the presence of large moving objects.
- Choose a starting point with plenty of distinct environmental features. Keep the robot stationary and standing.
- Stand within 3 m of the robot on either side. Keep clear of the areas directly in front of and behind it.
- Leave RTK off during mapping.

### Create a Map

1. Tap **MAP** on the control panel.
2. Open **Map Management** (地图管理) and tap **New Map** (新建地图).
3. Once the battery level and environmental conditions meet the requirements, tap **Start Mapping** (开始建图).
4. Use the virtual joysticks to drive smoothly at about 0.6 m/s.
5. Follow the planned loop. Return near the starting point and retrace at least 15 m of the original route.
6. End mapping as the distance traveled approaches 1 km.
7. Wait for the map to save successfully before opening the map editor.

Each robot can store up to 5 maps. For larger areas, map one section at a time. Keep the distance traveled within 300 m per section and close the loop in each section.

## Edit Maps

Use the map editor to remove noise and set no-go zones. Mark gullies, glass curtain walls, cliff edges, and impassable areas as no-go zones. Keep real obstacles on the map.

![Map management and map editing screens](../assets/navigation/navigation-map-management-ui.png)

## Edit the Route Network

### Add Route Network Points

- With the remote controller, move the robot to each physical location before adding a point for greater accuracy.
- For quick planning, add points directly on the map.

Keep route network points outside obstacles and no-go zones, with safe clearance from walls and obstacles.

![Adding a route network point using the remote controller](../assets/navigation/navigation-road-point-ui.png)

![Adding route network points directly on the map](../assets/navigation/navigation-road-line-ui.png)

### Add Links

Links define the routes the robot can take. Every segment must lie in an area the robot can traverse. Keep the network connected as a closed loop or a continuous end-to-end path. After saving the route network, use **Path Management** (路径管理) to review existing task routes.

![Editing links in the route network](../assets/navigation/navigation-path-edit-ui.png)

## Path Management

1. Select a map with a completed route network.
2. Tap **New Cruise Route** (新建巡航任务路径) and add the target points in sequence.
3. Adjust the order of the target points to suit the task.
4. Set each target point as an **Action Point** (作业点) or **Waypoint** (途经点).
5. Mark areas with temporary obstacles as temporary no-go zones.
6. Save the route and check every link.

At action points, the robot performs actions such as taking photos. Waypoints only constrain the robot's path.

![Editing target points for a cruise task](../assets/navigation/navigation-mapping-ui.png)

![Selecting a cruise route](../assets/navigation/navigation-path-select-ui.png)

## Start a Cruise Task

::: warning Cruise Monitoring and Emergency Stop
Continuously monitor the robot's position, trajectory, and target point status during a cruise. Use the pause, resume, and end controls to manage the task. Trigger the emergency stop immediately if the robot loses localization, obstacle avoidance behaves abnormally, or anyone enters the path.
:::

1. In **Path Management** (路径管理), tap **Start Task** (发起任务).
2. Enter the **Task Name** (任务名称) and select the **Cruise Route** (巡航路线).
3. Choose whether to use the route network under **Use Route Network** (是否使用路网).
4. Set the **Return Battery Level** (返航电量) for automatic recharging at low battery.
5. Under **After the Cruise** (巡航结束后执行), choose what the robot should do when the task ends. It can wait in place, return to the starting point, or return to charge.
6. Review the settings and tap **Confirm** (确认执行) to dispatch the task.

![Start Task in Path Management](../assets/navigation/navigation-task-entry-ui.png)

![Cruise task configuration](../assets/navigation/navigation-task-config-ui.png)

## Obstacle Avoidance Limits

| Item | Condition |
| --- | --- |
| Static obstacles | Forward field of view of about 115°, height and width both greater than 30 cm, reflectivity at least 10% |
| Moving obstacles | Within the forward field of view of about 115°, obstacle avoidance applies to pedestrians and to vehicles or two-wheeled vehicles traveling at up to 1.5 m/s. |
| Clearance to go around obstacles | More than the robot body width plus 60 cm |
| Forward blind zone | About 30 cm in front of the LiDAR sensor |

If there is insufficient space, the robot brakes to a stop and waits. Watch closely for fast-moving vehicles, low objects, transparent objects, highly reflective objects, and obstacles that enter the close-range blind zone.

<a id="自主回充与出桩"></a>

## Autonomous Recharging and Undocking

Install the optional charging dock before using autonomous recharging and undocking in RoamerX Pro. To start these tasks through the SDK, see [Recharge and Undock Tasks](./07-04-dock-and-tasks.md#recharge-and-undock-tasks).

### Configure a Charging Point

Complete [Charging Dock Pairing](./07-04-dock-and-tasks.md#charging-dock-pairing) first.

1. Add a target point in the route network editor.
2. Select the target point and tap **Mark Charging Dock** (标记充电桩).
3. Set the heading of the charging point so it faces the physical charging dock directly.
4. Save the map and route network configuration.

![Marking a target point as a charging point](../assets/navigation/navigation-recharge-ui.png)

### Automatic Recharging

Select **Return to Charging Dock** (返回充电桩) in the task settings. When the cruise ends, the robot returns to the charging point and docks. Check both the task status and the dock connection status.

### Automatic Undocking

If the robot is on the charging dock when it receives a new cruise task, it undocks first and starts the cruise once undocking is complete.

## Cruise History

Cruise history lists previous tasks by date. Review each task's run time, route, target point results, and status to evaluate the run or troubleshoot on site.

![Cruise history list](../assets/navigation/navigation-records-ui.png)

## Troubleshooting

### Initial Localization Fails

- Move the robot back near the original mapping trajectory.
- Align the robot with its initial heading during mapping, within ±15°.
- Position the robot within 2 m of the original mapping path.
- Clean the LiDAR sensors and cameras. Clear people blocking the sensors before trying localization again.

### Localization Is Lost During a Cruise

- Check whether a payload, cables, or people are obstructing the front or rear LiDAR sensors.
- Slow down and return to an area with distinct environmental features.
- Check for large areas of noise in the map or changes to the site layout.
- If localization cannot be restored, end the task, switch to manual control, and move the robot to a safe location.

### The Robot Cannot Go Around an Obstacle

- Check that the available passage width meets the requirement of the robot body width plus 60 cm.
- Check whether the obstacle is too low, transparent, highly reflective, or within the LiDAR sensor's close-range blind zone.
- Set a temporary no-go zone or replan the route network.

### Recharging Fails

- Check the charging dock's Bluetooth connection and power supply.
- Check the position and heading of the charging point on the map.
- Clear the route in front of the charging dock and the docking area.
- Check the task status, error code, and dock connection status.
