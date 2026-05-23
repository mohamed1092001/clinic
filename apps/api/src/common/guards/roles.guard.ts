import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { ROLES_HIERARCHY } from '../types'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles || requiredRoles.length === 0) return true

    const { user } = context.switchToHttp().getRequest()
    if (!user) throw new ForbiddenException('غير مصرح بالوصول')

    const userLevel = ROLES_HIERARCHY[user.role] || 0
    const requiredLevel = Math.max(...requiredRoles.map(r => ROLES_HIERARCHY[r] || 0))

    if (userLevel < requiredLevel) {
      throw new ForbiddenException('صلاحياتك لا تسمح بهذا الإجراء')
    }

    return true
  }
}
