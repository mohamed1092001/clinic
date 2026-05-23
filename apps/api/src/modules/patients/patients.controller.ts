import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { PatientsService } from './patients.service'
import { CreatePatientDto } from './dto/create-patient.dto'
import { CurrentUser, JwtUser } from '../../common/decorators/current-user.decorator'

@Controller('patients')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreatePatientDto) {
    return this.patientsService.create(user.clinicId, dto)
  }

  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.patientsService.findAll(user.clinicId, {
      search,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    })
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.patientsService.findOne(user.clinicId, id)
  }

  @Patch(':id')
  update(@CurrentUser() user: JwtUser, @Param('id') id: string, @Body() dto: Partial<CreatePatientDto>) {
    return this.patientsService.update(user.clinicId, id, dto)
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.patientsService.remove(user.clinicId, id)
  }
}
