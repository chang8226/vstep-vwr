import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { currentEnvConfig } from '../../config/environments';

const { testSetId, submissionSkillId } = currentEnvConfig.hsk;

export class HskTestPage extends BasePage {
  // URL tương đối - Playwright sẽ tự ghép với baseURL theo TARGET_ENV
  // Lưu ý: khác với HskPreviewPage, đoạn id trong path là submissionSkillId (không phải testDetailId)
  static readonly testUrl = `vi/virtual-writing-room/hsk-v3/${submissionSkillId}/test?test_set=${testSetId}`;

  // Toàn bộ màn làm bài (Virtual Writing Room) được nhúng qua iframe riêng (domain trt-hsk),
  // nên mọi locator phải scope vào frame này, không dùng this.page trực tiếp được.
  readonly frame = this.page.frameLocator('iframe[src*="trt-hsk"]');

  // Modal "Hướng dẫn làm bài" - hiện khi vào màn làm bài, trước khi bắt đầu
  readonly guideTitle = this.frame.getByText('Hướng dẫn làm bài');
  readonly startBtn = this.frame.getByRole('button', { name: 'Bắt đầu' });

  // Header
  readonly exitBtn = this.frame.getByRole('button', { name: 'Thoát' });
  readonly testTitle = this.frame.getByText('Bài Test 01');

  // Sidebar - danh sách câu hỏi
  readonly sidebar = this.frame.locator('.col-scroll').first();
  readonly questionListHeading = this.sidebar.getByText('Danh sách câu hỏi');
  readonly part1Toggle = this.sidebar.getByText('Phần 1', { exact: true });
  readonly part2Toggle = this.sidebar.getByText('Phần 2', { exact: true });

  // Panel câu hỏi chính
  readonly mainPanel = this.frame.locator('.col-scroll').nth(1);
  readonly answerInput = this.frame.getByPlaceholder('Nhập câu trả lời của bạn');
  readonly prevBtn = this.frame.getByRole('button', { name: 'Phần Trước' });
  readonly nextBtn = this.frame.getByRole('button', { name: 'Tiếp theo' });

  // Panel thông tin
  readonly infoPanel = this.frame.locator('.col-scroll').last();
  readonly infoPanelHeading = this.infoPanel.getByText('Thông tin');
  readonly submitBtn = this.frame.getByRole('button', { name: 'Gửi' });

  async navigateToTest() {
    await this.goto(HskTestPage.testUrl);
  }

  getSidebarQuestionItem(index: number) {
    return this.sidebar.getByText(`Câu ${index}`, { exact: true });
  }

  getCurrentQuestionBadge(index: number) {
    return this.mainPanel.getByText(`Câu ${index}`, { exact: false });
  }

  async startTest() {
    if (await this.guideTitle.isVisible()) {
      await this.startBtn.click();
      await expect(this.guideTitle).toBeHidden();
    }
  }
}
