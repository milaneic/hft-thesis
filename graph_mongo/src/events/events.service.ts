import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async create(createEventInput: CreateEventInput) {
    const createdEvent = await new this.eventModel(createEventInput);
    return await createdEvent.save();
  }

  async findAll() {
    return await this.eventModel.find().exec();
  }

  async findOne(id: string) {
    const event = await this.eventModel.findOne({ _id: id }).exec();
    if (!event) throw new NotFoundException(`Event with ID: ${id} not found`);
    return event;
  }

  async update(id: string, updateEventInput: UpdateEventInput) {
    const event = await this.findOne(id);

    if (updateEventInput.name) event.name = updateEventInput.name;
    if (updateEventInput.description)
      event.description = updateEventInput.description;

    const updatedEvent = await event.save();

    return updatedEvent;
  }
}
