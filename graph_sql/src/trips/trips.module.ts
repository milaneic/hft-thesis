import { forwardRef, Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsResolver } from './trips.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { LogsModule } from 'src/logs/logs.module';
import { DriversModule } from 'src/drivers/drivers.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip, Event]),
    EventsModule,
    forwardRef(() => OrdersModule),
    forwardRef(() => VehicleModule),
    forwardRef(() => DriversModule),
    forwardRef(() => LogsModule),
  ],
  providers: [TripsResolver, TripsService],
  exports: [TripsService],
})
export class TripsModule {}
