'use client'

import { Sidebar } from './sidebar'
import { ReactNode } from 'react'

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="mr-64 p-6">
        {children}
      </main>
    </div>
  )
}
