import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';
import { InjectModel } from '@nestjs/mongoose';
import { Trip } from './schemas/trip.schema';
import { Model } from 'mongoose';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { DriversService } from 'src/drivers/drivers.service';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<Trip>,
    private readonly vehicleService: VehicleService,
    private readonly driverService: DriversService,
  ) {}

  async create(createTripInput: CreateTripInput) {
    const vehicle = await this.vehicleService.findOne(
      createTripInput.vehicleId,
    );

    const driver = await this.driverService.findOne(createTripInput.driverId);

    const createdTrip = new this.tripModel({
      ...createTripInput,
      vehicle,
      driver,
    });

    return createdTrip.save();
  }

  async findAll() {
    return this.tripModel.find().sort({ created_at: -1 }).exec();
  }

  async findActiveWithEvent() {
    // Query all active trips
    return await this.tripModel.find().where({ active: 1 }).exec();
  }

  async findOne(id: string) {
    const trip = await this.tripModel.findOne({ _id: id }).exec();
    if (!trip) throw new NotFoundException(`Trip with ID: ${id} not found`);
    return trip;
  }

  async update(id: string, updateTripInput: UpdateTripInput) {
    const trip = await this.findOne(id);

    if (updateTripInput.startOdometar)
      trip.startOdometar = updateTripInput.startOdometar;
    if (updateTripInput.finishOdometar)
      trip.finishOdometar = updateTripInput.finishOdometar;
    if (updateTripInput.active !== trip.active)
      trip.active = updateTripInput.active;
    if (updateTripInput.vehicleId) {
      const vehicle = await this.vehicleService.findOne(
        updateTripInput.vehicleId,
      );
      trip.vehicle = vehicle;
    }
    if (updateTripInput.driverId) {
      const driver = await this.driverService.findOne(updateTripInput.driverId);
      trip.driver = driver;
    }
    return await trip.save();
  }

  async ordersCount(trip: Trip) {
    return trip.orders.length;
  }

  async ordersTotalAmount(trip: Trip) {
    let totalAmount = 0;
    totalAmount = trip.orders.reduce((sum, order) => {
      return sum + (order.price || 0);
    }, 0);
    return totalAmount;
  }

  async firstOrderOriginByTripId(trip: Trip) {
    return trip.orders[0]?.origin ? trip.orders[0].origin : 'no orders';
  }

  async lastOrderDestinationByTripId(trip: Trip) {
    return trip.orders[trip.orders.length - 1]?.destination
      ? trip.orders[trip.orders.length - 1].destination
      : 'no orders';
  }
}
