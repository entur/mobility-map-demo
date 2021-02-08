import { gql } from "@apollo/client";

// const VEHICLE_TYPE_FRAGMENT = gql`
//   fragment VehicleTypeFragment on VehicleType {
//     id
//     formFactor
//     propulsionType
//     maxRangeMeters
//     name
//   }
// `;

// const PRICING_SEGMENT_FRAGMENT = gql`
//   fragment PricingSegmentFragment on PricingSegment {
//     start
//     rate
//     interval
//     end
//   }
// `;

// const PRICING_PLAN_FRAGMENT = gql`
//   fragment PricingPlanFragment on PricingPlan {
//     id
//     url
//     name
//     currency
//     price
//     isTaxable
//     description
//     perKmPricing {
//       ...PricingSegmentFragment
//     }
//     perMinPricing {
//       ...PricingSegmentFragment
//     }
//     surgePricing
//   }
//   ${PRICING_SEGMENT_FRAGMENT}
// `;

const VEHICLE_FRAGMENT_BASE = gql`
  fragment VehicleFragmentBase on Vehicle {
    id
    lat
    lon
  }
`;

// const VEHICLE_FRAGMENT = gql`
//   fragment VehicleFragment on Vehicle {
//     ...VehicleFragmentBase
//     isReserved
//     isDisabled
//     currentRangeMeters
//     vehicleType {
//       ...VehicleTypeFragment
//     }
//     pricingPlan {
//       ...PricingPlanFragment
//     }
//   }
//   ${VEHICLE_FRAGMENT_BASE}
//   ${VEHICLE_TYPE_FRAGMENT}
//   ${PRICING_PLAN_FRAGMENT}
// `;

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
      ...VehicleFragmentBase
    }
  }
  ${VEHICLE_FRAGMENT_BASE}
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
