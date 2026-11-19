# Official examples

[Back to Home](../index.md) | [SDK Guidance for development and operation](./08-sdk-development-guide.md) | [Control command interface](./06-01-control-commands.md)

## Example source and selection

This chapter describes the process of using two examples of HighLevel in the official [genisom_L1 _sdk repository](https://github.com/zsibot/genisom_L1_sdk/tree/main).

| Example: | Source | Communications identity | Use scene |
| --- | --- | --- | --- |
| Remote Example | [remote_control.cpp](https://github.com/zsibot/genisom_L1_sdk/blob/main/example/remote_control.cpp) | Default `ROLE_REMOTE` | Get familiar with keyboard remote control, attitude switching and status reading |
| SDK Example: | [sdk_control.cpp](https://github.com/zsibot/genisom_L1_sdk/blob/main/example/sdk_control.cpp) | `ROLE_SDK` | Validation SDK Request for control, movement control and surrender process |

Both examples are keyboard interactive programs, and SDK examples also require manual buttons, which do not automatically perform tasks after startup. It is suggested that the Remote example be completed and the SDK example be validated.

## Run Preparation

Operate on Linux x86_64 or ARM64 (aarch64) equipment, using a compiler supporting C+ +20 and a CMake 3.10 or higher version. See [Chapter VIII](./08-sdk-development-guide.md) for more details on the compilation requirements.

When robots turn on, the equipment will be developed to connect to robotic networks, and the robot will be placed in a flat, open test area.

### Download and compile

The following command applies to the Linux environment using apt:

```bash
sudo apt update
sudo apt install -y git build-essential cmake

git clone https://github.com/zsibot/genisom_L1_sdk.git
cd genisom_L1_sdk
uname -m

cmake -S . -B build
cmake --build build --target remote_control sdk_control -j2

ls -l build/example/remote_control build/example/sdk_control
```

Existing SDK Folders can be entered directly into their root directory from `uname -m` Start starting. Root directory should contain `CMakeLists.txt`,  `example/`,  `include/` and `lib/`. The above command is constructed using the root project, with the background running paths SDK Root directory is the starting point and does not need to be installed first SDK To the system directory.

The root project selects the corresponding `libzsibot.a` for x86_64 or aarch64. Check if `lib/x86_64/` or `lib/aarch64/` contains the corresponding static library when the configuration is wrong. Do not use the static library of another platform for this machine only by modifying the structure parameters.

Build path based on [Root Build Configuration](https://github.com/zsibot/genisom_L1_sdk/blob/main/CMakeLists.txt) and [Example Build Configuration](https://github.com/zsibot/genisom_L1_sdk/blob/main/example/CMakeLists.txt) of the repository.

### Confirm Network

Two examples of default connection robots `192.168.234.1` Send it to the robot. `8081/UDP` It's on the machine. `8080/UDP` Receiving status.

```bash
ip addr
ping -c 4 192.168.234.1
```

Make sure the network is accessible, then run an example. `ping` Success means only IP The link's within reach. We still need confirmation. UDP Status updated on an ongoing basis; SSH It doesn't mean it's a good login. SDK Connected. If field changes IP or port, by delivery SDK. The current example does not provide an explanation of the command line parameters.

## Remote Example Usage Process

### Start and Read Status

Run in SDK root directory:

```bash
./build/example/remote_control
```

Keeps the focus of the terminal and uses the English input method to read the state in lowercase `i` and does not need to press back to the car. Starts do not necessarily output the operations menu automatically, and terminal input characters do not resonate.

Focus on checking power, temperature, function mode, mode of control and failure information. Press `i` many times to confirm the validity of the robot ' s state in the light of the actual situation; when zero, long-term constant or abnormal values appear, check the connection and do not attempt to move directly. The program print text " Move forward " means only the corresponding transmission branch, and does not mean that the robot has been successful.

### Stand, move and stop

The first test proposal is to proceed item by item in the following order and continue after confirmation of feedback at each step:

1. If not currently in remote mode, press `r` for remote control and then press `i` to check the functional mode. See [Control command interface](./06-01-control-commands.md) for the meaning of the mode.
2. Press `2` Request to stand to see if the robot is standing.
3. Briefly press `w` to test forward motion, then press `c` immediately to send zero motion. Verify that the robot stops.
4. The other direction will be separately verified as required and will be stopped after each operation by `c`.
5. Press `1` to get down and confirm that the posture is stable and then press `Ctrl+C` to close the procedure.

**Releasing a direction key does not stop the robot.** The example reads characters and does not send zero motion when a key is released. Press `c` to stop. If something goes wrong, press `0` to request a software emergency stop and use a separate means of taking control if required on site.

## SDK Example uses process

Stop the robot and exit the Remote example first, then from SDK Root directory start:

```bash
./build/example/sdk_control
```

The example creates an implementer using the `ROLE_SDK` identity. The identification is a two-step process and the acquisition of control is followed by an application for control.

| Steps | Action | Confirm content |
| --- | --- | --- |
| 1 | Press `i` | Power, temperature and failure information allowed to continue testing. |
| 2 | Press `k` | Transmission SDK Application for control |
| 3 | Press again `i` | Check functional mode feedback switched to SDK Corresponding Mode |
| 4 | Press `2` | Hold on to the robots. |
| 5 | Press the short arrow once, then press `c` | One-way movement and cessation are effective. |
| 6 | Press `1` | The robots are down and steady. |
| 7 | Press `r`, press `i` | Request for surrender of Remote control and reconciliation of mode feedback |
| 8 | Press `Ctrl+C` | Closure of the procedure |

Do not continue to send a motion order if the right of control is not confirmed; a terminal hint after `k` indicates only that the order has been issued. The count and value of the functional mode are based on the delivery of the head document SDK and [Control command interface](./06-01-control-commands.md).

If you press `r` The post-module was not restored, and the robots were stopped, the connection was checked and the takeover was confirmed by remote means on-site.

## Common Keys

The primary control keys of the two examples are consistent, and the effectiveness of the movement depends on current control, robotic state and type support.

| Button | Role |
| --- | --- |
| `i` | Print Device Status |
| `2` | Please stand. |
| `1` | Please, get down. |
| `w` | Forward! |
| `s` | Back |
| `a` | Shift left |
| `d` | Shift right |
| `q` | Turn left. |
| `e` | Turn right. |
| `c` | Send zero motion, stop moving |
| `0` | We're going to have to stop. We're going down. |
| `k` | Request SDK Right of control |
| `r` | Request Remote Control |
| `Ctrl+C` | Termination of program; robots should be stopped before exit |

Note that `q` is a left switch, not an exit key; `0` is a software emergency stop and will not exit the program.

### Other function keys

| Button | Role |
| --- | --- |
| `g` | Request common SDK mode |
| `b` | Balance Standing Mode |
| `p` | Lock Mode |
| `7` | Access to laboratory mode |
| `8` | Exit Laboratory Mode |
| `3` | Jump. |
| `4` | Jump! |
| `5` | Say hello. |
| `6` | Backwards. |
| `9` | Stand up and press your legs again. |
| `u` | Unload the cargo and get down. |

> **Choosing an SDK mode:** SDK mode (`k`) and General SDK mode (`g`) use different gaits. SDK mode accepts lower speeds for mapping and returning to charge. General SDK mode supports higher speeds for running and climbing stairs. Choose the mode for the task and verify the mode feedback before testing motion.

For the first test, verify only basic postures, single-direction movement, and stopping. The source requires laboratory mode for a jump, forward jump, greeting, backflip, two-legged stand, or unloading crouch. Wheeled models do not support the first five actions. Confirm that the model and firmware support the unloading crouch. Test these actions separately after confirming the model and preparing the test site.

The Remote example also has `o` buttons, but only Wi-Fi function demonstration tips are exported, and the actual settings are referenced and the network configuration will not be modified.

## How to read and modify examples

When reading the source code, you can then view the implementer 's construction, keyboard loop, `SetRemote()`,  `SetCmd()` And state reads the branch.

| Code Position | Concerns |
| --- | --- |
| Executor Structure | Remote uses default identity;SDK visible designation `ROLE_SDK` |
| `switch (ch)` | Operations corresponding to each input character |
| `SetRemote()` | Sending direction motion;`c` for four full zeros |
| `SetCmd()` | Request posturing, functional mode and control switch |
| `case 'i'` | Read battery, mode, velocity, failure and joint status |

After changing the source code, re-execut the build command in the SDK root directory and re-run the generated program. The flow field order and range are shown in [Control command interface](./06-01-control-commands.md), rather than using `0.5` in the source code directly as physical speed in all directions.

The state output is used only for debugging: the current example of some joint output labels is duplicated or mislabelled, and only the first four arrays are printed at the electric temperature. When a specific joint is confirmed, it should be based on the called Getter, the array index and [Sensor reporting interface in real time](./06-02-real-time-sensor-data.md).

When developing an automated mission, you need to replace the keyboard branch with an operational control logic and complement the connection effectiveness check, control feedback confirmation, motion overtime zero and abnormal exit processing. Examples do not provide a complete automatic task and security exit mechanism, and it cannot be assumed that `Ctrl+C` will automatically enforce the suspension or surrender of control.

## Exit and common problems

Both programs modify the terminal input mode and, if the content is not shown after exit, you can type the following commands and return to the car:

```bash
stty sane
```

Refurbish `reset` terminals as necessary.

| The phenomenon | Query and processing |
| --- | --- |
| Executable not found | Confirms that the root project is constructed and is currently in SDK root directories; check `build/example/` |
| Failed to compile or link | Check C+ +20 Support, architecture and corresponding static libraries; see chapter VIII for further details |
| Program runs but does not respond to buttons | Confirm terminal focus using interactive terminals, English input methods and lowercase letters |
| Terminal printing actions but robots don't move | Inspection UDP Connection, current control, mode, failure and type support |
| SDK Example motion invalid | Press `k`; read functional mode to confirm; setting only `ROLE_SDK` is not sufficient |
| Zero or long-term. | Inspection IP, UDP Ports, firewalls and robotic services, suspension of exercise tests |
| The robot is still moving after the break. | Actively press `c`; for example, no key release automatically to zero |
| Could not bind receiving port | Try again after exiting another SDK example or occupying the machine 8080/ UDP |
| Terminal does not return after exit | Implementation `stty sane`, if necessary `reset` |

[Back to Home](../index.md) | [Previous chapter: SDK Development and operation guidelines](./08-sdk-development-guide.md)
