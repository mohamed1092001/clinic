import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { CurrentUser, JwtUser } from '../../common/decorators/current-user.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { UserRole } from '@clinic/shared'

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  create(@CurrentUser() user: JwtUser, @Body() dto: any) {
    return this.appointmentsService.create(user.clinicId, user.sub, dto)
  }

  @Get('calendar')
  getCalendar(
    @CurrentUser() user: JwtUser,
    @Query('date') date?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.appointmentsService.getCalendar(user.clinicId, { date, doctorId })
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.appointmentsService.updateStatus(user.clinicId, id, status)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  remove(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.appointmentsService.delete(user.clinicId, id)
  }
}
