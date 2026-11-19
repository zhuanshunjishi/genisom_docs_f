# Fault information interface

[Return to Software Service Interface](./06-sdk-service-interfaces.md) | [Sensor reporting interface in real time](./06-02-real-time-sensor-data.md)

## Interface description

The fail information query interface corresponds to the " fail information query port " in the red box, which is used to read the list of failures carried in robotic status messages. Currently, SDK there are no separate fault queries socket, failure information is reported via UDP receiver port `8080` with robotic status, and the application uses the query function to read the latest cache result.

## Communications parameters

| Parameter | Default |
| --- | --- |
| Robot IP | `192.168.234.1` |
| SDK Receiving port | `8080` |
| Transfer protocol | UDP |
| Message Format | JSON |
| Status Message Type | `fault_info` |

## Retrieving malfunction information

| Field | Contents |
| --- | --- |
| Function Name | `GetFaultInfo` |
| Function Prototype | `std::vector<FaultInfo> GetFaultInfo() const` |
| Function Overview | Read list of malfunctions in last `fault_info` status message |
| Parameter | None |
| Return value | `FaultInfo` Lists; usually empty lists when there is no malfunction |
| Notes | Current public API provides a status-read function, with no separate `QueryFault()` request function |

### FaultInfo Structure

| Field | Type | Description |
| --- | --- | --- |
| `module` | `std::string` | The module to which the malfunction belongs |
| `submodule` | `std::string` | Submodules for malfunctions |
| `error_code` | `uint32_t` | Fault Code |
| `level` | `std::string` | Fault Level |
| `info` | `std::string` | Description of failure |

## Call Example

```cpp
auto faults = robot.GetFaultInfo();
if (faults.empty()) {
    std::cout << "No current fault information\n";
} else {
    for (const auto &fault : faults) {
        std::cout << fault.module << " / "
                  << fault.submodule << " / "
                  << fault.error_code << " / "
                  << fault.level << " / "
                  << fault.info << '\n';
    }
}
```

## Recommended time for inspection

The application should read out the malfunction at least at the following times:

1. SDK After the connection has been established, the first movement command is sent.
2. Stand, move or perform stunt actions.
3. Checks are carried out on a regular basis.
4. When electrical temperature, battery voltage, attitude or communication state abnormality is observed.
5. Disconnected reconnection or WiFi configuration is completed.

## Treatment of recommendations

- The list of faults was empty only to indicate that there had been no malfunctions in the latest cache and not that all hardware risks had been eliminated.
- Upon receipt of the failure, the treatment shall be determined in combination with `level`, `error_code`, electric temperature, battery state and current mode of movement.
- When failure levels rise, out of control, abnormal sound, odor or overheating occur, the movement should cease immediately and take over using on-site security means.
- Do not simply ignore the unknown fault code in the program; original modules, submodules, codes, classes and descriptions should be kept to facilitate searching.
- The malfunction information is part of the status report and shall be confirmed as `IsConnected()` `true` before reading.
