<div align="center">
<img src="build/icon.png" width="128" alt="Orbit icon">
Orbit
Your operating system's logo, spinning in 3D, with live diagnostics.
![Latest release](https://github.com/kittythek/orbit/releases/latest)
   
![Downloads](https://github.com/kittythek/orbit/releases)

![Platforms](https://img.shields.io/badge/Windows%20%7C%20macOS%20%7C%20Linux-0b1224?style=flat-square)

Download · Donate / Linktree · Kitty's Github
</div>
<!-- Add a screenshot: save one as screenshot.png in the repo, then delete the comment markers around the next line.
!\[Orbit](screenshot.png)

## What it is

Orbit shows the logo of the system you're running as a glowing 3D shape that spins on its own. Drag it to spin it yourself. Next to it, live diagnostics update in real time: CPU, memory, storage, uptime, kernel, architecture, host name, network address, load and battery.

Orbit reads everything locally. It never sends data anywhere.

## Pick your system

|I'm on...|Jump to|
|-|-|
|Windows 10 or 11|[Windows](#windows)|
|A Mac (Apple Silicon or Intel)|[macOS](#macos)|
|Linux|[Linux](#linux)|

The file you want is on the [Releases page](https://github.com/kittythek/orbit/releases/latest), under **Assets**. There are three zips, one per system. Download only the one for your system.

\---

## Windows

### Steps

1. Open the [Releases page](https://github.com/kittythek/orbit/releases/latest).
2. Under **Assets**, click `Orbit-x.x.x-windows.zip` to download it.
3. Open your **Downloads** folder, right-click the zip, and choose **Extract All**, then click **Extract**.
4. Open the new folder and double-click **`Orbit.exe`**.

### If something goes wrong

**A blue box says "Windows protected your PC".**
Windows shows this for any app from a developer it doesn't recognize yet. See [Why you see warnings](#why-you-see-warnings). Click **More info**, then **Run anyway**. You only need to do this once.

**Nothing happens when I double-click.**
You're probably opening it from inside the zip. Windows lets you peek inside zips, but the app can't run from there. Close that window and do step 3 (**Extract All**) first.

**My antivirus deleted or blocked it.**
Antivirus tools are cautious with new, unsigned apps. Open your antivirus, restore the file from quarantine, and allow it. The full source code is in this repo, so you can read exactly what it does.

**The zip won't extract or says it's corrupt.**
The download was probably cut off. Delete it and download it again.

**The window is black or flickers.**
Update your graphics driver, then restart Orbit.

\---

## macOS

### Steps

1. Open the [Releases page](https://github.com/kittythek/orbit/releases/latest).
2. Under **Assets**, click `Orbit-x.x.x-mac.zip` to download it. One download works on both Apple Silicon and Intel Macs.
3. Open your **Downloads** folder and double-click the zip. It unpacks into **Orbit.app**.
4. Drag **Orbit.app** into your **Applications** folder.
5. Right-click (or hold Control and click) **Orbit.app**, choose **Open**, then click **Open** again.

You only need step 5 the first time. After that, open Orbit normally.

### If something goes wrong

**"Orbit cannot be opened because Apple cannot check it for malicious software."**
See [Why you see warnings](#why-you-see-warnings). Fix it like this:

1. Click **Done** (or **Cancel**) on the message.
2. Open **System Settings**, then **Privacy \& Security**.
3. Scroll down to the **Security** section. You'll see a message about Orbit being blocked.
4. Click **Open Anyway** and enter your Mac password.
5. Click **Open** on the last box.

On macOS 15 (Sequoia) and newer, this settings route is the only way. The right-click trick from step 5 only works on older versions.

**"Orbit is damaged and can't be opened."**
The app isn't damaged. macOS puts a "downloaded from the internet" tag on files, and this message is what it shows when that tag meets an unsigned app. Remove the tag:

1. Press **Cmd + Space**, type `Terminal`, and press Return.
2. Type `xattr -cr ` (with a space after it). Don't press Return yet.
3. Drag **Orbit.app** from your Applications folder into the Terminal window. Its path appears.
4. Press **Return**, then open Orbit again.

**I can't find Orbit.app after downloading.**
Check your Downloads folder. If you only see the zip, double-click it to unpack it.

\---

## Linux

### Steps

1. Open the [Releases page](https://github.com/kittythek/orbit/releases/latest).
2. Under **Assets**, click `Orbit-x.x.x-linux.zip` to download it.
3. Open your file manager, right-click the zip, and choose **Extract Here**.
4. Open the new folder and double-click the file named **`orbit`**. If asked, choose **Run**.

Prefer the terminal? These do the same thing:

```bash
cd \~/Downloads
unzip Orbit-\*-linux.zip -d Orbit
cd Orbit
./orbit
```

### If something goes wrong

**Nothing happens when I double-click `orbit`.**
Some file managers don't run programs on double-click, or the file lost its permission to run. Open a terminal in the folder and run:

```bash
chmod +x orbit
./orbit
```

`chmod +x` marks the file as a program. Any error messages will show in the terminal, which helps a lot if you need to ask for help.

**"error while loading shared libraries..."**
Your system is missing a common library that apps like this need. Install them:

```bash
# Ubuntu, Debian, Linux Mint, Pop!\_OS
sudo apt install libgtk-3-0 libnss3 libgbm1 libasound2
# On Ubuntu 24.04 and newer, use libasound2t64 instead of libasound2

# Fedora
sudo dnf install gtk3 nss mesa-libgbm alsa-lib
```

Then run `./orbit` again.

**The window is blank, black, or glitchy.**
Your graphics setup may not like hardware drawing. Try:

```bash
./orbit --disable-gpu
```

**Orbit shows a penguin instead of my distro's logo.**
Orbit has its own logos for Ubuntu, Debian, Arch, Fedora and Linux Mint. Every other distro gets the penguin, but your distro's real name and version still show underneath.

\---

## Why you see warnings

Apps from big publishers carry a paid "digital signature" from Windows or Apple, a bit like a stamp from a known sender. Orbit is free and independent, so it doesn't have one yet. Your system can't recognize the sender and warns you, even though nothing is wrong with the file.

Only download Orbit from this page's **Releases**. If you downloaded it from somewhere else, don't run it.

## Controls

|Action|What it does|
|-|-|
|Drag the logo|Spin and tilt it|
|Click or press any key during boot|Skip the boot animation|

\---

## For developers

You don't need any of this to just use Orbit.

### Get the code with Git

Git is the tool that copies a project from GitHub to your computer.

1. **Install Git:** download it from [git-scm.com](https://git-scm.com), or on Mac run `brew install git`, or on Linux run `sudo apt install git`.
2. **Install Node.js** (the LTS version) from [nodejs.org](https://nodejs.org). Orbit needs it to run from source.
3. **Open a terminal.** On Windows, search for "Command Prompt". On Mac, search for "Terminal".
4. **Copy the project to your computer:**

```bash
   git clone https://github.com/kittythek/orbit.git
   ```

   This makes a folder called `orbit`.

5. **Go into the folder:**

```bash
   cd orbit
   ```

6. **Install what Orbit depends on** (this takes a minute):

```bash
   npm install
   ```

7. **Start it:**

```bash
   npm start
   ```

### Build the zips

```bash
npm run dist
```

The zip for your current system appears in a new `dist` folder. To build all three systems at once, push a version tag and GitHub builds them for you:

```bash
git tag v1.0.1
git push origin v1.0.1
```

The recipe is in `.github/workflows/build.yml`. When it finishes (about 5 to 10 minutes), the zips appear on your Releases page.

### Customize

|What|Where|
|-|-|
|OS logos|`LOGOS` in `app.js`|
|Accent color per system|`COLORS` in `app.js`|
|Look and animation|`style.css`|
|App icon|`build/icon.png` (1024x1024)|

\---

## Support

If you like Orbit, you can support it here: [**Donate / Linktree**](https://linktr.ee/Sin10)

Made by [Kitty](https://github.com/kittythek).
