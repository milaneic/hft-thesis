import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CountriesModule } from 'src/countries/countries.module';
import { TripsModule } from 'src/trips/trips.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => CountriesModule),
    forwardRef(() => TripsModule),
  ],
  providers: [OrdersResolver, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
