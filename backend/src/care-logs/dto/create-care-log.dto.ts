import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { CareType } from '@prisma/client';

export class CreateCareLogDto {
  @IsString()
  petId: string;

  @IsEnum(CareType)
  careType: CareType;

  @IsString()
  description: string;

  @IsString()
  staffName: string;

  @IsOptional()
  @IsDateString()
  logDate?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
