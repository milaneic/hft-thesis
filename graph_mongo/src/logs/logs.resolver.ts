import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LogsService } from './logs.service';
import { CreateLogInput } from './dto/create-log.input';
import { Log } from './schemas/log.schema';

@Resolver(() => Log)
export class LogsResolver {
  constructor(private readonly logsService: LogsService) {}

  @Mutation(() => Log)
  createLog(@Args('createLogInput') createLogInput: CreateLogInput) {
    return this.logsService.create(createLogInput);
  }
}
