import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepo: Repository<Vehicle>,
  ) {}

  async create(createVehicleInput: CreateVehicleInput) {
    const newVehicle = await this.vehiclesRepo.create(createVehicleInput);
    return this.vehiclesRepo.save(newVehicle);
  }

  async findAll() {
    return await this.vehiclesRepo.find();
  }

  async findByIds(ids: string[]) {
    return await this.vehiclesRepo.find({
      where: {
        _id: In(ids),
      },
    });
  }

  async findByCountryIds(ids: string[]) {
    return await this.vehiclesRepo.find({
      where: {
        countryId: In(ids),
      },
    });
  }

  findOne(id: string) {
    try {
      return this.vehiclesRepo.findOne({ where: { _id: id } });
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`Vehicle with ID: ${id} not found!`);
      else
        throw new InternalServerErrorException('An unexpected error occured.');
    }
  }

  async update(id: string, updateVehicleInput: UpdateVehicleInput) {
    try {
      const vehicle = await this.vehiclesRepo.findOne({ where: { _id: id } });
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
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured.');
    }
  }

  async remove(id: string) {
    try {
      const vehicle = await this.vehiclesRepo.findOne({ where: { _id: id } });
      if (!vehicle)
        throw new NotFoundException(`Vehicle with ID: ${id} not found!`);

      this.vehiclesRepo.delete(id);
      return this.findAll();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured.');
    }
  }

  findByCountryId(countryId: string) {
    return this.vehiclesRepo.find({ where: { countryId } });
  }
}
