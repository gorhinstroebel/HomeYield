## Desktop downloads

Choose the installer matching your operating system and processor. `SHA256SUMS` covers all eight desktop downloads.

- Windows: x64 or ARM64 NSIS setup. WebView2 is required; the installer may download it. Windows builds are not Authenticode-signed by this workflow and may show SmartScreen warnings.
- macOS: Intel (x64) or Apple silicon (ARM64) DMG. Developer ID signing and notarization happen only when the repository's Apple signing secrets are configured. Otherwise these are unnotarized builds and Gatekeeper may block them.
- Linux: x64 or ARM64 `.deb` / `.AppImage`, built on Ubuntu 22.04. Debian packages require WebKitGTK 4.1. AppImages may require FUSE 2 (or `--appimage-extract-and-run`).

Android and iOS are **not** included in this desktop release. They require separate, manual mobile workflows and appropriate signing credentials. A browser/PWA version remains available independently.

These are newly built desktop artifacts, not a claim that all target devices have been physically tested. Back up your garden before upgrading. The existing application identifier and SQLite location are preserved.
