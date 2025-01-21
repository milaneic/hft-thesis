import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateLogInput {
  @IsString()
  @Field()
  tripId: string;

  @IsString()
  @Field()
  eventId: string;

  @Field({ nullable: true })
  description?: string;
}
