import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FEATURE_KEY } from '../decorators/feature.decorator'
import { PLAN_FEATURES, Tier } from '../types'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature = this.reflector.getAllAndOverride<string>(FEATURE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredFeature) return true

    const { user } = context.switchToHttp().getRequest()
    if (!user) throw new ForbiddenException('غير مصرح بالوصول')

    const clinic = await this.prisma.clinic.findUnique({
      where: { id: user.clinicId },
      select: { subscriptionTier: true, isTrial: true },
    })

    const tier = clinic?.isTrial ? Tier.PROFESSIONAL : (clinic?.subscriptionTier || Tier.STARTER)
    const allowedFeatures = PLAN_FEATURES[tier]

    if (!allowedFeatures.includes(requiredFeature)) {
      throw new ForbiddenException('هذه الميزة غير متاحة في باقتك الحالية')
    }

    return true
  }
}
