import { forwardRef, Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { EventsModule } from 'src/events/events.module';
import { TripsModule } from 'src/trips/trips.module';
import { LogsController } from './logs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Log]),
    forwardRef(() => EventsModule),
    forwardRef(() => TripsModule),
  ],
  providers: [LogsService],
  exports: [LogsService],
  controllers: [LogsController],
})
export class LogsModule {}
