import { gql } from "@apollo/client";

const TRANSLATION_FRAGMENT = gql`
  fragment TranslationFragment on TranslatedString {
    translation {
      language
      value
    }
  }
`;

const VEHICLE_TYPE_FRAGMENT = gql`
  fragment VehicleTypeFragment on VehicleType {
    id
    formFactor
    propulsionType
    maxRangeMeters
    name {
      ...TranslationFragment
    }
  }
  ${TRANSLATION_FRAGMENT}
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
    name {
      ...TranslationFragment
    }
    currency
    price
    isTaxable
    description {
      ...TranslationFragment
    }
    perKmPricing {
      ...PricingSegmentFragment
    }
    perMinPricing {
      ...PricingSegmentFragment
    }
    surgePricing
  }
  ${PRICING_SEGMENT_FRAGMENT}
  ${TRANSLATION_FRAGMENT}
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
    name {
      ...TranslationFragment
    }
    shortName {
      ...TranslationFragment
    }
    operator {
      name {
        ...TranslationFragment
      }
      id
    }
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
  ${TRANSLATION_FRAGMENT}
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

const STATION_BASE_FRAGMENT = gql`
  fragment StationBaseFragment on Station {
    id
    lat
    lon
    numBikesAvailable
  }
`;

const STATION_FRAGMENT = gql`
  fragment StationFragment on Station {
    ...StationBaseFragment
    name {
      ...TranslationFragment
    }
    address
    capacity
    vehicleTypesAvailable {
      vehicleType {
        ...VehicleTypeFragment
      }
    }
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
  ${STATION_BASE_FRAGMENT}
  ${PRICING_PLAN_FRAGMENT}
  ${SYSTEM_FRAGMENT}
  ${TRANSLATION_FRAGMENT}
  ${VEHICLE_TYPE_FRAGMENT}
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
      ...StationBaseFragment
    }
  }
  ${STATION_BASE_FRAGMENT}
`;

export const FULL_STATIONS_QUERY = gql`
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

export const HEATMAP_QUERY = gql`
  query HeatmapQuery(
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

    stations(
      lat: $lat
      lon: $lon
      range: $range
      count: $count
      codespaces: $codespaces
      operators: $operators
    ) {
      ...StationBaseFragment
    }
  }
  ${VEHICLE_BASE_FRAGMENT}
  ${STATION_BASE_FRAGMENT}
`;

export const ICONS_QUERY = gql`
  query HeatmapQuery(
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
  ${VEHICLE_FRAGMENT}
  ${STATION_FRAGMENT}
`;

export const CODESPACES_QUERY = gql`
  query CodespacesQuery {
    codespaces
  }
`;

export const OPERATORS_QUERY = gql`
  query OperatorsQuery {
    operators {
      id
      name {
        translation {
          language
          value
        }
      }
    }
  }
`;

export const GEOFENCING_ZONES_QUERY = gql`
  query GeofencingZonesQuery {
    geofencingZones {
      systemId
      geojson {
        type
        features {
          type
          geometry {
            type
            coordinates
          }
          properties {
            name
            start
            end
            rules {
              vehicleTypeIds
              rideAllowed
              rideThroughAllowed
              maximumSpeedKph
            }
          }
        }
      }
    }
  }
`;
