import Link from "next/link";
import { ArrowRight, Calendar, Users, Activity, LayoutDashboard, Stethoscope, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">Clinic CRM</span>
          </div>
          <nav>
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition duration-300 hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20"
            >
              <span className="mr-2">Đăng nhập</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40">
          {/* Background decorative elements */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>

          <div className="container mx-auto flex flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              Giải pháp quản lý y tế số 1
            </div>

            <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl md:text-7xl lg:text-8xl">
              Quản lý phòng khám <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                Hiệu quả & Tin cậy
              </span>
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-zinc-600 sm:text-x">
              Nền tảng toàn diện giúp tối ưu hóa quy trình vận hành, nâng cao trải nghiệm bệnh nhân và hỗ trợ đội ngũ y bác sĩ làm việc hiệu quả nhất.
            </p>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Bắt đầu ngay
              </Link>
              <Link
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-8 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="bg-zinc-50 py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Quy trình làm việc tối ưu
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-600">
                Được thiết kế để đơn giản hóa mọi thao tác quản lý phòng khám của bạn, từ tiếp nhận đến báo cáo.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
                {/* Step 1 */}
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-900/10">
                    <LayoutDashboard className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold leading-8 text-zinc-900">1. Tổng quan & Hành động</h3>
                  <p className="mt-2 text-base leading-7 text-zinc-600">
                    Bắt đầu ngày mới với các tác vụ ưu tiên được tự động đề xuất ngay trên Dashboard.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-900/10">
                    <Calendar className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold leading-8 text-zinc-900">2. Tiếp nhận & Xếp lịch</h3>
                  <p className="mt-2 text-base leading-7 text-zinc-600">
                    Hệ thống tự động sắp xếp và phân loại đặt hẹn thông minh, tránh trùng lặp.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-900/10">
                    <Stethoscope className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold leading-8 text-zinc-900">3. Chăm sóc & Điều trị</h3>
                  <p className="mt-2 text-base leading-7 text-zinc-600">
                    Bác sĩ tiếp nhận hồ sơ và lịch sử khám của bệnh nhân chỉ với một cú nhấp chuột.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-900/10">
                    <BarChart className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold leading-8 text-zinc-900">4. Hoàn tất & Báo cáo</h3>
                  <p className="mt-2 text-base leading-7 text-zinc-600">
                    Tự động tổng hợp doanh thu và báo cáo hiệu quả hoạt động ngay lập tức.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-900/5 transition-all hover:shadow-md hover:ring-zinc-900/10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-lg font-semibold leading-6 text-zinc-900">
                  Quản lý Bệnh nhân
                </h3>
                <p className="text-base leading-7 text-zinc-600">
                  Lưu trữ hồ sơ bệnh án điện tử an toàn, dễ dàng tra cứu lịch sử khám chữa bệnh và quản lý thông tin liên lạc.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-900/5 transition-all hover:shadow-md hover:ring-zinc-900/10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-lg font-semibold leading-6 text-zinc-900">
                  Cổng thông tin Bác sĩ
                </h3>
                <p className="text-base leading-7 text-zinc-600">
                  Giao diện chuyên biệt cho bác sĩ quản lý lịch làm việc, theo dõi danh sách bệnh nhân và cập nhật trạng thái khám.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-900/5 transition-all hover:shadow-md hover:ring-zinc-900/10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-lg font-semibold leading-6 text-zinc-900">
                  Xếp lịch Thông minh
                </h3>
                <p className="text-base leading-7 text-zinc-600">
                  Tự động hóa quy trình đặt lịch hẹn, giảm thiểu trùng lặp và tối ưu hóa thời gian chờ đợi của bệnh nhân.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-white py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="text-base font-semibold text-zinc-900">Clinic CRM</span>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Clinic CRM. Đã đăng ký bản quyền.
          </p>
        </div>
      </footer>
    </div>
  );
}
