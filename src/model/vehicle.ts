export type Vehicle = {
  id: string;
  lat: number;
  lon: number;
  isReserved: boolean;
  isDisabled: boolean;
  currentRangeMeters: number;
  vehicleType: VehicleType;
  pricingPlan: PricingPlan;
  rentalUris: RentalUris;
  system: System;
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

export type RentalUris = {
  android: string;
  ios: string;
  web: string;
};

export type System = {
  id: string;
  language: string;
  name: string;
  shortName: string;
  operator: string;
  url: string;
  purchaseUrl: string;
  startDate: string;
  phoneNumber: string;
  email: string;
  feedContactEmail: string;
  timezone: string;
  licenseUrl: string;
  rentalApps: RentalApps;
};

export type RentalApps = {
  ios: RentalApp;
  android: RentalApp;
};

export type RentalApp = {
  storeUri: string;
  discoveryUri: string;
};
