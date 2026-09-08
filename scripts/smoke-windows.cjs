const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const { spawn, execFileSync } = require("node:child_process");
const { setTimeout: delay } = require("node:timers/promises");
const { chromium } = require("@playwright/test");

function nativeProcessTree(processId) {
  const script = `$ids = @(${processId}); for ($i = 0; $i -lt $ids.Count; $i++) { $ids += @(Get-CimInstance Win32_Process -Filter ('ParentProcessId=' + $ids[$i]) | Select-Object -ExpandProperty ProcessId) }; ConvertTo-Json -InputObject @($ids) -Compress`;
  return JSON.parse(execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], { encoding: "utf8" }).trim());
}

function stopNativeProcesses(processIds) {
  const script = `foreach ($processId in @(${processIds.join(",")})) { if (Get-Process -Id $processId -ErrorAction SilentlyContinue) { Stop-Process -Id $processId -ErrorAction Stop } }`;
  execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], { stdio: "pipe" });
}

async function smokeWindows() {
  if (process.platform !== "win32") throw new Error("This smoke test requires Windows and a built Tauri executable.");
  const root = path.resolve(__dirname, "..");
  const executable = path.join(root, "target", "release", "homeyield.exe");
  assert.ok(fs.existsSync(executable), "Run npm run build:windows first.");
  const reservation = net.createServer();
  await new Promise((resolve, reject) => {
    reservation.once("error", reject);
    reservation.listen(0, "127.0.0.1", resolve);
  });
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "homeyield-webview-"));
  const native = spawn(executable, [], {
    cwd: root,
    env: {
      ...process.env,
      WEBVIEW2_USER_DATA_FOLDER: profile,
      WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${port} --remote-debugging-address=127.0.0.1`,
    },
    stdio: "ignore",
  });
  let browser;
  let startError;
  native.on("error", (error) => { startError = error; });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (startError) throw startError;
      if (native.exitCode !== null) throw new Error(`Native application exited early (${native.exitCode}).`);
      try {
        const response = await fetch(`http://127.0.0.1:${port}/json/list`);
        ready = response.ok && (await response.json()).some((page) => page.type === "page");
      } catch (error) {
        if (!(error instanceof TypeError)) throw error;
      }
      if (ready) break;
      await delay(500);
    }
    assert.ok(ready, "The native WebView did not become ready within 30 seconds.");
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
    const page = browser.contexts()[0].pages()[0];
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.reload();
    await page.waitForSelector(".app-header", { timeout: 15000 });
    const result = await page.evaluate(async () => {
      const state = await window.__TAURI__.core.invoke("load_state");
      let rejectsInvalidState = false;
      try {
        await window.__TAURI__.core.invoke("save_state", { stateJson: "[]" });
      } catch (error) {
        rejectsInvalidState = String(error).includes("State must be a JSON object");
      }
      return {
        nativeBridge: Boolean(window.__TAURI__),
        databaseReadable: state === null || typeof JSON.parse(state) === "object",
        rejectsInvalidState,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    assert.deepEqual(result, { nativeBridge: true, databaseReadable: true, rejectsInvalidState: true, overflow: false });
    await page.locator(".app-header .download-link").click();
    await page.waitForSelector("#platforms");
    const scopedOpener = await page.evaluate(async () => {
      try {
        await window.__TAURI__.core.invoke("plugin:opener|open_url", { url: "https://example.com" });
        return "";
      } catch (error) {
        return String(error);
      }
    });
    assert.match(scopedOpener, /forbidden|not allowed|denied/i, "Download links must only open the configured HomeYield repository.");
    assert.deepEqual(errors, []);
    console.log("Native Windows smoke test passed: rendered UI, SQLite bridge, input validation, downloads, and scoped system-browser opener.");
  } finally {
    // Capture this instance's WebView descendants before its parent exits.
    const processIds = native.pid && native.exitCode === null ? nativeProcessTree(native.pid) : [];
    try {
      if (browser) await browser.close();
    } finally {
      if (processIds.length) stopNativeProcesses(processIds.reverse());
      await delay(500);
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
    }
  }
}

smokeWindows().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
