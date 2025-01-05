import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateLogInput {
  @Field(() => String)
  tripId: string;

  @Field(() => String)
  eventId: string;

  @Field({ nullable: true })
  description?: string;
}
