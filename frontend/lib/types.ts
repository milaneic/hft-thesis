export type Role = {
  _id: string;
  name: string;
  updated_at: Date;
  created_at: Date;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  roleId: string;
  role: Role;
};

export type Country = {
  _id: string;
  name: string;
  country_code: string;
};

export type Order = {
  _id: string;
  origin: string;
  destination: string;
  price: number;
  weight: number;
  goodsType: "PALLET" | "BOX" | "COLLI";
  quantity: number;
  originCountryId: string;
  originCountry: Country;
  destinationCountryId: string;
  destinationCountry: Country;
  tripId: string;
  trip: Trip;
};

export type Event = {
  _id: string;
  name: string;
  description?: string;
  trips: Trip[];
  updated_at: Date;
  created_at: Date;
};

export type Trip = {
  _id: string;
  startOdometar: number;
  finishOdometar: number;
  vehicleId: string;
  driverId: string;
  active: boolean;
  ordersCount: number;
  ordersTotalAmount: number;
  firstOrderOrigin: string;
  lastOrderDestination: string;
  totalTripLength: number;
  eurosPerKm: number;
  orders: Order[];
  event_logs: Log[];
  vehicle: Vehicle;
  driver: Driver;
  lastEvent?: Log;
};

export type Driver = {
  _id: string;
  firstName: string;
  lastName: string;
  dob: string;
};

export type Vehicle = {
  _id: string;
  plates: string;
  vehicleType: "TRUCK" | "VAN" | "PICKUP";
  width: number;
  length: number;
  height: number;
  country: Country;
};

export type Log = {
  _id: string;
  tripId: string;
  eventId: string;
  event: Event;
  trip: Trip;
  description?: string;
  created_at: Date;
};
