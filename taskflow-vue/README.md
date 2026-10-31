# TaskFlow — Vue 3 + TypeScript

Frontend demo thực thi được, dựng theo 2 ảnh UI: **Login (white/purple)** và **Profile (dark/indigo)**. Có sẵn Overview, Tasks (List + Kanban), Calendar, Team, Statistics, AI demo, sidebar, hồ sơ, modal tạo công việc/dự án.

## Yêu cầu

- Node.js 20.19+ hoặc Node 22.12+ cho Vite 6 (khuyến nghị bản Node LTS mới).
- npm.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở **http://localhost:5173**.

**Đăng nhập demo:** nhập bất kỳ tên tài khoản/email và mật khẩu từ 6 ký tự. Chưa có xác thực thực tế. KHÔNG sử dụng mật khẩu thật. Trang Register là mô phỏng, không lưu mật khẩu; nút Google và quên mật khẩu hiển thị thông báo chưa tích hợp.

```bash
npm run typecheck
npm run build
npm run preview
```

## Cấu trúc

```text
src/
  components/  MainLayout.vue, TaskModal.vue
  views/       AuthView.vue, ProfileView.vue, DashboardView.vue,
               TasksView.vue, CalendarView.vue, TeamView.vue,
               StatisticsView.vue, AIView.vue
  stores/      app.ts             # Pinia store + localStorage demo
  types/       index.ts           # Interface đối chiếu schema SQL
  router/      index.ts           # Vue Router + demo guard
  assets/      style.css          # Toàn bộ giao diện & responsive
  App.vue
  main.ts
```

## Liên kết với database SQL Server bạn cung cấp

Vue **không kết nối SQL Server trực tiếp**. Kiến trúc triển khai:

```
Vue 3/TypeScript (UI) -> HTTPS /api -> ASP.NET Core Web API -> SQL Server
```

| UI | Bảng SQL | API REST gợi ý |
|---|---|---|
| Đăng nhập / đăng ký / hồ sơ | `Users` | `POST /api/auth/login`, `POST /api/auth/register`, `GET/PATCH /api/users/me` |
| Dự án / thành viên | `Projects`, `ProjectMembers` | `GET/POST /api/projects`, `GET/POST /api/projects/{id}/members` |
| Công việc / lịch / thống kê | `Tasks` | `GET/POST /api/tasks`, `PATCH /api/tasks/{id}`, `DELETE /api/tasks/{id}` |
| Nhắn tin nhóm | `Messages` | `GET/POST /api/projects/{id}/messages` |
| Thông báo | `Notifications` | `GET /api/notifications`, `PATCH /api/notifications/{id}/read` |
| File đính kèm | `Files` | `POST /api/files` |
| Trợ lý AI | `AI_Conservations`, `AI_Messages` | `GET/POST /api/ai/conversations`, `POST /api/ai/conversations/{id}/messages` |

**Lưu ý:** bản này là frontend prototype, chưa bao gồm Backend/SQL Server, Google OAuth, email reset-password, upload FTP, WebSocket hay AI thật. Team hiện là dữ liệu mẫu; AI hiển thị câu trả lời có quy tắc từ dữ liệu demo, không gọi model. localStorage chỉ lưu dữ liệu giao diện demo, không dùng để lưu password hay token. Route guard frontend **không** phải kiểm soát truy cập an toàn.

### Gợi ý chỉnh schema SQL

- `Users`: sửa `AvataPath` thành `AvatarPath`; thêm `FullName`, `Timezone`, `Bio` nếu muốn lưu các trường của hồ sơ.
- `Tasks`: thêm `Priority` (low/medium/high) nếu cần phân loại ưu tiên.
- `Notifications`: thêm `IsRead bit NOT NULL DEFAULT 0` để lưu trạng thái đọc.
- `Projects`: thêm `CreatedByUser` hoặc `OwnerId` và khóa ngoại nếu cần chủ dự án.
- `Files`: cần bảng liên kết file với task/message (`TaskFiles`, `MessageFiles`...) để xác định file thuộc về đâu.
- `AI_Conservations` nên đổi thành `AI_Conversations` và `ConservationId` thành `ConversationId`; sửa `Messages.SendedByUser` -> `SentByUser` nếu có thể migration.
- Nên có `UNIQUE(Username)`, CHECK/enum cho `Status`, `Role`; index cho các cột FK. `PasswordHash` phải do backend tạo bằng thuật toán thích hợp như ASP.NET Core Identity; không tự hash password ở frontend.
- API xác thực thật nên dùng ASP.NET Core Identity + cookie HttpOnly/Secure/SameSite hoặc giải pháp token phù hợp, kiểm tra quyền thành viên dự án tại backend.

Dữ liệu mock có thể bị xóa qua browser DevTools -> Application -> Local Storage -> xóa các key `tf_*` để trở lại trạng thái ban đầu.
