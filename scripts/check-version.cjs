const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = require('../package.json');
const config = require('../tauri.conf.json');
const lock = require('../package-lock.json');
const cargo = fs.readFileSync(path.join(root, 'Cargo.toml'), 'utf8').match(/^version = "([^"]+)"/m)?.[1];
if ([config.version, lock.version, cargo].some((version) => version !== pkg.version)) {
  throw new Error('package.json, package-lock.json, Cargo.toml and tauri.conf.json versions must match.');
}
const tag = process.argv[2];
if (tag && tag !== `v${pkg.version}`) {
  throw new Error(`Tag ${tag} does not match application version v${pkg.version}.`);
}
console.log(`HomeYield version ${pkg.version} verified.`);
