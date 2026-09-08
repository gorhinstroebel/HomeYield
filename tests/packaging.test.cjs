const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { test, after } = require('node:test');
const { assets, buildFrontend } = require('../scripts/build-frontend.cjs');
const { stageRelease } = require('../scripts/stage-release.cjs');
const { verifyRelease } = require('../scripts/verify-release.cjs');
const { configureSigning } = require('../scripts/configure-android-signing.cjs');
const contract = require('../scripts/release-assets.cjs');

const root = path.resolve(__dirname, '..');
const workspace = path.join(root, '.packaging-test-work', String(process.pid));
let fixtureNumber = 0;
after(() => fs.rmSync(workspace, { recursive: true, force: true }));

function fixture() {
  const directory = path.join(workspace, String(++fixtureNumber));
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}

function bundle(name) {
  const data = Buffer.alloc(2048);
  if (name.endsWith('.exe')) data.write('MZ');
  else if (name.endsWith('.deb')) data.write('!<arch>\n');
  else if (name.endsWith('.AppImage')) data.set([0x7f, 0x45, 0x4c, 0x46]);
  else data.write('koly', data.length - 512);
  return data;
}

test('frontend build copies current root assets, including downloads, deterministically', () => {
  const directory = fixture();
  for (const asset of assets) fs.writeFileSync(path.join(directory, asset), `current ${asset}\n`);
  fs.writeFileSync(path.join(directory, 'server.py'), 'not a public asset');
  fs.mkdirSync(path.join(directory, 'dist'));
  fs.writeFileSync(path.join(directory, 'dist', 'stale.js'), 'stale');
  buildFrontend(directory);
  const dist = path.join(directory, 'dist');
  assert.deepEqual(fs.readdirSync(dist).sort(), [...assets, '.nojekyll'].sort());
  const first = assets.map((asset) => fs.readFileSync(path.join(dist, asset), 'utf8'));
  buildFrontend(directory);
  assert.deepEqual(assets.map((asset) => fs.readFileSync(path.join(dist, asset), 'utf8')), first);
  for (const asset of assets) {
    assert.equal(fs.readFileSync(path.join(dist, asset), 'utf8'), `current ${asset}\n`);
  }
  assert.ok(assets.includes('downloads.html') && assets.includes('downloads.js') && assets.includes('downloads.css'));
});

test('missing frontend input fails before deleting the previous build', () => {
  const directory = fixture();
  fs.mkdirSync(path.join(directory, 'dist'));
  fs.writeFileSync(path.join(directory, 'dist', 'index.html'), 'previous');
  assert.throws(() => buildFrontend(directory), /Missing frontend asset/);
  assert.equal(fs.readFileSync(path.join(directory, 'dist', 'index.html'), 'utf8'), 'previous');
});

test('the frontend build includes every web install icon', () => {
  const manifest = require('../manifest.json');
  for (const icon of manifest.icons) {
    assert.ok(assets.includes(icon.src), `Missing public build asset: ${icon.src}`);
  }
});

test('root Tauri layout resolves executable, capabilities, frontend, and native icons', () => {
  const config = require('../tauri.conf.json');
  const cargo = fs.readFileSync(path.join(root, 'Cargo.toml'), 'utf8');
  assert.match(cargo, /\[lib\][\s\S]*?path = "lib\.rs"/);
  assert.match(cargo, /\[\[bin\]\][\s\S]*?path = "main\.rs"/);
  assert.equal(config.build.frontendDist, 'dist');
  assert.equal(config.build.beforeBuildCommand, 'npm run build');
  assert.equal(config.identifier, 'com.homeyield.android13.preview');
  assert.equal(config.app.withGlobalTauri, true);
  for (const icon of config.bundle.icon) assert.ok(fs.statSync(path.join(root, icon)).isFile());
  const capability = require('../capabilities/default.json');
  assert.deepEqual(capability.windows, ['main']);
  assert.ok(capability.permissions.includes('core:default'));
});

test('pinned CLI and application versions agree', () => {
  const pkg = require('../package.json');
  const lock = require('../package-lock.json');
  assert.match(pkg.devDependencies['@tauri-apps/cli'], /^\d+\.\d+\.\d+$/);
  assert.equal(lock.packages['node_modules/@tauri-apps/cli'].version, pkg.devDependencies['@tauri-apps/cli']);
  assert.equal(pkg.version, require('../tauri.conf.json').version);
  assert.equal(lock.version, pkg.version);
  const cargo = fs.readFileSync(path.join(root, 'Cargo.toml'), 'utf8');
  assert.equal(cargo.match(/^version = "([^"]+)"/m)[1], pkg.version);
});

