// Turns the webpack output in dist/chrome into ready-to-load builds for Chrome, Edge and Firefox,
// plus a .zip of each for uploading to the browser stores.

import { createWriteStream } from "node:fs";
import { cp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ZipArchive } from "archiver";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const chromeDir = path.join(dist, "chrome");

const FIREFOX_ADDON_ID = "fillpilot@fillpilot.app";

const baseManifest = JSON.parse(await readFile(path.join(chromeDir, "manifest.json"), "utf8"));

const manifests = {
  chrome: {
    ...baseManifest,
    minimum_chrome_version: "110",
  },
  edge: {
    // Edge runs Chrome extensions as they are; it reads minimum_chrome_version too.
    ...baseManifest,
    minimum_chrome_version: "110",
  },
  firefox: (() => {
    const manifest = {
      ...baseManifest,
      // Firefox runs MV3 background code as an event page instead of a service worker.
      background: { scripts: [baseManifest.background.service_worker] },
      browser_specific_settings: {
        gecko: { id: FIREFOX_ADDON_ID, strict_min_version: "128.0" },
      },
    };
    return manifest;
  })(),
};

function zipDirectory(sourceDir, zipPath) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    // Source maps are useful locally but do not belong in store uploads.
    archive.glob("**/*", { cwd: sourceDir, ignore: ["**/*.map"] });
    archive.finalize();
  });
}

for (const [browser, manifest] of Object.entries(manifests)) {
  const browserDir = path.join(dist, browser);
  if (browser !== "chrome") {
    await rm(browserDir, { recursive: true, force: true });
    await cp(chromeDir, browserDir, { recursive: true });
  }
  await writeFile(path.join(browserDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  const zipPath = path.join(dist, `fillpilot-${browser}-${manifest.version}.zip`);
  await rm(zipPath, { force: true });
  await zipDirectory(browserDir, zipPath);
  console.log(`  ${browser.padEnd(8)} dist/${browser}/  →  ${path.relative(root, zipPath)}`);
}
