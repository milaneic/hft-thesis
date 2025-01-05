import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CreateEventInput } from 'src/events/dto/create-event.input';
import { CreateOrderInput } from 'src/orders/dto/create-order.input';

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

  @Field(() => Boolean)
  active?: boolean;

  @ValidateNested({ each: true })
  @Field(() => [CreateOrderInput], { nullable: true })
  orders?: CreateOrderInput[];

  @ValidateNested({ each: true })
  @Field(() => [CreateEventInput], { nullable: true })
  events?: CreateEventInput[];

  @Field(() => String)
  vehicleId: string;

  @Field(() => String)
  driverId: string;
}
