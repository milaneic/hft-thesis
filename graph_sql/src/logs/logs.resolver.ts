import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { LogsService } from './logs.service';
import { Log } from './entities/log.entity';
import { CreateLogInput } from './dto/create-log.input';
import { EventsService } from 'src/events/events.service';
import { Trip } from 'src/trips/entities/trip.entity';
import { TripsService } from 'src/trips/trips.service';
import DataLoader from 'dataloader';
import { Event } from 'src/events/entities/event.entity';

@Resolver(() => Log)
export class LogsResolver {
  constructor(
    private readonly logsService: LogsService,
    private readonly eventsService: EventsService,
    private readonly tripsService: TripsService,
  ) {}

  @Mutation(() => Log)
  createLog(@Args('createLogInput') createLogInput: CreateLogInput) {
    return this.logsService.create(createLogInput);
  }

  @Query(() => [Log], { name: 'logs' })
  findAll() {
    return this.logsService.findAll();
  }

  @Query(() => Log, { name: 'log' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.logsService.findOne(id);
  }

  @ResolveField(() => Event)
  event(
    @Parent() log: Log,
    @Context('eventsLoader') eventsLoader: DataLoader<string, Event>,
  ) {
    return eventsLoader.load(log.eventId);
  }

  @ResolveField(() => Trip)
  async trip(
    @Parent() log: Log,
    @Context('tripsLoader') tripsLoader: DataLoader<string, Trip>,
  ) {
    return tripsLoader.load(log.tripId);
  }
}
