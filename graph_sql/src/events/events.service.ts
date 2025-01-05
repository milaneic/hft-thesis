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

  async findOne(id: string) {
    try {
      const log = this.eventsRepo.findOne({
        where: { _id: id },
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
      const event = await this.eventsRepo.findOne({
        where: { _id: id },
      });
      if (!event) throw new NotFoundException(`Event with ID: ${id} not found`);

      if (updateEventInput.name) event.name = updateEventInput.name;
      if (updateEventInput.description)
        event.description = updateEventInput.description;

      return this.eventsRepo.save(event);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured');
    }
  }

  async remove(id: string) {
    try {
      const log = await this.eventsRepo.findOne({
        where: { _id: id },
      });
      if (!log) throw new NotFoundException(`Event with ID: ${id} not found`);
      this.eventsRepo.delete(id);
      return this.findAll();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured');
    }
  }
}
