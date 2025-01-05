import { forwardRef, Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsResolver } from './logs.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { EventsModule } from 'src/events/events.module';
import { TripsModule } from 'src/trips/trips.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Log]),
    forwardRef(() => EventsModule),
    forwardRef(() => TripsModule),
  ],
  providers: [LogsResolver, LogsService],
  exports: [LogsService],
})
export class LogsModule {}
