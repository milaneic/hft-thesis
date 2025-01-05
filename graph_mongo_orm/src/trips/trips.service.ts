import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { In, MongoRepository, Repository } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';
import { ObjectId } from 'mongodb';
import { Log } from 'src/logs/entities/log.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private readonly tripsRepo: MongoRepository<Trip>,
    @InjectRepository(Event) private readonly eventsRepo: Repository<Event>,
  ) {}

  create(createTripInput: CreateTripInput) {
    const newTrip = this.tripsRepo.create(createTripInput);
    return this.tripsRepo.save(newTrip);
  }

  async findAll() {
    return await this.tripsRepo.find({ order: { created_at: 'DESC' } });
  }

  async findByIds(ids: ObjectId[]) {
    return this.tripsRepo.find({
      where: {
        _id: { $in: ids },
      },
    });
  }

  async findByDriverIds(ids: string[]) {
    return await this.tripsRepo.find({
      where: {
        driverId: { $in: ids },
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findActive() {
    return await this.tripsRepo.find({
      where: { active: true },
      order: { created_at: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.tripsRepo.findOne({ where: { _id: new ObjectId(id) } });
  }

  async update(id: string, updateTripInput: UpdateTripInput) {
    try {
      const trip = await this.tripsRepo.findOne({
        where: { _id: new ObjectId(id) },
      });
      if (!trip) throw new NotFoundException(`Trip with ID: ${id} not found!`);

      if (updateTripInput.startOdometar)
        trip.startOdometar = updateTripInput.startOdometar;

      if (updateTripInput.finishOdometar)
        trip.finishOdometar = updateTripInput.finishOdometar;

      if (updateTripInput.vehicleId) trip.vehicleId = updateTripInput.vehicleId;
      if (updateTripInput.driverId) trip.driverId = updateTripInput.driverId;

      trip.active = updateTripInput.active;

      return this.tripsRepo.save(trip);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured.');
    }
  }

  remove(id: string) {
    try {
      const trip = this.tripsRepo.findOne({ where: { _id: new ObjectId(id) } });
      if (!trip) throw new NotFoundException(`Trip with ID: ${id} not found!`);

      this.tripsRepo.delete(id);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured.');
    }
  }

  findByVehicleId(vehicleId: string) {
    return this.tripsRepo.find({ where: { vehicleId } });
  }

  findByDriverId(driverId: string) {
    return this.tripsRepo.find({ where: { driverId } });
  }

  // Add events to a trip (many-to-many relation)
  async addEventsToTrip(tripId: string, eventIds: string[]) {
    const trip = await this.tripsRepo.findOne({
      where: { _id: new ObjectId(tripId) },
      relations: ['events'],
    });

    const array_of_objectIds = [];
    for (const id of eventIds) array_of_objectIds.push(new ObjectId(id));

    const events = await this.eventsRepo.find({
      where: { _id: In(array_of_objectIds) },
      relations: ['trips'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    trip.event_logs = [...trip.event_logs];

    trip.event_logs = [
      ...(trip.event_logs as unknown as Log[]),
      ...(events as unknown as Log[]),
    ]; // Merge existing and new events
    return this.tripsRepo.save(trip);
  }
}
