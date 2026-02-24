# Android Build Setup (Capacitor)

## Prerequisites

### 1. Java Development Kit (JDK)
Capacitor 8 requires **JDK 17 or higher**.

```bash
# Check current version
java -version

# Install on Ubuntu/Debian
sudo apt install openjdk-17-jdk

# Or use SDKMAN
sdk install java 17.0.11-tem
```

### 2. Android SDK
Install via **Android Studio** (recommended) or command-line tools.

- Download: https://developer.android.com/studio
- During setup, install:
  - Android SDK Platform 35 (Android 15)
  - Android SDK Build-Tools 35.0.0
  - Android Emulator (optional)

Set environment variables in `~/.bashrc` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

Then reload: `source ~/.bashrc`

### 3. Node.js & npm
Already required for Next.js. Node 18+ recommended.

---

## Project Config

**`capacitor.config.ts`** — app ID, name, web output dir, signing options:

```ts
appId: 'com.quranfy.app'
appName: 'Quranfi'
webDir: 'out'          // Next.js static export output
```

**Keystore** — required for signed release builds:
- Path: `~/Documents/quranfi-release-key.jks`
- Alias: `quranfi`
- Passwords stored in `android/keystore.properties` (gitignored — see `keystore.properties.example`)

---

## Build & Sync Workflow

### Full build (web → Android)

```bash
# 1. Build Next.js as static export (sets BUILD_TARGET=capacitor)
npm run build:capacitor

# 2. Copy web assets into the Android project
npx cap sync android

# 3. Open in Android Studio (optional — for running on device/emulator)
npx cap open android
```

### Incremental sync (after web-only changes)

```bash
npm run build:capacitor && npx cap sync android
```

### Copy only (skip npm install / plugin updates)

```bash
npx cap copy android
```

---

## Building an APK / AAB

Open the project in Android Studio, then use:

- **Build > Build Bundle(s) / APK(s) > Build APK(s)** — debug APK
- **Build > Generate Signed Bundle / APK** — signed release APK or AAB for Play Store

Or via Gradle CLI from the `android/` directory:

```bash
# Debug APK
cd android && ./gradlew assembleDebug

# Release APK (requires keystore.properties configured)
cd android && ./gradlew assembleRelease

# Release AAB (for Play Store)
cd android && ./gradlew bundleRelease
```

Output locations:
- APK: `android/app/build/outputs/apk/`
- AAB: `android/app/build/outputs/bundle/`

---

## Useful Capacitor Commands

| Command | Description |
|---|---|
| `npx cap sync android` | Copy web build + update plugins |
| `npx cap copy android` | Copy web build only (faster) |
| `npx cap open android` | Open project in Android Studio |
| `npx cap run android` | Build + deploy to connected device/emulator |
| `npx cap doctor` | Check environment for issues |

---

## Troubleshooting

**`ANDROID_HOME` not set**
Run `npx cap doctor` — it will tell you exactly what's missing.

**Gradle sync fails**
Check that JDK version matches what `android/gradle.properties` expects (`org.gradle.jvmargs=-Xmx1536m`). Increase heap if needed.

**`out/` directory missing**
The `webDir` is `out` — Next.js only writes it with `output: 'export'` in `next.config.ts`. Make sure that's set when `BUILD_TARGET=capacitor`.

**Keystore errors on release build**
Verify `android/keystore.properties` exists and has the correct `storePassword`, `keyPassword` matching your `.jks` file.
