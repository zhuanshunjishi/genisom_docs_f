# L2 系统与 SDK 版本兼容性

[返回文档总览](../index.md) | [L2 SDK 快速开始](./06-sdk-quickstart.md)

## 版本对应表

根据机器人的 RK3588 版本，查找对应的 APP、SDK 和 S100 版本。同一 RK3588 版本可能对应多个组件版本。

<table class="l2-version-matrix" tabindex="0">
  <thead>
    <tr>
      <th scope="col">RK3588 版本</th>
      <th scope="col">APP 版本</th>
      <th scope="col">SDK 版本</th>
      <th scope="col">S100 版本</th>
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

S100 版本栏中的空白沿用原表。

## SDK 兼容说明

L2 系统 `v0.0.9` 推荐使用 SDK `v0.2.2`。详见 [Robot SDK 兼容性说明](https://github.com/zsibot/genisom_robot_sdk/blob/main/README_zh.md#sdk-与机器人系统版本兼容性)。

可调用 `Version()` 查询正在使用的 SDK 版本。与机器人握手成功后，可调用 `SystemVersion()` 查询机器人系统版本。详见[版本和设备信息](./07-01-connection-and-device-info.md#版本和设备信息)。
