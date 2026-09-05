#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
DIST="$ROOT/dist"
mkdir -p "$DIST"
cp "$ROOT/index.html" "$ROOT/styles.css" "$ROOT/app.js" "$ROOT/sw.js" "$ROOT/manifest.json" "$ROOT/icon.svg" "$ROOT/privacy.html" "$DIST/"
printf 'Synced Tauri frontend assets to %s\n' "$DIST"
