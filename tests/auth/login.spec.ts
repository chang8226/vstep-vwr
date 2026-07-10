import { test, expect } from '../fixtures';
import { currentEnv } from '../../config/environments';

// Bỏ storageState có sẵn của project (đã đăng nhập sẵn) để test này luôn bắt đầu
// từ trạng thái chưa đăng nhập, thực sự đi qua flow đăng nhập UI.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Đăng nhập - Hệ thống PREP', () => {
  test.skip(
    currentEnv === 'dev',
    'Môi trường dev bị Cloudflare Turnstile chặn đăng nhập tự động qua UI (xem isDev trong playwright.config.ts)'
  );

  test('TC01 - Đăng nhập thành công bằng email/password và vào được Learning Dashboard', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
    await dashboardPage.navigate();
    await expect(dashboardPage.userGreeting).toBeVisible({ timeout: 15000 });
  });
});
