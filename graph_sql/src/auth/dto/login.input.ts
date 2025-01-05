import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class LoginDto {
  @IsNotEmpty({ message: 'Please provide input for username.' })
  @IsEmail()
  @Field()
  username: string;

  @IsNotEmpty({ message: 'Please provide input for password.' })
  @IsString()
  @IsStrongPassword()
  password: string;
}
