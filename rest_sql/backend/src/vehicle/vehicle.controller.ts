import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleService } from './vehicle.service';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';

@Controller('vehicle')
export class VehicleController {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepo: Repository<Vehicle>,
    private readonly vehiclesService: VehicleService,
  ) {}

  @Get()
  async findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Post()
  async create(@Body() createVehicleInput: CreateVehicleInput) {
    return this.vehiclesService.create(createVehicleInput);
  }

  @Put()
  async update(@Body() updateVehicleInput: UpdateVehicleInput) {
    return this.vehiclesService.update(
      updateVehicleInput.id,
      updateVehicleInput,
    );
  }
}
