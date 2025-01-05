import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
  Int,
} from '@nestjs/graphql';
import { GoodsTypes } from 'src/enums/goods-type.enum';
import { ObjectId } from 'mongodb';
import { Country } from 'src/countries/entities/country.entity';
import { Trip } from 'src/trips/entities/trip.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

registerEnumType(GoodsTypes, {
  name: 'GoodsType',
});

@Entity('orders')
@ObjectType()
export class Order {
  @Field(() => ID, { description: 'Identifier for table countries.' })
  @ObjectIdColumn()
  _id: ObjectId;

  @Field()
  @Column()
  origin: string;

  @Field()
  @Column()
  destination: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 8, scale: 2 })
  weight: number;

  @Field(() => GoodsTypes)
  @Column({
    enum: GoodsTypes,
    default: GoodsTypes.COLLI,
  })
  goodsType: string;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => String)
  @Column()
  originCountryId: string;

  @Field(() => Country)
  @ManyToOne(() => Country, (country) => country.ordersAsOrigin)
  originCountry: Country;

  @Field(() => String)
  @Column()
  destinationCountryId: string;

  @Field(() => Country)
  @ManyToOne(() => Country, (country) => country.ordersAsDestination)
  destinationCountry: Country;

  @Field(() => String)
  @Column()
  tripId: string;

  @Field(() => Trip)
  @ManyToOne(() => Trip, (trip) => trip.orders)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

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
