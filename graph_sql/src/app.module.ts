import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
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
import { CountriesService } from './countries/countries.service';
import createCountriesLoader from './utils/loaders/countries.loader';
import { OrdersService } from './orders/orders.service';
import {
  createVehiclesLoader,
  createVehiclesByCountryLoader,
} from './utils/loaders/vehicles.loader';
import { VehicleService } from './vehicle/vehicle.service';
import { DriversService } from './drivers/drivers.service';
import createDriversLoader from './utils/loaders/drivers.loader';
import {
  createOrdersLoader,
  createOrdersByOriginCountryLoader,
} from './utils/loaders/order.loader';
import {
  createTripsLoader,
  createTripsByDriversLoader,
} from './utils/loaders/trips.loader';
import { TripsService } from './trips/trips.service';
import { RolesService } from './roles/roles.service';
import { UsersService } from './users/users.service';
import createRolesLoader from './utils/loaders/roles.loader';
import createUsersLoader from './utils/loaders/users.loader';
import { EventsService } from './events/events.service';
import createEventsLoader from './utils/loaders/events.loader';
import { LogsService } from './logs/logs.service';
import createlogsLoader from './utils/loaders/logs.loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [
        RolesModule,
        UsersModule,
        TripsModule,
        EventsModule,
        LogsModule,
        CountriesModule,
        OrdersModule,
        VehicleModule,
        DriversModule,
      ],
      useFactory: (
        rolesService: RolesService,
        usersService: UsersService,
        tripsService: TripsService,
        eventsService: EventsService,
        logsService: LogsService,
        countriesService: CountriesService,
        ordersService: OrdersService,
        vehiclesService: VehicleService,
        driversService: DriversService,
      ) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        context: () => ({
          rolesLoader: createRolesLoader(rolesService),
          usersLoader: createUsersLoader(usersService),
          tripsLoader: createTripsLoader(tripsService),
          tripsByDriverLoader: createTripsByDriversLoader(tripsService),
          eventsLoader: createEventsLoader(eventsService),
          logsLoader: createlogsLoader(logsService),
          countriesLoader: createCountriesLoader(countriesService),
          ordersLoader: createOrdersLoader(ordersService),
          ordersByOriginCountryLoader:
            createOrdersByOriginCountryLoader(ordersService),
          ordersByDestiantionCountryLoader:
            createOrdersByOriginCountryLoader(ordersService),
          vehiclesLoader: createVehiclesLoader(vehiclesService),
          vehiclesByCountryLoader:
            createVehiclesByCountryLoader(vehiclesService),
          driversLoader: createDriversLoader(driversService),
        }),
      }),
      inject: [
        RolesService,
        UsersService,
        TripsService,
        EventsService,
        LogsService,
        CountriesService,
        OrdersService,
        VehicleService,
        DriversService,
      ],
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
      timezone: 'Z',
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
})
export class AppModule {}
