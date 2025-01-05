import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverInput } from './dto/create-driver.input';
import { UpdateDriverInput } from './dto/update-driver.input';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async create(@Body() createDriverInput: CreateDriverInput) {
    return this.driversService.create(createDriverInput);
  }

  @Get()
  async findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Put()
  async update(@Body() updateDriverInput: UpdateDriverInput) {
    return this.driversService.update(updateDriverInput.id, updateDriverInput);
  }
}
