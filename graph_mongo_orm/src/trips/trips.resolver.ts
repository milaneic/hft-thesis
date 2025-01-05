import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Float,
  Context,
} from '@nestjs/graphql';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/orders/entities/order.entity';
import { AddEventToTripInput } from './dto/add-event-to-trip.input';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Log } from 'src/logs/entities/log.entity';
import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';
import { Driver } from 'src/drivers/entities/driver.entity';

@Resolver(() => Trip)
export class TripsResolver {
  constructor(
    private readonly tripsService: TripsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Mutation(() => Trip)
  async createTrip(@Args('createTripInput') createTripInput: CreateTripInput) {
    return this.tripsService.create(createTripInput);
  }

  @Query(() => [Trip], { name: 'trips' })
  async findAll() {
    return this.tripsService.findAll();
  }

  @Query(() => [Trip], { name: 'active_trips' })
  async activeTrips() {
    // Get all active trips
    return await this.tripsService.findActive();
  }

  @Query(() => Trip, { name: 'trip' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.tripsService.findOne(id);
  }

  @Mutation(() => Trip)
  async updateTrip(@Args('updateTripInput') updateTripInput: UpdateTripInput) {
    return this.tripsService.update(updateTripInput.id, updateTripInput);
  }

  @Mutation(() => Boolean)
  async removeTrip(@Args('id', { type: () => String }) id: string) {
    const orders = await this.ordersService.findByTripId(id);
    for (const order of orders) {
      await this.ordersService.remove(order._id.toString());
    }
    return this.tripsService.remove(id);
  }

  @Mutation(() => Trip)
  async addEventToTrip(
    @Args('addEventToTripInput') addEventToTripInput: AddEventToTripInput,
  ) {
    return this.tripsService.addEventsToTrip(
      addEventToTripInput.tripId,
      addEventToTripInput.eventIds,
    );
  }

  @ResolveField(() => [Order])
  async orders(
    @Parent() trip: Trip,
    @Context('ordersLoader') ordersLoader: DataLoader<string, Order>,
  ) {
    return ordersLoader.load(trip._id.toString());
  }

  @ResolveField(() => Vehicle)
  async vehicle(
    @Parent() trip: Trip,
    @Context('vehiclesLoader') vehiclesLoader: DataLoader<ObjectId, Vehicle>,
  ) {
    return vehiclesLoader.load(new ObjectId(trip.vehicleId));
  }

  @ResolveField(() => Driver)
  async driver(
    @Parent() trip: Trip,
    @Context('driversLoader') driversLoader: DataLoader<ObjectId, Driver>,
  ) {
    return driversLoader.load(new ObjectId(trip.driverId));
  }

  @ResolveField(() => [Log])
  async event_logs(
    @Parent() trip: Trip,
    @Context('logsLoader') logsLoader: DataLoader<string, Log[]>,
  ) {
    const logs = logsLoader.load(trip._id.toString());
    return logs;
  }

  @ResolveField(() => Int!)
  async ordersCount(
    @Parent() trip: Trip,
    @Context('ordersLoader') ordersLoader: DataLoader<string, Order[]>,
  ) {
    const orders = await ordersLoader.load(trip._id.toString());
    return orders.length || 0;
  }

  @ResolveField(() => Float!)
  async ordersTotalAmount(
    @Parent() trip: Trip,
    @Context('ordersLoader') ordersLoader: DataLoader<string, Order[]>,
  ) {
    const orders = await ordersLoader.load(trip._id.toString());
    return orders.reduce((acc, { price }) => acc + Number(price), 0);
  }

  @ResolveField(() => String!)
  async firstOrderOrigin(
    @Parent() trip: Trip,
    @Context('ordersLoader') ordersLoader: DataLoader<string, Order[]>,
  ) {
    const orders = await ordersLoader.load(trip._id.toString());
    return orders[orders.length - 1]?.origin || 'no orders';
  }

  @ResolveField(() => String!)
  async lastOrderDestination(
    @Parent() trip: Trip,
    @Context('ordersLoader') ordersLoader: DataLoader<string, Order[]>,
  ) {
    const orders = await ordersLoader.load(trip._id.toString());
    return orders[0]?.destination || 'no orders';
  }

  @ResolveField(() => Float!)
  async totalTripLength(@Parent() trip: Trip) {
    return trip.finishOdometar - trip.startOdometar;
  }

  @ResolveField(() => Log, { nullable: true })
  async lastEvent(
    @Parent() trip: Trip,
    @Context('logsLoader') logsLoader: DataLoader<string, Log[]>,
  ) {
    const event_logs = await logsLoader.load(trip._id.toString());
    return event_logs[event_logs.length - 1];
  }

  @ResolveField(() => Float!)
  async eurosPerKm(
    @Parent() trip: Trip,
    @Context('ordersLoader') ordersLoader: DataLoader<string, Order[]>,
  ) {
    const amount = await this.ordersTotalAmount(trip, ordersLoader);
    const length = await this.totalTripLength(trip);

    return amount / length;
  }
}
