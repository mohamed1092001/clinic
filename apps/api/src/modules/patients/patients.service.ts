import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreatePatientDto } from './dto/create-patient.dto'

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(clinicId: string, dto: CreatePatientDto) {
    // Auto-generate file number for this clinic
    const lastPatient = await this.prisma.patient.findFirst({
      where: { clinicId },
      orderBy: { fileNumber: 'desc' },
      select: { fileNumber: true },
    })
    const fileNumber = (lastPatient?.fileNumber || 0) + 1

    return this.prisma.patient.create({
      data: {
        clinicId,
        fileNumber,
        ...dto,
      },
    })
  }

  async findAll(clinicId: string, query: { search?: string; page?: number; limit?: number }) {
    const page = query.page || 1
    const limit = query.limit || 20
    const skip = (page - 1) * limit

    const where: any = { clinicId }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search } },
        ...(isNaN(Number(query.search)) ? [] : [{ fileNumber: Number(query.search) }]),
      ]
    }

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { appointments: true } } },
      }),
      this.prisma.patient.count({ where }),
    ])

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  async findOne(clinicId: string, id: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, clinicId },
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          take: 10,
          include: { doctor: { select: { name: true } } },
        },
        _count: { select: { appointments: true, invoices: true } },
      },
    })

    if (!patient) throw new NotFoundException('المريض غير موجود')
    return patient
  }

  async update(clinicId: string, id: string, dto: Partial<CreatePatientDto>) {
    const patient = await this.prisma.patient.findFirst({ where: { id, clinicId } })
    if (!patient) throw new NotFoundException('المريض غير موجود')

    return this.prisma.patient.update({ where: { id }, data: dto })
  }

  async remove(clinicId: string, id: string) {
    const patient = await this.prisma.patient.findFirst({ where: { id, clinicId } })
    if (!patient) throw new NotFoundException('المريض غير موجود')

    // Soft delete or actually delete (we'll use soft delete)
    return this.prisma.patient.delete({ where: { id } })
  }
}
