import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtils } from 'src/utils/password-utils';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  providers: [UsersService, PasswordUtils, JwtService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
