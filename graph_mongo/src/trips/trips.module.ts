import { forwardRef, Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsResolver } from './trips.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './schemas/trip.schema';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { DriversModule } from 'src/drivers/drivers.module';
import { EventSchema } from 'src/events/schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trip.name, schema: TripSchema },
      { name: Event.name, schema: EventSchema },
    ]),
    forwardRef(() => VehicleModule),
    forwardRef(() => DriversModule),
  ],
  providers: [TripsResolver, TripsService],
  exports: [TripsService],
})
export class TripsModule {}
