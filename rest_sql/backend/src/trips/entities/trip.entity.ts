import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Driver } from 'src/drivers/entities/driver.entity';

import { Log } from 'src/logs/entities/log.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trips')
@ObjectType()
export class Trip {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  _id: string;

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
  @OneToMany(() => Order, (order) => order.trip)
  orders: Order[];

  @Field(() => String)
  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  @Field(() => Vehicle)
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Field(() => String)
  @Column({ name: 'driver_id' })
  driverId: string;

  @Field(() => Driver)
  @ManyToOne(() => Driver, (driver) => driver.trips)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  // @ManyToMany(() => Event, (event) => event.trips)
  // @JoinTable({
  //   name: 'event_logs', // This is the table that acts as the join table
  //   joinColumn: { name: 'trip_id', referencedColumnName: '_id' },
  //   inverseJoinColumn: { name: 'event_id', referencedColumnName: '_id' },
  // })
  // @Field(() => [Log], { nullable: 'itemsAndList' })
  // event_logs?: Log[];

  @OneToMany(() => Log, (event_log) => event_log.trip)
  @Field(() => [Log])
  event_logs: Log[];

  @Field()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
