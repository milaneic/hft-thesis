import { forwardRef, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { LogsModule } from 'src/logs/logs.module';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), forwardRef(() => LogsModule)],
  providers: [EventsService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
