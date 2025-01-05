import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogsService } from 'src/logs/logs.service';
import { OrdersService } from 'src/orders/orders.service';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { TripsService } from './trips.service';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';

@Controller('trips')
export class TripsController {
  constructor(
    @InjectRepository(Trip) private readonly tripsRepo: Repository<Trip>,
    private readonly tripsService: TripsService,
    private readonly ordersService: OrdersService,
    private readonly logsService: LogsService,
  ) {}

  @Get()
  async findAll() {
    return this.tripsService.findAll();
  }

  @Get('active')
  async findActiveTrips() {
    return await this.tripsService.findActiveTrips();
  }

  @Get(':id/events/-1')
  async findLastEventByTripId(@Param('id') id: string) {
    return await this.logsService.findLastEventByTripId(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Get(':id/orders')
  async findOrdersByTripId(@Param('id') id: string) {
    return await this.ordersService.findByTripId(id);
  }

  @Get(':id/events')
  async findEventsByTripId(@Param('id') id: string) {
    return await this.logsService.findByTripId(id);
  }

  @Post()
  async create(@Body() createTripInput: CreateTripInput) {
    return this.tripsService.create(createTripInput);
  }

  @Put()
  async update(@Body() updateTripInput: UpdateTripInput) {
    return this.tripsService.update(updateTripInput.id, updateTripInput);
  }
}
