import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLogInput } from './dto/create-log.input';
import { UpdateLogInput } from './dto/update-log.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log) private readonly logsRepo: MongoRepository<Log>,
  ) {}

  create(createLogInput: CreateLogInput) {
    const newLog = this.logsRepo.create(createLogInput);
    return this.logsRepo.save(newLog);
  }

  async findAll() {
    return await this.logsRepo.find();
  }

  async findOne(tripId: string, eventId: string) {
    try {
      const log = await this.logsRepo.findOne({
        where: { tripId: tripId, eventId: eventId },
      });
      if (!log)
        throw new NotFoundException(
          `Log with IDs: ${tripId} and ${eventId} not found!`,
        );
      return log;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected errro occured');
    }
  }

  async findByTripId(tripId: string) {
    try {
      const logs = await this.logsRepo.find({
        where: { tripId },
        order: { created_at: 'ASC' },
      });
      if (!logs)
        throw new NotFoundException(`Logs with IDs: ${tripId}  not found!`);
      return logs;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected errro occured');
    }
  }

  async findByTripIds(ids: string[]) {
    return await this.logsRepo.find({
      where: { tripId: { $in: ids } },
      order: { created_at: 'ASC' },
    });
  }

  async findByEventId(eventId: string) {
    try {
      const logs = await this.logsRepo.find({
        where: { eventId },
      });
      if (!logs)
        throw new NotFoundException(`Logs with IDs: ${eventId}  not found!`);
      return logs;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected errro occured');
    }
  }

  async update(
    tripId: string,
    eventId: string,
    updateLogInput: UpdateLogInput,
  ) {
    try {
      const log = await this.logsRepo.findOne({
        where: { tripId, eventId },
      });
      if (!log)
        throw new NotFoundException(
          `Log with IDs: ${tripId} and ${eventId} not found!`,
        );

      if (updateLogInput.description)
        log.description = updateLogInput.description;

      return this.logsRepo.save(log);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected errro occured');
    }
  }

  async remove(tripId: string, eventId: string) {
    const res = await this.logsRepo.delete({
      tripId,
      eventId,
    });
    return res.affected > 0;
  }

  async findTripsByEventId(eventId: string) {
    const logs_with_trips = await this.logsRepo.find({
      where: { eventId },
      relations: ['trip'],
    });
    const trips = [];
    logs_with_trips.map((log) => trips.push(log.trip));

    return trips;
  }

  async findEventsByTriptId(tripId: string) {
    const logs_with_trips = await this.logsRepo.find({
      where: { tripId },
      relations: ['event'],
    });
    const trips = [];
    logs_with_trips.map((log) => trips.push(log.event));

    return trips;
  }
}
