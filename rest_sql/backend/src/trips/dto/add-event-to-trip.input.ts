import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddEventToTripInput {
  @Field(() => String)
  tripId: string;

  @Field(() => [String])
  eventIds: string[]; // Array of event IDs to link with the trip
}
