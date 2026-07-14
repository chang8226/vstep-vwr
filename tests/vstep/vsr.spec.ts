import { test, expect } from '../fixtures';

test.beforeEach(async ({ vsrPage }) => {
  // ID bài test đã được cấu hình theo từng môi trường trong config/environments.ts (TARGET_ENV)
  await vsrPage.navigateToPreview();
});

// ============================================================
// TC01 - Kiểm tra header hiển thị tiêu đề "Preview" và nút back
// ============================================================
test('TC01 - Header hiển thị tiêu đề "Preview" và nút back khả dụng', async ({ vsrPage }) => {
  await vsrPage.closeIntroModal();

  await expect(vsrPage.testHeader.getByText('Preview')).toBeVisible();
  await expect(vsrPage.backBtn).toBeVisible();
  await expect(vsrPage.backBtn).toBeEnabled();
});

// ============================================================
// TC02 - Kiểm tra Teacher Bee hiển thị text gợi ý xem trước bài test
// ============================================================
test('TC02 - Hiển thị Teacher Bee với text "Take a moment to preview your test!"', async ({
  vsrPage,
}) => {
  await vsrPage.closeIntroModal();

  await expect(vsrPage.previewHintText).toBeVisible();
});

// ============================================================
// TC03 - Kiểm tra sidebar hiển thị badge "VSTEP" và tên bài test
// ============================================================
test('TC03 - Sidebar hiển thị badge "VSTEP" và tên bài test', async ({ page, vsrPage }) => {
  await vsrPage.closeIntroModal();

  await expect(page.getByText('VSTEP', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Test chang tạo', { exact: false })).toBeVisible();
});

// ============================================================
// TC04 - Kiểm tra Part list hiển thị Part 1, Part 2, Part 3
// ============================================================
test('TC04 - Part list hiển thị Part 1, Part 2 và Part 3', async ({ vsrPage }) => {
  await vsrPage.closeIntroModal();

  await expect(vsrPage.partListHeading).toBeVisible();
  await expect(vsrPage.part1Item.getByText('Part 1', { exact: true })).toBeVisible();
  await expect(vsrPage.part2Item.getByText('Part 2', { exact: true })).toBeVisible();
  await expect(vsrPage.part3Item.getByText('Part 3', { exact: true })).toBeVisible();
});

// ============================================================
// TC05 - Kiểm tra Part 1 được active mặc định khi load màn hình
// ============================================================
test('TC05 - Part 1 được active mặc định trong sidebar khi vào preview', async ({ vsrPage }) => {
  await vsrPage.closeIntroModal();

  await expect(vsrPage.part1Info).toHaveClass(/bg-dim-brand-primary/);
  await expect(vsrPage.part1Info).toHaveClass(/border-brand-primary/);
  await expect(vsrPage.part2Info).not.toHaveClass(/bg-dim-brand-primary/);
  await expect(vsrPage.part3Info).not.toHaveClass(/bg-dim-brand-primary/);
});

// ============================================================
// TC06 - Kiểm tra click Part 2 active Part 2, deactive Part 1
// ============================================================
test('TC06 - Click Part 2 trong sidebar active Part 2 và deactive Part 1', async ({ vsrPage }) => {
  await vsrPage.closeIntroModal();

  await vsrPage.part2Item.click();
  await expect(vsrPage.part2Info).toHaveClass(/bg-dim-brand-primary/);
  await expect(vsrPage.part1Info).not.toHaveClass(/bg-dim-brand-primary/);
});

// ============================================================
// TC07 - Kiểm tra click Part 3 active Part 3, deactive Part 1
// ============================================================
test('TC07 - Click Part 3 trong sidebar active Part 3 và deactive Part 1', async ({ vsrPage }) => {
  await vsrPage.closeIntroModal();

  await vsrPage.part3Item.click();
  await expect(vsrPage.part3Info).toHaveClass(/bg-dim-brand-primary/);
  await expect(vsrPage.part1Info).not.toHaveClass(/bg-dim-brand-primary/);
});

// ============================================================
// TC08 - Kiểm tra nội dung Part 1: Social Interaction
// ============================================================
test('TC08 - Nội dung Part 1: Social Interaction hiển thị đúng tiêu đề và câu hỏi', async ({
  page,
  vsrPage,
}) => {
  await vsrPage.closeIntroModal();

  await expect(vsrPage.part1Title).toBeVisible();
  await expect(page.getByText('Let’s talk about transport.').first()).toBeVisible();
  await expect(page.getByText('How do you go to work or school every day?').first()).toBeVisible();
});

// ============================================================
// TC09 - Kiểm tra nội dung Part 2: Solution Discussion
// ============================================================
test('TC09 - Nội dung Part 2: Solution Discussion hiển thị đúng tình huống', async ({
  page,
  vsrPage,
}) => {
  await vsrPage.closeIntroModal();

  await expect(vsrPage.part2Title).toBeVisible();
  await expect(
    page.getByText(
      'You want to watch a famous movie with your best friend. There are three places you are considering: your living room, a local cinema, or a garden. Which is the best choice for you?'
    )
  ).toBeVisible();
});

// ============================================================
// TC10 - Kiểm tra nội dung Part 3: Topic Development
// ============================================================
test('TC10 - Nội dung Part 3: Topic Development hiển thị đúng đề bài và follow-up questions', async ({
  page,
  vsrPage,
}) => {
  await vsrPage.closeIntroModal();

  await expect(vsrPage.part3Title).toBeVisible();
  await expect(page.getByText('Causes of Stress in the Modern Workplace')).toBeVisible();
  await expect(page.getByText('Flow-up questions')).toBeVisible();
  await expect(page.getByText("How does stress affect a person's work performance?")).toBeVisible();
});

// ============================================================
// TC11 - Kiểm tra nút "Start" hiển thị và khả dụng trên trang Preview
// ============================================================
test('TC11 - Nút "Start" hiển thị và khả dụng trên trang Preview', async ({ vsrPage }) => {
  await vsrPage.closeIntroModal();

  await expect(vsrPage.startBtn).toBeVisible();
  await expect(vsrPage.startBtn).toBeEnabled();
});

// ============================================================
// TC12 - Kiểm tra modal "VSTEP Speaking Introduction" hiển thị tự động lần đầu
// ============================================================
test('TC12 - Modal "VSTEP Speaking Introduction" hiển thị đúng tiêu đề và nội dung hướng dẫn chung', async ({
  vsrPage,
}) => {
  await expect(vsrPage.modal).toBeVisible();
  await expect(vsrPage.introTitle).toBeVisible();
  await expect(
    vsrPage.modal.getByText(
      "The VSTEP Speaking test assesses English communication skills at Levels 3–5 of Vietnam's 6-Level Foreign Language Proficiency Framework (equivalent to B1–C1 on the CEFR). The full test takes approximately 12 minutes and is recorded directly through the computer-based VSTEP testing system."
    )
  ).toBeVisible();
});

// ============================================================
// TC13 - Kiểm tra nội dung khối Part 1: Social Interaction trong modal
// ============================================================
test('TC13 - Modal hiển thị đúng nội dung khối Part 1: Social Interaction', async ({ vsrPage }) => {
  await expect(vsrPage.modal).toBeVisible();
  await expect(vsrPage.part1IntroBlock).toBeVisible();
  await expect(
    vsrPage.modal.getByText(
      'Format: 2 question sets (each containing 3 questions on different topics)'
    )
  ).toBeVisible();
  await expect(
    vsrPage.modal.getByText(
      'Task requirement: Answer social interaction questions. You may choose 1 set, or use both sets in your response'
    )
  ).toBeVisible();
  await expect(
    vsrPage.modal.getByText('Total duration: 3 minutes to answer (No preparation time is allowed)')
  ).toBeVisible();
  await expect(
    vsrPage.modal.getByText('Note: Begin speaking as soon as you hear/see each question.')
  ).toBeVisible();
});

// ============================================================
// TC14 - Kiểm tra nội dung khối Part 2: Solution Discussion trong modal
// ============================================================
test('TC14 - Modal hiển thị đúng nội dung khối Part 2: Solution Discussion', async ({ vsrPage }) => {
  await expect(vsrPage.modal).toBeVisible();
  await expect(vsrPage.part2IntroBlock).toBeVisible();
  await expect(vsrPage.modal.getByText('Format: 1 situation with 3 proposed solutions')).toBeVisible();
  await expect(
    vsrPage.modal.getByText(
      'Task requirement: Select the best solution and explain why. Then explain why you rejected the other 2 options.'
    )
  ).toBeVisible();
  await expect(
    vsrPage.modal.getByText('Total duration: 1 minute to prepare, 3 minutes to answer')
  ).toBeVisible();
  await expect(
    vsrPage.modal.getByText(
      'Note: During the preparation time, you are allowed to jot down your ideas on scratch paper'
    ).first()
  ).toBeVisible();
});

// ============================================================
// TC15 - Kiểm tra nội dung khối Part 3: Topic Development trong modal
// ============================================================
test('TC15 - Modal hiển thị đúng nội dung khối Part 3: Topic Development', async ({ vsrPage }) => {
  await expect(vsrPage.modal).toBeVisible();
  await expect(vsrPage.part3IntroBlock).toBeVisible();
  await expect(
    vsrPage.modal.getByText('Format: 1 topic (with 3 prompts presented as a mindmap) and 3 follow-up questions')
  ).toBeVisible();
  await expect(
    vsrPage.modal.getByText(
      'Task requirement: Deliver a coherent talk on the assigned topic, using your own ideas and/or the prompts provided. Then answer all 3 follow-up questions on your own.'
    )
  ).toBeVisible();
  await expect(
    vsrPage.modal.getByText(
      'Total duration: 1 minute to prepare, 4 minutes to answer (2 minutes for the talk and 2 minutes for the follow-up questions)'
    )
  ).toBeVisible();
});

// ============================================================
// TC16 - Kiểm tra checkbox "Don't show this again" hiển thị lần đầu
// ============================================================
test('TC16 - Checkbox "Got it. Don\'t show this again" hiển thị trong modal lần đầu', async ({
  vsrPage,
}) => {
  await expect(vsrPage.modal).toBeVisible();
  await expect(vsrPage.dontShowAgainCheckbox).toBeVisible();
});

// ============================================================
// TC17 - Kiểm tra click "I understand" đóng modal, hiển thị màn Preview
// ============================================================
test('TC17 - Click "I understand" đóng modal và hiển thị trang Preview', async ({ vsrPage }) => {
  await expect(vsrPage.modal).toBeVisible();
  await vsrPage.understandBtn.click();

  await expect(vsrPage.modal).toBeHidden();
  await expect(vsrPage.testHeader.getByText('Preview')).toBeVisible();
});

// ============================================================
// TC18 - Kiểm tra nút "Introduction" mở lại modal, không hiển thị checkbox
// ============================================================
test('TC18 - Nút "Introduction" mở lại modal giới thiệu và không hiển thị checkbox', async ({
  vsrPage,
}) => {
  await vsrPage.closeIntroModal();

  await vsrPage.introBtn.click();
  await expect(vsrPage.modal).toBeVisible();
  await expect(vsrPage.introTitle).toBeVisible();
  await expect(vsrPage.dontShowAgainCheckbox).toBeHidden();
});
