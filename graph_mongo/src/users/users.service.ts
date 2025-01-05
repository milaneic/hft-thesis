import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PasswordUtils } from '../password-utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    private readonly rolesService: RolesService,
    private readonly passwordUtils: PasswordUtils,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const existsingUserWithEmail = await this.usersModel.find({
      email: createUserInput.email,
    });

    if (existsingUserWithEmail.length > 0)
      throw new ConflictException('Email already in use');

    const role = await this.rolesService.findOne(createUserInput.roleId);
    const password = await this.passwordUtils.hashPassword(
      createUserInput.password,
    );
    const newUser = new this.usersModel({
      ...createUserInput,
      password,
      role,
    });
    return newUser.save();
  }

  async findAll() {
    return await this.usersModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.usersModel.findOne({ _id: id });
    if (!user) throw new NotFoundException(`User with ID: ${id} not found`);
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.findOne(id);

    if (updateUserInput.firstName) user.firstName = updateUserInput.firstName;
    if (updateUserInput.lastName) user.lastName = updateUserInput.lastName;
    if (updateUserInput.email) user.email = updateUserInput.email;
    if (updateUserInput.password) user.password = updateUserInput.password;
    if (updateUserInput.dob) user.dob = new Date(updateUserInput.dob);
    if (updateUserInput.roleId) {
      const role = await this.rolesService.findOne(updateUserInput.roleId);
      user.role = role;
    }

    const updatedUser = await user.save();

    return updatedUser;
  }

  async findByEmail(email: string) {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    return user;
  }
}
