import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async getDailySummary(clinicId: string, date?: string) {
    const day = date ? new Date(date) : new Date()
    const start = new Date(day.setHours(0, 0, 0, 0))
    const end = new Date(day.setHours(23, 59, 59, 999))

    const [invoices, totalAppointments] = await Promise.all([
      this.prisma.invoice.findMany({
        where: {
          clinicId,
          createdAt: { gte: start, lte: end },
          status: { notIn: ['CANCELLED'] },
        },
      }),
      this.prisma.appointment.count({
        where: {
          clinicId,
          date: { gte: start, lte: end },
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        },
      }),
    ])

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
    const pendingAmount = invoices
      .filter(inv => inv.status === 'PENDING' || inv.status === 'PARTIAL')
      .reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0)

    return {
      date: day.toISOString().split('T')[0],
      totalAppointments,
      totalInvoices: invoices.length,
      totalRevenue,
      pendingAmount,
      isClosed: false,
    }
  }

  async closeDay(clinicId: string, userId: string) {
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    const todayEnd = new Date(today.setHours(23, 59, 59, 999))

    const pendingInvoices = await this.prisma.invoice.count({
      where: {
        clinicId,
        createdAt: { gte: todayStart, lte: todayEnd },
        status: { in: ['PENDING', 'PARTIAL'] },
      },
    })

    if (pendingInvoices > 0) {
      throw new BadRequestException(`لا يمكن إقفال اليوم، يوجد ${pendingInvoices} فاتورة غير مدفوعة`)
    }

    await this.prisma.invoice.updateMany({
      where: {
        clinicId,
        createdAt: { gte: todayStart, lte: todayEnd },
        isClosed: false,
      },
      data: { isClosed: true, closedAt: new Date(), closedById: userId },
    })

    return { message: 'تم إقفال اليوم بنجاح', closedAt: new Date() }
  }

  async getInvoices(clinicId: string, query: { page?: number; limit?: number }) {
    const page = query.page || 1
    const limit = query.limit || 20
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { clinicId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          patient: { select: { name: true, fileNumber: true } },
        },
      }),
      this.prisma.invoice.count({ where: { clinicId } }),
    ])

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }
}
