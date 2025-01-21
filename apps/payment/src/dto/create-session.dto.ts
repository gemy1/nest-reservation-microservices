import { Type } from 'class-transformer';
import { ItemDto } from './item.dto';

export class CreateSessionDto {
  @Type(() => ItemDto)
  items: ItemDto[];
}
