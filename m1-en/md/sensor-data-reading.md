# Reading Sensor Data

[Documentation overview](../index.md)

The ROS 2 topics listed here are for the reference configuration. Available topics depend on the hardware and running services on your robot.

## Connect to the Robot and Check Services

1. Connect to the robot over Wi-Fi or Ethernet. See [Connections and Stream URLs](./video-stream-reading.md#connections-and-stream-urls) for network settings. You can also reach the Orin NX over the RK3588 Wi-Fi connection through its built-in network bridge.
2. Sign in to the Orin NX. See [SSH Access to the Compute Host](./03-system-components-and-hardware-interfaces.md#ssh-access-to-the-compute-host) for credentials.

   ```bash
   ssh robot@192.168.168.100
   ```

3. Check the system version and service status, then list the available ROS 2 topics.

   ```bash
   cat /opt/release/version.yaml
   robot-launch list
   ros2 topic list
   ```

   In the process list, `perception-seg` handles perception and `robot-forward` communicates with the RK3588.

## LiDAR, IMU, and Ultrasonic Sensors

Read the following topics on the Orin NX.

| Data | ROS 2 topic | Message type |
| --- | --- | --- |
| Front Ariy 96-channel LiDAR point cloud | `/front_lidar` | `sensor_msgs::msg::PointCloud2` |
| Rear Ariy 96-channel LiDAR point cloud | `/rear_lidar` | `sensor_msgs::msg::PointCloud2` |
| Front LiDAR IMU | `/front_lidar/imu` | `sensor_msgs::msg::Imu` |
| Rear LiDAR IMU | `/rear_lidar/imu` | `sensor_msgs::msg::Imu` |
| Standalone IMU (Quectel_LUA300C(00)) | `/imu_driver/imu_central` | `sensor_msgs::msg::Imu` |
| Left ultrasonic range (DYP-A22) | `/uss_driver/uss_left/range` | `sensor_msgs::msg::Range` |
| Right ultrasonic range (DYP-A22) | `/uss_driver/uss_right/range` | `sensor_msgs::msg::Range` |

Availability of the standalone IMU topic depends on the hardware revision. Use `ros2 topic echo` to view messages, for example `ros2 topic echo /front_lidar/imu`.

## RTK Positioning and Heading

Read positioning and heading data from the LK1220D on the Orin NX.

```bash
ros2 topic echo /rtk_pvh
```

The `/rtk_pvh` topic contains `heading` and `bestnav`. For compatibility with older drivers, `/uni_heading` corresponds to `heading` and `/uni_best_nav` corresponds to `bestnav`. Run `ros2 topic type /rtk_pvh` to check the message type.

### Solution Status and Type

| Status value | Meaning |
| --- | --- |
| `0` | Solution computed |
| `1` | Insufficient observations |
| `2` | Solution has yet to converge |
| `4` | The covariance matrix trace exceeds the limit (> 1000 m, using the unit in the reference material) |

| Type value | Meaning |
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

In the reference configuration, the RK3588 provides data from the front and rear IMX415 cameras at 1920 × 1080 (1080p).

| Data | ROS 2 topic |
| --- | --- |
| Front camera compressed image | `/front_camera/image_compressed` |
| Rear camera compressed image | `/rear_camera/image_compressed` |

In a ROS 2 environment that can discover the camera topics, run `ros2 topic type /front_camera/image_compressed` to check the message type. To play RTSP video over Wi-Fi, the G20 remote controller link, or Ethernet, see [Reading Video Streams](./video-stream-reading.md).
