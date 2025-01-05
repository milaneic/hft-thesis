import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { In, Repository } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Log } from 'src/logs/entities/log.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private readonly tripsRepo: Repository<Trip>,
    @InjectRepository(Event) private readonly eventsRepo: Repository<Event>,
  ) {}

  create(createTripInput: CreateTripInput) {
    const newTrip = this.tripsRepo.create(createTripInput);

    return this.tripsRepo.save(newTrip);
  }

  async findAll() {
    const trips = await this.tripsRepo
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.vehicle', 'vehicle')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.orders', 'orders')
      .orderBy('trip.created_at', 'DESC')
      .addOrderBy('orders.created_at', 'ASC')
      .getMany();
    return trips;
  }

  async findActiveTrips() {
    return await this.tripsRepo
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.vehicle', 'vehicle')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.orders', 'orders')
      .where('trip.active = :active', { active: true })
      .orderBy('trip.created_at', 'DESC')
      .addOrderBy('orders.created_at', 'ASC')
      .getMany();
  }

  findOne(id: string) {
    return this.tripsRepo.findOne({
      where: { _id: id },
      relations: ['vehicle', 'driver'],
    });
  }

  async update(id: string, updateTripInput: UpdateTripInput) {
    try {
      const trip = await this.tripsRepo.findOne({ where: { _id: id } });
      if (!trip) throw new NotFoundException(`Trip with ID: ${id} not found!`);

      if (updateTripInput.startOdometar)
        trip.startOdometar = updateTripInput.startOdometar;
      if (updateTripInput.finishOdometar)
        trip.finishOdometar = updateTripInput.finishOdometar;
      if (updateTripInput.driverId) trip.driverId = updateTripInput.driverId;
      if (updateTripInput.vehicleId) trip.vehicleId = updateTripInput.vehicleId;
      trip.active = updateTripInput.active;

      return this.tripsRepo.save(trip);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured.');
    }
  }

  findByVehicleId(vehicleId: string) {
    return this.tripsRepo.find({
      where: { vehicleId },
      order: { created_at: 'DESC' },
    });
  }

  findByDriverId(driverId: string) {
    return this.tripsRepo.find({
      where: { driverId },
      order: { created_at: 'DESC' },
    });
  }

  // Add events to a trip (many-to-many relation)
  async addEventsToTrip(tripId: string, eventIds: string[]) {
    const trip = await this.tripsRepo.findOne({
      where: { _id: tripId },
      relations: ['events'],
    });

    const events = await this.eventsRepo.find({
      where: { _id: In(eventIds) },
      relations: ['trips'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    trip.event_logs = [...trip.event_logs];

    trip.event_logs = [
      ...(trip.event_logs as unknown as Log[]),
      ...(events as unknown as Log[]),
    ];
    return this.tripsRepo.save(trip);
  }
}
