import { gql } from "@apollo/client";

export const QUERY_GET_USERS = gql`
  query GetUsers {
    users {
      _id
      firstName
      lastName
      email
      dob
      created_at
      role {
        _id
        name
      }
    }
  }
`;

export const QUERY_GET_USER = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      _id
      firstName
      lastName
      email
      dob
      role {
        _id
      }
    }
  }
`;

export const MUTATION_CREATE_USER = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $dob: String!
    $roleId: String
  ) {
    createUser(
      createUserInput: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        dob: $dob
        roleId: $roleId
      }
    ) {
      _id
      firstName
      lastName
      email
      dob
      created_at
      role {
        _id
        name
      }
    }
  }
`;

export const MUTATION_ADD_ROLE = gql`
  mutation CreateRole($name: String!) {
    createRole(createRoleInput: { name: $name }) {
      _id
      name
      updated_at
      created_at
    }
  }
`;

export const MUTATION_UPDATE_USER = gql`
  mutation UpdateUser(
    $id: String!
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String
    $dob: String!
    $roleId: String!
  ) {
    updateUser(
      updateUserInput: {
        id: $id
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        dob: $dob
        roleId: $roleId
      }
    ) {
      _id
      firstName
      lastName
      email
      dob
      role {
        _id
        name
      }
    }
  }
`;

export const MUTATION_DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    removeUser(id: $id)
  }
`;

export const QUERY_GET_ROLE_NAMES = gql`
  query GetRoles {
    roles {
      _id
      name
    }
  }
`;

export const QUERY_GET_ROLES = gql`
  query GetRoles {
    roles {
      _id
      name
      updated_at
      created_at
    }
  }
`;

export const QUERY_GET_ROLE = gql`
  query GetRole($id: String!) {
    role(id: $id) {
      _id
      name
    }
  }
`;

export const MUTATION_UPDATE_ROLE = gql`
  mutation UpdateRole($id: String!, $name: String!) {
    updateRole(updateRoleInput: { id: $id, name: $name }) {
      _id
      name
      updated_at
      created_at
    }
  }
`;

export const MUTATION_DELETE_ROLE = gql`
  mutation DeleteRole($id: String!) {
    removeRole(id: $id)
  }
`;

export const QUERY_GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      _id
      name
      country_code
      updated_at
      created_at
    }
  }
`;

export const QUERY_GET_COUNTRY = gql`
  query GetCountry($id: String!) {
    country(id: $id) {
      _id
      name
      country_code
    }
  }
`;

export const MUTATION_CREATE_COUNTRY = gql`
  mutation CreateCountry($name: String!, $country_code: String!) {
    createCountry(
      createCountryInput: { name: $name, country_code: $country_code }
    ) {
      _id
      name
      country_code
      updated_at
      created_at
    }
  }
`;

export const QUERY_UPDATE_COUNTRY = gql`
  mutation UpdateCountry($id: String!, $name: String!, $country_code: String!) {
    updateCountry(
      updateCountryInput: { id: $id, name: $name, country_code: $country_code }
    ) {
      _id
      name
      country_code
      updated_at
      created_at
    }
  }
`;

export const QUERY_GET_DRIVERS = gql`
  query GetDrivers {
    drivers {
      _id
      firstName
      lastName
      dob
      updated_at
      created_at
    }
  }
`;

export const QUERY_GET_DRIVER = gql`
  query GetDriver($id: String!) {
    driver(id: $id) {
      _id
      firstName
      lastName
      dob
    }
  }
`;

export const MUTATION_UPDATE_DRIVER = gql`
  mutation UpdateDriver(
    $id: String!
    $firstName: String!
    $lastName: String!
    $dob: String!
  ) {
    updateDriver(
      updateDriverInput: {
        id: $id
        firstName: $firstName
        lastName: $lastName
        dob: $dob
      }
    ) {
      _id
      firstName
      lastName
      dob
      updated_at
      created_at
    }
  }
`;

export const MUTATION_CREATE_DRIVER = gql`
  mutation CreateDriver(
    $firstName: String!
    $lastName: String!
    $dob: String!
  ) {
    createDriver(
      createDriverInput: {
        firstName: $firstName
        lastName: $lastName
        dob: $dob
      }
    ) {
      _id
      firstName
      lastName
      dob
      updated_at
      created_at
    }
  }
`;

export const MUTAITON_DELETE_DRIVER = gql`
  mutation DeleteDriver($id: String!) {
    removeDriver(id: $id)
  }
`;

