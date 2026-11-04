import { test, expect } from '@playwright/test';

const screens = [
  { name: 'Home Page', path: '#/' },
  { name: 'Question Catalog', path: '#/catalog' },
  { name: 'Problem Arena', path: '#/arena' },
  { name: 'Algorithm Patterns Hub', path: '#/patterns' },
  { name: 'Interactive Visualizers', path: '#/visualizers' },
  { name: 'Python Cheatsheet', path: '#/cheatsheet' },
  { name: 'ML Quiz Hub (Quiz Mode)', path: '#/quiz' },
];

test.describe('Responsive Layout & No-Overflow Integrity Across All Viewports', () => {
  for (const screen of screens) {
    test(`Screen: ${screen.name} has no horizontal scrollbar and renders properly`, async ({ page }) => {
      // Collect any uncaught console errors
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));

      await page.goto(screen.path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(100);

      // Verify no horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          docWidth,
          winWidth,
          hasHorizontalScroll: docWidth > winWidth + 1,
        };
      });

      expect(
        overflow.hasHorizontalScroll,
        `Page ${screen.name} has horizontal overflow! scrollWidth: ${overflow.docWidth}px, innerWidth: ${overflow.winWidth}px`
      ).toBe(false);

      expect(errors).toEqual([]);
    });
  }
});

test.describe('Quiz Hub Modes Responsive & Layout Verification', () => {
  test('Quiz Hub Flashcard mode and List mode have no horizontal overflow', async ({ page }) => {
    await page.goto('#/quiz');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(100);

    // Switch to Flashcard mode
    const flashcardTab = page.getByRole('button', { name: /flashcard/i });
    if (await flashcardTab.isVisible()) {
      await flashcardTab.click();
      await page.waitForTimeout(300);

      const overflowFlashcard = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1;
      });
      expect(overflowFlashcard, 'Flashcard mode has horizontal overflow').toBe(false);
    }

    // Switch to List mode
    const listTab = page.getByRole('button', { name: /list/i });
    if (await listTab.isVisible()) {
      await listTab.click();
      await page.waitForTimeout(300);

      const overflowList = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1;
      });
      expect(overflowList, 'List mode has horizontal overflow').toBe(false);
    }
  });
});
