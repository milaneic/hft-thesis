import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

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

  @IsNotEmpty({ message: 'Please choose vehicle.' })
  @Field(() => String)
  vehicleId: string;

  @IsNotEmpty({ message: 'Please choose driver.' })
  @Field(() => String)
  driverId: string;

  @Field(() => Boolean)
  active?: boolean;
}
