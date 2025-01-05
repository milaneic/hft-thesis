import { Schema, Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from 'src/roles/schemas/role.schema'; // Adjust the path if needed

@ObjectType()
export class User extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  dob: Date;

  @Field(() => Role)
  role: Role;

  @Field()
  updated_at: Date;

  @Field()
  created_at: Date;
}

export const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    role: { type: Object, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);
