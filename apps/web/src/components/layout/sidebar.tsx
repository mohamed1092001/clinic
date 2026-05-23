'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'الرئيسية', icon: '📊' },
  { href: '/patients', label: 'المرضى', icon: '👥' },
  { href: '/appointments', label: 'المواعيد', icon: '📅' },
  { href: '/invoices', label: 'الفواتير', icon: '💰' },
  { href: '/reports', label: 'التقارير', icon: '📈' },
  { href: '/settings', label: 'الإعدادات', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-white border-l border-gray-200 z-30">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-700">عيادتي</h1>
        <p className="text-xs text-gray-500">نظام إدارة العيادات</p>
      </div>
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
