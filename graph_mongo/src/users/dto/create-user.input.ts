import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsStrongPassword,
  IsString,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  lastName: string;

  @IsNotEmpty({ message: 'Please provide an email.' })
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty({ message: 'Please provide a passowrd.' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { message: 'Password not strong enough' },
  )
  @Field()
  password: string;

  @IsNotEmpty()
  @IsDateString({ strict: true })
  @Field()
  dob: string;

  @Field(() => String, { nullable: true })
  roleId?: string;
}
