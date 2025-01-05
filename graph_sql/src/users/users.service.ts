import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordUtils } from 'src/utils/password-utils';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly passwordUtils: PasswordUtils,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const existingEmailUser = await this.usersRepo.find({
      where: { email: createUserInput.email },
    });

    if (existingEmailUser.length > 0) {
      throw new ConflictException('Email already in use!');
    }

    createUserInput.password = await this.passwordUtils.hashPassword(
      createUserInput.password,
    );

    const newUser = this.usersRepo.create(createUserInput);

    return this.usersRepo.save(newUser);
  }

  async findAll() {
    return await this.usersRepo.find();
  }

  async findByRoleIds(ids: string[]) {
    return await this.usersRepo.find({
      where: {
        roleId: In(ids),
      },
    });
  }

  async findOne(id: string) {
    return await this.usersRepo.findOneOrFail({ where: { _id: id } });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.usersRepo.findOneOrFail({ where: { _id: id } });

    const existingEmailUser = await this.usersRepo.findOne({
      where: { email: user.email },
    });

    if (existingEmailUser && existingEmailUser._id !== id) {
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
    if (updateUserInput.roleId) user.roleId = updateUserInput.roleId;

    return this.usersRepo.save(user);
  }

  async remove(id: string) {
    return await this.usersRepo.delete({ _id: id });
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
