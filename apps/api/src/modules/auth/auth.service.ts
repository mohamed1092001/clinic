import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: {
    clinicName: string
    adminName: string
    email: string
    phone: string
    password: string
  }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل')

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const clinic = await this.prisma.clinic.create({
      data: {
        nameArabic: data.clinicName,
        slug: data.clinicName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        phone: data.phone,
        address: '',
        isTrial: true,
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        subscriptionTier: 'PROFESSIONAL',
        subscriptionStatus: 'TRIAL',
        users: {
          create: {
            name: data.adminName,
            email: data.email,
            phone: data.phone,
            passwordHash: hashedPassword,
            role: 'ADMIN',
          },
        },
      },
      include: { users: true },
    })

    const tokens = this.generateTokens(clinic.users[0])
    return { clinic, user: clinic.users[0], ...tokens }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { clinic: true },
    })

    if (!user) throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    if (!user.isActive) throw new UnauthorizedException('الحساب غير نشط')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة')

    if (user.loginAttempts >= 5 && user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('الحساب مقفل مؤقتاً، حاول بعد 15 دقيقة')
    }

    // Reset login attempts
    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lastLoginAt: new Date() },
    })

    const tokens = this.generateTokens(user)
    return { user, clinic: user.clinic, ...tokens }
  }

  private generateTokens(user: { id: string; role: string; clinicId: string }) {
    const payload = { sub: user.id, role: user.role, clinicId: user.clinicId }

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
      if (!user) throw new UnauthorizedException('مستخدم غير موجود')

      return this.generateTokens(user)
    } catch {
      throw new UnauthorizedException('Token غير صالح أو منتهي الصلاحية')
    }
  }
}
