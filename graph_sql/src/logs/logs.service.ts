import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLogInput } from './dto/create-log.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log) private readonly logsRepo: Repository<Log>,
  ) {}

  create(createLogInput: CreateLogInput) {
    const newLog = this.logsRepo.create(createLogInput);
    return this.logsRepo.save(newLog);
  }

  findAll() {
    return this.logsRepo.find();
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
      order: { created_at: 'ASC' },
    });
    if (!logs)
      throw new NotFoundException(`Logs with trip ID: ${tripId}  not found!`);
    return logs;
  }

  async findByTripIds(ids: string[]) {
    return await this.logsRepo.find({
      where: { tripId: In(ids) },
      order: { created_at: 'ASC' },
    });
  }

  async findByEventId(eventId: string) {
    const logs = await this.logsRepo.find({ where: { eventId } });
    if (!logs)
      throw new NotFoundException(`Logs with event ID: ${eventId}  not found!`);
    return logs;
  }
}
