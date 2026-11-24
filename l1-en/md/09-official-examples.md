# Official Examples

[Back to Home](../index.md) | [SDK Guidance for development and operation](./08-sdk-development-guide.md) | [Control command interface](./06-01-control-commands.md)

## Example Source and Selection

This chapter describes the process of using two examples of HighLevel in the official [genisom_L1 _sdk repository](https://github.com/zsibot/genisom_L1_sdk/tree/main).

| Example: | Source | Communications identity | Use scene |
| --- | --- | --- | --- |
| Remote Example | [remote_control.cpp](https://github.com/zsibot/genisom_L1_sdk/blob/main/example/remote_control.cpp) | Default `ROLE_REMOTE` | Get familiar with keyboard remote control, attitude switching and status reading |
| SDK Example: | [sdk_control.cpp](https://github.com/zsibot/genisom_L1_sdk/blob/main/example/sdk_control.cpp) | `ROLE_SDK` | Validation SDK Request for control, movement control and surrender process |

Both examples are keyboard interactive programs, and SDK examples also require manual buttons, which do not automatically perform tasks after startup. It is suggested that the Remote example be completed and the SDK example be validated.

## Run Preparation

Operate on Linux x86_64 or ARM64 (aarch64) equipment, using a compiler supporting C+ +20 and a CMake 3.10 or higher version. See [Chapter VIII](./08-sdk-development-guide.md) for more details on the compilation requirements.

When robots turn on, the equipment will be developed to connect to robotic networks, and the robot will be placed in a flat, open test area.

### Download and Compile

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

Both examples connect to the robot at `192.168.234.1` by default. They send to the robot’s `8081/UDP` port and listen for status on local port `8080/UDP`.

```bash
ip addr
ping -c 4 192.168.234.1
```

Confirm network reachability before running an example. A successful `ping` confirms IP reachability. Verify that UDP status data keeps updating even if you can log in over SSH. If the robot IP or port changes, update the source using the supplied SDK constructor and rebuild the example. The current examples do not parse command-line arguments.

## Remote Example Usage Process

### Start and Read Status

Run in SDK root directory:

```bash
./build/example/remote_control
```

Keeps the focus of the terminal and uses the English input method to read the state in lowercase `i` and does not need to press back to the car. Starts do not necessarily output the operations menu automatically, and terminal input characters do not resonate.

Check battery level, temperature, function mode, control mode, and fault reports. Press `i` repeatedly and compare the readings with the robot. If values are all zero, stale, or abnormal, diagnose the connection before trying to move. A message such as “Moving forward” confirms that the send branch ran. Verify whether the robot executed the motion separately.

### Stand, Move and Stop

The first test proposal is to proceed item by item in the following order and continue after confirmation of feedback at each step:

1. If not currently in remote mode, press `r` for remote control and then press `i` to check the functional mode. See [Control command interface](./06-01-control-commands.md) for the meaning of the mode.
2. Press `2` Request to stand to see if the robot is standing.
3. Briefly press `w` to test forward motion, then press `c` immediately to send zero motion. Verify that the robot stops.
4. The other direction will be separately verified as required and will be stopped after each operation by `c`.
5. Press `1` to get down and confirm that the posture is stable and then press `Ctrl+C` to close the procedure.

**Do not rely on releasing a direction key to stop the robot.** The example reads characters and does not send zero motion on key release itself. Press `c` to send zero motion immediately. If something goes wrong, press `0` to request a software emergency stop and use a separate means of taking control if required on site.

## SDK Example Uses Process

Stop the robot and exit the Remote example first, then from SDK Root directory start:

```bash
./build/example/sdk_control
```

The example creates an executor with the `ROLE_SDK` role. Setting the role is the first step. The program then requests control.

| Step | Action | What to Verify |
| --- | --- | --- |
| 1 | Press `i` | Verify that the status data is valid and that the battery level, temperature, and fault status allow you to continue testing. |
| 2 | Press `k` | Send the request for SDK control ownership. |
| 3 | Press `i` again | Verify that the reported function mode is the SDK mode. |
| 4 | Press `2` | Verify that the robot stands steadily. |
| 5 | Briefly press a movement key once, then immediately press `c` | Verify that the robot moves in the intended direction and then stops. |
| 6 | Press `1` | Verify that the robot lies down and stays still. |
| 7 | Press `r`, then press `i` | Request that control return to the remote controller and verify the reported function mode. |
| 8 | Press `Ctrl+C` | Exit the program. |

Confirm control ownership before sending motion commands. After you press `k`, the terminal message indicates that the command was sent. Check the function-mode enum and its values in the supplied SDK headers and the [control command interface](./06-01-control-commands.md).

If remote control is still unavailable after pressing `r`, stop the robot, check the connection, and use the local remote controller to take over.

## Common Keys

Both examples use the same main control keys. Whether a motion command takes effect depends on control ownership, the robot state, and model support.

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
| `0` | Request a software emergency stop. The robot disables motion and lies down. |
| `k` | Request SDK control ownership |
| `r` | Request remote control ownership |
| `Ctrl+C` | Termination of program; robots should be stopped before exit |

Press `q` to turn left and `0` to request a software emergency stop. Both keys leave the program running.

### Other Function Keys

| Button | Role |
| --- | --- |
| `g` | Request General SDK mode |
| `b` | Balance Standing Mode |
| `p` | Lock Mode |
| `7` | Access to laboratory mode |
| `8` | Exit Laboratory Mode |
| `3` | Jump. |
| `4` | Jump forward |
| `5` | Say hello. |
| `6` | Backflip |
| `9` | Stand on two legs. Press again to cancel. |
| `u` | Crouch to unload |

> **Choosing an SDK mode:** SDK mode (`k`) and General SDK mode (`g`) use different gaits. SDK mode accepts lower speeds for mapping and returning to charge. General SDK mode supports higher speeds for running and climbing stairs. Choose the mode for the task and verify the mode feedback before testing motion.

For the first test, verify only basic postures, single-direction movement, and stopping. The source requires laboratory mode for a jump, forward jump, greeting, backflip, two-legged stand, or unloading crouch. Wheeled models do not support the first five actions. Confirm that the model and firmware support the unloading crouch. Test these actions separately after confirming the model and preparing the test site.

The Remote example also has `o` buttons, but only Wi-Fi function demonstration tips are exported, and the actual settings are referenced and the network configuration will not be modified.

## How to Read and Modify Examples

Read the source in this order: executor construction, keyboard loop, `SetRemote()`, `SetCmd()`, and the status-reading branches.

| Code Position | Concerns |
| --- | --- |
| Executor Structure | Remote uses default identity;SDK visible designation `ROLE_SDK` |
| `switch (ch)` | Operations corresponding to each input character |
| `SetRemote()` | Sending direction motion;`c` for four full zeros |
| `SetCmd()` | Request posturing, functional mode and control switch |
| `case 'i'` | Read battery, mode, velocity, failure and joint status |

After changing the source code, re-execut the build command in the SDK root directory and re-run the generated program. The flow field order and range are shown in [Control command interface](./06-01-control-commands.md), rather than using `0.5` in the source code directly as physical speed in all directions.

The state output is used only for debugging: the current example of some joint output labels is duplicated or mislabelled, and only the first four arrays are printed at the electric temperature. When a specific joint is confirmed, it should be based on the called Getter, the array index and [Sensor reporting interface in real time](./06-02-real-time-sensor-data.md).

For an automated task, replace the keyboard input branches with task logic. Check the connection, confirm control ownership from feedback, reset motion inputs to zero on timeout, and handle unexpected exits. The examples lack a complete automated task and safe shutdown workflow. Implement explicit motion stop and control release before exiting instead of relying on `Ctrl+C`.

## Exit and Common Problems

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
