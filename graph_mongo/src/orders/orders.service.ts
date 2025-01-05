import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CountriesService } from 'src/countries/countries.service';
import { TripsService } from 'src/trips/trips.service';
import { GoodsType } from 'src/enums/goods-type.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly tripsService: TripsService,
    @Inject(forwardRef(() => CountriesService))
    private countriesService: CountriesService,
  ) {}

  async create(createOrderInput: CreateOrderInput) {
    const originCountry = await this.countriesService.findOne(
      createOrderInput.originCountryId,
    );

    const destinationCountry = await this.countriesService.findOne(
      createOrderInput.destinationCountryId,
    );

    const trip = await this.tripsService.findOne(createOrderInput.tripId);

    const newOrder = await new this.orderModel({
      ...createOrderInput,
      originCountry,
      destinationCountry,
      updated_at: new Date(),
      created_at: new Date(),
    });

    trip.orders.push(newOrder);
    await trip.save();

    return newOrder;
  }

  async findAll() {
    const trips = await this.tripsService.findAll();
    // Retrieving orders from each trip
    const orders = trips?.reduce((acc, trip) => {
      if (trip.orders && trip.orders.length > 0) {
        acc.push(...trip.orders);
      }
      return acc;
    }, []);
    return orders;
  }

  async findOne(id: string) {
    const trips = await this.tripsService.findAll();
    for (const trip of trips) {
      const order = trip.orders.find((order) => String(order._id) === id);
      if (order) return order;
    }
    throw new NotFoundException(`Order with ID: ${id} not found`);
  }

  async update(id: string, updateOrderInput: UpdateOrderInput) {
    const trips = await this.tripsService.findAll();
    let targetTrip = null;
    let targetOrder = null;

    for (const trip of trips) {
      const order = trip.orders.find((order) => String(order._id) === id);
      if (order) {
        targetTrip = trip;
        targetOrder = order;
        break;
      }
    }

    if (!targetOrder) {
      throw new NotFoundException(`Order with ID: ${id} not found`);
    }

    // Update the order fields
    if (updateOrderInput.origin) targetOrder.origin = updateOrderInput.origin;
    if (updateOrderInput.destination)
      targetOrder.destination = updateOrderInput.destination;
    if (updateOrderInput.price) targetOrder.price = updateOrderInput.price;
    if (updateOrderInput.weight) targetOrder.weight = updateOrderInput.weight;
    if (updateOrderInput.goodsType)
      targetOrder.goodsType = updateOrderInput.goodsType as GoodsType;
    if (updateOrderInput.quantity)
      targetOrder.quantity = updateOrderInput.quantity;

    if (updateOrderInput.originCountryId) {
      const originCountry = await this.countriesService.findOne(
        updateOrderInput.originCountryId,
      );
      targetOrder.originCountry = originCountry;
    }

    if (updateOrderInput.destinationCountryId) {
      const destinationCountry = await this.countriesService.findOne(
        updateOrderInput.destinationCountryId,
      );
      targetOrder.destinationCountry = destinationCountry;
    }

    targetTrip.markModified('orders');
    await targetTrip.save();

    // Move the order to a new trip if `tripId` is provided and differs from the current one
    if (
      updateOrderInput.tripId &&
      String(targetTrip._id) !== updateOrderInput.tripId
    ) {
      // Remove order from current trip
      targetTrip.orders = targetTrip.orders.filter((o) => String(o._id) !== id);
      await targetTrip.save();

      // Add order to new trip
      const newTrip = await this.tripsService.findOne(updateOrderInput.tripId);
      if (!newTrip) {
        throw new NotFoundException(
          `Trip with ID: ${updateOrderInput.tripId} not found`,
        );
      }
      newTrip.orders.push(targetOrder);
      await newTrip.save();
    }

    return targetOrder;
  }
}
