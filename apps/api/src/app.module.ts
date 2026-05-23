import { Module } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { PatientsModule } from './modules/patients/patients.module'
import { AppointmentsModule } from './modules/appointments/appointments.module'
import { InvoicesModule } from './modules/invoices/invoices.module'
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module'
import { ServicesModule } from './modules/services/services.module'
import { ReportsModule } from './modules/reports/reports.module'
import { ExpensesModule } from './modules/expenses/expenses.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { LandingPageModule } from './modules/landing-page/landing-page.module'

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    AppointmentsModule,
    InvoicesModule,
    MedicalRecordsModule,
    ServicesModule,
    ReportsModule,
    ExpensesModule,
    SubscriptionModule,
    LandingPageModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
