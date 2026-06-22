import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCareLogDto } from './dto/create-care-log.dto';
import { UpdateCareLogDto } from './dto/update-care-log.dto';

@Injectable()
export class CareLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(facilityId: string, filters: { page?: number; petId?: string; careType?: string }) {
    const take = 20;
    const skip = ((filters.page || 1) - 1) * take;
    const where: any = { facilityId };
    if (filters.petId) where.petId = filters.petId;
    if (filters.careType) where.careType = filters.careType;

    const [data, total] = await Promise.all([
      this.prisma.careLog.findMany({
        where,
        include: { pet: { select: { name: true, species: true } } },
        orderBy: { logDate: 'desc' },
        take,
        skip,
      }),
      this.prisma.careLog.count({ where }),
    ]);

    return { data, total, page: filters.page || 1, totalPages: Math.ceil(total / take) };
  }

  async create(facilityId: string, dto: CreateCareLogDto) {
    return this.prisma.careLog.create({
      data: {
        petId: dto.petId,
        careType: dto.careType,
        description: dto.description,
        staffName: dto.staffName,
        duration: dto.duration,
        notes: dto.notes,
        facilityId,
        logDate: dto.logDate ? new Date(dto.logDate) : undefined,
      },
    });
  }

  async update(facilityId: string, id: string, dto: UpdateCareLogDto) {
    const log = await this.prisma.careLog.findFirst({ where: { id, facilityId } });
    if (!log) throw new NotFoundException('Bakım kaydı bulunamadı');
    return this.prisma.careLog.update({
      where: { id },
      data: {
        ...dto,
        logDate: dto.logDate ? new Date(dto.logDate) : undefined,
      },
    });
  }

  async remove(facilityId: string, id: string) {
    const log = await this.prisma.careLog.findFirst({ where: { id, facilityId } });
    if (!log) throw new NotFoundException('Bakım kaydı bulunamadı');
    await this.prisma.careLog.delete({ where: { id } });
    return { deleted: true };
  }
}
