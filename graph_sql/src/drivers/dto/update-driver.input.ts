import { CreateDriverInput } from './create-driver.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDriverInput extends PartialType(CreateDriverInput) {
  @Field(() => String)
  id: string;
}
