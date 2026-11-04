import { test, expect } from '@playwright/test';

const screens = [
  { name: 'home', path: '#/' },
  { name: 'catalog', path: '#/catalog' },
  { name: 'arena', path: '#/arena' },
  { name: 'patterns', path: '#/patterns' },
  { name: 'visualizers', path: '#/visualizers' },
  { name: 'cheatsheet', path: '#/cheatsheet' },
  { name: 'quiz', path: '#/quiz' },
];

test.describe('Visual Regression Screenshot Tests Across Viewports', () => {
  test.setTimeout(60000);

  for (const screen of screens) {
    test(`${screen.name} - Visual Snapshot (Dark Theme)`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(screen.path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(300);
      await page.evaluate(() => document.fonts.ready);

      if (screen.name === 'arena') {
        await page.waitForSelector('.monaco-editor', { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(800);
      }

      // Mask dynamic cursor/interactive elements
      const monaco = page.locator('.monaco-editor');
      const mask = (await monaco.count()) > 0 ? [monaco] : [];

      await expect(page).toHaveScreenshot(`${screen.name}-dark.png`, {
        maxDiffPixelRatio: 0.05,
        timeout: 15000,
        mask,
      });
    });

    test(`${screen.name} - Visual Snapshot (Light Theme)`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(screen.path);
      await page.waitForLoadState('domcontentloaded');

      // Switch to Light Theme
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      });
      await page.waitForTimeout(300);
      await page.evaluate(() => document.fonts.ready);

      if (screen.name === 'arena') {
        await page.waitForSelector('.monaco-editor', { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(800);
      }

      const monaco = page.locator('.monaco-editor');
      const mask = (await monaco.count()) > 0 ? [monaco] : [];

      await expect(page).toHaveScreenshot(`${screen.name}-light.png`, {
        maxDiffPixelRatio: 0.05,
        timeout: 15000,
        mask,
      });
    });
  }
});
