import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateTripInput {
  @IsNotEmpty({ message: 'Please provide start Odometar value.' })
  @IsNumber()
  @Field(() => Float)
  startOdometar: number;

  @IsNotEmpty({ message: 'Please provide finish Odometar value.' })
  @IsNumber()
  @Field(() => Float, { nullable: true })
  finishOdometar?: number;

  @IsNotEmpty({ message: 'Please choose if trrip is active.' })
  @Field(() => Boolean)
  active: boolean;

  @IsNotEmpty({ message: 'Please provide finish Odometar value.' })
  @Field(() => String)
  vehicleId: string;

  @IsNotEmpty({ message: 'Please provide finish Odometar value.' })
  @Field(() => String)
  driverId: string;
}
