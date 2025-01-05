import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { Order } from 'src/orders/entities/order.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import DataLoader from 'dataloader';

@Resolver(() => Country)
export class CountriesResolver {
  constructor(private readonly countriesService: CountriesService) {}

  @Mutation(() => Country)
  createCountry(
    @Args('createCountryInput') createCountryInput: CreateCountryInput,
  ) {
    return this.countriesService.create(createCountryInput);
  }

  @Query(() => [Country], { name: 'countries' })
  findAll() {
    return this.countriesService.findAll();
  }

  @Query(() => Country, { name: 'country' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.countriesService.findOne(id);
  }

  @Mutation(() => Country)
  updateCountry(
    @Args('updateCountryInput') updateCountryInput: UpdateCountryInput,
  ) {
    return this.countriesService.update(
      updateCountryInput.id,
      updateCountryInput,
    );
  }

  @Mutation(() => Country)
  removeCountry(@Args('id', { type: () => String }) id: string) {
    return this.countriesService.remove(id);
  }

  @ResolveField(() => [Vehicle])
  vehicles(
    @Parent() country: Country,
    @Context('vehiclesByCountryLoader')
    vehiclesByCountryLoader: DataLoader<string, Vehicle>,
  ) {
    return vehiclesByCountryLoader.load(country._id);
  }

  @ResolveField(() => [Order])
  ordersAsOrigin(
    @Parent() country: Country,
    @Context('ordersByOriginCountryLoader')
    ordersByOriginCountryLoader: DataLoader<string, Order[]>,
  ) {
    return ordersByOriginCountryLoader.load(country._id);
  }

  @ResolveField(() => [Order])
  ordersAsDestination(
    @Parent() country: Country,
    @Context('ordersByOriginCountryLoader')
    ordersByDestinationCountryLoader: DataLoader<string, Order[]>,
  ) {
    return ordersByDestinationCountryLoader.load(country._id);
  }
}
