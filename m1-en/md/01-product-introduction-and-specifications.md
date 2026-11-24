# Genisom M1 Product Introduction and Specifications

[Return Document Overview](../index.md) | [Use and maintenance of equipment](./02-operation-and-maintenance.md) | [System composition, hardware interfaces and structural design information](./03-system-components-and-hardware-interfaces.md)

## Product Overview

Genisom M1 is a biomimetic wheeled-legged robot with low weight, high payload capacity, long runtime, strong protection, and agile, stable movement. Each leg has 3 joint motors and 1 hub motor. The robot has LiDAR, optical cameras, ultrasonic sensors, an IMU, an RTK module, and fill lights. Its onboard compute platform supports motion control, autonomous navigation and localization, and environmental inspection. Power and communication interfaces support a range of task payloads.

![Genisom M1 exterior dimensions](../assets/product/m1-dimensions.png)

When designing a payload, check the available mounting space against the exterior dimensions and mounting-space diagrams, then consult the payload capacity guidance. See [Payload Design Reference and Model Downloads](./03-system-components-and-hardware-interfaces.md#payload-model-downloads) in Chapter 3 for PDFs, exterior CAD models, and URDF models.

## Product Specification

<table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f4f7; text-align: center;">
      <th> Classification </th>
      <th> Parameters </th>
      <th> Genisom M1 </th>
      <th> Genisom M1 (RoamerX Pro edition) </th>
      <th> Genisom M1 Pro</th>
      <th> Genisom M1 Ultra</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="9"> <strong> Basic information </strong> </td>
      <td> Materials </td>
      <td> Aluminium alloy + high-strength engineering plastics </td>
      <td> Aluminium alloy + high-strength engineering plastics </td>
      <td> Aluminium alloy + high-strength engineering plastics </td>
      <td> Aluminium alloy + high-strength engineering plastics </td>
    </tr>
    <tr>
      <td> Standing dimensions (length &#215; width &#215; height) </td>
      <td>930 &#215; 480 &#215; 585 mm</td>
      <td>930 &#215; 480 &#215; 585 mm</td>
      <td>930 &#215; 480 &#215; 595 mm</td>
      <td>930 &#215; 480 &#215; 595 mm</td>
    </tr>
    <tr>
      <td> Prone dimensions (length &#215; width &#215; height) </td>
      <td>930 &#215; 630 &#215; 200 mm</td>
      <td>930 &#215; 630 &#215; 200 mm</td>
      <td>930 &#215; 630 &#215; 210 mm</td>
      <td>930 &#215; 630 &#215; 210 mm</td>
    </tr>
    <tr>
      <td> Robot weight (including batteries) </td>
      <td>41 kg</td>
      <td>41 kg</td>
      <td>41 kg</td>
      <td>41 kg</td>
    </tr>
    <tr>
      <td> Operating temperature </td>
      <td> -20 °C to 55 °C </td>
      <td> -20 °C to 55 °C </td>
      <td> -20 °C to 55 °C </td>
      <td> -20 °C to 55 °C </td>
    </tr>
    <tr>
      <td> Ingress protection rating </td>
      <td>IP67</td>
      <td>IP67</td>
      <td>IP67</td>
      <td>IP67</td>
    </tr>
    <tr>
      <td> Charging time </td>
      <td>＜2 h</td>
      <td>＜2 h</td>
      <td>＜2 h</td>
      <td>＜2 h</td>
    </tr>
    <tr>
      <td> Range </td>
      <td> 29 km with no payload / 18 km at full payload </td>
      <td> 29 km with no payload / 18 km at full payload </td>
      <td> 29 km with no payload / 18 km at full payload </td>
      <td> 29 km with no payload / 18 km at full payload </td>
    </tr>
    <tr>
      <td> Battery runtime </td>
      <td> 5.5 h with no payload / 3.5 h at full payload </td>
      <td> 5.5 h with no payload / 3.5 h at full payload </td>
      <td> 5.5 h with no payload / 3.5 h at full payload </td>
      <td> 5.5 h with no payload / 3.5 h at full payload </td>
    </tr>
    <tr>
      <td rowspan="8"> <strong> Performance parameters </strong> </td>
      <td> Standard onboard compute </td>
      <td> High-performance 8-core CPU </td>
      <td> High-performance 8-core CPU </td>
      <td> High-performance 8-core CPU </td>
      <td> High-performance 8-core CPU </td>
    </tr>
    <tr>
      <td> Expansion compute </td>
      <td>Jetson Orin NX 16 GB (100 TOPS)</td>
      <td>Jetson Orin NX 16 GB (100 TOPS)</td>
      <td>Jetson Orin NX 16 GB (100 TOPS)</td>
      <td>S100 (128 TOPS)</td>
    </tr>
    <tr>
      <td> Maximum speed </td>
      <td>6 m/s</td>
      <td>6 m/s</td>
      <td>6 m/s</td>
      <td>6 m/s</td>
    </tr>
    <tr>
      <td> Top speed at the operating limit </td>
      <td>8 m/s</td>
      <td>8 m/s</td>
      <td>8 m/s</td>
      <td>8 m/s</td>
    </tr>
    <tr>
      <td> Working payload </td>
      <td>30 kg</td>
      <td>30 kg</td>
      <td>30 kg</td>
      <td>30 kg</td>
    </tr>
    <tr>
      <td> Step height for continuous stair climbing </td>
      <td>25 cm</td>
      <td>25 cm</td>
      <td>25 cm</td>
      <td>25 cm</td>
    </tr>
    <tr>
      <td> Maximum climbable height difference </td>
      <td>80 cm</td>
      <td>80 cm</td>
      <td>80 cm</td>
      <td>80 cm</td>
    </tr>
    <tr>
      <td> Maximum slope angle </td>
      <td>45&#176;</td>
      <td>45&#176;</td>
      <td>45&#176;</td>
      <td>45&#176;</td>
    </tr>
    <tr>
      <td rowspan="6"> <strong> Joint parameters </strong> </td>
      <td> Actuator type </td>
      <td> High-power-density motion unit </td>
      <td> High-power-density motion unit </td>
      <td> High-power-density motion unit </td>
      <td> High-power-density motion unit </td>
    </tr>
    <tr>
      <td> Maximum joint torque </td>
      <td> 220 N&#183;m, millisecond response </td>
      <td> 220 N&#183;m, millisecond response </td>
      <td> 220 N&#183;m, millisecond response </td>
      <td> 220 N&#183;m, millisecond response </td>
    </tr>
    <tr>
      <td> Precision aluminium-alloy joint motors </td>
      <td> 12 </td>
      <td> 12 </td>
      <td> 12 </td>
      <td> 12 </td>
    </tr>
    <tr>
      <td> High-performance wheel hub motors </td>
      <td> 4 </td>
      <td> 4 </td>
      <td> 4 </td>
      <td> 4 </td>
    </tr>
    <tr>
      <td> Joint range of motion (body) </td>
      <td> -30&#176; to 40&#176; </td>
      <td> -30&#176; to 40&#176; </td>
      <td> -30&#176; to 40&#176; </td>
      <td> -30&#176; to 40&#176; </td>
    </tr>
    <tr>
      <td> Joint range of motion (upper and lower legs) </td>
      <td> Upper leg &#177;140&#176; / lower leg &#177;160&#176; </td>
      <td> Upper leg &#177;140&#176; / lower leg &#177;160&#176; </td>
      <td> Upper leg &#177;140&#176; / lower leg &#177;160&#176; </td>
      <td> Upper leg &#177;140&#176; / lower leg &#177;160&#176; </td>
    </tr>
    <tr>
      <td rowspan="7"> <strong> Perception </strong> </td>
      <td> Camera type </td>
      <td> Wide-angle camera &#215; 2 </td>
      <td> Wide-angle camera &#215; 2 </td>
      <td> Wide-angle camera &#215; 2 </td>
      <td> 4 fisheye cameras + 2 stereo cameras (front and rear) </td>
    </tr>
    <tr>
      <td> Camera resolution </td>
      <td> 8 MP &#215; 2 (DFOV 122&#176;) </td>
      <td> 8 MP &#215; 2 (DFOV 122&#176;) </td>
      <td> 8 MP &#215; 2 (DFOV 122&#176;) </td>
      <td> 3 MP fisheye + 2 MP stereo camera </td>
    </tr>
    <tr>
      <td> Automotive-grade IMU </td>
      <td>&#215;1</td>
      <td>&#215;1</td>
      <td>&#215;1</td>
      <td>&#215;1</td>
    </tr>
    <tr>
      <td> 3D LiDAR </td>
      <td>&#215;2</td>
      <td>&#215;2</td>
      <td>&#215;2</td>
      <td>&#215;2</td>
    </tr>
    <tr>
      <td> Depth camera </td>
      <td>/</td>
      <td>/</td>
      <td>/</td>
      <td> Standard </td>
    </tr>
    <tr>
      <td> RTK positioning module </td>
      <td>&#215;1</td>
      <td>&#215;1</td>
      <td>&#215;1</td>
      <td>&#215;1</td>
    </tr>
    <tr>
      <td> Ultrasonic sensors </td>
      <td>&#215;2</td>
      <td>&#215;2</td>
      <td>&#215;2</td>
      <td>&#215;2</td>
    </tr>
    <tr>
      <td rowspan="4"> <strong> Communications and interaction </strong> </td>
      <td> Wi-Fi / Bluetooth </td>
      <td> Standard </td>
      <td> Standard </td>
      <td> Standard </td>
      <td> Standard </td>
    </tr>
    <tr>
      <td>UWB</td>
      <td>/</td>
      <td>/</td>
      <td> Standard </td>
      <td> Standard </td>
    </tr>
    <tr>
      <td> Microphone / speaker </td>
      <td>/</td>
      <td>/</td>
      <td> Standard </td>
      <td> Standard </td>
    </tr>
    <tr>
      <td> Expansion interfaces </td>
      <td> Gigabit Ethernet &#215; 2, USB 3.0 &#215; 2, RS232 &#215; 1, RS485 &#215; 1, SBUS &#215; 2, PPS &#215; 1 </td>
      <td> Gigabit Ethernet &#215; 2, USB 3.0 &#215; 2, RS232 &#215; 1, RS485 &#215; 1, SBUS &#215; 2, PPS &#215; 1 </td>
      <td> Gigabit Ethernet &#215; 2, USB 3.0 &#215; 2, RS232 &#215; 1, RS485 &#215; 1, SBUS &#215; 2, PPS &#215; 1 </td>
      <td> Gigabit Ethernet &#215; 2, USB 3.0 &#215; 2, RS232 &#215; 1, RS485 &#215; 1, SBUS &#215; 2, PPS &#215; 1 </td>
    </tr>
    <tr>
      <td rowspan="7"> <strong> Systems and software capabilities </strong> </td>
      <td> Standard Actions </td>
      <td> Supports stepping, gliding, and crawling, straight-line movement forward, backward, left, and right, turning in place, and changing knee posture. Supported terrain includes gravel, asphalt, grass, sand, forest floors, and building rubble. </td>
      <td> Supports stepping, gliding, and crawling, straight-line movement forward, backward, left, and right, turning in place, and changing knee posture. Supported terrain includes gravel, asphalt, grass, sand, forest floors, and building rubble. </td>
      <td> Supports stepping, gliding, and crawling, straight-line movement forward, backward, left, and right, turning in place, and changing knee posture. Supported terrain includes gravel, asphalt, grass, sand, forest floors, and building rubble. </td>
      <td> Supports stepping, gliding, and crawling, straight-line movement forward, backward, left, and right, turning in place, and changing knee posture. Supported terrain includes gravel, asphalt, grass, sand, forest floors, and building rubble. </td>
    </tr>
    <tr>
      <td> Stunts </td>
      <td> Climbing high walls, crossing rodent barriers and narrow walls, and twisting, among other actions </td>
      <td> Climbing high walls, crossing rodent barriers and narrow walls, and twisting, among other actions </td>
      <td> Climbing high walls, crossing rodent barriers and narrow walls, and twisting, among other actions </td>
      <td> Climbing high walls, crossing rodent barriers and narrow walls, and twisting, among other actions </td>
    </tr>
    <tr>
      <td> Real-time video transmission </td>
      <td> Supported </td>
      <td> Supported </td>
      <td> Supported </td>
      <td> Supported </td>
    </tr>
    <tr>
      <td> OTA Upgrade </td>
      <td> Supported </td>
      <td> Supported </td>
      <td> Supported </td>
      <td> Supported </td>
    </tr>
    <tr>
      <td> SDK development </td>
      <td> Supported </td>
      <td> Supported </td>
      <td> Supported </td>
      <td> Supported </td>
    </tr>
    <tr>
      <td> Autonomous Navigation </td>
      <td> Supported through custom development </td>
      <td> Standard </td>
      <td> Supported through custom development </td>
      <td> Standard </td>
    </tr>
    <tr>
      <td> Intelligent obstacle avoidance </td>
      <td> Supported through custom development </td>
      <td> Standard </td>
      <td> Supported through custom development </td>
      <td> Standard </td>
    </tr>
    <tr>
      <td rowspan="6"> <strong> Accessories </strong> </td>
      <td> Batteries </td>
      <td> 18.7 Ah / 1010 Wh (dual batteries with quick removal and replacement and hot-swapping) </td>
      <td> 18.7 Ah / 1010 Wh (dual batteries with quick removal and replacement and hot-swapping) </td>
      <td> 18.7 Ah / 1010 Wh (dual batteries with quick removal and replacement and hot-swapping) </td>
      <td> 18.7 Ah / 1010 Wh (dual batteries with quick removal and replacement and hot-swapping) </td>
    </tr>
    <tr>
      <td> Adapter and charging dock </td>
      <td> Standard </td>
      <td> Standard </td>
      <td> Standard </td>
      <td> Standard </td>
    </tr>
    <tr>
      <td> Remote control </td>
      <td> RC transmitter </td>
      <td> RC transmitter </td>
      <td> RC transmitter </td>
      <td> RC transmitter </td>
    </tr>
    <tr>
      <td> Flight case </td>
      <td> Standard </td>
      <td> Standard </td>
      <td> Standard </td>
      <td> Standard </td>
    </tr>
    <tr>
      <td> Storage unit </td>
      <td> 256 GB SSD included as standard </td>
      <td> 256 GB SSD included as standard </td>
      <td> 256 GB SSD + 512 GB TF card included as standard </td>
      <td> 256 GB SSD + 512 GB TF card included as standard </td>
    </tr>
    <tr>
      <td> Charging dock (includes autonomous recharging) </td>
      <td> Optional </td>
      <td> Optional </td>
      <td> Optional </td>
      <td> Optional </td>
    </tr>
  </tbody>
</table>

## Parameter Description

- Battery runtime was measured in laboratory tests at 1 m/s with no payload.
- The top speed was measured in laboratory tests on a flat surface without a payload. Actual speed varies with payload, terrain, and temperature.
- Features and accessories depend on the delivered configuration. Confirm Autonomous Navigation, intelligent obstacle avoidance, following, voice, and storage capabilities for the specific model.
