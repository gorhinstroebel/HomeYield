const assert = require('node:assert/strict');
const { test } = require('node:test');
const { allowsPrebuiltPackaging, isArm64Library, validateApkMetadata } = require('../scripts/build-android-preview.cjs');

test('prebuilt JNI packaging only handles a completed Windows native build with denied symlinks', () => {
  const output = 'Finished `release` profile [optimized]\nCreation symbolic link is not allowed for this system.';
  assert.equal(allowsPrebuiltPackaging('win32', { code: 1, output }), true);
  assert.equal(allowsPrebuiltPackaging('win32', { code: 1, output: output.replace('Finished', '\u001b[1mFinished\u001b[0m') }), true);
  assert.equal(allowsPrebuiltPackaging('linux', { code: 1, output }), false);
  assert.equal(allowsPrebuiltPackaging('win32', { code: 0, output }), false);
  assert.equal(allowsPrebuiltPackaging('win32', { code: 1, output: 'Rust compilation failed' }), false);
  assert.equal(allowsPrebuiltPackaging('win32', { code: 1, output: 'Creation symbolic link is not allowed for this system.' }), false);
});

test('Android preview requires a 64-bit little-endian ARM shared library', () => {
  const header = Buffer.alloc(64);
  header.set([0x7f, 0x45, 0x4c, 0x46, 2, 1]);
  header.writeUInt16LE(3, 16);
  header.writeUInt16LE(183, 18);
  assert.equal(isArm64Library(header), true);
  header.writeUInt16LE(62, 18);
  assert.equal(isArm64Library(header), false);
  assert.equal(isArm64Library(Buffer.alloc(10)), false);
});

test('APK metadata must match the native application identity, version and architecture', () => {
  const config = { identifier: 'com.homeyield.android13.preview', version: '1.0.1' };
  const metadata = "package: name='com.homeyield.android13.preview' versionName='1.0.1'\nnative-code: 'arm64-v8a'\nlaunchable-activity: name='com.homeyield.android13.preview.MainActivity'";
  assert.doesNotThrow(() => validateApkMetadata(metadata, config));
  assert.throws(() => validateApkMetadata(metadata.replace('arm64-v8a', 'x86_64'), config), /does not match/);
  assert.throws(() => validateApkMetadata(metadata, { ...config, version: '1.0.2' }), /does not match/);
});
