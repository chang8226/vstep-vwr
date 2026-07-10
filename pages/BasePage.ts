import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
    // Không dùng 'networkidle': trang có script chạy nền liên tục (tracking...)
    // nên không bao giờ thực sự "rảnh mạng", khiến lệnh chờ bị treo tới hết timeout.
    await this.page.waitForLoadState('load');
  }
}
