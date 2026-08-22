import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const src = resolve("scripts/og-source.jpg");
const outJpg = resolve("public/og.jpg");
const outTs = resolve("server/og-jpeg.ts");
const partsDir = resolve("public/og-parts");

execFileSync("ffmpeg", [
  "-y",
  "-i",
  src,
  "-vf",
  "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630",
  "-q:v",
  "3",
  outJpg,
]);

const jpg = readFileSync(outJpg);
const b64 = jpg.toString("base64");
writeFileSync(outTs, `export const OG_JPEG_B64 = "${b64}";\n`);

mkdirSync(partsDir, { recursive: true });
for (const name of readdirSync(partsDir)) {
  unlinkSync(resolve(partsDir, name));
}
const chunk = 18000;
let i = 0;
for (let offset = 0; offset < b64.length; offset += chunk) {
  writeFileSync(resolve(partsDir, `p${String(i).padStart(2, "0")}`), b64.slice(offset, offset + chunk));
  i += 1;
}

console.log(`og.jpg ${Math.round(jpg.byteLength / 1024)} KB · ${outTs}`);