export const QUERY_GET_TRIPS = gql`
  query GetTrips {
    trips {
      _id
      startOdometar
      finishOdometar
      active
      firstOrderOrigin
      lastOrderDestination
      ordersCount
      ordersTotalAmount
      totalTripLength
      eurosPerKm
      created_at
      orders {
        _id
        originCountry {
          _id
          name
          country_code
        }
        destinationCountry {
          _id
          name
          country_code
        }
        weight
        price
        quantity
      }
      # event_logs {
      #   _id
      #   event {
      #     _id
      #     name
      #     description
      #   }
      #   description
      # }
      vehicle {
        _id
        plates
        # width
        # length
        # height
        # country {
        #   _id
        #   name
        #   country_code
        # }
      }
      driver {
        # _id
        # firstName
        lastName
        # dob
      }
    }
  }
`;

export const QUERY_GET_TRIP = gql`
  query GetTrip($id: String!) {
    trip(id: $id) {
      _id
      startOdometar
      finishOdometar
      active
      firstOrderOrigin
      lastOrderDestination
      ordersCount
      ordersTotalAmount
      totalTripLength
      eurosPerKm
      orders {
        _id
        origin
        destination
        weight
        price
        quantity
        originCountry {
          name
        }
        destinationCountry {
          name
        }
      }
      event_logs {
        _id
        event {
          _id
          name
          description
        }
        description
        created_at
      }
      vehicle {
        _id
        plates
      }
      driver {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const MUTATION_CREATE_TRIP = gql`
  mutation CreateTrip(
    $startOdometar: Float!
    $finishOdometar: Float!
    $vehicleId: String!
    $driverId: String!
    $active: Boolean!
  ) {
    createTrip(
      createTripInput: {
        startOdometar: $startOdometar
        finishOdometar: $finishOdometar
        vehicleId: $vehicleId
        driverId: $driverId
        active: $active
      }
    ) {
      _id
      startOdometar
      finishOdometar
      active
      firstOrderOrigin
      lastOrderDestination
      ordersCount
      ordersTotalAmount
      totalTripLength
      eurosPerKm
      updated_at
      created_at
      orders {
        _id
        originCountry {
          _id
          name
          country_code
        }
        destinationCountry {
          _id
          name
          country_code
        }
        weight
        price
        quantity
      }
      event_logs {
        _id
        description
        event {
          _id
          name
          description
        }
      }
      vehicle {
        _id
        plates
        width
        length
        height
        country {
          _id
          name
          country_code
        }
      }
      driver {
        _id
        firstName
        lastName
        dob
      }
    }
  }
`;

export const MUTATION_UPDATE_TRIP = gql`
  mutation UpdateTrip(
    $id: String!
    $startOdometar: Float!
    $finishOdometar: Float!
    $vehicleId: String!
    $driverId: String!
    $active: Boolean!
  ) {
    updateTrip(
      updateTripInput: {
        id: $id
        startOdometar: $startOdometar
        finishOdometar: $finishOdometar
        vehicleId: $vehicleId
        driverId: $driverId
        active: $active
      }
    ) {
      _id
      startOdometar
      finishOdometar
      active
      firstOrderOrigin
      lastOrderDestination
      ordersCount
      ordersTotalAmount
      totalTripLength
      eurosPerKm
      orders {
        _id
        weight
        price
        quantity
        originCountry {
          _id
          name
          country_code
        }
        destinationCountry {
          _id
          name
          country_code
        }
      }
      event_logs {
        _id
        description
        event {
          _id
          name
          description
        }
      }
      vehicle {
        _id
        plates
        width
        length
        height
      }
      driver {
        _id
        firstName
        lastName
        dob
      }
    }
  }
`;

export const MUTATION_DELETE_TRIP = gql`
  mutation DeleteTrip($id: Int!) {
    removeTrip(id: $id)
  }
`;

export const QUERY_GET_ORDERS = gql`
  query GetOrders {
    orders {
      _id
      origin
      destination
      originCountry {
        name
      }
      destinationCountry {
        name
      }
      price
      weight
      quantity
      created_at
    }
  }
`;

export const QUERY_GET_ORDER = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      _id
      origin
      destination
      originCountry {
        _id
        name
      }
      destinationCountry {
        _id
        name
      }
      price
      weight
      goodsType
      quantity
    }
  }
`;

export const MUTATION_CREATE_ORDER = gql`
  mutation CreateOrder(
    $origin: String!
    $destination: String!
    $price: Float!
    $weight: Float!
    $goodsType: GoodsType!
    $quantity: Int!
    $originCountryId: String!
    $destinationCountryId: String!
    $tripId: String!
  ) {
    createOrder(
      createOrderInput: {
        origin: $origin
        destination: $destination
        price: $price
        weight: $weight
        goodsType: $goodsType
        quantity: $quantity
        originCountryId: $originCountryId
        destinationCountryId: $destinationCountryId
        tripId: $tripId
      }
    ) {
      _id
      origin
      destination
      originCountry {
        _id
        name
        country_code
      }
      destinationCountry {
        _id
        name
        country_code
      }
      price
      weight
      quantity
      goodsType
      created_at
    }
  }
`;

