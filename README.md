# HomeYield

A responsive, offline-capable plant-care companion. The same dependency-free HTML/CSS/JavaScript frontend runs in a browser/PWA and in a **Tauri 2** native application.

## Storage and project layout

- **Static web / GitHub Pages:** garden state lives in the browser's `localStorage`; the service worker caches the application for offline use. Data belongs to that browser/profile.
- **Tauri desktop and mobile:** Rust commands `load_state` / `save_state` persist garden JSON in native SQLite, using bundled SQLite through `rusqlite`. The database is `homeyield.sqlite3` in Tauri's application-local data directory. The identifier remains `com.homeyield.android13.preview` to preserve the existing app identity and data location. Changing it is a migration, not a cosmetic rename.
- **Optional Python mode:** `python server.py` serves the frontend on `http://127.0.0.1:4173` and adds `/api/state` backed by `data/homeyield.sqlite3`. It is a separate local-only mode, not the production desktop backend. Do not expose this development server to the internet.

`Cargo.toml`, `lib.rs`, `main.rs`, `build.rs`, and `tauri.conf.json` intentionally live at the repository root. Cargo declares explicit source paths; Tauri capabilities live in `capabilities/`. Native icons are the existing root PNG/ICO/ICNS files. No `src-tauri` directory is required.

The root web files are authoritative. `npm run build` deterministically recreates ignored `dist/` from an explicit public-asset list, including `downloads.html`, `downloads.js`, and `downloads.css`. It never copies Rust source, Python, databases, or signing material. Neither native builds nor Pages deployments rely on committed build output. `sync-tauri-frontend.sh` calls the same cross-platform Node build script.

The flattened `MainActivity.java`, `AndroidManifest.xml`, Gradle files, and associated Android resources are **legacy reference files**, not the supported build. Do not run the root `gradlew` to build HomeYield. Tauri generates the actual mobile projects under ignored `gen/android` and `gen/apple`.

## Development

Install Node.js 22 or newer (24 LTS recommended). In PowerShell, use `npm.cmd` if your execution policy blocks `npm.ps1`; no policy change is necessary.

```powershell
npm ci
npm test
npm run dev
```

Open `http://127.0.0.1:4173`. The dependency-free Node server serves only the public frontend files and uses browser storage. To test the separate SQLite HTTP mode, stop it and run `python server.py` instead. Run `npm run build` to generate the deployable static site. To preview that build:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

