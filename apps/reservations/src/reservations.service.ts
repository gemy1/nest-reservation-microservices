import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Model } from 'mongoose';
import { Reservation } from './models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private model: Model<Reservation>,
  ) {}
  async create(createReservationDto: CreateReservationDto) {
    const reservation = this.model.create({
      ...createReservationDto,
      timestamp: new Date(),
    });

    return (await reservation).save();
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
