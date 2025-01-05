import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  Float,
} from '@nestjs/graphql';
import { VehicleTypes } from 'src/enums/vehicles-type.enum';
import { ObjectId } from 'mongodb';
import { Country } from 'src/countries/entities/country.entity';
import { Trip } from 'src/trips/entities/trip.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  ObjectIdColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

registerEnumType(VehicleTypes, { name: 'VehicleType' });

@Entity('vehicles')
@ObjectType()
export class Vehicle {
  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectId;

  @Field()
  @Column()
  plates: string;

  @Field(() => VehicleTypes)
  @Column({
    enum: VehicleTypes,
    default: VehicleTypes.TRUCK,
  })
  vehicleType: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  width: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  length: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  height: number;

  @Field(() => [Trip])
  @OneToMany(() => Trip, (trip) => trip.vehicleId)
  trips: Trip[];

  @Field(() => String)
  @Column()
  countryId: string;

  @Field(() => Country)
  @ManyToOne(() => Country, (country) => country.vehicles)
  country: Country;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
