import { forwardRef, Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesResolver } from './countries.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    forwardRef(() => OrdersModule),
    VehicleModule,
  ],
  providers: [CountriesResolver, CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
