# 传感器数据读取

[返回文档总览](../index.md)

下文列出参考配置的 ROS 2 话题，实际可用话题以设备的硬件配置和运行中的服务为准。

## 连接机器人并查看话题

1. 通过 Wi-Fi 或网线连接机器人，设置见[连接与流地址](./video-stream-reading.md#连接与流地址)。
2. 登录 Orin NX。登录信息见[算力主机 SSH 登录](./03-system-components-and-hardware-interfaces.md#算力主机-ssh-登录)。

   ```bash
   ssh robot@192.168.168.100
   ```

3. 登录后列出可用的 ROS 2 话题及其消息类型。

   ```bash
   ros2 topic list -t
   ```

### 从开发电脑查看 ROS 2 话题

在开发电脑上安装 ROS 2 Humble 和 `rmw_zenoh_cpp`，再通过网线或 Wi-Fi 接入机器人网络。

1. **终端 1：连接机器人的 Zenoh 路由器**

   `robot_router` 是机器人 Orin NX 的路由地址。按设备的路由配置填写，启动后保持此终端运行。

   ```bash
   source /opt/ros/humble/setup.bash
   robot_router='tcp/192.168.168.100:7447'
   export ZENOH_CONFIG_OVERRIDE="connect/endpoints=[\"${robot_router}\"]"
   ros2 run rmw_zenoh_cpp rmw_zenohd
   ```

2. **终端 2：列出话题和消息类型**

   `ROS_DOMAIN_ID` 需与机器人 `/opt/runtime/env.bash` 中的设置一致。参考配置使用 `24`。

   ```bash
   source /opt/ros/humble/setup.bash
   export RMW_IMPLEMENTATION=rmw_zenoh_cpp
   export ROS_DOMAIN_ID=24
   ros2 topic list -t
   ```

在终端 2 使用 `ros2 topic echo <话题名>` 读取数据。读取 RTK 等自定义消息前，先在开发电脑上加载对应的消息包。[Zenoh 多机配置参考](https://github.com/ros2/rmw_zenoh/tree/humble#connecting-multiple-hosts)

## 激光雷达、IMU 和超声波

可在 Orin NX 上读取下列话题。

| 数据 | ROS 2 话题 | 消息类型 |
| --- | --- | --- |
| 前置 Ariy 96 线激光雷达点云 | `/front_lidar` | `sensor_msgs/msg/PointCloud2` |
| 后置 Ariy 96 线激光雷达点云 | `/rear_lidar` | `sensor_msgs/msg/PointCloud2` |
| 前置激光雷达内置 IMU | `/front_lidar/imu` | `sensor_msgs/msg/Imu` |
| 后置激光雷达内置 IMU | `/rear_lidar/imu` | `sensor_msgs/msg/Imu` |
| Orin NX 侧独立 IMU | `/imu_driver/imu_central` | `sensor_msgs/msg/Imu` |
| RK3588 运控板 IMU | `/imu_shm_publisher/imu_central` | `sensor_msgs/msg/Imu` |
| 左侧超声波测距（DYP-A22） | `/uss_driver/uss_left/range` | `sensor_msgs/msg/Range` |
| 右侧超声波测距（DYP-A22） | `/uss_driver/uss_right/range` | `sensor_msgs/msg/Range` |

前后雷达点云包含 `x`、`y`、`z`、`intensity`、`ring`、`timestamp`。解析点云时，以收到的消息中的 `fields`、`point_step` 和 `row_step` 为准。

独立 IMU 话题是否可用取决于设备的硬件版本。可用 `ros2 topic echo` 查看话题数据，例如 `ros2 topic echo /front_lidar/imu`。

读取超声波测距结果时，查看消息的 `range` 字段。以下命令读取一条左侧测距值。

```bash
ros2 topic echo --once /uss_driver/uss_left/range --field range
```

## RTK 定位与航向

在 Orin NX 上读取 LK1220D 的定位与航向数据。订阅前，先加载包含 `robots_dog_msgs` 消息包的 ROS 2 环境。

| ROS 2 话题 | 消息类型 | 数据内容 |
| --- | --- | --- |
| `/rtk_pvh` | `robots_dog_msgs/msg/UniRtkPvh` | `heading` 和 `bestnav` |
| `/uni_heading` | `robots_dog_msgs/msg/UniHeading` | 对应 `heading` 的旧版兼容话题 |
| `/uni_best_nav` | `robots_dog_msgs/msg/UniBestNav` | 对应 `bestnav` 的旧版兼容话题 |

```bash
ros2 interface show robots_dog_msgs/msg/UniRtkPvh
ros2 topic echo --once /rtk_pvh
```

如果第一条命令提示 `Unknown package 'robots_dog_msgs'`，请检查当前终端是否已加载该消息包所在的 ROS 2 工作区。

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

参考配置的 IMX415 前后相机数据由 RK3588 提供。

| 数据 | ROS 2 话题 | 消息类型 |
| --- | --- | --- |
| 前置相机原始图像 | `/front_camera/image` | `sensor_msgs/msg/Image` |
| 后置相机原始图像 | `/rear_camera/image` | `sensor_msgs/msg/Image` |
| 前置相机压缩图像 | `/front_camera/image_compressed` | `sensor_msgs/msg/CompressedImage` |
| 后置相机压缩图像 | `/rear_camera/image_compressed` | `sensor_msgs/msg/CompressedImage` |

在能发现这些话题的 ROS 2 环境中，可用 `ros2 topic type /front_camera/image_compressed` 查看实际消息类型。通过 Wi-Fi、G20 遥控器通道或网线播放 RTSP 视频，见[视频流读取](./video-stream-reading.md)。
