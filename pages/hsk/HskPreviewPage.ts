import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { currentEnvConfig } from '../../config/environments';

const { testSetId, testDetailId, submissionSkillId } = currentEnvConfig.hsk;

export class HskPreviewPage extends BasePage {
  // URL tương đối - Playwright sẽ tự ghép với baseURL theo TARGET_ENV
  static readonly previewUrl = `vi/virtual-writing-room/hsk-v3/${testDetailId}/preview?test_set=${testSetId}&submission_skill_id=${submissionSkillId}`;
  static readonly testDetailUrl = `vi/test-practice/hsk-v3/${testSetId}/test-detail/${testDetailId}`;

  // Modal Giới thiệu
  readonly modal = this.page.getByRole('dialog');
  readonly introTitle = this.page.getByRole('dialog').getByText('Giới thiệu Bài thi Viết HSK');
  readonly hsk2Tab = this.page.getByRole('dialog').getByRole('button', { name: 'HSK 2' });
  readonly hsk3Tab = this.page.getByRole('dialog').getByRole('button', { name: 'HSK 3' });
  readonly hsk4Tab = this.page.getByRole('dialog').getByRole('button', { name: 'HSK 4' });
  readonly hsk5Tab = this.page.getByRole('dialog').getByRole('button', { name: 'HSK 5' });
  readonly hsk6Tab = this.page.getByRole('dialog').getByRole('button', { name: 'HSK 6' });
  readonly confirmBtn = this.page
    .getByRole('dialog')
    .getByRole('button', { name: 'Tôi Đã Nắm Rõ Rồi' });

  // Header
  readonly testHeader = this.page.locator('.test-header');
  readonly backBtn = this.page.getByTestId('vwr-hsk-test-header-back');
  readonly introBtn = this.page.getByRole('button', { name: 'Giới thiệu' });
  readonly continueTestBtn = this.page.getByRole('button', { name: 'Tiếp tục thi' });
  readonly continueBtn = this.page.getByRole('button', { name: 'Tiếp tục' });

  // Sidebar - test info
  readonly testInfo = this.page.locator('.test-info');

  // Sidebar - parts list
  readonly part1Item = this.page.locator('.part-item').first();
  readonly part2Item = this.page.locator('.part-item').nth(1);
  readonly part1Info = this.page.locator('.part-item').first().locator('.part-info');
  readonly part2Info = this.page.locator('.part-item').nth(1).locator('.part-info');

  async navigateToPreview() {
    await this.goto(HskPreviewPage.previewUrl);
  }

  async navigateToTestDetail() {
    await this.goto(HskPreviewPage.testDetailUrl);
  }

  async closeIntroModal() {
    // Modal có thể mất một nhịp để render sau khi trang load xong, nên isVisible() kiểm tra ngay
    // dễ bị race (đọc false trong lúc modal đang mở) -> chờ modal xuất hiện trước khi quyết định.
    try {
      await this.modal.waitFor({ state: 'visible', timeout: 20000 });
    } catch {
      return;
    }
    await this.confirmBtn.click();
    await expect(this.modal).toBeHidden();
  }

  getImageKeyword(index: number) {
    return this.page.locator('[data-testid="preview-question-writing-image-keyword"]').nth(index);
  }
}
