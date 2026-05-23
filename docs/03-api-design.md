# تصميم واجهات API

## 1. النمط العام

```
Base URL: /api/v1
Format: JSON
Auth: Bearer JWT Token
Multi-tenant: كل request يحمل clinicId من الـ JWT (مش من الـ URL)
```

## 2. المجموعات الرئيسية

### 2.1 المصادقة (Auth)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| POST | `/auth/login` | تسجيل الدخول | عام |
| POST | `/auth/register` | تسجيل عيادة جديدة + تجربة مجانية | عام |
| POST | `/auth/refresh` | تجديد الـ token | عام |
| POST | `/auth/logout` | تسجيل الخروج | جميع |
| POST | `/auth/forgot-password` | نسيت كلمة المرور | عام |
| POST | `/auth/reset-password` | إعادة تعيين كلمة المرور | عام |
| POST | `/auth/verify-2fa` | التحقق بعاملين | عام |
| GET  | `/auth/me` | بيانات المستخدم الحالي | جميع |

### 2.2 إدارة المرضى (Patients)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET    | `/patients` | قائمة المرضى (بحث + تصفح) | جميع |
| POST   | `/patients` | إنشاء مريض جديد | RECEPTIONIST+ |
| GET    | `/patients/:id` | عرض بيانات مريض | جميع |
| PATCH  | `/patients/:id` | تحديث بيانات مريض | RECEPTIONIST+ |
| GET    | `/patients/:id/history` | تاريخ زيارات المريض | جميع |
| GET    | `/patients/:id/records` | السجل الطبي (Professional+) | DOCTOR+ |
| GET    | `/patients/:id/invoices` | فواتير المريض | RECEPTIONIST+ |
| POST   | `/patients/:id/attach` | رفع ملف للمريض (Professional+) | DOCTOR+ |
| GET    | `/patients/export/:id` | تصدير ملف المريض PDF (Prof+) | DOCTOR+ |

### 2.3 المواعيد (Appointments)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET    | `/appointments` | قائمة المواعيد (تقويم) | جميع |
| POST   | `/appointments` | إنشاء موعد جديد | RECEPTIONIST+ |
| GET    | `/appointments/:id` | عرض تفاصيل الموعد | جميع |
| PATCH  | `/appointments/:id` | تحديث الموعد | RECEPTIONIST+ |
| PATCH  | `/appointments/:id/status` | تغيير الحالة (حضر/ألغى/لم يحضر) | RECEPTIONIST+ |
| DELETE | `/appointments/:id` | إلغاء موعد | ADMIN / RECEPTIONIST |
| GET    | `/appointments/calendar` | تقويم يومي/أسبوعي | جميع |
| GET    | `/appointments/available` | الأوقات المتاحة لطبيب | عام (للحجز الأونلاين) |
| POST   | `/appointments/online` | حجز أونلاين (Professional+) | عام |

### 2.4 السجل الطبي (Medical Records - Professional+)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET    | `/medical-records?patientId=` | سجل المريض الطبي | DOCTOR+ |
| POST   | `/medical-records` | إضافة سجل طبي جديد | DOCTOR |
| PATCH  | `/medical-records/:id` | تعديل السجل الطبي | DOCTOR |
| DELETE | `/medical-records/:id` | حذف سجل طبي | ADMIN |

### 2.5 الفواتير والإيرادات (Invoices)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET    | `/invoices` | قائمة الفواتير | RECEPTIONIST+ |
| POST   | `/invoices` | إنشاء فاتورة | RECEPTIONIST+ |
| GET    | `/invoices/:id` | عرض فاتورة | RECEPTIONIST+ |
| PATCH  | `/invoices/:id/pay` | تسجيل دفع | RECEPTIONIST+ |
| GET    | `/invoices/:id/print` | طباعة إيصال | RECEPTIONIST+ |
| GET    | `/invoices/daily-summary` | ملخص اليوم | RECEPTIONIST+ |
| POST   | `/invoices/close-day` | إقفال اليومية | ADMIN |

