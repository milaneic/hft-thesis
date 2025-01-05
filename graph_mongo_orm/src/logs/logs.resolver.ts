import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { LogsService } from './logs.service';
import { Log } from './entities/log.entity';
import { CreateLogInput } from './dto/create-log.input';
import { UpdateLogInput } from './dto/update-log.input';
import { EventsService } from 'src/events/events.service';
import { Trip } from 'src/trips/entities/trip.entity';
import { TripsService } from 'src/trips/trips.service';

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
  findOne(
    @Args('tripId', { type: () => String }) tripId: string,
    @Args('eventId', { type: () => String }) eventId: string,
  ) {
    return this.logsService.findOne(tripId, eventId);
  }

  @Mutation(() => Log)
  updateLog(@Args('updateLogInput') updateLogInput: UpdateLogInput) {
    return this.logsService.update(
      updateLogInput.tripId,
      updateLogInput.eventId,
      updateLogInput,
    );
  }

  @Mutation(() => Boolean)
  removeLog(
    @Args('tripId', { type: () => String }) tripId: string,
    @Args('eventId', { type: () => String }) eventId: string,
  ) {
    return this.logsService.remove(tripId, eventId);
  }

  @ResolveField(() => Event)
  event(@Parent() log: Log) {
    return this.eventsService.findOne(log.eventId.toString());
  }

  @ResolveField(() => Trip)
  trip(@Parent() log: Log) {
    return this.tripsService.findOne(log.tripId.toString());
  }
}