For native development, also install stable Rust and the [Tauri platform prerequisites](https://v2.tauri.app/start/prerequisites/): Windows MSVC C++ Build Tools and WebView2; macOS Xcode; or Linux WebKitGTK 4.1 and related development libraries. The npm Tauri CLI is pinned in `package.json` / `package-lock.json`; there is no global CLI requirement.

```powershell
npm run tauri -- dev
cargo check --locked
cargo test --locked
```

Do not start a second server on port 4173 before `tauri dev`, which starts `npm run dev` itself. `npm test` uses the built-in Node test runner for frontend, offline caching, and packaging regression tests. Static hosting uses browser storage by default; the Python server explicitly opts its entry page into the SQLite HTTP backend.

### Responsive and native verification

```powershell
npx playwright install chromium webkit
npm run test:ui
# After building the Windows release:
npm run test:windows
```

The browser suite covers onboarding, watering, records, the plant library, plant help, progress, location, themes, and downloads at 14 viewport sizes from 280px through 3840px, including landscape. Selected phone, tablet, and desktop flows also run in WebKit, the engine used on Apple platforms. It checks horizontal overflow, navigation reachability, keyboard focus, offline loading, native link handling, and release-API error/retry states. It starts an isolated Python preview server on port 4187 automatically, so you can leave `npm run dev` running on port 4173; Python 3 is required. Set `HOMEYIELD_TEST_PORT` to override the test port. No real weather locations or garden records are sent by these tests.

The Windows smoke test starts the actual built application with a temporary WebView profile, verifies rendering and native SQLite commands without writing test garden data, visits the bundled download page, and checks the system-browser opener scope. It closes the app and removes the temporary browser profile afterward. Rust tests use an in-memory SQLite database. GitHub Actions runs browser and unit checks before desktop release builds.

## Desktop installers

Build on the matching operating system. A Windows host cannot produce a usable macOS DMG or provisioned iOS build.

```powershell
# Windows: release executable and current-user NSIS installer
npm run build:windows -- -- --locked
# Optional stable local download name
npm run release:stage -- windows x64
```

The executable is `target\release\homeyield.exe`; the installer is under `target\release\bundle\nsis`. Staging copies it to `release-assets\HomeYield-windows-x64-setup.exe`. The NSIS installer may need internet access to obtain WebView2 if the runtime is missing. Windows installers are currently **not Authenticode-signed**; SmartScreen may warn. No signing bypass or machine-policy change is required to build.

After staging, `npm run dev` serves the actual installer through the download page at `http://127.0.0.1:4173/downloads.html`. It labels these as **local builds, not published** and only exposes known installer filenames with valid file signatures. Binaries are not copied into `dist/` or committed. Static deployments and the bundled native app continue to check GitHub Releases instead.

For Windows ARM64, install the MSVC ARM64 C++ tools and Rust target first, then use:

```powershell
rustup target add aarch64-pc-windows-msvc
npm run tauri -- build --target aarch64-pc-windows-msvc --bundles nsis -- --locked
npm run release:stage -- windows arm64 target\aarch64-pc-windows-msvc\release\bundle
```

On macOS, use `npm run tauri -- build --bundles dmg -- --locked`; select `--target x86_64-apple-darwin` for Intel or `--target aarch64-apple-darwin` for Apple silicon after installing that Rust target. On Linux, use `npm run tauri -- build --bundles deb,appimage -- --locked`. Build Linux ARM64 on a native ARM64 runner rather than pretending an x64 AppImage is portable.

## Downloads and release availability

Open [`downloads.html`](downloads.html) or the repository's [GitHub Releases](https://github.com/gorhinstroebel/HomeYield/releases). **A configured workflow is not a published binary.** No releases are published simply by cloning or building this repository. The downloads page checks actual published release assets; missing builds must not be presented as available. Local installers and Actions artifacts are separate from public GitHub Release downloads.

`.github/workflows/release.yml` runs on version tags such as `v1.0.1`; a manual run builds artifacts without publishing. Before tagging, keep the versions in Cargo, Tauri, npm, and the npm lockfile aligned. Only a maintainer should create/push the release tag after reviewing and testing the changes.

| Platform | Required public asset names |
| --- | --- |
| Windows x64 | `HomeYield-windows-x64-setup.exe` |
| Windows ARM64 | `HomeYield-windows-arm64-setup.exe` |
| macOS Intel | `HomeYield-macos-x64.dmg` |
| macOS Apple silicon | `HomeYield-macos-arm64.dmg` |
| Linux x64 | `HomeYield-linux-x64.deb`, `HomeYield-linux-x64.AppImage` |
| Linux ARM64 | `HomeYield-linux-arm64.deb`, `HomeYield-linux-arm64.AppImage` |

Every matrix job uploads its completed bundles as Actions artifacts first. Only when **all six required jobs succeed** does the publication job download all eight files, validate their signatures, write `SHA256SUMS`, upload into a draft release, then publish. A failed platform leaves no newly published partial release. Rerunning can finish a draft, but refuses to overwrite an already published release. Prerelease tags are marked prereleases. Artifacts are retained for 14 days; permanent public download URLs exist only after successful publication.

The native ARM64 Linux runner (`ubuntu-22.04-arm`) requires a repository/account with access to that hosted runner. If it is unavailable, the complete release remains blocked; do not silently substitute an x64 binary. Linux builds target Ubuntu 22.04 or compatible newer systems, not every distribution: `.deb` requires WebKitGTK 4.1; AppImage may require FUSE 2 or `--appimage-extract-and-run`. Cross-platform CI builds do not replace physical device testing.

macOS Developer ID signing/notarization is optional and requires `APPLE_CERTIFICATE` (base64 P12), `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, and notarization credentials `APPLE_ID`, `APPLE_PASSWORD` (app-specific), `APPLE_TEAM_ID`. Without them, builds are unnotarized and Gatekeeper may block them. A partial or invalid signing configuration should fail rather than be described as signed.

After collecting all desktop artifacts into `release-assets`, run `npm run release:verify` to regenerate their checksums. On Windows, `Get-FileHash release-assets\HomeYield-windows-x64-setup.exe -Algorithm SHA256` checks an individual file. Checksums detect download corruption; they are not a substitute for platform code signing.

## Android: real Tauri APKs

### Installable local preview

```powershell
npm ci
rustup target add aarch64-linux-android
npm run build:android:preview
```

This produces `release-assets\HomeYield-android-arm64-preview.apk` and its `.sha256` checksum for ARM64 phones running Android 7.0 or later with an up-to-date Android System WebView. The APK uses optimized release code and the real Tauri/SQLite backend. It is **signed with the standard local Android development key**, not a production key, and is not suitable for Google Play. The local downloads page offers it after building; the script does not upload it anywhere.

On Windows without symlink permission, the script accepts only Tauri's specific symlink failure **after native release compilation succeeds**. It copies the fresh ARM64 library into Android's standard `jniLibs` directory, then uses the generated Gradle release task to package it, excluding only the already-completed Rust task. It does not change Windows security policy or reuse a library after a compilation failure.

The script generates HomeYield launcher icons from `icon.svg`, then verifies the ELF architecture, APK signature, 16 KB native-library alignment, package ID, version, and launcher activity before replacing a staged APK. It preserves the development signing key in your Android user directory (normally `~/.android/debug.keystore`). Back that key up if you want future previews to update an existing installation. Never delete an installed app just to change signing keys without first preserving its garden data.

### Toolchain and production builds

Install JDK 21, Android SDK 36 / build-tools 36.0.0, and NDK 27 (the local build was verified with 27.3.13750724; CI pins 27.2.12479018). Set `JAVA_HOME`, `ANDROID_HOME`, and `NDK_HOME` as described in the [Tauri Android prerequisites](https://v2.tauri.app/start/prerequisites/#android). The preview command also detects the default Windows SDK and an installed NDK. Android Studio is optional if its command-line tools are installed. The standard Tauri commands are:

```powershell
rustup target add aarch64-linux-android
npm run tauri -- android init --ci --skip-targets-install
npm run tauri -- android build --ci --debug --apk --target aarch64 -- --locked
```

Find APKs below `gen\android\app\build\outputs\apk`. These use the actual Rust/Tauri SQLite backend, not the legacy Java WebView wrapper.

The manual **Build Tauri Android APK** workflow defaults to a **debug** APK named `HomeYield-android-arm64-debug.apk`. Android debug packages are signed with a development key; they are not unsigned files and are not production releases. They are available only as workflow artifacts after a successful run and are never published by the workflow. Debug keys may change between clean CI runs, so later debug APKs may not update an existing installation.

Choose `signed-release` only after configuring a permanent keystore in these repository secrets:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

The workflow generates the Tauri project, adds release signing via `scripts/configure-android-signing.cjs`, reads credentials from environment variables at build time, verifies the APK with `apksigner`, and stages `HomeYield-android-arm64.apk` plus its checksum. Missing credentials fail the release build; no temporary preview key is substituted. To attach the signed APK to an existing published desktop release, explicitly provide its matching `release_tag` and enable `publish_to_release`; the workflow checks out that tag. Otherwise it remains an Actions artifact.

For a local signed build, set the same password/alias variables plus an absolute `ANDROID_KEYSTORE_PATH`, run `npm run android:signing` after `android init`, then build without `--debug`. Keep the keystore/passwords private, backed up, and outside tracked files. Never rotate the signing key casually: existing installations can update only with compatible identity/signing. The existing preview ID is preserved; a store-ready ID change and migration need a deliberate release plan.

## iOS: signed device builds only, opt-in

iOS requires macOS/Xcode, an Apple Developer membership, a registered bundle ID matching `com.homeyield.android13.preview`, a signing certificate, and a compatible provisioning profile. Windows cannot build it, and an iOS simulator `.app` is **not an installable iPhone download**.

The manual **Build provisioned Tauri iOS IPA** workflow is disabled until explicitly dispatched and requires:

- `APPLE_DEVELOPMENT_TEAM`
- `IOS_CERTIFICATE` (base64 P12), `IOS_CERTIFICATE_PASSWORD`
- `IOS_MOBILE_PROVISION` (base64 provisioning profile for the app, team, certificate, and export method)

It runs `tauri ios init` and `tauri ios build --target aarch64` on macOS, verifies the device bundle/signature, and uploads `HomeYield-ios-arm64.ipa` as an Actions artifact (repository access and a GitHub login are required). It does not publish a public IPA link or submit to Apple automatically. Choose `app-store-connect` for subsequent App Store Connect/TestFlight submission, or `release-testing` with an ad-hoc profile for specifically registered devices. An IPA is not universally sideloadable: installation depends on Apple distribution/provisioning rules. Use a unique numeric build number for each App Store Connect upload. There is no claim of an existing App Store/TestFlight listing.

On a provisioned Mac the equivalent commands are:

```text
npm run tauri -- ios init --ci
npm run tauri -- ios build --ci --target aarch64 --export-method app-store-connect --build-number 1 -- --locked
```

See [Tauri iOS signing](https://v2.tauri.app/distribute/sign/ios/) for obtaining certificates/profiles. The PWA remains the browser-based option for iPhones when no provisioned native build is available.

## Regenerating a clean checkout

Generated frontend/native projects, dependencies, test output, and Cargo/Gradle build caches are ignored rather than committed. After cleanup, restore dependencies with `npm ci`, recreate the web build with `npm run build`, and rebuild Android with `npm run build:android:preview` (it regenerates `gen/android` automatically). Rust dependencies are restored by Cargo using `Cargo.lock`.

Finished installers, APKs, checksums, and the preserved Windows application executable live in ignored `release-assets/`; they are kept locally during cleanup. Source assets and dependency lockfiles remain tracked. Garden databases under `data/` and signing keys are **not regenerable** and must be preserved, even though they are ignored.
