# نظام إدارة العيادات الطبية (Clinic Management System)

>SaaS | Multi-tenant | عربي بالكامل

## التقنيات

| الطبقة | التقنية |
|--------|---------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | NestJS + Prisma + PostgreSQL |
| Cache | Redis |
| Auth | JWT + Role-Based Access Control |
| Payments | Fawry / InstaPay / Vodafone Cash |

## هيكل المشروع

```
├── apps/
│   ├── api/         # NestJS Backend
│   └── web/         # Next.js Frontend
├── packages/
│   └── shared/      # الأنواع والثوابت المشتركة
├── docker/          # Docker compose + Dockerfiles
└── docs/            # وثائق التصميم
```

## الباقات

| الباقة | السعر | المميزات |
|--------|-------|----------|
| Starter | 500 ج.م | أساسيات: مرضى، مواعيد، دخل يومي |
| Professional | 900-1,200 ج.م | سجل طبي، مستخدمين، تقارير، حجوزات أونلاين |
| Premium | 1,800-2,200 ج.م | مصروفات، تخصيص، نسخ احتياطي، Landing Page |

## التشغيل المحلي

```bash
# 1. تشغيل قاعدة البيانات
cd docker
docker-compose up -d postgres redis

# 2. تثبيت الاعتماديات
cd ..
pnpm install

# 3. ترحيل قاعدة البيانات
pnpm db:migrate

# 4. تشغيل المشروع
pnpm dev
```

## الوثائق

جميع وثائق التصميم موجودة في مجلد `docs/`:

- `01-architecture.md` - التصميم المعماري
- `02-database-schema.md` - تصميم قاعدة البيانات
- `03-api-design.md` - تصميم واجهات API
- `04-project-structure.md` - هيكل المشروع
- `05-rbac-and-security.md` - الصلاحيات والأمان
- `06-mvp-roadmap.md` - خارطة الطريق
