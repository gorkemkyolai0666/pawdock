import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { page?: number; search?: string }) {
    const take = 20;
    const skip = ((filters.page || 1) - 1) * take;
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.owner.findMany({
        where,
        include: { pets: { select: { id: true, name: true, species: true } } },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.owner.count({ where }),
    ]);

    return { data, total, page: filters.page || 1, totalPages: Math.ceil(total / take) };
  }

  async create(dto: CreateOwnerDto) {
    return this.prisma.owner.create({ data: dto });
  }

  async update(id: string, dto: UpdateOwnerDto) {
    const owner = await this.prisma.owner.findUnique({ where: { id } });
    if (!owner) throw new NotFoundException('Sahip bulunamadı');
    return this.prisma.owner.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const owner = await this.prisma.owner.findUnique({ where: { id } });
    if (!owner) throw new NotFoundException('Sahip bulunamadı');
    await this.prisma.owner.delete({ where: { id } });
    return { deleted: true };
  }
}
