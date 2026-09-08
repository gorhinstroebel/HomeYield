const { test, expect } = require("@playwright/test");

const viewports = [
  [280, 653], [320, 568], [360, 800], [390, 844], [480, 800],
  [667, 375], [768, 1024], [820, 1180], [1024, 600],
  [1280, 720], [1440, 900], [1920, 1080], [2560, 1440], [3840, 2160],
];

async function isolateDatabase(page) {
  let saved = null;
  await page.route("**/api/state", async (route) => {
    if (route.request().method() === "PUT") saved = route.request().postDataJSON().state;
    await route.fulfill({ json: { state: saved, saved: true } });
  });
}

async function fitsViewport(page) {
  await expect(page.locator("h1")).toBeVisible();
  const metrics = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
    nav: document.querySelector(".nav")?.getBoundingClientRect().toJSON(),
    height: innerHeight,
  }));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.width + 1);
  if (metrics.nav) {
    expect(metrics.nav.x).toBeGreaterThanOrEqual(0);
    expect(metrics.nav.right).toBeLessThanOrEqual(metrics.width + 1);
    expect(metrics.nav.bottom).toBeLessThanOrEqual(metrics.height + 1);
  }
}

for (const [width, height] of viewports) {
  test(`main flows fit ${width}x${height}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await isolateDatabase(page);
    await page.goto("/");
    await fitsViewport(page);
    if ([390, 1440].includes(width)) await page.screenshot({ path: testInfo.outputPath("welcome.png"), fullPage: true });
    await page.getByRole("button", { name: "Start tracking my plants" }).click();
    await fitsViewport(page);
    await page.getByRole("button", { name: "Tomato Vegetables", exact: true }).click();
    await page.getByRole("button", { name: "Basil Herbs", exact: true }).click();
    await page.getByRole("button", { name: /Planted today/ }).click();
    await fitsViewport(page);
    await page.getByRole("button", { name: "Start my care guide", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Today's care" })).toBeVisible();
    await fitsViewport(page);
    await page.locator('[data-task="water-tomato"]').getByRole("button", { name: "I watered it" }).click();
    await expect(page.locator('[data-task="water-tomato"]')).toHaveCount(0);
    await page.getByRole("button", { name: "My plants", exact: true }).click();
    await fitsViewport(page);
    await page.locator(".plant-record-main").first().click();
    await fitsViewport(page);
    await page.getByRole("textbox", { name: "Where is it?" }).fill("A very long windowsill name with plenty of room for notes");
    await page.getByRole("button", { name: "Save record", exact: true }).click();
    await page.getByRole("button", { name: "Plant help", exact: true }).click();
    await page.getByRole("button", { name: /My plant looks unhappy/ }).click();
    await fitsViewport(page);
    await page.getByRole("button", { name: /Brown spots on top/ }).click();
    await fitsViewport(page);
    await page.getByRole("button", { name: "Change theme", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Possible leaf spot." })).toBeVisible();
    await fitsViewport(page);
    await page.getByRole("button", { name: "Progress", exact: true }).click();
    await fitsViewport(page);
    await page.getByRole("button", { name: "My plants", exact: true }).click();
    await page.getByRole("button", { name: "Browse full plant library" }).click();
    await fitsViewport(page);
    await page.getByRole("textbox", { name: "Search full plant library" }).fill("rosemary");
    await expect(page.locator(".library-card:visible")).toHaveCount(1);
    await page.getByRole("button", { name: "Add to my plants", exact: true }).click();
    await page.getByRole("button", { name: "HomeYield home", exact: true }).click();
    await page.getByRole("button", { name: "Set garden location", exact: true }).click();
    await fitsViewport(page);
    await page.route("https://api.github.com/**", (route) => route.fulfill({ status: 404, json: { message: "Not Found" } }));
    await page.locator(".app-header").getByRole("link", { name: "Get the app" }).click();
    await page.waitForLoadState("load");
    await expect(page.locator("#release-title")).toHaveText("Installers have not been published yet.");
    await fitsViewport(page);
    await expect(page.locator("[data-asset]")).toHaveCount(10);
    if ([390, 1440].includes(width)) await page.screenshot({ path: testInfo.outputPath("downloads-dark.png"), fullPage: true });
    expect(errors).toEqual([]);
  });
}

test("release downloads handle partial availability, API errors, and retries", async ({ page }) => {
  let mode = "published";
  await page.route("https://api.github.com/**", async (route) => {
    if (mode === "error") return route.fulfill({ status: 503, body: "Unavailable" });
    await route.fulfill({ json: {
      tag_name: "v1.0.1", assets: [{
        name: "HomeYield-windows-x64-setup.exe", state: "uploaded", size: 2097152,
        browser_download_url: "https://github.com/gorhinstroebel/HomeYield/releases/download/v1.0.1/HomeYield-windows-x64-setup.exe",
      }],
    } });
  });
  await page.goto("/downloads.html");
  const windows = page.locator('[data-asset="HomeYield-windows-x64-setup.exe"]');
  await expect(windows).toHaveAttribute("data-available", "true");
  await expect(windows).toHaveAccessibleName("Download for Windows x64 (2.0 MB)");
  await expect(page.locator("[data-available=true]")).toHaveCount(1);
  await expect(page.locator('[data-asset="HomeYield-macos-x64.dmg"]')).toHaveAttribute("href", "https://github.com/gorhinstroebel/HomeYield/releases");
  mode = "error";
  await page.getByRole("button", { name: "Check again" }).click();
  await expect(page.locator("#release-title")).toContainText("couldn't check");
  await expect(page.locator("[data-available=true]")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Check again" })).toBeEnabled();
  mode = "published";
  await page.getByRole("button", { name: "Check again" }).click();
  await expect(windows).toHaveAttribute("data-available", "true");
});

test("local download buttons identify unpublished builds and download the installer", async ({ page }) => {
  await page.route("**/downloads.html", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace('name="homeyield-download-source" content="github"', 'name="homeyield-download-source" content="local"');
    await route.fulfill({ response, body });
  });
  await page.route("**/local-downloads.json", (route) => route.fulfill({ json: {
    assets: [{
      name: "HomeYield-windows-x64-setup.exe", state: "uploaded", size: 2048,
      browser_download_url: "/local-downloads/HomeYield-windows-x64-setup.exe",
    }],
  } }));
  await page.route("**/local-downloads/HomeYield-windows-x64-setup.exe", (route) => route.fulfill({
    body: Buffer.alloc(2048),
    headers: { "Content-Type": "application/octet-stream", "Content-Disposition": 'attachment; filename="HomeYield-windows-x64-setup.exe"' },
  }));
  await page.goto("/downloads.html");
  await expect(page.locator("#release-title")).toHaveText("Local builds - not published");
  await expect(page.locator("[data-available=true]")).toHaveCount(1);
  const transfer = page.waitForEvent("download");
  await page.locator('[data-asset="HomeYield-windows-x64-setup.exe"]').click();
  const download = await transfer;
  expect(download.suggestedFilename()).toBe("HomeYield-windows-x64-setup.exe");
  expect(await download.failure()).toBeNull();
});

test("completed care survives a browser restart and keyboard navigation works", async ({ page }) => {
  await isolateDatabase(page);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#app-content")).toBeFocused();
  await page.getByRole("button", { name: "Start tracking my plants" }).click();
  await page.getByRole("button", { name: "Tomato Vegetables", exact: true }).click();
  await page.getByRole("button", { name: /Planted today/ }).click();
  await page.getByRole("button", { name: "Start my care guide", exact: true }).click();
  await page.getByRole("button", { name: "I watered it", exact: true }).click();
  await expect(page.getByText("All caught up.", { exact: true })).toBeVisible();
  await page.waitForResponse((response) => response.url().endsWith("/api/state") && response.request().method() === "PUT");
  await page.reload();
  await expect(page.getByText("All caught up.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "My plants", exact: true }).click();
  await expect(page.locator("h1")).toBeFocused();
  await expect(page.getByRole("button", { name: "My plants", exact: true })).toHaveAttribute("aria-current", "page");
});
