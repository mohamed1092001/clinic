import { Controller, Get, Post, Query, Body } from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { CurrentUser, JwtUser } from '../../common/decorators/current-user.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { UserRole } from '../../common/types'

@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.invoicesService.getInvoices(user.clinicId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    })
  }

  @Get('daily-summary')
  getDailySummary(@CurrentUser() user: JwtUser, @Query('date') date?: string) {
    return this.invoicesService.getDailySummary(user.clinicId, date)
  }

  @Post('close-day')
  @Roles(UserRole.ADMIN)
  closeDay(@CurrentUser() user: JwtUser) {
    return this.invoicesService.closeDay(user.clinicId, user.sub)
  }
}
