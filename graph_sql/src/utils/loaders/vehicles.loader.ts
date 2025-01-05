import * as DataLoader from 'dataloader';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';

export function createVehiclesLoader(vehiclesService: VehicleService) {
  return new DataLoader<string, Vehicle>(async (vehiclesIds: string[]) => {
    const vehicles = await vehiclesService.findByIds(vehiclesIds);

    return vehiclesIds.map((id) =>
      vehicles.find((vehicle) => vehicle._id === id),
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
