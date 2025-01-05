import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { In, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventsRepo: Repository<Event>,
  ) {}

  create(createEventInput: CreateEventInput) {
    const newEvent = this.eventsRepo.create(createEventInput);
    return this.eventsRepo.save(newEvent);
  }

  async findAll() {
    return await this.eventsRepo.find();
  }

  async findByIds(ids: string[]) {
    return await this.eventsRepo.find({
      where: {
        _id: In(ids),
      },
    });
  }

  findOne(id: string) {
    try {
      const log = this.eventsRepo.findOne({
        where: { _id: new ObjectId(id) },
      });
      if (!log) throw new NotFoundException(`Event with ID: ${id} not found`);
      return log;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured');
    }
  }

  async update(id: string, updateEventInput: UpdateEventInput) {
    try {
      const log = await this.eventsRepo.findOne({
        where: { _id: new ObjectId(id) },
      });
      if (!log) throw new NotFoundException(`Event with ID: ${id} not found`);

      if (updateEventInput.name) log.name = updateEventInput.name;
      if (updateEventInput.description)
        log.description = updateEventInput.description;

      return this.eventsRepo.save(log);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured');
    }
  }

  async remove(id: string) {
    const res = await this.eventsRepo.delete({ _id: new ObjectId(id) });
    return res.affected > 0;
  }
}
