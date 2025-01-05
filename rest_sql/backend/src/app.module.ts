import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { User } from './users/entities/user.entity';
import { CountriesModule } from './countries/countries.module';
import { Country } from './countries/entities/country.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { TripsModule } from './trips/trips.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { Trip } from './trips/entities/trip.entity';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { DriversModule } from './drivers/drivers.module';
import { Driver } from './drivers/entities/driver.entity';
import { EventsModule } from './events/events.module';
import { Event } from './events/entities/event.entity';
import { LogsModule } from './logs/logs.module';
import { Log } from './logs/entities/log.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./.env`,
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQLDB_HOST,
      port: +process.env.MYSQLDB_PORT,
      username: process.env.MYSQLDB_USER,
      password: process.env.MYSQLDB_PASSWORD,
      database: process.env.MYSQLDB_DATABASE,
      synchronize: false,
      logging: true,
      entities: [User, Role, Country, Order, Trip, Vehicle, Driver, Event, Log],
    }),
    UsersModule,
    RolesModule,
    CountriesModule,
    OrdersModule,
    TripsModule,
    VehicleModule,
    DriversModule,
    EventsModule,
    LogsModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
