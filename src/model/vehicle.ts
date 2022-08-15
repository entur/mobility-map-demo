import { PricingPlan } from "./pricingPlan";
import { System } from "./system";
import { TranslatedString } from "./translatedString";

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
  name: TranslatedString;
};

export enum FormFactor {
  BICYCLE = "BICYCLE",
  CARGO_BICYCLE = "CARGO_BICYCLE",
  CAR = "CAR",
  MOPED = "MOPED",
  SCOOTER = "SCOOTER",
  SCOOTER_STANDING = "SCOOTER_STANDING",
  SCOOTER_SEATED = "SCOOTER_SEATED",
  OTHER = "OTHER",
}

export enum PropulsionType {
  HUMAN = "HUMAN",
  ELECTRIC_ASSIST = "ELECTRIC_ASSIST",
  ELECTRIC = "ELECTRIC_ASSIST",
  COMBUSTION = "ELECTRIC_ASSIST",
  COMBUSTION_DIESEL = "COMBUSTION_DIESEL",
  HYBRID = "HYBRID",
  PLUG_IN_HYBRID = "PLUG_IN_HYBRID",
  HYDROGEN_FUEL_CELL = "HYDROGEN_FUEL_CELL",
}

export type RentalUris = {
  android: string;
  ios: string;
  web: string;
};