export const MUTATION_UPDATE_ORDER = gql`
  mutation UpdateOrder(
    $id: String!
    $origin: String!
    $destination: String!
    $price: Float!
    $weight: Float!
    $goodsType: GoodsType!
    $quantity: Int!
    $originCountryId: String!
    $destinationCountryId: String!
    $tripId: String!
  ) {
    updateOrder(
      updateOrderInput: {
        id: $id
        origin: $origin
        destination: $destination
        price: $price
        weight: $weight
        goodsType: $goodsType
        quantity: $quantity
        originCountryId: $originCountryId
        destinationCountryId: $destinationCountryId
        tripId: $tripId
      }
    ) {
      _id
      origin
      destination
      price
      weight
      goodsType
      quantity
      originCountry {
        _id
        name
        country_code
      }
      destinationCountry {
        _id
        name
        country_code
      }
    }
  }
`;

export const MUTATION_DELETE_ORDER = gql`
  mutation RemoveOrder($id: String!) {
    removeOrder(id: $id)
  }
`;

export const QUERY_GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      _id
      plates
      vehicleType
      width
      length
      height
      country {
        name
        country_code
      }
    }
  }
`;

export const QUERY_GET_VEHICLE = gql`
  query GetVehicle($id: String!) {
    vehicle(id: $id) {
      _id
      plates
      vehicleType
      length
      width
      height
      country {
        _id
        name
        country_code
      }
    }
  }
`;

export const MUTATION_CREATE_VEHICLE = gql`
  mutation CreteVehicle(
    $plates: String!
    $vehicleType: VehicleType!
    $width: Float!
    $length: Float!
    $height: Float!
    $countryId: String!
  ) {
    createVehicle(
      createVehicleInput: {
        plates: $plates
        vehicleType: $vehicleType
        width: $width
        length: $length
        height: $height
        countryId: $countryId
      }
    ) {
      _id
      plates
      vehicleType
      width
      length
      height
      country {
        _id
        name
        country_code
      }
    }
  }
`;

export const MUTATION_UPDATE_VEHICLE = gql`
  mutation UpdateVehicle(
    $id: String!
    $plates: String!
    $vehicleType: VehicleType!
    $width: Float!
    $length: Float!
    $height: Float!
    $countryId: String!
  ) {
    updateVehicle(
      updateVehicleInput: {
        id: $id
        plates: $plates
        vehicleType: $vehicleType
        width: $width
        length: $length
        height: $height
        countryId: $countryId
      }
    ) {
      _id
      plates
      vehicleType
      width
      length
      height
      country {
        _id
        name
        country_code
      }
    }
  }
`;

export const MUTATION_DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: String!) {
    removeVehicle(id: $id)
  }
`;

export const QUERY_GET_EVENTS = gql`
  query GetEvents {
    events {
      _id
      name
      description
      created_at
      updated_at
    }
  }
`;

export const QUERY_GET_EVENT = gql`
  query GetEvent($id: String!) {
    event(id: $id) {
      _id
      name
      description
    }
  }
`;

export const MUTATION_CREATE_EVENT = gql`
  mutation CreateEvent($name: String!, $description: String) {
    createEvent(createEventInput: { name: $name, description: $description }) {
      _id
      name
      description
      updated_at
      created_at
    }
  }
`;

export const MUTATION_UPDATE_EVENT = gql`
  mutation UpdateEvent($id: String!, $name: String!, $description: String) {
    updateEvent(
      updateEventInput: { id: $id, name: $name, description: $description }
    ) {
      _id
      name
      description
      updated_at
    }
  }
`;

export const MUTATION_ADD_EVENT_LOG = gql`
  mutation CreateLog(
    $tripId: String!
    $eventId: String!
    $description: String
  ) {
    createLog(
      createLogInput: {
        tripId: $tripId
        eventId: $eventId
        description: $description
      }
    ) {
      _id
      event {
        _id
        name
        description
      }
      description
      created_at
    }
  }
`;

export const QUERY_GET_ACTIVE_TRIPS = gql`
  query GetTripsEvent {
    active_trips {
      _id
      firstOrderOrigin
      lastOrderDestination
      active
      lastEvent {
        _id
        event {
          _id
          name
          description
        }
        description
        created_at
      }
      vehicle {
        plates
      }
    }
  }
`;
