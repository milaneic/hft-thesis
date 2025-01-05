import { CreateCountryInput } from './create-country.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCountryInput extends PartialType(CreateCountryInput) {
  @Field(() => String)
  id: string;
}
