import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { PetSize, Species } from '@prisma/client';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsEnum(Species)
  species: Species;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsEnum(PetSize)
  size?: PetSize;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  microchipId?: string;

  @IsOptional()
  @IsBoolean()
  vaccinated?: boolean;

  @IsOptional()
  @IsBoolean()
  neutered?: boolean;

  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @IsOptional()
  @IsString()
  dietaryNotes?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  ownerId: string;
}
