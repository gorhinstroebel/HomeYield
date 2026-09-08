const fs = require('node:fs');
const path = require('node:path');
const contract = require('./release-assets.cjs');
const { hasBundleSignature } = require('./verify-release.cjs');

const names = Object.freeze([...Object.values(contract).flat(), 'HomeYield-android-arm64-preview.apk']);

function localAsset(root, name) {
  if (!names.includes(name)) return null;
  const filename = path.join(root, 'release-assets', name);
  const stat = fs.lstatSync(filename, { throwIfNoEntry: false });
  if (!stat?.isFile()) return null;
  const descriptor = fs.openSync(filename, 'r');
  const sample = Buffer.alloc(1024);
  try {
    if (stat.size >= sample.length) {
      fs.readSync(descriptor, sample, 0, 512, 0);
      fs.readSync(descriptor, sample, 512, 512, stat.size - 512);
    }
  } finally {
    fs.closeSync(descriptor);
  }
  if (!hasBundleSignature(name, sample)) throw new Error(`Invalid local installer: ${name}`);
  return { filename, name, size: stat.size };
}

function localRelease(root) {
  return {
    assets: names.map((name) => localAsset(root, name)).filter(Boolean).map(({ name, size }) => ({
      name,
      size,
      state: 'uploaded',
      browser_download_url: `/local-downloads/${name}`,
    })),
  };
}

module.exports = { localAsset, localRelease };
