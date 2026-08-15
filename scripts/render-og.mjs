import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const html = pathToFileURL(resolve("scripts/og-card.html")).href;
const rawPng = "/tmp/og-raw.png";
const outJpg = resolve("public/og.jpg");
const outTs = resolve("server/og-jpeg.ts");
const partsDir = resolve("public/og-parts");

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto(html, { waitUntil: "networkidle", timeout: 45000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: rawPng, type: "png" });
await browser.close();

execFileSync("ffmpeg", [
  "-y",
  "-i",
  rawPng,
  "-vf",
  "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630",
  "-q:v",
  "4",
  outJpg,
]);

const jpg = readFileSync(outJpg);
const b64 = jpg.toString("base64");
writeFileSync(outTs, `export const OG_JPEG_B64 = "${b64}";\n`);

mkdirSync(partsDir, { recursive: true });
const chunk = 18000;
let i = 0;
for (let offset = 0; offset < b64.length; offset += chunk) {
  writeFileSync(resolve(partsDir, `p${String(i).padStart(2, "0")}`), b64.slice(offset, offset + chunk));
  i += 1;
}

console.log(`og.jpg ${Math.round(jpg.byteLength / 1024)} KB · ${outTs}`);
