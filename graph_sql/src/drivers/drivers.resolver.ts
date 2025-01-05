import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { DriversService } from './drivers.service';
import { Driver } from './entities/driver.entity';
import { CreateDriverInput } from './dto/create-driver.input';
import { UpdateDriverInput } from './dto/update-driver.input';
import { Trip } from 'src/trips/entities/trip.entity';
import { TripsService } from 'src/trips/trips.service';
import DataLoader from 'dataloader';

@Resolver(() => Driver)
export class DriversResolver {
  constructor(
    private readonly driversService: DriversService,
    private readonly tripsService: TripsService,
  ) {}

  @Mutation(() => Driver)
  createDriver(
    @Args('createDriverInput') createDriverInput: CreateDriverInput,
  ) {
    return this.driversService.create(createDriverInput);
  }

  @Query(() => [Driver], { name: 'drivers' })
  findAll() {
    return this.driversService.findAll();
  }

  @Query(() => Driver, { name: 'driver' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.driversService.findOne(id);
  }

  @Mutation(() => Driver)
  updateDriver(
    @Args('updateDriverInput') updateDriverInput: UpdateDriverInput,
  ) {
    return this.driversService.update(updateDriverInput.id, updateDriverInput);
  }

  @Mutation(() => Driver)
  removeDriver(@Args('id', { type: () => String }) id: string) {
    return this.driversService.remove(id);
  }

  @ResolveField(() => [Trip])
  trips(
    @Parent() driver: Driver,
    @Context('tripsByDriverLoader')
    tripsByDriverLoader: DataLoader<string, Trip>,
  ) {
    return tripsByDriverLoader.load(driver._id);
  }
}
