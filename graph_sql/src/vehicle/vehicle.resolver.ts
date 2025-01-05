import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { Order } from 'src/orders/entities/order.entity';
import { TripsService } from 'src/trips/trips.service';
import { DriversService } from 'src/drivers/drivers.service';
import { CountriesService } from 'src/countries/countries.service';
import { Country } from 'src/countries/entities/country.entity';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly tripsService: TripsService,
    private readonly driversService: DriversService,
    private readonly countriesService: CountriesService,
  ) {}

  @Mutation(() => Vehicle)
  createVehicle(
    @Args('createVehicleInput') createVehicleInput: CreateVehicleInput,
  ) {
    return this.vehicleService.create(createVehicleInput);
  }

  @Query(() => [Vehicle], { name: 'vehicles' })
  findAll() {
    return this.vehicleService.findAll();
  }

  @Query(() => Vehicle, { name: 'vehicle' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.vehicleService.findOne(id);
  }

  @Mutation(() => Vehicle)
  updateVehicle(
    @Args('updateVehicleInput') updateVehicleInput: UpdateVehicleInput,
  ) {
    return this.vehicleService.update(
      updateVehicleInput.id,
      updateVehicleInput,
    );
  }

  @Mutation(() => Vehicle)
  removeVehicle(@Args('id', { type: () => String }) id: string) {
    return this.vehicleService.remove(id);
  }

  @ResolveField(() => Country)
  country(@Parent() vehicle: Vehicle) {
    return this.countriesService.findOne(vehicle.countryId);
  }

  @ResolveField(() => [Order])
  trips(@Parent() vehicle: Vehicle) {
    return this.tripsService.findByVehicleId(vehicle._id);
  }
}
