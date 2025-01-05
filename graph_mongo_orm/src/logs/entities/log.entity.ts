import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Event } from 'src/events/entities/event.entity';
import { Trip } from 'src/trips/entities/trip.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectIdColumn,
} from 'typeorm';

@Entity('event_logs')
@ObjectType()
export class Log {
  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectId;

  @Field(() => String)
  @Column()
  tripId: string;

  @Field(() => String)
  @Column()
  eventId: string;

  @Field(() => Trip)
  @ManyToOne(() => Trip, (trip) => trip.event_logs)
  @JoinColumn()
  trip: Trip;

  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.logs)
  @JoinColumn()
  event: Event;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
