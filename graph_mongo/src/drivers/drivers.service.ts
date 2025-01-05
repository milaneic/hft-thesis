import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDriverInput } from './dto/create-driver.input';
import { UpdateDriverInput } from './dto/update-driver.input';
import { InjectModel } from '@nestjs/mongoose';
import { Driver } from './schemas/driver.schema';
import { Model } from 'mongoose';
import { TripsService } from 'src/trips/trips.service';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
    @Inject(forwardRef(() => TripsService))
    private readonly tripsService: TripsService,
  ) {}

  async create(createDriverInput: CreateDriverInput) {
    const createdDriver = await new this.driverModel(createDriverInput);
    return await createdDriver.save();
  }

  async findAll() {
    return await this.driverModel.find().exec();
  }

  async findOne(id: string) {
    const driver = await this.driverModel.findOne({ _id: id }).exec();
    if (!driver) throw new NotFoundException(`Driver with ID: ${id} not found`);
    return driver;
  }

  async update(id: string, updateDriverInput: UpdateDriverInput) {
    const driver = await this.findOne(updateDriverInput.id);

    if (updateDriverInput.firstName)
      driver.firstName = updateDriverInput.firstName;
    if (updateDriverInput.lastName)
      driver.lastName = updateDriverInput.lastName;
    if (updateDriverInput.dob) driver.dob = updateDriverInput.dob;

    const updateddriver = await driver.save();

    const trips = await this.tripsService.findAll();

    for (const trip of trips) {
      if (String(trip.driver._id) === id) {
        trip.driver = updateddriver;
        await trip.save();
      }
    }
    return updateddriver;
  }
}
