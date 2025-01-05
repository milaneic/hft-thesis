import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
  Int,
} from '@nestjs/graphql';
import { Country } from 'src/countries/entities/country.entity';
import { GoodsTypes } from 'src/enums/goods-type.enum';
import { Trip } from 'src/trips/entities/trip.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

registerEnumType(GoodsTypes, {
  name: 'GoodsType',
});

@Entity('orders')
@ObjectType()
export class Order {
  @Field(() => ID, { description: 'Identifier for table countries.' })
  @PrimaryGeneratedColumn('uuid')
  _id: string;

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
    name: 'goods_type',
    type: 'enum',
    enum: GoodsTypes,
    default: GoodsTypes.COLLI,
  })
  goodsType: string;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => String)
  @Column({ name: 'origin_country_id' })
  originCountryId: string;

  @Field((type) => Country)
  @ManyToOne(() => Country, (country) => country.ordersAsOrigin)
  @JoinColumn({ name: 'origin_country_id' })
  originCountry: Country;

  @Field(() => String)
  @Column({ name: 'destination_country_id' })
  destinationCountryId: string;

  @Field((type) => Country)
  @ManyToOne(() => Country, (country) => country.ordersAsDestination)
  @JoinColumn({ name: 'destination_country_id' })
  destinationCountry: Country;

  @Field((type) => String)
  @Column({ name: 'trip_id' })
  tripId: string;

  @Field((type) => Trip)
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
