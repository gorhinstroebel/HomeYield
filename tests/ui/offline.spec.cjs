const { test, expect } = require("@playwright/test");

test.use({ serviceWorkers: "allow" });

test("offline shell retains the app, downloads, and correct asset types", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true }));
    }
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".offline-banner")).toContainText("Offline mode");
  await page.locator(".app-header .download-link").click();
  await expect(page.getByRole("heading", { name: "Choose your platform." })).toBeVisible();
  await expect(page.locator("#release-title")).toHaveText("We couldn't check downloads right now.");
  const css = await page.evaluate(async () => {
    const response = await fetch("downloads.css");
    return { contentType: response.headers.get("content-type"), text: (await response.text()).slice(0, 16) };
  });
  expect(css.contentType).toContain("text/css");
  expect(css.text).toContain(".downloads-shell");
  await context.setOffline(false);
});

test("native download links use the system browser and surface opener failures", async ({ page }) => {
  await page.addInitScript(() => {
    window.__TAURI__ = { core: { invoke: async (command, args) => {
      window.lastNativeOpen = { command, url: args.url };
      throw new Error("Test browser launch failed");
    } } };
  });
  await page.route("https://api.github.com/**", (route) => route.fulfill({ status: 404, json: {} }));
  await page.goto("/downloads.html");
  await expect(page.locator("#release-title")).toContainText("not been published");
  await page.locator('[data-asset="HomeYield-windows-x64-setup.exe"]').click();
  await expect(page.locator("#release-status")).toContainText("Could not open your browser.");
  expect(await page.evaluate(() => window.lastNativeOpen)).toEqual({
    command: "plugin:opener|open_url",
    url: "https://github.com/gorhinstroebel/HomeYield/releases",
  });
  await expect(page).toHaveURL(/downloads\.html$/);
});
