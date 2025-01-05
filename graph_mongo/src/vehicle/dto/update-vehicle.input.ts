import { CreateVehicleInput } from './create-vehicle.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVehicleInput extends PartialType(CreateVehicleInput) {
  @Field(() => String)
  id: string;
}
