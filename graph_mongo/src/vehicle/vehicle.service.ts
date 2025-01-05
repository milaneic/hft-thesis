import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { Vehicle } from './schemas/vehicle.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountriesService } from 'src/countries/countries.service';
import { TripsService } from 'src/trips/trips.service';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<Vehicle>,
    @Inject(forwardRef(() => CountriesService))
    private readonly countriesService: CountriesService,
    @Inject(forwardRef(() => TripsService))
    private readonly tripsService: TripsService,
  ) {}

  async create(createVehicleInput: CreateVehicleInput) {
    const country = await this.countriesService.findOne(
      createVehicleInput.countryId,
    );

    const newVehicle = await new this.vehicleModel({
      ...createVehicleInput,
      country,
    });

    return await newVehicle.save();
  }

  async findAll() {
    return await this.vehicleModel.find().exec();
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleModel.findOne({ _id: id });
    if (!vehicle)
      throw new NotFoundException(`Vehicle with ID: ${id} not found`);
    return vehicle;
  }

  async update(id: string, updateVehicleInput: UpdateVehicleInput) {
    const country = await this.countriesService.findOne(
      updateVehicleInput.countryId,
    );

    const vehicle = await this.findOne(updateVehicleInput.id);

    if (updateVehicleInput.plates) vehicle.plates = updateVehicleInput.plates;
    if (updateVehicleInput.width) vehicle.width = updateVehicleInput.width;
    if (updateVehicleInput.length) vehicle.length = updateVehicleInput.length;
    if (updateVehicleInput.height) vehicle.height = updateVehicleInput.height;
    if (updateVehicleInput.vehicleType)
      vehicle.vehicleType = updateVehicleInput.vehicleType;
    if (updateVehicleInput.countryId) vehicle.country = country;

    const updatedVehicle = await vehicle.save();

    const trips = await this.tripsService.findAll();

    for (const trip of trips) {
      if (String(trip.vehicle._id) === id) {
        trip.vehicle = updatedVehicle;
        await trip.save();
      }
    }
    return updatedVehicle;
  }

  async remove(id: string) {
    const result = await this.vehicleModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}
