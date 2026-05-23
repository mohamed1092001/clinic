'use client'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="مرضى اليوم" value="--" color="blue" />
        <StatCard title="المواعيد" value="--" color="green" />
        <StatCard title="إيرادات اليوم" value="-- ج.م" color="amber" />
        <StatCard title="مرضى جدد" value="--" color="purple" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">مواعيد اليوم</h2>
          <p className="text-gray-500 text-sm">لا توجد مواعيد لعرضها</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">آخر المرضى</h2>
          <p className="text-gray-500 text-sm">لا يوجد مرضى لعرضهم</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  }

  return (
    <div className={`rounded-xl p-4 border ${colors[color]}`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
