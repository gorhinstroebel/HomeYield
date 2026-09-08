const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const { publishedAssets, formatDownloadSize } = require("../downloads.js");

const root = path.resolve(__dirname, "..");
const asset = (name, overrides = {}) => ({
  name, state: "uploaded", size: 2097152,
  browser_download_url: `https://github.com/gorhinstroebel/HomeYield/releases/download/v1.0.1/${name}`,
  ...overrides,
});

test("only complete assets from stable HomeYield releases become downloads", () => {
  const good = asset("HomeYield-windows-x64-setup.exe");
  const assets = publishedAssets({ assets: [
    good,
    asset("pending.exe", { state: "new" }),
    asset("empty.exe", { size: 0 }),
    asset("invalid.exe", { browser_download_url: "not a URL" }),
    asset("foreign.exe", { browser_download_url: "https://example.com/installer.exe" }),
    asset("other-project.exe", { browser_download_url: "https://github.com/example/project/releases/download/v1/app.exe" }),
  ] });
  assert.deepEqual([...assets.keys()], [good.name]);
  assert.equal(assets.get(good.name).url, good.browser_download_url);
  assert.equal(publishedAssets({ draft: true, assets: [good] }).size, 0);
  assert.equal(publishedAssets({ prerelease: true, assets: [good] }).size, 0);
  assert.equal(publishedAssets(null).size, 0);
  assert.equal(formatDownloadSize(2097152), "2.0 MB");
});

test("download page offers every packaged desktop architecture without guessed installer URLs", () => {
  const html = readFileSync(path.join(root, "downloads.html"), "utf8");
  for (const name of [
    "HomeYield-windows-x64-setup.exe", "HomeYield-windows-arm64-setup.exe",
    "HomeYield-macos-x64.dmg", "HomeYield-macos-arm64.dmg",
    "HomeYield-linux-x64.AppImage", "HomeYield-linux-arm64.AppImage",
    "HomeYield-linux-x64.deb", "HomeYield-linux-arm64.deb", "HomeYield-android-arm64.apk", "HomeYield-android-arm64-preview.apk",
  ]) assert.ok(html.includes(`data-asset="${name}"`), `Missing ${name}`);
  assert.ok(!html.includes("/releases/latest/download/"), "Unpublished assets must not be guessed");
  assert.match(html, /no public iOS installer yet/);
});

function application(saved) {
  const stored = new Map(saved ? [["homeyield-garden", JSON.stringify(saved)]] : []);
  const element = { setAttribute() {}, focus() {}, tabIndex: 0 };
  const app = {
    dataset: {}, innerHTML: "",
    contains: () => false,
    querySelector: () => element,
    querySelectorAll: () => [],
    insertAdjacentHTML(_, html) { this.innerHTML += html; },
  };
  const localStorage = {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
    removeItem: (key) => stored.delete(key),
  };
  const context = vm.createContext({
    console, localStorage,
    document: {
      documentElement: { dataset: {} },
      querySelector: (selector) => selector === "#app" ? app : null,
      querySelectorAll: () => [],
    },
    window: {
      location: { hostname: "gorhinstroebel.github.io", protocol: "https:" },
      addEventListener() {}, scrollTo() {},
      matchMedia: () => ({ matches: false, addEventListener() {} }),
      setTimeout: () => 1, clearTimeout() {},
    },
    navigator: { onLine: true },
    setTimeout: () => 1, clearTimeout() {},
  });
  vm.runInContext("const isTauri = true;", context);
  vm.runInContext(readFileSync(path.join(root, "app.js"), "utf8"), context);
  return { app, run: (code) => vm.runInContext(code, context), saved: () => JSON.parse(stored.get("homeyield-garden")) };
}

test("onboarding creates usable records and shows care tasks on the dashboard", () => {
  const garden = application();
  assert.match(garden.app.innerHTML, /downloads\.html/);
  garden.run("togglePlant('tomato'); togglePlant('basil'); chooseDate('today'); finishOnboarding();");
  assert.deepEqual(garden.saved().plants, ["tomato", "basil"]);
  assert.match(garden.app.innerHTML, /Today's care/);
  assert.equal(garden.run("dueTasks().length"), 2);
  garden.run("finishTask('water-tomato');");
  assert.equal(garden.run("dueTasks().length"), 1);
  assert.equal(garden.saved().logs[0].action, "water");
});

test("completed watering tasks stay completed after reopening", () => {
  const garden = application();
  garden.run("togglePlant('tomato'); chooseDate('today'); finishOnboarding(); finishTask('water-tomato');");
  const reopened = application(garden.saved());
  assert.equal(reopened.run("dueTasks().length"), 0);
  assert.match(reopened.app.innerHTML, /All caught up/);
});

test("due reminders return, and snoozed reminders remain hidden", () => {
  const garden = application({ version: 6, plants: ["tomato"], tasks: [], logs: [{ plantId: "tomato", action: "water", date: "2020-01-01" }] });
  assert.equal(garden.run("dueTasks().length"), 1);
  garden.run("snoozeTask(state.tasks[0].id);");
  assert.equal(garden.run("dueTasks().length"), 0);
  const reopened = application(garden.saved());
  assert.equal(reopened.run("dueTasks().length"), 0);
});

test("diagnosis results keep the shared header and survive theme changes", () => {
  const garden = application({ version: 6, plants: ["tomato"], tasks: [], logs: [] });
  garden.run("state.diagnosisPlant = 'tomato'; diagnosis('spots'); cycleTheme();");
  assert.equal(garden.saved().screen, "diagnosis-result");
  assert.match(garden.app.innerHTML, /Possible leaf spot/);
  assert.match(garden.app.innerHTML, /class="app-header"/);
  assert.match(garden.app.innerHTML, /aria-current="page" onclick="go\('diagnose'\)"/);
});

test("web install manifest supports rotation and ships real-sized icons", () => {
  const manifest = JSON.parse(readFileSync(path.join(root, "manifest.json"), "utf8"));
  assert.equal(manifest.orientation, "any");
  for (const size of [192, 512]) {
    const icon = manifest.icons.find((entry) => entry.sizes === `${size}x${size}`);
    assert.ok(icon);
    const png = readFileSync(path.join(root, icon.src));
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
  }
});
