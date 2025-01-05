import { Schema, Document } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Country } from 'src/countries/schemas/country.schema';
import { GoodsType } from 'src/enums/goods-type.enum';

@ObjectType()
export class Order extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  origin: string;

  @Field()
  destination: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  weight: number;

  @Field(() => GoodsType)
  goodsType: GoodsType;

  @Field(() => Float)
  quantity: number;

  @Field(() => Country)
  originCountry: Country;

  @Field(() => Country)
  destinationCountry: Country;

  @Field()
  updated_at: Date;

  @Field()
  created_at: Date;
}

export const OrderSchema = new Schema(
  {
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: Number, required: true },
    goodsType: { type: String, enum: Object.values(GoodsType), required: true },
    quantity: { type: Number, required: true },
    originCountry: { type: Object, required: true },
    destinationCountry: { type: Object, required: true },
  },
  {
    autoCreate: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);
