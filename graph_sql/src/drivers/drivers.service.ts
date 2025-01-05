import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDriverInput } from './dto/create-driver.input';
import { UpdateDriverInput } from './dto/update-driver.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver) private readonly driversRepo: Repository<Driver>,
  ) {}

  async create(createDriverInput: CreateDriverInput) {
    const newDriver = await this.driversRepo.create(createDriverInput);
    return this.driversRepo.save(newDriver);
  }

  async findAll() {
    return this.driversRepo.find();
  }

  async findByIds(ids: string[]) {
    return this.driversRepo.find({
      where: {
        _id: In(ids),
      },
    });
  }

  async findOne(id: string) {
    try {
      const driver = await this.driversRepo.findOne({ where: { _id: id } });
      if (!driver)
        throw new NotFoundException(`Driver with ID: ${id} not found!`);
      return driver;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured.');
    }
  }

  async update(id: string, updateDriverInput: UpdateDriverInput) {
    try {
      const driver = await this.driversRepo.findOne({ where: { _id: id } });
      if (!driver)
        throw new NotFoundException(`Driver with ID: ${id} not found!`);

      if (updateDriverInput.firstName)
        driver.firstName = updateDriverInput.firstName;
      if (updateDriverInput.lastName)
        driver.lastName = updateDriverInput.lastName;
      if (updateDriverInput.dob) driver.dob = updateDriverInput.dob;
      return this.driversRepo.save(driver);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured.');
    }
  }

  async remove(id: string) {
    try {
      const driver = await this.driversRepo.findOne({ where: { _id: id } });
      if (!driver)
        throw new NotFoundException(`Driver with ID: ${id} not found!`);

      this.driversRepo.delete(id);
      return this.findAll();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured.');
    }
    return;
  }
}
