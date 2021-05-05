import { TranslatedString } from "./translatedString";

export type PricingPlan = {
  id: string;
  url: string;
  name: TranslatedString;
  currency: string;
  price: number;
  isTaxable: boolean;
  description: TranslatedString;
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
