# M1 product introduction and specifications

[Return Document Overview](../index.md) | [Use and maintenance of equipment](./02-operation-and-maintenance.md) | [System composition, hardware interfaces and structural design information](./03-system-components-and-hardware-interfaces.md)

## Product Overview

GenisomAI M1 It's a four-foot replicat robot with self-heavy, load-sized, long, protective, motor-flexible and stable features; robots are equipped with each leg. 3 A joint power and... 1 Electrophones with laser radars, optical cameras, ultrasound radars, IMU,  RTK The interior is equipped with high-calculation master control platforms for motor control, autonomous navigational positioning, environmental detection, etc., which provide a rich electrical and communications interface and support multi-product task load expansion.

![M1 Exterior dimensions](../assets/product/m1-dimensions.png)

When the loading design is carried out, the layout space can be checked against the outer size map and the upper space map, and the load capacity design reference can be reviewed. PDF,  CAD Appearance model and URDF Models can be in the first place. 3 The chapter. [Load Design Reference and Model Download](./03-system-components-and-hardware-interfaces.md#payload-model-downloads) gets in.

## Product Specification

<table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f4f7; text-align: center;">
      <th> Classification </th>
      <th> Parameters </th>
      <th> GenisomAI M1 </th>
      <th> GenisomAI M1 (Roamer X Pro edition) </th>
      <th> GenisomAI M1  Pro</th>
      <th> GenisomAI M1  Ultra</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="9"> <strong> Basic information </strong> </td>
      <td> Materials </td>
      <td> Aluminium alloy + high-intensity engineering plastics </td>
      <td> Aluminium alloy + high-intensity engineering plastics </td>
      <td> Aluminium alloy + high-intensity engineering plastics </td>
      <td> Aluminium alloy + high-intensity engineering plastics </td>
    </tr>
    <tr>
      <td> Standing dimensions (long &#215; width &#215; high) </td>
      <td>930 &#215; 480 &#215; 585 mm</td>
      <td>930 &#215; 480 &#215; 585 mm</td>
      <td>930 &#215; 480 &#215; 595 mm</td>
      <td>930 &#215; 480 &#215; 595 mm</td>
    </tr>
    <tr>
      <td> Paddy dimensions (long &#215; width &#215; high) </td>
      <td>930 &#215; 630 &#215; 200 mm</td>
      <td>930 &#215; 630 &#215; 200 mm</td>
      <td>930 &#215; 630 &#215; 210 mm</td>
      <td>930 &#215; 630 &#215; 210 mm</td>
    </tr>
    <tr>
      <td> Whole weight (including batteries) </td>
      <td>41 kg</td>
      <td>41 kg</td>
      <td>41 kg</td>
      <td>41 kg</td>
    </tr>
    <tr>
      <td> Working temperature </td>
      <td> -20℃ to 55℃ </td>
      <td> -20℃ to 55℃ </td>
      <td> -20℃ to 55℃ </td>
      <td> -20℃ to 55℃ </td>
    </tr>
    <tr>
      <td> Protection level </td>
      <td>IP67</td>
      <td>IP67</td>
      <td>IP67</td>
      <td>IP67</td>
    </tr>
    <tr>
      <td> Length of charge </td>
      <td>＜2 h</td>
      <td>＜2 h</td>
      <td>＜2 h</td>
      <td>＜2 h</td>
    </tr>
    <tr>
      <td> Continuation mileage </td>
      <td> Empty 29 km / full load 18 km </td>
      <td> Empty 29 km / full load 18 km </td>
      <td> Empty 29 km / full load 18 km </td>
      <td> Empty 29 km / full load 18 km </td>
    </tr>
    <tr>
      <td> Extension time </td>
      <td> Empty 5.5 h / full 3.5 h </td>
      <td> Empty 5.5 h / full 3.5 h </td>
      <td> Empty 5.5 h / full 3.5 h </td>
      <td> Empty 5.5 h / full 3.5 h </td>
    </tr>
    <tr>
      <td rowspan="8"> <strong> Performance parameters </strong> </td>
      <td> Coding strength </td>
      <td> 8 Nuclear high performance CPU </td>
      <td> 8 Nuclear high performance CPU </td>
      <td> 8 Nuclear high performance CPU </td>
      <td> 8 Nuclear high performance CPU </td>
    </tr>
    <tr>
      <td> Extension calculator </td>
      <td>Jetson Orin NX 16G (100 TOPS)</td>
      <td>Jetson Orin NX 16G (100 TOPS)</td>
      <td>Jetson Orin NX 16G (100 TOPS)</td>
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
      <td> Maximum speed </td>
      <td>8 m/s</td>
      <td>8 m/s</td>
      <td>8 m/s</td>
      <td>8 m/s</td>
    </tr>
    <tr>
      <td> Task load </td>
      <td>30 kg</td>
      <td>30 kg</td>
      <td>30 kg</td>
      <td>30 kg</td>
    </tr>
    <tr>
      <td> Crawling through the stairs. </td>
      <td>25 cm</td>
      <td>25 cm</td>
      <td>25 cm</td>
      <td>25 cm</td>
    </tr>
    <tr>
      <td> Maximum climbing differential height </td>
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
      <td> Executor type </td>
      <td> High-intensity mobile unit </td>
      <td> High-intensity mobile unit </td>
      <td> High-intensity mobile unit </td>
      <td> High-intensity mobile unit </td>
    </tr>
    <tr>
      <td> Maximum joint twist </td>
      <td> 220 N &#183; m, millisecond response </td>
      <td> 220 N &#183; m, millisecond response </td>
      <td> 220 N &#183; m, millisecond response </td>
      <td> 220 N &#183; m, millisecond response </td>
    </tr>
    <tr>
      <td> Aluminium alloy precision joints. </td>
      <td> 12 individual </td>
      <td> 12 individual </td>
      <td> 12 individual </td>
      <td> 12 individual </td>
    </tr>
    <tr>
      <td> High-performance wheel Zirconium power </td>
      <td> 4 individual </td>
      <td> 4 individual </td>
      <td> 4 individual </td>
      <td> 4 individual </td>
    </tr>
    <tr>
      <td> Joint motion space (aeroplane body) </td>
      <td> -30 &#176; to 40 &#176; </td>
      <td> -30 &#176; to 40 &#176; </td>
      <td> -30 &#176; to 40 &#176; </td>
      <td> -30 &#176; to 40 &#176; </td>
    </tr>
    <tr>
      <td> Joint motion space (legs / calves) </td>
      <td> Legs: &#177; 140 &#176; / calf: &#177; 160 &#176; </td>
      <td> Legs: &#177; 140 &#176; / calf: &#177; 160 &#176; </td>
      <td> Legs: &#177; 140 &#176; / calf: &#177; 160 &#176; </td>
      <td> Legs: &#177; 140 &#176; / calf: &#177; 160 &#176; </td>
    </tr>
    <tr>
      <td rowspan="7"> <strong> Sensibility </strong> </td>
      <td> Camera type </td>
      <td> Wide-angle camera &#215; 2 </td>
      <td> Wide-angle camera &#215; 2 </td>
      <td> Wide-angle camera &#215; 2 </td>
      <td> Fish Eye Camera &#215; 4 + Two-eye camera &#215; 2 </td>
    </tr>
    <tr>
      <td> Camera pixels </td>
      <td> 8 MP &#215; 2 (DFOV 122&#176;) </td>
      <td> 8 MP &#215; 2 (DFOV 122&#176;) </td>
      <td> 8 MP &#215; 2 (DFOV 122&#176;) </td>
      <td> 3 MP fisheye + 2 MP stereo camera </td>
    </tr>
    <tr>
      <td> Car regulations IMU </td>
      <td>&#215;1</td>
      <td>&#215;1</td>
      <td>&#215;1</td>
      <td>&#215;1</td>
    </tr>
    <tr>
      <td> 3 D Laser Radar </td>
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
      <td> Coding </td>
    </tr>
    <tr>
      <td> RTK Positioning module </td>
      <td>&#215;1</td>
      <td>&#215;1</td>
      <td>&#215;1</td>
      <td>&#215;1</td>
    </tr>
    <tr>
      <td> Ultrasound sensors </td>
      <td>&#215;2</td>
      <td>&#215;2</td>
      <td>&#215;2</td>
      <td>&#215;2</td>
    </tr>
    <tr>
      <td rowspan="4"> <strong> Communications and interaction </strong> </td>
      <td> WiFi / Bluetooth </td>
      <td> Coding </td>
      <td> Coding </td>
      <td> Coding </td>
      <td> Coding </td>
    </tr>
    <tr>
      <td>UWB</td>
      <td>/</td>
      <td>/</td>
      <td> Coding </td>
      <td> Coding </td>
    </tr>
    <tr>
      <td> Microphone / speaker </td>
      <td>/</td>
      <td>/</td>
      <td> Coding </td>
      <td> Coding </td>
    </tr>
    <tr>
      <td> Functional extension interface </td>
      <td> Ggborg gateway &#215; 2, USB 3.0 &#215; 2, RS232 &#215; 1, RS485 &#215; 1, SBUS &#215; 2, PPS &#215; 1 </td>
      <td> Ggborg gateway &#215; 2, USB 3.0 &#215; 2, RS232 &#215; 1, RS485 &#215; 1, SBUS &#215; 2, PPS &#215; 1 </td>
      <td> Ggborg gateway &#215; 2, USB 3.0 &#215; 2, RS232 &#215; 1, RS485 &#215; 1, SBUS &#215; 2, PPS &#215; 1 </td>
      <td> Ggborg gateway &#215; 2, USB 3.0 &#215; 2, RS232 &#215; 1, RS485 &#215; 1, SBUS &#215; 2, PPS &#215; 1 </td>
    </tr>
    <tr>
      <td rowspan="7"> <strong> Systems and software capabilities </strong> </td>
      <td> Standard Actions </td>
      <td> Support for postures such as step, slide, scavengers; front- and right-line movement, in-situ rotation; knee-band changes; support for roads such as gravel road, tar road, grassland, sandland, forest floor, building ruins </td>
      <td> Support for postures such as step, slide, scavengers; front- and right-line movement, in-situ rotation; knee-band changes; support for roads such as gravel road, tar road, grassland, sandland, forest floor, building ruins </td>
      <td> Support for postures such as step, slide, scavengers; front- and right-line movement, in-situ rotation; knee-band changes; support for roads such as gravel road, tar road, grassland, sandland, forest floor, building ruins </td>
      <td> Support for postures such as step, slide, scavengers; front- and right-line movement, in-situ rotation; knee-band changes; support for roads such as gravel road, tar road, grassland, sandland, forest floor, building ruins </td>
    </tr>
    <tr>
      <td> stunt action </td>
      <td> Climbing walls, slabs, narrow walls, twisting, etc. </td>
      <td> Climbing walls, slabs, narrow walls, twisting, etc. </td>
      <td> Climbing walls, slabs, narrow walls, twisting, etc. </td>
      <td> Climbing walls, slabs, narrow walls, twisting, etc. </td>
    </tr>
    <tr>
      <td> Real-time image transfer </td>
      <td> Support </td>
      <td> Support </td>
      <td> Support </td>
      <td> Support </td>
    </tr>
    <tr>
      <td> OTA Upgrade </td>
      <td> Support </td>
      <td> Support </td>
      <td> Support </td>
      <td> Support </td>
    </tr>
    <tr>
      <td> Secondary development </td>
      <td> Support </td>
      <td> Support </td>
      <td> Support </td>
      <td> Support </td>
    </tr>
    <tr>
      <td> Autonomous navigation </td>
      <td> Support (twice) </td>
      <td> Coding </td>
      <td> Support (twice) </td>
      <td> Coding </td>
    </tr>
    <tr>
      <td> Smart asylum </td>
      <td> Support (twice) </td>
      <td> Coding </td>
      <td> Support (twice) </td>
      <td> Coding </td>
    </tr>
    <tr>
      <td rowspan="6"> <strong> Spare parts </strong> </td>
      <td> Batteries </td>
      <td> 18.7 Ah / 1010 Wh (double batteries to support fast-dismantling, heat-plugging) </td>
      <td> 18.7 Ah / 1010 Wh (double batteries to support fast-dismantling, heat-plugging) </td>
      <td> 18.7 Ah / 1010 Wh (double batteries to support fast-dismantling, heat-plugging) </td>
      <td> 18.7 Ah / 1010 Wh (double batteries to support fast-dismantling, heat-plugging) </td>
    </tr>
    <tr>
      <td> Adaptor, recharger </td>
      <td> Coding </td>
      <td> Coding </td>
      <td> Coding </td>
      <td> Coding </td>
    </tr>
    <tr>
      <td> Remote control </td>
      <td> Air Model Remote Control </td>
      <td> Air Model Remote Control </td>
      <td> Air Model Remote Control </td>
      <td> Air Model Remote Control </td>
    </tr>
    <tr>
      <td> Flight case </td>
      <td> Coding </td>
      <td> Coding </td>
      <td> Coding </td>
      <td> Coding </td>
    </tr>
    <tr>
      <td> Storage unit </td>
      <td> Coding 256 G SSD </td>
      <td> Coding 256 G SSD </td>
      <td> Coding 256 G SSD + 512 G TF Card </td>
      <td> Coding 256 G SSD + 512 G TF Card </td>
    </tr>
    <tr>
      <td> Charged stake (includes autonomous recharge) </td>
      <td> Optional </td>
      <td> Optional </td>
      <td> Optional </td>
      <td> Optional </td>
    </tr>
  </tbody>
</table>

## Parameter Description

- Resuscitation time 1 m/s, no load of laboratory test data.
- The maximum speed is the data from laboratory tests under loadless, flat surface conditions, and the actual speed varies with load, terrain and temperature.
- Auto-navigation, intellectual avoidance, follow-up, voice and storage capabilities should be identified according to the specific model.
