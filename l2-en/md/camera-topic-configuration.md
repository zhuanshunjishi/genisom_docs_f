# Genisom L2 Camera Nodes and Topic Configuration

[Back to Documentation Overview](../index.md) | [Peripheral and Camera APIs](./07-05-peripherals-and-camera.md)

These settings apply to the Genisom L2-W Ultra. Topics marked **Surround-view only** are available only on units equipped with surround-view cameras.

| Image | Image Format | Resolution (Pixels) | Topic | Notes |
| --- | --- | --- | --- | --- |
| Front stereo camera, left lens | NV12 | 1920 × 1080 | `/front_stereo_camera/left/nv12` |  |
| Front stereo camera, stitched | NV12 | 3840 × 1080 | `/front_stereo_camera/nv12` |  |
| Front stereo camera, left lens | RGB | 1920 × 1080 | `/front_stereo_camera/left/rgb` |  |
| Panoramic image | NV12 | 1920 × 1080 | `/surround_camera/stitched/nv12` | Surround-view only |
| Surround view, front lens | JPEG | 1920 × 1536 | `/surround_camera/front/compressed` | Surround-view only |
| Surround view, rear lens | JPEG | 1920 × 1536 | `/surround_camera/rear/compressed` | Surround-view only |
| Surround view, left lens | JPEG | 1920 × 1536 | `/surround_camera/left/compressed` | Surround-view only |
| Surround view, right lens | JPEG | 1920 × 1536 | `/surround_camera/right/compressed` | Surround-view only |
| Front stereo camera, stitched | JPEG | 3840 × 1080 | `/front_stereo_camera/compressed` |  |
| Front stereo camera, left lens | JPEG | 1920 × 1080 | `/front_stereo_camera/left/compressed` |  |
