import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogsSchema } from './schemas/log.schema';
import { LogsResolver } from './logs.resolver';
import { LogsService } from './logs.service';
import { EventsModule } from 'src/events/events.module';
import { TripsModule } from 'src/trips/trips.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogsSchema }]),
    TripsModule,
    EventsModule,
  ],
  providers: [LogsResolver, LogsService],
  exports: [LogsService],
})
export class LogsModule {}
