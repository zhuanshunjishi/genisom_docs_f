# Onboard Camera Stream

[Back to Home](../index.md) | [Instructions for equipment operation, remote control and App](./05-device-controller-and-app-guide.md) | [SDK Guidance for development and operation](./08-sdk-development-guide.md)

## Video Stream Information

L1 The body camera provides H.264 video streams by RTSP. The following default address with authentication information can be used to draw images after developing equipment to connect the robot network.

```text
rtsp://user:Abcd%232027%21@192.168.234.1:8554/test
```

| Item | Default |
| --- | --- |
| Agreements | RTSP |
| Robot IP | `192.168.234.1` |
| Port | `8554` |
| Flow Path | `/test` |
| Video encoding | H.264 |

If the robot IP has been modified, the address `192.168.234.1` shall be replaced by the current actual IP.

### Account Authentication

Player prompts to enter account numbers and passwords with the following default certificates.

| Item | Value |
| --- | --- |
| Username | `user` |
| Password | `Abcd#2027!` |

The password in the default address has been executed URL Encoding, where `#` Encoding As `%23`,  `!` Encoding As `%21`. Enter the original password in the above table in the independent password input box of the player.

## Preparation for Use

1. Turn the robot on and wait for the launch to be completed.
2. Opens the Video Stream Switch and saves settings on the settings page that the screen remote control application applies.
3. Connecting pull devices to robotic networks.
4. Confirms that robots IP can access:

```bash
ping -c 4 192.168.234.1
```

5. Confirms that this firewall or network strategy does not prevent RTSP connections.

Video stream and HighLevel control use different ports. The ability to run SDK Demo does not mean RTSP will certainly play; likewise, the ability to see images does not mean that the SDK control connection has been established.

## Play with FFplay

### Install FFmpeg

```bash
sudo apt update
sudo apt install -y ffmpeg
```

### Play Video Stream

```bash
ffplay -rtsp_transport tcp \
  -fflags nobuffer \
  -flags low_delay \
  -framedrop \
  -strict experimental \
  -probesize 32 \
  -analyzeduration 0 \
  -sync ext \
  'rtsp://user:Abcd%232027%21@192.168.234.1:8554/test'
```

The command uses TCP transmissions and displays delay by reducing detection and buffer reduction. Press `q` to quit playing.

## Play with GStreamer

### Install GStreamer

```bash
sudo apt update
sudo apt install -y \
  gstreamer1.0-tools \
  gstreamer1.0-plugins-base \
  gstreamer1.0-plugins-good \
  gstreamer1.0-plugins-bad \
  gstreamer1.0-plugins-ugly \
  gstreamer1.0-libav
```

### Play Video Stream

```bash
gst-launch-1.0 \
  rtspsrc location='rtsp://user:Abcd%232027%21@192.168.234.1:8554/test' latency=0 \
  ! rtph264depay \
  ! h264parse \
  ! avdec_h264 \
  ! videoconvert \
  ! videoscale \
  ! video/x-raw,width=1280,height=720 \
  ! autovideosink
```

Pipes are completed sequentially RTSP Receiving, Receiving H.264 RTP Unpack, decode, decode, colour conversion and image display. At end of period, press at terminal `Ctrl+C`.

## Play with VLC

1. Open VLC.
2. Select Media > Open Network Stream.
3. Enter the default RTSP address at the beginning of this document.
4. Click Play.

VLC The actual delay and compatibility is affected by the version and cache settings. When it is not possible to open or delay significantly, priority is given to the FFplay or GStreamer authentication of the video stream.

## Read with Open CV

### Installation Dependence

```bash
sudo apt update
sudo apt install -y python3-opencv
```

### Python Example

