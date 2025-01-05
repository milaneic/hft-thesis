import * as DataLoader from 'dataloader';
import { Event } from 'src/events/entities/event.entity';
import { EventsService } from 'src/events/events.service';
import { ObjectId } from 'typeorm';

export default function createEventsLoader(eventsService: EventsService) {
  return new DataLoader<string, Event>(async (eventsIds: string[]) => {
    const events = await eventsService.findByIds(eventsIds);

    return eventsIds.map((id) =>
      events.find((event) => event._id === new ObjectId(id)),
    );
  });
}
