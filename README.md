# Clinic CRM

Hệ thống quản lý phòng khám (Clinic CRM) hiện đại được xây dựng bằng **Next.js 16**, tối ưu hóa cho hiệu suất và trải nghiệm người dùng, tích hợp **Supabase** để quản lý dữ liệu và xác thực thời gian thực.

## Tính Năng Chính

- **Quản Trị Viên (Admin Dashboard)**:
  - **Quản lý Bác sĩ**: Danh sách bác sĩ, chỉnh sửa hồ sơ, chuyên khoa, và trạng thái hoạt động.
  - **Quản lý Lịch hẹn**: Xếp lịch, theo dõi và xử lý các cuộc hẹn khám bệnh.
  - **Thống kê**: Biểu đồ và báo cáo về hoạt động phòng khám (tích hợp Recharts).

- **Cổng Thông Tin Bác Sĩ**:
  - Giao diện dành riêng cho bác sĩ để xem lịch trình và bệnh nhân (đang phát triển tại `/doctor`).

- **Hệ Thống**:
  - **Xác thực An toàn**: Đăng nhập/Đăng xuất bảo mật với Supabase Auth.
  - **Hiệu suất cao**: Sử dụng Next.js App Router và React Server Components.

## Công Nghệ Sử Dụng

Dự án sử dụng các công nghệ mới nhất trong hệ sinh thái React:

- **Core**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Radix UI (thông qua các component tùy chỉnh), Lucide React (Icons)
- **State Management & Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Form Handling**: React Hook Form + Zod Validation
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Utilities**: `clsx`, `tailwind-merge` cho xử lý class động.

## Cấu Trúc Thư Mục

- `app/`: Directoy chính chứa các routes và pages (App Router).
  - `admin/`: Các tính năng quản trị.
  - `doctor/`: Các tính năng cho bác sĩ.
  - `api/`: Các API Routes (Serverless functions).
- `components/`: Các UI components tái sử dụng (Button, Input, Modal...).
- `lib/`: Các tiện ích (utils), cấu hình Supabase clients, định nghĩa Types.
- `public/`: Assets tĩnh (hình ảnh, icons).

---

> Dự án này được phát triển để tối ưu hóa quy trình vận hành phòng khám, giảm thiểu thao tác thủ công và nâng cao chất lượng phục vụ bệnh nhân.
