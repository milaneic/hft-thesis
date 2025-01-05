import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CountriesModule } from 'src/countries/countries.module';
import { TripsModule } from 'src/trips/trips.module';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => CountriesModule),
    forwardRef(() => TripsModule),
  ],
  providers: [OrdersService],
  exports: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
