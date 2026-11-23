# Reading Sensor Data

[Documentation overview](../index.md)

The ROS 2 topics listed here are for the reference configuration. Available topics depend on the hardware and running services on your robot.

## Connect to the Robot and List Topics

1. Connect to the robot over Wi-Fi or Ethernet. See [Connections and Stream URLs](./video-stream-reading.md#connections-and-stream-urls) for network settings.
2. Sign in to the Orin NX. See [SSH Access to the Compute Host](./03-system-components-and-hardware-interfaces.md#ssh-access-to-the-compute-host) for credentials.

   ```bash
   ssh robot@192.168.168.100
   ```

3. After signing in, list the available ROS 2 topics and their message types.

   ```bash
   ros2 topic list -t
   ```

## LiDAR, IMU, and Ultrasonic Sensors

Read the following topics on the Orin NX.

| Data | ROS 2 topic | Message type |
| --- | --- | --- |
| Front Ariy 96-channel LiDAR point cloud | `/front_lidar` | `sensor_msgs/msg/PointCloud2` |
| Rear Ariy 96-channel LiDAR point cloud | `/rear_lidar` | `sensor_msgs/msg/PointCloud2` |
| Front LiDAR IMU | `/front_lidar/imu` | `sensor_msgs/msg/Imu` |
| Rear LiDAR IMU | `/rear_lidar/imu` | `sensor_msgs/msg/Imu` |
| Standalone IMU (Quectel_LUA300C(00)) | `/imu_driver/imu_central` | `sensor_msgs/msg/Imu` |
| Left ultrasonic range (DYP-A22) | `/uss_driver/uss_left/range` | `sensor_msgs/msg/Range` |
| Right ultrasonic range (DYP-A22) | `/uss_driver/uss_right/range` | `sensor_msgs/msg/Range` |

The front and rear point clouds contain `x`, `y`, `z`, `intensity`, `ring`, and `timestamp`. When parsing a point cloud, use `fields`, `point_step`, and `row_step` from the received message.

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
