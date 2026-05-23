import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(clinicId: string, createdById: string, dto: {
    patientId: string
    doctorId: string
    date: string
    startTime: string
    endTime: string
    fee?: number
    notes?: string
  }) {
    const start = new Date(dto.startTime)
    const end = new Date(dto.endTime)
    const date = new Date(dto.date)

    // Prevent double booking
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        clinicId,
        doctorId: dto.doctorId,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        OR: [
          { startTime: { lt: end }, endTime: { gt: start } },
        ],
      },
    })

    if (conflict) {
      throw new BadRequestException('هذا الوقت محجوز بالفعل لهذا الطبيب')
    }

    return this.prisma.appointment.create({
      data: {
        clinicId,
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        createdById,
        date,
        startTime: start,
        endTime: end,
        fee: dto.fee || 0,
        total: dto.fee || 0,
        notes: dto.notes,
      },
      include: {
        patient: { select: { name: true, phone: true, fileNumber: true } },
        doctor: { select: { name: true } },
      },
    })
  }

  async getCalendar(clinicId: string, query: { date?: string; doctorId?: string }) {
    const dateFilter = query.date ? new Date(query.date) : new Date()
    const startOfDay = new Date(dateFilter.setHours(0, 0, 0, 0))
    const endOfDay = new Date(dateFilter.setHours(23, 59, 59, 999))

    const where: any = {
      clinicId,
      date: { gte: startOfDay, lte: endOfDay },
    }
    if (query.doctorId) where.doctorId = query.doctorId

    return this.prisma.appointment.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        patient: { select: { name: true, phone: true, fileNumber: true } },
        doctor: { select: { name: true } },
      },
    })
  }

  async updateStatus(clinicId: string, id: string, status: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, clinicId },
    })
    if (!appointment) throw new NotFoundException('الموعد غير موجود')

    // If completed, auto-generate invoice
    if (status === 'COMPLETED' && appointment.status !== 'COMPLETED') {
      await this.prisma.invoice.create({
        data: {
          clinicId,
          patientId: appointment.patientId,
          appointmentId: appointment.id,
          createdById: appointment.createdById,
          amount: appointment.total,
          paidAmount: 0,
          status: 'PENDING',
        },
      })
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
      include: { patient: { select: { name: true } } },
    })
  }

  async delete(clinicId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, clinicId },
    })
    if (!appointment) throw new NotFoundException('الموعد غير موجود')

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })
  }
}
