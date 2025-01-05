import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly rolesModel: Model<Role>,
  ) {}

  async create(createRoleInput: CreateRoleInput) {
    const newRole = await this.rolesModel.create(createRoleInput);
    return await newRole.save();
  }

  async findAll() {
    return this.rolesModel.find().exec();
  }

  async findOne(id: string) {
    const role = await this.rolesModel.findOne({ _id: id });
    if (!role) {
      throw new NotFoundException(`Role with ID: ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleInput: UpdateRoleInput) {
    const role = await this.findOne(id);

    if (updateRoleInput.name) role.name = updateRoleInput.name;
    return await role.save();
  }
}
