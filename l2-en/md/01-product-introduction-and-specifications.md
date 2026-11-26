<script setup>
import l2Image from '../assets/product/l2.png'
import l2wImage from '../assets/product/l2-w.png'
import l2wUltraImage from '../assets/product/l2-w-ultra.png'
</script>

<style scoped>
.spec-product-image {
  width: 150px;
}

.l2-specifications td[colspan] {
  text-align: center;
}
</style>

# Genisom L2 Product Introduction and Specifications

[Documentation Overview](../index.md) | [Accessories and Components](./02-accessories.md) | [Hardware Interfaces and System Architecture](./03-hardware-interfaces-and-system-architecture.md)

## Product Overview

The Genisom L2 series comprises general-purpose, intelligent biomimetic quadruped robots built to carry heavy payloads, run for extended periods, resist ingress, and move with agility and stability. Genisom L2 has point feet. Genisom L2-W and Genisom L2-W Ultra have wheeled legs. The robots can operate on level ground, slopes, and stairs.

All models include a stereo camera, an IMU, and a fill light. The Genisom L2-W Ultra adds a surround-view fisheye camera array, 3D LiDAR, GPS/RTK positioning, a microphone, and a speaker. It supports Autonomous Navigation, sensor-fusion obstacle avoidance, and omnidirectional autonomous following. The robot has USB, M12, and M14 connectors and a SIM card slot for payload integration and application development.

## Models

| Product Edition | Model Number | Foot Design |
| --- | --- | --- |
| Genisom L2 | `ZSXG06` | Point feet |
| Genisom L2-W | `ZSXG07` | Wheeled legs |
| Genisom L2-W Ultra | `ZSXG09` | Wheeled legs |

## Specifications

