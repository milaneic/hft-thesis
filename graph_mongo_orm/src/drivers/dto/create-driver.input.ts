import { InputType, Field } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateDriverInput {
  @IsNotEmpty({ message: 'Please provide value for drivers first name.' })
  @Field()
  firstName: string;

  @IsNotEmpty({ message: 'Please provide value for drivers last name.' })
  @Field()
  lastName: string;

  @IsNotEmpty({ message: 'Please provide value for drivers date of birth.' })
  @IsDateString()
  @Field()
  dob: string;
}
