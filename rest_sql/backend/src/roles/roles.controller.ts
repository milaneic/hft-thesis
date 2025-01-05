import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { RolesService } from './roles.service';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Controller('roles')
export class RolesController {
  constructor(
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  async create(@Body() createRoleInput: CreateRoleInput) {
    return this.rolesService.create(createRoleInput);
  }

  @Put()
  async update(@Body() updateRoleInput: UpdateRoleInput) {
    return this.rolesService.update(updateRoleInput.id, updateRoleInput);
  }
}
