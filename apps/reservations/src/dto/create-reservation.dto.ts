import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsString()
  placeId: string;

  @IsString()
  placeName: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;
}
