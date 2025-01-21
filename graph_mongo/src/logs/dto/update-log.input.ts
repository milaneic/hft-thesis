import { CreateLogInput } from './create-log.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLogInput extends PartialType(CreateLogInput) {
  @Field(() => String)
  id: string;
}
