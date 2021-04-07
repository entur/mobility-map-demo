import { gql } from "@apollo/client";

const VEHICLE_TYPE_FRAGMENT = gql`
  fragment VehicleTypeFragment on VehicleType {
    id
    formFactor
    propulsionType
    maxRangeMeters
    name
  }
`;

const PRICING_SEGMENT_FRAGMENT = gql`
  fragment PricingSegmentFragment on PricingSegment {
    start
    rate
    interval
    end
  }
`;

const PRICING_PLAN_FRAGMENT = gql`
  fragment PricingPlanFragment on PricingPlan {
    id
    url
    name
    currency
    price
    isTaxable
    description
    perKmPricing {
      ...PricingSegmentFragment
    }
    perMinPricing {
      ...PricingSegmentFragment
    }
    surgePricing
  }
  ${PRICING_SEGMENT_FRAGMENT}
`;

const RENTAL_URIS_FRAGMENT = gql`
  fragment RentalUrisFragment on RentalUris {
    android
    ios
    web
  }
`;

const RENTAL_APP_FRAGMENT = gql`
  fragment RentalAppFragment on RentalApp {
    storeUri
    discoveryUri
  }
`;

const RENTAL_APPS_FRAGMENT = gql`
  fragment RentalAppsFragment on RentalApps {
    ios {
      ...RentalAppFragment
    }
    android {
      ...RentalAppFragment
    }
  }
  ${RENTAL_APP_FRAGMENT}
`;

const SYSTEM_FRAGMENT = gql`
  fragment SystemFragment on System {
    id
    language
    name
    shortName
    operator
    url
    purchaseUrl
    startDate
    phoneNumber
    email
    feedContactEmail
    timezone
    licenseUrl
    rentalApps {
      ...RentalAppsFragment
    }
  }
  ${RENTAL_APPS_FRAGMENT}
`;

const VEHICLE_BASE_FRAGMENT = gql`
  fragment VehicleBaseFragment on Vehicle {
    id
    lat
    lon
  }
`;

const VEHICLE_FRAGMENT = gql`
  fragment VehicleFragment on Vehicle {
    ...VehicleBaseFragment
    isReserved
    isDisabled
    currentRangeMeters
    vehicleType {
      ...VehicleTypeFragment
    }
    pricingPlan {
      ...PricingPlanFragment
    }
    rentalUris {
      ...RentalUrisFragment
    }
    system {
      ...SystemFragment
    }
  }
  ${VEHICLE_BASE_FRAGMENT}
  ${VEHICLE_TYPE_FRAGMENT}
  ${PRICING_PLAN_FRAGMENT}
  ${RENTAL_URIS_FRAGMENT}
  ${SYSTEM_FRAGMENT}
`;

const STATION_FRAGMENT = gql`
  fragment StationFragment on Station {
    id
    name
    lat
    lon
    address
    capacity
    numBikesAvailable
    numDocksAvailable
    isInstalled
    isRenting
    isReturning
    lastReported
    system {
      ...SystemFragment
    }
    pricingPlans {
      ...PricingPlanFragment
    }
  }
  ${PRICING_PLAN_FRAGMENT}
  ${SYSTEM_FRAGMENT}
`;

export const STATIONS_QUERY = gql`
  query StationsQuery(
    $lat: Float!
    $lon: Float!
    $range: Int!
    $count: Int
    $codespaces: [String]
    $operators: [String]
  ) {
    stations(
      lat: $lat
      lon: $lon
      range: $range
      count: $count
      codespaces: $codespaces
      operators: $operators
    ) {
      ...StationFragment
    }
  }
  ${STATION_FRAGMENT}
`;

export const VEHICLES_QUERY = gql`
  query VehiclesQuery(
    $lat: Float!
    $lon: Float!
    $range: Int!
    $count: Int
    $codespaces: [String]
    $operators: [String]
    $formFactors: [FormFactor]
    $propulsionTypes: [PropulsionType]
    $includeReserved: Boolean
    $includeDisabled: Boolean
  ) {
    vehicles(
      lat: $lat
      lon: $lon
      range: $range
      count: $count
      codespaces: $codespaces
      operators: $operators
      formFactors: $formFactors
      propulsionTypes: $propulsionTypes
      includeReserved: $includeReserved
      includeDisabled: $includeDisabled
    ) {
      ...VehicleBaseFragment
    }
  }
  ${VEHICLE_BASE_FRAGMENT}
`;

export const FULL_VEHICLES_QUERY = gql`
  query VehiclesQuery(
    $lat: Float!
    $lon: Float!
    $range: Int!
    $count: Int
    $codespaces: [String]
    $operators: [String]
    $formFactors: [FormFactor]
    $propulsionTypes: [PropulsionType]
    $includeReserved: Boolean
    $includeDisabled: Boolean
  ) {
    vehicles(
      lat: $lat
      lon: $lon
      range: $range
      count: $count
      codespaces: $codespaces
      operators: $operators
      formFactors: $formFactors
      propulsionTypes: $propulsionTypes
      includeReserved: $includeReserved
      includeDisabled: $includeDisabled
    ) {
      ...VehicleFragment
    }
  }
  ${VEHICLE_FRAGMENT}
`;

export const CODESPACES_QUERY = gql`
  query CodespacesQuery {
    codespaces
  }
`;

export const OPERATORS_QUERY = gql`
  query OperatorsQuery {
    operators {
      name
      codespace
    }
  }
`;