<table class="l2-specifications" tabindex="0">
  <thead>
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Specification</th>
      <th scope="col">
        <a :href="l2Image"><img :src="l2Image" alt="Genisom L2 quadruped robot with point feet" class="spec-product-image"></a><br>
        <strong>Genisom L2</strong>
      </th>
      <th scope="col">
        <a :href="l2wImage"><img :src="l2wImage" alt="Genisom L2-W Wheeled-Legged Robot" class="spec-product-image"></a><br>
        <strong>Genisom L2-W</strong>
      </th>
      <th scope="col">
        <a :href="l2wUltraImage"><img :src="l2wUltraImage" alt="Genisom L2-W Ultra Wheeled-Legged Robot" class="spec-product-image"></a><br>
        <strong>Genisom L2-W Ultra</strong>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="9">General</th>
      <td>Standing dimensions (L × W × H)</td>
      <td>720 × 395 × 475 mm</td>
      <td>765 × 480 × 500 mm</td>
      <td>765 × 480 × 510 mm</td>
    </tr>
    <tr>
      <td>Prone dimensions (L × W × H)</td>
      <td>780 × 450 × 195 mm</td>
      <td>785 × 580 × 195 mm</td>
      <td>785 × 580 × 210 mm</td>
    </tr>
    <tr>
      <td>Robot weight (with battery)</td>
      <td>22 kg</td>
      <td>27.6 kg</td>
      <td>28.6 kg</td>
    </tr>
    <tr>
      <td>Materials</td>
      <td colspan="3">Aluminum alloy and high-strength engineering plastics</td>
    </tr>
    <tr>
      <td>Operating temperature</td>
      <td colspan="3">-20 to 55 °C</td>
    </tr>
    <tr>
      <td>Operating humidity</td>
      <td colspan="3">10%–90% RH, noncondensing</td>
    </tr>
    <tr>
      <td>Storage humidity</td>
      <td colspan="3">5%–95% RH, noncondensing</td>
    </tr>
    <tr>
      <td>Robot body ingress protection</td>
      <td colspan="3">IP66</td>
    </tr>
    <tr>
      <td>Wheel hub motor ingress protection</td>
      <td>/</td>
      <td colspan="2">IP67</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="12">Performance</th>
      <td>Standard compute hardware</td>
      <td colspan="2">8-core high-performance CPU</td>
      <td>8-core high-performance CPU + 6-core high-performance CPU (80 TOPS)</td>
    </tr>
    <tr>
      <td>Degrees of freedom</td>
      <td>12</td>
      <td colspan="2">16 (12 + 4)</td>
    </tr>
    <tr>
      <td>Runtime without payload</td>
      <td colspan="2">5.5 h</td>
      <td>4.5 h</td>
    </tr>
    <tr>
      <td>Runtime at full payload</td>
      <td colspan="2">3.5 h</td>
      <td>3 h</td>
    </tr>
    <tr>
      <td>Maximum speed without payload</td>
      <td>3.0 m/s</td>
      <td colspan="2">3.7 m/s</td>
    </tr>
    <tr>
      <td>Rated payload</td>
      <td colspan="3">16 kg</td>
    </tr>
    <tr>
      <td>Step height for continuous stair climbing</td>
      <td>22 cm</td>
      <td colspan="2">25 cm</td>
    </tr>
    <tr>
      <td>Platform height the robot can climb without payload</td>
      <td colspan="3">70 cm</td>
    </tr>
    <tr>
      <td>Maximum gap the robot can cross without payload</td>
      <td colspan="3">40 cm</td>
    </tr>
    <tr>
      <td>Maximum slope without payload</td>
      <td colspan="3">40°</td>
    </tr>
    <tr>
      <td>Maximum slope at full payload</td>
      <td colspan="3">35°</td>
    </tr>
    <tr>
      <td>Basic motions</td>
      <td colspan="2">Stand, lie down, assume a crawl posture, crawl forward, jump forward, jump upward</td>
      <td>Stand, lie down, assume a crawl posture, crawl forward</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="5">Joints</th>
      <td>Actuator type</td>
      <td colspan="3">High-power-density motion unit</td>
    </tr>
    <tr>
      <td>Maximum joint torque</td>
      <td colspan="3">95 N·m</td>
    </tr>
    <tr>
      <td>Precision aluminum-alloy joint motors</td>
      <td colspan="3">12</td>
    </tr>
    <tr>
      <td>High-performance wheel hub motors</td>
      <td>/</td>
      <td colspan="2">4</td>
    </tr>
    <tr>
      <td>Joint range of motion</td>
      <td colspan="3">Body (-28° to 28°), upper leg (-170° to 66°), lower leg (34.5° to 156°)</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="4">Perception</th>
      <td>Camera type</td>
      <td colspan="2">Stereo camera</td>
      <td>Stereo camera and 4 fisheye cameras</td>
    </tr>
    <tr>
      <td>IMU</td>
      <td colspan="3">1</td>
    </tr>
    <tr>
      <td>3D LiDAR</td>
      <td colspan="2">/</td>
      <td>Standard</td>
    </tr>
    <tr>
      <td>GPS/RTK positioning module</td>
      <td colspan="2">/</td>
      <td>Standard</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="3">Autonomy</th>
      <td>Autonomous Navigation</td>
      <td colspan="2">/</td>
      <td>Standard</td>
    </tr>
    <tr>
      <td>Intelligent obstacle avoidance</td>
      <td colspan="2">Standard</td>
      <td>LiDAR and vision fusion for obstacle avoidance</td>
    </tr>
    <tr>
      <td>Autonomous following</td>
      <td colspan="2">Standard</td>
      <td>GLUE omnidirectional autonomous following<!-- TODO: 待术语表确认 --></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="6">Communication and Interaction</th>
      <td>Wi-Fi / Bluetooth</td>
      <td colspan="3">Standard</td>
    </tr>
    <tr>
      <td>4G / 5G</td>
      <td colspan="2">4G</td>
      <td>5G</td>
    </tr>
    <tr>
      <td>Fill light</td>
      <td colspan="3">1 front-facing light</td>
    </tr>
    <tr>
      <td>UWB</td>
      <td colspan="3">Standard</td>
    </tr>
    <tr>
      <td>Microphone / speaker</td>
      <td colspan="2">/</td>
      <td>Standard</td>
    </tr>
    <tr>
      <td>Expansion interfaces</td>
      <td colspan="3">USB Type-C × 2, M12 17PIN × 1, M14 18PIN × 1, SIM card slot × 1</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="3">Additional Capabilities</th>
      <td>Real-time video transmission</td>
      <td colspan="3">Standard</td>
    </tr>
    <tr>
      <td>OTA updates</td>
      <td colspan="3">Standard</td>
    </tr>
    <tr>
      <td>Application development</td>
      <td colspan="3">Standard</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="6">Accessories</th>
      <td>Rated battery capacity</td>
      <td colspan="3">14 Ah (705.6 Wh)</td>
    </tr>
    <tr>
      <td>Battery weight</td>
      <td colspan="3">4.5 kg</td>
    </tr>
    <tr>
      <td>Remote controller</td>
      <td colspan="2">Screenless remote controller</td>
      <td>Remote controller with display</td>
    </tr>
    <tr>
      <td>Power adapter</td>
      <td colspan="3">Standard</td>
    </tr>
    <tr>
      <td>Battery charging base</td>
      <td colspan="3">Standard</td>
    </tr>
    <tr>
      <td>Charging dock (with autonomous return-to-dock charging)</td>
      <td colspan="3">Optional</td>
    </tr>
  </tbody>
</table>

## Specification Notes

- Dimensions, weight, motion performance, and electrical specifications come from the *Genisom L2 Series Robot User Manual*, V1.3. Actual performance may vary with operating conditions, usage, and product configuration.
- The robot must not jump forward or upward while carrying a payload.
- Product configurations and features evolve over time. Check the delivered unit for its actual appearance, interfaces, and features.
- For the electrical specifications, power limits, and pinouts of the expansion interfaces, see [Hardware Interfaces and System Architecture](./03-hardware-interfaces-and-system-architecture.md).
- For payload or mechanical design, download the [Genisom L2 and Genisom L2-W Ultra exterior models](./03-hardware-interfaces-and-system-architecture.md#exterior-model-downloads).
