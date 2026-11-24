# Wi-Fi Hotspot Configuration Interface

[Return to Software Service Interface](./06-sdk-service-interfaces.md) | [Control command interface](./06-01-control-commands.md)

## Interface Description

The Wi-Fi hotspot configuration interface is marked in red in the diagram. Use it to request a change to the robot hotspot’s name or password and read the asynchronous configuration result.

The SDK sends the request over UDP port `8081` and receives the configuration result on port `8080`. The robot can switch networks immediately after a Wi-Fi change. Reconnect to the new hotspot.

## Communications Parameters

| Parameter | Default |
| --- | --- |
| Robot IP | `192.168.234.1` |
| SDK Send port | `8081` |
| SDK Receiving port | `8080` |
| Transfer protocol | UDP |
| Message Format | JSON |

## Set Wi-Fi Information {#set-wifi-info}

| Field | Contents |
| --- | --- |
| Function Name | `SetWifi` |
| Function Prototype | `void SetWifi(const WifiInfo &wifi_info)` |
| Function Overview | Request a change to the robot’s Wi-Fi hotspot name and password |
| Parameter | `wifi_info.ssid`: new SSID; `wifi_info.password`: new password |
| Return value | None. Changes are sent back by robots |
| Notes | A Wi-Fi change may interrupt the current connection. Reconnect to the new hotspot. |

### WifiInfo Structure

| Field | Type | Description |
| --- | --- | --- |
| `ssid` | `string` | Wi-Fi network name |
| `password` | `string` | Wi-Fi password |

## Read Wi-Fi Configuration Results {#read-wifi-configuration-results}

| Functions | Function Prototype | Description |
| --- | --- | --- |
| `GetWifiResutlf` | `std::optional<bool> GetWifiResutlf() const` | Returns `true` if the Wi-Fi change succeeded, `false` if it failed, or `std::nullopt` while the result is pending |
| `IsRecvWifiResult` | `bool IsRecvWifiResult() const` | Checks whether the SDK has received the Wi-Fi configuration result |
| `GetWifiSsid` | `std::string GetWifiSsid() const` | Reads the Wi-Fi SSID from the current robot state |

> `GetWifiResutlf` is the existing spelling of the current public header file. The application code should be called by the function name of the header file and should not be changed to `GetWifiResult`.

## Call Example

```cpp
WifiInfo wifi;
wifi.ssid = "new_robot_wifi";
wifi.password = "new_password";
robot.SetWifi(wifi);

// Check the asynchronous result after calling SetWifi().
if (robot.IsRecvWifiResult()) {
    auto result = robot.GetWifiResutlf();
    if (result.has_value() && result.value()) {
        // Reconnect to the new hotspot after the change succeeds.
    }
}
```

## Recommended Operation Process

1. Create the SDK executor and verify that `IsConnected()` returns `true`.
2. Check the current Wi-Fi status to confirm you are connected to the intended robot.
3. Set the new SSID and password, then call `SetWifi()`.
4. Wait until `IsRecvWifiResult()` returns `true`.
5. Use `GetWifiResutlf()` to judge if the configuration is successful.
6. After a successful change, reconnect to the robot’s new hotspot.
7. Recheck IP reachability, the SDK connection, and the robot’s fault status.

## Attention

- Do not assume that the new configuration is effective immediately after `SetWifi()` calls.
- Changing Wi-Fi settings interrupts UDP communication. Allow time for the application to reconnect.
- Use characters and lengths that the device supports for the SSID and password. The specific limits depend on the installed firmware.
- Keep Wi-Fi passwords out of public code repositories, logs, and commit records.
- Wi-Fi configuration and motion control share the same SDK communication object. Leave ports `8080` and `8081` bound to the SDK.
