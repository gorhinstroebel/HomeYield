const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

function worker(network = async () => new Response("fresh")) {
  const scope = "https://example.com/HomeYield/";
  const entries = new Map();
  const deleted = [];
  const listeners = {};
  let installed;
  const cache = {
    addAll: async (requests) => { installed = requests; },
    put: async (url, response) => entries.set(url, response),
    match: async (url) => entries.get(url)?.clone(),
  };
  const context = vm.createContext({
    URL, Response, console: { warn() {} },
    Request: class {
      constructor(url, options) { this.url = new URL(url, scope).href; this.cache = options.cache; }
    },
    fetch: network,
    caches: {
      open: async () => cache,
      keys: async () => [`homeyield-${scope}-v20`, "homeyield-shell-v20", "unrelated-app", `homeyield-${scope}-v21`],
      delete: async (key) => deleted.push(key),
    },
    self: {
      registration: { scope },
      clients: { claim: async () => {} },
      skipWaiting() {},
      addEventListener: (name, callback) => { listeners[name] = callback; },
    },
  });
  vm.runInContext(readFileSync(path.join(__dirname, "..", "sw.js"), "utf8"), context);
  return {
    scope, entries, deleted,
    async lifecycle(name) {
      let completion;
      listeners[name]({ waitUntil: (promise) => { completion = promise; } });
      await completion;
    },
    request(url, method = "GET") {
      let response;
      listeners.fetch({ request: { url, method }, respondWith: (promise) => { response = promise; } });
      return response;
    },
    installed: () => installed,
  };
}

test("offline install includes downloads and icons beneath the Pages subpath", async () => {
  const service = worker();
  await service.lifecycle("install");
  for (const file of ["downloads.html", "downloads.js", "downloads.css", "icon-192.png", "icon.png"]) {
    assert.ok(service.installed().some((request) => request.url === service.scope + file && request.cache === "reload"));
  }
});

test("activation removes stale HomeYield caches but retains unrelated caches", async () => {
  const service = worker();
  await service.lifecycle("activate");
  assert.equal(service.deleted.length, 2);
  assert.ok(service.deleted.includes("homeyield-shell-v20"));
  assert.ok(!service.deleted.includes("unrelated-app"));
});

test("service worker never intercepts database or third-party release requests", () => {
  const service = worker();
  assert.equal(service.request("https://example.com/api/state"), undefined);
  assert.equal(service.request("https://api.github.com/repos/gorhinstroebel/HomeYield/releases/latest"), undefined);
  assert.equal(service.request(service.scope + "app.js", "PUT"), undefined);
});

test("online assets refresh the cache, ignoring old query-string versions", async () => {
  const service = worker();
  service.entries.set(service.scope + "app.js", new Response("old"));
  const response = await service.request(service.scope + "app.js?v=old");
  assert.equal(await response.text(), "fresh");
  assert.equal(await service.entries.get(service.scope + "app.js").text(), "fresh");
});

test("offline requests use the matching asset, never HTML in place of JavaScript", async () => {
  const service = worker(async () => { throw new TypeError("offline"); });
  service.entries.set(service.scope + "index.html", new Response("<html></html>"));
  service.entries.set(service.scope + "styles.css", new Response("body {}"));
  assert.equal(await (await service.request(service.scope + "styles.css")).text(), "body {}");
  assert.equal((await service.request(service.scope + "app.js")).type, "error");
});