```python
import os
import time

import cv2


RTSP_URL = "rtsp://user:Abcd%232027%21@192.168.234.1:8554/test"


def open_stream(url):
    os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"
    capture = cv2.VideoCapture(url, cv2.CAP_FFMPEG)
    capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    return capture


def main():
    capture = open_stream(RTSP_URL)

    try:
        while True:
            if not capture.isOpened():
                print("Unable to open the video stream. Retrying in 1 second.")
                capture.release()
                time.sleep(1)
                capture = open_stream(RTSP_URL)
                continue

            ok, frame = capture.read()
            if not ok:
                print("Video stream interrupted. Reconnecting in 1 second.")
                capture.release()
                time.sleep(1)
                capture = open_stream(RTSP_URL)
                continue

            cv2.imshow("L1 RTSP Stream", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        capture.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
```

After running the script, press `q` to exit. `CAP_PROP_BUFFERSIZE` Validity depends on the current Open CV and FFmpeg backends; in case of cumulative video delay, the GStreamer conduit in the next section can be used instead.

## Open CV Using GStreamer

This way you can receive and decode videos through GStreamer and then give the latest frame to Open CV.

### Check Whether Open CV Supports GStreamer

```bash
python3 -c "import cv2; print(cv2.getBuildInformation())" | grep GStreamer
```

should be shown in the output `GStreamer: YES`. If shown `NO`, Current Open CV Unable to use `cv2.CAP_GSTREAMER`, should be replaced with FFmpeg backend or with GStreamer-supported Open CV.

### Python Example

```python
import cv2


RTSP_URL = "rtsp://user:Abcd%232027%21@192.168.234.1:8554/test"


def main():
    pipeline = (
        f"rtspsrc location={RTSP_URL} latency=0 ! "
        "rtph264depay ! h264parse ! avdec_h264 ! "
        "videoconvert ! video/x-raw,format=BGR ! "
        "appsink sync=false drop=true max-buffers=1"
    )

    capture = cv2.VideoCapture(pipeline, cv2.CAP_GSTREAMER)
    if not capture.isOpened():
        raise RuntimeError("Unable to open the GStreamer video stream.")

    try:
        while True:
            ok, frame = capture.read()
            if not ok:
                print("Failed to read a video frame.")
                break

            cv2.imshow("L1 GStreamer Stream", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        capture.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
```

`drop=true max-buffers=1` Discarding the backlog frame would be appropriate to give priority to real-time display and visual treatment.

## Delay Optimization

- Priority is given to the use of wired networks or stable signals Wi-Fi to avoid the development of equipment for simultaneous high-flow downloads.
- FFplay uses `-rtsp_transport tcp`, `-fflags nobuffer` and `-flags low_delay`.
- GStreamer will `latency` Sets a smaller value, and `appsink` Medium Settings `drop=true max-buffers=1`.
- OpenCV processing cycle does not perform time-consuming blocking operations; reasoning, save disks and displays can be divided into different threads.
- Do not execute `resize` extras or repeat colour conversions when only algorithms are required.
- TCP It is usually more stable in the dump environment, but may be delayed due to re-transmission; it should be tested in conjunction with the site network.

## Common Problems

| The phenomenon | Inspection and processing |
| --- | --- |
| `ping` It's not working. | Check if there's any connection to robot networks, robots. IP Whether it's right or not, and it's the webcard configuration. |
| `Connection refused` | Confirm the robot's active and open the video stream switch in remote control applications. |
| `401 Unauthorized` or hint account authentication | Checks whether the default address with authentication information at the beginning of this document is used when connecting through URL. When the player individually suggests authentication, fill in the username and original password in the Account Authentication section. |
| FFplay can play, Open CV cannot open | Check FFmpeg/GStreamer backend support for Open CV |
| GStreamer hint missing elements | Install GStreamer plugins listed in this chapter, use `gst-inspect-1.0` to check missing plugins |
| It's connected, but there's no image. | CheckRTSP path for `/test`, then restart the player and switch the video stream switch |
| The delay continues to increase. | Reduction of buffers, disposal of backlog frames and avoidance of time-consuming disposal during frame-taking |
| Carton or the screen. | Check wireless signals, bandwidth and littering, test FFplay TCP and GStreamer, respectively |

[Back to Home](../index.md)
