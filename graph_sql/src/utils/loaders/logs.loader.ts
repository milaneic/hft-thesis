import * as DataLoader from 'dataloader';
import { Log } from 'src/logs/entities/log.entity';
import { LogsService } from 'src/logs/logs.service';

export default function createlogsLoader(logsService: LogsService) {
  return new DataLoader<string, Log[]>(async (tripIds: string[]) => {
    const logs = await logsService.findByTripIds(tripIds);

    return tripIds.map((tripId) => logs.filter((log) => log.tripId === tripId));
  });
}
