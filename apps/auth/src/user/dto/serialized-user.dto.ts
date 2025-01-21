import { Expose } from 'class-transformer';

export class SerializedUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;
}
