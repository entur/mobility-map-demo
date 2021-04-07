import { PricingPlan } from "./pricingPlan";
import { System } from "./system";

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

export type RentalUris = {
  android: string;
  ios: string;
  web: string;
};
