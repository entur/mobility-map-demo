import { gql } from "@apollo/client";

const VEHICLE_TYPE_FRAGMENT = gql`
  fragment VehicleTypeFragment on VehicleType {
    formFactor
  }
`;

const VEHICLE_FRAGMENT = gql`
  fragment VehicleFragment on Vehicle {
    id
    lat
    lon
    vehicleType {
      ...VehicleTypeFragment
    }
  }
  ${VEHICLE_TYPE_FRAGMENT}
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
