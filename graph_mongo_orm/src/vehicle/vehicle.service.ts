import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepo: MongoRepository<Vehicle>,
  ) {}

  async create(createVehicleInput: CreateVehicleInput) {
    try {
      const newVehicle = await this.vehiclesRepo.create(createVehicleInput);
      return this.vehiclesRepo.save(newVehicle);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error ocurred');
    }
  }

  async findAll() {
    return await this.vehiclesRepo.find();
  }

  async findByIds(ids: ObjectId[]) {
    return await this.vehiclesRepo.find({
      where: {
        _id: { $in: ids },
      },
    });
  }

  async findByCountryIds(ids: string[]) {
    return await this.vehiclesRepo.find({
      where: {
        countryId: { $in: ids },
      },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.vehiclesRepo.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!vehicle)
      throw new NotFoundException(`Vehicle with ID: ${id} not found`);

    return vehicle;
  }

  async update(id: string, updateVehicleInput: UpdateVehicleInput) {
    try {
      const vehicle = await this.vehiclesRepo.findOne({
        where: { _id: new ObjectId(id) },
      });

      if (!vehicle)
        throw new NotFoundException(`Vehicle with ID: ${id} not found!`);

      if (updateVehicleInput.plates) vehicle.plates = updateVehicleInput.plates;
      if (updateVehicleInput.vehicleType)
        vehicle.vehicleType = updateVehicleInput.vehicleType;
      if (updateVehicleInput.countryId)
        vehicle.countryId = updateVehicleInput.countryId;
      if (updateVehicleInput.width) vehicle.width = updateVehicleInput.width;
      if (updateVehicleInput.length) vehicle.length = updateVehicleInput.length;
      if (updateVehicleInput.height) vehicle.height = updateVehicleInput.height;

      return await this.vehiclesRepo.save(vehicle);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An unexpected error occured.');
      }
    }
  }

  async remove(id: string) {
    const res = await this.vehiclesRepo.delete({ _id: new ObjectId(id) });
    return res.affected > 0;
  }

  findByCountryId(countryId: string) {
    return this.vehiclesRepo.find({ where: { countryId } });
  }
}
