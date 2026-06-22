import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(facilityId: string, filters: { status?: string; roomType?: string }) {
    const where: any = { facilityId };
    if (filters.status) where.status = filters.status;
    if (filters.roomType) where.roomType = filters.roomType;

    const data = await this.prisma.room.findMany({
      where,
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    });

    return { data, total: data.length };
  }

  async create(facilityId: string, dto: CreateRoomDto) {
    return this.prisma.room.create({ data: { ...dto, facilityId } });
  }

  async update(facilityId: string, id: string, dto: UpdateRoomDto) {
    const room = await this.prisma.room.findFirst({ where: { id, facilityId } });
    if (!room) throw new NotFoundException('Oda bulunamadı');
    return this.prisma.room.update({ where: { id }, data: dto });
  }

  async remove(facilityId: string, id: string) {
    const room = await this.prisma.room.findFirst({ where: { id, facilityId } });
    if (!room) throw new NotFoundException('Oda bulunamadı');
    await this.prisma.room.delete({ where: { id } });
    return { deleted: true };
  }
}
