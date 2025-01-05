import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateTripInput } from './create-trip.input';
import { InputType, Field, PartialType, Float } from '@nestjs/graphql';

@InputType()
export class UpdateTripInput extends PartialType(CreateTripInput) {
  @Field(() => String)
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float!)
  startOdometar: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float!)
  finishOdometar: number;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean!)
  active: boolean;
}