test('release staging preserves bundle bytes and exact platform asset names', () => {
  for (const [target, names] of Object.entries(contract)) {
    const directory = fixture();
    const source = path.join(directory, 'bundle');
    fs.mkdirSync(source);
    for (const name of names) fs.writeFileSync(path.join(source, `original${path.extname(name)}`), bundle(name));
    const destination = path.join(directory, 'staged');
    const [platform, architecture] = target.split('-');
    assert.deepEqual(stageRelease(platform, architecture, source, destination), names);
    for (const name of names) assert.deepEqual(fs.readFileSync(path.join(destination, name)), bundle(name));
  }
});

test('release staging refuses missing, ambiguous, tiny, and unsupported bundles', () => {
  const directory = fixture();
  const destination = path.join(directory, 'staged');
  assert.throws(() => stageRelease('windows', 'x64', directory, destination), /exactly one/);
  fs.writeFileSync(path.join(directory, 'one.exe'), 'MZ');
  assert.throws(() => stageRelease('windows', 'x64', directory, destination), /unexpectedly small/);
  fs.writeFileSync(path.join(directory, 'two.exe'), bundle('two.exe'));
  assert.throws(() => stageRelease('windows', 'x64', directory, destination), /exactly one/);
  assert.throws(() => stageRelease('windows', 'x86', directory, destination), /Unsupported/);
  assert.equal(fs.existsSync(destination), false);
});

test('publication requires all eight valid desktop assets and emits stable checksums', () => {
  const directory = fixture();
  const names = Object.values(contract).flat().sort();
  assert.equal(names.length, 8);
  for (const name of names) fs.writeFileSync(path.join(directory, name), bundle(name));
  assert.deepEqual(verifyRelease(directory), names);
  const expected = names.map((name) => `${crypto.createHash('sha256').update(bundle(name)).digest('hex')}  ${name}`).join('\n') + '\n';
  assert.equal(fs.readFileSync(path.join(directory, 'SHA256SUMS'), 'utf8'), expected);
  verifyRelease(directory);
  assert.equal(fs.readFileSync(path.join(directory, 'SHA256SUMS'), 'utf8'), expected);
  fs.rmSync(path.join(directory, names[0]));
  assert.throws(() => verifyRelease(directory), /Incomplete/);
});

test('publication rejects bogus signatures and unexpected extra files', () => {
  const directory = fixture();
  const names = Object.values(contract).flat();
  for (const name of names) fs.writeFileSync(path.join(directory, name), bundle(name));
  fs.writeFileSync(path.join(directory, names[0]), Buffer.alloc(2048));
  assert.throws(() => verifyRelease(directory), /file signature/);
  fs.writeFileSync(path.join(directory, names[0]), bundle(names[0]));
  fs.writeFileSync(path.join(directory, 'debug.apk'), bundle('debug.apk'));
  assert.throws(() => verifyRelease(directory), /unexpected/);
});

test('Android release signing is explicit, secret-free, idempotent, and fails closed', () => {
  const input = 'android {\n    buildTypes {\n        getByName("release") {\n        }\n    }\n}\n';
  const output = configureSigning(input);
  assert.match(output, /signingConfig = signingConfigs\.getByName\("release"\)/);
  for (const name of ['ANDROID_KEYSTORE_PATH', 'ANDROID_KEYSTORE_PASSWORD', 'ANDROID_KEY_ALIAS', 'ANDROID_KEY_PASSWORD']) {
    assert.ok(output.includes(`System.getenv("${name}") ?: error(`));
  }
  assert.equal(configureSigning(output), output);
  assert.throws(() => configureSigning('unknown template'), /refusing to produce an unsigned release/);
});

test('desktop publication is gated behind all matrix builds and Pages rebuilds root sources', () => {
  const release = fs.readFileSync(path.join(root, '.github', 'workflows', 'release.yml'), 'utf8');
  assert.match(release, /needs: \[validate, build\]/);
  assert.match(release, /actions\/upload-artifact@/);
  assert.match(release, /npm run release:verify/);
  assert.ok(release.indexOf('gh release upload') < release.indexOf('gh release edit'));
  const pages = fs.readFileSync(path.join(root, '.github', 'workflows', 'pages.yml'), 'utf8');
  assert.ok(pages.indexOf('npm run build') < pages.indexOf('actions/upload-pages-artifact'));
});
