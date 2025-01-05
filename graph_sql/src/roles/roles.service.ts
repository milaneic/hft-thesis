import { Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  create(createRoleInput: CreateRoleInput) {
    const newRole = this.rolesRepo.create(createRoleInput);
    return this.rolesRepo.save(newRole);
  }

  async findAll() {
    return await this.rolesRepo.find();
  }

  async findByIds(ids: string[]) {
    return await this.rolesRepo.find({
      where: {
        _id: In(ids),
      },
    });
  }

  async findOne(id: string) {
    return await this.rolesRepo.findOneOrFail({ where: { _id: id } });
  }

  async update(id: string, updateRoleInput: UpdateRoleInput) {
    const role = await this.findOne(id);
    if (updateRoleInput.name) role.name = updateRoleInput.name;

    return await this.rolesRepo.save(role);
  }

  async remove(id: string) {
    await this.rolesRepo.delete({ _id: id });
    return true;
  }
}
