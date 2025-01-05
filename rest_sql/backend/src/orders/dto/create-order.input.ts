import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GoodsTypes } from 'src/enums/goods-type.enum';

@InputType()
export class CreateOrderInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  origin: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  destination: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  weight: number;

  @IsNotEmpty()
  @IsEnum(GoodsTypes, {
    message:
      'Invalid Goods Type. Please provide one of theses: Pallet, Box, Colli.',
  })
  @Field(() => GoodsTypes)
  goodsType: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => String)
  originCountryId: string;

  @Field(() => String)
  destinationCountryId: string;

  @Field(() => String)
  tripId: string;
}
