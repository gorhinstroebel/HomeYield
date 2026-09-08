const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const contract = require('./release-assets.cjs');

function hasBundleSignature(name, data) {
  const extension = path.extname(name);
  if (data.length < 1024) return false;
  return extension === '.exe' ? data.subarray(0, 2).toString() === 'MZ'
    : extension === '.deb' ? data.subarray(0, 8).toString() === '!<arch>\n'
    : extension === '.AppImage' ? data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46]))
    : extension === '.dmg' && data.subarray(data.length - 512, data.length - 508).toString() === 'koly';
}

function verifyRelease(directory) {
  const expected = Object.values(contract).flat().sort();
  const actual = fs.readdirSync(directory).filter((file) => file !== 'SHA256SUMS').sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Incomplete or unexpected desktop release assets.\nExpected: ${expected.join(', ')}\nFound: ${actual.join(', ')}`);
  }
  const checksums = expected.map((name) => {
    const data = fs.readFileSync(path.join(directory, name));
    if (data.length < 1024) throw new Error(`Bundle is unexpectedly small: ${name}`);
    const extension = path.extname(name);
    if (!hasBundleSignature(name, data)) throw new Error(`Invalid ${extension} file signature: ${name}`);
    return `${crypto.createHash('sha256').update(data).digest('hex')}  ${name}`;
  });
  fs.writeFileSync(path.join(directory, 'SHA256SUMS'), `${checksums.join('\n')}\n`);
  return expected;
}

if (require.main === module) {
  console.log(`Verified ${verifyRelease(process.argv[2] || 'release-assets').length} desktop assets; wrote SHA256SUMS.`);
}

module.exports = { verifyRelease, hasBundleSignature };
