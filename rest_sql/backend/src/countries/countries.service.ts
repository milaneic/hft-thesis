import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepo: Repository<Country>,
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

  async findByIds(ids: string[]) {
    return await this.countriesRepo.find({
      where: {
        _id: In(ids),
      },
    });
  }

  async findOne(id: string) {
    try {
      const country = await this.countriesRepo.findOne({ where: { _id: id } });
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
    const country = await this.countriesRepo.findOne({ where: { _id: id } });

    if (!country) {
      throw new NotFoundException(`Country with ID: ${id} not found.`);
    }

    if (updateCountryInput.name) {
      country.name = updateCountryInput.name;
    }

    if (updateCountryInput.country_code) {
      country.country_code = updateCountryInput.country_code;
    }

    return this.countriesRepo.save(country);
  }

  async remove(id: string) {
    const country = await this.countriesRepo.findOne({ where: { _id: id } });
    if (!country) {
      throw new NotFoundException(`Country with ID: ${id} not found.`);
    }
    this.countriesRepo.delete(id);
    return this.findAll();
  }

  findOriginCountryID(id: string) {
    const country = this.countriesRepo.findOne({ where: { _id: id } });
    if (!country) {
      throw new NotFoundException(`Country with ID: ${id} not found.`);
    }
    return country;
  }

  findDestinationCountryID(id: string) {
    const country = this.countriesRepo.findOne({ where: { _id: id } });
    if (!country) {
      throw new NotFoundException(`Country with ID: ${id} not found.`);
    }

    return country;
  }
}
