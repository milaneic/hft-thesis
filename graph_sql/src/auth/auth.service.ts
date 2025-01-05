import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.input';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.username);

    if (user && compareSync(loginDto.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid creadentials');
  }

  async login(loginDto: LoginDto) {
    console.log(`login`);
    const user = await this.validateUser(loginDto);
    const role = await this.rolesService.findOne(user.roleId);
    const payload = {
      username: user.email,
      name: user.firstName,
      role: role.name,
      sub: user._id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7h',
      secret: process.env.JWT_SECRET_KEY,
    });

    return {
      user: {
        ...user,
        role: role.name,
      },
      backendTokens: {
        accessToken,
      },
    };
  }
}
