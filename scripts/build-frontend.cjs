const fs = require('node:fs');
const path = require('node:path');

const assets = Object.freeze([
  'index.html',
  'styles.css',
  'app.js',
  'sw.js',
  'manifest.json',
  'icon.svg',
  'icon-192.png',
  'icon.png',
  'privacy.html',
  'downloads.html',
  'downloads.js',
  'downloads.css',
]);

function buildFrontend(root = path.resolve(__dirname, '..'), destination = path.join(root, 'dist')) {
  for (const asset of assets) {
    if (!fs.statSync(path.join(root, asset), { throwIfNoEntry: false })?.isFile()) {
      throw new Error(`Missing frontend asset: ${asset}`);
    }
  }
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(destination, { recursive: true });
  for (const asset of assets) {
    fs.copyFileSync(path.join(root, asset), path.join(destination, asset));
  }
  fs.writeFileSync(path.join(destination, '.nojekyll'), '');
  return assets.length;
}

if (require.main === module) {
  console.log(`Built ${buildFrontend()} frontend assets in dist.`);
}

module.exports = { assets, buildFrontend };
