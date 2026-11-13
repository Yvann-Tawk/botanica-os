// Renders public/icon.svg to the PNG sizes the web manifest and iOS need, using Playwright's Chromium.
// Run after changing the icon: node scripts/make-icons.mjs
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const svg = readFileSync('public/icon.svg', 'utf8');
const OUT = [
  { file: 'public/icon-192.png', size: 192, pad: 0 },
  { file: 'public/icon-512.png', size: 512, pad: 0 },
  { file: 'public/apple-touch-icon.png', size: 180, pad: 0 },
  // Maskable: full-bleed paper with the mark inside the 80% safe zone.
  { file: 'public/icon-maskable-512.png', size: 512, pad: 0.12 },
];

// PW_CHANNEL=chrome uses an installed Google Chrome instead of Playwright's own download.
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const page = await browser.newPage();
for (const o of OUT) {
  const inner = Math.round(o.size * (1 - 2 * o.pad));
  await page.setViewportSize({ width: 1024, height: 1024 });
  const src = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  await page.setContent(`<html><body style="margin:0;overflow:hidden;background:transparent"><div style="position:absolute;left:0;top:0;width:${o.size}px;height:${o.size}px;background:${o.pad ? "#efe8d6" : "transparent"}"></div>
    <img src="${src}" width="${inner}" height="${inner}" style="display:block;position:absolute;left:${(o.size - inner) / 2}px;top:${(o.size - inner) / 2}px"></body></html>`);
  await page.waitForFunction(() => document.images[0]?.complete);
  await page.screenshot({ path: o.file, omitBackground: !o.pad, clip: { x: 0, y: 0, width: o.size, height: o.size } });
  console.log(o.file);
}
await browser.close();
