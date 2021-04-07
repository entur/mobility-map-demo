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
