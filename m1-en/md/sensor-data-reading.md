# Reading Sensor Data

[Documentation overview](../index.md)

The ROS 2 topics listed here are for the reference configuration. Available topics depend on the hardware and running services on your robot.

For coordinates relative to the body origin, see [Sensor Mounting Positions](./03-system-components-and-hardware-interfaces.md#sensor-mounting-positions).

## Connect to the Robot and List Topics

1. Connect to the robot over Wi-Fi or Ethernet. See [Connections and Stream URLs](./video-stream-reading.md#connections-and-stream-urls) for network settings.

   When connected through the robot's Wi-Fi hotspot, add the following route on your Linux development computer. The hotspot and the Orin NX are on different subnets. This route sends traffic for `192.168.168.0/24` through the hotspot gateway at `192.168.234.1` so your computer can reach the Orin NX at `192.168.168.100`.

   ```bash
   sudo ip route add 192.168.168.0/24 via 192.168.234.1
   ```

2. Sign in to the Orin NX. See [SSH Access to the Compute Host](./03-system-components-and-hardware-interfaces.md#ssh-access-to-the-compute-host) for credentials.

   ```bash
   ssh robot@192.168.168.100
   ```

3. After signing in, list the available ROS 2 topics and their message types.

   ```bash
   ros2 topic list -t
   ```

### List ROS 2 Topics from a Development Computer

Install ROS 2 Humble and `rmw_zenoh_cpp` on the development computer, then connect it to the robot network over Ethernet or Wi-Fi. If you use the robot's Wi-Fi hotspot, first add the route described in [Connect to the Robot and List Topics](#connect-to-the-robot-and-list-topics).

1. **Terminal 1 — Connect to the Robot's Zenoh Router**

   Set `robot_router` to the Zenoh router endpoint on the Orin NX. The reference endpoint is `tcp/192.168.168.100:7447`. Adjust the endpoint to match your robot's router configuration and leave this terminal running after starting the router.

   ```bash
   source /opt/ros/humble/setup.bash
   robot_router='tcp/192.168.168.100:7447'
   export ZENOH_CONFIG_OVERRIDE="connect/endpoints=[\"${robot_router}\"]"
   ros2 run rmw_zenoh_cpp rmw_zenohd
   ```

2. **Terminal 2 — List Topics and Message Types**

   Set `ROS_DOMAIN_ID` to the value in the robot's `/opt/runtime/env.bash`. The reference configuration uses `24`.

   ```bash
   source /opt/ros/humble/setup.bash
   export RMW_IMPLEMENTATION=rmw_zenoh_cpp
   export ROS_DOMAIN_ID=24
   ros2 topic list -t
   ```

Run `ros2 topic echo <topic>` in Terminal 2 to read messages. For custom messages such as RTK data, first load the corresponding message package on the development computer. [Zenoh Multi-Host Configuration](https://github.com/ros2/rmw_zenoh/tree/humble#connecting-multiple-hosts)

## LiDAR, IMU, and Ultrasonic Sensors

| LiDAR | Default Device IP Address |
| --- | --- |
| Front LiDAR | `192.168.1.200` |
| Rear LiDAR | `192.168.2.200` |

::: tip LiDAR Data and Device Information
To read raw LiDAR data directly on the Orin NX, use RoboSense's `rs_driver`. Select online LiDAR mode and the `RSAIRY` model. Use each LiDAR's configured destination address and UDP ports to receive packets and decode them into point clouds. The device IP addresses above are the packet source addresses. Use RoboSense's `rslidar_sdk` if you need to publish the decoded point clouds to ROS 2. [Online LiDAR Decoding Guide](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/08_how_to_decode_online_lidar.md) · [RoboSense ROS 2 SDK](https://github.com/RoboSense-LiDAR/rslidar_sdk)

On a computer that can reach the LiDAR subnet, open the device IP address in a browser to view device information and operating status in the web interface. [Airy User Manual](https://robosense-robotics.github.io/product-manual/en/Airy/)
:::

You can read the following topics on the Orin NX.

| Data | ROS 2 topic | Message type |
| --- | --- | --- |
| Front Airy 96-channel LiDAR point cloud | `/front_lidar` | `sensor_msgs/msg/PointCloud2` |
| Rear Airy 96-channel LiDAR point cloud | `/rear_lidar` | `sensor_msgs/msg/PointCloud2` |
| Front LiDAR IMU | `/front_lidar/imu` | `sensor_msgs/msg/Imu` |
| Rear LiDAR IMU | `/rear_lidar/imu` | `sensor_msgs/msg/Imu` |
| Orin NX standalone IMU | `/imu_driver/imu_central` | `sensor_msgs/msg/Imu` |
| RK3588 motion control board IMU | `/imu_shm_publisher/imu_central` | `sensor_msgs/msg/Imu` |
| Left ultrasonic range (DYP-A22) | `/uss_driver/uss_left/range` | `sensor_msgs/msg/Range` |
| Right ultrasonic range (DYP-A22) | `/uss_driver/uss_right/range` | `sensor_msgs/msg/Range` |

The front and rear LiDAR point clouds in the ROS 2 topics contain `x`, `y`, `z`, `intensity`, `ring`, and `timestamp`. When parsing a point cloud, use `fields`, `point_step`, and `row_step` from the received message.

Availability of the standalone IMU topic depends on the hardware revision. Use `ros2 topic echo` to view messages, for example `ros2 topic echo /front_lidar/imu`.

Use the `range` field for the ultrasonic distance reading. The following command reads one value from the left sensor.

```bash
ros2 topic echo --once /uss_driver/uss_left/range --field range
```

## RTK Positioning and Heading

Read positioning and heading data from the LK1220D on the Orin NX. Before subscribing, load the ROS 2 environment that provides the `robots_dog_msgs` message package.

| ROS 2 topic | Message type | Contents |
| --- | --- | --- |
| `/rtk_pvh` | `robots_dog_msgs/msg/UniRtkPvh` | `heading` and `bestnav` |
| `/uni_heading` | `robots_dog_msgs/msg/UniHeading` | Legacy topic corresponding to `heading` |
| `/uni_best_nav` | `robots_dog_msgs/msg/UniBestNav` | Legacy topic corresponding to `bestnav` |

```bash
ros2 interface show robots_dog_msgs/msg/UniRtkPvh
ros2 topic echo --once /rtk_pvh
```

If the first command returns `Unknown package 'robots_dog_msgs'`, check that the ROS 2 workspace containing the package is loaded in the current terminal.

### Solution Status and Type

**Solution Status (`status`)**

The corresponding fields are `heading.sol_status`, `bestnav.p_sol_status`, and `bestnav.v_sol_status`.

| Status Code | Meaning |
| --- | --- |
| `0` | Solution computed |
| `1` | Insufficient observations |
| `2` | Solution has yet to converge |
| `4` | The covariance matrix trace exceeds the limit |

**Solution Type (`type`)**

The corresponding fields are `heading.heading_type`, `bestnav.pos_type`, and `bestnav.vel_type`.

| Type Code | Meaning |
| --- | --- |
| `0` | Solution computation disabled |
| `16` | Single-point positioning |
| `17` | Pseudorange differential positioning |
| `34` | Float solution |
| `50` | Integer solution |

### `heading` Fields

| Field | Description |
| --- | --- |
| `utc_time_s` | UTC time of the heading data, in seconds |
| `sol_status` | Heading solution status |
| `heading_type` | Heading solution type |
| `base_line` | Baseline length, 0 to 3000 m |
| `heading_deg` | Heading angle, 0° to 360° |
| `pitch_deg` | Pitch angle, −90° to 90° |
| `heading_std`, `pitch_std` | Heading and pitch standard deviations, in degrees |
| `svs_num`, `soln_svs_num` | Number of satellites tracked and number used in the solution |

### `bestnav` Fields

| Field | Description |
| --- | --- |
| `utc_time_s` | UTC time of the position data, in seconds |
| `p_sol_status`, `pos_type` | Position solution status and type |
| `latitude_deg`, `longitude_deg` | Latitude and longitude, in degrees |
| `altitude_m` | Altitude above sea level, in meters |
| `undulation` | Difference between the geoid and the WGS84 reference ellipsoid, in meters |
| `lat_std`, `lon_std`, `hgt_std` | Latitude, longitude, and height standard deviations, in meters |
| `diff_age_s`, `sol_age_s` | Differential age and solution age, in seconds |
| `svs_num`, `soln_svs_num` | Number of satellites tracked and number used in the solution |
| `v_sol_status`, `vel_type` | Velocity solution status and type |
| `hor_spd` | Horizontal ground speed, in meters per second |
| `trk_gnd` | Actual course over ground relative to true north, in degrees |
| `ver_spd` | Vertical speed, in meters per second. Positive values indicate upward motion and negative values indicate downward motion |
| `ver_spd_std`, `hor_spd_std` | Vertical and horizontal speed standard deviations. These fields are unpopulated in the reference configuration |

## Camera Data

In the reference configuration, the RK3588 provides data from the front and rear IMX415 cameras.

| Data | ROS 2 topic | Message type |
| --- | --- | --- |
| Front camera raw image | `/front_camera/image` | `sensor_msgs/msg/Image` |
| Rear camera raw image | `/rear_camera/image` | `sensor_msgs/msg/Image` |
| Front camera compressed image | `/front_camera/image_compressed` | `sensor_msgs/msg/CompressedImage` |
| Rear camera compressed image | `/rear_camera/image_compressed` | `sensor_msgs/msg/CompressedImage` |

In a ROS 2 environment that can discover the camera topics, run `ros2 topic type /front_camera/image_compressed` to check the message type. To play RTSP video over Wi-Fi, the G20 remote controller link, or Ethernet, see [Reading Video Streams](./video-stream-reading.md).
