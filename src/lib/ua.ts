// src/lib/ua.ts

import { UAParser } from "ua-parser-js";

export function parseUserAgent(rawUA: string): string {
  const parser = new UAParser(rawUA);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();
  const deviceInfo =
    device.vendor || device.model
      ? `${device.vendor || ""} ${device.model || ""}`.trim()
      : "PC/Unknown Device";

  return `${browser.name || "Unknown Browser"} ${browser.major || ""} (${os.name || "Unknown OS"} ${os.version || ""}) - ${deviceInfo}`.trim();
}
