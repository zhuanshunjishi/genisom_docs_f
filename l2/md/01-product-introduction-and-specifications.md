<script setup>
import l2Image from '../assets/product/l2.png'
import l2wImage from '../assets/product/l2-w.png'
import l2wUltraImage from '../assets/product/l2-w-ultra.png'
</script>

<style scoped>
.spec-product-image {
  width: 150px;
}
</style>

# L2 产品介绍与规格

[返回文档总览](../index.md) | [配件与设备组成](./02-accessories.md) | [硬件接口与系统架构](./03-hardware-interfaces-and-system-architecture.md)

## 产品概述

L2 系列是通用型智能仿生四足机器人，具有负载能力强、续航时间长、防护等级高、运动灵活稳定等特点。L2 采用点足结构，L2-W 和 L2-W Ultra 采用轮足结构，可适应平地、坡道、楼梯等不同作业环境。

机器人集成双目相机、IMU 和补光灯。L2-W Ultra 进一步配置周视鱼眼相机阵列、3D 激光雷达、GPS/RTK 定位模块、麦克风和扬声器，并提供自主导航、融合避障和全向自主跟随能力。机身配有 USB、M12、M14 接口和 SIM 卡槽，用于接入上装设备和二次开发。

## 系列型号

| 产品版本 | 产品型号 | 足端结构 |
| --- | --- | --- |
| L2 | `ZSXG06` | 点足 |
| L2-W | `ZSXG07` | 轮足 |
| L2-W Ultra | `ZSXG09` | 轮足 |

## 产品规格

