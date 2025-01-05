import * as DataLoader from 'dataloader';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { ObjectId } from 'mongodb';

export function createVehiclesLoader(vehiclesService: VehicleService) {
  return new DataLoader<ObjectId, Vehicle>(async (vehiclesIds: ObjectId[]) => {
    const vehicles = await vehiclesService.findByIds(vehiclesIds);

    return vehiclesIds.map((id) =>
      vehicles.find((vehicle) => vehicle._id.equals(id)),
    );
  });
}

export function createVehiclesByCountryLoader(vehiclesService: VehicleService) {
  return new DataLoader<string, Vehicle[]>(async (countrisIds: string[]) => {
    const vehicles = await vehiclesService.findByCountryIds(countrisIds);

    return countrisIds.map((countryId) =>
      vehicles.filter((vehicle) => vehicle.countryId === countryId),
    );
  });
}
