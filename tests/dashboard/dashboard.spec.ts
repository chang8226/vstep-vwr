import { test, expect } from '../fixtures';
import { currentEnvConfig } from '../../config/environments';

test.beforeEach(async ({ dashboardPage }) => {
  await dashboardPage.navigate();
});

test('TC01 - Hiển thị name user', async ({ dashboardPage }) => {
  await expect(dashboardPage.userGreeting).toBeVisible();
});

test('TC02 - Hiển thị đúng thông tin chào mừng người dùng', async ({ dashboardPage }) => {
  await expect(dashboardPage.welcomeMessage).toBeVisible();
});

test('TC05 - Click btn', async ({ dashboardPage }) => {
  await expect(dashboardPage.startQuestBtn).toBeVisible();
  await expect(dashboardPage.startQuestBtn).toBeEnabled();
});

test('TC06 - Sidebar learning profile', async ({ dashboardPage }) => {
  await expect(dashboardPage.learningProfile).toBeVisible();
});

test('TC07 - Sidebar Xem tất cả', async ({ dashboardPage }) => {
  await expect(dashboardPage.viewAllLink).toBeVisible();
});

test('TC08 - Sidebar Your HSK Level', async ({ dashboardPage }) => {
  await expect(dashboardPage.hskLevelTitle).toBeVisible();
  await expect(dashboardPage.hskEntry).toBeVisible();
  await expect(dashboardPage.hskPredicted).toBeVisible();
  await expect(dashboardPage.hskTarget).toBeVisible();
});

test('TC09 - Sidebar Learning Summary', async ({ dashboardPage }) => {
  await expect(dashboardPage.learningSummary).toBeVisible();
  await expect(dashboardPage.totalDuration).toBeVisible();
  await expect(dashboardPage.totalCups).toBeVisible();
  await expect(dashboardPage.totalTests).toBeVisible();
  await expect(dashboardPage.totalLessons).toBeVisible();
});

test('TC10 - Khám phá ngay', async ({ page, dashboardPage }) => {
  await expect(dashboardPage.discoverBtn).toBeVisible();
  await dashboardPage.discoverBtn.click();
  await expect(page).toHaveURL(`${currentEnvConfig.rootURL}vi/hsk-v3`);
});
