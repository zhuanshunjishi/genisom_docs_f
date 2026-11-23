# 传感器数据读取

[返回文档总览](../index.md)

下文列出参考配置的 ROS 2 话题，实际可用话题以设备的硬件配置和运行中的服务为准。

## 连接机器人并查看话题

1. 通过 Wi-Fi 或网线连接机器人，设置见[连接与流地址](./video-stream-reading.md#连接与流地址)。
2. 登录 Orin NX。登录信息见[算力主机 SSH 登录](./03-system-components-and-hardware-interfaces.md#算力主机-ssh-登录)。

   ```bash
   ssh robot@192.168.168.100
   ```

3. 登录后列出可用的 ROS 2 话题。

   ```bash
   ros2 topic list
   ```

## 激光雷达、IMU 和超声波

以下话题在 Orin NX 上读取。

| 数据 | ROS 2 话题 | 消息类型 |
| --- | --- | --- |
| 前置 Ariy 96 线激光雷达点云 | `/front_lidar` | `sensor_msgs::msg::PointCloud2` |
| 后置 Ariy 96 线激光雷达点云 | `/rear_lidar` | `sensor_msgs::msg::PointCloud2` |
| 前置激光雷达内置 IMU | `/front_lidar/imu` | `sensor_msgs::msg::Imu` |
| 后置激光雷达内置 IMU | `/rear_lidar/imu` | `sensor_msgs::msg::Imu` |
| 独立 IMU（Quectel_LUA300C(00)） | `/imu_driver/imu_central` | `sensor_msgs::msg::Imu` |
| 左侧超声波测距（DYP-A22） | `/uss_driver/uss_left/range` | `sensor_msgs::msg::Range` |
| 右侧超声波测距（DYP-A22） | `/uss_driver/uss_right/range` | `sensor_msgs::msg::Range` |

独立 IMU 话题是否可用取决于设备的硬件版本。可用 `ros2 topic echo` 查看话题数据，例如 `ros2 topic echo /front_lidar/imu`。

## RTK 定位与航向

在 Orin NX 上读取 LK1220D 的定位与航向数据。

```bash
ros2 topic echo /rtk_pvh
```

`/rtk_pvh` 包含 `heading` 和 `bestnav`。旧版驱动的兼容话题 `/uni_heading` 对应 `heading`，`/uni_best_nav` 对应 `bestnav`。可运行 `ros2 topic type /rtk_pvh` 查看实际消息类型。

### 解算状态与类型

**解算状态（`status`）**

对应字段为 `heading.sol_status`、`bestnav.p_sol_status` 和 `bestnav.v_sol_status`。

| 状态码 | 含义 |
| --- | --- |
| `0` | 已解出 |
| `1` | 观测量不足 |
| `2` | 未收敛 |
| `4` | 协方差矩阵的迹超过上限 |

**解算类型（`type`）**

对应字段为 `heading.heading_type`、`bestnav.pos_type` 和 `bestnav.vel_type`。

| 类型码 | 含义 |
| --- | --- |
| `0` | 不进行解算 |
| `16` | 单点定位 |
| `17` | 伪距差分定位 |
| `34` | 浮点解 |
| `50` | 整数解 |

### `heading` 字段

| 字段 | 说明 |
| --- | --- |
| `utc_time_s` | 航向数据的 UTC 时间，单位为秒 |
| `sol_status` | 航向解算状态 |
| `heading_type` | 航向解算类型 |
| `base_line` | 基线长度，范围 0 至 3000 m |
| `heading_deg` | 航向角，范围 0° 至 360° |
| `pitch_deg` | 俯仰角，范围 −90° 至 90° |
| `heading_std`、`pitch_std` | 航向角和俯仰角标准差，单位为度 |
| `svs_num`、`soln_svs_num` | 跟踪的卫星数和参与解算的卫星数 |

### `bestnav` 字段

| 字段 | 说明 |
| --- | --- |
| `utc_time_s` | 定位数据的 UTC 时间，单位为秒 |
| `p_sol_status`、`pos_type` | 位置解算状态和定位类型 |
| `latitude_deg`、`longitude_deg` | 纬度和经度，单位为度 |
| `altitude_m` | 海拔高度，单位为米 |
| `undulation` | 大地水准面与 WGS84 参考椭球面的差值，单位为米 |
| `lat_std`、`lon_std`、`hgt_std` | 纬度、经度和高度标准差，单位为米 |
| `diff_age_s`、`sol_age_s` | 差分龄期和解的龄期，单位为秒 |
| `svs_num`、`soln_svs_num` | 跟踪的卫星数和参与解算的卫星数 |
| `v_sol_status`、`vel_type` | 速度解算状态和速度解算类型 |
| `hor_spd` | 水平对地速度，单位为米每秒 |
| `trk_gnd` | 相对于真北的实际对地运动方向，单位为度 |
| `ver_spd` | 垂直速度，单位为米每秒。正值表示向上，负值表示向下 |
| `ver_spd_std`、`hor_spd_std` | 垂直和水平速度标准差，参考配置未填充这两个字段 |

## 相机数据

参考配置使用 RK3588 提供的 IMX415 前后相机数据，分辨率为 1920 × 1080（1080p）。

| 数据 | ROS 2 话题 |
| --- | --- |
| 前置相机压缩图像 | `/front_camera/image_compressed` |
| 后置相机压缩图像 | `/rear_camera/image_compressed` |

在能发现这些话题的 ROS 2 环境中，可用 `ros2 topic type /front_camera/image_compressed` 查看实际消息类型。通过 Wi-Fi、G20 遥控器通道或网线播放 RTSP 视频，见[视频流读取](./video-stream-reading.md)。