### 2.6 المصروفات (Expenses - Premium)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET    | `/expenses` | قائمة المصروفات | ACCOUNTANT+ |
| POST   | `/expenses` | إضافة مصروف | ACCOUNTANT+ |
| PATCH  | `/expenses/:id` | تعديل مصروف | ACCOUNTANT+ |
| DELETE | `/expenses/:id` | حذف مصروف | ADMIN |

### 2.7 التقارير (Reports)

| Method | Endpoint | الوصف | الباقة |
|--------|----------|-------|--------|
| GET    | `/reports/daily` | التقرير اليومي | جميع |
| GET    | `/reports/monthly?month=&year=` | التقرير الشهري | Professional+ |
| GET    | `/reports/comparison` | مقارنة أداء شهري | Professional+ |
| GET    | `/reports/top-services` | أكثر الخدمات طلباً | Professional+ |
| GET    | `/reports/doctor-performance` | أداء الأطباء | Professional+ |
| GET    | `/reports/profit-loss` | أرباح وخسائر (شهري) | Premium |
| GET    | `/reports/booking-sources` | تحليل مصادر الحجز | Premium |
| GET    | `/reports/export/:type` | تصدير (PDF/Excel) | Professional+ |

### 2.8 الخدمات (Services)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET    | `/services` | قائمة الخدمات | جميع |
| POST   | `/services` | إضافة خدمة | ADMIN |
| PATCH  | `/services/:id` | تحديث خدمة | ADMIN |
| DELETE | `/services/:id` | حذف خدمة | ADMIN |

### 2.9 المستخدمين (Users)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET    | `/users` | قائمة المستخدمين | ADMIN |
| POST   | `/users` | إضافة مستخدم | ADMIN |
| PATCH  | `/users/:id` | تعديل صلاحيات/بيانات | ADMIN |
| DELETE | `/users/:id` | حذف مستخدم | ADMIN |

### 2.10 إدارة الاشتراك (Subscription)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET    | `/subscription` | حالة الاشتراك | ADMIN |
| POST   | `/subscription/upgrade` | ترقية الباقة | ADMIN |
| POST   | `/subscription/cancel` | إلغاء الاشتراك | ADMIN |
| POST   | `/subscription/payment-method` | تحديث وسيلة الدفع | ADMIN |
| GET    | `/subscription/invoices` | فواتير الاشتراك | ADMIN |
| POST   | `/subscription/apply-coupon` | تطبيق كود خصم | ADMIN |

### 2.11 Landing Page (إضافة مدفوعة)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET    | `/landing-page` | بيانات الصفحة | ADMIN |
| PATCH  | `/landing-page` | تحديث بيانات الصفحة | ADMIN |
| POST   | `/landing-page/publish` | نشر الصفحة | ADMIN |
| POST   | `/landing-page/upload-image` | رفع صورة | ADMIN |
| GET    | `/lp/:clinicSlug` | عرض الصفحة (عام) | عام |

## 3. هيكل الاستجابة (Response Format)

### نجاح
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### خطأ
```json
{
  "success": false,
  "error": {
    "code": "APPOINTMENT_CONFLICT",
    "message": "هذا الوقت محجوز بالفعل",
    "details": { "conflictingAppointmentId": "..." }
  }
}
```

## 4. قواعد الصلاحيات (Authorization Rules)

```
ADMIN:        كل شيء في العيادة
DOCTOR:       قراءة المرضى + المواعيد + إضافة سجل طبي
RECEPTIONIST: إدارة المرضى والمواعيد والفواتير (بدون تقارير مالية)
ACCOUNTANT:   الفواتير والمصروفات والتقارير (بدون إدارة مستخدمين)
```

**تطبق على مستوى الـ Guard في NestJS:**
```
@Roles(Role.ADMIN, Role.DOCTOR)  → يسمح لـ Admin والطبيب فقط
@Roles(Role.RECEPTIONIST)        → Receptionist + الأدوار الأعلى
```
