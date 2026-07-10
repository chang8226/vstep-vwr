import { BasePage } from '../BasePage';

export class VstepTestPage extends BasePage {
  // Không có navigateToTest(): màn này chỉ vào được qua luồng UI thật (Preview -> Start ->
  // Choose the test mode -> Start ở Test Mode), truy cập thẳng URL bị chặn "not authorized".

  // Toàn bộ màn làm bài + review VSTEP được nhúng qua iframe riêng (trt-central/prep_vstep),
  // nên mọi locator phải scope vào frame này, không dùng this.page trực tiếp được.
  readonly frame = this.page.frameLocator('iframe[src*="prep_vstep"]');

  // Header màn làm bài
  readonly testName = this.frame.getByText('Test chang tạo');
  readonly exitBtn = this.frame.getByRole('button', { name: 'Exit' });
  readonly submitBtn = this.frame.getByRole('button', { name: 'Submit' }).first();

  // Đề bài + khu vực trả lời
  readonly task1Title = this.frame.getByText('Task 1: Letter or Email');
  readonly task2Title = this.frame.getByText('Task 2: Essay');
  readonly answerInput = this.frame.getByPlaceholder('Enter your answer');
  readonly wordCount = this.frame.getByText('Written:', { exact: false });

  // Nav chuyển task ở footer màn làm bài
  readonly taskNavPrevBtn = this.frame.getByRole('button', { name: 'Task 1' });
  readonly taskNavNextBtn = this.frame.getByRole('button', { name: 'Task 2' });
  readonly footerSubmitBtn = this.frame.getByRole('button', { name: 'Submit' }).last();

  // Popup xác nhận Exit (trong lúc làm bài)
  readonly exitConfirmTitle = this.frame.getByText("Please don't leave! Your progress will be interrupted");
  readonly backToTestBtn = this.frame.getByRole('button', { name: 'Back to test' });
  readonly confirmExitBtn = this.frame.getByRole('dialog').getByRole('button', { name: 'Exit' });

  // Popup xác nhận Submit
  readonly submitConfirmTitle = this.frame.getByText('Are you sure you want to submit your work?');
  readonly cancelSubmitBtn = this.frame.getByRole('button', { name: 'Cancel' });
  readonly confirmSubmitBtn = this.frame.getByRole('dialog').getByRole('button', { name: 'Submit' });

  // Màn Review bài làm
  readonly analyzeBtn = this.frame.getByRole('button', { name: 'Analyze' });
  readonly notAnsweredMessages = this.frame.getByText("You haven't answered this question");
  readonly reviewExitConfirmTitle = this.frame.getByText('Your submission has not been analyzed by Prep yet');
  readonly continueReviewingBtn = this.frame.getByRole('button', { name: 'Continue reviewing' });
  readonly saveDraftAndExitBtn = this.frame.getByRole('button', { name: 'Save draft and exit' });

  async fillAnswer(text: string) {
    await this.answerInput.click();
    await this.answerInput.pressSequentially(text, { delay: 15 });
  }
}
