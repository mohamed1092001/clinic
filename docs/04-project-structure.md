# هيكل المشروع (Monorepo)

## 1. الهيكل العام

```
clinic-management/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/     # Login - Register - Reset Password
│   │   │   │   ├── (dashboard)/# لوحة التحكم الرئيسية
│   │   │   │   │   ├── patients/
│   │   │   │   │   ├── appointments/
│   │   │   │   │   ├── medical-records/
│   │   │   │   │   ├── invoices/
│   │   │   │   │   ├── expenses/
│   │   │   │   │   ├── reports/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── users/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── subscription/
│   │   │   │   ├── lp/         # Landing Pages العامة
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/         # shadcn/ui components
│   │   │   │   ├── shared/     # مكونات مشتركة
│   │   │   │   ├── forms/      # نماذج
│   │   │   │   └── layout/     # Sidebar, Navbar, etc
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   │   ├── api/        # API client
│   │   │   │   ├── auth/       # NextAuth config
│   │   │   │   └── utils.ts
│   │   │   ├── stores/         # Zustand stores
│   │   │   └── types/          # TypeScript types
│   │   ├── public/
│   │   │   └── locales/        # i18n translations
│   │   └── package.json
│   │
│   └── api/                    # NestJS Backend
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── common/
│       │   │   ├── guards/     # JWT, Roles, Throttle
│       │   │   ├── decorators/ # @CurrentUser, @Roles
│       │   │   ├── filters/    # Exception filters
│       │   │   ├── interceptors/# Transform, Logging
│       │   │   └── pipes/      # ValidationPipe
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── patients/
│       │   │   ├── appointments/
│       │   │   ├── medical-records/
│       │   │   ├── invoices/
│       │   │   ├── expenses/
│       │   │   ├── services/
│       │   │   ├── reports/
│       │   │   ├── subscription/
│       │   │   ├── landing-page/
│       │   │   └── audit-log/
│       │   └── prisma/
│       │       ├── schema.prisma
│       │       ├── seed.ts
│       │       └── migrations/
│       ├── test/
│       └── package.json
│
├── packages/
│   ├── shared/                 # الأنواع والمشتركات
│   │   ├── types/
│   │   ├── constants/
│   │   └── validators/         # Zod schemas
│   └── ui/                     # مكونات UI مشتركة
│
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── docker-compose.yml
│
├── docs/                       # الوثائق
├── .github/
│   └── workflows/
│       └── ci.yml
└── package.json                # Monorepo root
```

## 2. هيكل الموديول في NestJS

```
modules/patients/
├── patients.module.ts
├── patients.controller.ts
├── patients.service.ts
├── dto/
│   ├── create-patient.dto.ts
│   ├── update-patient.dto.ts
│   └── query-patient.dto.ts
├── entities/
│   └── patient.entity.ts       # (اختياري مع Prisma)
└── tests/
    ├── patients.service.spec.ts
    └── patients.controller.spec.ts
```

## 3. تقسيم الشاشات حسب الباقة

```
Frontend Routes:

/auth/*           → متاح للجميع    (Login, Register, Reset Password)
/(dashboard)/*    → متاح للمستخدمين المسجلين

/dashboard        → الصفحة الرئيسية (إحصائيات سريعة)
/dashboard/patients → جميع الباقات
/dashboard/appointments → جميع الباقات
/dashboard/invoices → جميع الباقات
/dashboard/services → جميع الباقات
/dashboard/medical-records → Professional+
/dashboard/reports/monthly → Professional+
/dashboard/reports/profit-loss → Premium
/dashboard/expenses → Premium
/dashboard/users → Professional+
/dashboard/subscription → ADMIN فقط
/dashboard/settings → ADMIN فقط
/dashboard/reports/export → Professional+
```

## 4. نظام Feature Flags للباقات

```typescript
// packages/shared/constants/feature-flags.ts
export const FEATURES = {
  // Starter
  PATIENT_MANAGEMENT: 'patient_management',
  APPOINTMENT_MANAGEMENT: 'appointment_management',
  DAILY_INCOME: 'daily_income',
  BASIC_REPORT: 'basic_report',
  
  // Professional
  MEDICAL_RECORDS: 'medical_records',
  MONTHLY_REPORTS: 'monthly_reports',
  MULTI_USER: 'multi_user',
  ROLE_PERMISSIONS: 'role_permissions',
  FILE_UPLOAD: 'file_upload',
  ONLINE_BOOKING: 'online_booking',
  EXPORT_REPORTS: 'export_reports',
  
  // Premium
  EXPENSES: 'expenses',
  PROFIT_LOSS: 'profit_loss',
  AUTO_BACKUP: 'auto_backup',
  CUSTOMIZATION: 'customization',
  PREMIUM_SUPPORT: 'premium_support',
  LANDING_PAGE: 'landing_page',
  ADVANCED_STATS: 'advanced_stats',
}

export const PLAN_FEATURES: Record<Tier, string[]> = {
  STARTER: [
    FEATURES.PATIENT_MANAGEMENT,
    FEATURES.APPOINTMENT_MANAGEMENT,
    FEATURES.DAILY_INCOME,
    FEATURES.BASIC_REPORT,
  ],
  PROFESSIONAL: [
    FEATURES.PATIENT_MANAGEMENT,
    FEATURES.APPOINTMENT_MANAGEMENT,
    FEATURES.DAILY_INCOME,
    FEATURES.BASIC_REPORT,
    FEATURES.MEDICAL_RECORDS,
    FEATURES.MONTHLY_REPORTS,
    FEATURES.MULTI_USER,
    FEATURES.ROLE_PERMISSIONS,
    FEATURES.FILE_UPLOAD,
    FEATURES.ONLINE_BOOKING,
    FEATURES.EXPORT_REPORTS,
  ],
  PREMIUM: [
    FEATURES.PATIENT_MANAGEMENT,
    FEATURES.APPOINTMENT_MANAGEMENT,
    FEATURES.DAILY_INCOME,
    FEATURES.BASIC_REPORT,
    FEATURES.MEDICAL_RECORDS,
    FEATURES.MONTHLY_REPORTS,
    FEATURES.MULTI_USER,
    FEATURES.ROLE_PERMISSIONS,
    FEATURES.FILE_UPLOAD,
    FEATURES.ONLINE_BOOKING,
    FEATURES.EXPORT_REPORTS,
    FEATURES.EXPENSES,
    FEATURES.PROFIT_LOSS,
    FEATURES.AUTO_BACKUP,
    FEATURES.CUSTOMIZATION,
    FEATURES.PREMIUM_SUPPORT,
    FEATURES.LANDING_PAGE,
    FEATURES.ADVANCED_STATS,
  ],
}
```
