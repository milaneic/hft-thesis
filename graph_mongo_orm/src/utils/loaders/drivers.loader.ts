import * as DataLoader from 'dataloader';
import { DriversService } from 'src/drivers/drivers.service';
import { Driver } from 'src/drivers/entities/driver.entity';
import { ObjectId } from 'mongodb';

export default function createDriversLoader(driversService: DriversService) {
  return new DataLoader<ObjectId, Driver>(async (driversIds: ObjectId[]) => {
    const drivers = await driversService.findByIds(driversIds);

    return driversIds.map((id) =>
      drivers.find((driver) => driver._id.equals(id)),
    );
  });
}
