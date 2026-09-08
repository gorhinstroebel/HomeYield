const { defineConfig } = require("@playwright/test");
const port = process.env.HOMEYIELD_TEST_PORT || "4187";
const baseURL = `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: "./tests/ui",
  timeout: 45000,
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium" },
    { name: "webkit", use: { browserName: "webkit" }, grep: /390x844|768x1024|1440x900|release downloads/ },
  ],
  use: {
    baseURL,
    browserName: "chromium",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "python server.py",
    url: `${baseURL}/api/health`,
    env: { PORT: port },
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
    stdout: "ignore",
    stderr: "ignore",
  },
});
