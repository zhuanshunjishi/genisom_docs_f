# Fault Information Interface

[Return to Software Service Interface](./06-sdk-service-interfaces.md) | [Sensor reporting interface in real time](./06-02-real-time-sensor-data.md)

## Interface Description

The fault information interface is marked in red in the diagram. Faults arrive with robot state messages on UDP receive port `8080`. Use the SDK getter to read the latest cached result. No dedicated fault-query socket is required.

## Communications Parameters

| Parameter | Default |
| --- | --- |
| Robot IP | `192.168.234.1` |
| SDK Receiving port | `8080` |
| Transfer protocol | UDP |
| Message Format | JSON |
| Status Message Type | `fault_info` |

## Reading Fault Information {#retrieving-malfunction-information}

| Field | Contents |
| --- | --- |
| Function Name | `GetFaultInfo` |
| Function Prototype | `std::vector<FaultInfo> GetFaultInfo() const` |
| Function Overview | Read the fault list in the latest `fault_info` status message |
| Parameter | None |
| Return value | A list of `FaultInfo` entries, typically empty when there are no faults |
| Notes | Current public API provides a status-read function, with no separate `QueryFault()` request function |

### FaultInfo Structure

| Field | Type | Description |
| --- | --- | --- |
| `module` | `std::string` | Module reporting the fault |
| `submodule` | `std::string` | Submodule reporting the fault |
| `error_code` | `uint32_t` | Fault code |
| `level` | `std::string` | Fault level |
| `info` | `std::string` | Fault description |

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

## When to Check Faults {#recommended-time-for-inspection}

The application should check faults at least at the following times.

1. After establishing the SDK connection and before sending the first motion command.
2. Before standing up, moving, or performing stunts.
3. At regular intervals during operation.
4. When motor temperature, battery voltage, robot orientation, or communication state is abnormal.
5. After reconnecting following a network interruption or after configuring Wi-Fi.

## Responding to Faults {#treatment-of-recommendations}

- An empty fault list means the latest cached report contains no faults. Hardware risks can still exist.
- When a fault is reported, determine the response using `level`, `error_code`, motor temperature, battery state, and current motion mode.
- If fault severity increases or you observe loss of control, unusual noise, odor, or overheating, stop movement immediately and take over using the available on-site safety controls.
- Retain the original module, submodule, code, severity, and description for unknown faults so they can be investigated.
- Fault information is part of the status report. Confirm that `IsConnected()` returns `true` before reading the fault list.
