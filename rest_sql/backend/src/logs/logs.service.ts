import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLogInput } from './dto/create-log.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log) private readonly logsRepo: Repository<Log>,
  ) {}

  create(createLogInput: CreateLogInput) {
    const newLog = this.logsRepo.create(createLogInput);
    return this.logsRepo.save(newLog);
  }

  async findAll() {
    return await this.logsRepo.find();
  }

  async findLastEventByTripId(tripId: string) {
    const event_logs = await this.logsRepo.find({
      where: { tripId },
      order: { created_at: 'DESC' },
    });
    if (event_logs.length > 0) {
      return event_logs[0];
    }
  }

  async findOne(id: string) {
    const log = await this.logsRepo.findOne({ where: { _id: id } });
    if (!log) {
      throw new NotFoundException(`Log with ID: ${id} not found!`);
    }
    return log;
  }

  async findByTripId(tripId: string) {
    const logs = await this.logsRepo.find({
      where: { tripId },
      relations: ['event'],
      order: { created_at: 'DESC' },
    });
    if (!logs)
      throw new NotFoundException(`Events with trip ID: ${tripId} not found`);
    return logs;
  }

  async findByEventId(eventId: string) {
    const logs = await this.logsRepo.find({ where: { eventId } });
    if (!logs)
      throw new NotFoundException(`Logs with event ID: ${eventId}  not found`);
    return logs;
  }

  // async findTripsByEventId(eventId: string) {
  //   const logs_with_trips = await this.logsRepo.find({
  //     where: { eventId },
  //     relations: ['trip'],
  //   });
  //   const trips = [];
  //   logs_with_trips.map((log) => trips.push(log.trip));

  //   return trips;
  // }

  // async findEventsByTriptId(tripId: string) {
  //   const logs_with_trips = await this.logsRepo.find({
  //     where: { tripId },
  //     relations: ['event'],
  //   });
  //   const trips = [];
  //   logs_with_trips.map((log) => trips.push(log.event));

  //   return trips;
  // }
}
