import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CareLogsService } from './care-logs.service';
import { CreateCareLogDto } from './dto/create-care-log.dto';
import { UpdateCareLogDto } from './dto/update-care-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('care-logs')
export class CareLogsController {
  constructor(private readonly careLogsService: CareLogsService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('petId') petId?: string,
    @Query('careType') careType?: string,
  ) {
    return this.careLogsService.findAll(req.user.facilityId, {
      page: page ? parseInt(page) : undefined,
      petId,
      careType,
    });
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateCareLogDto) {
    return this.careLogsService.create(req.user.facilityId, dto);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateCareLogDto) {
    return this.careLogsService.update(req.user.facilityId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.careLogsService.remove(req.user.facilityId, id);
  }
}
