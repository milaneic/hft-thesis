import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Order } from 'src/orders/entities/order.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('countries')
@ObjectType()
export class Country {
  @Field(() => ID, { description: 'Identifier for table countries.' })
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Field()
  @Column()
  name: string;

  @Field({ description: 'Country code column consolidated ISO3166 standard.' })
  @Column({ unique: true })
  country_code: string;

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
