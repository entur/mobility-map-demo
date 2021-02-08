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
  BICYCLE = "BICYCLE",
  CAR = "CAR",
  MOPED = "MOPED",
  SCOOTER = "SCOOTER",
  OTHER = "OTHER",
}

export enum PropulsionType {
  HUMAN = "HUMAN",
  ELECTRIC_ASSIST = "ELECTRIC_ASSIST",
  ELECTRIC = "ELECTRIC_ASSIST",
  COMBUSTION = "ELECTRIC_ASSIST",
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
