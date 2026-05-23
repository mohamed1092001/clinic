# نظام الصلاحيات والأمان (RBAC + Security)

## 1. مصفوفة الصلاحيات

| الإجراء | Admin | Doctor | Receptionist | Accountant |
|---------|-------|--------|--------------|------------|
| **المرضى** | | | | |
| عرض قائمة المرضى | ✅ | ✅ | ✅ | ❌ |
| إنشاء مريض | ✅ | ❌ | ✅ | ❌ |
| تعديل بيانات مريض | ✅ | ✅ | ✅ | ❌ |
| حذف مريض | ✅ | ❌ | ❌ | ❌ |
| عرض السجل الطبي | ✅ | ✅ | ❌ | ❌ |
| إضافة سجل طبي | ✅ | ✅ | ❌ | ❌ |
| تصدير ملف مريض | ✅ | ✅ | ✅ | ❌ |
| **المواعيد** | | | | |
| عرض التقويم | ✅ | ✅ | ✅ | ❌ |
| إنشاء موعد | ✅ | ❌ | ✅ | ❌ |
| تعديل موعد | ✅ | ❌ | ✅ | ❌ |
| إلغاء موعد | ✅ | ❌ | ✅ | ❌ |
| تغيير حالة الموعد | ✅ | ✅ | ✅ | ❌ |
| **الفواتير** | | | | |
| عرض الفواتير | ✅ | ❌ | ✅ | ✅ |
| إنشاء فاتورة | ✅ | ❌ | ✅ | ✅ |
| تسجيل دفع | ✅ | ❌ | ✅ | ✅ |
| طباعة إيصال | ✅ | ❌ | ✅ | ✅ |
| إقفال اليومية | ✅ | ❌ | ❌ | ❌ |
| تعديل فاتورة مقفلة | ✅ | ❌ | ❌ | ❌ |
| **المصروفات** | | | | |
| عرض المصروفات | ✅ | ❌ | ❌ | ✅ |
| إضافة مصروف | ✅ | ❌ | ❌ | ✅ |
| تعديل مصروف | ✅ | ❌ | ❌ | ✅ |
| **التقارير** | | | | |
| تقرير يومي | ✅ | ✅ | ✅ | ✅ |
| تقرير شهري | ✅ | ✅ | ❌ | ✅ |
| أرباح وخسائر | ✅ | ❌ | ❌ | ✅ |
| أداء الأطباء | ✅ | ✅ | ❌ | ❌ |
| تصدير تقارير | ✅ | ✅ | ❌ | ✅ |
| **الإدارة** | | | | |
| إدارة المستخدمين | ✅ | ❌ | ❌ | ❌ |
| إعدادات العيادة | ✅ | ❌ | ❌ | ❌ |
| إدارة الاشتراك | ✅ | ❌ | ❌ | ❌ |
| عرض سجل التدقيق | ✅ | ❌ | ❌ | ❌ |

## 2. قيود حسب الباقة (Feature-Based Access)

```typescript
// يتم التحقق في طبقتين:
// 1. Frontend: إخفاء العناصر غير المتاحة
// 2. Backend: التحقق من الباقة في الـ Guard

async function checkFeatureAccess(clinicId: string, feature: string): boolean {
  const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } })
  
  if (clinic.isTrial) {
    // Trial = Professional features but limited patients (20 max)
    return PLAN_FEATURES[TIER.PROFESSIONAL].includes(feature)
  }
  
  return PLAN_FEATURES[clinic.subscriptionTier].includes(feature)
}
```

## 3. أمان API

### JWT Structure
```json
{
  "sub": "user_id",
  "clinicId": "clinic_id",
  "role": "ADMIN",
  "tier": "PROFESSIONAL",
  "iat": 1700000000,
  "exp": 1700086400
}
```

### Middleware Chain
```
Request
  → Rate Limiter (100 req/min per clinic)
  → JWT Validation
  → Clinic Active Check
  → Feature Access Guard
  → Role Guard
  → Controller
```

### Audit Logging (تلقائي)
```
CREATE → يسجل من أنشأ ومتى
UPDATE → يسجل القيم القديمة والجديدة
DELETE → يسجل من حذف ومتى (soft delete)
LOGIN  → يسجل IP + User Agent + وقت
```

## 4. إجراءات أمنية إضافية

- **Rate Limiting**: 5 محاولات login خاطئة = قفل 15 دقيقة
- **Session Management**: Token refresh كل ساعة، انتهاء تلقائي بعد 24 ساعة عدم نشاط
- **Password Policy**: 8 أحرف كحد أدنى، حرف كبير + رقم
- **2FA**: اختياري، عبر Google Authenticator
- **Data Encryption**:敏感 البيانات (الأسماء والهواتف) مشفرة عند الراحة
- **CORS**: مقيد بدومينات العيادات فقط
- **SQL Injection**: Prisma ORM يمنعها تلقائياً
- **XSS**: Next.js و React يمنعانها بشكل افتراضي
- **CSRF**: SameSite cookies + CSRF tokens
