import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Model } from 'mongoose';
import { Reservation } from './models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'apps/auth/src/user/models/user.schema';
import { PAYMENT_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private model: Model<Reservation>,
    @Inject(PAYMENT_SERVICE) private paymentClint: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, user: UserDocument) {
    const { price, placeName, currency } = createReservationDto;

    return this.paymentClint
      .send(
        {
          cmd: 'create_payment_session',
        },
        {
          items: [{ name: placeName, price: price, quantity: '1', currency }],
        },
      )
      .pipe(
        map(async (res) => {
          const reservation = new this.model({
            ...createReservationDto,
            userId: user._id,
            timestamp: new Date(),
          });

          const createdReserve = await reservation.save();

          return { reservation: createdReserve, paymentUrl: res };
        }),
      );
  }

  async findAll() {
    return await this.model.find();
  }

  async findOne(id: string) {
    const reservation = await this.model.findById(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const updateReservation = await this.model.findByIdAndUpdate(
      id,
      updateReservationDto,
      { new: true },
    );
    if (!updateReservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return updateReservation;
  }

  async remove(id: string) {
    const deletedDocs = await this.model.findByIdAndDelete(id);
    if (!deletedDocs) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return deletedDocs;
  }
}
