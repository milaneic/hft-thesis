import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { InjectModel } from '@nestjs/mongoose';
import { Country } from './schemas/country.schema';
import { Model } from 'mongoose';
import { OrdersService } from 'src/orders/orders.service';
import { TripsService } from 'src/trips/trips.service';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name) private readonly countryModel: Model<Country>,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => TripsService))
    private readonly tripsService: TripsService,
  ) {}

  async create(createCountryInput: CreateCountryInput) {
    const newCountry = await new this.countryModel(createCountryInput);
    return await newCountry.save();
  }

  async findAll() {
    return this.countryModel.find().exec();
  }

  async findOne(id: string) {
    const country = await this.countryModel.findOne({ _id: id });
    if (!country)
      throw new NotFoundException(`Country with ID: ${id} not found`);
    return country;
  }

  async update(id: string, updateCountryInput: UpdateCountryInput) {
    // Find the country to be updated
    const country = await this.findOne(id);

    if (updateCountryInput.name) country.name = updateCountryInput.name;
    if (updateCountryInput.country_code)
      country.country_code = updateCountryInput.country_code;

    const updatedCountry = await country.save();

    const trips = await this.tripsService.findAll();
    for (const trip of trips) {
      let modified = false;
      // Updating each order
      for (const order of trip.orders) {
        if (String(order.originCountry._id) === id) {
          order.originCountry = updatedCountry;
          trip.markModified('orders');
          modified = true;
        }

        if (String(order.destinationCountry._id) === id) {
          order.destinationCountry = updatedCountry;
          trip.markModified('orders');
          modified = true;
        }
      }

      if (String(trip.vehicle.country._id) === id) {
        trip.vehicle.country = updatedCountry;
        trip.markModified('vehicle');
        modified = true;
      }
      if (modified) await trip.save();
    }

    return updatedCountry;
  }
}
