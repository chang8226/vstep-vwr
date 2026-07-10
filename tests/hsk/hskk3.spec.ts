import { test, expect } from '../fixtures';
import { HskPreviewPage } from '../../pages/hsk/HskPreviewPage';

test.beforeEach(async ({ hskPage }) => {
  // ID bài test đã được cấu hình theo từng môi trường trong config/environments.ts (TARGET_ENV)
  await hskPage.navigateToTestDetail();
});

test('TC01 - Kiểm tra Màn preview', async ({ page, hskPage }) => {
  await expect(hskPage.continueBtn).toBeVisible();
  await hskPage.continueBtn.click();
  await expect(page).toHaveURL(HskPreviewPage.previewUrl);
});

test('TC02 - Kiểm tra Màn làm bài', async ({ hskPage }) => {
  await hskPage.navigateToPreview();

  await expect(hskPage.modal).toBeVisible();
  await expect(hskPage.introTitle).toBeVisible();
  await expect(hskPage.hsk3Tab).toBeEnabled();
  await expect(hskPage.hsk4Tab).toBeEnabled();
  await expect(hskPage.hsk5Tab).toBeEnabled();
  await expect(hskPage.hsk6Tab).toBeEnabled();
});

test('TC03  - Kiểm tra chức năng chọn trình độ HSK', async ({ hskPage }) => {
  await hskPage.navigateToPreview();

  await expect(hskPage.modal).toBeVisible();
  await expect(
    hskPage.modal.getByText('Bao gồm 2 phần với 10 câu hỏi Tổng thời gian: 20 phút')
  ).toBeEnabled();
  await expect(
    hskPage.modal.getByText('Phần 1: Điền vào chỗ trống dựa trên Pinyin được cung cấp')
  ).toBeEnabled();
  await expect(hskPage.modal.getByText('Số lượng câu hỏi:').first()).toBeEnabled();
  await expect(
    hskPage.modal.getByText('Lưu ý: Yêu cầu nhận biết và viết chính xác các chữ Hán cơ bản.')
  ).toBeEnabled();
});

// ============================================================
// TC04 - Kiểm tra tab HSK 3 được active mặc định khi mở modal
// ============================================================
test('TC04 - Tab HSK 3 được active mặc định khi mở modal', async ({ hskPage }) => {
  test.setTimeout(20000);
  await hskPage.navigateToPreview();

  await expect(hskPage.modal).toBeVisible();
  await expect(hskPage.hsk3Tab).toHaveClass(/bg-brand-primary/);
  await expect(hskPage.hsk2Tab).not.toHaveClass(/bg-brand-primary/);
  await expect(hskPage.hsk4Tab).not.toHaveClass(/bg-brand-primary/);
});

// ============================================================
// TC05 - Kiểm tra chuyển tab và trạng thái active cập nhật đúng
// ============================================================
test('TC05 - Chuyển tab HSK 2, 4, 5, 6 - tab tương ứng được active', async ({ hskPage }) => {
  await hskPage.navigateToPreview();

  await expect(hskPage.modal).toBeVisible();

  for (const level of ['HSK 2', 'HSK 4', 'HSK 5', 'HSK 6']) {
    await hskPage.modal.getByRole('button', { name: level }).click();
    await expect(hskPage.modal.getByRole('button', { name: level })).toHaveClass(
      /bg-brand-primary/
    );
    await expect(hskPage.hsk3Tab).not.toHaveClass(/bg-brand-primary/);
  }
});

// ============================================================
// TC06 - Kiểm tra nội dung Phần 1 trong tab HSK 3
// ============================================================
test('TC06 - Phần 1 hiển thị đúng tiêu đề, số câu hỏi và lưu ý', async ({ hskPage }) => {
  await hskPage.navigateToPreview();

  await expect(hskPage.modal).toBeVisible();
  await expect(
    hskPage.modal.getByText('Phần 1: Điền vào chỗ trống dựa trên Pinyin được cung cấp')
  ).toBeVisible();
  await expect(hskPage.modal.getByText('5 câu hỏi').first()).toBeVisible();
  await expect(
    hskPage.modal.getByText('Lưu ý: Yêu cầu nhận biết và viết chính xác các chữ Hán cơ bản.')
  ).toBeVisible();
});

