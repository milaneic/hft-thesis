import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.input';
import { AuthService } from './auth.service';
import { RolesService } from 'src/roles/roles.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserInput) {
    const user_roles = await this.rolesService.findAll();
    if (!createUserDto.roleId) {
      for (const role of user_roles) {
        if (role.name === 'user') {
          createUserDto.roleId = role._id;
          break;
        }
      }
    }
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
