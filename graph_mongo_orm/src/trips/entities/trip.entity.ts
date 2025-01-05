import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Driver } from 'src/drivers/entities/driver.entity';
import { Log } from 'src/logs/entities/log.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  ObjectIdColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trips')
@ObjectType()
export class Trip {
  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectId;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 8, scale: 1 })
  startOdometar: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 8, scale: 1 })
  finishOdometar?: number;

  @Field(() => Boolean, { defaultValue: true })
  @Column()
  active: boolean;

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.tripId)
  orders: Order[];

  @Field(() => String)
  @Column()
  vehicleId: string;

  @Field(() => Vehicle)
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips)
  vehicle: Vehicle;

  @Field(() => String)
  @Column()
  driverId: string;

  @Field(() => Driver)
  @ManyToOne(() => Driver, (driver) => driver.trips)
  driver: Driver;

  @OneToMany(() => Log, (event_log) => event_log.tripId)
  @Field(() => [Log], { nullable: true })
  event_logs?: Log[];

  @Field()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @Field()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
