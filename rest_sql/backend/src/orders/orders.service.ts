import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
  ) {}

  create(createOrderInput: CreateOrderInput) {
    const newOrder = this.ordersRepo.create(createOrderInput);
    return this.ordersRepo.save(newOrder);
  }

  async findAll() {
    return await this.ordersRepo.find({
      relations: ['originCountry', 'destinationCountry'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    if (!id) throw new BadRequestException(`No ID provided`);

    const order = await this.ordersRepo.findOne({
      where: { _id: id },
      relations: ['originCountry', 'destinationCountry'],
    });
    if (!order) throw new NotFoundException(`Order with ID: ${id} not found`);

    return order;
  }

  async update(id: string, updateOrderInput: UpdateOrderInput) {
    try {
      const order = await this.findOne(id);
      if (!order) {
        throw new NotFoundException(`Order with ID: ${id} not found`);
      }

      if (updateOrderInput.origin) order.origin = updateOrderInput.origin;
      if (updateOrderInput.destination)
        order.destination = updateOrderInput.destination;
      if (updateOrderInput.originCountryId)
        order.originCountryId = updateOrderInput.originCountryId;
      if (updateOrderInput.destinationCountryId)
        order.destinationCountryId = updateOrderInput.destinationCountryId;
      if (updateOrderInput.price) order.price = updateOrderInput.price;
      if (updateOrderInput.weight) order.weight = updateOrderInput.weight;
      if (updateOrderInput.quantity) order.quantity = updateOrderInput.quantity;
      if (updateOrderInput.goodsType)
        order.goodsType = updateOrderInput.goodsType;
      return this.ordersRepo.save(order);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException(`An unexpected error occurred`);
    }
  }

  async remove(id: string) {
    try {
      const order = await this.ordersRepo.findOne({ where: { _id: id } });
      if (!order) throw new NotFoundException(`Order with ID: ${id} not found`);
      this.ordersRepo.delete(id);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException(`An unexpected error occurred`);
    }
  }

  async findByOriginCountryId(originCountryId: string) {
    return await this.ordersRepo.find({ where: { originCountryId } });
  }

  async findByDestinationCountryId(destinationCountryId: string) {
    return await this.ordersRepo.find({ where: { destinationCountryId } });
  }

  async findByTripId(tripId: string) {
    return await this.ordersRepo.find({
      where: { tripId },
      relations: ['originCountry', 'destinationCountry'],
    });
  }

  async countOrdersByTripId(tripId: string) {
    return this.ordersRepo.count({ where: { tripId } });
  }

  async totalAmountByTripId(tripId: string) {
    const orders = await this.ordersRepo.find({ where: { tripId } });
    const total = orders.reduce((acc, { price }) => acc + Number(price), 0);
    return total;
  }

  async firstOrderOriginByTripId(tripId: string) {
    const orders = await this.ordersRepo.find({
      where: { tripId },
      order: { created_at: 'ASC' },
    });

    return orders[0]?.origin || 'no orders';
  }

  async lastOrderDestinationByTripId(tripId: string) {
    const orders = await this.ordersRepo.find({
      where: { tripId },
      order: { created_at: 'DESC' },
    });

    return orders[0]?.destination || 'no orders';
  }
}
