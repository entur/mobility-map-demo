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

const VEHICLE_FRAGMENT = gql`
  fragment VehicleFragment on Vehicle {
    id
    lat
    lon
    isReserved
    isDisabled
    currentRangeMeters
    vehicleType {
      ...VehicleTypeFragment
    }
    pricingPlan {
      ...PricingPlanFragment
    }
  }
  ${VEHICLE_TYPE_FRAGMENT}
  ${PRICING_PLAN_FRAGMENT}
`;

export const VEHICLES_QUERY = gql`
  query VehiclesQuery($lat: Float!, $lon: Float!, $range: Int!, $count: Int) {
    vehicles(lat: $lat, lon: $lon, range: $range, count: $count) {
      ...VehicleFragment
    }
  }
  ${VEHICLE_FRAGMENT}
`;
