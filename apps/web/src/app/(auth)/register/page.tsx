'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const data = {
      clinicName: form.get('clinicName'),
      adminName: form.get('adminName'),
      email: form.get('email'),
      phone: form.get('phone'),
      password: form.get('password'),
    }

    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || 'خطأ في إنشاء الحساب')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">تم إنشاء الحساب بنجاح!</h1>
          <p className="text-gray-500 mt-2">تم تفعيل النسخة التجريبية لمدة 7 أيام</p>
          <Button className="mt-6" onClick={() => window.location.href = '/login'}>
            تسجيل الدخول
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">إنشاء حساب جديد</h1>
          <p className="text-gray-500 mt-1">جرّب مجاناً لمدة 7 أيام</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="clinicName" name="clinicName" label="اسم العيادة" placeholder="عيادة الدكتور..." required />
          <Input id="adminName" name="adminName" label="اسم المسؤول" placeholder="محمد أحمد" required />
          <Input id="email" name="email" type="email" label="البريد الإلكتروني" placeholder="admin@clinic.com" required />
          <Input id="phone" name="phone" label="رقم الهاتف" placeholder="01234567890" required />
          <Input id="password" name="password" type="password" label="كلمة المرور" placeholder="8 أحرف على الأقل" required minLength={8} />
          <Button type="submit" loading={loading} className="w-full">
            بدء التجربة المجانية
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          لديك حساب بالفعل؟{' '}
          <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  )
}
