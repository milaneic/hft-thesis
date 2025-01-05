import * as DataLoader from 'dataloader';
import { Trip } from 'src/trips/entities/trip.entity';
import { TripsService } from 'src/trips/trips.service';
import { ObjectId } from 'typeorm';

export function createTripsLoader(tripsService: TripsService) {
  return new DataLoader<ObjectId, Trip>(async (tripIds: ObjectId[]) => {
    const trips = await tripsService.findByIds(tripIds);
    return tripIds.map((id) => trips.find((trip) => trip._id.equals(id)));
  });
}

export function createTripsByDriversLoader(tripsService: TripsService) {
  return new DataLoader<string, Trip[]>(async (driverIds: string[]) => {
    const trips = await tripsService.findByDriverIds(driverIds);
    return driverIds.map((id) => trips.filter((trip) => trip.driverId === id));
  });
}
