import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('roomType') roomType?: string,
  ) {
    return this.roomsService.findAll(req.user.facilityId, { status, roomType });
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateRoomDto) {
    return this.roomsService.create(req.user.facilityId, dto);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(req.user.facilityId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.roomsService.remove(req.user.facilityId, id);
  }
}
