import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'عيادتي - نظام إدارة العيادات الطبية',
  description: 'نظام SaaS لإدارة العيادات الطبية - حجوزات، مرضى، فواتير، تقارير',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans">{children}</body>
    </html>
  )
}
