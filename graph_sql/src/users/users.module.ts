import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtils } from 'src/utils/password-utils';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  providers: [UsersResolver, UsersService, PasswordUtils, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
