import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDriverInput } from './dto/create-driver.input';
import { UpdateDriverInput } from './dto/update-driver.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driversRepo: MongoRepository<Driver>,
  ) {}

  async create(createDriverInput: CreateDriverInput) {
    const newDriver = await this.driversRepo.create(createDriverInput);
    return this.driversRepo.save(newDriver);
  }

  async findAll() {
    return await this.driversRepo.find();
  }

  async findByIds(ids: ObjectId[]) {
    return this.driversRepo.find({
      where: {
        _id: { $in: ids },
      },
    });
  }

  async findOne(id: string) {
    const driver = await this.driversRepo.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!driver)
      throw new NotFoundException(`Driver with ID: ${id} not found!`);
    return driver;
  }

  async update(id: string, updateDriverInput: UpdateDriverInput) {
    try {
      const driver = await this.driversRepo.findOne({
        where: { _id: new ObjectId(id) },
      });
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
    const res = await this.driversRepo.delete({ _id: new ObjectId(id) });
    return res.affected > 0;
  }
}
