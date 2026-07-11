import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'npm run start:backend:local',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      // E2E テスト実行時は aws-blocks エミュレーションモードを使用
      env: {
        ...process.env,
        USE_AWS_BLOCKS_EMULATION: 'true',
        NODE_ENV: 'test',
      },
    },
    {
      command: 'npm run start:frontend',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});
