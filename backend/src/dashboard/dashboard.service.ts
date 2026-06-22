import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(facilityId: string) {
    const [
      totalPets,
      totalOwners,
      totalRooms,
      availableRooms,
      totalBookings,
      activeBookings,
      totalCareLogs,
      totalRevenue,
      recentBookings,
      recentCareLogs,
    ] = await Promise.all([
      this.prisma.pet.count({ where: { facilityId } }),
      this.prisma.owner.count(),
      this.prisma.room.count({ where: { facilityId } }),
      this.prisma.room.count({ where: { facilityId, status: 'available' } }),
      this.prisma.booking.count({ where: { facilityId } }),
      this.prisma.booking.count({ where: { facilityId, status: { in: ['checked_in', 'confirmed'] } } }),
      this.prisma.careLog.count({ where: { facilityId } }),
      this.prisma.booking.aggregate({ where: { facilityId }, _sum: { totalPrice: true } }),
      this.prisma.booking.findMany({
        where: { facilityId },
        include: { pet: { select: { name: true, species: true } }, room: { select: { name: true } } },
        orderBy: { checkIn: 'desc' },
        take: 5,
      }),
      this.prisma.careLog.findMany({
        where: { facilityId },
        include: { pet: { select: { name: true, species: true } } },
        orderBy: { logDate: 'desc' },
        take: 5,
      }),
    ]);

    return {
      totalPets,
      totalOwners,
      totalRooms,
      availableRooms,
      totalBookings,
      activeBookings,
      totalCareLogs,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentBookings,
      recentCareLogs,
    };
  }
}
