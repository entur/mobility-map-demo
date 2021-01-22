export type Vehicle = {
  id: string;
  lat: number;
  lon: number;
  isReserved: boolean;
  isDisabled: boolean;
  currentRangeMeters: number;
  vehicleType: VehicleType;
  pricingPlan: PricingPlan;
};

export type VehicleType = {
  id: string;
  formFactor: FormFactor;
  propulsionType: PropulsionType;
  maxRangeMeters: number;
  name: string;
};

export enum FormFactor {
  BICYCLE,
  CAR,
  MOPED,
  SCOOTER,
  OTHER,
}

export enum PropulsionType {
  HUMAN,
  ELECTRIC_ASSIST,
  ELECTRIC,
  COMBUSTION,
}

export type PricingPlan = {
  id: string;
  url: string;
  name: string;
  currency: string;
  price: number;
  isTaxable: boolean;
  description: string;
  perKmPricing: [PricingSegment];
  perMinPricing: [PricingSegment];
  surgePricing: boolean;
};

export type PricingSegment = {
  start: number;
  rate: number;
  interval: number;
  end: number;
};
