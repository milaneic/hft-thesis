import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Country } from 'src/countries/entities/country.entity';
import { Trip } from 'src/trips/entities/trip.entity';
import DataLoader from 'dataloader';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.ordersService.create(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.ordersService.update(updateOrderInput.id, updateOrderInput);
  }

  @Mutation(() => Boolean)
  removeOrder(@Args('id', { type: () => String }) id: string) {
    return this.ordersService.remove(id);
  }

  @ResolveField(() => Country)
  originCountry(
    @Parent() order: Order,
    @Context('countriesLoader') countriesLoader: DataLoader<string, Country>,
  ) {
    return countriesLoader.load(order.originCountryId);
  }

  @ResolveField(() => Country)
  destinationCountry(
    @Parent() order: Order,
    @Context('countriesLoader') countriesLoader: DataLoader<string, Country>,
  ) {
    return countriesLoader.load(order.destinationCountryId);
  }

  @ResolveField(() => Trip)
  trip(
    @Parent() order: Order,
    @Context('tripsLoader') tripsLoader: DataLoader<string, Trip>,
  ) {
    return tripsLoader.load(order.tripId);
  }
}
