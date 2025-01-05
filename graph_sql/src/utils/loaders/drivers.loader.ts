import * as DataLoader from 'dataloader';
import { DriversService } from 'src/drivers/drivers.service';
import { Driver } from 'src/drivers/entities/driver.entity';

export default function createDriversLoader(driversService: DriversService) {
  return new DataLoader<string, Driver>(async (driversIds: string[]) => {
    const drivers = await driversService.findByIds(driversIds);

    return driversIds.map((id) => drivers.find((driver) => driver._id === id));
  });
}
