import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { currentEnvConfig } from '../../config/environments';

const { testDetailId, unitId } = currentEnvConfig.vstep;

export class VstepPreviewPage extends BasePage {
  // URL tương đối - Playwright sẽ tự ghép với baseURL theo TARGET_ENV
  static readonly previewUrl = `en/virtual-writing-room/vstep/${testDetailId}/preview?unit_id=${unitId}`;

  // Modal Giới thiệu
  readonly modal = this.page.getByRole('dialog');
  readonly introTitle = this.modal.getByText('VSTEP Test Introduction');
  readonly task1IntroBlock = this.modal.getByText('TASK 1 - LETTER OR EMAIL');
  readonly task2IntroBlock = this.modal.getByText('TASK 2 - ESSAY');
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

  // Sidebar - task list
  readonly taskListHeading = this.page.getByText('Task list');
  readonly task1Item = this.page.locator('.part-item').first();
  readonly task2Item = this.page.locator('.part-item').nth(1);
  readonly task1Info = this.page.locator('.part-item').first().locator('.part-info');
  readonly task2Info = this.page.locator('.part-item').nth(1).locator('.part-info');

  // Nội dung đề bài
  readonly task1Title = this.page.getByText('Task 1: Letter or Email');
  readonly task2Title = this.page.getByText('Task 2: Essay');

  // Dialog "Chọn chế độ làm bài" (mở khi bấm Start ở trang Preview)
  readonly modeDialog = this.page.getByRole('dialog');
  readonly modeDialogTitle = this.modeDialog.getByText('Choose the test mode');
  readonly modeDialogCloseBtn = this.modeDialog.locator('button').first();

  readonly practiceModeTitle = this.modeDialog.getByText('Practice Mode');
  readonly practiceModeComingSoonTag = this.modeDialog.getByText('Coming soon');
  readonly practiceModeSubtext = this.modeDialog.getByText('Unlimited test practice');
  readonly practiceModeNoTimeLimit = this.modeDialog.getByText('No time limit');
  readonly practiceModeViewSuggestions = this.modeDialog.getByText('View suggestions & samples');
  readonly practiceModeAutoSave = this.modeDialog.getByText('Auto-save draft and continue later');
  readonly practiceModeStartBtn = this.modeDialog.getByRole('button', { name: 'Start' }).first();

  readonly testModeTitle = this.modeDialog.getByText('Test Mode', { exact: true });
  readonly testModeSubtext = this.modeDialog.getByText('Real exam experience');
  readonly testModeTimeLimit = this.modeDialog.getByText('Time limit similar to the real exam');
  readonly testModeViewSuggestions = this.modeDialog.getByText('View suggestions & sample answers');
  readonly testModeNoDraftSaving = this.modeDialog.getByText('No draft saving in exam mode');
  readonly testModeStartBtn = this.modeDialog.getByRole('button', { name: 'Start' }).nth(1);

  async navigateToPreview() {
    await this.goto(VstepPreviewPage.previewUrl);
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

  getViewIdeasToggle(index: number) {
    return this.page.getByText('View ideas').nth(index);
  }

  async startTestMode() {
    await this.startBtn.click();
    await this.testModeStartBtn.waitFor({ state: 'visible' });
    await this.testModeStartBtn.click();
  }
}
