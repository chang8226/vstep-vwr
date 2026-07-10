# Test Dash

Bộ test tự động (Playwright + TypeScript) cho hệ thống PREP — dùng Page Object Model.

## Cài đặt

```bash
npm install
npx playwright install
cp .env.example .env
```

Sau đó điền `USER_EMAIL`, `USER_PASSWORD` trong `.env` bằng tài khoản test thật. Không commit file `.env` (đã có trong `.gitignore`).

## Chạy test

Chọn môi trường bằng biến `TARGET_ENV` (`dev` | `staging` | `pro`, mặc định `staging` nếu không set):

```bash
npm test                                   # chạy theo TARGET_ENV trong .env
TARGET_ENV=staging npx playwright test     # chỉ định môi trường trực tiếp
npm run test:ui                            # chạy với Playwright UI mode
npm run test:debug                         # chạy debug từng bước
```

Xem report sau khi chạy:

```bash
npx playwright show-report
```

### Lưu ý về môi trường `dev`

Domain `dev` bị Cloudflare Turnstile chặn đăng nhập tự động qua UI, nên môi trường này dùng thẳng `playwright/.auth/dev-user.json` (tạo thủ công, xem `playwright/.auth/dev-user.json.template`) thay vì chạy `auth.setup.ts`. Xem chi tiết trong `playwright.config.ts`.

## Cấu trúc project

```
config/environments.ts     # cấu hình theo môi trường (baseURL, id dữ liệu test HSK...)
pages/                      # Page Object Model, tách theo feature
  BasePage.ts               # class nền, chứa logic goto() dùng chung
  auth/LoginPage.ts
  dashboard/DashboardPage.ts
  hsk/HskPreviewPage.ts
tests/
  fixtures.ts               # custom fixtures inject sẵn các Page Object
  auth/                     # test đăng nhập + auth.setup.ts (tạo storageState)
  dashboard/                # test Learning Dashboard
  hsk/                      # test màn preview/làm bài HSK
playwright.config.ts        # cấu hình Playwright (project, reporter, retries...)
```

## Kiểm tra chất lượng code

```bash
npm run typecheck   # kiểm tra type TypeScript
npm run lint        # ESLint
npm run format      # Prettier
```

## CI

GitHub Actions ([.github/workflows/playwright.yml](.github/workflows/playwright.yml)) chạy toàn bộ suite trên mỗi push/PR vào `main`/`master`. Cần khai báo trong repo Settings → Secrets and variables → Actions:

- `USER_EMAIL`, `USER_PASSWORD` (Repository secrets)
- `TARGET_ENV` (Repository variable, tuỳ chọn — mặc định `staging`)
