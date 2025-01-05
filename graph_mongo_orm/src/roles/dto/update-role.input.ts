import { IsString } from 'class-validator';
import { CreateRoleInput } from './create-role.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @IsString()
  @Field(() => String)
  id: string;
}
