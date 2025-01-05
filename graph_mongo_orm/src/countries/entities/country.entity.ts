import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Order } from 'src/orders/entities/order.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity('countries')
@ObjectType()
export class Country {
  @Field(() => ID, { description: 'Identifier for table countries.' })
  @ObjectIdColumn()
  _id: ObjectId;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  country_code: string;

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

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.originCountryId)
  ordersAsOrigin?: Order[];

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.destinationCountryId)
  ordersAsDestination?: Order[];

  @Field(() => [Vehicle])
  @OneToMany(() => Vehicle, (vehicle) => vehicle.countryId)
  vehicles: Vehicle[];
}
