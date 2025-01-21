import { Schema, Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Event } from 'src/events/schemas/event.schema';

@ObjectType()
export class Log extends Document {
  @Field(() => ID)
  _id: string;

  @Field(() => Event)
  event: Event;

  @Field()
  description: string;

  @Field()
  created_at: Date;
}

export const LogsSchema = new Schema(
  {
    event: { type: Object, required: true },
    description: { type: String, required: true },
  },
  {
    autoCreate: false,
    timestamps: { createdAt: 'created_at' },
  },
);
