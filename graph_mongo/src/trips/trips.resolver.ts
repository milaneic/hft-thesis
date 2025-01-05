import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Int,
  Float,
} from '@nestjs/graphql';
import { TripsService } from './trips.service';
import { Trip } from './schemas/trip.schema';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';
import { Log } from 'src/logs/schemas/log.schema';

@Resolver(() => Trip)
export class TripsResolver {
  constructor(private readonly tripsService: TripsService) {}

  @Mutation(() => Trip)
  createTrip(@Args('createTripInput') createTripInput: CreateTripInput) {
    return this.tripsService.create(createTripInput);
  }

  @Query(() => [Trip], { name: 'trips' })
  findAll() {
    return this.tripsService.findAll();
  }

  @Query(() => Trip, { name: 'trip' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.tripsService.findOne(id);
  }

  @Mutation(() => Trip)
  updateTrip(@Args('updateTripInput') updateTripInput: UpdateTripInput) {
    return this.tripsService.update(updateTripInput.id, updateTripInput);
  }

  @Query(() => [Trip], { name: 'active_trips' })
  async findTripsWithLastEvent() {
    // Get all active trips with at least one event
    const trips = await this.tripsService.findActiveWithEvent();
    if (trips.length > 0) {
      trips.map((trip) => {
        // Extracting of last event for current trip
        const lastEvent = trip.event_logs[trip.event_logs.length - 1];
        // Mapping last event into each trip
        return {
          ...trip,
          lastEvent,
        };
      });
      // Return of trip objects with last events
      return trips;
    } else {
      return [];
    }
  }

  @ResolveField(() => Log)
  lastEvent(@Parent() trip: Trip) {
    return trip.event_logs[trip.event_logs.length - 1] || 'No Event';
  }

  @ResolveField(() => Int!)
  ordersCount(@Parent() trip: Trip) {
    return this.tripsService.ordersCount(trip);
  }

  @ResolveField(() => Float!)
  ordersTotalAmount(@Parent() trip: Trip) {
    return this.tripsService.ordersTotalAmount(trip);
  }

  @ResolveField(() => String!)
  firstOrderOrigin(@Parent() trip: Trip) {
    return this.tripsService.firstOrderOriginByTripId(trip);
  }

  @ResolveField(() => String!)
  lastOrderDestination(@Parent() trip: Trip) {
    return this.tripsService.lastOrderDestinationByTripId(trip);
  }

  @ResolveField(() => Float!)
  totalTripLength(@Parent() trip: Trip) {
    return trip.finishOdometar - trip.startOdometar;
  }

  @ResolveField(() => Float!)
  async eurosPerKm(@Parent() trip: Trip) {
    const amount = await this.ordersTotalAmount(trip);
    const length = await this.totalTripLength(trip);

    return amount / length;
  }
}
