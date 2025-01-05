import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UsersModule } from 'src/users/users.module';
import { RolesController } from './roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => UsersModule)],
  providers: [RolesService],
  exports: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
