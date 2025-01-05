import { forwardRef, Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { TripsModule } from 'src/trips/trips.module';
import { DriversController } from './drivers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Driver]), forwardRef(() => TripsModule)],
  providers: [DriversService],
  exports: [DriversService],
  controllers: [DriversController],
})
export class DriversModule {}
