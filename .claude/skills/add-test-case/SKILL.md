---
name: add-test-case
description: Dùng khi cần viết thêm test case Playwright cho một tính năng bất kỳ trong repo này, với input là tài liệu mô tả (docs/spec), hình ảnh (screenshot UI) hoặc elements (HTML/DOM snippet, data-testid...). Skill hướng dẫn phân tích input thành checklist TC, tạo/mở rộng Page Object, viết file spec đúng convention hiện tại, và chạy verify để đảm bảo test pass.
---

# Viết test case mới (Playwright + Page Object Model)

Repo này dùng Playwright + TypeScript theo mô hình Page Object Model (POM). Mọi test case mới
phải theo đúng cấu trúc đang có, không tự sáng tạo pattern khác.

## Cấu trúc tham chiếu

```
config/environments.ts        # id/dữ liệu test khác nhau theo TARGET_ENV (dev/staging/pro)
pages/<feature>/<Feature>Page.ts   # Page Object: locator (readonly) + method hành động
pages/BasePage.ts             # class nền, có goto() dùng waitForLoadState('load')
tests/fixtures.ts             # đăng ký mỗi Page Object thành 1 fixture
tests/<feature>/<feature>.spec.ts  # spec file, import test/expect từ '../fixtures'
```

Ví dụ mẫu tốt nhất để bám theo: [pages/hsk/HskPreviewPage.ts](../../pages/hsk/HskPreviewPage.ts)
và [tests/hsk/hskk3.spec.ts](../../tests/hsk/hskk3.spec.ts).

## Quy trình

### 1. Xác định tính năng và input

Hỏi/xác nhận input thuộc loại nào rồi xử lý tương ứng:

- **Docs/tài liệu mô tả tính năng**: đọc kỹ, liệt kê các hành vi/điều kiện chấp nhận (acceptance
  criteria) cần kiểm tra.
- **Hình ảnh (screenshot UI)**: dùng Read tool để xem ảnh, ghi lại text hiển thị (tiếng Việt/tiếng
  Trung...), tên nút, trạng thái active/disable, layout các khu vực (header, sidebar, modal...).
  Đây sẽ là cơ sở cho locator `getByText`/`getByRole`.
- **Elements (HTML/DOM snippet, data-testid do user cung cấp)**: đọc snippet để lấy chính xác
  `data-testid`, `role`, `name` (aria-label/text), class — ưu tiên tuyệt đối cho locator này vì
  ổn định hơn suy đoán từ ảnh.

Nếu tính năng đã có test (ví dụ đã có `tests/<feature>/`), đọc trước file spec + Page Object hiện
tại để tránh trùng TC và giữ đúng style.

### 2. Lập checklist TC trước khi code

Liệt kê ra danh sách `TCxx - <mô tả bằng tiếng Việt>` (đánh số tiếp theo TC cuối cùng đã có trong
file, hoặc TC01 nếu file mới) — mỗi TC là một hành vi độc lập, có thể verify bằng 1-vài `expect`.
Việc lập checklist trước giúp tránh test case chồng chéo hoặc thiếu case quan trọng (trạng thái
mặc định, chuyển trạng thái, điều hướng, nội dung hiển thị...).

### 3. Tạo/mở rộng Page Object

- Nếu tính năng đã có `pages/<feature>/<Feature>Page.ts`: thêm locator/method còn thiếu vào class
  đó, không tạo file mới cho cùng 1 trang.
- Nếu là tính năng mới: tạo `pages/<feature>/<Feature>Page.ts`, class `extends BasePage`.
- Locator viết dưới dạng `readonly` property, **ưu tiên theo thứ tự**:
  1. `getByTestId('...')` nếu có `data-testid`
  2. `getByRole('...', { name: '...' })` cho button/dialog/textbox có tên rõ
  3. `getByText('...')` cho nội dung tĩnh (so khớp chính xác text lấy từ tài liệu/ảnh)
  4. `this.page.locator('.class-name')` chỉ khi không có cách nào ổn định hơn (xem
     `testHeader`, `part-item` trong `HskPreviewPage.ts`)
  - Với danh sách phần tử lặp (list item), dùng `.first()`/`.nth(i)` hoặc viết method
    `getX(index: number)` như `getImageKeyword()`.
  - URL trang khai báo `static readonly xxxUrl = 'vi/...'` (URL tương đối, Playwright tự ghép
    `baseURL` theo `TARGET_ENV`) — không hardcode domain trừ trang nằm ở `rootURL` gốc (xem
    `LoginPage.login()`).
  - Method điều hướng gọi `this.goto(...)`; method có logic chờ/điều kiện (đóng modal, click tới
    khi hiện phần tử...) nên viết thành helper trong Page Object, không lặp logic đó trong spec.

