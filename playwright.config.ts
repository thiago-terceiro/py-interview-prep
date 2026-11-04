import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  expect: {
    timeout: 20000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5189',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: {
        viewport: { width: 375, height: 667 },
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'desktop',
      use: {
        viewport: { width: 1280, height: 800 },
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'ultrawide',
      use: {
        viewport: { width: 1920, height: 1080 },
        defaultBrowserType: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'npm.cmd run dev -- --port 5189 --strictPort',
    url: 'http://localhost:5189',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
