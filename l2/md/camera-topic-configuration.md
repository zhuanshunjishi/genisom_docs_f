# L2 相机节点与 Topic 配置

[返回文档总览](../index.md) | [外设与相机接口](./07-05-peripherals-and-camera.md)

以下配置适用于L2-W Ultra。表中标注“环视特有”的 Topic 仅适用于配备环视相机的设备。

| 图像 | 图像格式 | 分辨率（像素） | Topic | 备注 |
| --- | --- | --- | --- | --- |
| 前双目 · 左目 | NV12 | 1920 × 1080 | `/front_stereo_camera/left/nv12` |  |
| 前双目 · 拼接 | NV12 | 3840 × 1080 | `/front_stereo_camera/nv12` |  |
| 前双目 · 左目 | RGB | 1920 × 1080 | `/front_stereo_camera/left/rgb` |  |
| 全景图 | NV12 | 1920 × 1080 | `/surround_camera/stitched/nv12` | 环视特有 |
| 环视 · 前目 | JPEG | 1920 × 1536 | `/surround_camera/front/compressed` | 环视特有 |
| 环视 · 后目 | JPEG | 1920 × 1536 | `/surround_camera/rear/compressed` | 环视特有 |
| 环视 · 左目 | JPEG | 1920 × 1536 | `/surround_camera/left/compressed` | 环视特有 |
| 环视 · 右目 | JPEG | 1920 × 1536 | `/surround_camera/right/compressed` | 环视特有 |
| 前双目 · 拼接 | JPEG | 3840 × 1080 | `/front_stereo_camera/compressed` |  |
| 前双目 · 左目 | JPEG | 1920 × 1080 | `/front_stereo_camera/left/compressed` |  |
