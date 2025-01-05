import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepo: MongoRepository<Country>,
  ) {}

  async create(createCountryInput: CreateCountryInput) {
    const countryWithExistingCountryCode = await this.countriesRepo.findOne({
      where: { country_code: createCountryInput.country_code },
    });

    if (countryWithExistingCountryCode) {
      throw new ConflictException(
        `Country with Country code: ${createCountryInput.country_code} already exists in database.`,
      );
    }
    const newCountry = this.countriesRepo.create(createCountryInput);
    return this.countriesRepo.save(newCountry);
  }

  async findAll() {
    return await this.countriesRepo.find();
  }

  async findByIds(ids: ObjectId[]) {
    return this.countriesRepo.find({
      where: {
        _id: { $in: ids },
      },
    });
  }

  async findOne(id: string) {
    try {
      const country = await this.countriesRepo.findOne({
        where: { _id: new ObjectId(id) },
      });
      if (!country)
        throw new NotFoundException(`Country with ID: ${id} not found`);
      return country;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexprected error occured');
    }
  }

  async update(id: string, updateCountryInput: UpdateCountryInput) {
    const country = await this.countriesRepo.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID: ${id} not found.`);
    }

    const existing_country_with_same_code = await this.countriesRepo.findOne({
      where: { country_code: updateCountryInput.country_code },
    });

    if (
      existing_country_with_same_code &&
      country.country_code !== existing_country_with_same_code.country_code
    )
      throw new BadRequestException(
        `Country with country code: ${updateCountryInput.country_code} already exists.`,
      );

    if (updateCountryInput.name) {
      country.name = updateCountryInput.name;
    }

    if (updateCountryInput.country_code) {
      country.country_code = updateCountryInput.country_code;
    }

    return await this.countriesRepo.save(country);
  }

  async remove(id: string) {
    const res = await this.countriesRepo.delete(new ObjectId(id));
    return res.affected > 0;
  }

  findOriginCountryID(id: string) {
    const country = this.countriesRepo.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!country) {
      throw new NotFoundException(`Country with ID: ${id} not found.`);
    }
    return country;
  }

  findDestinationCountryID(id: string) {
    const country = this.countriesRepo.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID: ${id} not found.`);
    }

    return country;
  }
}
