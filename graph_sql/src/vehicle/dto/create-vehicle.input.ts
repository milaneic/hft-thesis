import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { VehicleTypes } from 'src/enums/vehicles-type.enum';

@InputType()
export class CreateVehicleInput {
  @IsNotEmpty({ message: 'Please provide plate for vehicle.' })
  @IsString()
  @Field()
  plates: string;

  @IsNotEmpty()
  @IsEnum(VehicleTypes, {
    message:
      'Invalid Vehicle Type. Please provide one of theses: Truck, Van, Pickup.',
  })
  @Field(() => VehicleTypes)
  vehicleType: string;

  @IsNotEmpty({ message: 'Please provide a value for vehicle width.' })
  @IsNumber()
  @Field()
  width: number;

  @IsNotEmpty({ message: 'Please provide a value for vehicle length.' })
  @IsNumber()
  @Field()
  length: number;

  @IsNotEmpty({ message: 'Please provide a value for vehicle heigth.' })
  @IsNumber()
  @Field()
  height: number;

  @IsNotEmpty({ message: 'Please provide id for country.' })
  @Field(() => String)
  countryId: string;
}
