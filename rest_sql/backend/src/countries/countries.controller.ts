import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UpdateCountryInput } from './dto/update-country.input';
import { CreateCountryInput } from './dto/create-country.input';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  async create(@Body() createCountryInput: CreateCountryInput) {
    return this.countriesService.create(createCountryInput);
  }

  @Get()
  async findAll() {
    return this.countriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Put()
  async update(@Body() updateCountryInput: UpdateCountryInput) {
    return this.countriesService.update(
      updateCountryInput.id,
      updateCountryInput,
    );
  }
}
