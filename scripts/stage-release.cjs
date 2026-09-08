const fs = require('node:fs');
const path = require('node:path');
const contract = require('./release-assets.cjs');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(filename) : entry.isFile() ? [filename] : [];
  });
}

function stageRelease(platform, architecture, source, destination) {
  const names = contract[`${platform}-${architecture}`];
  if (!names) throw new Error(`Unsupported release target: ${platform}-${architecture}`);
  const files = walk(source);
  const copies = names.map((name) => {
    const matches = files.filter((file) => path.extname(file) === path.extname(name));
    if (matches.length !== 1) {
      throw new Error(`Expected exactly one ${path.extname(name)} bundle; found ${matches.length}`);
    }
    if (fs.statSync(matches[0]).size < 1024) throw new Error(`Bundle is unexpectedly small: ${name}`);
    return [matches[0], name];
  });
  fs.mkdirSync(destination, { recursive: true });
  for (const [file, name] of copies) {
    fs.copyFileSync(file, path.join(destination, name));
  }
  return names;
}

if (require.main === module) {
  const [platform, architecture, source = path.join('target', 'release', 'bundle')] = process.argv.slice(2);
  console.log(stageRelease(platform, architecture, source, 'release-assets').join('\n'));
}

module.exports = { stageRelease };
