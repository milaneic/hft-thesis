import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordUtils } from 'src/utils/password-utils';
import { ObjectId } from 'mongodb';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: MongoRepository<User>,
    private readonly roleService: RolesService,
    private readonly passwordUtils: PasswordUtils,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const role = await this.roleService.findOne(createUserInput.roleId);
    const existingEmailUser = await this.usersRepo.findOne({
      where: { email: createUserInput.email },
    });

    if (existingEmailUser) {
      throw new ConflictException('Email already in use!');
    }

    createUserInput.password = await this.passwordUtils.hashPassword(
      createUserInput.password,
    );

    const newUser = this.usersRepo.create({
      ...createUserInput,
      roleId: role._id.toString(),
    });

    return this.usersRepo.save(newUser);
  }

  async findAll() {
    const users = await this.usersRepo.find();
    return users;
  }

  async findByRoleIds(ids: string[]) {
    return await this.usersRepo.find({
      where: {
        roleId: { $in: ids },
      },
    });
  }

  findOne(id: string) {
    return this.usersRepo.findOne({ where: { _id: new ObjectId(id) } });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.findOne(id);

    const existingEmailUser = await this.usersRepo.findOne({
      where: { email: updateUserInput.email },
    });

    if (existingEmailUser && existingEmailUser.email !== user.email) {
      throw new ConflictException('Email already in use!');
    }

    if (updateUserInput.firstName) user.firstName = updateUserInput.firstName;
    if (updateUserInput.lastName) user.lastName = updateUserInput.lastName;
    if (updateUserInput.email) user.email = updateUserInput.email;
    if (updateUserInput.password)
      user.password = await this.passwordUtils.hashPassword(
        updateUserInput.password,
      );
    if (updateUserInput.dob) user.dob = updateUserInput.dob;
    if (updateUserInput.roleId) {
      const role = await this.roleService.findOne(updateUserInput.roleId);
      if (!role)
        throw new NotFoundException(
          `Role with ID: ${updateUserInput.roleId} not found`,
        );
      user.roleId = updateUserInput.roleId;
    }

    return this.usersRepo.save(user);
  }

  async remove(id: string) {
    const result = await this.usersRepo.delete({ _id: new ObjectId(id) });
    return result.affected > 0;
  }

  async removeMany(ids: string[]) {
    for (const id of ids) {
      await this.usersRepo.delete({ _id: new ObjectId(id) });
    }
    return true;
  }

  findByRole(roleId: string) {
    return this.usersRepo.find({ where: { roleId } });
  }

  findByEmail(email: string) {
    try {
      const user = this.usersRepo.findOne({ where: { email } });
      if (!user)
        throw new NotFoundException(`User with email: ${email} not found`);

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException('An unexpected error occured');
    }
  }
}
