import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DriversService } from './drivers.service';
import { Driver } from './schemas/driver.schema';
import { CreateDriverInput } from './dto/create-driver.input';
import { UpdateDriverInput } from './dto/update-driver.input';

@Resolver(() => Driver)
export class DriversResolver {
  constructor(private readonly driversService: DriversService) {}

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
}
