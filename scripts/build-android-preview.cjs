const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const { stripVTControlCharacters } = require('node:util');

function allowsPrebuiltPackaging(platform, result) {
  const output = stripVTControlCharacters(result.output);
  return platform === 'win32' && result.code !== 0
    && /Finished `release` profile/.test(output)
    && output.includes('Creation symbolic link is not allowed for this system.');
}

function isArm64Library(header) {
  return header.length >= 20 && header.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46]))
    && header[4] === 2 && header[5] === 1 && header.readUInt16LE(16) === 3 && header.readUInt16LE(18) === 183;
}

function validateApkMetadata(output, config) {
  if (!output.includes(`package: name='${config.identifier}'`)
    || !output.includes(`versionName='${config.version}'`)
    || !output.includes("native-code: 'arm64-v8a'")
    || !output.includes(`launchable-activity: name='${config.identifier}.MainActivity'`)) {
    throw new Error('The APK identity, version, activity, or ARM64 library does not match HomeYield.');
  }
}

function run(command, args, options = {}) {
  const { allowFailure = false, ...spawnOptions } = options;
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...spawnOptions, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    for (const [stream, destination] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
      stream.on('data', (data) => {
        destination.write(data);
        output = (output + data.toString()).slice(-262144);
      });
    }
    child.once('error', reject);
    child.once('close', (code) => {
      if (code !== 0 && !allowFailure) reject(new Error(`${path.basename(command)} failed (${code}). See output above.`));
      else resolve({ code, output });
    });
  });
}

async function buildAndroidPreview() {
  const root = path.resolve(__dirname, '..');
  const config = require('../tauri.conf.json');
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
    || (process.platform === 'win32' ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk') : path.join(os.homedir(), 'Android', 'Sdk'));
  const ndkRoot = path.join(sdk, 'ndk');
  const versions = fs.existsSync(ndkRoot) ? fs.readdirSync(ndkRoot).filter((name) => /^\d+\.\d+\.\d+$/.test(name)).sort((a, b) => b.localeCompare(a, undefined, { numeric: true })) : [];
  const ndk = process.env.NDK_HOME || (versions[0] && path.join(ndkRoot, versions[0]));
  const tools = path.join(sdk, 'build-tools', '36.0.0');
  if (!ndk || !fs.existsSync(ndk) || !fs.existsSync(tools)) {
    throw new Error('Install Android SDK 36, build-tools 36.0.0 and NDK 27, then set ANDROID_HOME and NDK_HOME.');
  }
  const suffix = process.platform === 'win32' ? '.exe' : '';
  const javaTool = (name) => process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin', name + suffix) : name + suffix;
  const java = javaTool('java');
  const env = { ...process.env, ANDROID_HOME: sdk, NDK_HOME: ndk };
  const options = { cwd: root, env };
  const cli = require.resolve('@tauri-apps/cli/tauri.js');
  const android = path.join(root, 'gen', 'android');
  if (!fs.existsSync(path.join(android, 'settings.gradle'))) {
    await run(process.execPath, [cli, 'android', 'init', '--ci', '--skip-targets-install'], options);
  }
  const icons = path.join(root, 'gen', 'app-icons');
  await run(process.execPath, [cli, 'icon', path.join(root, 'icon.svg'), '--output', icons], options);
  fs.cpSync(path.join(icons, 'android'), path.join(android, 'app', 'src', 'main', 'res'), { recursive: true });
  const native = await run(process.execPath, [cli, 'android', 'build', '--ci', '--apk', '--target', 'aarch64', '--', '--locked'], { ...options, allowFailure: true });
  if (native.code !== 0 && !allowsPrebuiltPackaging(process.platform, native)) {
    throw new Error('Tauri did not complete the native release build; no previous library will be packaged.');
  }
  if (native.code !== 0) console.log('Native compilation succeeded. Packaging its prebuilt JNI library without Windows symlinks.');
  const library = path.join(root, 'target', 'aarch64-linux-android', 'release', 'libhomeyield_lib.so');
  const header = Buffer.alloc(64);
  const descriptor = fs.openSync(library, 'r');
  try {
    fs.readSync(descriptor, header, 0, header.length, 0);
  } finally {
    fs.closeSync(descriptor);
  }
  if (!isArm64Library(header)) throw new Error('The freshly built library is not an ARM64 ELF shared library.');
  const jni = path.join(android, 'app', 'src', 'main', 'jniLibs', 'arm64-v8a');
  fs.mkdirSync(jni, { recursive: true });
  const destination = path.join(jni, 'libhomeyield_lib.so');
  fs.rmSync(destination, { force: true });
  fs.copyFileSync(library, destination);

  // Tauri already compiled this exact Rust target; Gradle packages the copied JNI library.
  await run(java, ['-classpath', path.join(android, 'gradle', 'wrapper', 'gradle-wrapper.jar'),
    'org.gradle.wrapper.GradleWrapperMain', ':app:assembleArm64Release', '-x', ':app:rustBuildArm64Release',
    '--no-daemon', '--console=plain'], { cwd: android, env });
  const output = path.join(android, 'app', 'build', 'outputs', 'apk', 'arm64', 'release');
  const apks = fs.readdirSync(output).filter((name) => name.endsWith('.apk'));
  if (apks.length !== 1) throw new Error(`Expected one ARM64 release APK, found ${apks.length}.`);
  const aligned = path.join(android, 'app', 'build', 'preview-aligned.apk');
  const signed = path.join(android, 'app', 'build', 'preview-signed.apk');
  const zipalign = path.join(tools, 'zipalign' + suffix);
  await run(zipalign, ['-P', '16', '-f', '4', path.join(output, apks[0]), aligned], options);
  const key = path.join(process.env.ANDROID_USER_HOME || path.join(os.homedir(), '.android'), 'debug.keystore');
  if (!fs.existsSync(key)) {
    fs.mkdirSync(path.dirname(key), { recursive: true });
    await run(javaTool('keytool'), ['-genkeypair', '-keystore', key, '-storepass', 'android',
      '-keypass', 'android', '-alias', 'androiddebugkey', '-dname', 'CN=Android Debug,O=Android,C=US',
      '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000'], options);
  }
  const signer = path.join(tools, 'lib', 'apksigner.jar');
  await run(java, ['-jar', signer, 'sign', '--ks', key, '--ks-key-alias', 'androiddebugkey',
    '--ks-pass', 'pass:android', '--key-pass', 'pass:android', '--out', signed, aligned], options);
  await run(java, ['-jar', signer, 'verify', '--verbose', signed], options);
  await run(zipalign, ['-c', '-P', '16', '4', signed], options);
  const metadata = await run(path.join(tools, 'aapt' + suffix), ['dump', 'badging', signed], options);
  validateApkMetadata(metadata.output, config);
  const staged = path.join(root, 'release-assets', 'HomeYield-android-arm64-preview.apk');
  fs.mkdirSync(path.dirname(staged), { recursive: true });
  fs.copyFileSync(signed, staged);
  const digest = crypto.createHash('sha256').update(fs.readFileSync(staged)).digest('hex');
  fs.writeFileSync(`${staged}.sha256`, `${digest}  ${path.basename(staged)}\n`);
  console.log(`Verified Android preview: ${staged} (${(fs.statSync(staged).size / 1048576).toFixed(1)} MB). Signed with the Android development key, not a production key.`);
}

if (require.main === module) {
  buildAndroidPreview().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { allowsPrebuiltPackaging, isArm64Library, validateApkMetadata };
