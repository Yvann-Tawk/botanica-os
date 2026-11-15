import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const win = (page: Page, label: string) => page.getByLabel(`${label} window`, { exact: true });

async function scan(page: Page, include: string) {
  const r = await new AxeBuilder({ page }).include(include).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const summary = r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ` + v.nodes.map((n) => `${n.target.join(" ")} — ${(n.any[0]?.message ?? "").slice(0, 120)}`).join(" | "));
  expect(summary, summary.join('\n')).toEqual([]);
}

test('the desktop loads, is cross-origin isolated, and windows open from the dock', async ({ page }) => {
  await page.goto('/?start=desktop');
  expect(await page.evaluate(() => crossOriginIsolated)).toBe(true);
  await page.getByRole('navigation', { name: 'Seed tray' }).getByRole('button', { name: 'Open Universe' }).click();
  await expect(win(page, 'Universe')).toHaveClass(/is-open/);
  await expect(page.getByText(/of 48 concepts complete/)).toBeVisible();
});

test('the Terminal runs real Python, answers input(), and stops an endless loop', async ({ page }) => {
  await page.goto('/?start=terminal');
  const t = win(page, 'Terminal');
  await expect(t.getByRole('status').filter({ hasText: 'ready' })).toBeVisible({ timeout: 60_000 });
  await t.getByRole('button', { name: /^Run/ }).click();
  await expect(t.getByRole('log')).toContainText('480 seeds stored at 62% humidity');

  await t.getByRole('button', { name: 'scratch.py', exact: true }).first().click();
  await t.getByRole('button', { name: /^Run/ }).click();
  const answer = t.getByLabel(/Answer for input\(\)/);
  await answer.fill('ada');
  await answer.press('Enter');
  await expect(t.getByRole('log')).toContainText('Welcome aboard, Ada');

  const prompt = t.getByLabel('Python prompt');
  await prompt.fill('while True: pass');
  await prompt.press('Enter');
  await t.getByRole('button', { name: 'Stop' }).click();
  await expect(t.getByRole('log')).toContainText('Stopped.');
  await prompt.fill('6 * 7');
  await prompt.press('Enter');
  await expect(t.getByRole('log')).toContainText('42');
});

test('an Academy exercise is validated by real Python', async ({ page }) => {
  await page.goto('/?start=academy');
  await page.evaluate(() => localStorage.clear());
  const a = win(page, 'Academy');
  await a.getByRole('button', { name: /Stage 3: Practice/ }).click();
  await a.getByRole('button', { name: 'Check my work' }).click();
  await expect(a.getByText('(not yet)').first()).toBeAttached({ timeout: 60_000 });
});

test('accessibility: the shell and every window have no axe (WCAG 2.1 AA) violations', async ({ page }) => {
  await page.goto('/?start=desktop');
  await scan(page, '.mbar');
  await scan(page, '.dock');
  await scan(page, '.dicons');
  await scan(page, '.note');
  for (const [app, label] of [['universe', 'Universe'], ['academy', 'Academy'], ['missions', 'Missions'], ['profile', 'Pilot logbook'], ['settings', 'Settings'], ['workshop', 'Workshop'], ['terminal', 'Terminal']] as const) {
    await page.goto(`/?start=${app}`);
    await expect(win(page, label)).toHaveClass(/is-open/);
    await page.waitForTimeout(800); // let entrance animations settle so contrast is measured at rest
    await scan(page, `section[data-app="${app}"]`);
  }
});

test('works offline: the app reloads from the service worker and Python still runs', async ({ page, context }) => {
  await page.goto('/?start=terminal');
  const t = win(page, 'Terminal');
  await expect(t.getByRole('status').filter({ hasText: 'ready' })).toBeVisible({ timeout: 60_000 });
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  // Make sure Python is cached (it normally is after its first load).
  await page.goto('/?start=settings');
  const s = win(page, 'Settings');
  // Wait until Settings knows the cache state (lazy window + async check) before deciding whether to click.
  const btn = s.getByRole('button', { name: 'Make Python available offline' });
  const stored = s.getByText('Python is stored on this device');
  await expect(btn.or(stored)).toBeVisible({ timeout: 30_000 });
  if (await btn.isVisible()) await btn.click();
  await expect(stored).toBeVisible({ timeout: 60_000 });

  await context.setOffline(true);
  await page.goto('/?start=terminal');
  expect(await page.evaluate(() => crossOriginIsolated)).toBe(true);
  const t2 = win(page, 'Terminal');
  await expect(t2.getByRole('status').filter({ hasText: 'ready' })).toBeVisible({ timeout: 60_000 });
  await t2.getByRole('button', { name: /^Run/ }).click();
  await expect(t2.getByRole('log')).toContainText('480 seeds stored at 62% humidity');
  await context.setOffline(false);
});

test('performance: the desktop starts light; Python and Monaco load only when a code window opens', async ({ page }) => {
  const urls: string[] = [];
  page.on('request', (r) => urls.push(r.url()));
  await page.goto('/?start=desktop');
  await expect(page.getByRole('navigation', { name: 'Seed tray' })).toBeVisible();
  const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming; return n.domContentLoadedEventEnd; });
  expect(nav).toBeLessThan(3000);
  await page.waitForTimeout(1500);
  expect(urls.filter((u) => u.includes('/pyodide/'))).toEqual([]);
  expect(urls.filter((u) => /MonacoEditor|editor\.worker/.test(u))).toEqual([]);

  await page.getByRole('navigation', { name: 'Seed tray' }).getByRole('button', { name: 'Open Terminal' }).click();
  await expect.poll(() => urls.some((u) => u.includes('/pyodide/pyodide.asm.wasm')), { timeout: 30_000 }).toBe(true);
});

test('keyboard only: reach the dock, open a window, use a menu, and Escape out', async ({ page }) => {
  await page.goto('/?start=desktop');
  let found = false;
  for (let i = 0; i < 40 && !found; i++) {
    await page.keyboard.press('Tab');
    found = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'Open Missions' && !!document.activeElement.closest('.dock'));
  }
  expect(found).toBe(true);
  await page.keyboard.press('Enter');
  await expect(win(page, 'Missions')).toHaveClass(/is-open/);
  expect(await page.evaluate(() => !!document.activeElement?.closest('section[data-app="missions"]'))).toBe(true);

  await page.getByRole('button', { name: 'Go', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem').first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem').nth(1)).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Go', exact: true })).toBeFocused();
});

async function solveInAcademy(page: Page, lessonLabel: RegExp, code: string) {
  // Use the plain editor so the test can type exactly (Monaco auto-closes brackets).
  const simple = 'Simple editor everywhere (lighter, plain text area)';
  await page.goto('/?start=settings');
  await win(page, 'Settings').getByLabel(simple).check();
  // The setting saves asynchronously; navigating before the write lands loses it and leaves Monaco auto-indenting the typed code.
  await expect.poll(() => page.evaluate(() => new Promise((res) => {
    const o = indexedDB.open('botanica');
    o.onsuccess = () => { const g = o.result.transaction('kv').objectStore('kv').get('settings'); g.onsuccess = () => res(g.result?.editor); };
    o.onerror = () => res(null);
  }))).toBe('simple');
  await page.goto('/?start=academy');
  const a = win(page, 'Academy');
  const picker = a.getByLabel('Choose a lesson');
  await picker.waitFor();
  const label = (await picker.locator('option').allTextContents()).find((t) => lessonLabel.test(t))!;
  await picker.selectOption({ label });
  await expect(a.getByRole('heading', { level: 1 })).toHaveText(label.replace(/^Lesson \d+ · /, '').replace(/ ✓$/, ''));
  await a.getByRole('button', { name: /Stage 3: Practice/ }).click();
  await a.getByLabel(/Python code editor for the lesson/).fill(code);
  await a.getByRole('button', { name: 'Check my work' }).click();
  return a;
}

test('a later galaxy in the real browser: the HTTP lesson fetches the bundled API from the worker', async ({ page }) => {
  const a = await solveInAcademy(page, /HTTP & APIs/, 'import json\nfrom pyodide.http import open_url\n\nURL = "/data/forecast.json"\nforecast = json.loads(open_url(URL).read())\ndays = len(forecast["days"])\nwarmest = max(day["high"] for day in forecast["days"])\nprint(days, "days, warmest", warmest)\n');
  await expect(a.getByText('Logged')).toBeVisible({ timeout: 60_000 });
  await expect(a.getByText('(not yet)')).toHaveCount(0);
});

test('async & await runs for real in the browser (stack switching)', async ({ page }) => {
  const a = await solveInAcademy(page, /async & await/, 'import asyncio\n\nbays = ["B1", "B2", "B3"]\n\nasync def water(bay):\n    await asyncio.sleep(0.1)\n    return f"{bay} watered"\n\nasync def main():\n    return await asyncio.gather(*(water(b) for b in bays))\n\nresults = asyncio.run(main())\nprint(results)\n');
  await expect(a.getByText('Logged')).toBeVisible({ timeout: 60_000 });
  await expect(a.getByRole('log')).toContainText("['B1 watered', 'B2 watered', 'B3 watered']");
});

test('Terraform OS opens on Orbis; Botanica launches for real and the learner can come back', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Terraform OS');
  const explorer = win(page, 'Orbis Explorer');
  await expect(explorer).toHaveClass(/is-open/);
  await explorer.getByRole('button', { name: /Ironworks/ }).click();
  await expect(explorer.getByRole('button', { name: 'Coming soon' })).toBeDisabled();
  await explorer.getByRole('button', { name: /Botanica/ }).first().click();
  await explorer.getByRole('button', { name: 'Enter Botanica' }).click();
  await expect(page.getByRole('navigation', { name: 'Seed tray' })).toBeVisible();
  await expect(page).toHaveURL(/#\/botanica$/);
  await page.goBack();
  await expect(win(page, 'Orbis Explorer')).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('navigation', { name: 'Seed tray' })).toBeVisible();
  await page.getByRole('button', { name: 'Go' }).click();
  await page.getByRole('menuitem', { name: /Return to Orbis/ }).click();
  await expect(win(page, 'Orbis Explorer')).toBeVisible();
});

test('fullscreen: Orbis Settings enters and leaves real fullscreen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Go' }).click();
  await page.getByRole('menuitem', { name: /Settings/ }).click();
  const s = win(page, 'Settings');
  await s.getByRole('button', { name: 'Enter' }).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await s.getByRole('button', { name: 'Exit' }).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
});

test('accessibility: the Orbis hub has no axe (WCAG 2.1 AA) violations', async ({ page }) => {
  await page.goto('/');
  await expect(win(page, 'Orbis Explorer')).toHaveClass(/is-open/);
  await page.waitForTimeout(800);
  for (const sel of ['.orbis .mbar', '.orbis .dock', '.orbis .dicons', '.orbis .note', '.orbis section[data-app="orbis"]']) await scan(page, sel);
  for (const app of ['Journal', 'Settings']) {
    await page.getByRole('button', { name: 'Go' }).click();
    await page.getByRole('menuitem', { name: new RegExp(app) }).click();
    await page.waitForTimeout(800);
    await scan(page, `.orbis section[data-app="${app.toLowerCase()}"]`);
  }
});
