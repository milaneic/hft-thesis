import { forwardRef, Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversResolver } from './drivers.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from './schemas/driver.schema';
import { TripsModule } from 'src/trips/trips.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
    forwardRef(() => TripsModule),
  ],
  providers: [DriversResolver, DriversService],
  exports: [DriversService],
})
export class DriversModule {}
