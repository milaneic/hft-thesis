import { InputType, Field } from '@nestjs/graphql';
import { IsISO31661Alpha2, IsString } from 'class-validator';

@InputType()
export class CreateCountryInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsISO31661Alpha2()
  country_code: string;
}
