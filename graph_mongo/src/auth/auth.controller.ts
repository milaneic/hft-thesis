import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.input';
import { AuthService, LoginResponse } from './auth.service';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/schemas/users.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserInput): Promise<User> {
    const user_roles = await this.rolesService.findAll();
    if (!createUserDto.roleId) {
      for (const role of user_roles) {
        if (role.name === 'user') {
          createUserDto.roleId = role._id.toString();
          break;
        }
      }
    }
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }
}
