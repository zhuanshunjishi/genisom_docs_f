# Genisom L2 System and SDK Version Compatibility

[Back to Documentation Overview](../index.md) | [Genisom L2 SDK Quickstart](./06-sdk-quickstart.md)

## Version Matrix

Look up the robot's RK3588 version to find the corresponding app, SDK, and S100 versions. An RK3588 version may correspond to more than one version of a component.

<table class="l2-version-matrix" tabindex="0">
  <thead>
    <tr>
      <th scope="col">RK3588 Version</th>
      <th scope="col">App Version</th>
      <th scope="col">SDK Version</th>
      <th scope="col">S100 Version</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="rowgroup"><code>v0.0.9</code></th>
      <td><code>v1.2.5</code></td>
      <td><code>v0.2.2</code></td>
      <td>—</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup"><code>v0.1.0</code></th>
      <td><code>v1.2.5</code></td>
      <td><code>v0.2.2</code></td>
      <td>—</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="2"><code>v0.1.1</code></th>
      <td><code>v1.2.5</code></td>
      <td rowspan="2"><code>v0.2.2</code></td>
      <td rowspan="2"><code>Hermes-v0.0.7</code></td>
    </tr>
    <tr>
      <td><code>v1.2.6</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="2"><code>v0.1.2</code></th>
      <td><code>v1.2.7</code></td>
      <td rowspan="2"><code>v0.2.3</code></td>
      <td rowspan="2"><code>Hermes-v0.0.8</code></td>
    </tr>
    <tr>
      <td><code>v1.2.8</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup"><code>v0.1.3</code></th>
      <td><code>v1.2.9</code></td>
      <td><code>v0.2.3</code></td>
      <td><code>Hermes-v0.1.0</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="3"><code>v0.1.4</code></th>
      <td><code>v1.2.10</code></td>
      <td rowspan="3"><code>v0.2.3</code></td>
      <td rowspan="3"><code>Hermes-v0.1.0</code></td>
    </tr>
    <tr>
      <td><code>v1.3.0</code></td>
    </tr>
    <tr>
      <td><code>v1.3.1</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup"><code>v0.1.5</code></th>
      <td><code>v1.3.1</code></td>
      <td><code>v0.2.3</code></td>
      <td><code>Hermes-v0.1.0</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup"><code>v0.1.6</code></th>
      <td><code>v1.3.2</code></td>
      <td><code>v0.2.3</code></td>
      <td><code>Hermes-v0.1.0</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup"><code>v0.1.7</code></th>
      <td><code>v1.3.3</code></td>
      <td><code>v0.2.3</code></td>
      <td><code>Hermes-v0.1.0</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup"><code>v0.1.8</code></th>
      <td><code>v1.3.4</code></td>
      <td><code>v0.2.3</code></td>
      <td><code>Hermes-v0.1.0</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup"><code>v0.1.9</code></th>
      <td><code>v1.3.5</code></td>
      <td><code>v0.2.3</code></td>
      <td><code>Hermes-v0.1.1</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup"><code>v0.2.0</code></th>
      <td><code>v1.3.6</code></td>
      <td><code>v0.2.3</code></td>
      <td></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="2"><code>v0.2.1</code></th>
      <td><code>v1.3.7</code></td>
      <td rowspan="2"><code>v0.2.3</code> / <code>v1.0.0</code></td>
      <td rowspan="2"></td>
    </tr>
    <tr>
      <td><code>v1.3.8</code></td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="4"><code>v0.2.2</code></th>
      <td><code>v1.3.8</code></td>
      <td rowspan="4"><code>v0.2.3</code> / <code>v1.0.0</code></td>
      <td rowspan="4"><code>Hermes-v0.1.3</code><br><code>Hermes-v0.1.5</code></td>
    </tr>
    <tr>
      <td><code>v1.3.9</code></td>
    </tr>
    <tr>
      <td><code>v1.4.0</code></td>
    </tr>
    <tr>
      <td><code>v1.4.1</code></td>
    </tr>
  </tbody>
</table>

The table preserves blank S100 entries from the source.

## SDK Compatibility Notes

SDK `v0.2.2` is recommended for Genisom L2 system `v0.0.9`. See [Robot SDK compatibility](https://github.com/zsibot/genisom_robot_sdk/blob/main/README.md#sdk-and-robot-system-compatibility).

Call `Version()` to check the SDK version in use. After a successful handshake, call `SystemVersion()` to read the robot's system version. See [Version and Device Information](./07-01-connection-and-device-info.md#version-and-device-information).
