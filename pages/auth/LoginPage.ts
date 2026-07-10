import { expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { currentEnvConfig } from '../../config/environments';

export class LoginPage extends BasePage {
  readonly startBtn = this.page.getByRole('button', { name: 'Bắt đầu' });
  readonly loginBtn = this.page.getByRole('button', { name: 'Đăng nhập' });
  readonly userIconArea = this.page.locator('.flex.items-center.justify-center > div:nth-child(4)');
  readonly emailInput = this.page.getByRole('textbox', { name: 'Nhập email/tên đăng nhập của' });
  readonly passwordInput = this.page.getByRole('textbox', { name: 'Nhập mật khẩu' });
  readonly startLearningBtn = this.page.getByRole('button', { name: 'Bắt đầu học' });

  async login(email: string, password: string) {
    // Trang login nằm ở domain gốc (không có "app."), khác baseURL của app -> cần URL tuyệt đối theo môi trường
    await this.goto(`${currentEnvConfig.rootURL}vi/`);

    // App là SPA: các bước dưới không có điều hướng full-page thực sự, nên chờ 'networkidle'
    // dễ bị treo tới timeout (xem lý do ở BasePage.goto). Thay vào đó chờ trực tiếp UI kế tiếp xuất hiện.
    // Site này đôi khi không kịp mở modal ngay lần click đầu (đo được trực tiếp khi verify) -> click lại
    // tối đa vài lần thay vì chờ 1 timeout dài duy nhất.
    await this.clickUntilVisible(this.startBtn, this.loginBtn);
    await this.clickUntilVisible(this.loginBtn, this.userIconArea);

    await this.userIconArea.click();
    await expect(this.emailInput).toBeVisible({ timeout: 15000 });

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();

    await expect(this.startLearningBtn).toBeVisible({ timeout: 30000 });
    await this.startLearningBtn.click();
  }

  private async clickUntilVisible(trigger: Locator, target: Locator, attempts = 3) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      await trigger.click();
      try {
        await expect(target).toBeVisible({ timeout: 5000 });
        return;
      } catch (error) {
        if (attempt === attempts) throw error;
      }
    }
  }
}
