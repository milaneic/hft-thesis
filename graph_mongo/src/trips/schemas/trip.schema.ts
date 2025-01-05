import { Schema, Document } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Order } from 'src/orders/schemas/order.schema';
import { Vehicle } from 'src/vehicle/schemas/vehicle.schema';
import { Driver } from 'src/drivers/schemas/driver.schema';
import { Log } from 'src/logs/schemas/log.schema';

@ObjectType()
export class Trip extends Document {
  @Field(() => ID)
  _id: string;

  @Field(() => Float)
  startOdometar: number;

  @Field(() => Float, { nullable: true })
  finishOdometar?: number;

  @Field(() => Boolean)
  active: boolean;

  @Field()
  updated_at: Date;

  @Field()
  created_at: Date;

  @Field(() => [Order], { nullable: true })
  orders?: Order[];

  @Field(() => [Log], { nullable: true })
  event_logs?: Log[];

  @Field(() => Vehicle)
  vehicle: Vehicle;

  @Field(() => Driver)
  driver: Driver;
}

export const TripSchema = new Schema(
  {
    startOdometar: { type: Number, required: true },
    finishOdometar: { type: Number, required: false },
    active: { type: Boolean, default: true },
    orders: [{ type: Object }],
    event_logs: [{ type: Object }],
    vehicle: { type: Object, required: true },
    driver: { type: Object, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);
