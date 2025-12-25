export function BookingsSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bệnh nhân
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                SĐT
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Dịch vụ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Giờ hẹn
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-36 bg-slate-200 rounded" />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-8 w-20 bg-slate-200 rounded-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DoctorsGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-slate-200" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-slate-200 rounded mr-2.5" />
              <div className="h-4 w-28 bg-slate-200 rounded" />
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-slate-200 rounded mr-2.5" />
              <div className="h-4 w-40 bg-slate-200 rounded" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <div className="h-3 w-20 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function PatientsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Họ tên
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                SĐT
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Lượt khám
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ngày tạo
              </th>
              <th className="relative px-6 py-4">
                <span className="sr-only">Xem</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-40 bg-slate-200 rounded" />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-5 w-8 bg-slate-200 rounded-full" />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="h-4 w-16 bg-slate-200 rounded ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
