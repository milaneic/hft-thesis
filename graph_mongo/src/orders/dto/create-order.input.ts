import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GoodsType } from 'src/enums/goods-type.enum';

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
  @IsEnum(GoodsType, {
    message:
      'Invalid Goods Type. Please provide one of theses: Pallet, Box, Colli.',
  })
  @Field(() => GoodsType)
  goodsType: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  originCountryId: string;

  @Field()
  destinationCountryId: string;

  @Field()
  tripId: string;
}
