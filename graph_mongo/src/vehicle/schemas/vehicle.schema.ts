import { Schema, Document } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Country } from 'src/countries/schemas/country.schema'; // You can remove this import if no longer needed.
import { VehicleType } from 'src/enums/vehicles-type.enum';

@ObjectType()
export class Vehicle extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  plates: string;

  @Field()
  vehicleType: string;

  @Field(() => Float)
  width: number;

  @Field(() => Float)
  length: number;

  @Field(() => Float)
  height: number;

  @Field(() => Country)
  country: Country;
}

export const VehicleSchema = new Schema({
  plates: { type: String, required: true },
  vehicleType: {
    type: String,
    enum: Object.values(VehicleType),
    required: true,
  },
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  height: { type: Number, required: true },
  country: { type: Object, required: true },
});
