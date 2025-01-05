import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ versionKey: false })
export class Reservation {
  @Prop()
  timestamp: Date;
  @Prop()
  endDate: Date;
  @Prop()
  startDate: Date;
  @Prop()
  userId: string;
  @Prop()
  placeId: string;
  @Prop()
  invoiceId: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