// ============================================================
// TC07 - Kiểm tra nội dung Phần 2 trong tab HSK 3
// ============================================================
test('TC07 - Phần 2 hiển thị đúng tiêu đề, số câu hỏi và lưu ý', async ({ hskPage }) => {
  await hskPage.navigateToPreview();

  await expect(hskPage.modal).toBeVisible();
  await expect(
    hskPage.modal.getByText(
      'Phần 2: Viết câu hoàn chỉnh dựa trên từ khóa và hình ảnh được cung cấp'
    )
  ).toBeVisible();
  await expect(hskPage.modal.getByText('5 câu hỏi').nth(1)).toBeVisible();
  await expect(
    hskPage.modal.getByText(
      'Lưu ý: Yêu cầu câu phải sử dụng từ khóa và nội dung liên quan đến hình ảnh được cung cấp, viết câu hoàn chỉnh với ngữ pháp chính xác.'
    )
  ).toBeVisible();
});

// ============================================================
// TC08 - Kiểm tra nút "Tôi Đã Nắm Rõ Rồi" đóng modal
// ============================================================
test('TC08 - Nút "Tôi Đã Nắm Rõ Rồi" đóng modal Giới thiệu', async ({ page, hskPage }) => {
  await hskPage.navigateToPreview();

  await expect(hskPage.modal).toBeVisible();
  await hskPage.confirmBtn.click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

// ============================================================
// TC09 - Kiểm tra nút "Giới thiệu" mở lại modal sau khi đóng
// ============================================================
test('TC09 - Nút "Giới thiệu" mở lại modal sau khi đã đóng', async ({ page, hskPage }) => {
  await hskPage.navigateToPreview();

  await expect(hskPage.modal).toBeVisible();
  await hskPage.confirmBtn.click();
  await expect(page.getByRole('dialog')).toBeHidden();

  await hskPage.introBtn.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Giới thiệu Bài thi Viết HSK')).toBeVisible();
});

// ============================================================
// TC10 - Kiểm tra header "Xem trước" và nút back
// ============================================================
test('TC10 - Header hiển thị tiêu đề "Xem trước" và nút back khả dụng', async ({ hskPage }) => {
  test.setTimeout(20000);
  await hskPage.navigateToPreview();
  await hskPage.closeIntroModal();

  await expect(hskPage.testHeader.getByText('Xem trước')).toBeVisible();
  await expect(hskPage.backBtn).toBeVisible();
  await expect(hskPage.backBtn).toBeEnabled();
});

// ============================================================
// TC11 - Kiểm tra nút back điều hướng khỏi trang preview
// ============================================================
test('TC11 - Nút back điều hướng khỏi trang preview', async ({ page, hskPage }) => {
  await hskPage.navigateToPreview();
  await hskPage.closeIntroModal();

  await hskPage.backBtn.click();
  await expect(page).not.toHaveURL(/preview/);
});

// ============================================================
// TC12 - Kiểm tra thông tin bài test trong sidebar: level và tên
// ============================================================
test('TC12 - Sidebar hiển thị đúng level HSK 3 và tên "Bài Test 01"', async ({ hskPage }) => {
  await hskPage.navigateToPreview();
  await hskPage.closeIntroModal();

  await expect(hskPage.testInfo.getByText('HSK 3')).toBeVisible();
  await expect(hskPage.testInfo.getByText('Bài Test 01')).toBeVisible();
});

// ============================================================
// TC13 - Kiểm tra "Danh sách các phần" trong sidebar
// ============================================================
test('TC13 - Danh sách phần hiển thị Phần 1 (3 câu) và Phần 2 (2 câu)', async ({
  page,
  hskPage,
}) => {
  await hskPage.navigateToPreview();
  await hskPage.closeIntroModal();

  await expect(page.getByText('Danh sách các phần')).toBeVisible();
  await expect(hskPage.part1Item.getByText('Phần 1')).toBeVisible();
  await expect(hskPage.part1Item.getByText('3 câu hỏi')).toBeVisible();
  await expect(hskPage.part2Item.getByText('Phần 2')).toBeVisible();
  await expect(hskPage.part2Item.getByText('2 câu hỏi')).toBeVisible();
});

// ============================================================
// TC14 - Kiểm tra Phần 1 được active mặc định trong sidebar
// ============================================================
test('TC14 - Phần 1 được active mặc định trong sidebar khi vào preview', async ({ hskPage }) => {
  await hskPage.navigateToPreview();
  await hskPage.closeIntroModal();

  await expect(hskPage.part1Info).toHaveClass(/bg-dim-brand-primary/);
  await expect(hskPage.part1Info).toHaveClass(/border-brand-primary/);
  await expect(hskPage.part2Info).not.toHaveClass(/bg-dim-brand-primary/);
});

// ============================================================
// TC15 - Kiểm tra nội dung Phần 1: tiêu đề và 3 câu hỏi Pinyin
// ============================================================
test('TC15 - Nội dung Phần 1 hiển thị đúng tiêu đề và 3 câu hỏi Pinyin', async ({
  page,
  hskPage,
}) => {
  await hskPage.navigateToPreview();
  await hskPage.closeIntroModal();

  await expect(page.getByText('看拼音，写汉字。')).toBeVisible();
  await expect(page.getByText('câu hỏi 1')).toBeVisible();
  await expect(page.getByText(/gāo/)).toBeVisible();
  await expect(page.getByText('câu hỏi 2')).toBeVisible();
  await expect(page.getByText('我下班以后要去接我的（ài ____  ）人一起回家。')).toBeVisible();
  await expect(page.getByText('câu hỏi 3')).toBeVisible();
  await expect(page.getByText('晚上一个人回家，要注意（ān ____  ）全。')).toBeVisible();
});

// ============================================================
// TC16 - Kiểm tra nội dung Phần 2: tiêu đề và 2 câu hỏi ảnh + keyword
// ============================================================
test('TC16 - Nội dung Phần 2 hiển thị đúng tiêu đề, ảnh và từ khóa', async ({ page, hskPage }) => {
  await hskPage.navigateToPreview();
  await hskPage.closeIntroModal();

  await expect(page.getByText('看图，用词造句。')).toBeVisible();
  await expect(page.getByText('câu hỏi 4')).toBeVisible();
  await expect(page.getByText('报纸')).toBeVisible();
  await expect(hskPage.getImageKeyword(0).locator('img')).toBeVisible();
  await expect(page.getByText('câu hỏi 5')).toBeVisible();
  await expect(page.getByText('冰箱')).toBeVisible();
  await expect(hskPage.getImageKeyword(1).locator('img')).toBeVisible();
});

// ============================================================
// TC17 - Kiểm tra click Phần 2 trong sidebar active Phần 2 và deactive Phần 1
// ============================================================
test('TC17 - Click Phần 2 trong sidebar cập nhật active state', async ({ hskPage }) => {
  await hskPage.navigateToPreview();
  await hskPage.closeIntroModal();

  await hskPage.part2Item.click();
  await expect(hskPage.part2Info).toHaveClass(/bg-dim-brand-primary/);
  await expect(hskPage.part1Info).not.toHaveClass(/bg-dim-brand-primary/);
});

// ============================================================
// TC18 - Kiểm tra nút "Tiếp tục thi" hiển thị, enabled và điều hướng đúng
// ============================================================
test('TC18 - Nút "Tiếp tục thi" hiển thị, enabled và điều hướng khỏi preview', async ({
  page,
  hskPage,
}) => {
  await hskPage.navigateToPreview();
  await hskPage.closeIntroModal();

  await expect(hskPage.continueTestBtn).toBeVisible();
  await expect(hskPage.continueTestBtn).toBeEnabled();
  await hskPage.continueTestBtn.click();
  await expect(page).not.toHaveURL(/preview/);
});

// ============================================================
// TC19 - Kiểm tra modal "Hướng dẫn làm bài" hiển thị khi vào màn làm bài
// ============================================================
test('TC19 - Modal "Hướng dẫn làm bài" hiển thị đúng nội dung Phần 1 và Phần 2', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();

  await expect(hskTestPage.guideTitle).toBeVisible();
  await expect(
    hskTestPage.frame.getByText('Tổng thời gian cho cả hai phần: 20 phút')
  ).toBeVisible();
  await expect(
    hskTestPage.frame.getByText(
      'Phần 1 (5 câu hỏi): Điền chữ Hán vào chỗ trống dựa trên Pinyin được cung cấp.'
    )
  ).toBeVisible();
  await expect(
    hskTestPage.frame.getByText('Phần 2 (5 câu hỏi): Viết câu dựa trên tranh và từ cho sẵn.')
  ).toBeVisible();
  await expect(hskTestPage.startBtn).toBeVisible();
  await expect(hskTestPage.startBtn).toBeEnabled();
});

// ============================================================
// TC20 - Kiểm tra nút "Bắt đầu" đóng modal hướng dẫn và vào màn làm bài
// ============================================================
test('TC20 - Click "Bắt đầu" đóng modal hướng dẫn và hiển thị màn làm bài', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();

  await expect(hskTestPage.guideTitle).toBeVisible();
  await hskTestPage.startBtn.click();

  await expect(hskTestPage.guideTitle).toBeHidden();
  await expect(hskTestPage.testTitle).toBeVisible();
});

