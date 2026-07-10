import { BasePage } from '../BasePage';

export class DashboardPage extends BasePage {
  // URL tương đối - Playwright sẽ tự ghép với baseURL theo TARGET_ENV
  static readonly url = 'vi/learning-dashboard';

  // Greeting - chỉ khớp phần đầu câu, không phụ thuộc tên của tài khoản test cụ thể
  readonly userGreeting = this.page.getByText(/^Xin chào,/);
  readonly welcomeMessage = this.page.getByText('Cùng Prep tiến bộ mỗi ngày nào!');

  // Main content
  readonly startQuestBtn = this.page.getByRole('button', { name: 'Bắt đầu' });
  readonly discoverBtn = this.page.getByText('Khám phá ngay');

  // Sidebar
  readonly learningProfile = this.page.getByText('Learning Profile').nth(1);
  readonly viewAllLink = this.page.getByText('Xem tất cả').first();
  readonly hskLevelTitle = this.page.getByText('Trình độ HSK 3.0 của bạn');
  readonly hskEntry = this.page.getByText('Entry');
  readonly hskPredicted = this.page.getByText('Predicted');
  readonly hskTarget = this.page.getByText('Target');
  readonly learningSummary = this.page.getByText('Learning summary');
  readonly totalDuration = this.page.getByText('Tổng thời lượng');
  readonly totalCups = this.page.getByText('Tổng số cúp đã đạt');
  readonly totalTests = this.page.getByText('Tổng số bài test');
  readonly totalLessons = this.page.getByText('Tổng số bài học');

  async navigate() {
    await this.goto(DashboardPage.url);
  }
}
