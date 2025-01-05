import * as DataLoader from 'dataloader';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/orders/entities/order.entity';

export function createOrdersLoader(ordersService: OrdersService) {
  return new DataLoader<string, Order[]>(async (tripIds: string[]) => {
    const orders = await ordersService.findByTripIds(tripIds);

    return tripIds.map((tripId) =>
      orders.filter((order) => order.tripId === tripId),
    );
  });
}

export function createOrdersByOriginCountryLoader(
  ordersService: OrdersService,
) {
  return new DataLoader<string, Order[]>(async (countryIds: string[]) => {
    const orders = await ordersService.findByOriginCountryIds(countryIds);

    return countryIds.map((countryId) =>
      orders.filter((order) => order.originCountryId === countryId),
    );
  });
}

export function createOrdersByDestinationCountryLoader(
  ordersService: OrdersService,
) {
  return new DataLoader<string, Order[]>(async (countryIds: string[]) => {
    const orders = await ordersService.findByDestinationCountryIds(countryIds);

    return countryIds.map((countryId) =>
      orders.filter((order) => order.destinationCountryId === countryId),
    );
  });
}
