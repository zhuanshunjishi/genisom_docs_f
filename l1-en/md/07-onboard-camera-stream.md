# Onboard Camera Stream

[Back to Home](../index.md) | [Robot, Controller, and App Operation](./05-device-controller-and-app-guide.md) | [SDK Development Guide](./08-sdk-development-guide.md)

## Video Stream Information

The onboard camera on Genisom L1 streams H.264 video over RTSP. Connect your development computer to the robot’s network, then use the default stream URL below.

```text
rtsp://user:Abcd%232027%21@192.168.234.1:8554/test
```

| Item | Default |
| --- | --- |
| Protocol | RTSP |
| Robot IP | `192.168.234.1` |
| Port | `8554` |
| Stream path | `/test` |
| Video encoding | H.264 |

If the robot’s IP address has changed, replace `192.168.234.1` with its current address.

### Account Authentication

If the player asks you to sign in, use the default credentials below.

| Item | Value |
| --- | --- |
| Username | `user` |
| Password | `Abcd#2027!` |

The default URL encodes `#` as `%23` and `!` as `%21` in the password. If the player has a separate password field, use the original password from the table above.

## Preparation for Use

1. Power on the robot and wait for it to finish booting.
2. In the remote controller app’s settings, enable the video stream and save your changes.
3. Connect the playback device to the robot’s network.
4. Verify that the robot’s IP address is reachable.

```bash
ping -c 4 192.168.234.1
```

5. Check that the local firewall and network policies allow RTSP connections.

RTSP streaming and HighLevel control use separate ports. Verify the stream and the SDK control connection independently.

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

The command uses TCP and reduces probing and buffering to lower playback latency. Press `q` to stop playback.

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

The pipeline receives the RTSP stream, extracts H.264 from the RTP packets, then parses, decodes, converts, and displays the video. Press `Ctrl+C` in the terminal to stop playback.

## Play with VLC

1. Open VLC.
2. Select Media > Open Network Stream.
3. Enter the default RTSP address at the beginning of this document.
4. Click Play.

Playback latency and compatibility depend on the VLC version and cache settings. If VLC cannot open the stream or latency is high, test it with FFplay or GStreamer.

## Read with OpenCV {#read-with-open-cv}

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

Press `q` to exit the script. Support for `CAP_PROP_BUFFERSIZE` depends on your OpenCV and FFmpeg backend. If latency keeps increasing, try the GStreamer pipeline in the next section.

## OpenCV with GStreamer {#open-cv-using-gstreamer}

GStreamer receives and decodes the stream, then passes the latest frame to OpenCV.

### Check Whether OpenCV Supports GStreamer {#check-whether-open-cv-supports-gstreamer}

```bash
python3 -c "import cv2; print(cv2.getBuildInformation())" | grep GStreamer
```

Look for `GStreamer: YES` in the output. If it shows `NO`, your OpenCV build cannot use `cv2.CAP_GSTREAMER`. Use the FFmpeg backend or install OpenCV with GStreamer support.

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

`drop=true max-buffers=1` drops queued frames so real-time display and vision processing can work with recent frames.

## Delay Optimization

- Use a wired connection or a stable Wi-Fi signal. Avoid large downloads on the development computer while streaming.
- FFplay uses `-rtsp_transport tcp`, `-fflags nobuffer` and `-flags low_delay`.
- Set a low `latency` value in GStreamer and set `drop=true max-buffers=1` on `appsink`.
- Keep slow, blocking work out of the OpenCV capture loop. Use separate threads for inference, saving frames, or display as needed.
- If the frames are only used as algorithm input, skip unnecessary `resize` calls and repeated colour conversions.
- TCP is usually more stable when packets are lost. Retransmissions can increase latency, so test on the network you will use.

## Common Problems

| Symptom | What to check |
| --- | --- |
| `ping` fails | Check the connection to the robot’s network, the robot’s IP address, and the network adapter settings. |
| `Connection refused` | Confirm that the robot has finished booting, then enable the video stream in the remote controller app. |
| `401 Unauthorized` or sign-in prompt | Check that the stream URL includes the credentials as shown at the top of the page. If the player prompts for credentials separately, use the username and original password from Account Authentication. |
| FFplay plays the stream but OpenCV cannot open it | Check whether your OpenCV build supports the FFmpeg or GStreamer backend. |
| GStreamer reports missing elements | Install the listed GStreamer plugin packages. Use `gst-inspect-1.0` to identify missing elements. |
| Connected but no video | Check that the RTSP path is `/test`, then restart the player and toggle the video stream setting. |
| Latency keeps increasing | Reduce buffering, drop queued frames, and keep slow processing off the capture thread. |
| Stuttering or visual artifacts | Check wireless signal strength, bandwidth, and packet loss. Test FFplay over TCP and GStreamer separately. |

[Back to Home](../index.md)
