import { registerEnumType } from '@nestjs/graphql';

export enum VehicleType {
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  PICKUP = 'PICKUP',
}

registerEnumType(VehicleType, {
  name: 'VehicleType',
});
