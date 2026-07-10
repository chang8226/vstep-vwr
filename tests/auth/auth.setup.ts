import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/auth/LoginPage';

setup('authenticate user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
