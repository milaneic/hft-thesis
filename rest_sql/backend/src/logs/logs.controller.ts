import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogInput } from './dto/create-log.input';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async findAll() {
    return this.logsService.findAll();
  }

  @Get('logs/:id')
  async findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }

  @Get('last-event/:id')
  async findLastEventByTripId(@Param('id') id: string) {
    return this.logsService.findLastEventByTripId(id);
  }

  @Post()
  async create(@Body() createLogInput: CreateLogInput) {
    return await this.logsService.create(createLogInput);
  }
}
