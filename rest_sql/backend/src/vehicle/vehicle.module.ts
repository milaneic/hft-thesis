import { forwardRef, Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { TripsModule } from 'src/trips/trips.module';
import { DriversModule } from 'src/drivers/drivers.module';
import { CountriesModule } from 'src/countries/countries.module';
import { VehicleController } from './vehicle.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    forwardRef(() => TripsModule),
    forwardRef(() => CountriesModule),
    DriversModule,
  ],
  providers: [VehicleService],
  exports: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule {}
