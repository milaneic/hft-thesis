import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.input';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/schemas/role.schema';

export interface LoginResponse {
  user: {
    _id: string;
    firstName: string;
    email: string;
    role: string;
  };
  backendTokens: {
    accessToken: string;
  };
}
export interface ValidateResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  dob: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<ValidateResponse> {
    const user = await this.usersService.findByEmail(loginDto.username);
    if (user && compareSync(loginDto.password, user.password)) {
      return user;
    }

    throw new UnauthorizedException('Invalid creadentials');
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto);

    const payload = {
      username: user.email,
      name: user.firstName,
      role: user.role.name,
      sub: user._id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });

    return {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role.name,
      },
      backendTokens: {
        accessToken,
      },
    };
  }
}
