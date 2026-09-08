const fs = require('node:fs');
const path = require('node:path');

function configureSigning(source) {
  if (source.includes('HOMEYIELD_RELEASE_SIGNING')) return source;
  const buildTypes = '    buildTypes {';
  const release = '        getByName("release") {';
  if (!source.includes(buildTypes) || !source.includes(release)) {
    throw new Error('Unrecognized Tauri Android Gradle template; refusing to produce an unsigned release.');
  }
  const signing = `    // HOMEYIELD_RELEASE_SIGNING
    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("ANDROID_KEYSTORE_PATH") ?: error("ANDROID_KEYSTORE_PATH is required"))
            storePassword = System.getenv("ANDROID_KEYSTORE_PASSWORD") ?: error("ANDROID_KEYSTORE_PASSWORD is required")
            keyAlias = System.getenv("ANDROID_KEY_ALIAS") ?: error("ANDROID_KEY_ALIAS is required")
            keyPassword = System.getenv("ANDROID_KEY_PASSWORD") ?: error("ANDROID_KEY_PASSWORD is required")
        }
    }
`;
  return source.replace(buildTypes, `${signing}${buildTypes}`)
    .replace(release, `${release}\n            signingConfig = signingConfigs.getByName("release")`);
}

if (require.main === module) {
  const filename = path.resolve(__dirname, '..', 'gen', 'android', 'app', 'build.gradle.kts');
  fs.writeFileSync(filename, configureSigning(fs.readFileSync(filename, 'utf8')));
  console.log('Configured Tauri Android release signing (secrets read only by Gradle at build time).');
}

module.exports = { configureSigning };
