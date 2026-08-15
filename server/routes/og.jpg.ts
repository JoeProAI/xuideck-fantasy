import { defineEventHandler, setResponseHeaders } from "h3";
import { OG_JPEG_B64 } from "../og-jpeg";

/**
 * Serve the share card from bundled JPEG bytes.
 * Production Nitro/Vercel drops binary files in public/, so /og.jpg 404s
 * if we only put the file on the CDN. This route is the unfurl.
 */
export default defineEventHandler((event) => {
  const body = Buffer.from(OG_JPEG_B64, "base64");
  setResponseHeaders(event, {
    "content-type": "image/jpeg",
    "content-length": String(body.byteLength),
    "cache-control": "public, max-age=604800, stale-while-revalidate=86400",
    "access-control-allow-origin": "*",
  });
  return body;
});
