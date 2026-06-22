import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(facilityId: string, filters: { page?: number; species?: string }) {
    const take = 20;
    const skip = ((filters.page || 1) - 1) * take;
    const where: any = { facilityId };
    if (filters.species) where.species = filters.species;

    const [data, total] = await Promise.all([
      this.prisma.pet.findMany({
        where,
        include: { owner: { select: { firstName: true, lastName: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.pet.count({ where }),
    ]);

    return { data, total, page: filters.page || 1, totalPages: Math.ceil(total / take) };
  }

  async create(facilityId: string, dto: CreatePetDto) {
    return this.prisma.pet.create({ data: { ...dto, facilityId } });
  }

  async update(facilityId: string, id: string, dto: UpdatePetDto) {
    const pet = await this.prisma.pet.findFirst({ where: { id, facilityId } });
    if (!pet) throw new NotFoundException('Hayvan bulunamadı');
    return this.prisma.pet.update({ where: { id }, data: dto });
  }

  async remove(facilityId: string, id: string) {
    const pet = await this.prisma.pet.findFirst({ where: { id, facilityId } });
    if (!pet) throw new NotFoundException('Hayvan bulunamadı');
    await this.prisma.pet.delete({ where: { id } });
    return { deleted: true };
  }
}
