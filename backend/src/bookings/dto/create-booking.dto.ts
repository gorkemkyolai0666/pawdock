import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  petId: string;

  @IsString()
  roomId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
