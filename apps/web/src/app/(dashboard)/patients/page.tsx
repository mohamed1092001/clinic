'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Example patients - replace with API call
const MOCK_PATIENTS = [
  { id: '1', fileNumber: 101, name: 'أحمد محمد', phone: '01234567890', lastVisit: '2025-01-15', totalVisits: 5 },
  { id: '2', fileNumber: 102, name: 'سارة علي', phone: '01123456789', lastVisit: '2025-01-14', totalVisits: 2 },
]

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">المرضى</h1>
        <Button onClick={() => setShowForm(true)}>
          + مريض جديد
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="ابحث باسم المريض أو رقم الهاتف..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-right">
              <th className="px-4 py-3 text-sm font-medium text-gray-500">رقم الملف</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">الاسم</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">رقم الهاتف</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">آخر زيارة</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">عدد الزيارات</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PATIENTS.map((patient) => (
              <tr key={patient.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">#{patient.fileNumber}</td>
                <td className="px-4 py-3 text-sm font-medium">{patient.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{patient.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{patient.lastVisit}</td>
                <td className="px-4 py-3 text-sm">{patient.totalVisits}</td>
                <td className="px-4 py-3 text-sm">
                  <button className="text-primary-600 hover:text-primary-700">عرض</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
