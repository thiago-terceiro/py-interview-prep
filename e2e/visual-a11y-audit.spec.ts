import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const screens = [
  { name: 'home', path: '#/' },
  { name: 'catalog', path: '#/catalog' },
  { name: 'arena', path: '#/arena' },
  { name: 'patterns', path: '#/patterns' },
  { name: 'visualizers', path: '#/visualizers' },
  { name: 'cheatsheet', path: '#/cheatsheet' },
  { name: 'quiz', path: '#/quiz' },
];

test.describe('A11y & Contrast Audits Across Screens (Dark & Light Theme)', () => {
  for (const screen of screens) {
    test(`${screen.name} - Axe WCAG 2.1 AA Audit (Dark Theme)`, async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('py_interview_theme', 'dark');
      });
      await page.goto(screen.path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(150);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('.monaco-editor') // Monaco manages its own internal a11y DOM
        .analyze();

      if (accessibilityScanResults.violations.length > 0) {
        console.log(
          `A11y violations in ${screen.name} (Dark):`,
          accessibilityScanResults.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length,
          }))
        );
      }

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test(`${screen.name} - Axe WCAG 2.1 AA Audit (Light Theme)`, async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('py_interview_theme', 'light');
      });
      await page.goto(screen.path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(200);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('.monaco-editor')
        .analyze();

      if (accessibilityScanResults.violations.length > 0) {
        console.log(
          `A11y violations in ${screen.name} (Light):`,
          accessibilityScanResults.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length,
          }))
        );
      }

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