// ============================================================
// TC21 - Kiểm tra header màn làm bài: tiêu đề "Bài Test 01" và nút "Thoát"
// ============================================================
test('TC21 - Header hiển thị tiêu đề "Bài Test 01" và nút "Thoát" khả dụng', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();
  await hskTestPage.startTest();

  await expect(hskTestPage.testTitle).toBeVisible();
  await expect(hskTestPage.exitBtn).toBeVisible();
  await expect(hskTestPage.exitBtn).toBeEnabled();
});

// ============================================================
// TC22 - Kiểm tra sidebar "Danh sách câu hỏi" hiển thị Phần 1 với Câu 1, 2, 3
// ============================================================
test('TC22 - Sidebar "Danh sách câu hỏi" hiển thị Phần 1 với Câu 1, Câu 2, Câu 3', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();
  await hskTestPage.startTest();

  await expect(hskTestPage.questionListHeading).toBeVisible();
  await expect(hskTestPage.part1Toggle).toBeVisible();
  await expect(hskTestPage.part2Toggle).toBeVisible();
  await expect(hskTestPage.getSidebarQuestionItem(1)).toBeVisible();
  await expect(hskTestPage.getSidebarQuestionItem(2)).toBeVisible();
  await expect(hskTestPage.getSidebarQuestionItem(3)).toBeVisible();
});

