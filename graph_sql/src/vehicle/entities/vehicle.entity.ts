import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  Float,
} from '@nestjs/graphql';
import { Country } from 'src/countries/entities/country.entity';
import { VehicleTypes } from 'src/enums/vehicles-type.enum';
import { Trip } from 'src/trips/entities/trip.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

registerEnumType(VehicleTypes, { name: 'VehicleType' });

@Entity('vehicles')
@ObjectType()
@Unique(['plates', 'countryId']) // Unique rule where we cannot have same plates inside of one country.
export class Vehicle {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Field()
  @Column()
  plates: string;

  @Field(() => VehicleTypes)
  @Column({
    name: 'vehicle_type',
    type: 'enum',
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
  @Column({ name: 'country_id' })
  countryId: string;

  @Field(() => Country)
  @ManyToOne(() => Country, (country) => country.vehicles)
  @JoinColumn({ name: 'country_id' })
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
