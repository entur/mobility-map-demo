import { PricingPlan } from "./pricingPlan";
import { System } from "./system";
import { FormFactor, VehicleType } from "./vehicle";

export type Station = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  capacity: number;
  numBikesAvailable: number;
  numDocksAvailable: number;
  vehicleTypesAvailable: VehicleTypeAvailability[];
  isInstalled: boolean;
  isReturning: boolean;
  isRenting: boolean;
  lastReported: number;
  system: System;
  pricingPlans: PricingPlan[];
};

type VehicleTypeAvailability = {
  vehicleType: VehicleType;
};
