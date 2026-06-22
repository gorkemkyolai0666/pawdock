import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { RoomType } from '@prisma/client';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(RoomType)
  roomType?: RoomType;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsNumber()
  dailyRate?: number;

  @IsOptional()
  @IsNumber()
  floor?: number;

  @IsOptional()
  @IsBoolean()
  hasCamera?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
