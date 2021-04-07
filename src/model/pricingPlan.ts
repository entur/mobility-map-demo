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