<table tabindex="0">
  <thead>
    <tr>
      <th scope="col">分类</th>
      <th scope="col">规格</th>
      <th scope="col">
        <a :href="l2Image"><img :src="l2Image" alt="L2 点足四足机器人" class="spec-product-image"></a><br>
        <strong>L2</strong>
      </th>
      <th scope="col">
        <a :href="l2wImage"><img :src="l2wImage" alt="L2-W 轮足四足机器人" class="spec-product-image"></a><br>
        <strong>L2-W</strong>
      </th>
      <th scope="col">
        <a :href="l2wUltraImage"><img :src="l2wUltraImage" alt="L2-W Ultra 轮足四足机器人" class="spec-product-image"></a><br>
        <strong>L2-W Ultra</strong>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="9">基础信息</th>
      <td>站立尺寸（长 × 宽 × 高）</td>
      <td>720 × 395 × 475 mm</td>
      <td>765 × 480 × 500 mm</td>
      <td>765 × 480 × 510 mm</td>
    </tr>
    <tr>
      <td>趴地尺寸（长 × 宽 × 高）</td>
      <td>780 × 450 × 195 mm</td>
      <td>785 × 580 × 195 mm</td>
      <td>785 × 580 × 210 mm</td>
    </tr>
    <tr>
      <td>整机重量（含电池）</td>
      <td>22 kg</td>
      <td>27.6 kg</td>
      <td>28.6 kg</td>
    </tr>
    <tr>
      <td>材质</td>
      <td colspan="3">铝合金与高强度工程塑料</td>
    </tr>
    <tr>
      <td>工作温度</td>
      <td colspan="3">-20 至 55 °C</td>
    </tr>
    <tr>
      <td>使用湿度</td>
      <td colspan="3">10%–90% RH，无凝露</td>
    </tr>
    <tr>
      <td>存储湿度</td>
      <td colspan="3">5%–95% RH，无凝露</td>
    </tr>
    <tr>
      <td>主机防护等级</td>
      <td colspan="3">IP66</td>
    </tr>
    <tr>
      <td>轮毂电机防护等级</td>
      <td>/</td>
      <td>IP67</td>
      <td>IP67</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="12">性能参数</th>
      <td>标配算力</td>
      <td>8 核高性能 CPU</td>
      <td>8 核高性能 CPU</td>
      <td>8 核高性能 CPU + 6 核高性能 CPU（80 TOPS）</td>
    </tr>
    <tr>
      <td>自由度</td>
      <td>12</td>
      <td>16（12 + 4）</td>
      <td>16（12 + 4）</td>
    </tr>
    <tr>
      <td>空载续航时间</td>
      <td>5.5 h</td>
      <td>5.5 h</td>
      <td>4.5 h</td>
    </tr>
    <tr>
      <td>满载续航时间</td>
      <td>3.5 h</td>
      <td>3.5 h</td>
      <td>3 h</td>
    </tr>
    <tr>
      <td>空载最大速度</td>
      <td>3.0 m/s</td>
      <td>3.7 m/s</td>
      <td>3.7 m/s</td>
    </tr>
    <tr>
      <td>额定负载</td>
      <td colspan="3">16 kg</td>
    </tr>
    <tr>
      <td>持续攀爬楼梯的台阶高度</td>
      <td>22 cm</td>
      <td>25 cm</td>
      <td>25 cm</td>
    </tr>
    <tr>
      <td>空载攀高台高度</td>
      <td colspan="3">70 cm</td>
    </tr>
    <tr>
      <td>空载可跨越最大距离</td>
      <td colspan="3">40 cm</td>
    </tr>
    <tr>
      <td>空载最大爬坡角度</td>
      <td colspan="3">40°</td>
    </tr>
    <tr>
      <td>满载最大爬坡角度</td>
      <td colspan="3">35°</td>
    </tr>
    <tr>
      <td>基础动作</td>
      <td>站立、卧倒、匍匐、匍匐前进、向前跳、向上跳</td>
      <td>站立、卧倒、匍匐、匍匐前进、向前跳、向上跳</td>
      <td>站立、卧倒、匍匐、匍匐前进</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="5">关节参数</th>
      <td>执行器类型</td>
      <td colspan="3">高功率密度运动单元</td>
    </tr>
    <tr>
      <td>最大关节扭矩</td>
      <td colspan="3">95 N·m</td>
    </tr>
    <tr>
      <td>铝合金精密关节电机</td>
      <td colspan="3">12 个</td>
    </tr>
    <tr>
      <td>高性能轮毂电机</td>
      <td>/</td>
      <td>4 个</td>
      <td>4 个</td>
    </tr>
    <tr>
      <td>关节运动空间</td>
      <td colspan="3">机身：-28° 至 28°；大腿：-170° 至 66°；小腿：34.5° 至 156°</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="4">感知能力</th>
      <td>相机类型</td>
      <td>双目相机</td>
      <td>双目相机</td>
      <td>双目相机和 4 个鱼眼相机</td>
    </tr>
    <tr>
      <td>IMU</td>
      <td colspan="3">1 个</td>
    </tr>
    <tr>
      <td>3D 激光雷达</td>
      <td>/</td>
      <td>/</td>
      <td>标配</td>
    </tr>
    <tr>
      <td>GPS/RTK 定位模块</td>
      <td>/</td>
      <td>/</td>
      <td>标配</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="3">智能决策</th>
      <td>自主导航</td>
      <td>/</td>
      <td>/</td>
      <td>标配</td>
    </tr>
    <tr>
      <td>智能避障</td>
      <td>标配</td>
      <td>标配</td>
      <td>激光 + 视觉融合避障</td>
    </tr>
    <tr>
      <td>自主跟随</td>
      <td>标配</td>
      <td>标配</td>
      <td>GLUE 全向自主跟随</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="6">通信与交互</th>
      <td>Wi-Fi / 蓝牙</td>
      <td colspan="3">标配</td>
    </tr>
    <tr>
      <td>4G / 5G</td>
      <td>4G</td>
      <td>4G</td>
      <td>5G</td>
    </tr>
    <tr>
      <td>补光灯</td>
      <td colspan="3">前向 1 个</td>
    </tr>
    <tr>
      <td>UWB</td>
      <td colspan="3">标配</td>
    </tr>
    <tr>
      <td>麦克风 / 扬声器</td>
      <td>/</td>
      <td>/</td>
      <td>标配</td>
    </tr>
    <tr>
      <td>功能拓展接口</td>
      <td colspan="3">USB Type-C × 2、M12 17PIN × 1、M14 18PIN × 1、SIM 卡槽 × 1</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="3">拓展能力</th>
      <td>实时图像传输</td>
      <td colspan="3">标配</td>
    </tr>
    <tr>
      <td>OTA 升级</td>
      <td colspan="3">标配</td>
    </tr>
    <tr>
      <td>二次开发</td>
      <td colspan="3">标配</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" rowspan="6">配件</th>
      <td>电池额定容量</td>
      <td colspan="3">14 Ah（705.6 Wh）</td>
    </tr>
    <tr>
      <td>电池重量</td>
      <td colspan="3">4.5 kg</td>
    </tr>
    <tr>
      <td>遥控器</td>
      <td>无屏遥控器</td>
      <td>无屏遥控器</td>
      <td>带屏遥控器</td>
    </tr>
    <tr>
      <td>适配器</td>
      <td colspan="3">标配</td>
    </tr>
    <tr>
      <td>充电座</td>
      <td colspan="3">标配</td>
    </tr>
    <tr>
      <td>充电桩（包含自主回充功能）</td>
      <td colspan="3">可选配</td>
    </tr>
  </tbody>
</table>

## 参数说明

- 尺寸、重量、运动性能和电气参数参考《L2 系列机器狗产品使用说明书》V1.3。实测表现可能因使用环境、操作方式和产品配置而变化。
- 承载负载时，禁止执行向前跳和向上跳动作。
- 产品配置和功能会持续迭代，实际外观、接口和功能以交付设备为准。
- 功能拓展接口的电气定义、功率限制和针脚说明见[硬件接口与系统架构](./03-hardware-interfaces-and-system-architecture.md)。
- 进行上装或结构设计时，可下载 [L2 和 L2-W Ultra 外观模型](./03-hardware-interfaces-and-system-architecture.md#exterior-model-downloads)。
