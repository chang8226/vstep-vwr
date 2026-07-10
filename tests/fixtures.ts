import { test as base, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { HskPreviewPage } from '../pages/hsk/HskPreviewPage';
import { HskTestPage } from '../pages/hsk/HskTestPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { VstepPreviewPage } from '../pages/vstep/VstepPreviewPage';
import { VstepTestPage } from '../pages/vstep/VstepTestPage';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  hskPage: HskPreviewPage;
  hskTestPage: HskTestPage;
  vstepPage: VstepPreviewPage;
  vstepTestPage: VstepTestPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  hskPage: async ({ page }, use) => {
    await use(new HskPreviewPage(page));
  },
  hskTestPage: async ({ page }, use) => {
    await use(new HskTestPage(page));
  },
  vstepPage: async ({ page }, use) => {
    await use(new VstepPreviewPage(page));
  },
  vstepTestPage: async ({ page }, use) => {
    await use(new VstepTestPage(page));
  },
});

export { expect };
