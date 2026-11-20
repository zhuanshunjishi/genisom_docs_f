# Wi-Fi Hotspot Configuration Interface

[Return to Software Service Interface](./06-sdk-service-interfaces.md) | [Control command interface](./06-01-control-commands.md)

## Interface Description

WiFi hotspot configuration interface corresponds to the " WiFi hotspot configuration port" in the red box, which is used to request changes to the robot WiFi hotspot name and password, and to read the configuration results of the hiccup return.

Current SDK Use UDP Send Port `8081` Send configuration request, via the receiving port `8080` Receives the configuration results. Changes to WiFi may change the robot network immediately and applications need to reconnect to new hot spots.

## Communications Parameters

| Parameter | Default |
| --- | --- |
| Robot IP | `192.168.234.1` |
| SDK Send port | `8081` |
| SDK Receiving port | `8080` |
| Transfer protocol | UDP |
| Message Format | JSON |

## Set WiFi Info

| Field | Contents |
| --- | --- |
| Function Name | `SetWifi` |
| Function Prototype | `void SetWifi(const WifiInfo &wifi_info)` |
| Function Overview | Request changes to robot WiFi's hotspot name and password |
| Parameter | `wifi_info.ssid`: new SSID; `wifi_info.password`: new password |
| Return value | None. Changes are sent back by robots |
| Notes | After changing WiFi, the current connection may be disconnected and new hot spots need to be reconnected |

### WifiInfo Structure

| Field | Type | Description |
| --- | --- | --- |
| `ssid` | `string` | WiFi Name |
| `password` | `string` | WiFi Password |

## Read WiFi Configuration Results

| Functions | Function Prototype | Description |
| --- | --- | --- |
| `GetWifiResutlf` | `std::optional<bool> GetWifiResutlf() const` | returns WiFi configuration results;`true` succeeded, `false` failed, `std::nullopt` indicates that results have not yet been received |
| `IsRecvWifiResult` | `bool IsRecvWifiResult() const` | Finds if the WiFi configuration has been received |
| `GetWifiSsid` | `std::string GetWifiSsid() const` | Read WiFi in current state SSID |

> `GetWifiResutlf` is the existing spelling of the current public header file. The application code should be called by the function name of the header file and should not be changed to `GetWifiResult`.

## Call Example

```cpp
WifiInfo wifi;
wifi.ssid = "new_robot_wifi";
wifi.password = "new_password";
robot.SetWifi(wifi);

// The configuration results in a walkback and cannot be assumed to be successful immediately after SetWifi()
if (robot.IsRecvWifiResult()) {
    auto result = robot.GetWifiResutlf();
    if (result.has_value() && result.value()) {
        // Configure successfully to reconnect the new WiFi
    }
}
```

## Recommended Operation Process

1. Create SDK Executor confirmed. `IsConnected()` Yes. `true`.
2. Reads the current WiFi status to confirm that the current connection object is correct.
3. Sets new SSID and passwords and calls `SetWifi()`.
4. Waiting `IsRecvWifiResult()` returns `true`.
5. Use `GetWifiResutlf()` to judge if the configuration is successful.
6. When the configuration is successful, reconnect the new robot hotspots.
7. Reconfirm IP capable of reaching, SDK connectivity and robotic failure.

## Attention

- Do not assume that the new configuration is effective immediately after `SetWifi()` calls.
- The modification of WiFi would result in the interruption of the current UDP communication and the procedure should allow for a period of reconnection.
- SSID and the password shall use the characters and lengths supported by the device, with a specific limitation based on the current solid.
- Do not write WiFi configuration passwords to public codes, logs or submission records.
- WiFi configuration interfaces and movement control interfaces are shared SDK communication objects, and applications should not bind separately `8080` or `8081`.
