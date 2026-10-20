# Orbit

A spinning 3D logo of your operating system with live diagnostics. It shows the Windows, macOS or Linux distro logo you're actually running, extruded and rotating, next to live CPU, memory, storage, uptime, kernel, network and battery readouts.

Works on Windows, macOS and Linux. Drag the logo to spin it. Click anywhere to skip the boot animation.

## Download

Grab the zip for your system from **Releases**, unzip it, and run it.

| System | File | Unzip, then |
| --- | --- | --- |
| Windows | `Orbit-x.x.x-windows.zip` | Open the folder and double-click `Orbit.exe`. If SmartScreen appears: **More info → Run anyway**. |
| macOS | `Orbit-x.x.x-mac.zip` | Double-click `Orbit.app`. First launch: right-click → **Open**. If macOS says it's "damaged", run `xattr -cr Orbit.app` in Terminal and open it again. |
| Linux | `Orbit-x.x.x-linux.zip` | Open the folder and double-click `orbit` (choose "Run"). If nothing happens, run `chmod +x orbit && ./orbit` in a terminal. |

The warnings appear because the builds aren't code-signed. Signing needs paid certificates (Apple Developer ID, Windows code-signing).

## Run from source

```bash
npm install
npm start
```

## Build and publish with GitHub Actions

1. Create a GitHub repo named `orbit` (or edit `repository` in `package.json`) and push this folder.
2. Tag a release:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. The workflow in `.github/workflows/build.yml` builds Windows, macOS and Linux and attaches them to a **draft** release. Open it on GitHub and click **Publish release**.

You can also run the workflow by hand from the **Actions** tab to get the builds as downloadable artifacts.

## Customize

- Logos live in `app.js` (`LOGOS`). Linux distro marks are simplified, so swap in official SVGs if you want exact brand shapes.
- Accent colors per OS are in `COLORS`.
- Icon source: `build/icon.png` (1024×1024).

Links in the app: [Donate / Linktree](https://linktr.ee/Sin10) · [Kitty's Github](https://github.com/kittythek)
