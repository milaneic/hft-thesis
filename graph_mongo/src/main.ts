import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { AuthMiddleware } from './middleware/AuthMiddleware';
// import { RoleUserSeeder } from './database/seeders/role-user.seed';
// import { CountryDriverVehicleSeeder } from './database/seeders/country-driver-vehicle.seed';
// import { TripOrderSeeder } from './database/seeders/trip-orders.seed';
// import { EventEventLogSeeder } from './database/seeders/event-eventlog.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  //   credentials: false,
  // });
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  // Database seeders
  // const roleUserSeeder = app.get(RoleUserSeeder);
  // const countryDriverVehicleSeeder = app.get(CountryDriverVehicleSeeder);
  // const tripOrdersSeeder = app.get(TripOrderSeeder);
  // const eventEventLogSeeder = app.get(EventEventLogSeeder);
  // await roleUserSeeder.seed();
  // await countryDriverVehicleSeeder.seed();
  // await tripOrdersSeeder.seed();
  // await eventEventLogSeeder.seed();

  const port = process.env.BACKEND_GRAPH_MONGO_PORT || 8083;

  await app.listen(port, () => {
    console.log(`🚀🚀🚀 SERVER RUNNING ON PORT ${port} 🚀🚀🚀`);
  });
}
bootstrap();
