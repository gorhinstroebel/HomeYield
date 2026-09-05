# HomeYield Android wrapper

This is a standalone WebView APK wrapper around the local HomeYield web assets.

## Build

```sh
./gradlew assembleDebug
```

The debug APK is written to `app/build/outputs/apk/debug/app-debug.apk`. A locally signed preview can be produced by zip-aligning and signing `app-release-unsigned.apk`.

The Android 13 preview package ID is `com.homeyield.android13.preview`, which avoids conflicts with earlier test installs. The generated APK bundles the complete HTML/CSS/JavaScript frontend and uses native SQLite storage through Rust commands. The generated release APK is signed with a temporary preview key; create a signed release build with your own production keystore and permanent application ID before publishing to Google Play.
