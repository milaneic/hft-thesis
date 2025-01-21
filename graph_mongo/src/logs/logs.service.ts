import { Injectable } from '@nestjs/common';
import { CreateLogInput } from './dto/create-log.input';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './schemas/log.schema';
import { Model } from 'mongoose';
import { EventsService } from 'src/events/events.service';
import { TripsService } from 'src/trips/trips.service';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<Log>,
    private readonly tripsService: TripsService,
    private readonly eventsService: EventsService,
  ) {}

  async create(createLogInput: CreateLogInput) {
    const event = await this.eventsService.findOne(createLogInput.eventId);
    const trip = await this.tripsService.findOne(createLogInput.tripId);

    const newLog = await this.logModel.create({ ...createLogInput, event });

    trip.event_logs.push(newLog);

    await trip.save();

    return newLog;
  }
}
