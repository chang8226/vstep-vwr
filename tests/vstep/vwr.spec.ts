import { test, expect } from '../fixtures';

test.beforeEach(async ({ vstepPage }) => {
  // ID bài test đã được cấu hình theo từng môi trường trong config/environments.ts (TARGET_ENV)
  await vstepPage.navigateToPreview();
});

// ============================================================
// TC01 - Kiểm tra modal giới thiệu VSTEP hiển thị tự động lần đầu vào trang
// ============================================================
test('TC01 - Modal "VSTEP Test Introduction" hiển thị đúng tiêu đề và mô tả tổng quan', async ({
  vstepPage,
}) => {
  await expect(vstepPage.modal).toBeVisible();
  await expect(vstepPage.introTitle).toBeVisible();
  await expect(
    vstepPage.modal.getByText(
      'The VSTEP Writing test evaluates English writing proficiency at levels 3-5 of the Vietnamese 6-level Foreign Language Proficiency Framework (equivalent to CEFR B1-C1). The test lasts for 60 minutes and consists of 2 tasks. Candidates can freely allocate their time between these two tasks. The entire test is computer-based and conducted via the VSTEP examination system.'
    )
  ).toBeVisible();
});

// ============================================================
// TC02 - Kiểm tra nội dung khối TASK 1 - LETTER OR EMAIL trong modal
// ============================================================
test('TC02 - Modal hiển thị đúng nội dung khối TASK 1 - LETTER OR EMAIL', async ({
  vstepPage,
}) => {
  await expect(vstepPage.modal).toBeVisible();
  await expect(vstepPage.task1IntroBlock).toBeVisible();
  await expect(
    vstepPage.modal.getByText(
      'Task requirement: Write a letter or email responding to or discussing an everyday situation (asking for advice, inviting, declining, complaining, requesting information, expressing gratitude, etc.). You are required to fully address all the main points or questions presented in the prompt.'
    )
  ).toBeVisible();
  await expect(vstepPage.modal.getByText('Suggested time: 20 minutes')).toBeVisible();
  await expect(vstepPage.modal.getByText('Minimum word count: 120 words')).toBeVisible();
});

// ============================================================
// TC03 - Kiểm tra nội dung khối TASK 2 - ESSAY trong modal
// ============================================================
test('TC03 - Modal hiển thị đúng nội dung khối TASK 2 - ESSAY', async ({ vstepPage }) => {
  await expect(vstepPage.modal).toBeVisible();
  await expect(vstepPage.task2IntroBlock).toBeVisible();
  await expect(
    vstepPage.modal.getByText(
      'Task requirement: Write an essay discussing a specific topic (society, education, environment, technology, etc.). Common essay types include: + Opinion essay (agree/disagree) + Discussion essay [discuss both views + (personal opinion)] + Problem-Solution essay + Advantages-Disadvantages essay.'
    )
  ).toBeVisible();
  await expect(vstepPage.modal.getByText('Suggested time: 40 minutes')).toBeVisible();
  await expect(vstepPage.modal.getByText('Minimum word count: 250 words')).toBeVisible();
});

// ============================================================
// TC04 - Kiểm tra checkbox "Got it. Don't show this again" hiển thị lần đầu vào trang
// ============================================================
test('TC04 - Checkbox "Got it. Don\'t show this again" hiển thị trong modal lần đầu', async ({
  vstepPage,
}) => {
  await expect(vstepPage.modal).toBeVisible();
  await expect(vstepPage.dontShowAgainCheckbox).toBeVisible();
});

// ============================================================
// TC05 - Kiểm tra nút "I understand" đóng modal giới thiệu
// ============================================================
test('TC05 - Click "I understand" đóng modal và hiển thị trang Preview', async ({
  vstepPage,
}) => {
  await expect(vstepPage.modal).toBeVisible();
  await vstepPage.understandBtn.click();

  await expect(vstepPage.modal).toBeHidden();
  await expect(vstepPage.testHeader.getByText('Preview')).toBeVisible();
});