### 4. Đăng ký fixture (chỉ khi tạo Page Object mới)

Thêm vào `tests/fixtures.ts`: khai báo type trong `PageFixtures`, và thêm fixture tương ứng
(pattern giống `hskPage`).

### 5. Cập nhật config nếu cần

Nếu tính năng cần dữ liệu test khác nhau theo môi trường (id, testSet...), thêm field vào
`EnvConfig`/`environments` trong `config/environments.ts` cho cả `dev`, `staging`, `pro` (dùng
`0`/`''` + comment `// TODO: cập nhật khi có id thực tế` cho môi trường chưa có dữ liệu, như cách
đang làm với `pro`).

### 6. Viết file spec

Tạo/mở `tests/<feature>/<feature>.spec.ts`:

```ts
import { test, expect } from '../fixtures';
import { XxxPage } from '../../pages/<feature>/XxxPage';

test.beforeEach(async ({ xxxPage }) => {
  await xxxPage.navigate(); // hoặc navigateToXxx()
});

// ============================================================
// TCxx - <mô tả ngắn gọn nhóm test, khớp checklist ở bước 2>
// ============================================================
test('TCxx - <mô tả chi tiết bằng tiếng Việt>', async ({ xxxPage }) => {
  await expect(xxxPage.someLocator).toBeVisible();
});
```

Quy ước:
- Tên test luôn dạng `'TCxx - Mô tả tiếng Việt'`, số TC tăng dần không trùng trong file.
- Dùng banner comment `// ====...====` bọc quanh mỗi test (hoặc nhóm test liên quan) để dễ scan,
  đúng style từ TC04 trở đi trong `hskk3.spec.ts`.
- Chỉ destructure fixture cần dùng (`page` chỉ lấy khi cần assert URL hoặc thao tác DOM ngoài Page
  Object).
- Assertion dùng `expect(locator).toBeVisible()/.toBeEnabled()/.toHaveClass(/regex/)/
  toHaveURL(...)` — không dùng `waitForTimeout` hay `networkidle` (xem comment lý do trong
  `BasePage.goto`).
- Nếu tính năng có modal giới thiệu/onboarding tương tự HSK, gọi helper đóng modal (như
  `closeIntroModal()`) trước khi assert phần nội dung phía sau.

### 7. Kiểm tra chất lượng & chạy test

Luôn chạy đủ 3 bước sau trước khi báo hoàn thành, theo đúng script trong `package.json`:

```bash
npm run typecheck
npm run lint
TARGET_ENV=staging npx playwright test tests/<feature>/<feature>.spec.ts --reporter=list
```

- Nếu chưa chắc `TARGET_ENV`, dùng `staging` (mặc định của repo).
- Test fail do sai locator: đọc lại ảnh/docs/elements gốc, không đoán mò; nếu cần, dùng
  `npx playwright test ... --debug` hoặc xem trace/screenshot trong `test-results/` (đã cấu hình
  `screenshot: 'only-on-failure'`).
- Không dùng `test.only`/`test.skip` khi báo hoàn thành (CI có `forbidOnly`).
- Không sửa `playwright.config.ts`, `auth.setup.ts`, hay file trong `playwright/.auth/` trừ khi
  được yêu cầu rõ — các test case mới phải tận dụng session đã login sẵn qua fixture.

## Kết quả cần đạt

- File spec mới/được mở rộng chạy `npm run typecheck` và `npm run lint` sạch.
- Tất cả test case trong checklist bước 2 đều có test tương ứng và **pass thật** khi chạy trên
  `TARGET_ENV=staging` (hoặc môi trường được chỉ định).
- Locator ưu tiên `data-testid`/`role`/`text` ổn định, tránh selector CSS mong manh trừ khi không
  còn lựa chọn khác.
