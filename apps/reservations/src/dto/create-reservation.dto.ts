import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsString()
  userId: string;

  @IsString()
  placeId: string;

  @IsString()
  invoiceId: string;
}
