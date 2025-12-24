# Clinic CRM 🏥

Hệ thống quản lý phòng khám (Clinic CRM) hiện đại được xây dựng bằng **Next.js 16**, tối ưu hóa cho hiệu suất và trải nghiệm người dùng, tích hợp **Supabase** để quản lý dữ liệu và xác thực thời gian thực.

## ✨ Tính Năng Chính

### 🔐 Quản Trị Viên (Admin Dashboard)

- **📊 Dashboard Tổng Quan**: 
  - Thống kê tổng quan về doanh thu, lượt khám, bệnh nhân và bác sĩ
  - Biểu đồ trực quan với Recharts (doanh thu theo thời gian, phân bố dịch vụ)
  - Cập nhật dữ liệu real-time

- **👨‍⚕️ Quản Lý Bác Sĩ**:
  - Danh sách bác sĩ với khả năng tìm kiếm và lọc
  - Thêm/Sửa/Xóa thông tin bác sĩ (chuyên khoa, bằng cấp, dịch vụ)
  - Quản lý lịch làm việc theo tuần với nhiều ca trong ngày
  - Thiết lập số lượng bệnh nhân tối đa mỗi ca

- **📅 Quản Lý Lịch Hẹn**:
  - **View Danh Sách**: Xem tất cả các đơn đặt lịch chờ xử lý
  - **View Lịch Tổng Quan** (Mới!): 
    - Bảng lịch dạng thời khóa biểu theo tuần
    - Hiển thị trực quan tình trạng bận/rảnh của từng bác sĩ
    - Mã màu theo trạng thái: Còn trống (xanh), Đang bận (vàng), Hết chỗ (đỏ)
    - Điều hướng qua lại giữa các tuần
    - Theo dõi số lượng bệnh nhân đã đặt/tối đa mỗi ca
  - Xếp lịch tự động tìm bác sĩ phù hợp dựa trên dịch vụ và thời gian
  - Cập nhật trạng thái lịch hẹn

- **💰 Quản Lý Thanh Toán**:
  - Theo dõi các giao dịch thanh toán
  - Nhiều phương thức thanh toán (tiền mặt, chuyển khoản, v.v.)
  - Báo cáo doanh thu

- **🏥 Quản Lý Dịch Vụ**:
  - Danh sách các dịch vụ khám chữa bệnh
  - Cập nhật giá và thời gian ước tính

### 👨‍⚕️ Cổng Thông Tin Bác Sĩ

- Giao diện dành riêng cho bác sĩ để xem lịch trình và bệnh nhân
- Dashboard cá nhân (đang phát triển tại `/doctor`)

### 🔒 Hệ Thống Xác Thực

- Đăng nhập/Đăng xuất an toàn với Supabase Auth
- Phân quyền theo vai trò (Admin, Doctor, Staff)
- Bảo mật session và cookies

## 🛠️ Công Nghệ Sử Dụng

Dự án sử dụng các công nghệ mới nhất trong hệ sinh thái React:

- **Core**: 
  - [Next.js 16](https://nextjs.org/) (App Router)
  - [React 19](https://react.dev/)
  - TypeScript
  
- **Styling**: 
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - CSS Modules
  
- **UI Components**: 
  - Radix UI (Dialog, Select, Dropdown)
  - [Lucide React](https://lucide.dev/) (Icons)
  - Custom Components
  
- **Data & State**: 
  - [TanStack Query](https://tanstack.com/query) (Server State)
  - [date-fns](https://date-fns.org/) (Date Utilities)
  
- **Forms & Validation**: 
  - React Hook Form
  - Zod Schema Validation
  
- **Backend & Database**: 
  - [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
  - Server Actions
  
- **Charts & Visualization**: 
  - [Recharts](https://recharts.org/)
  
- **Utilities**: 
  - `clsx`, `tailwind-merge` (Dynamic Classes)

## 📁 Cấu Trúc Thư Mục

```
clinic-crm/
├── app/                          # Next.js App Router
│   ├── admin/                    # Trang quản trị
│   │   ├── bookings/            # Quản lý lịch hẹn (List + Schedule Grid)
│   │   ├── dashboard/           # Dashboard tổng quan
│   │   ├── doctors/             # Quản lý bác sĩ
│   │   ├── payments/            # Quản lý thanh toán
│   │   └── services/            # Quản lý dịch vụ
│   ├── doctor/                   # Portal cho bác sĩ
│   ├── api/                      # API Routes
│   │   └── admin/
│   │       ├── doctor-schedules/ # API lấy lịch bác sĩ (Schedule Grid)
│   │       └── find-doctors/     # API tìm bác sĩ phù hợp
│   └── login/                    # Trang đăng nhập
├── components/                   # React Components
│   ├── doctor-schedule-grid.tsx  # Component lịch tổng quan (mới!)
│   ├── booking-assignment-modal.tsx
│   ├── doctor-modal.tsx
│   └── ui/                       # UI primitives
├── lib/                          # Utilities & Configs
│   ├── supabase/                # Supabase clients
│   ├── database.types.ts        # Database TypeScript types
│   └── utils.ts                 # Helper functions
└── public/                       # Static assets
```


## 📊 Database Schema

Dự án sử dụng Supabase PostgreSQL với các bảng chính:

- `users` - Thông tin người dùng (admin, doctor, staff)
- `doctors` - Thông tin bác sĩ
- `doctor_schedules` - Lịch làm việc của bác sĩ
- `doctor_services` - Dịch vụ mà bác sĩ có thể thực hiện
- `bookings` - Đơn đặt lịch khám
- `services` - Danh sách dịch vụ
- `payments` - Thông tin thanh toán
- `medical_records` - Hồ sơ bệnh án

## 🎯 Tính Năng Nổi Bật

### 📅 Schedule Grid (Lịch Tổng Quan)

Một trong những tính năng mới nhất và nổi bật nhất của hệ thống:

- **Giao diện trực quan**: Hiển thị lịch làm việc của tất cả bác sĩ trong tuần dạng bảng
- **Mã màu thông minh**: 
  - 🟢 Xanh lá: Còn trống (< 50% capacity)
  - 🟡 Vàng: Đang bận (≥ 50% capacity)
  - 🔴 Đỏ: Hết chỗ (100% capacity)
- **Thông tin chi tiết**: Hiển thị khung giờ làm việc và số lượng bệnh nhân đã đặt/tối đa
- **Điều hướng linh hoạt**: Chuyển qua lại giữa các tuần, quay về tuần hiện tại
- **Responsive**: Tối ưu cho mọi kích thước màn hình

### 🔍 Tìm Bác Sĩ Thông Minh

- Tự động tìm bác sĩ phù hợp dựa trên dịch vụ yêu cầu
- Kiểm tra lịch trống và số lượng bệnh nhân
- Gợi ý thời gian khám phù hợp

## 🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request hoặc Issues để báo lỗi và đề xuất tính năng mới.

## 📝 License

Dự án này được phát triển cho mục đích quản lý phòng khám.

---

> 💡 **Mục tiêu**: Tối ưu hóa quy trình vận hành phòng khám, giảm thiểu thao tác thủ công, nâng cao chất lượng phục vụ bệnh nhân và tăng hiệu quả công việc của đội ngũ y tế.
