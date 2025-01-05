import { CreateLogInput } from './create-log.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLogInput extends PartialType(CreateLogInput) {}
