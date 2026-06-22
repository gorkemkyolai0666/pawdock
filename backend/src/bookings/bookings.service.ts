import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(facilityId: string, filters: { page?: number; status?: string }) {
    const take = 20;
    const skip = ((filters.page || 1) - 1) * take;
    const where: any = { facilityId };
    if (filters.status) where.status = filters.status;

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          pet: { select: { name: true, species: true, breed: true, owner: { select: { firstName: true, lastName: true, phone: true } } } },
          room: { select: { name: true, roomType: true } },
        },
        orderBy: { checkIn: 'desc' },
        take,
        skip,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { data, total, page: filters.page || 1, totalPages: Math.ceil(total / take) };
  }

  async create(facilityId: string, dto: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        petId: dto.petId,
        roomId: dto.roomId,
        totalPrice: dto.totalPrice,
        notes: dto.notes,
        facilityId,
        checkIn: new Date(dto.checkIn),
        checkOut: new Date(dto.checkOut),
      },
    });
  }

  async update(facilityId: string, id: string, dto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findFirst({ where: { id, facilityId } });
    if (!booking) throw new NotFoundException('Rezervasyon bulunamadı');
    return this.prisma.booking.update({
      where: { id },
      data: {
        ...dto,
        checkIn: dto.checkIn ? new Date(dto.checkIn) : undefined,
        checkOut: dto.checkOut ? new Date(dto.checkOut) : undefined,
      },
    });
  }

  async remove(facilityId: string, id: string) {
    const booking = await this.prisma.booking.findFirst({ where: { id, facilityId } });
    if (!booking) throw new NotFoundException('Rezervasyon bulunamadı');
    await this.prisma.booking.delete({ where: { id } });
    return { deleted: true };
  }
}