// ============================================================
// TC06 - Kiểm tra header hiển thị tiêu đề "Preview" và nút back
// ============================================================
test('TC06 - Header hiển thị tiêu đề "Preview" và nút back khả dụng', async ({ vstepPage }) => {
  await vstepPage.closeIntroModal();

  await expect(vstepPage.testHeader.getByText('Preview')).toBeVisible();
  await expect(vstepPage.backBtn).toBeVisible();
  await expect(vstepPage.backBtn).toBeEnabled();
});

// ============================================================
// TC07 - Kiểm tra nút back điều hướng khỏi trang preview
// ============================================================
test('TC07 - Nút back điều hướng khỏi trang preview', async ({ page, vstepPage }) => {
  await vstepPage.closeIntroModal();

  await vstepPage.backBtn.click();
  await expect(page).not.toHaveURL(/preview/);
});

// ============================================================
// TC08 - Kiểm tra Teacher Bee hiển thị text gợi ý xem trước bài test
// ============================================================
test('TC08 - Hiển thị Teacher Bee với text "Take a moment to preview your test!"', async ({
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();

  await expect(vstepPage.previewHintText).toBeVisible();
});

// ============================================================
// TC09 - Kiểm tra sidebar hiển thị "Task list" với Task 1 và Task 2
// ============================================================
test('TC09 - Sidebar hiển thị "Task list" với Task 1 và Task 2', async ({ vstepPage }) => {
  await vstepPage.closeIntroModal();

  await expect(vstepPage.taskListHeading).toBeVisible();
  await expect(vstepPage.task1Item.getByText('Task 1')).toBeVisible();
  await expect(vstepPage.task2Item.getByText('Task 2')).toBeVisible();
});

// ============================================================
// TC10 - Kiểm tra Task 1 được active mặc định trong sidebar
// ============================================================
test('TC10 - Task 1 được active mặc định trong sidebar khi vào preview', async ({
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();

  await expect(vstepPage.task1Info).toHaveClass(/bg-dim-brand-primary/);
  await expect(vstepPage.task1Info).toHaveClass(/border-brand-primary/);
  await expect(vstepPage.task2Info).not.toHaveClass(/bg-dim-brand-primary/);
});

// ============================================================
// TC11 - Kiểm tra click Task 2 trong sidebar cập nhật active state
// ============================================================
test('TC11 - Click Task 2 trong sidebar active Task 2 và deactive Task 1', async ({
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();

  await vstepPage.task2Item.click();
  await expect(vstepPage.task2Info).toHaveClass(/bg-dim-brand-primary/);
  await expect(vstepPage.task1Info).not.toHaveClass(/bg-dim-brand-primary/);
});

// ============================================================
// TC12 - Kiểm tra nội dung Task 1: Letter or Email
// ============================================================
test('TC12 - Nội dung Task 1: Letter or Email hiển thị đúng đề bài và số từ tối thiểu', async ({
  page,
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();

  await expect(vstepPage.task1Title).toBeVisible();
  await expect(
    page.getByText(
      'You live in Hanoi. Recently, you went on a camping trip to Cat Ba Island with your British friend named Alex.'
    )
  ).toBeVisible();
  await expect(page.getByText('You should write at least 120 words.')).toBeVisible();
});

// ============================================================
// TC13 - Kiểm tra nội dung Task 2: Essay
// ============================================================
test('TC13 - Nội dung Task 2: Essay hiển thị đúng đề bài và số từ tối thiểu', async ({
  page,
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();

  await expect(vstepPage.task2Title).toBeVisible();
  await expect(
    page.getByText(
      'Write an essay to an educated reader discussing the effects of urbanization on cities and their inhabitants.'
    )
  ).toBeVisible();
  await expect(page.getByText('You should write at least 250 words.')).toBeVisible();
});

// ============================================================
// TC14 - Kiểm tra "View ideas" của Task 1 mặc định collapse, click để expand
// ============================================================
test('TC14 - "View ideas" của Task 1 mặc định collapse, click để expand hiển thị gợi ý', async ({
  page,
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();

  const ideaText = page.getByText(/Idea 1:/);
  await expect(ideaText).toBeHidden();

  await vstepPage.getViewIdeasToggle(0).click();
  await expect(ideaText).toBeVisible();
});

// ============================================================
// TC15 - Kiểm tra nút "Introduction" mở lại modal, không hiển thị checkbox
// ============================================================
test('TC15 - Nút "Introduction" mở lại modal giới thiệu và không hiển thị checkbox', async ({
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();

  await vstepPage.introBtn.click();
  await expect(vstepPage.modal).toBeVisible();
  await expect(vstepPage.introTitle).toBeVisible();
  await expect(vstepPage.dontShowAgainCheckbox).toBeHidden();
});

// ============================================================
// TC16 - Kiểm tra nút "Start" hiển thị và khả dụng trên trang Preview
// ============================================================
test('TC16 - Nút "Start" hiển thị và khả dụng trên trang Preview', async ({ vstepPage }) => {
  await vstepPage.closeIntroModal();

  await expect(vstepPage.startBtn).toBeVisible();
  await expect(vstepPage.startBtn).toBeEnabled();
});

// ============================================================
// TC17 - Kiểm tra click "Start" trên Preview mở dialog "Choose the test mode"
// ============================================================
test('TC17 - Click "Start" trên Preview mở dialog "Choose the test mode"', async ({
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();

  await vstepPage.startBtn.click();
  await expect(vstepPage.modeDialog).toBeVisible();
  await expect(vstepPage.modeDialogTitle).toBeVisible();
});

// ============================================================
// TC18 - Kiểm tra dialog hiển thị đúng thông tin Practice Mode
// ============================================================
test('TC18 - Dialog hiển thị đúng thông tin Practice Mode và nút Start bị disable', async ({
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();
  await vstepPage.startBtn.click();

  await expect(vstepPage.practiceModeTitle).toBeVisible();
  await expect(vstepPage.practiceModeComingSoonTag).toBeVisible();
  await expect(vstepPage.practiceModeSubtext).toBeVisible();
  await expect(vstepPage.practiceModeNoTimeLimit).toBeVisible();
  await expect(vstepPage.practiceModeViewSuggestions).toBeVisible();
  await expect(vstepPage.practiceModeAutoSave).toBeVisible();
  await expect(vstepPage.practiceModeStartBtn).toBeDisabled();
});

// ============================================================
// TC19 - Kiểm tra dialog hiển thị đúng thông tin Test Mode
// ============================================================
test('TC19 - Dialog hiển thị đúng thông tin Test Mode và nút Start khả dụng', async ({
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();
  await vstepPage.startBtn.click();

  await expect(vstepPage.testModeTitle).toBeVisible();
  await expect(vstepPage.testModeSubtext).toBeVisible();
  await expect(vstepPage.testModeTimeLimit).toBeVisible();
  await expect(vstepPage.testModeViewSuggestions).toBeVisible();
  await expect(vstepPage.testModeNoDraftSaving).toBeVisible();
  await expect(vstepPage.testModeStartBtn).toBeEnabled();
});

// ============================================================
// TC20 - Kiểm tra click icon Close đóng dialog "Choose the test mode"
// ============================================================
test('TC20 - Click icon Close đóng dialog và quay lại màn Preview', async ({
  page,
  vstepPage,
}) => {
  await vstepPage.closeIntroModal();
  await vstepPage.startBtn.click();
  await expect(vstepPage.modeDialog).toBeVisible();

  await vstepPage.modeDialogCloseBtn.click();
  await expect(vstepPage.modeDialog).toBeHidden();
  await expect(page).toHaveURL(/preview/);
});

// ============================================================
// TC21 - Kiểm tra click "Start" ở Test Mode chuyển tới màn làm bài
// ============================================================
test('TC21 - Click "Start" ở Test Mode chuyển tới màn làm bài với đúng tên bài test và đề bài', async ({
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();

  await expect(vstepTestPage.answerInput).toBeVisible({ timeout: 45000 });
  await expect(vstepTestPage.testName).toBeVisible();
  await expect(vstepTestPage.task1Title).toBeVisible();
});

// ============================================================
// TC22 - Kiểm tra nhập câu trả lời cập nhật đúng số từ "Written: x word(s)"
// ============================================================
test('TC22 - Nhập câu trả lời cập nhật đúng số từ hiển thị', async ({ vstepPage, vstepTestPage }) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.answerInput).toBeVisible({ timeout: 45000 });

  await expect(vstepTestPage.wordCount).toHaveText('Written: 0 word(s)');
  await vstepTestPage.fillAnswer('Hello world this is my answer');
  await expect(vstepTestPage.wordCount).not.toHaveText('Written: 0 word(s)');
});

// ============================================================
// TC23 - Kiểm tra click "Task 2" ở footer chuyển sang nội dung Task 2
// ============================================================
test('TC23 - Click "Task 2" ở footer hiển thị nội dung Task 2 và nút "Task 1" được enable', async ({
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.answerInput).toBeVisible({ timeout: 45000 });

  await expect(vstepTestPage.taskNavPrevBtn).toBeDisabled();
  await vstepTestPage.taskNavNextBtn.click();

  await expect(vstepTestPage.task2Title).toBeVisible();
  await expect(vstepTestPage.taskNavPrevBtn).toBeEnabled();
  await expect(vstepTestPage.footerSubmitBtn).toBeVisible();
});

// ============================================================
// TC24 - Kiểm tra click "Exit" trong lúc làm bài mở popup xác nhận thoát
// ============================================================
test('TC24 - Click "Exit" mở popup xác nhận đúng nội dung', async ({ vstepPage, vstepTestPage }) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.answerInput).toBeVisible({ timeout: 45000 });

  await vstepTestPage.exitBtn.click();
  await expect(vstepTestPage.exitConfirmTitle).toBeVisible();
  await expect(vstepTestPage.backToTestBtn).toBeVisible();
  await expect(vstepTestPage.confirmExitBtn).toBeVisible();
});

// ============================================================
// TC25 - Kiểm tra click "Back to test" đóng popup, quay lại màn làm bài
// ============================================================
test('TC25 - Click "Back to test" đóng popup và quay lại màn làm bài', async ({
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.answerInput).toBeVisible({ timeout: 45000 });

  await vstepTestPage.exitBtn.click();
  await expect(vstepTestPage.exitConfirmTitle).toBeVisible();

  await vstepTestPage.backToTestBtn.click();
  await expect(vstepTestPage.exitConfirmTitle).toBeHidden();
  await expect(vstepTestPage.answerInput).toBeVisible();
});

// ============================================================
// TC26 - Kiểm tra click "Submit" mở popup xác nhận nộp bài
// ============================================================
test('TC26 - Click "Submit" mở popup xác nhận đúng nội dung', async ({ vstepPage, vstepTestPage }) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.answerInput).toBeVisible({ timeout: 45000 });

  await vstepTestPage.submitBtn.click();
  await expect(vstepTestPage.submitConfirmTitle).toBeVisible();
  await expect(vstepTestPage.cancelSubmitBtn).toBeVisible();
  await expect(vstepTestPage.confirmSubmitBtn).toBeVisible();
});

// ============================================================
// TC27 - Kiểm tra click "Cancel" trong popup Submit quay lại màn làm bài
// ============================================================
test('TC27 - Click "Cancel" đóng popup Submit và quay lại màn làm bài', async ({
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.answerInput).toBeVisible({ timeout: 45000 });

  await vstepTestPage.submitBtn.click();
  await expect(vstepTestPage.submitConfirmTitle).toBeVisible();

  await vstepTestPage.cancelSubmitBtn.click();
  await expect(vstepTestPage.submitConfirmTitle).toBeHidden();
  await expect(vstepTestPage.answerInput).toBeVisible();
});

// ============================================================
// TC28 - Kiểm tra xác nhận "Submit" chuyển sang màn Review bài làm
// ============================================================
test('TC28 - Xác nhận "Submit" chuyển sang màn Review bài làm', async ({
  page,
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.answerInput).toBeVisible({ timeout: 45000 });

  await vstepTestPage.submitBtn.click();
  await expect(vstepTestPage.submitConfirmTitle).toBeVisible();
  await vstepTestPage.confirmSubmitBtn.click();

  await expect(page).toHaveURL(/review/, { timeout: 45000 });
  await expect(vstepTestPage.analyzeBtn).toBeVisible({ timeout: 45000 });
});

// ============================================================
// TC29 - Kiểm tra màn Review hiển thị đúng tên bài test và nút Exit
// ============================================================
test('TC29 - Màn Review hiển thị đúng tên bài test và nút Exit', async ({
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.analyzeBtn).toBeVisible({ timeout: 60000 });

  await expect(vstepTestPage.testName).toBeVisible();
  await expect(vstepTestPage.exitBtn).toBeVisible();
});

// ============================================================
// TC30 - Kiểm tra màn Review hiển thị đề bài và message khi bỏ trống câu trả lời
// ============================================================
test('TC30 - Màn Review hiển thị đề bài Task 1, Task 2 và message khi chưa trả lời', async ({
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.analyzeBtn).toBeVisible({ timeout: 60000 });

  await expect(vstepTestPage.task1Title).toBeVisible();
  await expect(vstepTestPage.task2Title).toBeVisible();
  await expect(vstepTestPage.notAnsweredMessages.first()).toBeVisible();
});

// ============================================================
// TC31 - Kiểm tra nút "Analyze" hiển thị trên màn Review
// ============================================================
test('TC31 - Nút "Analyze" hiển thị trên màn Review', async ({ vstepPage, vstepTestPage }) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();

  await expect(vstepTestPage.analyzeBtn).toBeVisible({ timeout: 60000 });
});

// ============================================================
// TC32 - Kiểm tra click "Exit" ở màn Review mở popup xác nhận
// ============================================================
test('TC32 - Click "Exit" ở màn Review mở popup xác nhận đúng nội dung', async ({
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.analyzeBtn).toBeVisible({ timeout: 60000 });

  await vstepTestPage.exitBtn.click();
  await expect(vstepTestPage.reviewExitConfirmTitle).toBeVisible();
  await expect(vstepTestPage.continueReviewingBtn).toBeVisible();
  await expect(vstepTestPage.saveDraftAndExitBtn).toBeVisible();
});

// ============================================================
// TC33 - Kiểm tra click "Continue reviewing" đóng popup, quay lại màn Review
// ============================================================
test('TC33 - Click "Continue reviewing" đóng popup và quay lại màn Review', async ({
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.analyzeBtn).toBeVisible({ timeout: 60000 });

  await vstepTestPage.exitBtn.click();
  await expect(vstepTestPage.reviewExitConfirmTitle).toBeVisible();

  await vstepTestPage.continueReviewingBtn.click();
  await expect(vstepTestPage.reviewExitConfirmTitle).toBeHidden();
  await expect(vstepTestPage.analyzeBtn).toBeVisible();
});

// ============================================================
// TC34 - Kiểm tra click "Save draft and exit" thoát khỏi màn Review
// ============================================================
test('TC34 - Click "Save draft and exit" thoát khỏi màn Review an toàn', async ({
  vstepPage,
  vstepTestPage,
}) => {
  test.setTimeout(60000);
  await vstepPage.closeIntroModal();
  await vstepPage.startTestMode();
  await expect(vstepTestPage.analyzeBtn).toBeVisible({ timeout: 60000 });

  await vstepTestPage.exitBtn.click();
  await expect(vstepTestPage.reviewExitConfirmTitle).toBeVisible();

  await vstepTestPage.saveDraftAndExitBtn.click();
  await expect(vstepTestPage.reviewExitConfirmTitle).toBeHidden();
});
