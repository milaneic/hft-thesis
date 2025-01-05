import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/roles/roles.module';
import { PasswordUtils } from 'src/utils/password-utils';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  providers: [UsersResolver, UsersService, PasswordUtils, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
