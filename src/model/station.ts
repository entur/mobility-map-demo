import { PricingPlan } from "./pricingPlan";
import { System } from "./system";

export type Station = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  capacity: number;
  numBikesAvailable: number;
  numDocksAvailable: number;
  isInstalled: boolean;
  isReturning: boolean;
  isRenting: boolean;
  lastReported: number;
  system: System;
  pricingPlans: PricingPlan[];
};