// ============================================================
// TC23 - Kiểm tra Câu 1 được active mặc định khi vào màn làm bài
// ============================================================
test('TC23 - Câu 1 được active mặc định trong sidebar và bảng câu hỏi chính', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();
  await hskTestPage.startTest();

  await expect(hskTestPage.getSidebarQuestionItem(1)).toBeVisible();
  await expect(hskTestPage.getCurrentQuestionBadge(1)).toBeVisible();
});

// ============================================================
// TC24 - Kiểm tra nội dung Câu 1: tiêu đề phần và đề bài Pinyin
// ============================================================
test('TC24 - Câu 1 hiển thị đúng tiêu đề phần và đề bài điền chữ Hán theo Pinyin', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();
  await hskTestPage.startTest();

  await expect(hskTestPage.mainPanel.getByText('看拼音，写汉字。')).toBeVisible();
  await expect(
    hskTestPage.mainPanel.getByText('他个子不（gāo ______ ），也不矮，但是长得很帅。')
  ).toBeVisible();
});

// ============================================================
// TC25 - Kiểm tra input trả lời hiển thị đúng label và placeholder
// ============================================================
test('TC25 - Input trả lời hiển thị label "Câu trả lời" và placeholder đúng', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();
  await hskTestPage.startTest();

  await expect(hskTestPage.mainPanel.getByText('Câu trả lời')).toBeVisible();
  await expect(hskTestPage.answerInput).toBeVisible();
  await expect(hskTestPage.answerInput).toBeEditable();
});

// ============================================================
// TC26 - Kiểm tra trạng thái nút "Phần Trước" và "Tiếp theo" ở câu đầu tiên
// ============================================================
test('TC26 - Ở Câu 1, nút "Phần Trước" bị disable và nút "Tiếp theo" khả dụng', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();
  await hskTestPage.startTest();

  await expect(hskTestPage.prevBtn).toBeDisabled();
  await expect(hskTestPage.nextBtn).toBeEnabled();
});

// ============================================================
// TC27 - Kiểm tra click "Tiếp theo" chuyển sang câu kế tiếp
// ============================================================
test('TC27 - Click "Tiếp theo" chuyển sang Câu 2 và active state cập nhật', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();
  await hskTestPage.startTest();

  // Điền câu trả lời trước khi qua câu tiếp theo - tránh popup xác nhận "chưa trả lời"
  await hskTestPage.answerInput.fill('高');
  await hskTestPage.nextBtn.click();
  await expect(hskTestPage.getCurrentQuestionBadge(2)).toBeVisible();
  await expect(hskTestPage.prevBtn).toBeEnabled();
});

// ============================================================
// TC28 - Kiểm tra panel "Thông tin" hiển thị đúng dữ liệu thí sinh và nút "Gửi"
// ============================================================
test('TC28 - Panel "Thông tin" hiển thị đúng dữ liệu thí sinh và nút "Gửi" khả dụng', async ({
  hskTestPage,
}) => {
  await hskTestPage.navigateToTest();
  await hskTestPage.startTest();

  await expect(hskTestPage.infoPanelHeading).toBeVisible();
  await expect(hskTestPage.infoPanel.getByText('HSK 3.0')).toBeVisible();
  await expect(hskTestPage.infoPanel.getByText('HSK 3', { exact: true })).toBeVisible();
  await expect(hskTestPage.submitBtn).toBeVisible();
  await expect(hskTestPage.submitBtn).toBeEnabled();
});
