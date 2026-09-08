const RELEASES_URL = "https://github.com/gorhinstroebel/HomeYield/releases";
const RELEASES_API = "https://api.github.com/repos/gorhinstroebel/HomeYield/releases/latest";

function publishedAssets(release, localOrigin = null) {
  const assets = new Map();
  if (!release || release.draft || release.prerelease || !Array.isArray(release.assets)) return assets;
  for (const asset of release.assets) {
    if (asset.state !== "uploaded" || !Number.isFinite(asset.size) || asset.size <= 0) continue;
    try {
      const url = localOrigin ? new URL(asset.browser_download_url, localOrigin) : new URL(asset.browser_download_url);
      const allowed = localOrigin
        ? url.origin === localOrigin && url.pathname === `/local-downloads/${encodeURIComponent(asset.name)}` && !url.search && !url.hash
        : url.origin === "https://github.com" && url.pathname.startsWith("/gorhinstroebel/HomeYield/releases/download/");
      if (!allowed || url.username || url.password) continue;
      assets.set(asset.name, { url: url.href, size: asset.size });
    } catch {
      // Invalid release URLs are not offered as installer links.
    }
  }
  return assets;
}

function formatDownloadSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function refreshDownloads() {
  const title = document.querySelector("#release-title");
  const status = document.querySelector("#release-status");
  const retry = document.querySelector("#retry-downloads");
  const links = Array.from(document.querySelectorAll("[data-asset]"));
  const local = document.querySelector('meta[name="homeyield-download-source"]')?.content === "local";
  retry.disabled = true;
  status.textContent = local ? "Checking installers built in this checkout..." : "Checking GitHub for published installers...";
  for (const link of links) {
    link.href = RELEASES_URL;
    link.removeAttribute("data-available");
    link.removeAttribute("aria-label");
    link.querySelector(".asset-status").textContent = "View releases";
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(local ? "local-downloads.json" : RELEASES_API, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" }, credentials: "omit", cache: "no-store" });
    if (response.status === 404 && !local) {
      title.textContent = "Installers have not been published yet.";
      status.textContent = "Release builds are being prepared. Use the web app now, or check GitHub Releases for updates.";
      return;
    }
    if (!response.ok) throw new Error(`Release check returned HTTP ${response.status}`);
    const release = await response.json();
    const assets = publishedAssets(release, local ? location.origin : null);
    let available = 0;
    for (const link of links) {
      const asset = assets.get(link.dataset.asset);
      if (asset) {
        link.href = asset.url;
        link.dataset.available = "true";
        link.setAttribute("aria-label", `${link.dataset.label} (${formatDownloadSize(asset.size)})`);
        link.querySelector(".asset-status").textContent = `Download - ${formatDownloadSize(asset.size)}`;
        available += 1;
      } else {
        link.querySelector(".asset-status").textContent = local ? "Not built locally" : "Not in this release";
      }
    }
    if (local) {
      title.textContent = available ? "Local builds - not published" : "No installers built in this checkout yet.";
      status.textContent = `${available} local installer${available === 1 ? "" : "s"} available. These files come from this checkout, not GitHub Releases, and may be unsigned. Other platforms link to the public release page.`;
    } else {
      title.textContent = available ? `HomeYield ${release.tag_name || "latest release"}` : "No supported installers in the latest release.";
      status.textContent = available
        ? `${available} installer${available === 1 ? "" : "s"} available. Choose your operating system and processor below. Other platforms link to the release notes.`
        : "You can still use the web app. Browse the release notes for build availability.";
    }
  } catch (error) {
    title.textContent = "We couldn't check downloads right now.";
    status.textContent = local
      ? "The local build server could not read its installers. Try again and check the server output, or browse GitHub Releases."
      : "You may be offline, or GitHub may be busy. Try again or use the platform links to browse releases directly.";
    console.warn("HomeYield release availability check failed.", error);
  } finally {
    clearTimeout(timeout);
    retry.disabled = false;
    retry.hidden = false;
  }
}

function initializeDownloads() {
  try {
    const saved = JSON.parse(localStorage.getItem("homeyield-garden") || "{}");
    const theme = ["light", "dark"].includes(saved.theme) ? saved.theme : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch (error) {
    console.warn("HomeYield theme preference could not be read.", error);
    document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.querySelector("#retry-downloads").addEventListener("click", refreshDownloads);
  document.addEventListener("click", async (event) => {
    const link = event.target.closest("a[href]");
    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI_INTERNALS__?.invoke;
    if (!link || !invoke || new URL(link.href).origin !== "https://github.com") return;
    event.preventDefault();
    try {
      await invoke("plugin:opener|open_url", { url: link.href });
    } catch (error) {
      document.querySelector("#release-status").textContent = `Could not open your browser. Copy this link into your browser: ${link.href}`;
      document.querySelector("#release-status").scrollIntoView({ block: "center" });
      console.warn("HomeYield could not open the download link.", error);
    }
  });
  void refreshDownloads();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { publishedAssets, formatDownloadSize };
} else {
  initializeDownloads();
}
