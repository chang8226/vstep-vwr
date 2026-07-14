import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { currentEnvConfig } from '../../config/environments';

const { testDetailId, unitId, courseId } = currentEnvConfig.vsr;

export class VsrPreviewPage extends BasePage {
  // URL tương đối - Playwright sẽ tự ghép với baseURL theo TARGET_ENV
  static readonly previewUrl = `en/virtual-speaking-room/vstep/${testDetailId}/preview?proficiency&unit_id=${unitId}&course_id=${courseId}`;

  // Modal Giới thiệu chung ("VSTEP Speaking Introduction")
  readonly modal = this.page.getByRole('dialog');
  readonly introTitle = this.modal.getByText('VSTEP Speaking Introduction');
  readonly part1IntroBlock = this.modal.getByText('Part 1: Social Interaction');
  readonly part2IntroBlock = this.modal.getByText('Part 2: Solution Discussion');
  readonly part3IntroBlock = this.modal.getByText('Part 3: Topic Development');
  readonly dontShowAgainCheckbox = this.modal.getByRole('checkbox', {
    name: "Got it. Don't show this again",
  });
  readonly understandBtn = this.modal.getByRole('button', { name: 'I understand' });

  // Header
  readonly testHeader = this.page.locator('.test-header');
  readonly backBtn = this.testHeader.locator('.header-item-left button');
  readonly introBtn = this.page.getByRole('button', { name: 'Introduction' });
  readonly startBtn = this.page.getByRole('button', { name: 'Start' });

  // Teacher Bee - gợi ý xem trước bài test
  readonly previewHintText = this.page.getByText('Take a moment to preview your test!');

  // Sidebar - part list
  readonly partListHeading = this.page.getByText('Part list');
  readonly part1Item = this.page.locator('.part-item').nth(0);
  readonly part2Item = this.page.locator('.part-item').nth(1);
  readonly part3Item = this.page.locator('.part-item').nth(2);
  readonly part1Info = this.page.locator('.part-item').nth(0).locator('.part-info');
  readonly part2Info = this.page.locator('.part-item').nth(1).locator('.part-info');
  readonly part3Info = this.page.locator('.part-item').nth(2).locator('.part-info');

  // Nội dung đề bài
  readonly part1Title = this.page.getByText('Part 1: Social Interaction');
  readonly part2Title = this.page.getByText('Part 2: Solution Discussion');
  readonly part3Title = this.page.getByText('Part 3: Topic Development');

  async navigateToPreview() {
    await this.goto(VsrPreviewPage.previewUrl);
  }

  async closeIntroModal() {
    // Modal có thể mất một nhịp để render sau khi trang load xong, nên isVisible() kiểm tra ngay
    // dễ bị race (đọc false trong lúc modal đang mở) -> chờ modal xuất hiện trước khi quyết định.
    try {
      await this.modal.waitFor({ state: 'visible', timeout: 20000 });
    } catch {
      return;
    }
    await this.understandBtn.click();
    await expect(this.modal).toBeHidden();
  }
}
