# Reading video streams

[Documentation overview](../index.md)

The M1 front and rear cameras provide RTSP streams. Choose the URL for your network connection and open it in VLC.

## Connections and stream URLs

- **Wi-Fi:** Connect to the robot's `M1-xxxxxxx` hotspot. The factory password is `12345678`.
- **Ethernet:** Connect the development computer to the robot's Ethernet port. Set the computer's IPv4 address to the same subnet, for example `192.168.168.12/24`.

| Connection | Front camera | Rear camera |
| --- | --- | --- |
| Wi-Fi | `rtsp://192.168.234.1:8554/front` | `rtsp://192.168.234.1:8554/back` |
| G20 remote controller link | `rtsp://192.168.144.144:8554/front` | `rtsp://192.168.144.144:8554/back` |
| Ethernet | `rtsp://192.168.168.168:8554/front` | `rtsp://192.168.168.168:8554/back` |

## Play with VLC

1. In VLC, choose **Media**, then **Open Network Stream**.
2. Enter the camera's RTSP URL on the **Network** tab.
3. Select **Play** and verify that the selected camera feed appears.

### Front camera over Wi-Fi

![Playing the front camera stream in VLC](../assets/sdk/m1-vlc-front.png)

### Rear camera over Wi-Fi

![Playing the rear camera stream in VLC](../assets/sdk/m1-vlc-back.png)

If playback fails, check the connection type, target IP, and stream path (`/front` or `/back`). See the [camera bitrate API](./06-05-peripherals-and-camera.md#camera-bitrate) for bitrate configuration.
