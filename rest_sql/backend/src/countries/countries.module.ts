import { forwardRef, Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { CountriesController } from './countries.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    forwardRef(() => OrdersModule),
    VehicleModule,
  ],
  providers: [CountriesService],
  exports: [CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}
