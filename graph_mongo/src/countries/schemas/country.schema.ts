import { Schema, Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Country extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  country_code: string;

  @Field()
  updated_at: Date;

  @Field()
  created_at: Date;
}

export const CountrySchema = new Schema(
  {
    name: { type: String, required: true },
    country_code: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
