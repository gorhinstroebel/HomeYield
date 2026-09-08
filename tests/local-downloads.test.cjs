const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { localAsset, localRelease } = require('../scripts/local-downloads.cjs');
const { createPreviewServer } = require('../scripts/serve.cjs');
const { publishedAssets } = require('../downloads.js');

const installer = 'HomeYield-windows-x64-setup.exe';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'homeyield-download-test-'));
  fs.mkdirSync(path.join(root, 'release-assets'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function writeInstaller(root) {
  const binary = Buffer.alloc(2048);
  binary.write('MZ');
  fs.writeFileSync(path.join(root, 'release-assets', installer), binary);
  return binary;
}

test('local downloads list only known, complete native installers', (t) => {
  const root = fixture(t);
  assert.deepEqual(localRelease(root), { assets: [] });
  writeInstaller(root);
  fs.writeFileSync(path.join(root, 'release-assets', 'private.txt'), 'not an installer');
  assert.deepEqual(localRelease(root), { assets: [{
    name: installer, size: 2048, state: 'uploaded',
    browser_download_url: `/local-downloads/${installer}`,
  }] });
  assert.equal(localAsset(root, 'private.txt'), null);
  assert.equal(localAsset(root, '../private.txt'), null);
  assert.equal(localAsset(root, 'HomeYield-macos-x64.dmg'), null);
});

test('local downloads reject corrupt or partial installers', (t) => {
  const root = fixture(t);
  for (const invalid of [Buffer.alloc(2048), Buffer.from('MZ')]) {
    fs.writeFileSync(path.join(root, 'release-assets', installer), invalid);
    assert.throws(() => localRelease(root), /Invalid local installer/);
  }
});

test('local preview APK is downloadable without being described as a production release', (t) => {
  const root = fixture(t);
  const name = 'HomeYield-android-arm64-preview.apk';
  const binary = Buffer.alloc(2048);
  binary.set([0x50, 0x4b, 0x03, 0x04]);
  fs.writeFileSync(path.join(root, 'release-assets', name), binary);
  assert.equal(localRelease(root).assets[0].name, name);
  assert.equal(localAsset(root, 'HomeYield-android-arm64.apk'), null);
  assert.equal(localRelease(root).assets[0].browser_download_url, `/local-downloads/${name}`);
});

test('local metadata can only point to same-origin named download routes', () => {
  const origin = 'http://127.0.0.1:4173';
  const asset = { name: installer, state: 'uploaded', size: 2048 };
  for (const url of [
    'https://example.com/installer.exe',
    'http://127.0.0.1:4173/private.txt',
    `http://localhost:4173/local-downloads/${installer}`,
    `/local-downloads/${installer}?redirect=elsewhere`,
  ]) assert.equal(publishedAssets({ assets: [{ ...asset, browser_download_url: url }] }, origin).size, 0);
  const assets = publishedAssets({ assets: [{ ...asset, browser_download_url: `/local-downloads/${installer}` }] }, origin);
  assert.equal(assets.get(installer).url, `${origin}/local-downloads/${installer}`);
  assert.equal(publishedAssets({ assets: [{ ...asset, browser_download_url: `/local-downloads/${installer}` }] }).size, 0);
});

test('preview download button endpoint transfers exact bytes and preserves hosted behavior', async (t) => {
  const root = fixture(t);
  const binary = writeInstaller(root);
  const html = fs.readFileSync(path.join(__dirname, '..', 'downloads.html'), 'utf8');
  fs.writeFileSync(path.join(root, 'downloads.html'), html);
  const server = createPreviewServer(root);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    const page = await fetch(`${origin}/downloads.html`);
    assert.match(await page.text(), /name="homeyield-download-source" content="local"/);
    assert.match(html, /name="homeyield-download-source" content="github"/);
    const manifest = await (await fetch(`${origin}/local-downloads.json`)).json();
    assert.equal(manifest.assets.length, 1);
    const response = await fetch(new URL(manifest.assets[0].browser_download_url, origin));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-disposition'), `attachment; filename="${installer}"`);
    assert.equal(response.headers.get('content-length'), String(binary.length));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), binary);
    const head = await fetch(`${origin}/local-downloads/${installer}`, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal((await head.arrayBuffer()).byteLength, 0);
    assert.equal((await fetch(`${origin}/local-downloads/private.txt`)).status, 404);
    assert.equal((await fetch(`${origin}/local-downloads.json`, { method: 'POST' })).status, 404);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
