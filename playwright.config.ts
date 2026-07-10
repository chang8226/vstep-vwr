import { defineConfig, devices } from '@playwright/test';
import { currentEnv, currentEnvConfig } from './config/environments';

// Cloudflare Turnstile chặn đăng nhập tự động qua UI trên dev, nên môi trường này
// dùng thẳng storageState lấy thủ công (xem playwright/.auth/dev-user.json) thay vì
// chạy auth.setup.ts.
const isDev = currentEnv === 'dev';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [['html'], ['github'], ['list']] : [['html'], ['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 20000,
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: currentEnvConfig.baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Lưu ảnh chụp/video khi test fail để debug, không lưu khi test pass để đỡ tốn dung lượng */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project - chạy trước để đăng nhập qua UI (bỏ qua trên dev, xem giải thích ở isDev)
    ...(isDev ? [] : [{ name: 'setup', testMatch: /auth\.setup\.ts/ }]),

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: isDev ? 'playwright/.auth/dev-user.json' : 'playwright/.auth/user.json',
      },
      dependencies: isDev ? [] : ['setup'],
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
