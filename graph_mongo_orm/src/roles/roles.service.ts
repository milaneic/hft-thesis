import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Role } from './entities/role.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepo: MongoRepository<Role>,
  ) {}

  create(createRoleInput: CreateRoleInput) {
    const newRole = this.rolesRepo.create(createRoleInput);
    return this.rolesRepo.save(newRole);
  }

  async findAll() {
    return await this.rolesRepo.find();
  }

  async findByIds(ids: ObjectId[]) {
    return await this.rolesRepo.find({ where: { _id: { $in: ids } } });
  }

  async findOne(id: string) {
    const role = await this.rolesRepo.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!role) throw new NotFoundException(`Role with ID: ${id} not found`);

    return role;
  }

  async update(id: string, updateRoleInput: UpdateRoleInput) {
    const role = await this.findOne(id);

    if (!role) throw new NotFoundException(`Role with ID: ${id} not found`);

    if (updateRoleInput.name) role.name = updateRoleInput.name;

    this.rolesRepo.save(role);

    return role;
  }
}
