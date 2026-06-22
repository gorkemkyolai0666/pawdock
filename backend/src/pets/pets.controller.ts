import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('species') species?: string,
  ) {
    return this.petsService.findAll(req.user.facilityId, {
      page: page ? parseInt(page) : undefined,
      species,
    });
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreatePetDto) {
    return this.petsService.create(req.user.facilityId, dto);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petsService.update(req.user.facilityId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.petsService.remove(req.user.facilityId, id);
  }
}
